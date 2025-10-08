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

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<PostType>("general");
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

        console.log("📤 Uploading to Firebase Storage...");

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Create Post</h1>
        
        <PostTypeSelector
          onSelect={setSelectedType}
        />

        <div className="bg-card rounded-lg shadow-lg p-6">
          <SmartPostCreator
            type={selectedType}
            onSubmit={handleSmartPostSubmit}
            onCancel={() => navigate("/feed")}
          />
        </div>

        {uploadProgress !== null && (
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Uploading: {Math.round(uploadProgress)}%
            </p>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
