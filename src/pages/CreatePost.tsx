import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PostTypeSelector } from "@/components/PostTypeSelector";
import { SmartPostCreator, PostType } from "@/components/SmartPostCreator";
import imageCompression from "browser-image-compression";

const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a post");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // Handle image upload if present
      if (formData.image instanceof File) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(formData.image, options);
        const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${compressedFile.name}`);
        await uploadBytes(imageRef, compressedFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create post document
      const { image, ...restFormData } = formData;
      const postData = {
        ...restFormData,
        imageUrl,
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
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto p-4">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-6">
          {!selectedType ? (
            <PostTypeSelector onSelect={setSelectedType} />
          ) : (
            <SmartPostCreator
              type={selectedType}
              onSubmit={handleSmartPostSubmit}
              onCancel={() => setSelectedType(null)}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default CreatePost;
