import { Clock, Users, Play } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PastSession {
  id: string;
  roomName: string;
  hostName: string;
  startTime: Date;
  duration: number;
  participantCount: number;
  recordingUrl?: string;
}

interface PastSessionCardProps {
  session: PastSession;
  onWatchReplay?: (recordingUrl: string) => void;
}

export function PastSessionCard({ session, onWatchReplay }: PastSessionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
              {session.hostName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg text-foreground">{session.roomName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Hosted by <span className="font-medium text-foreground">{session.hostName}</span> • {format(session.startTime, 'MMM d, h:mm a')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{session.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span>{session.participantCount} attended</span>
          </div>
        </div>
        
        {session.recordingUrl ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onWatchReplay?.(session.recordingUrl!)}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Replay
          </Button>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-2 bg-muted rounded-md">
            Recording not available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
