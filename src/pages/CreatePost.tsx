const handleSmartPostSubmit = async (formData: Record<string, any>) => {
  if (!currentUser) {
    toast.error("You must be logged in to create a post");
    return;
  }

  setIsSubmitting(true);
  try {
    let mediaUrl = null;

    // Handle image or video upload if present
    if (formData.media instanceof File) {
      const file = formData.media;
      const isImage = file.type.startsWith("image/");

      console.log("Uploading file:", file.name, "Type:", file.type);

      const uploadFile = isImage
        ? await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          })
        : file;

      const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${uploadFile.name}`);
      await uploadBytes(fileRef, uploadFile);

      console.log("Upload complete, fetching download URL...");
      mediaUrl = await getDownloadURL(fileRef);
      console.log("Download URL:", mediaUrl);
    }

    // Create post document
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

    toast.success("Post created successfully!");
    navigate("/feed");
  } catch (error: any) {
    console.error("❌ Error creating post:", error.message);
    toast.error("Failed to create post. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
