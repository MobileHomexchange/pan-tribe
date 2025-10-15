import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// Temporarily removing TooltipProvider to isolate the issue
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTribe from "./pages/MyTribe";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import SocialCommerce from "./pages/SocialCommerce";
import AdsManager from "./pages/AdsManager";
import Events from "./pages/Events";
import Saved from "./pages/Saved";
import CreatePost from "./pages/CreatePost";
import BlogSubmissions from "./pages/BlogSubmissions";
import Photos from "./pages/Photos";
import Music from "./pages/Music";
import Art from "./pages/Art";
import Tech from "./pages/Tech";
import Blogs from "./pages/Blogs";
import MyEvents from "./pages/MyEvents";
import EventHistory from "./pages/EventHistory";
import EventSettings from "./pages/EventSettings";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import FirebaseTest from "./pages/FirebaseTest";
import ErrorBoundary from "./components/ErrorBoundary";
import { GroupDetail } from "./components/tribe/GroupDetail";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import UserManagement from "./admin/users/UserManagement";
import TribeManagement from "./admin/tribes/TribeManagement";
import ContentModeration from "./admin/content/ContentModeration";
import FeatureToggles from "./admin/features/FeatureToggles";
import MonetizationManagement from "./admin/monetization/MonetizationManagement";
import UnifiedAdsDashboard from "./admin/monetization/UnifiedAdsDashboard";
import BlogManagement from "./admin/blog/BlogManagement";
import EventAnalytics from "./admin/events/EventAnalytics";

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
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feed" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/my-tribe" element={<ProtectedRoute><MyTribe /></ProtectedRoute>} />
              <Route path="/my-tribe/group/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
              <Route path="/social-commerce" element={<ProtectedAdminRoute><SocialCommerce /></ProtectedAdminRoute>} />
              <Route path="/ads" element={<ProtectedRoute><AdsManager /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
              <Route path="/blog-submissions" element={<ProtectedAdminRoute><BlogSubmissions /></ProtectedAdminRoute>} />
              <Route path="/blogs" element={<ProtectedAdminRoute><Blogs /></ProtectedAdminRoute>} />
              <Route path="/photos" element={<ProtectedRoute><Photos /></ProtectedRoute>} />
              <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
              <Route path="/art" element={<ProtectedRoute><Art /></ProtectedRoute>} />
              <Route path="/tech" element={<ProtectedRoute><Tech /></ProtectedRoute>} />
              <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
              <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
              <Route path="/event-history" element={<ProtectedRoute><EventHistory /></ProtectedRoute>} />
              <Route path="/event-settings" element={<ProtectedRoute><EventSettings /></ProtectedRoute>} />
              <Route path="/firebase-test" element={<FirebaseTest />} />
              
              {/* Admin Routes - Protected by admin role */}
              <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="tribes" element={<TribeManagement />} />
                <Route path="content" element={<ContentModeration />} />
                <Route path="features" element={<FeatureToggles />} />
                <Route path="monetization" element={<MonetizationManagement />} />
                <Route path="ads-dashboard" element={<UnifiedAdsDashboard />} />
                <Route path="blog-management" element={<BlogManagement />} />
                <Route path="event-analytics" element={<EventAnalytics />} />
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
