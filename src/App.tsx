import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";

// Public / Core
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// App pages
import Home from "./pages/Home";
import MyTribe from "./pages/MyTribe";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import CreatePost from "./pages/CreatePost";

// Admin
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
import SocialCommerceAccountManagement from "./admin/socialcommerce/SocialCommerceAccountManagement";

// Tribe detail
import { GroupDetail } from "./components/tribe/GroupDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <div>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* App (protected) */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tribe"
              element={
                <ProtectedRoute>
                  <MyTribe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tribe/group/:groupId"
              element={
                <ProtectedRoute>
                  <GroupDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />

            {/* Admin (protected + nested via <Outlet/> in AdminLayout) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="tribes" element={<TribeManagement />} />
              <Route path="content" element={<ContentModeration />} />
              <Route path="features" element={<FeatureToggles />} />
              <Route path="monetization" element={<MonetizationManagement />} />
              <Route path="ads-dashboard" element={<UnifiedAdsDashboard />} />
              <Route path="blog-management" element={<BlogManagement />} />
              <Route path="event-analytics" element={<EventAnalytics />} />
              <Route
                path="social-commerce-accounts"
                element={<SocialCommerceAccountManagement />}
              />
              {/* Keep admin-only routes here as you add pages */}
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
