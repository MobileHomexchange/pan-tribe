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
        {/* Sidebar (hidden on mobile, visible on tablet/desktop) */}
        <div className="hidden md:flex">
          <AppSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 pt-16 pb-5 bg-background">
            {children ? (
              children
            ) : (
              <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 px-2 sm:px-4 md:px-6">
                {/* Feed section */}
                <div className="lg:col-span-2 w-full">
                  <MainFeed />

                  {/* RightSidebar moves below feed on mobile */}
                  <div className="block lg:hidden mt-6 space-y-4">
                    <RightSidebar />
                  </div>
                </div>

                {/* Desktop sidebar */}
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
