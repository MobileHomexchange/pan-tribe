import React from "react";
import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuToggle?: () => void;
  onDashboardToggle?: () => void;
}

export function TopBar({ onMenuToggle, onDashboardToggle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left - Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Center - Logo / Title */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Tribe Pulse</h1>
        </div>

        {/* Right - Dashboard / Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onDashboardToggle}
            className="hidden sm:inline-flex bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
