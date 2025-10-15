import { Video, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveSession {
  id: string;
  tribeId: string;
  tribeName: string;
  roomName: string;
  hostName: string;
  startTime: Date;
  participantCount: number;
}

interface LiveNowCardProps {
  sessions: LiveSession[];
  onJoinSession: (roomName: string) => void;
}

export function LiveNowCard({ sessions, onJoinSession }: LiveNowCardProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            Live Now
          </span>
          {sessions.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {sessions.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Video className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No live sessions currently</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors space-y-2"
            >
              <p className="text-xs text-muted-foreground">{session.tribeName}</p>
              <h4 className="font-semibold text-sm text-foreground leading-tight">
                {session.roomName}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Host: {session.hostName}</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {session.participantCount}
                </span>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => onJoinSession(session.roomName)}
              >
                Join Session
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
