import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Radio, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TribeDashboardWidget() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        My Tribe Stats
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Sessions Joined</span>
          <span className="font-semibold">12</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tribe Members</span>
          <span className="font-semibold">248</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Posts</span>
          <span className="font-semibold">34</span>
        </div>
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90"
        onClick={() => navigate("/my-tribe")}
      >
        <Radio className="mr-2 h-4 w-4" />
        Go to MyTribe
      </Button>
    </div>
  );
}
