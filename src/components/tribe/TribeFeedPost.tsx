import { Heart, MessageCircle, Share2, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TribeFeedPostProps {
  post: {
    id: string;
    tribeId: string;
    tribeName: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    sessionSummary?: {
      sessionName: string;
      duration: number;
      participants: number;
    };
    createdAt: any;
    likes: number;
    commentsCount: number;
  };
}

export function TribeFeedPost({ post }: TribeFeedPostProps) {
  const timestamp = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();

  return (
    <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-11 h-11 ring-2 ring-primary/10">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
              {post.authorName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{post.authorName}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                {post.tribeName}
              </Badge>
              <span>•</span>
              <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Session Summary (if exists) */}
      {post.sessionSummary && (
        <div className="mx-5 mb-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-foreground">{post.sessionSummary.sessionName}</h5>
              <p className="text-sm text-muted-foreground">
                {post.sessionSummary.duration} min • {post.sessionSummary.participants} participants
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      {post.imageUrl && (
        <div className="mb-4">
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Video */}
      {post.videoUrl && (
        <div className="mb-4">
          <video 
            src={post.videoUrl} 
            controls 
            className="w-full max-h-96"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{post.likes} likes</span>
          <span>{post.commentsCount} comments</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-2 hover:bg-primary/10 hover:text-primary"
          >
            <Heart className="w-5 h-5" />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-2 hover:bg-accent/10 hover:text-accent"
          >
            <MessageCircle className="w-5 h-5" />
            Comment
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-2 hover:bg-muted"
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
