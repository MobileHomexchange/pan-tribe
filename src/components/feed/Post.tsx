import { useState } from "react";
import { ThumbsUp, MessageCircle, Share, Globe, Users, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostAuthor {
  name: string;
  avatar: string;
  initials: string;
}

interface PostData {
  id: string;
  author: PostAuthor;
  timeAgo: string;
  visibility: "public" | "friends";
  content: string;
  hasImage?: boolean;
  imageIcon?: string;
  likes: number;
  comments: number;
  shares: number;
}

interface PostProps {
  post: PostData;
}

export function Post({ post }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const getVisibilityIcon = () => {
    return post.visibility === "public" ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 border border-social-border">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pan-green to-pan-black flex items-center justify-center text-pan-gold font-bold">
          {post.author.initials}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-card-foreground">{post.author.name}</h3>
          <div className="flex items-center gap-1 text-xs text-social-muted">
            <span>{post.timeAgo}</span>
            <span>·</span>
            {getVisibilityIcon()}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.hasImage && (
        <div className="mb-3">
          <div className="w-full h-64 bg-gradient-to-br from-pan-green to-pan-black rounded-lg flex items-center justify-center">
            <Landmark className="h-12 w-12 text-pan-gold" />
          </div>
        </div>
      )}

      {/* Post Stats */}
      <div className="flex justify-between items-center py-2 border-b border-social-border mb-2 text-sm text-social-muted">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{likeCount}</span>
        </div>
        <div>
          <span>{post.comments} comments · {post.shares} shares</span>
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
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-md text-social-muted hover:bg-social-hover transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 flex-1 justify-center py-2 rounded-md text-social-muted hover:bg-social-hover transition-colors"
        >
          <Share className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
      </div>
    </div>
  );
}