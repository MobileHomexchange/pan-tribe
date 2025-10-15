import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TribeShortcut {
  id: string;
  name: string;
  avatar?: string;
  memberCount: number;
}

interface YourTribesCardProps {
  userTribes: TribeShortcut[];
}

export function YourTribesCard({ userTribes }: YourTribesCardProps) {
  if (userTribes.length === 0) {
    return (
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Your Tribes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tribes yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-md">
      <CardHeader>
        <CardTitle className="text-sm text-foreground">Your Tribes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {userTribes.map(tribe => (
          <Link to={`/my-tribe/${tribe.id}`} key={tribe.id}>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
              <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-primary transition-all">
                <AvatarImage src={tribe.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
                  {tribe.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {tribe.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tribe.memberCount} members
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
