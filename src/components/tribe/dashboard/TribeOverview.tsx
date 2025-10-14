import { Settings, Users, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TribeOverviewProps {
  tribe: {
    id: string;
    name: string;
    category?: string;
    memberCount?: number;
    avatar?: string;
  };
  isAdmin: boolean;
  onEdit: () => void;
  onManage: () => void;
}

export function TribeOverview({ tribe, isAdmin, onEdit, onManage }: TribeOverviewProps) {
  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Avatar className="w-10 h-10 ring-2 ring-primary/10">
            <AvatarImage src={tribe.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
              {tribe.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">{tribe.name}</h3>
            {tribe.category && (
              <Badge variant="secondary" className="mt-1 text-xs bg-primary/10 text-primary border-0">
                {tribe.category}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{tribe.memberCount || 0}</span>
          <span>members</span>
        </div>

        {isAdmin && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={onManage}
            >
              <Settings className="w-4 h-4" />
              Manage
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
