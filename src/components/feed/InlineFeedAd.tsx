import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";
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

interface InlineFeedAdProps {
  adIndex: number;
}

export function InlineFeedAd({ adIndex }: InlineFeedAdProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "ads"),
      where("isActive", "==", true),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedAds = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ad[];
      setAds(fetchedAds);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      // Rotate through ads based on adIndex
      const selectedAd = ads[adIndex % ads.length];
      setCurrentAd(selectedAd);
    }
  }, [ads, adIndex]);

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

  if (!currentAd) return null;

  return (
    <div className="w-full bg-card rounded-xl shadow-md p-5 border border-border">
      {/* Sponsored Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-500">
            Sponsored
          </span>
        </div>
      </div>

      {/* Ad Content */}
      <button
        onClick={() => handleAdClick(currentAd.id, currentAd.link)}
        className="w-full group"
      >
        {/* Ad Image */}
        {currentAd.imageUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden bg-muted">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Ad Title and Link */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {currentAd.title}
          </h3>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </button>
    </div>
  );
}
