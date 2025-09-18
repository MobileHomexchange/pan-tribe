import React from "react";
import { useNavigate } from "react-router-dom";
import { StoriesComponent } from "./StoriesComponent";
import { PostComponent } from "./PostComponent";

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
        <PostComponent />

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

// Main App Component - now just the HomeScreen since routing is handled by main App
const AppMobileSkeleton = () => (
  <>
    <HomeScreen />
    <BottomNav />
  </>
);

export default AppMobileSkeleton;