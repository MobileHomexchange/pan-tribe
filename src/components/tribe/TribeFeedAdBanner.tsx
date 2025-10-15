import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, orderBy, limit, doc, updateDoc, increment } from "firebase/firestore";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  priority: number;
}

export function TribeFeedAdBanner() {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    // Try to fetch from tribeAds first, fallback to general ads
    const tribeAdsQuery = query(
      collection(db, "tribeAds"),
      where("isActive", "==", true),
      orderBy("priority", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(tribeAdsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const adData = snapshot.docs[0];
        setAd({ id: adData.id, ...adData.data() } as Ad);
      } else {
        // Fallback to general ads collection
        const generalAdsQuery = query(
          collection(db, "ads"),
          where("isActive", "==", true),
          orderBy("priority", "desc"),
          limit(1)
        );

        const generalUnsubscribe = onSnapshot(generalAdsQuery, (generalSnapshot) => {
          if (!generalSnapshot.empty) {
            const adData = generalSnapshot.docs[0];
            setAd({ id: adData.id, ...adData.data() } as Ad);
          } else {
            setAd(null);
          }
        });

        return generalUnsubscribe;
      }
    });

    return unsubscribe;
  }, []);

  const handleAdClick = async (adId: string, link: string) => {
    try {
      // Try to update in tribeAds first
      const tribeAdRef = doc(db, "tribeAds", adId);
      const today = new Date().toISOString().split("T")[0];
      
      await updateDoc(tribeAdRef, {
        clicks: increment(1),
        [`dailyClicks.${today}`]: increment(1),
      }).catch(async () => {
        // If not found in tribeAds, try general ads
        const adRef = doc(db, "ads", adId);
        await updateDoc(adRef, {
          clicks: increment(1),
          [`dailyClicks.${today}`]: increment(1),
        });
      });
      
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to track ad click:", error);
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  if (!ad) return null;

  return (
    <div className="sticky top-20 z-30 w-full bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-md border-b border-border shadow-sm mb-4 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Sponsored Label */}
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide shrink-0">
          Sponsored
        </span>

        {/* Ad Content */}
        <button
          onClick={() => handleAdClick(ad.id, ad.link)}
          className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
        >
          {/* Ad Image - Leaderboard style (728x90 desktop, 320x50 mobile) */}
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="h-[60px] md:h-[70px] w-auto object-contain rounded"
            />
          )}

          {/* Ad Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground line-clamp-2">
              {ad.title}
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </button>
      </div>
    </div>
  );
}
