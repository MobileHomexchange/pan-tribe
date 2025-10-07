import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { SmartPostCreator, PostType } from "@/components/SmartPostCreator";
import { PostTypeSelector } from "@/components/PostTypeSelector";

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a post");
      return;
    }

    setIsSubmitting(true);
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
        await uploadBytes(fileRef, uploadFile);
        mediaUrl = await getDownloadURL(fileRef);
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

      toast.success("Post created successfully!");
      navigate("/feed");
    } catch (error: any) {
      console.error("❌ Error creating post:", error.message);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!selectedPostType ? (
        <PostTypeSelector onSelect={setSelectedPostType} />
      ) : (
        <SmartPostCreator
          type={selectedPostType}
          onSubmit={handleSmartPostSubmit}
          onCancel={() => setSelectedPostType(null)}
        />
      )}
    </div>
  );
}
