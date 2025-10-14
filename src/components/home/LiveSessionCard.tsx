import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Radio } from "lucide-react";

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
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/my-tribe?session=${session.roomName}`);
  };

  return (
    <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border-2 border-destructive/20 p-4 hover:border-destructive/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
            </span>
            <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
              Live Now
            </span>
          </div>
          <h4 className="font-semibold text-sm mb-1">{session.tribeName}</h4>
          <p className="text-xs text-muted-foreground">Hosted by {session.hostName}</p>
        </div>
        
        <Radio className="h-5 w-5 text-destructive animate-pulse" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{session.participantCount} watching</span>
        </div>
        
        <Button
          size="sm"
          className="bg-destructive hover:bg-destructive/90 text-white"
          onClick={handleJoin}
        >
          Join Now
        </Button>
      </div>
    </div>
  );
}
