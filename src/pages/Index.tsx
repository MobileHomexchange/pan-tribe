import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import MainFeed from "@/components/feed/MainFeed";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { LiveSessionCard } from "@/components/home/LiveSessionCard";
import { AdRotator } from "@/components/home/AdRotator";
import { TribeDashboardWidget } from "@/components/home/TribeDashboardWidget";
import { StickyAdBanner } from "@/components/home/StickyAdBanner";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

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

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [liveSessions, setLiveSessions] = useState<TribeSession[]>([]);

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


  return (
    <Layout>
      <StickyAdBanner />
      <div className="min-h-screen bg-pattern">
        <div className="max-w-[1920px] mx-auto flex gap-6 px-4 py-6">
          {/* CENTER FEED - Flexible width */}
          <main className="flex-1 max-w-4xl mx-auto space-y-6">
            {/* Sticky Create Post Input */}
            <div className="sticky top-20 z-10 bg-pattern pb-4">
              <CreatePostInput
                userAvatar={currentUser?.photoURL || ""}
                onCreatePost={() => navigate("/create-post")}
              />
            </div>

            {/* Live Sessions Block */}
            {liveSessions.length > 0 && (
              <div className="bg-card rounded-lg shadow-card p-4">
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

            {/* Main Feed */}
            <MainFeed />
          </main>

          {/* RIGHT SIDEBAR - Sticky Activity & Ads Board */}
          <aside className="hidden lg:block w-96 sticky top-24 h-fit max-h-[calc(100vh-7rem)] flex flex-col">
            {/* ACTIVITY SECTION */}
            <div className="space-y-4 mb-6">
              <div className="bg-card rounded-lg shadow-card p-4 border-l-4 border-primary">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Activity
                </h3>
                
                {/* Tribe Dashboard Widget */}
                <TribeDashboardWidget
                  sessionsJoined={12}
                  followers={245}
                  tribeCount={3}
                  isAdmin={false}
                  onStartSession={() => navigate("/session")}
                />
              </div>

              {/* Live Sessions Summary */}
              {liveSessions.length > 0 && (
                <div className="bg-card rounded-lg shadow-card p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4 text-destructive" />
                    Trending Live
                  </h4>
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
            </div>

            {/* SPONSORED SECTION - Sticky Ads */}
            <div className="space-y-4 sticky top-24">
              <div className="bg-card rounded-lg shadow-card p-4 border-l-4 border-muted">
                <h3 className="font-bold text-muted-foreground mb-4 text-sm uppercase tracking-wide">
                  Sponsored
                </h3>
                
                {/* Ad Rotation */}
                <div className="mb-4">
                  <AdRotator />
                </div>

                {/* Vertical Sticky Ad - 300x600 */}
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                  <div className="bg-background rounded h-[600px] flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">300x600 Vertical Ad</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
