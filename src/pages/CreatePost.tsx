const handleSmartPostSubmit = async (formData: Record<string, any>) => {
  console.log("🚀 Smart post starting...");

  if (!currentUser) {
    toast.error("Please log in to post");
    navigate("/login");
    return;
  }

  // Enhanced file validation
  if (formData.media instanceof File) {
    const validation = validateFile(formData.media);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    // Use ultra-fast for small files, compressed for larger ones
    if (formData.media.size <= 1 * 1024 * 1024) {
      // 1MB threshold
      console.log("⚡ Using ultra-fast upload for small file");
      return await handleUltraFastPost(formData);
    } else {
      console.log("📐 Using compressed upload for larger file");
      return await handleCompressedPost(formData);
    }
  } else {
    // No media - ultra fast text post
    return await handleUltraFastPost(formData);
  }
};

// Ultra-fast for small files or text posts
const handleUltraFastPost = async (formData: Record<string, any>) => {
  setIsSubmitting(true);

  try {
    let mediaUrl = null;

    if (formData.media instanceof File) {
      const fileRef = ref(storage, `posts/${currentUser.uid}/quick_${Date.now()}_${formData.media.name}`);
      const snapshot = await uploadBytes(fileRef, formData.media);
      mediaUrl = await getDownloadURL(snapshot.ref);
    }

    const postData = {
      ...formData,
      media: undefined,
      mediaUrl,
      userId: currentUser.uid,
      userName: currentUser.displayName || "Anonymous",
      userAvatar: currentUser.photoURL || "",
      timestamp: serverTimestamp(),
      likes: 0,
      comments: [],
    };

    await addDoc(collection(db, "posts"), postData);
    toast.success("✅ Posted!");
    setTimeout(() => navigate("/feed"), 300);
  } catch (error: any) {
    console.error("❌ Post failed:", error);
    toast.error("Post failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

// Compressed version for larger files
const handleCompressedPost = async (formData: Record<string, any>) => {
  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    let mediaUrl = null;

    if (formData.media instanceof File) {
      console.log("📐 Compressing image...");
      const compressedFile = await imageCompression(formData.media, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const fileRef = ref(storage, `posts/${currentUser.uid}/compressed_${Date.now()}_${formData.media.name}`);
      const uploadTask = uploadBytesResumable(fileRef, compressedFile);

      mediaUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          },
        );
      });
    }

    const postData = {
      ...formData,
      media: undefined,
      mediaUrl,
      userId: currentUser.uid,
      userName: currentUser.displayName || "Anonymous",
      userAvatar: currentUser.photoURL || "",
      timestamp: serverTimestamp(),
      likes: 0,
      comments: [],
    };

    await addDoc(collection(db, "posts"), postData);
    toast.success("✅ Posted!");
    setTimeout(() => navigate("/feed"), 500);
  } catch (error: any) {
    console.error("❌ Post failed:", error);
    toast.error("Post failed. Please try again.");
  } finally {
    setIsSubmitting(false);
    setUploadProgress(null);
  }
};

// Validation function
const validateFile = (file: File): { valid: boolean; message?: string } => {
  const MAX_SIZE = 8 * 1024 * 1024; // 8MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      message: `File must be smaller than 8MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Please use JPEG, PNG, GIF, or WebP images only.",
    };
  }

  return { valid: true };
};
