import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { DashboardSidebar } from "@/components/home/DashboardSidebar";
import { GrowYourTribeCard } from "@/components/home/GrowYourTribeCard";
import { StatsCards } from "@/components/home/StatsCards";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Share2, Flame } from "lucide-react";
import AdSense from "@/components/ads/AdSense";
import FullBleedHero from "@/components/FullBleedHero";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tribeId?: string;
  content: string;
  title?: string;
  category?: string;
  readTime?: string;
  mediaUrl?: string;
  mediaType?: string;
  likes: number;
  comments: number;
  timestamp: any;
}

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    tribeMembers: 1200,
    activeNow: 245,
    newPosts: 89,
  });

  // Fetch real-time posts with mock blog data
  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      let postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      
      // Add mock blog-style data if empty
      if (postsData.length === 0) {
        postsData = [
          {
            id: "1",
            userId: "tribe-pulse",
            userName: "Tribe Pulse",
            userAvatar: "",
            title: "Building Stronger Communities in the Digital Age",
            content: "Discover how modern tribes are forming around shared interests and values online, creating meaningful connections that transcend geographical boundaries.",
            category: "Community",
            readTime: "5 min read",
            mediaUrl: "",
            likes: 0,
            comments: 0,
            timestamp: new Date("2023-04-12"),
          },
          {
            id: "2",
            userId: "maya-sharma",
            userName: "Maya Sharma",
            userAvatar: "",
            title: "The Art of Digital Storytelling",
            content: "Learn how to craft compelling narratives that resonate with your audience and build authentic connections in the digital space.",
            category: "Culture",
            readTime: "8 min read",
            mediaUrl: "",
            likes: 0,
            comments: 0,
            timestamp: new Date("2023-04-10"),
          },
        ];
      }
      
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <DashboardSidebar 
        isOpen={dashboardOpen} 
        onClose={() => setDashboardOpen(false)} 
      />

      <Layout onDashboardToggle={() => setDashboardOpen(true)}>
        <div className="min-h-screen bg-background">
          <FullBleedHero />
          
          {/* Single Column Layout */}
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            
            {/* Leaderboard Ad */}
            <div className="flex justify-center">
              <AdSense
                slot="YOUR_LEADERBOARD_SLOT_ID"
                className="w-full"
                style={{ display: "block", minHeight: 90 }}
              />
            </div>

            {/* Grow Your Tribe Card - Full Width */}
            <GrowYourTribeCard />

            {/* Stats Cards */}
            <StatsCards 
              tribeMembers={stats.tribeMembers}
              activeNow={stats.activeNow}
              newPosts={stats.newPosts}
            />

            {/* Create Post Input */}
            <CreatePostInput
              userAvatar={currentUser?.photoURL || ""}
              userName={currentUser?.displayName || ""}
              onCreatePost={() => navigate("/create-post")}
            />

            {/* Optional In-Feed Ad */}
            <div className="my-4">
              <AdSense
                slot="YOUR_INFEED_SLOT_ID"
                format="fluid"
                layoutKey="-gw-3+1f-3d+2z"
                className="w-full"
                style={{ display: "block" }}
              />
            </div>

            {/* Blog-Style Posts Feed */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-card rounded-lg shadow p-12 text-center">
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <div key={post.id}>
                    {/* Blog Post Card */}
                    <article className="bg-card rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Post Header */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.userAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(post.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{post.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(post.timestamp)} · {post.readTime || "5 min read"}
                            </p>
                          </div>
                        </div>
                        {post.category && (
                          <Badge className="bg-primary hover:bg-primary/90">
                            {post.category}
                          </Badge>
                        )}
                      </div>

                      {/* Featured Image Placeholder */}
                      <div className="w-full h-64 bg-gradient-to-br from-sage/30 to-forest/20" />

                      {/* Post Content */}
                      <div className="p-6 space-y-4">
                        {post.title && (
                          <h2 className="text-2xl font-bold text-foreground hover:text-primary cursor-pointer">
                            {post.title}
                          </h2>
                        )}
                        <p className="text-muted-foreground leading-relaxed">
                          {post.content}
                        </p>

                        {/* Engagement Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                              <Flame className="w-5 h-5" />
                              <span className="text-sm">{post.likes || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm">{post.comments || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => navigate(`/post/${post.id}`)}
                            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                          >
                            Hear the Story →
                          </button>
                        </div>
                      </div>
                    </article>

                    {/* Inject ad every 20 posts */}
                    {(index + 1) % 20 === 0 && (
                      <div className="my-6">
                        <AdSense
                          slot="YOUR_INFEED_SLOT_ID"
                          format="fluid"
                          className="w-full"
                          style={{ display: "block" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
