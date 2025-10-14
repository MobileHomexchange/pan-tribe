import { Link } from "react-router-dom";
import { Home, Users, ShoppingBag, Film, ChevronRight, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileCard } from "@/components/home/UserProfileCard";

interface NavigationLink {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

interface TribeShortcut {
  id: string;
  name: string;
  avatar?: string;
  memberCount: number;
}

interface HomeLeftSidebarProps {
  userName: string;
  userAvatar: string;
  tribeName?: string;
  status?: string;
  navigationLinks: NavigationLink[];
  onCreatePost: () => void;
  onGoLive: () => void;
  userTribes?: TribeShortcut[];
}

export function HomeLeftSidebar({ 
  userName,
  userAvatar,
  tribeName = "My Tribe",
  status = "Active",
  navigationLinks,
  onCreatePost,
  onGoLive,
  userTribes = []
}: HomeLeftSidebarProps) {
  return (
    <aside className="hidden xl:block w-80 space-y-6">
      {/* Google Ad Placeholder #1 */}
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Sponsored</p>
          <div className="bg-gradient-to-br from-light-green to-light-gold rounded-lg h-64 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">300x250 Ad Space</span>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <UserProfileCard 
        userName={userName}
        userAvatar={userAvatar}
        tribeName={tribeName}
        status={status}
      />

      {/* Navigation Links */}
      <Card>
        <CardContent className="p-4 space-y-1">
          {navigationLinks.map((link, index) => (
            <Link to={link.path} key={index}>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                <div className={`w-8 h-8 ${link.color} rounded-lg flex items-center justify-center`}>
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onCreatePost}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onGoLive}
          >
            <Video className="w-4 h-4 mr-2" />
            Go Live
          </Button>
        </CardContent>
      </Card>

      {/* Google Ad Placeholder #2 */}
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Sponsored</p>
          <div className="bg-gradient-to-br from-light-green to-light-gold rounded-lg h-64 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">300x250 Ad Space</span>
          </div>
        </CardContent>
      </Card>

      {/* Tribe Shortcuts */}
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
