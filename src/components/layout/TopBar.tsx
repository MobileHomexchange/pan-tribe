import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus } from "lucide-react";

interface TopBarProps {
  onMenuToggle?: () => void;
  onDashboardToggle?: () => void;
}

export function TopBar({ onMenuToggle, onDashboardToggle }: TopBarProps) {
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
        {/* Dashboard Icon */}
        {onDashboardToggle && (
          <button
            onClick={onDashboardToggle}
            className="flex items-center justify-center p-2 rounded-lg bg-terracotta text-white hover:bg-terracotta/90 transition"
            aria-label="Open Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </button>
        )}

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
