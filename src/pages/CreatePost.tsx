const handleSmartPostSubmit = async (formData: Record<string, any>) => {
  console.log("🟢 Submit triggered with:", formData);

  if (!currentUser) {
    toast.error("You must be logged in to create a post");
    navigate("/login");
    return;
  }

  // Check network connection
  if (!navigator.onLine) {
    toast.error("No internet connection. Please check your network.");
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    let mediaUrl = null;

    // Handle media upload if present
    if (formData.media instanceof File) {
      mediaUrl = await handleMediaUpload(formData.media, currentUser.uid);
    }

    // Create and submit post data
    await submitPostData(formData, mediaUrl, currentUser);

    toast.success("✅ Post created successfully!");
    navigate("/feed");
  } catch (error: any) {
    console.error("❌ Error creating post:", error);
    toast.error(`Failed to create post: ${error.message || "Unknown error"}`);
  } finally {
    setIsSubmitting(false);
    setUploadProgress(null);
  }
};

// Separate media upload handler with optimizations
const handleMediaUpload = async (file: File, userId: string): Promise<string> => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB for images after compression

  // Validate file size before processing
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  let uploadFile = file;
  const isImage = file.type.startsWith("image/");

  // Only compress images that are larger than 1MB
  if (isImage && file.size > 1024 * 1024) {
    console.log("📐 Compressing image...");

    // Use more aggressive compression for faster processing
    uploadFile = await imageCompression(file, {
      maxSizeMB: 0.8, // Reduced from 1MB for faster compression
      maxWidthOrHeight: 1200, // Reduced from 1920 for faster processing
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.7, // Lower quality for faster compression
    });

    console.log(`✅ Image compressed: ${file.size} → ${uploadFile.size} bytes`);
  }

  const timestamp = Date.now();
  const fileExtension = uploadFile.name.split(".").pop();
  const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const fileRef = ref(storage, `posts/${userId}/${fileName}`);

  console.log("📤 Uploading to Firebase Storage...");

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, uploadFile);
    let uploadTimeout: NodeJS.Timeout;

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));

        // Reset timeout on progress
        clearTimeout(uploadTimeout);
        uploadTimeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error("Upload timeout - taking too long"));
        }, 30000); // 30 second timeout
      },
      (error) => {
        clearTimeout(uploadTimeout);
        console.error("❌ Upload error:", error);

        // Provide more specific error messages
        if (error.code === "storage/retry-limit-exceeded") {
          reject(new Error("Upload failed after multiple retries. Check your connection."));
        } else if (error.code === "storage/canceled") {
          reject(new Error("Upload was canceled due to timeout"));
        } else {
          reject(new Error(`Upload failed: ${error.message}`));
        }
      },
      async () => {
        clearTimeout(uploadTimeout);
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ Upload complete! URL:", url);
          resolve(url);
        } catch (error) {
          reject(new Error("Failed to get download URL"));
        }
      },
    );
  });
};

// Separate post submission handler
const submitPostData = async (formData: Record<string, any>, mediaUrl: string | null, currentUser: any) => {
  const { media, ...restFormData } = formData;

  const postData = {
    ...restFormData,
    mediaUrl,
    userId: currentUser.uid,
    userName: currentUser.displayName || "Anonymous",
    userAvatar: currentUser.photoURL || "",
    timestamp: serverTimestamp(),
    likes: 0,
    comments: [],
    // Add client timestamp for local sorting while waiting for server
    clientTimestamp: new Date().toISOString(),
  };

  console.log("🗃 Writing Firestore document...");

  // Add retry logic for Firestore write
  let retries = 3;
  let lastError: Error;

  while (retries > 0) {
    try {
      await addDoc(collection(db, "posts"), postData);
      console.log("✅ Firestore write successful");
      return;
    } catch (error) {
      lastError = error as Error;
      retries--;
      console.warn(`Firestore write failed, ${retries} retries left`);

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (4 - retries))); // Exponential backoff
      }
    }
  }

  throw lastError!;
};
