import React from "react";
import ReelsHorizontal from "@/components/ReelsHorizontal";
import ReelsHorizontalResponsive from "@/components/ReelsHorizontalResponsive";
import { useIsMobile } from "@/hooks/use-mobile";

const Reels = () => {
  const isMobile = useIsMobile();
  
  // On mobile, render full-screen responsive component
  // On desktop, render within layout
  if (isMobile) {
    return <ReelsHorizontalResponsive />;
  }
  
  return <ReelsHorizontal />;
};

export default Reels;