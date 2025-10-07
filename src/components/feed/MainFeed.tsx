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
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// -------- Types --------
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
}

interface CommentItem {
  userId: string;
  userName: string;
  userAvatar?: string;
  text?: string;
  gifUrl?: string;
  timestamp?: { seconds: number; nanoseconds: number };
}

// 🕒 Time Ago
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

// -------- GIF Picker (Cached Dual API) --------
const CACHE_EXPIRY_HOURS = 24;

const GifPicker: React.FC<{ onPick: (url: string) => void }> = ({ onPick }) => {
  const giphyKey = import.meta.env.VITE_GIPHY_API_KEY as string | undefined;
  const tenorKey = import.meta.env.VITE_TENOR_API_KEY as string | undefined;

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const fetchFromGiphy = async (query: string): Promise<string[]> => {
    if (!giphyKey) return [];
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(query)}&limit=24&rating=pg`,
    );
    const json = await res.json();
    return (json?.data || [])
      .map((g: any) => g?.images?.downsized_medium?.url || g?.images?.original?.url)
      .filter(Boolean);
  };

  const fetchFromTenor = async (query: string): Promise<string[]> => {
    if (!tenorKey) return [];
    const res = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
        query,
      )}&key=${tenorKey}&limit=24&media_filter=minimal`,
    );
    const json = await res.json();
    return (json?.results || [])
      .map((r: any) => r?.media_formats?.gif?.url || r?.media_formats?.tinygif?.url)
      .filter(Boolean);
  };

  const search = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);

    const searchTerm = q.trim().toLowerCase();
    const cacheRef = doc(db, "gifCache", searchTerm);

    try {
      const snap = await getDoc(cacheRef);
      const now = Date.now();

      if (snap.exists()) {
        const data = snap.data();
        const updatedAt = data.updatedAt?.toDate?.() || new Date(0);
        const ageHours = (now - updatedAt.getTime()) / 1000 / 3600;

        if (ageHours < CACHE_EXPIRY_HOURS && Array.isArray(data.gifs)) {
          setResults(data.gifs);
          setLoading(false);
          return;
        }
      }

      let gifs: string[] = [];
      try {
        gifs = await fetchFromGiphy(searchTerm);
      } catch {
        gifs = [];
      }

      if (gifs.length === 0) {
        try {
          gifs = await fetchFromTenor(searchTerm);
        } catch {
          gifs = [];
        }
      }

      setResults(gifs);

      if (gifs.length > 0) {
        await setDoc(cacheRef, {
          gifs,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("GIF search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
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
          <div className="text-sm text-muted-foreground">Try searching for a GIF or paste one below.</div>
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

      <div className="pt-2 space-y-1">
        <p className="text-xs text-muted-foreground">Or paste a GIF URL manually:</p>
        <Input
          placeholder="https://media.giphy.com/media/yourgif.gif"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) onPick(val);
            }
          }}
        />
      </div>
    </div>
  );
};

// -------- Comment Modal --------
const CommentModal: React.FC<{
  postId: string;
  open: boolean;
  onClose: () => void;
}> = ({ postId, open, onClose }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);
  const [comments, setComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    if (!open || !postId) return;
    const ref = doc(db, "posts", postId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Post;
        setComments((data.comments as CommentItem[]) || []);
      }
    });
    return () => unsub();
  }, [open, postId]);

  const addComment = async () => {
    if (!currentUser || (!text.trim() && !gifUrl)) return;
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, {
      comments: arrayUnion({
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userAvatar: currentUser.photoURL || "",
        text: text.trim() || "",
        gifUrl: gifUrl || "",
        timestamp: serverTimestamp(),
      }),
    });
    setText("");
    setGifUrl(undefined);
  };

  const ordered = useMemo(
    () => [...comments].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)),
    [comments],
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

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

        <div className="space-y-3">
          <Input placeholder="Write a comment…" value={text} onChange={(e) => setText(e.target.value)} />
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
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={addComment} disabled={!text.trim() && !gifUrl}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// -------- Viral CTA Modal --------
const ViralJoinModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const joinUrl = import.meta.env.VITE_TRIBEPULSE_JOIN_URL || "https://tribelpulse.com";
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md text-center space-y-4 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">🚀 This post is going viral!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Join <strong>Tribe L Pulse</strong> to connect with others who are fueling this momentum.
        </p>
        <DialogFooter className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={() => window.open(joinUrl, "_blank")} className="bg-primary text-white font-semibold">
            Join Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// -------- Main Feed --------
const MainFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showViralModal, setShowViralModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
      setPosts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🧠 Viral trigger
  useEffect(() => {
    const viral = posts.some((p) => (p.likes || 0) >= 25 || (p.comments?.length || 0) >= 10);
    if (viral && !sessionStorage.getItem("viralPromptShown")) {
      setShowViralModal(true);
      sessionStorage.setItem("viralPromptShown", "true");
    }
  }, [posts]);

  const likePost = async (postId: string) => {
    if (!currentUser) return;
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, { likes: increment(1) });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );

  if (posts.length === 0)
    return (
      <div className="text-center py-20 text-muted-foreground">No posts yet. Be the first to share something!</div>
    );

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 shadow-sm">
          {/* Header */}
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

          {/* Text */}
          {post.content && <p className="text-sm text-card-foreground mb-3 whitespace-pre-line">{post.content}</p>}

          {/* Media */}
          {post.mediaUrl && (
            <div className="mb-3">
              {/\.(jpeg|jpg|gif|png|webp)$/i.test(post.mediaUrl) ? (
                <img src={post.mediaUrl} alt="Post media" className="rounded-lg max-h-96 w-full object-contain" />
              ) : (
                <video src={post.mediaUrl} controls className="rounded-lg max-h-96 w-full object-contain" />
              )}
            </div>
          )}

          {/* Footer */}
          <Separator className="my-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => likePost(post.id)}>
                <Heart className="h-4 w-4" />
                {post.likes || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setActivePostId(post.id)}>
                <MessageCircle className="h-4 w-4" />
                {post.comments?.length || 0}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Comment Modal */}
      {activePostId && (
        <CommentModal postId={activePostId} open={Boolean(activePostId)} onClose={() => setActivePostId(null)} />
      )}

      {/* Viral Modal */}
      {showViralModal && <ViralJoinModal open={showViralModal} onClose={() => setShowViralModal(false)} />}
    </div>
  );
};

export default MainFeed;
