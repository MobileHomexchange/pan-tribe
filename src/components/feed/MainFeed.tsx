import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  userName: string;
  userAvatar?: string;
  content?: string;
  mediaUrl?: string | null;
  postType?: string;
  timestamp?: { seconds: number; nanoseconds: number };
  likes?: number;
  comments?: CommentItem[];
  [key: string]: any;
}

interface CommentItem {
  userId: string;
  userName: string;
  userAvatar?: string;
  text?: string;
  gifUrl?: string;
  timestamp?: { seconds: number; nanoseconds: number };
}

// 🕒 Helper: “time ago”
const getTimeAgo = (timestamp?: { seconds: number; nanoseconds: number }) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

// 🔎 Simple GIF picker (GIPHY). If key missing, falls back to manual URL input.
const GifPicker: React.FC<{
  onPick: (url: string) => void;
}> = ({ onPick }) => {
  const key = import.meta.env.VITE_GIPHY_API_KEY as string | undefined;
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const canSearch = Boolean(key);

  const search = async () => {
    if (!canSearch) return;
    if (!q.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(q)}&limit=24&rating=pg`,
      );
      const json = await res.json();
      const urls: string[] = (json?.data || []).map(
        (g: any) => g?.images?.downsized_medium?.url || g?.images?.original?.url,
      );
      setResults(urls.filter(Boolean));
    } catch (e) {
      console.error("GIF search failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {canSearch ? (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="Search GIFs (e.g., celebration)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <Button onClick={search} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
          <ScrollArea className="h-48 border rounded-md p-2">
            {results.length === 0 && !loading ? (
              <div className="text-sm text-muted-foreground">Try searching for a GIF above.</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {results.map((url) => (
                  <button
                    key={url}
                    className="rounded overflow-hidden border hover:ring-2 hover:ring-primary"
                    onClick={() => onPick(url)}
                    type="button"
                  >
                    <img src={url} alt="gif" className="w-full h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">GIPHY key not set. Paste a GIF URL instead.</div>
          <Input
            placeholder="Paste a GIF URL (https://...)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) onPick(val);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

// 💬 Comment Modal
const CommentModal: React.FC<{
  postId: string;
  open: boolean;
  onClose: () => void;
}> = ({ postId, open, onClose }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [postAuthor, setPostAuthor] = useState<string>("");

  // Subscribe to post for live comments
  useEffect(() => {
    if (!open || !postId) return;
    const ref = doc(db, "posts", postId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Post;
        setComments((data.comments as CommentItem[]) || []);
        setPostAuthor(data.userName || "");
      }
    });
    return () => unsub();
  }, [open, postId]);

  const addComment = async () => {
    if (!currentUser) return;
    if (!text.trim() && !gifUrl) return;

    setPosting(true);
    try {
      const ref = doc(db, "posts", postId);
      const userName = currentUser.displayName || "Anonymous";
      const userAvatar = currentUser.photoURL || "";
      await updateDoc(ref, {
        comments: arrayUnion({
          userId: currentUser.uid,
          userName,
          userAvatar,
          text: text.trim() || "",
          gifUrl: gifUrl || "",
          timestamp: serverTimestamp(),
        }),
      });
      setText("");
      setGifUrl(undefined);
    } catch (e) {
      console.error("Failed to add comment:", e);
    } finally {
      setPosting(false);
    }
  };

  // latest first (optional)
  const ordered = useMemo(
    () =>
      [...comments].sort((a, b) => {
        const ta = a.timestamp?.seconds || 0;
        const tb = b.timestamp?.seconds || 0;
        return tb - ta;
      }),
    [comments],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments {postAuthor ? `on ${postAuthor}'s post` : ""}</DialogTitle>
        </DialogHeader>

        {/* Existing comments */}
        <ScrollArea className="h-64 border rounded-md p-3 space-y-3">
          {ordered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No comments yet. Start the conversation!</div>
          ) : (
            ordered.map((c, idx) => (
              <div key={idx} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  {c.userAvatar ? (
                    <AvatarImage src={c.userAvatar} />
                  ) : (
                    <AvatarFallback>{c.userName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.userName}</div>
                  {c.text && <div className="text-sm whitespace-pre-line">{c.text}</div>}
                  {c.gifUrl && <img src={c.gifUrl} alt="gif" className="mt-2 rounded-md max-h-60 w-auto" />}
                  {c.timestamp && <div className="text-xs text-muted-foreground mt-1">{getTimeAgo(c.timestamp)}</div>}
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {/* Composer */}
        <div className="space-y-3">
          <Input placeholder="Write a comment…" value={text} onChange={(e) => setText(e.target.value)} />
          {/* GIF picker */}
          <GifPicker onPick={(url) => setGifUrl(url)} />
          {gifUrl && (
            <div className="border rounded-md p-2">
              <div className="text-xs mb-1 text-muted-foreground">GIF selected:</div>
              <img src={gifUrl} alt="gif" className="rounded-md max-h-48 w-auto" />
              <div className="mt-2">
                <Button variant="secondary" onClick={() => setGifUrl(undefined)} size="sm">
                  Remove GIF
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={posting}>
            Close
          </Button>
          <Button onClick={addComment} disabled={posting || (!text.trim() && !gifUrl)}>
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Comment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MainFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData: Post[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Post[];
      setPosts(postData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const likePost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const ref = doc(db, "posts", postId);
      // (Optional) prevent multiple likes per user: check a likedBy map first
      await updateDoc(ref, {
        likes: increment(1),
      });
    } catch (e) {
      console.error("Like failed:", e);
    }
  };

  const openComments = (postId: string) => setActivePostId(postId);
  const closeComments = () => setActivePostId(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">No posts yet. Be the first to share something!</div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 shadow-sm">
          {/* User Header */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              {post.userAvatar ? (
                <AvatarImage src={post.userAvatar} alt={post.userName} />
              ) : (
                <AvatarFallback>{post.userName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold text-card-foreground">{post.userName}</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {post.postType && <span className="capitalize">{post.postType}</span>}
                {post.timestamp && <span>• {getTimeAgo(post.timestamp)}</span>}
              </div>
            </div>
          </div>

          {/* Text content */}
          {post.content && <p className="text-sm text-card-foreground mb-3 whitespace-pre-line">{post.content}</p>}

          {/* Media content */}
          {post.mediaUrl && (
            <div className="mb-3">
              {/\.(jpeg|jpg|gif|png|webp)$/i.test(post.mediaUrl) ? (
                <img src={post.mediaUrl} alt="Post media" className="rounded-lg max-h-96 w-full object-contain" />
              ) : (
                <video src={post.mediaUrl} controls className="rounded-lg max-h-96 w-full object-contain" />
              )}
            </div>
          )}

          {/* Footer actions */}
          <Separator className="my-3" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => likePost(post.id)}>
                <Heart className="h-4 w-4" />
                {post.likes || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => openComments(post.id)}>
                <MessageCircle className="h-4 w-4" />
                {post.comments?.length || 0}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Comment Modal */}
      {activePostId && <CommentModal postId={activePostId} open={Boolean(activePostId)} onClose={closeComments} />}
    </div>
  );
};

export default MainFeed;
