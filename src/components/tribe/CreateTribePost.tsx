import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Smile } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CreateTribePostProps {
  tribeId: string;
  userAvatar: string;
  userName: string;
}

export function CreateTribePost({ tribeId, userAvatar, userName }: CreateTribePostProps) {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [posting, setPosting] = useState(false);
  const { currentUser } = useAuth();

  const handlePost = async () => {
    if (!content.trim() || !currentUser) return;

    setPosting(true);
    try {
      const postsRef = collection(db, "tribePosts");
      await addDoc(postsRef, {
        tribeId,
        tribeName: "Current Tribe", // You can pass this as a prop
        authorId: currentUser.uid,
        authorName: userName,
        authorAvatar: userAvatar,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0
      });

      toast.success("Post created successfully!");
      setContent("");
      setIsExpanded(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="sticky top-[130px] z-20 bg-card/95 backdrop-blur-sm rounded-xl shadow-md p-4 border border-border mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left px-4 py-3 bg-muted rounded-full text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            What's on your mind?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[130px] z-20 bg-card/95 backdrop-blur-sm rounded-xl shadow-md p-5 border border-border mb-4">
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground"
            autoFocus
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Image className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">Photo</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Video className="w-5 h-5 text-destructive" />
            <span className="hidden sm:inline">Video</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Smile className="w-5 h-5 text-accent" />
            <span className="hidden sm:inline">Emoji</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsExpanded(false);
              setContent("");
            }}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handlePost}
            disabled={!content.trim() || posting}
            className="bg-primary hover:bg-primary/90"
          >
            {posting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
