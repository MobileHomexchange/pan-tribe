import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../lib/firebase";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { PostTypeSelector } from "../components/PostTypeSelector";
import { SmartPostCreator, PostType } from "../components/SmartPostCreator";
import { Layout } from "../components/layout/Layout";

const CreatePost = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<PostType | null>(null);

  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
  console.log("🚀 Starting post submission...", formData);

  if (!currentUser) {
    toast.error("You must be logged in to create a post");
    navigate("/login");
    return;
  }

  // Quick network check
  if (!navigator.onLine) {
    toast.error("No internet connection. Please check your network.");
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    let mediaUrl = null;

    // Handle media upload with better progress tracking
    if (formData.media instanceof File) {
      mediaUrl = await uploadWithProgress(formData.media, currentUser.uid);
    }

    // Quick Firestore write
    await createPostDocument(formData, mediaUrl, currentUser);

    toast.success("✅ Post created successfully!");
    console.log("🎉 Post creation complete!");

    // Small delay for better UX
    setTimeout(() => navigate("/feed"), 500);
  } catch (error: any) {
    console.error("❌ Post creation failed:", error);
    toast.error(`Failed to create post: ${error.message || "Please try again"}`);
  } finally {
    setIsSubmitting(false);
    setUploadProgress(null);
  }
};

// Fast upload with reliable progress tracking
const uploadWithProgress = async (file: File, userId: string): Promise<string> => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const UPLOAD_TIMEOUT = 45000; // 45 seconds

  // Validate file quickly
  if (file.size > MAX_SIZE) {
    throw new Error(`File must be smaller than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
  }

  let processedFile = file;
  const isImage = file.type.startsWith("image/");

  // Smart compression - only compress images over 500KB
  if (isImage && file.size > 500 * 1024) {
    try {
      console.log("📐 Smart compressing image...");
      processedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024, // Smaller for faster processing
        useWebWorker: true,
        initialQuality: 0.6,
        alwaysKeepResolution: false,
      });
      console.log(
        `✅ Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
      );
    } catch (compressError) {
      console.warn("⚠️ Compression failed, using original file:", compressError);
      processedFile = file; // Fallback to original
    }
  }

  // Create unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  const fileExtension = processedFile.name.split(".").pop() || "file";
  const fileName = `post_${timestamp}_${randomId}.${fileExtension}`;

  const fileRef = ref(storage, `posts/${userId}/${fileName}`);
  console.log("📤 Starting upload...");

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, processedFile);
    let uploadTimeout: NodeJS.Timeout;

    // Set timeout to prevent hanging
    uploadTimeout = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("Upload timeout - taking too long. Please try again."));
    }, UPLOAD_TIMEOUT);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Clear timeout on progress
        clearTimeout(uploadTimeout);

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundedProgress = Math.max(1, Math.round(progress)); // Ensure at least 1% shows

        console.log(`📊 Upload progress: ${roundedProgress}%`);
        setUploadProgress(roundedProgress);

        // Reset timeout on any progress
        uploadTimeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error("Upload stalled. Please check your connection."));
        }, UPLOAD_TIMEOUT);
      },
      (error) => {
        clearTimeout(uploadTimeout);
        console.error("❌ Upload error:", error);

        // Better error messages
        let errorMessage = "Upload failed. ";
        switch (error.code) {
          case "storage/unauthorized":
            errorMessage += "You don't have permission to upload.";
            break;
          case "storage/canceled":
            errorMessage += "Upload was canceled.";
            break;
          case "storage/unknown":
            errorMessage += "Unknown error occurred. Check your connection.";
            break;
          default:
            errorMessage += "Please try again.";
        }

        reject(new Error(errorMessage));
      },
      async () => {
        clearTimeout(uploadTimeout);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ Upload completed! URL:", downloadURL);
          setUploadProgress(100);
          resolve(downloadURL);
        } catch (urlError) {
          reject(new Error("Failed to get file URL after upload."));
        }
      },
    );
  });
};

// Fast document creation
const createPostDocument = async (formData: Record<string, any>, mediaUrl: string | null, user: any) => {
  const { media, ...postContent } = formData;

  const postData = {
    ...postContent,
    mediaUrl,
    userId: user.uid,
    userName: user.displayName || "Anonymous",
    userAvatar: user.photoURL || "",
    timestamp: serverTimestamp(),
    likes: 0,
    comments: [],
    clientTimestamp: new Date().toISOString(), // For immediate UI update
  };

  console.log("📝 Creating post document...");

  try {
    await addDoc(collection(db, "posts"), postData);
    console.log("✅ Post document created!");
  } catch (error) {
    console.error("❌ Firestore error:", error);
    throw new Error("Failed to save post. Please try again.");
  }
};

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        {!selectedType ? (
          <PostTypeSelector onSelect={(type) => setSelectedType(type)} />
        ) : (
          <SmartPostCreator
            type={selectedType}
            onSubmit={handleSmartPostSubmit}
            onCancel={() => setSelectedType(null)}
          />
        )}
        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Uploading: {uploadProgress}%
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreatePost;
