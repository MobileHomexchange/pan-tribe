import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  targetTribes?: string[];
  rotationWeight: number;
  isActive: boolean;
  timestamp: any;
}

export function AdRotator() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Fetch active ads from Firestore
  useEffect(() => {
    const adsQuery = query(
      collection(db, "ads"),
      where("isActive", "==", true),
      limit(10)
    );

    const unsubscribe = onSnapshot(adsQuery, (snapshot) => {
      const adsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ad[];
      setAds(adsData);
    });

    return () => unsubscribe();
  }, []);

  // Rotate ads every 12 seconds
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-4 text-center border border-border">
        <p className="text-xs text-muted-foreground mb-2">Sponsored</p>
        <div className="bg-background rounded h-[200px] flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No ads available</span>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="bg-card rounded-lg shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-3 bg-muted/50 border-b border-border">
        <p className="text-xs text-muted-foreground font-medium">Sponsored</p>
      </div>
      <a
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative overflow-hidden">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-3 bg-background">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm text-foreground line-clamp-2 flex-1">
              {currentAd.title}
            </h4>
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
        </div>
      </a>
      {ads.length > 1 && (
        <div className="flex items-center justify-center gap-1 p-2 bg-muted/30">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentAdIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
