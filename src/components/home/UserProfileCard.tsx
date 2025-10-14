import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserProfileCard() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const displayName = currentUser.displayName || currentUser.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={currentUser.photoURL || undefined} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{displayName}</h3>
          <p className="text-sm text-muted-foreground">TribalPulse Member</p>
          <Badge variant="secondary" className="mt-1">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Online
          </Badge>
        </div>
      </div>
    </div>
  );
}
