import { Link } from "react-router-dom";
import { Edit, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TribeShortcut {
  id: string;
  name: string;
  avatar?: string;
  memberCount: number;
}

interface LeftSidebarProps {
  isAdmin?: boolean;
  userTribes?: TribeShortcut[];
  onEditTribe?: () => void;
  onManageMembers?: () => void;
}

export function LeftSidebar({ 
  isAdmin = false, 
  userTribes = [],
  onEditTribe,
  onManageMembers
}: LeftSidebarProps) {
  return (
    <aside className="hidden xl:block w-80 space-y-6">
      {/* Google Ad Placeholder */}
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Sponsored</p>
          <div className="bg-gradient-to-br from-light-green to-light-gold rounded-lg h-64 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">300x250 Ad Space</span>
          </div>
        </CardContent>
      </Card>

      {/* Admin Controls */}
      {isAdmin && (
        <Card className="border-primary/20 bg-light-green/30">
          <CardHeader>
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={onEditTribe}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Tribe Info
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={onManageMembers}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Members
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Tribes Shortcuts */}
      {userTribes.length > 0 && (
        <Card>
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
      )}
    </aside>
  );
}
