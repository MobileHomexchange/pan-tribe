import React from "react";
import ReelsHorizontal from "@/components/ReelsHorizontal";
import ReelsHorizontalResponsive from "@/components/ReelsHorizontalResponsive";
import { useIsMobile } from "@/hooks/use-mobile";

const Reels = () => {
  const isMobile = useIsMobile();
  
  // On mobile, render full-screen responsive component directly
  // On desktop, render within layout
  return isMobile ? <ReelsHorizontalResponsive /> : <ReelsHorizontal />;
};

export default Reels;