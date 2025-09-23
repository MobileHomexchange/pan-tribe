import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, increment, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DrumHitFeatureProps {
  eventId: string;
}

interface DrumHitData {
  total: number;
  byUser: Record<string, number>;
}

interface LiveEventData {
  isLive: boolean;
  drumHits: DrumHitData;
}

export function DrumHitFeature({ eventId }: DrumHitFeatureProps) {
  const [isLive, setIsLive] = useState(false);
  const [drumHitData, setDrumHitData] = useState<DrumHitData>({ total: 0, byUser: {} });
  const [isHitting, setIsHitting] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates for the live event
    const eventRef = doc(db, "liveEvents", eventId);
    
    const unsubscribe = onSnapshot(eventRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as LiveEventData;
        setIsLive(data.isLive || false);
        setDrumHitData(data.drumHits || { total: 0, byUser: {} });
      } else {
        // Initialize document if it doesn't exist
        initializeEvent();
      }
    });

    return unsubscribe;
  }, [eventId]);

  const initializeEvent = async () => {
    try {
      const eventRef = doc(db, "liveEvents", eventId);
      await setDoc(eventRef, {
        isLive: false,
        drumHits: {
          total: 0,
          byUser: {}
        }
      }, { merge: true });
    } catch (error) {
      console.error('Error initializing event:', error);
    }
  };

  const hitDrum = async () => {
    if (!currentUser || !isLive || isHitting) return;

    setIsHitting(true);

    try {
      const eventRef = doc(db, "liveEvents", eventId);
      
      // Update total hits and user-specific hits
      await updateDoc(eventRef, {
        "drumHits.total": increment(1),
        [`drumHits.byUser.${currentUser.uid}`]: increment(1)
      });

      // Optional: Add some visual/audio feedback here
      // You can add animation or sound effects

      toast({
        title: "Drum Hit! 🥁",
        description: "Your drum hit has been registered!",
      });

    } catch (error: any) {
      toast({
        title: "Failed to Hit Drum",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsHitting(false);
    }
  };

  const userHits = currentUser ? drumHitData.byUser[currentUser.uid] || 0 : 0;
  const topHitters = Object.entries(drumHitData.byUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Card className="bg-card shadow-card border border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <span className="text-2xl">🥁</span>
          Hit the Drum
          {!isLive && (
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              Event Not Live
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Drum Button */}
        <div className="text-center">
          <Button
            onClick={hitDrum}
            disabled={!isLive || !currentUser || isHitting}
            className={`w-32 h-32 rounded-full text-6xl transition-all duration-200 ${
              isLive && currentUser 
                ? "bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 active:scale-95 shadow-lg" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isHitting ? "💥" : "🥁"}
          </Button>
          
          <div className="mt-3 space-y-1">
            {!isLive && (
              <p className="text-sm text-muted-foreground">
                Drum hits are only available during live events
              </p>
            )}
            {isLive && !currentUser && (
              <p className="text-sm text-muted-foreground">
                Please log in to hit the drum
              </p>
            )}
            {isLive && currentUser && (
              <p className="text-sm text-foreground">
                Tap the drum to show your energy!
              </p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{drumHitData.total}</div>
            <div className="text-sm text-muted-foreground">Total Hits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-foreground">{userHits}</div>
            <div className="text-sm text-muted-foreground">Your Hits</div>
          </div>
        </div>

        {/* Top Hitters Leaderboard */}
        {topHitters.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Top Hitters</h4>
            <div className="space-y-2">
              {topHitters.map(([userId, hits], index) => (
                <div key={userId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{index + 1}</span>
                    <span className="text-foreground">
                      {userId === currentUser?.uid ? "You" : `User ${userId.slice(-4)}`}
                    </span>
                  </div>
                  <span className="font-medium text-primary">{hits} hits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}