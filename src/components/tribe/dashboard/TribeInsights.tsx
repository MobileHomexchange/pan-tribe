import { Clock, Video, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TribeStats {
  totalMinutes: number;
  totalSessions: number;
  activeMembers: number;
}

interface TribeInsightsProps {
  stats: TribeStats;
}

export function TribeInsights({ stats }: TribeInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="text-center hover:shadow-lg transition-shadow border-primary/20">
        <CardContent className="pt-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {stats.totalMinutes.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Total Minutes</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-primary">
            <TrendingUp className="w-3 h-3" />
            <span>+12% this week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-shadow border-accent/20">
        <CardContent className="pt-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center">
            <Video className="w-6 h-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-accent to-destructive bg-clip-text text-transparent">
            {stats.totalSessions}
          </p>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Total Sessions</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-accent">
            <TrendingUp className="w-3 h-3" />
            <span>3 this month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="text-center hover:shadow-lg transition-shadow border-destructive/20">
        <CardContent className="pt-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-destructive/10 to-destructive/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-destructive to-accent bg-clip-text text-transparent">
            {stats.activeMembers}
          </p>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Active Members</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-destructive">
            <TrendingUp className="w-3 h-3" />
            <span>+5 joined</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
