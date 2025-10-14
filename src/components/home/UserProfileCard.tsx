import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileCardProps {
  userName: string;
  userAvatar: string;
  tribeName: string;
  status: string;
}

export function UserProfileCard({
  userName,
  userAvatar,
  tribeName,
  status,
}: UserProfileCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-14 h-14 border-2 border-primary">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{userName}</h3>
          <p className="text-sm text-muted-foreground">{tribeName}</p>
          <Badge variant="secondary" className="mt-1 text-xs">
            {status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
