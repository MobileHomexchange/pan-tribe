import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus } from "lucide-react";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-card border-b border-border shadow-sm flex items-center justify-between px-4 py-2">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-foreground"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-pan-green">Tribe Pulse</h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/create-post")}
          className="flex items-center gap-2 bg-pan-green text-white px-3 py-2 rounded-lg hover:bg-pan-green/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Post</span>
        </button>

        <button
          onClick={() => navigate("/feed")}
          className="flex items-center justify-center p-2 rounded-lg hover:bg-muted transition"
        >
          <Home className="w-5 h-5 text-pan-green" />
        </button>
      </div>
    </header>
  );
}

export default TopBar;
