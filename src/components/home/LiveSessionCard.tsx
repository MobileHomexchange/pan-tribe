import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Video } from "lucide-react";

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

interface LiveSessionCardProps {
  session: TribeSession;
  onJoin: () => void;
}

export function LiveSessionCard({ session, onJoin }: LiveSessionCardProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-3 hover:bg-social-hover transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-destructive">
            <AvatarFallback className="bg-destructive text-destructive-foreground">
              {session.tribeName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm">{session.tribeName}</h4>
          <p className="text-xs text-muted-foreground">Hosted by {session.hostName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{session.participantCount} watching</span>
        </div>
        <Button
          size="sm"
          onClick={onJoin}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Video className="w-4 h-4 mr-1" />
          Join
        </Button>
      </div>
    </div>
  );
}
