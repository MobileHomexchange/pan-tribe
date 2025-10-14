import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tribeId?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  likes: number;
  comments: number;
  timestamp: any;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const getTimestamp = () => {
    if (!post.timestamp) return "Just now";
    try {
      return formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <article className="bg-card rounded-lg shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-shadow">
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={post.userAvatar} alt={post.userName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {post.userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{post.userName}</h4>
          <p className="text-xs text-muted-foreground">{getTimestamp()}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="w-full">
          {post.mediaType === "video" ? (
            <video
              src={post.mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain bg-background"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full max-h-[500px] object-contain bg-background"
            />
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
        <span>{likeCount} likes</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex-1 gap-2 hover:bg-social-hover ${
            isLiked ? "text-social-like" : "text-foreground"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 hover:bg-social-hover text-foreground"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 hover:bg-social-hover text-foreground"
        >
          <Share2 className="w-5 h-5" />
          Share
        </Button>
      </div>
    </article>
  );
}
