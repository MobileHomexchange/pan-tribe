import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { PostCard } from "@/components/home/PostCard";
import { LiveSessionCard } from "@/components/home/LiveSessionCard";
import { DashboardSidebar } from "@/components/home/DashboardSidebar";
import { GrowYourTribeCard } from "@/components/home/GrowYourTribeCard";
import { StatsCards } from "@/components/home/StatsCards";
import { collection, query, orderBy, onSnapshot, limit, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tribeId?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  likes: number;
  comments: number;
  timestamp: any;
}

interface TribeSession {
  id: string;
  tribeId: string;
  tribeName: string;
  hostId: string;
  hostName: string;
  roomName: string;
  status: string;
  participantCount: number;
  startTime: any;
}

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [liveSessions, setLiveSessions] = useState<TribeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tribeMembers: 1200,
    activeNow: 245,
    newPosts: 89,
  });

  // Fetch real-time posts
  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch real-time live sessions
  useEffect(() => {
    const sessionsQuery = query(
      collection(db, "tribeSessions"),
      orderBy("startTime", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((session: any) => session.status === "live") as TribeSession[];
      setLiveSessions(sessionsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total members
        const usersSnapshot = await getDocs(collection(db, "users"));
        
        // Get today's posts
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPostsQuery = query(
          collection(db, "posts"),
          where("timestamp", ">=", today)
        );
        const todayPostsSnapshot = await getDocs(todayPostsQuery);

        setStats({
          tribeMembers: usersSnapshot.size || 1200,
          activeNow: Math.floor(Math.random() * 300) + 200, // Simulated for now
          newPosts: todayPostsSnapshot.size || 89,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Dashboard Sidebar (Overlay) */}
      <DashboardSidebar 
        isOpen={dashboardOpen} 
        onClose={() => setDashboardOpen(false)} 
      />

      <Layout onDashboardToggle={() => setDashboardOpen(true)}>
        <div className="min-h-screen bg-gradient-to-b from-cream/30 to-white pt-6">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="space-y-5">
              {/* Stats Cards */}
              <StatsCards 
                tribeMembers={stats.tribeMembers}
                activeNow={stats.activeNow}
                newPosts={stats.newPosts}
              />

              {/* Grow Your Tribe Banner */}
              <GrowYourTribeCard />

              {/* Create Post Input */}
              <CreatePostInput
                userAvatar={currentUser?.photoURL || ""}
                onCreatePost={() => navigate("/create-post")}
              />

              {/* Live Sessions Block */}
              {liveSessions.length > 0 && (
                <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Video className="w-6 h-6 text-destructive animate-pulse" />
                    Live Tribe Sessions
                  </h2>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {liveSessions.map((session) => (
                        <LiveSessionCard
                          key={session.id}
                          session={session}
                          onJoin={() => navigate(`/session?room=${session.roomName}`)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Posts Feed */}
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-12 text-center">
                  <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
