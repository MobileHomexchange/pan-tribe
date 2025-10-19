import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Bookmark,
  UserCheck,
  History,
  Calendar,
  TrendingUp,
  Music,
  Palette,
  Code,
  ChevronDown,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const allMainItems = [
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Saved", url: "/saved", icon: Bookmark },
  { title: "My Tribe", url: "/my-tribe", icon: UserCheck },
  { title: "Memories", url: "/memories", icon: History },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Ads Manager", url: "/ads", icon: DollarSign },
  { title: "Social Commerce", url: "/social-commerce", icon: TrendingUp, adminOnly: true },
  { title: "Blogs", url: "/blogs", icon: FileText, adminOnly: true },
];

const shortcuts = [
  { title: "African Music", url: "/music", icon: Music },
  { title: "Art Collective", url: "/art", icon: Palette },
  { title: "Tech Africa", url: "/tech", icon: Code },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [shortcutsExpanded, setShortcutsExpanded] = useState(true);
  const collapsed = state === "collapsed";

  const mainItems = allMainItems.filter((item) => !(item.adminOnly && !isAdmin));
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} transition-all duration-300 bg-white border-r border-gray-200`}
      collapsible="icon"
    >
      <SidebarContent className="overflow-y-auto">
        {/* User Profile */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 p-2">
                  <NavLink
                    to="/"
                    className={`flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-colors ${
                      isActive("/") ? "bg-light-gold" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pan-green to-pan-black flex items-center justify-center text-pan-gold font-bold text-sm">
                      JS
                    </div>
                    {!collapsed && <span className="font-medium text-gray-800 truncate">John Smith</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        isActive(item.url) ? "bg-light-gold" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-light-gold flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-4 w-4 text-pan-green" />
                      </div>
                      {!collapsed && <span className="font-medium text-gray-800 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        {!collapsed && <div className="h-px bg-gray-200 mx-2 my-2" />}

        {/* Shortcuts */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-gray-700 font-semibold text-base">Your shortcuts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {shortcutsExpanded &&
                  shortcuts.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-gray-100 transition-colors ${
                            isActive(item.url) ? "bg-light-gold" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-light-gold flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-4 w-4 text-pan-green" />
                          </div>
                          <span className="font-medium text-gray-800 truncate">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShortcutsExpanded(!shortcutsExpanded)}
                    className="flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-light-gold flex items-center justify-center flex-shrink-0">
                      <ChevronDown
                        className={`h-4 w-4 text-pan-green transition-transform ${
                          shortcutsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <span className="font-medium text-gray-800">{shortcutsExpanded ? "See less" : "See more"}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
