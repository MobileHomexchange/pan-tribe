const handleSmartPostSubmit = async (formData: Record<string, any>) => {
  console.log("🟢 Submit triggered with:", formData);

  if (!currentUser) {
    toast.error("You must be logged in to create a post");
    navigate("/login");
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    let mediaUrl = null;

    if (formData.media instanceof File) {
      const file = formData.media;
      const isImage = file.type.startsWith("image/");

      const uploadFile = isImage
        ? await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        : file;

      const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${uploadFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, uploadFile);

      console.log("📤 Uploading to Firebase Storage...");

      // Wrap upload completion in a clean Promise
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("❌ Upload error:", error);
            toast.error("Upload failed. Please try again.");
            setIsSubmitting(false);
            reject(error);
          },
          async () => {
            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("✅ Upload complete! URL:", mediaUrl);
            resolve();
          },
        );
      });
    }

    console.log("🗃 Writing Firestore document...");
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
    };

    await addDoc(collection(db, "posts"), postData);
    toast.success("✅ Post created successfully!");
    console.log("✅ Firestore write successful:", postData);

    navigate("/feed");
  } catch (error: any) {
    console.error("❌ Error creating post:", error);
    toast.error(`Failed to create post: ${error.message || "Unknown error"}`);
  } finally {
    setIsSubmitting(false);
    setUploadProgress(null);
  }
};
