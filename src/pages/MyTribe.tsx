import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Globe, Bell, MessageCircle, Video, Store, Home, Plus, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface TribeData {
  id: string;
  name: string;
  description: string;
  category?: string;
  visibility?: string;
  memberCount?: number;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    initials: string;
  };
  colorCaption?: string;
  backgroundColor?: string;
  textColor?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  tags: string[];
}

export default function MyTribe() {
  const { tribeId } = useParams<{ tribeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tribe, setTribe] = useState<TribeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    colorCaption: "#3B82F6",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    imageUrl: "",
    tags: [] as string[],
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Welcome to My Tribe 🎉",
      content: "This is your tribe space — connect, share, and grow together!",
      author: { name: "Tribe Admin", initials: "TA" },
      colorCaption: "#3B82F6",
      backgroundColor: "#EFF6FF",
      textColor: "#1E3A8A",
      likes: 10,
      comments: 3,
      shares: 2,
      timeAgo: "Just now",
      tags: ["Welcome", "Community"],
    },
  ]);

  // 🔥 Fetch tribe data from Firebase
  useEffect(() => {
    const fetchTribe = async () => {
      if (!tribeId) {
        setTribe({
          id: "demo",
          name: "My Demo Tribe",
          description: "A demo space for your tribe.",
          category: "Community",
          visibility: "public",
          memberCount: 1,
        });
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "tribes", tribeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTribe({ id: tribeId, ...(docSnap.data() as TribeData) });
        } else {
          toast.error("Tribe not found");
          navigate("/tribes");
        }
      } catch (error) {
        console.error("Error fetching tribe:", error);
        toast.error("Error loading tribe data");
      } finally {
        setLoading(false);
      }
    };

    fetchTribe();
  }, [tribeId, navigate]);

  // ❤️ Like button
  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setBlogPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p)));
      } else {
        newSet.add(postId);
        setBlogPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
      }
      return newSet;
    });
  };

  // 📝 Create post
  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: {
        name: currentUser?.displayName || "Current User",
        initials: currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : "U",
      },
      colorCaption: newPost.colorCaption,
      backgroundColor: newPost.backgroundColor,
      textColor: newPost.textColor,
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: "Just now",
      tags: newPost.tags,
    };

    setBlogPosts((prev) => [post, ...prev]);
    setShowCreatePost(false);
    setNewPost({
      title: "",
      content: "",
      colorCaption: "#3B82F6",
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      imageUrl: "",
      tags: [],
    });
    toast.success("Post created successfully!");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading your tribe...</div>;
  }

  if (!tribe) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Tribe not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6" />
          <span className="text-xl font-bold">{tribe.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/")}>
            <Home className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
              {getInitials(currentUser?.displayName || "U")}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Tribe Blog</h1>
          <Button onClick={() => setShowCreatePost(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        {blogPosts.map((post) => (
          <Card
            key={post.id}
            className="mb-6 border-l-4"
            style={{ borderColor: post.colorCaption, backgroundColor: post.backgroundColor }}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2" style={{ borderColor: post.colorCaption }}>
                  <AvatarFallback style={{ backgroundColor: post.colorCaption }} className="text-white font-bold">
                    {post.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle style={{ color: post.textColor }}>{post.title}</CardTitle>
                  <p className="text-sm opacity-80" style={{ color: post.textColor }}>
                    By {post.author.name} • {post.timeAgo}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed" style={{ color: post.textColor }}>
                {post.content}
              </p>
              <div
                className="flex justify-between items-center pt-4 border-t"
                style={{ borderColor: `${post.textColor}20` }}
              >
                <div className="text-sm opacity-80" style={{ color: post.textColor }}>
                  {post.likes} likes • {post.comments} comments
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  style={{ color: likedPosts.has(post.id) ? "#EF4444" : post.textColor }}
                >
                  <Heart className="w-4 h-4 mr-1" /> Like
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700 text-white">
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
