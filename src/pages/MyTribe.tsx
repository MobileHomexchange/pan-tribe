import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Video, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { TribeOverview } from "@/components/tribe/dashboard/TribeOverview";
import { LiveSessionCard } from "@/components/tribe/dashboard/LiveSessionCard";
import { PastSessionCard } from "@/components/tribe/dashboard/PastSessionCard";
import { TribeFeed } from "@/components/tribe/TribeFeed";
import { TribeAdBanner } from "@/components/tribe/TribeAdBanner";
import { LiveNowCard } from "@/components/tribe/dashboard/LiveNowCard";
import { SuggestedTribesCard } from "@/components/tribe/dashboard/SuggestedTribesCard";
import { DashboardSidebar } from "@/components/home/DashboardSidebar";
import AdSense from "@/components/ads/AdSense";
import HouseAd from "@/components/ads/HouseAd";

interface TribeData {
  id: string;
  name: string;
  description: string;
  category?: string;
  banner?: string;
  avatar?: string;
  memberCount?: number;
}

interface LiveSession {
  id: string;
  tribeId: string;
  tribeName: string;
  roomName: string;
  hostName: string;
  startTime: Date;
  participantCount: number;
}

interface SuggestedTribe {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  avatar?: string;
}

interface PastSession {
  id: string;
  roomName: string;
  hostName: string;
  startTime: Date;
  duration: number;
  participantCount: number;
  recordingUrl?: string;
}

interface TribeStats {
  totalMinutes: number;
  totalSessions: number;
  activeMembers: number;
}

interface OnlineMember {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

export default function MyTribe() {
  const { tribeId } = useParams<{ tribeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tribe, setTribe] = useState<TribeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<LiveSession[]>([]);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userTribes] = useState([
    { id: "tech", name: "Tech Innovators", memberCount: 234 },
    { id: "music", name: "African Beats", memberCount: 567 },
    { id: "business", name: "Entrepreneurs Hub", memberCount: 890 }
  ]);
  const [suggestedTribes] = useState<SuggestedTribe[]>([
    { id: "wellness", name: "Wellness & Mindfulness", category: "Health", memberCount: 432 },
    { id: "creators", name: "Content Creators Hub", category: "Media", memberCount: 678 },
    { id: "finance", name: "Financial Freedom", category: "Finance", memberCount: 543 }
  ]);

  const isAdmin = currentUser?.uid === "admin"; // Replace with actual admin check

  // Fetch tribe data
  useEffect(() => {
    const fetchTribe = async () => {
      if (!tribeId) {
        setTribe({
          id: "demo",
          name: "My Demo Tribe",
          description: "A vibrant community space for connection and growth.",
          category: "Community",
          memberCount: 156,
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
          navigate("/");
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

  // Listen for active sessions (real-time)
  useEffect(() => {
    if (!tribe?.id) return;

    // Mock active sessions for demo - multiple sessions from different tribes
    const mockSessions: LiveSession[] = [
      {
        id: "session-1",
        tribeId: tribe.id,
        tribeName: tribe.name,
        roomName: "Weekly Tribe Gathering",
        hostName: "Kwame Asante",
        startTime: new Date(Date.now() - 15 * 60 * 1000),
        participantCount: 12
      },
      {
        id: "session-2",
        tribeId: "tech",
        tribeName: "Tech Innovators",
        roomName: "Tech Talk Tuesday",
        hostName: "Amina Diallo",
        startTime: new Date(Date.now() - 5 * 60 * 1000),
        participantCount: 8
      }
    ];
    
    setActiveSessions(mockSessions);

    // Uncomment when Firebase collection is ready:
    /*
    const sessionsRef = collection(db, 'tribeSessions');
    const q = query(
      sessionsRef,
      where('tribeId', '==', tribe.id),
      where('status', '==', 'live'),
      limit(1)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const sessionData = snapshot.docs[0].data();
        setActiveSession({
          id: snapshot.docs[0].id,
          roomName: sessionData.roomName,
          hostName: sessionData.hostName,
          startTime: sessionData.startTime.toDate(),
          participantCount: sessionData.participantCount
        });
      } else {
        setActiveSession(null);
      }
    });
    
    return () => unsubscribe();
    */
  }, [tribe?.id]);

  // Load past sessions
  useEffect(() => {
    if (!tribe?.id) return;

    // Mock past sessions for demo
    const mockPastSessions: PastSession[] = [
      {
        id: "past-1",
        roomName: "Pan-African History Discussion",
        hostName: "Amina Diallo",
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 45,
        participantCount: 23,
        recordingUrl: "https://example.com/recording1"
      },
      {
        id: "past-2",
        roomName: "Tech & Innovation Summit",
        hostName: "Thabo Johnson",
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        duration: 90,
        participantCount: 45
      },
      {
        id: "past-3",
        roomName: "Community Town Hall",
        hostName: "Nia Mbeki",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        participantCount: 67,
        recordingUrl: "https://example.com/recording3"
      }
    ];

    setPastSessions(mockPastSessions);

    // Uncomment when Firebase collection is ready:
    /*
    const fetchPastSessions = async () => {
      const sessionsRef = collection(db, 'tribeSessions');
      const q = query(
        sessionsRef,
        where('tribeId', '==', tribe.id),
        where('status', '==', 'ended'),
        orderBy('startTime', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const sessions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          roomName: data.roomName,
          hostName: data.hostName,
          startTime: data.startTime.toDate(),
          duration: data.duration,
          participantCount: data.participantCount,
          recordingUrl: data.recordingUrl
        };
      });
      
      setPastSessions(sessions);
    };
    
    fetchPastSessions();
    */
  }, [tribe?.id]);

  const handleJoinSession = (roomName: string) => {
    navigate(`/session?tribe=${tribe?.id}&room=${encodeURIComponent(roomName)}`);
  };

  const handleStartLiveSession = () => {
    const roomName = `${tribe?.name}-${Date.now()}`;
    navigate(`/session?tribe=${tribe?.id}&room=${encodeURIComponent(roomName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light-green to-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse" />
          <p className="text-lg text-foreground font-medium">Loading your tribe...</p>
        </div>
      </div>
    );
  }

  if (!tribe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-light-green to-background">
        <div className="text-center">
          <p className="text-lg text-foreground font-medium">Tribe not found</p>
        </div>
      </div>
    );
  }

  return (
    <Layout onDashboardToggle={() => setDashboardOpen(true)}>
      <DashboardSidebar isOpen={dashboardOpen} onClose={() => setDashboardOpen(false)} />
      <div className="min-h-screen bg-gradient-to-b from-light-green to-background">
        {/* Leaderboard Ad */}
        <div className="max-w-[1920px] mx-auto px-4 pt-6">
          <div className="flex justify-center mb-6">
            <AdSense
              slot="YOUR_LEADERBOARD_SLOT_ID"
              className="w-full"
              style={{ display: "block", minHeight: 90 }}
            />
          </div>
        </div>
        
        <div className="max-w-[1920px] mx-auto flex gap-6 px-4 pb-6">
          
          {/* LEFT COLUMN - Sessions & Memberships */}
          <aside className="hidden lg:block w-80 space-y-4 sticky top-24 h-fit">
            {/* Sponsored Ad */}
            <TribeAdBanner />

            {/* Past Sessions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground px-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Past Sessions
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pastSessions.slice(0, 3).map(session => (
                  <PastSessionCard 
                    key={session.id}
                    session={session}
                    onWatchReplay={(url) => window.open(url, '_blank')}
                  />
                ))}
              </div>
            </div>

            {/* Your Tribes */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground px-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Your Tribes
              </h3>
              <Card>
                <CardContent className="p-2 space-y-1">
                  {userTribes.map(userTribe => (
                    <Link to={`/my-tribe/${userTribe.id}`} key={userTribe.id}>
                      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">
                            {userTribe.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{userTribe.name}</p>
                          <p className="text-xs text-muted-foreground">{userTribe.memberCount} members</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </aside>
          
          {/* MIDDLE COLUMN - Horizontal Tribe Overview + Feed */}
          <main className="flex-1 max-w-4xl mx-auto space-y-6">
            {/* Horizontal Tribe Overview - Sticky */}
            <div className="sticky top-20 z-10 bg-background pb-4">
              <TribeOverview 
                tribe={tribe}
                isAdmin={isAdmin}
                horizontal={true}
                onEdit={() => toast.info("Edit tribe feature coming soon")}
                onManage={() => toast.info("Manage members feature coming soon")}
              />
            </div>
            
            {/* Tribe Feed */}
            <TribeFeed 
              currentTribeId={tribe.id}
              userTribeIds={userTribes.map(t => t.id)}
            />
          </main>
          
          {/* RIGHT COLUMN - Active Sessions, Live Now, Suggested Tribes */}
          <aside className="hidden lg:block w-80 space-y-4 sticky top-24 h-fit max-h-[calc(100vh-8rem)]">
            {/* House Ad */}
            <HouseAd
              href="https://your-offer.example.com"
              img="/ads/house-300x250.jpg"
              alt="Your Offer"
            />
            
            {/* AdSense Rectangle */}
            <AdSense
              slot="YOUR_RECTANGLE_SLOT_ID"
              className="w-full"
              style={{ display: "block", minHeight: 250 }}
            />
            
            {/* Active Sessions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground px-2">Active Sessions</h3>
              <LiveSessionCard 
                session={activeSessions.find(s => s.tribeId === tribe.id) || null}
                onJoinSession={handleJoinSession}
              />
              {isAdmin && (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleStartLiveSession}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              )}
            </div>
            
            {/* Live Now - Multiple Sessions */}
            <LiveNowCard 
              sessions={activeSessions}
              onJoinSession={handleJoinSession}
            />
            
            {/* Suggested Tribes */}
            <SuggestedTribesCard 
              tribes={suggestedTribes}
              onJoinTribe={(tribeId) => {
                toast.info(`Joining tribe: ${tribeId}`);
              }}
            />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
