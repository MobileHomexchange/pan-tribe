import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { ExternalLink } from "lucide-react";

interface TribeAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  priority: number;
}

export function TribeAdBanner() {
  const [ad, setAd] = useState<TribeAd | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ads, setAds] = useState<TribeAd[]>([]);

  useEffect(() => {
    const adsRef = collection(db, "tribeAds");
    const q = query(
      adsRef,
      where("isActive", "==", true),
      orderBy("priority", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TribeAd[];
      
      setAds(adsData);
      if (adsData.length > 0) {
        setAd(adsData[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Rotate ads every 30 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % ads.length;
        setAd(ads[next]);
        return next;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [ads]);

  const handleAdClick = async () => {
    if (!ad) return;

    try {
      const adRef = doc(db, "tribeAds", ad.id);
      await updateDoc(adRef, {
        clicks: increment(1)
      });
      window.open(ad.link, "_blank");
    } catch (error) {
      console.error("Error tracking ad click:", error);
      window.open(ad.link, "_blank");
    }
  };

  if (!ad) {
    return (
      <div className="bg-muted rounded-lg p-4 text-center border border-border">
        <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
        <div className="bg-background rounded h-[250px] flex items-center justify-center">
          <span className="text-muted-foreground text-sm">300x250 Ad</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
      <div className="bg-muted/50 px-3 py-1.5 border-b border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Sponsored</p>
      </div>
      <div 
        onClick={handleAdClick}
        className="cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div className="aspect-[300/250] relative overflow-hidden">
          <img 
            src={ad.imageUrl} 
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                {ad.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ad.description}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
