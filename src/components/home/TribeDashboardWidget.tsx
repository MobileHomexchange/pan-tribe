import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, Video } from "lucide-react";

interface TribeDashboardWidgetProps {
  sessionsJoined: number;
  followers: number;
  tribeCount: number;
  isAdmin: boolean;
  onStartSession: () => void;
}

export function TribeDashboardWidget({
  sessionsJoined,
  followers,
  tribeCount,
  isAdmin,
  onStartSession,
}: TribeDashboardWidgetProps) {
  return (
    <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4">
      <h3 className="font-semibold text-foreground mb-4">Tribe Dashboard</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-3 bg-background rounded-lg">
          <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{sessionsJoined}</p>
          <p className="text-xs text-muted-foreground">Sessions</p>
        </div>
        <div className="text-center p-3 bg-background rounded-lg">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{followers}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div className="text-center p-3 bg-background rounded-lg">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{tribeCount}</p>
          <p className="text-xs text-muted-foreground">Tribes</p>
        </div>
      </div>

      {/* Admin Action */}
      {isAdmin && (
        <Button
          onClick={onStartSession}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          <Video className="w-4 h-4 mr-2" />
          Start Live Session
        </Button>
      )}
    </div>
  );
}
