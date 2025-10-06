import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { ImageIcon } from 'lucide-react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import imageCompression from 'browser-image-compression';
import { PlusCircle, X } from 'lucide-react';

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Poll states
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    
    // Check if user is authenticated
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
      // Force token refresh to ensure we have valid credentials
      await user.getIdToken(true);
      console.log("Creating post with user:", user.uid);
      let imageUrl = null;

      // Upload image to Firebase Storage if provided
      if (image) {
        // Compress image before upload
        console.log("Compressing image...");
        const compressedImage = await imageCompression(image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        console.log("Image compressed from", image.size, "to", compressedImage.size);

        // Upload with progress tracking
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, compressedImage);

        // Wait for upload to complete with progress updates
        imageUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
              console.log(`Upload progress: ${progress.toFixed(0)}%`);
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      // Create poll if poll creator was used
      let pollId = null;
      if (showPollCreator && pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) {
        const pollData = {
          question: pollQuestion,
          options: pollOptions.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
          voters: [],
          createdAt: serverTimestamp(),
        };
        const pollDoc = await addDoc(collection(db, 'polls'), pollData);
        pollId = pollDoc.id;
      }

      // Save post to Firestore
      const postData = {
        userId: user.uid,
        author: user.email || 'Anonymous',
        text: content,
        imageUrl,
        pollId,
        likes: 0,
        shares: 0,
        comments: [],
        createdAt: serverTimestamp(),
      };
      
      console.log("Saving post data:", postData);
      await addDoc(collection(db, 'posts'), postData);
      
      toast({
        title: "Post created!",
        description: "Your post has been shared with your tribe",
      });
      
      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
      setUploadProgress(0);
      setShowPollCreator(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      
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
              onChange={handleImageChange}
              className="file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          {/* Poll Creator Toggle */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPollCreator(!showPollCreator)}
              className="w-full"
            >
              {showPollCreator ? 'Remove Poll' : 'Add Poll'}
            </Button>

            {showPollCreator && (
              <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="pollQuestion">Poll Question</Label>
                  <Input
                    id="pollQuestion"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Ask a question..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Poll Options</Label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions];
                          newOptions[index] = e.target.value;
                          setPollOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newOptions = pollOptions.filter((_, i) => i !== index);
                            setPollOptions(newOptions);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPollOptions([...pollOptions, ''])}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading || (!content.trim() && !image)}
            className="w-full"
            size="lg"
          >
            {loading ? (
              uploadProgress > 0 && uploadProgress < 100 
                ? `Uploading... ${Math.round(uploadProgress)}%`
                : uploadProgress === 100
                ? 'Processing...'
                : 'Posting...'
            ) : 'Post'}
          </Button>
          
          {loading && uploadProgress > 0 && (
            <Progress value={uploadProgress} className="w-full" />
          )}
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;