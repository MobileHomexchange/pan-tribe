import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { LeftSidebar } from "@/components/tribe/dashboard/LeftSidebar";
import { TribeBanner } from "@/components/tribe/dashboard/TribeBanner";
import { LiveSessionCard } from "@/components/tribe/dashboard/LiveSessionCard";
import { PastSessionCard } from "@/components/tribe/dashboard/PastSessionCard";
import { TribeInsights } from "@/components/tribe/dashboard/TribeInsights";
import { OnlineMembers } from "@/components/tribe/dashboard/OnlineMembers";
import { TribeChat } from "@/components/tribe/TribeChat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  roomName: string;
  hostName: string;
  startTime: Date;
  participantCount: number;
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
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [tribeStats, setTribeStats] = useState<TribeStats>({
    totalMinutes: 1250,
    totalSessions: 24,
    activeMembers: 156
  });
  const [onlineMembers] = useState<OnlineMember[]>([
    { id: "1", name: "Kwame Asante", status: "In session" },
    { id: "2", name: "Amina Diallo", status: "Available" },
    { id: "3", name: "Thabo Johnson", status: "Available" },
    { id: "4", name: "Nia Mbeki", status: "In session" },
    { id: "5", name: "Zuri Williams", status: "Available" }
  ]);
  const [userTribes] = useState([
    { id: "tech", name: "Tech Innovators", memberCount: 234 },
    { id: "music", name: "African Beats", memberCount: 567 },
    { id: "business", name: "Entrepreneurs Hub", memberCount: 890 }
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

    // Mock active session for demo
    const mockSession: LiveSession = {
      id: "session-1",
      roomName: "Weekly Tribe Gathering",
      hostName: "Kwame Asante",
      startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      participantCount: 12
    };
    
    setActiveSession(mockSession);

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
    <div className="min-h-screen bg-gradient-to-b from-light-green to-background">
      <div className="max-w-[1920px] mx-auto flex gap-6 px-4 py-6">
        {/* Left Sidebar */}
        <LeftSidebar 
          isAdmin={isAdmin}
          userTribes={userTribes}
          onEditTribe={() => toast.info("Edit tribe feature coming soon")}
          onManageMembers={() => toast.info("Manage members feature coming soon")}
        />
        
        {/* Center Feed */}
        <main className="flex-1 max-w-3xl mx-auto space-y-6">
          {/* Tribe Banner */}
          <TribeBanner 
            banner={tribe.banner}
            avatar={tribe.avatar}
            name={tribe.name}
            category={tribe.category}
            memberCount={tribe.memberCount}
            isAdmin={isAdmin}
            onEditBanner={() => toast.info("Edit banner feature coming soon")}
          />

          {/* Description Card */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <p className="text-foreground leading-relaxed">{tribe.description}</p>
          </div>

          {/* Action Bar */}
          <div className="flex gap-3">
            <Button 
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg"
              onClick={handleStartLiveSession}
            >
              <Video className="w-5 h-5 mr-2" />
              Start Live Session
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => toast.info("Create post feature coming soon")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Live Session Card */}
          <LiveSessionCard 
            session={activeSession}
            onJoinSession={handleJoinSession}
          />

          {/* Past Sessions Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Past Sessions
            </h2>
            {pastSessions.map(session => (
              <PastSessionCard 
                key={session.id}
                session={session}
                onWatchReplay={(url) => window.open(url, '_blank')}
              />
            ))}
          </div>

          {/* Tribe Insights */}
          <div className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Tribe Insights</h2>
            <TribeInsights stats={tribeStats} />
          </div>
        </main>
        
        {/* Right Sidebar - Desktop */}
        <aside className="hidden lg:block w-96 space-y-4">
          <OnlineMembers members={onlineMembers} />
          <TribeChat />
        </aside>
      </div>

      {/* Mobile Chat Toggle */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            className="lg:hidden fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl bg-primary hover:bg-primary/90"
            size="icon"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <div className="h-full flex flex-col">
            <OnlineMembers members={onlineMembers} />
            <div className="flex-1">
              <TribeChat />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
