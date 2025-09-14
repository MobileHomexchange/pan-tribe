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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Temporarily removing TooltipProvider wrapper */}
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  </QueryClientProvider>
);

export default App;
