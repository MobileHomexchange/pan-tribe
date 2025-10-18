// Layout.tsx
import React, { useState, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { HeaderBanner } from "@/components/layout/HeaderBanner";
import MainFeed from "@/components/feed/MainFeed";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
  onDashboardToggle?: () => void;
}

export function Layout({ children, onDashboardToggle }: LayoutProps = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const location = useLocation();

  // Check if we're on the "my tribe" page
  const isMyTribePage = location.pathname === "/my-tribe" || location.pathname.includes("tribe");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Left Sidebar - Hide on tribe pages */}
        {!isMyTribePage && <AppSidebar />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <TopBar 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onDashboardToggle={onDashboardToggle}
          />

          {/* Header Banner */}
          <HeaderBanner onHeightChange={setBannerHeight} />

          {/* Main Content */}
          <main className="flex-1 pb-5" style={{ paddingTop: `${64 + bannerHeight}px` }}>
            {children ? (
              children
            ) : (
              <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-5 px-4">
                {/* Main Feed - Adjusted for better spacing */}
                <div className="lg:col-span-2">
                  <MainFeed />
                </div>

                {/* Right Sidebar for Ads */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-20">
                    <RightSidebar />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
