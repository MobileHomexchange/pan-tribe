import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video, Smile } from "lucide-react";

interface CreatePostInputProps {
  userAvatar: string;
  onCreatePost: () => void;
}

export function CreatePostInput({ userAvatar, onCreatePost }: CreatePostInputProps) {
  return (
    <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
        </Avatar>
        <button
          onClick={onCreatePost}
          className="flex-1 text-left px-4 py-3 bg-background rounded-full text-muted-foreground hover:bg-social-hover transition-colors cursor-pointer"
        >
          What's on your mind?
        </button>
      </div>
      <div className="flex items-center justify-around pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePost}
          className="flex-1 gap-2 hover:bg-social-hover"
        >
          <Video className="w-5 h-5 text-destructive" />
          <span className="text-foreground">Live Video</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePost}
          className="flex-1 gap-2 hover:bg-social-hover"
        >
          <Image className="w-5 h-5 text-primary" />
          <span className="text-foreground">Photo/Video</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreatePost}
          className="flex-1 gap-2 hover:bg-social-hover"
        >
          <Smile className="w-5 h-5 text-amber" />
          <span className="text-foreground">Feeling/Activity</span>
        </Button>
      </div>
    </div>
  );
}
