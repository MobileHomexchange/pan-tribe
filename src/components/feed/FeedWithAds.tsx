import React, { useState, useEffect } from "react";
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdData } from "@/types/ads";
import { selectWeightedAd } from "@/lib/adSelector";
import { useAuth } from "@/contexts/AuthContext";

interface Post { 
  id: string; 
  content: string; 
  type?: "post" | "ad"; 
}

interface Props { 
  posts: Post[]; 
  ads: AdData[]; 
  adFrequency?: number; 
  preferPremium?: boolean; 
  showAds?: boolean; 
}

export default function FeedWithAds({ 
  posts, 
  ads, 
  adFrequency = 4, 
  preferPremium = true, 
  showAds = true 
}: Props) {
  const { currentUser } = useAuth();
  const [feedItems, setFeedItems] = useState<Post[]>([]);

  useEffect(() => {
    if (!showAds || !ads.length) {
      setFeedItems(posts);
      return;
    }
    
    const newFeed: Post[] = [];
    posts.forEach((post, idx) => {
      newFeed.push(post);
      if ((idx + 1) % adFrequency === 0) {
        const ad = selectWeightedAd(ads, preferPremium);
        if (ad) {
          newFeed.push({ 
            id: `ad-${ad.id}-${idx}`, 
            content: ad.content, 
            type: "ad"
          });
        }
      }
    });
    setFeedItems(newFeed);
  }, [posts, ads, showAds, adFrequency, preferPremium]);

  const trackAdImpression = async (adId: string) => {
    await updateDoc(doc(db, "feedAds", adId), {
      impressions: increment(1),
      [`dailyImpressions.${new Date().toISOString().split("T")[0]}`]: increment(1),
    });
  };

  const trackAdClick = async (adId: string) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "feedAds", adId), {
      clicks: increment(1),
      [`uniqueClicks.${currentUser.uid}`]: serverTimestamp(),
      [`dailyClicks.${new Date().toISOString().split("T")[0]}`]: increment(1),
    });
  };

  const getAdId = (itemId: string) => {
    if (itemId.startsWith('ad-')) {
      const parts = itemId.split('-');
      return parts[1]; // Extract actual ad ID
    }
    return itemId;
  };

  return (
    <div className="space-y-6">
      {feedItems.map((item, idx) =>
        item.type === "ad" ? (
          <div 
            key={item.id} 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            onClick={() => {
              trackAdClick(getAdId(item.id));
              window.open("https://tribalpulse.app/promotions", "_blank");
            }}
            onMouseEnter={() => trackAdImpression(getAdId(item.id))}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90 mb-2">Sponsored</p>
                <p className="text-lg font-semibold">{item.content}</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </div>
        ) : (
          <div key={item.id} className="p-4 bg-card text-card-foreground rounded-lg shadow-sm border">
            {item.content}
          </div>
        )
      )}
    </div>
  );
}