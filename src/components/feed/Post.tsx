import { useState } from "react";
import { ThumbsUp, MessageCircle, Share, Globe, Users, Landmark, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post as PostType } from "@/types";

interface PostProps {
  post: PostType;
  onInteraction?: (type: 'like' | 'comment' | 'share' | 'view') => void;
}

export function Post({ post, onInteraction }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onInteraction?.('like');
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleComment = () => {
    onInteraction?.('comment');
  };

  const handleShare = () => {
    onInteraction?.('share');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (createdAt: any) => {
    // Simple time ago formatting - you can enhance this
    const now = new Date();
    const postTime = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 border border-social-border">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pan-green to-pan-black flex items-center justify-center text-pan-gold font-bold">
          {getInitials(post.userName)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-card-foreground">{post.userName}</h3>
          <div className="flex items-center gap-1 text-xs text-social-muted">
            <span>{formatTimeAgo(post.createdAt)}</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Image/Video */}
      {(post.imageUrl || post.videoUrl) && (
        <div className="mb-3">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          {post.videoUrl && (
            <video 
              src={post.videoUrl} 
              controls 
              className="w-full h-64 rounded-lg"
            />
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex justify-between items-center py-2 border-b border-social-border mb-2 text-sm text-social-muted">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{likeCount}</span>
        </div>
        <div>
          <span>{post.comments.length} comments · {post.shares} shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-md transition-colors ${
            liked ? "text-social-like bg-light-green" : "text-social-muted hover:bg-social-hover"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{liked ? "Liked" : "Like"}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-md text-social-muted hover:bg-social-hover transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-md transition-colors ${
            saved ? "text-social-like bg-light-green" : "text-social-muted hover:bg-social-hover"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span className="font-medium">{saved ? "Saved" : "Save"}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleComment}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-md text-social-muted hover:bg-social-hover transition-colors"
        >
          <Share className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
      </div>
    </div>
  );
}