import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ReelsHorizontalResponsive from "./ReelsHorizontalResponsive";

// Mock components (replace with your Firebase data later)
const StoriesComponent = () => (
  <div className="flex overflow-x-auto py-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="min-w-[80px] h-[80px] mr-2 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm"
      >
        Story {i + 1}
      </div>
    ))}
  </div>
);

const PostComponent = () => (
  <div className="w-full bg-card mb-2 p-4 rounded-lg shadow-sm border">
    <div className="font-semibold text-card-foreground">User Name</div>
    <div className="my-3 text-card-foreground">This is a post content example.</div>
    <div className="flex justify-between text-muted-foreground">
      <span>❤️ 10</span>
      <span>💬 5</span>
      <span>🔁 2</span>
    </div>
  </div>
);

const ReelsPreviewHorizontal = ({ navigate }: { navigate: (path: string) => void }) => (
  <div className="flex overflow-x-auto py-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="min-w-[150px] h-[250px] mr-2 rounded-lg bg-black text-white flex items-center justify-center cursor-pointer"
        onClick={() => navigate("/reels")}
      >
        Reel {i + 1}
      </div>
    ))}
  </div>
);

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
        {[...Array(3)].map((_, i) => (
          <PostComponent key={i} />
        ))}

        {/* Reels Preview */}
        <ReelsPreviewHorizontal navigate={navigate} />
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
        onClick={() => navigate("/reels")}
        className="text-2xl hover:bg-accent hover:text-accent-foreground p-2 rounded"
      >
        🎬
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
      <Route path="/reels" element={<ReelsHorizontalResponsive />} />
      {/* Add Friends, Profile routes here */}
      <Route path="*" element={<HomeScreen />} />
    </Routes>
    <BottomNav />
  </Router>
);

export default AppMobileSkeleton;