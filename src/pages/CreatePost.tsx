import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { SmartPostCreator, PostType } from "@/components/SmartPostCreator";
import { PostTypeSelector } from "@/components/PostTypeSelector";
import { Layout } from "@/components/layout/Layout";

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
          },
          async () => {
            mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(100);
          },
        );

        // Wait until upload completes
        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, resolve);
        });
      }

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
      console.log("✅ Post saved to Firestore:", postData);

      navigate("/feed");
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      toast.error(`Failed to create post: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        {!selectedPostType ? (
          <PostTypeSelector onSelect={setSelectedPostType} />
        ) : (
          <SmartPostCreator
            type={selectedPostType}
            onSubmit={handleSmartPostSubmit}
            onCancel={() => {
              setSelectedPostType(null);
              navigate("/feed");
            }}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Upload progress bar */}
        {uploadProgress !== null && (
          <div className="w-full bg-gray-200 h-2 mt-4 rounded">
            <div
              className="bg-green-600 h-2 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Button feedback */}
        {isSubmitting && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            {uploadProgress && uploadProgress < 100
              ? `Uploading... ${Math.round(uploadProgress)}%`
              : "Finalizing post..."}
          </p>
        )}
      </div>
    </Layout>
  );
}
