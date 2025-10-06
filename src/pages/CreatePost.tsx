import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { ImageIcon } from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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
      navigate('/login');
    }
  }, [currentUser, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image to Firebase Storage if provided
      if (image) {
        const imageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Save post to Firestore
      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        author: currentUser.email || 'Anonymous',
        text: content,
        imageUrl,
        likes: 0,
        shares: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with your tribe",
      });
      
      navigate('/feed');
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">What&apos;s on your mind?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with your tribe..."
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image (Optional)
            </Label>
            <Input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
            {image && (
              <p className="text-sm text-muted-foreground">
                Selected: {image.name}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading || (!content.trim() && !image)}
            className="w-full"
            size="lg"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;