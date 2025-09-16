import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

const GoLive: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      // Simulate going live (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Live stream started!",
        description: `"${title}" is now live`,
      });
      
      navigate('/my-tribe'); // Redirect to tribe page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start live stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Go Live</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your live stream title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell your audience what this stream is about..."
              rows={3}
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? 'Starting...' : 'Start Live Stream'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default GoLive;