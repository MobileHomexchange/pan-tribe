import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Temporarily removing TooltipProvider to isolate the issue
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyTribe from "./pages/MyTribe";
import Friends from "./pages/Friends";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import SocialCommerce from "./pages/SocialCommerce";
import AdsManager from "./pages/AdsManager";
import Events from "./pages/Events";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <div>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-tribe" element={<MyTribe />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/social-commerce" element={<SocialCommerce />} />
            <Route path="/ads" element={<AdsManager />} />
        <Route path="/events" element={<Events />} />
        <Route path="/saved" element={<Saved />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
