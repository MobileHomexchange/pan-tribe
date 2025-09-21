import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClickableAvatar } from "@/components/ui/ClickableAvatar";

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
}

interface CommentsModalProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      initials: string;
    };
    comments: number;
  };
  onClose: () => void;
  onAddComment: (comment: string) => Promise<boolean>;
  open: boolean;
}

export function CommentsModal({ post, onClose, onAddComment, open }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock comments for demonstration
  const [comments] = useState<Comment[]>([
    {
      id: "1",
      content: "Great post! Really insightful.",
      userId: "user1",
      userName: "Alex Johnson",
      userAvatar: "",
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: "2", 
      content: "Thanks for sharing this valuable information.",
      userId: "user2",
      userName: "Sarah Williams",
      userAvatar: "",
      createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    const success = await onAddComment(newComment);
    
    if (success) {
      setNewComment("");
    }
    
    setIsSubmitting(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[500px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-social-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-card-foreground">
              Comments
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <ClickableAvatar 
                  userId={comment.userId}
                  userName={comment.userName}
                  userAvatar={comment.userAvatar}
                  size="sm"
                  showTooltip
                />
                <div className="flex-1">
                  <div className="bg-social-hover rounded-lg p-3">
                    <h4 className="font-medium text-sm text-card-foreground">
                      {comment.userName}
                    </h4>
                    <p className="text-card-foreground text-sm mt-1">
                      {comment.content}
                    </p>
                  </div>
                  <p className="text-xs text-social-muted mt-1">
                    {formatTimeAgo(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-social-muted">No comments yet.</p>
              <p className="text-social-muted text-sm">Be the first to comment!</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-social-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}