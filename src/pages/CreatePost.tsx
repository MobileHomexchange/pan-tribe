import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { ImageIcon } from 'lucide-react';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    
    setLoading(true);
    try {
      // Simulate post creation (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with your tribe",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
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