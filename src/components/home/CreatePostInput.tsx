import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video, Smile } from "lucide-react";

export function CreatePostInput() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser?.photoURL || undefined} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={() => navigate("/create-post")}
          className="flex-1 bg-muted hover:bg-muted/80 text-left px-4 py-3 rounded-full text-muted-foreground transition-colors"
        >
          What's on your mind, {displayName.split(" ")[0]}?
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          variant="ghost"
          className="flex-1 hover:bg-muted/50"
          onClick={() => navigate("/create-post?type=image")}
        >
          <Image className="mr-2 h-5 w-5 text-primary" />
          <span className="text-sm">Photo</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex-1 hover:bg-muted/50"
          onClick={() => navigate("/create-post?type=video")}
        >
          <Video className="mr-2 h-5 w-5 text-destructive" />
          <span className="text-sm">Video</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex-1 hover:bg-muted/50"
          onClick={() => navigate("/create-post")}
        >
          <Smile className="mr-2 h-5 w-5 text-yellow-500" />
          <span className="text-sm">Feeling</span>
        </Button>
      </div>
    </div>
  );
}
