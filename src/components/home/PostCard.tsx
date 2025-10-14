import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  likes: number;
  comments: number;
  timestamp: any;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const initials = post.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const timeAgo = post.timestamp?.toDate
    ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true })
    : "Just now";

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userAvatar} alt={post.userName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-semibold text-sm">{post.userName}</h4>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="w-full">
          {post.mediaType === "video" ? (
            <video
              src={post.mediaUrl}
              controls
              className="w-full max-h-[500px] object-cover bg-black"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full max-h-[600px] object-cover"
            />
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
        <span>{likeCount} likes</span>
        <span>{post.comments || 0} comments</span>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 flex items-center justify-around border-t border-border">
        <Button
          variant="ghost"
          className={`flex-1 hover:bg-muted/50 ${liked ? "text-destructive" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`mr-2 h-5 w-5 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">Like</span>
        </Button>
        
        <Button variant="ghost" className="flex-1 hover:bg-muted/50">
          <MessageCircle className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Comment</span>
        </Button>
        
        <Button variant="ghost" className="flex-1 hover:bg-muted/50">
          <Share2 className="mr-2 h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </Button>
      </div>
    </div>
  );
}
