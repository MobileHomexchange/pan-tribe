import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface SuggestedTribe {
  id: string;
  name: string;
  description?: string;
  category: string;
  memberCount: number;
  avatar?: string;
}

interface SuggestedTribesCardProps {
  tribes: SuggestedTribe[];
  onJoinTribe: (tribeId: string) => void;
}

export function SuggestedTribesCard({ tribes, onJoinTribe }: SuggestedTribesCardProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">✨ Suggested Tribes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tribes.map((tribe) => (
          <div 
            key={tribe.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="w-12 h-12 ring-2 ring-primary/10">
              <AvatarImage src={tribe.avatar} alt={tribe.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">
                {tribe.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-foreground">{tribe.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                  {tribe.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {tribe.memberCount}
                </span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onJoinTribe(tribe.id)}
              className="shrink-0"
            >
              Join
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
