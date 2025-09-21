import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ClickableAvatarProps {
  userId?: string;
  userName?: string;
  userAvatar?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTooltip?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10", 
  lg: "w-12 h-12",
  xl: "w-16 h-16"
};

export function ClickableAvatar({
  userId,
  userName = "Unknown User",
  userAvatar,
  size = "md",
  className,
  showTooltip = false
}: ClickableAvatarProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="relative group">
      <Avatar 
        className={cn(
          sizeClasses[size],
          "cursor-pointer hover:scale-105 transition-transform duration-200",
          userId && "hover:ring-2 hover:ring-primary hover:ring-offset-2",
          className
        )}
        onClick={handleClick}
        title={showTooltip ? `View ${userName}'s profile` : undefined}
      >
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-black text-primary-foreground font-bold">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      
      {showTooltip && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          {userName}
        </div>
      )}
    </div>
  );
}