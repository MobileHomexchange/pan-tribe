import { useState, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import MainFeed from "@/components/feed/MainFeed";
import { RightSidebar } from "@/components/layout/RightSidebar";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Left sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page content */}
          <main className="flex-1 pt-16 pb-5">
            {children ? (
              children
            ) : (
              <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 px-3 sm:px-4 md:px-6">
                {/* Main Feed */}
                <div className="lg:col-span-2">
                  <MainFeed />

                  {/* Mobile Ads Section (shows below feed) */}
                  <div className="block lg:hidden mt-6 space-y-4">
                    <RightSidebar />
                  </div>
                </div>

                {/* Desktop Right Sidebar (ads + widgets) */}
                <div className="hidden lg:block px-5">
                  <RightSidebar />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
export function RightSidebar() {
  return (
    <aside className="space-y-6">
      {/* Google Ad Banner */}
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

      {/* Custom or Personal Banner */}
      <a href="https://your-promo-link.com" target="_blank" rel="noopener noreferrer">
        <img src="/ads/promo-banner.jpg" alt="Promotion" className="w-full rounded-lg shadow-lg object-cover" />
      </a>
    </aside>
  );
}
