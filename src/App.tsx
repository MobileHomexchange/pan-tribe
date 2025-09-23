import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Temporarily removing TooltipProvider to isolate the issue
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import CreatePost from "./pages/CreatePost";
import Reels from "./pages/Reels";
import Careers from "./pages/Careers";
import BlogSubmissions from "./pages/BlogSubmissions";
import Photos from "./pages/Photos";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { GroupDetail } from "./components/tribe/GroupDetail";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import UserManagement from "./admin/users/UserManagement";
import TribeManagement from "./admin/tribes/TribeManagement";
import ContentModeration from "./admin/content/ContentModeration";
import FeatureToggles from "./admin/features/FeatureToggles";
import MonetizationManagement from "./admin/monetization/MonetizationManagement";

const queryClient = new QueryClient();


const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/my-tribe" element={<ProtectedRoute><MyTribe /></ProtectedRoute>} />
              <Route path="/my-tribe/group/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
              <Route path="/social-commerce" element={<ProtectedRoute><SocialCommerce /></ProtectedRoute>} />
              <Route path="/ads" element={<ProtectedRoute><AdsManager /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/reels" element={<ProtectedRoute><Reels /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
              <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
              <Route path="/blog-submissions" element={<ProtectedRoute><BlogSubmissions /></ProtectedRoute>} />
              <Route path="/photos" element={<ProtectedRoute><Photos /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="tribes" element={<TribeManagement />} />
                <Route path="content" element={<ContentModeration />} />
                <Route path="features" element={<FeatureToggles />} />
                <Route path="monetization" element={<MonetizationManagement />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
