// src/pages/CreatePost.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import imageCompression from 'browser-image-compression';
import { PostTypeSelector } from '@/components/PostTypeSelector';
import { SmartPostCreator, PostType } from '@/components/SmartPostCreator';
import { Card } from '@/components/ui/card';

const CreatePost: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPostType, setSelectedPostType] = useState<PostType | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);

  const handleSmartPostSubmit = async (formData: Record<string, any>) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      await user.getIdToken(true);
      let imageUrl: string | null = null;

      // Handle image upload
      if (formData.image && formData.image instanceof File) {
        const compressedImage = await imageCompression(formData.image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${formData.image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, compressedImage);

        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      // Convert form data to structured text
      const structuredContent = Object.entries(formData)
        .filter(([key]) => key !== 'image' && key !== 'postType')
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n\n');

      // Save to Firestore
      const postData = {
        userId: user.uid,
        author: user.email || 'Anonymous',
        text: structuredContent,
        imageUrl,
        postType: formData.postType,
        metadata: formData,
        likes: 0,
        shares: 0,
        comments: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'posts'), postData);

      toast({
        title: "Post created!",
        description: "Your post has been shared with your tribe",
      });

      setSelectedPostType(null);
      navigate('/feed');
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
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
                  {uploadProgress < 100
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : 'Processing...'}
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

