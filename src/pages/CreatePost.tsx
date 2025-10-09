import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../config/firebase"; // Adjust path to your firebase config
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase"; // Adjust path to your firebase config
import imageCompression from "browser-image-compression";

const CreatePost = () => {
  const navigate = useNavigate();
  const [currentUser] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
    console.log("⚡ Ultra-fast post starting...");

    if (!currentUser) {
      toast.error("Please log in to post");
      navigate("/login");
      return;
    }

    // Quick file validation
    if (formData.media instanceof File) {
      if (formData.media.size > 3 * 1024 * 1024) {
        toast.error("File must be smaller than 3MB for quick posting");
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(formData.media.type)) {
        toast.error("Please use JPEG, PNG, GIF, or WebP images only");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let mediaUrl = null;

      // Skip compression for maximum speed
      if (formData.media instanceof File) {
        console.log("📤 Quick uploading without compression...");
        const fileRef = ref(storage, `posts/${currentUser.uid}/quick_${Date.now()}_${formData.media.name}`);
        const snapshot = await uploadBytes(fileRef, formData.media);
        mediaUrl = await getDownloadURL(snapshot.ref);
        console.log("✅ Quick upload complete!");
      }

      // Immediate Firestore write
      const postData = {
        ...formData,
        media: undefined, // Remove the file object
        mediaUrl,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userAvatar: currentUser.photoURL || "",
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
      };

      console.log("📝 Quick Firestore write...");
      await addDoc(collection(db, "posts"), postData);

      toast.success("✅ Posted instantly!");
      setTimeout(() => navigate("/feed"), 300);
    } catch (error: any) {
      console.error("❌ Quick post failed:", error);

      if (error.message.includes("File too large")) {
        toast.error("File too large. Please use a file smaller than 3MB.");
      } else {
        toast.error("Post failed. Try again with a smaller file.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Example form handler - replace with your actual form logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your form data collection logic here
    const formData = {
      content: "Your post content", // Replace with actual form data
      media: null as File | null, // Replace with actual file
    };

    await handleSmartPostSubmit(formData);
  };

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        {/* Your form JSX here */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </button>
        {uploadProgress !== null && <div>Upload Progress: {uploadProgress}%</div>}
      </form>
    </div>
  );
};

export default CreatePost; // This fixes the default export error
