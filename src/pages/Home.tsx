import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { Layout } from "@/components/layout/Layout";
import { UserProfileCard } from "@/components/home/UserProfileCard";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { PostCard } from "@/components/home/PostCard";
import { LiveSessionCard } from "@/components/home/LiveSessionCard";
import { AdRotator } from "@/components/home/AdRotator";
import { TribeDashboardWidget } from "@/components/home/TribeDashboardWidget";
import { Button } from "@/components/ui/button";
import { Plus, Radio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  tribeId?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
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

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  targetTribes?: string[];
  isActive: boolean;
}

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [liveSessions, setLiveSessions] = useState<TribeSession[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts in real-time
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

  // Fetch live sessions in real-time
  useEffect(() => {
    const sessionsQuery = query(
      collection(db, "tribeSessions"),
      where("status", "==", "live"),
      orderBy("startTime", "desc")
    );

    const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TribeSession[];
      setLiveSessions(sessionsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch ads in real-time
  useEffect(() => {
    const adsQuery = query(
      collection(db, "ads"),
      where("isActive", "==", true),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(adsQuery, (snapshot) => {
      const adsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ad[];
      setAds(adsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6">
          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <UserProfileCard />
              
              {/* Navigation Links */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/feed")}
                >
                  <span className="text-lg">🏠</span>
                  <span className="ml-3">Home</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/my-tribe")}
                >
                  <span className="text-lg">👥</span>
                  <span className="ml-3">MyTribe</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/reels")}
                >
                  <span className="text-lg">🎬</span>
                  <span className="ml-3">Reels</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/marketplace")}
                >
                  <span className="text-lg">🛍️</span>
                  <span className="ml-3">Marketplace</span>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/create-post")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
                <Button
                  className="w-full bg-destructive hover:bg-destructive/90"
                  onClick={() => navigate("/go-live")}
                >
                  <Radio className="mr-2 h-4 w-4" />
                  Go Live
                </Button>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - FEED */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post Input */}
            <CreatePostInput />

            {/* Live Sessions Block */}
            {liveSessions.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                  </span>
                  Live Tribe Sessions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveSessions.slice(0, 4).map((session) => (
                    <LiveSessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading feed...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
                  <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                </div>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - DASHBOARD + ADS */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              {/* Tribe Dashboard Widget */}
              <TribeDashboardWidget />

              {/* Live Sessions Summary */}
              {liveSessions.length > 0 && (
                <div className="bg-card rounded-xl shadow-sm border border-border p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                    </span>
                    Trending Sessions
                  </h3>
                  <div className="space-y-2">
                    {liveSessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => navigate(`/my-tribe?session=${session.roomName}`)}
                      >
                        <p className="font-medium text-sm">{session.tribeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.hostName} • {session.participantCount} watching
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad Rotation */}
              <AdRotator ads={ads} />

              {/* Google Ad Placeholder */}
              <div className="bg-muted/30 rounded-xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                <div className="bg-background rounded-lg h-64 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">300x250 Ad Space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
