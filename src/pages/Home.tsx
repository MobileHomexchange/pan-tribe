import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { UserProfileCard } from "@/components/home/UserProfileCard";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { PostCard } from "@/components/home/PostCard";
import { LiveSessionCard } from "@/components/home/LiveSessionCard";
import { AdRotator } from "@/components/home/AdRotator";
import { TribeDashboardWidget } from "@/components/home/TribeDashboardWidget";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Home as HomeIcon, Users, MessageSquare, Settings, Video, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [liveSessions, setLiveSessions] = useState<TribeSession[]>([]);
  const [loading, setLoading] = useState(true);

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

  const navigationLinks = [
    { icon: HomeIcon, label: "Home", path: "/home" },
    { icon: Users, label: "MyTribe", path: "/my-tribe" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-green to-background">
      <TopBar />
      
      <div className="pt-16">
        <div className="max-w-[1920px] mx-auto flex gap-6 px-4 py-6">
          {/* LEFT SIDEBAR - Fixed width */}
          <aside className="hidden lg:block w-80 space-y-4 sticky top-24 h-fit">
            <UserProfileCard
              userName={currentUser?.displayName || "User"}
              userAvatar={currentUser?.photoURL || ""}
              tribeName="Your Tribe"
              status="Active"
            />

            {/* Navigation Links */}
            <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 space-y-2">
              {navigationLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-social-hover"
                  onClick={() => navigate(link.path)}
                >
                  <link.icon className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{link.label}</span>
                </Button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 space-y-3">
              <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
              <Button
                onClick={() => navigate("/create-post")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button
                onClick={() => navigate("/session")}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                <Video className="w-4 h-4 mr-2" />
                Go Live
              </Button>
            </div>
          </aside>

          {/* CENTER FEED - Flexible width */}
          <main className="flex-1 max-w-3xl mx-auto space-y-4">
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
          </main>

          {/* RIGHT SIDEBAR - Fixed width */}
          <aside className="hidden lg:block w-96 space-y-4 sticky top-24 h-fit">
            {/* Tribe Dashboard Widget */}
            <TribeDashboardWidget
              sessionsJoined={12}
              followers={245}
              tribeCount={3}
              isAdmin={false}
              onStartSession={() => navigate("/session")}
            />

            {/* Live Sessions Summary */}
            {liveSessions.length > 0 && (
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4">
                <h3 className="font-semibold text-foreground mb-3">Trending Live</h3>
                <div className="space-y-2">
                  {liveSessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="p-3 bg-background rounded-lg hover:bg-social-hover cursor-pointer transition-colors"
                      onClick={() => navigate(`/session?room=${session.roomName}`)}
                    >
                      <p className="font-medium text-sm text-foreground">
                        {session.tribeName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.participantCount} watching
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Rotation */}
            <AdRotator />

            {/* Google Ad Banners Placeholder */}
            <div className="bg-muted rounded-lg p-4 text-center border border-border">
              <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
              <div className="bg-background rounded h-[250px] flex items-center justify-center">
                <span className="text-muted-foreground text-sm">300x250 Ad</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
