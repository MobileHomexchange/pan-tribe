import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

interface BlogSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogSubmissionModal({ open, onOpenChange }: BlogSubmissionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    featuredImage: "",
    author: "",
    email: ""
  });

  const categories = [
    "Technology",
    "Arts & Culture", 
    "Community",
    "Business",
    "Health & Wellness",
    "Education",
    "Travel",
    "Food & Lifestyle"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Blog Submitted Successfully!",
        description: "Your blog has been submitted for admin review. You'll be notified once it's approved.",
      });
      
      // Reset form
      setFormData({
        title: "",
        content: "",
        category: "",
        featuredImage: "",
        author: "",
        email: ""
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your blog. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Blog</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guidelines */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold">Submission Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All blogs must be original content related to African diaspora experiences</li>
                    <li>• Content will be reviewed by admins before publication</li>
                    <li>• Published blogs will be watermarked with TRIBE PULSE branding</li>
                    <li>• Ensure your content is respectful and adds value to the community</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Blog Details */}
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter your blog title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => handleInputChange("featuredImage", e.target.value)}
              placeholder="https://example.com/image.jpg (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Blog Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your blog content here..."
              className="min-h-[300px]"
              required
            />
          </div>

          {/* Review Process Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Review Process</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Your submission will be reviewed by our admin team within 24-48 hours. 
                    Once approved, it will be published with the TRIBE PULSE watermark and 
                    backlink. You'll receive an email notification when your blog goes live.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}