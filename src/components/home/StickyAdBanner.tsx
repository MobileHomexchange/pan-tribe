import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { ExternalLink } from "lucide-react";
import { doc, updateDoc, increment } from "firebase/firestore";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  priority: number;
}

export function StickyAdBanner() {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "ads"),
      where("isActive", "==", true),
      orderBy("priority", "desc"),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const adData = snapshot.docs[0];
        setAd({ id: adData.id, ...adData.data() } as Ad);
      } else {
        setAd(null);
      }
    });

    return unsub;
  }, []);

  const handleAdClick = async (adId: string, link: string) => {
    try {
      const adRef = doc(db, "ads", adId);
      const today = new Date().toISOString().split("T")[0];
      
      await updateDoc(adRef, {
        clicks: increment(1),
        [`dailyClicks.${today}`]: increment(1),
      });
      
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to track ad click:", error);
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  if (!ad) return null;

  return (
    <div className="hidden md:block sticky top-0 z-20 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-[90px] gap-4">
          {/* Advertisement Label */}
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Advertisement
          </span>

          {/* Ad Content */}
          <button
            onClick={() => handleAdClick(ad.id, ad.link)}
            className="flex items-center gap-4 flex-1 max-w-3xl hover:opacity-80 transition-opacity"
          >
            {/* Ad Image */}
            {ad.imageUrl && (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="h-[70px] w-auto object-contain rounded"
              />
            )}

            {/* Ad Title */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-foreground line-clamp-2">
                {ad.title}
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
