import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video } from "lucide-react";

interface WhatsOnYourMindCardProps {
  userAvatar: string;
  onCreatePost: () => void;
}

export function WhatsOnYourMindCard({ userAvatar, onCreatePost }: WhatsOnYourMindCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
        </Avatar>
        <button
          onClick={onCreatePost}
          className="flex-1 text-left px-4 py-3 bg-background rounded-full text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          What's on your mind?
        </button>
      </div>
      <div className="flex items-center justify-around pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePost}
          className="flex-1 gap-2 hover:bg-muted"
        >
          <Image className="w-5 h-5 text-primary" />
          <span className="text-foreground">Photo</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePost}
          className="flex-1 gap-2 hover:bg-muted"
        >
          <Video className="w-5 h-5 text-destructive" />
          <span className="text-foreground">Video</span>
        </Button>
      </div>
    </div>
  );
}
