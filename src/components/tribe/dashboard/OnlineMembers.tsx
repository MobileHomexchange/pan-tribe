import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OnlineMember {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

interface OnlineMembersProps {
  members: OnlineMember[];
}

export function OnlineMembers({ members }: OnlineMembersProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Online Now
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            {members.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="relative">
                  <Avatar className="w-8 h-8 ring-2 ring-card">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate font-medium">{member.name}</p>
                  {member.status && (
                    <p className="text-xs text-muted-foreground truncate">{member.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
