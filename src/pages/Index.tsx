import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import MainFeed from "@/components/feed/MainFeed";
import { CreatePostInput } from "@/components/home/CreatePostInput";
import { LiveSessionCard } from "@/components/home/LiveSessionCard";
import { AdRotator } from "@/components/home/AdRotator";
import { TribeDashboardWidget } from "@/components/home/TribeDashboardWidget";
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
      <div className="min-h-screen bg-pattern">
        <div className="max-w-[1920px] mx-auto flex gap-6 px-4 py-6">
          {/* CENTER FEED - Flexible width */}
          <main className="flex-1 max-w-3xl mx-auto space-y-6">
            {/* Create Post Input */}
            <CreatePostInput
              userAvatar={currentUser?.photoURL || ""}
              onCreatePost={() => navigate("/create-post")}
            />

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

          {/* RIGHT SIDEBAR - Fixed width */}
          <aside className="hidden lg:block w-96 space-y-6 sticky top-24 h-fit">
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
              <div className="bg-card rounded-lg shadow-card p-4">
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
    </Layout>
  );
};

export default Index;
