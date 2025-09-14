import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MainFeed } from "@/components/feed/MainFeed";
import { RightSidebar } from "@/components/layout/RightSidebar";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <MainFeed />
              </div>
              <div className="hidden lg:block">
                <RightSidebar />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}