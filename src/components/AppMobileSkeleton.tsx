import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { StoriesComponent } from "./StoriesComponent";
import { PostComponent } from "./PostComponent";

const HomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="pb-[70px] bg-background min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 bg-card p-4 font-bold text-lg border-b border-border z-10">
        TribalPulse
      </div>

      <div className="px-4">
        {/* Stories */}
        <StoriesComponent />

        {/* Posts */}
        <PostComponent />
      </div>
    </div>
  );
};

// Bottom Navigation Bar
const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 w-full h-[60px] flex justify-around items-center bg-card border-t border-border z-50">
      <button 
        onClick={() => navigate("/home")}
        className="text-2xl hover:bg-accent hover:text-accent-foreground p-2 rounded"
      >
        🏠
      </button>
      <button 
        onClick={() => navigate("/friends")}
        className="text-2xl hover:bg-accent hover:text-accent-foreground p-2 rounded"
      >
        👥
      </button>
      <button 
        onClick={() => navigate("/profile")}
        className="text-2xl hover:bg-accent hover:text-accent-foreground p-2 rounded"
      >
        👤
      </button>
    </div>
  );
};

// Main App Component
const AppMobileSkeleton = () => (
  <Router>
    <Routes>
      <Route path="/home" element={<HomeScreen />} />
      {/* Add Friends, Profile routes here */}
      <Route path="*" element={<HomeScreen />} />
    </Routes>
    <BottomNav />
  </Router>
);

export default AppMobileSkeleton;