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
  const [swipeCount, setSwipeCount] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const handlers = useSwipeable({
    onSwipedLeft: () => rotateAd(),
    onSwipedRight: () => rotateAd(),
    trackMouse: true,
  });

  const rotateAd = () => {
    setSwipeCount((prev) => prev + 1);
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

  // Rotate ad on mount
  useEffect(() => {
    rotateAd();
  }, []);

  // Auto-hide banner during video play
  useEffect(() => {
    const handleVisibility = () => {
      const videoPlaying = document.querySelector("video.playing");
      setShowBanner(!videoPlaying);
    };
    document.addEventListener("play", handleVisibility, true);
    document.addEventListener("pause", handleVisibility, true);
    return () => {
      document.removeEventListener("play", handleVisibility, true);
      document.removeEventListener("pause", handleVisibility, true);
    };
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
      className="relative w-screen h-screen flex items-center justify-center bg-black cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Video Content */}
      <video src={currentAd.content} autoPlay loop muted playsInline className="w-full h-full object-contain" />

      {/* Sponsored Label */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">Sponsored</div>

      {/* Personal Ad Every 10 Swipes */}
      {swipeCount > 0 && swipeCount % 10 === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30">
          <div className="w-3/4 max-w-sm p-4 bg-white rounded-lg shadow-lg text-center">
            <a href="https://yourpersonalpromo.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/ads/personal-banner.jpg"
                alt="Personal Banner"
                className="rounded-md mb-2 w-full object-cover"
              />
              <p className="text-sm text-gray-800">Sponsored by You — Promote your brand here!</p>
            </a>
          </div>
        </div>
      )}

      {/* Floating Mobile Banner (bottom) */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <div className="mx-auto w-full max-w-md p-2">
            <a href="https://youradlink.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/ads/mobile-banner.jpg"
                alt="Mobile Ad Banner"
                className="rounded-lg shadow-md w-full object-cover"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
