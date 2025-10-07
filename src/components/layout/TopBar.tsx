import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm md:px-6">
      {/* Left Section - Logo + Menu Icon */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* App Name / Logo */}
        <h1 className="text-lg font-semibold text-pan-green">Tribe Pulse</h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Example placeholder for future icons or profile */}
        {/* <UserIcon className="h-5 w-5 text-gray-700" /> */}
      </div>
    </header>
  );
}
