import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
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

// TEMP: routes are public to verify rendering. Re-wrap with your ProtectedRoute later.
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App (TEMP public) */}
          <Route path="/feed" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/my-tribe" element={<MyTribe />} />
          <Route path="/my-tribe/group/:groupId" element={<GroupDetail />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-post" element={<CreatePost />} />

          {/* Admin (nested) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="tribes" element={<TribeManagement />} />
            <Route path="content" element={<ContentModeration />} />
            <Route path="features" element={<FeatureToggles />} />
            <Route path="monetization" element={<MonetizationManagement />} />
            <Route path="ads-dashboard" element={<UnifiedAdsDashboard />} />
            <Route path="blog-management" element={<BlogManagement />} />
            <Route path="event-analytics" element={<EventAnalytics />} />
            <Route path="social-commerce-accounts" element={<SocialCommerceAccountManagement />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
