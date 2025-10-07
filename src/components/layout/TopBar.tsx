import { Menu } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { scrollY } = useScroll();

  // Motion transforms for opacity and position
  const opacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const y = useTransform(scrollY, [0, 100], [0, -5]);

  const [hasShadow, setHasShadow] = useState(false);

  // Add shadow only when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      style={{ opacity, y }}
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white md:px-6 transition-shadow duration-300 ${
        hasShadow ? "shadow-md border-b border-gray-100" : "shadow-sm border-transparent"
      }`}
    >
      {/* Left Section - Logo + Menu Icon */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* App Title */}
        <h1 className="text-lg font-semibold text-pan-green">Tribe Pulse</h1>
      </div>

      {/* Right Section - Placeholder for icons/actions */}
      <div className="flex items-center gap-3">
        {/* <Bell className="h-5 w-5 text-gray-700" /> */}
        {/* <UserCircle className="h-6 w-6 text-gray-700" /> */}
      </div>
    </motion.header>
  );
}
