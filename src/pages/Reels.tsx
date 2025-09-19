import React from "react";
import ReelsHorizontal from "@/components/ReelsHorizontal";
import ReelsHorizontalResponsive from "@/components/ReelsHorizontalResponsive";
import { useIsMobile } from "@/hooks/use-mobile";

const Reels = () => {
  const isMobile = useIsMobile();
  
  // On mobile, render full-screen responsive component that breaks out of all layout constraints
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <ReelsHorizontalResponsive />
      </div>
    );
  }
  
  return <ReelsHorizontal />;
};

export default Reels;