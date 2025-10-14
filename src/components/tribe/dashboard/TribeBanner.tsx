import { Camera, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TribeBannerProps {
  banner?: string;
  avatar?: string;
  name: string;
  category?: string;
  memberCount?: number;
  isAdmin?: boolean;
  onEditBanner?: () => void;
}

export function TribeBanner({
  banner,
  avatar,
  name,
  category,
  memberCount = 0,
  isAdmin = false,
  onEditBanner
}: TribeBannerProps) {
  const defaultBanner = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop";
  
  return (
    <div className="relative h-64 rounded-t-2xl overflow-hidden shadow-card">
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
        style={{ backgroundImage: `url(${banner || defaultBanner})` }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      
      {/* Tribe info overlay */}
      <div className="absolute bottom-6 left-6 flex items-end gap-4 z-10">
        <Avatar className="w-24 h-24 border-4 border-card shadow-elegant ring-2 ring-primary/20">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
            {name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-card mb-2">
          <h1 className="text-3xl font-bold drop-shadow-lg mb-1">{name}</h1>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <span className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              {memberCount} members
            </span>
            {category && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="bg-accent/20 text-card border-0">
                  {category}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit button (only for admins) */}
      {isAdmin && (
        <Button 
          size="sm" 
          variant="secondary"
          className="absolute top-4 right-4 z-10 bg-card/90 hover:bg-card backdrop-blur-sm"
          onClick={onEditBanner}
        >
          <Camera className="w-4 h-4 mr-2" />
          Edit Banner
        </Button>
      )}
    </div>
  );
}
