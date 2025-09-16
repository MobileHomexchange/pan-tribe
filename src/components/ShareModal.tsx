import React from "react";
import { X, Link, Twitter, Facebook, MessageCircle, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
      initials: string;
    };
    content: string;
  };
  onClose: () => void;
  onShare: (platform: string) => void;
  open: boolean;
}

export function ShareModal({ post, onClose, onShare, open }: ShareModalProps) {
  const { toast } = useToast();

  const shareOptions = [
    { 
      platform: "Copy Link", 
      icon: Link, 
      color: "text-social-muted hover:text-card-foreground",
      action: () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl).then(() => {
          toast({
            description: "Link copied to clipboard!",
          });
        });
        onShare("Copy Link");
      }
    },
    { 
      platform: "Twitter", 
      icon: Twitter, 
      color: "text-social-muted hover:text-blue-400",
      action: () => onShare("Twitter")
    },
    { 
      platform: "Facebook", 
      icon: Facebook, 
      color: "text-social-muted hover:text-blue-600",
      action: () => onShare("Facebook")
    },
    { 
      platform: "WhatsApp", 
      icon: MessageCircle, 
      color: "text-social-muted hover:text-green-500",
      action: () => onShare("WhatsApp")
    },
    { 
      platform: "Telegram", 
      icon: Send, 
      color: "text-social-muted hover:text-blue-500",
      action: () => onShare("Telegram")
    },
    { 
      platform: "Email", 
      icon: Mail, 
      color: "text-social-muted hover:text-gray-600",
      action: () => onShare("Email")
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-4 border-b border-social-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-card-foreground">
              Share Post
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          <p className="text-social-muted mb-4">Share this post with others:</p>
          
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.platform}
                  variant="ghost"
                  onClick={option.action}
                  className="flex flex-col h-auto p-4 hover:bg-social-hover transition-colors"
                >
                  <IconComponent className={`w-6 h-6 mb-2 ${option.color} transition-colors`} />
                  <span className="text-xs font-medium text-card-foreground">
                    {option.platform}
                  </span>
                </Button>
              );
            })}
          </div>
          
          {/* Post Preview */}
          <div className="mt-4 p-3 bg-social-hover rounded-lg border border-social-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pan-green to-pan-black flex items-center justify-center text-pan-gold font-bold text-xs">
                {post.author.initials}
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {post.author.name}
              </span>
            </div>
            <p className="text-sm text-card-foreground line-clamp-2">
              {post.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}