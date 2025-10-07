// src/pages/CreatePost.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import { auth, db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import imageCompression from "browser-image-compression";
import { PostTypeSelector } from "@/components/PostTypeSelector";
import { SmartPostCreator, PostType } from "@/components/SmartPostCreator";

const CreatePost: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [currentUser, navigate, toast]);

  /**
   * Handles submission from SmartPostCreator.
   * formData may include: image (File), video (File), other fields, and postType
   */
  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Decide which media file is present (image first, then video)
      const hasImage = formData.image instanceof File;
      const hasVideo = formData.video instanceof File;
      let mediaUrl: string | null = null;
      let mediaType: "image" | "video" | null = null;

      // If there's an image file, compress then upload
      if (hasImage) {
        mediaType = "image";
        // compress image
        const compressedImage = await imageCompression(formData.image as File, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }).catch(() => formData.image as File);

        const file = compressedImage as File;
        const path = `posts/${user.uid}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        mediaUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (err) => {
              console.error("Upload error:", err);
              reject(err);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      } else if (hasVideo) {
        // Upload video as-is
        mediaType = "video";
        const file = formData.video as File;
        const path = `posts/${user.uid}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        mediaUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (err) => {
              console.error("Upload error:", err);
              reject(err);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      // Create plain structured text from remaining fields
      const structuredContent = Object.entries(formData)
        .filter(([key]) => key !== "image" && key !== "video" && key !== "postType")
        .map(([key, value]) => {
          // If value is a File or object, stringify minimal info
          if (value instanceof File) return `**${key}**: [file:${value.name}]`;
          if (typeof value === "object") return `**${key}**: ${JSON.stringify(value)}`;
          return `**${key}**: ${value}`;
        })
        .join("\n\n");

      // Post document
      const postDoc = {
        userId: user.uid,
        author: user.email || "Anonymous",
        text: structuredContent,
        mediaUrl,
        mediaType,
        postType: formData.postType || selectedPostType || "general",
        metadata: formData,
        likes: 0,
        shares: 0,
        comments: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "posts"), postDoc);

      toast({
        title: "Post created!",
        description: "Your post has been shared with your tribe",
      });

      // reset
      setSelectedPostType(null);
      navigate("/feed");
    } catch (err: any) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        {!selectedPostType ? (
          <PostTypeSelector onSelect={setSelectedPostType} />
        ) : (
          <Card className="p-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPostType(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post Types
            </Button>

            <SmartPostCreator
              type={selectedPostType}
              onSubmit={handleSmartPostSubmit}
              onCancel={() => setSelectedPostType(null)}
            />

            {loading && uploadProgress > 0 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : "Processing..."}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CreatePost;
