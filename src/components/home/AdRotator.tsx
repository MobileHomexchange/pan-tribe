import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  targetTribes?: string[];
  isActive: boolean;
}

interface AdRotatorProps {
  ads: Ad[];
}

export function AdRotator({ ads }: AdRotatorProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-sm border border-border p-4">
        <p className="text-xs text-muted-foreground text-center mb-2">Sponsored</p>
        <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No ads available</p>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-3 bg-muted/30 border-b border-border">
        <p className="text-xs text-muted-foreground text-center">Sponsored</p>
      </div>
      
      <a
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-muted/20 transition-colors"
      >
        <img
          src={currentAd.imageUrl}
          alt={currentAd.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium line-clamp-2">{currentAd.title}</h4>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </a>

      {/* Ad indicator dots */}
      {ads.length > 1 && (
        <div className="flex items-center justify-center gap-1 pb-3">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
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
