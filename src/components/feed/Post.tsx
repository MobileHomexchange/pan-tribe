import { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Share, Globe, Users, Landmark, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post as PostType, Comment } from "@/types";
import { CommentsModal } from "@/components/CommentsModal";
import { ShareModal } from "@/components/ShareModal";
import { FirebaseService } from "@/lib/firebaseService";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ClickableAvatar } from "@/components/ui/ClickableAvatar";

interface PostProps {
  post: PostType;
  onInteraction?: (type: 'like' | 'comment' | 'share' | 'view') => void;
}

export function Post({ post, onInteraction }: PostProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { isSaved, toggleSave } = useSavedItems();
  
  const [liked, setLiked] = useState(currentUser ? post.likes.includes(currentUser.uid) : false);
  const [saved, setSaved] = useState(isSaved(post.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [shareCount, setShareCount] = useState(post.shares);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track post view on mount
  useEffect(() => {
    if (currentUser) {
      FirebaseService.trackView(post.id, currentUser.uid);
      onInteraction?.('view');
    }
  }, [post.id, currentUser, onInteraction]);

  // Subscribe to comments
  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeToComments(post.id, setComments);
    return unsubscribe;
  }, [post.id]);

  const handleLike = async () => {
    if (!currentUser || loading) return;
    
    setLoading(true);
    try {
      const { liked: newLiked, newCount } = await FirebaseService.toggleLike(post.id, currentUser.uid);
      setLiked(newLiked);
      setLikeCount(newCount);
      onInteraction?.('like');
      
      toast({
        title: newLiked ? "Post liked!" : "Like removed",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    
    const savedItem = {
      id: post.id,
      title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
      type: 'post' as const,
      image: post.imageUrl,
    };
    
    toggleSave(savedItem);
    setSaved(!saved);
    
    toast({
      title: saved ? "Post unsaved" : "Post saved!",
      duration: 2000,
    });
  };

  const handleComment = () => {
    setCommentsOpen(true);
    onInteraction?.('comment');
  };

  const handleShare = () => {
    setShareOpen(true);
    onInteraction?.('share');
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser) return;
    
    try {
      await FirebaseService.addComment(post.id, currentUser.uid, currentUser.displayName || 'Anonymous', content);
      toast({
        title: "Comment added!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareAction = async (platform?: string) => {
    if (!currentUser) return;
    
    try {
      await FirebaseService.trackShare(post.id, currentUser.uid, platform);
      setShareCount(prev => prev + 1);
      
      toast({
        title: "Post shared!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
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
    <div className="w-full bg-card rounded-lg shadow-sm p-4 border border-social-border">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <ClickableAvatar 
          userId={post.userId}
          userName={post.userName}
          userAvatar={post.userAvatar}
          showTooltip
        />
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
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />
          )}
          {post.videoUrl && (
            <video 
              src={post.videoUrl} 
              controls 
              className="w-full h-auto max-h-96 rounded-lg"
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
          <span>{comments.length} comments · {shareCount} shares</span>
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
          onClick={handleComment}
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
          onClick={handleShare}
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-md text-social-muted hover:bg-social-hover transition-colors"
        >
          <Share className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        post={{
          id: post.id,
          author: {
            name: post.userName,
            avatar: post.userAvatar || '',
            initials: getInitials(post.userName)
          },
          comments: comments.length
        }}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        onAddComment={async (content: string) => {
          await handleAddComment(content);
          return true;
        }}
      />

      {/* Share Modal */}
      <ShareModal
        post={{
          ...post,
          author: {
            name: post.userName,
            avatar: post.userAvatar || '',
            initials: getInitials(post.userName)
          }
        }}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onShare={handleShareAction}
      />
    </div>
  );
}