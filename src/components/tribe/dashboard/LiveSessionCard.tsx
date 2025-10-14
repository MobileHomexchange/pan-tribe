import { Video, Users, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveSession {
  id: string;
  roomName: string;
  hostName: string;
  startTime: Date;
  participantCount: number;
}

interface LiveSessionCardProps {
  session: LiveSession | null;
  onJoinSession?: (roomName: string) => void;
}

export function LiveSessionCard({ session, onJoinSession }: LiveSessionCardProps) {
  if (!session) {
    return (
      <Card className="border-border bg-muted/30">
        <CardContent className="py-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">No live session currently</p>
          <p className="text-xs text-muted-foreground mt-1">Check back later or start one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary bg-gradient-to-br from-light-green to-card relative overflow-hidden shadow-elegant">
      {/* Pulsing animation background */}
      <div className="absolute inset-0 bg-primary/5 animate-pulse" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-primary rounded-full relative" />
            </div>
            <CardTitle className="text-primary flex items-center gap-2">
              <span className="text-xl">🟢</span>
              LIVE NOW
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Users className="w-3 h-3 mr-1" />
            {session.participantCount} watching
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Room</p>
            <p className="font-semibold text-foreground text-lg">{session.roomName}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Hosted by</p>
              <p className="font-medium text-foreground">{session.hostName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Started</p>
              <p className="font-medium text-foreground flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(session.startTime, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all"
          onClick={() => onJoinSession?.(session.roomName)}
        >
          <Video className="w-5 h-5 mr-2" />
          Join Live Session
        </Button>
      </CardContent>
    </Card>
  );
}
