import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Bookmark, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TribeLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { name: "Feed", icon: Home, href: "/feed" },
    { name: "My Tribe", icon: Users, href: "/my-tribe" },
    { name: "Saved", icon: Bookmark, href: "/saved" },
    { name: "Profile", icon: UserCircle2, href: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r bg-white p-4">
        <h2 className="text-xl font-bold mb-6 text-green-700">Tribe Pulse</h2>
        <ul className="space-y-2">
          {navItems.map(({ name, icon: Icon, href }) => {
            const isActive = location.pathname === href;
            
            return (
              <li key={name}>
                <Link
                  to={href}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md hover:bg-green-50 transition",
                    isActive && "bg-green-100 font-semibold text-green-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
