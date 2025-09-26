import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ExternalLink, Share2, Bookmark } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  publishDate: string;
  readTime: string;
  featured_image: string;
  watermark: string;
}

interface BlogDetailModalProps {
  blog: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogDetailModal({ blog, open, onOpenChange }: BlogDetailModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!blog) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would save to user's bookmarks
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{blog.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="relative">
            <img 
              src={blog.featured_image} 
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-md text-sm font-semibold">
              {blog.watermark}
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{blog.category}</Badge>
              <Badge variant="outline">Featured</Badge>
            </div>
            
            <h1 className="text-3xl font-bold">{blog.title}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blog.readTime}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? "bg-primary text-primary-foreground" : ""}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">{blog.excerpt}</p>
            
            <div className="space-y-4 text-foreground">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Published by <span className="font-semibold text-foreground">{blog.author}</span> on{" "}
                {new Date(blog.publishDate).toLocaleDateString()}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>

          {/* Watermark Footer */}
          <div className="text-center py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a 
                href="/" 
                className="font-semibold text-primary hover:underline"
              >
                TRIBE PULSE
              </a>
              {" "}• Connecting the African Diaspora
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}