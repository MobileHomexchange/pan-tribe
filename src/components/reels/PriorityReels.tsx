import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdData } from "@/types/ads";
import { selectWeightedAd } from "@/lib/adSelector";
import { useAuth } from "@/contexts/AuthContext";

interface Props { 
  reels: AdData[]; 
  preferPremium?: boolean; 
}

export default function PriorityReels({ reels, preferPremium = true }: Props) {
  const { currentUser } = useAuth();
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => rotateAd(),
    onSwipedRight: () => rotateAd(),
    trackMouse: true,
  });

  const rotateAd = () => {
    const ad = selectWeightedAd(reels, preferPremium);
    setCurrentAd(ad);
    if (ad) trackImpression(ad);
  };

  const trackImpression = async (ad: AdData) => {
    await updateDoc(doc(db, "reelsAds", ad.id), {
      impressions: increment(1),
      [`dailyImpressions.${new Date().toISOString().split("T")[0]}`]: increment(1),
    });
  };

  const handleClick = async () => {
    if (!currentAd || !currentUser) return;
    await updateDoc(doc(db, "reelsAds", currentAd.id), {
      clicks: increment(1),
      [`uniqueClicks.${currentUser.uid}`]: serverTimestamp(),
      [`dailyClicks.${new Date().toISOString().split("T")[0]}`]: increment(1),
    });
  };

  useEffect(() => { 
    rotateAd(); 
  }, []);

  if (!currentAd) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground">
        No Ads Available
      </div>
    );
  }

  return (
    <div 
      {...handlers} 
      className="w-screen h-screen flex items-center justify-center bg-black cursor-pointer" 
      onClick={handleClick}
    >
      <video 
        src={currentAd.content} 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="w-full h-full object-contain" 
      />
      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
        Sponsored
      </div>
    </div>
  );
}