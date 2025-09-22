import { Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-card border-b border-sidebar-border flex items-center justify-between px-5 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <h1 className="text-xl font-bold text-pan-green">Tribe Pulse</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      </div>
    </header>
  );
}