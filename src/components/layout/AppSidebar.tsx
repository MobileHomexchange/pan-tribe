import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  Bookmark, 
  UserCheck, 
  History, 
  Store, 
  Calendar,
  TrendingUp,
  Music,
  Palette,
  Code,
  ChevronDown,
  Menu,
  Video,
  Briefcase,
  FileText
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Saved", url: "/saved", icon: Bookmark },
  { title: "My Tribe", url: "/my-tribe", icon: UserCheck },
  { title: "Reels", url: "/reels", icon: Video },
  { title: "Memories", url: "/memories", icon: History },
  { title: "Marketplace", url: "/marketplace", icon: Store },
  { title: "Social Commerce", url: "/social-commerce", icon: TrendingUp },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Careers", url: "/careers", icon: Briefcase },
  { title: "Blogs", url: "/blogs", icon: FileText },
  { title: "Ads Manager", url: "/ads", icon: TrendingUp },
];

const shortcuts = [
  { title: "African Music", url: "/music", icon: Music },
  { title: "Art Collective", url: "/art", icon: Palette },
  { title: "Tech Africa", url: "/tech", icon: Code },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [shortcutsExpanded, setShortcutsExpanded] = useState(true);
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-72"} transition-all duration-300`} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* User Profile */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 p-2">
                  <NavLink to="/" className={`flex items-center gap-3 hover:bg-sidebar-accent rounded-lg ${isActive("/") ? "bg-light-gold" : ""}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pan-green to-pan-black flex items-center justify-center text-pan-gold font-bold text-sm">
                      JS
                    </div>
                    {!collapsed && <span className="font-medium text-sidebar-foreground">John Smith</span>}
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
                      className={`flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-sidebar-accent transition-colors ${
                        isActive(item.url) ? "bg-light-gold" : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-light-gold flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-pan-green" />
                      </div>
                      {!collapsed && <span className="font-medium text-sidebar-foreground">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        {!collapsed && (
          <div className="h-px bg-sidebar-border mx-2 my-2" />
        )}

        {/* Shortcuts */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-sidebar-foreground font-semibold text-base">
              Your shortcuts
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {shortcuts.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-sidebar-accent transition-colors ${
                          isActive(item.url) ? "bg-light-gold" : ""
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-light-gold flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-pan-green" />
                        </div>
                        <span className="font-medium text-sidebar-foreground">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setShortcutsExpanded(!shortcutsExpanded)}
                    className="flex items-center gap-3 h-10 px-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-light-gold flex items-center justify-center">
                      <ChevronDown className={`h-5 w-5 text-pan-green transition-transform ${shortcutsExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    <span className="font-medium text-sidebar-foreground">See more</span>
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