import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, ExternalLink, Megaphone, Calendar, Sparkles } from "lucide-react";
import { HeaderBanner as HeaderBannerType } from "@/types/banner";

interface HeaderBannerProps {
  onHeightChange?: (height: number) => void;
}

export function HeaderBanner({ onHeightChange }: HeaderBannerProps) {
  const [activeBanners, setActiveBanners] = useState<HeaderBannerType[]>([]);
  const [currentBanner, setCurrentBanner] = useState<HeaderBannerType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch active banners from Firestore
  useEffect(() => {
    const now = new Date();
    const bannersQuery = query(
      collection(db, "headerBanners"),
      where("isActive", "==", true),
      orderBy("priority", "desc"),
    );

    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const banners: HeaderBannerType[] = [];
      const dismissed = JSON.parse(localStorage.getItem("dismissedBanners") || "[]");

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as HeaderBannerType;
        const startDate = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
        const endDate = data.endDate ? (data.endDate instanceof Date ? data.endDate : new Date(data.endDate)) : null;

        if (startDate <= now && (!endDate || endDate >= now) && !dismissed.includes(docSnap.id)) {
          banners.push({ ...data, id: docSnap.id });
        }
      });

      setActiveBanners(banners);

      if (banners.length > 0) {
        setCurrentBanner(banners[0]);
        setCurrentIndex(0);
        setIsVisible(true);
        trackBannerView(banners[0].id);
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    if (activeBanners.length <= 1 || !currentBanner?.autoRotate) return;

    const interval = setInterval(
      () => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % activeBanners.length;
          setCurrentBanner(activeBanners[next]);
          trackBannerView(activeBanners[next].id);
          return next;
        });
      },
      (currentBanner.rotationInterval || 30) * 1000,
    );

    return () => clearInterval(interval);
  }, [activeBanners, currentBanner]);

  // Height communication to Layout
  useEffect(() => {
    if (onHeightChange) onHeightChange(isVisible ? 60 : 0);
  }, [isVisible, onHeightChange]);

  // === Tracking Functions ===
  const trackBannerView = async (bannerId: string) => {
    try {
      await updateDoc(doc(db, "headerBanners", bannerId), { views: increment(1) });
    } catch (error) {
      console.error("Error tracking banner view:", error);
    }
  };

  const trackBannerClick = async (bannerId: string) => {
    try {
      await updateDoc(doc(db, "headerBanners", bannerId), { clicks: increment(1) });
    } catch (error) {
      console.error("Error tracking banner click:", error);
    }
  };

  // === Handlers ===
  const handleDismiss = async (bannerId: string) => {
    const dismissed = JSON.parse(localStorage.getItem("dismissedBanners") || "[]");
    localStorage.setItem("dismissedBanners", JSON.stringify([...dismissed, bannerId]));

    try {
      await updateDoc(doc(db, "headerBanners", bannerId), { dismissals: increment(1) });
    } catch (error) {
      console.error("Error tracking dismissal:", error);
    }

    const remaining = activeBanners.filter((b) => b.id !== bannerId);
    setActiveBanners(remaining);
    setIsVisible(false);

    if (remaining.length > 0) {
      setTimeout(() => {
        setCurrentBanner(remaining[0]);
        setCurrentIndex(0);
        setIsVisible(true);
      }, 300);
    }
  };

  const handleBannerClick = (banner: HeaderBannerType) => {
    if (!banner.link) return;
    trackBannerClick(banner.id);
    if (banner.link.startsWith("http")) {
      window.open(banner.link, "_blank");
    } else {
      window.location.href = banner.link;
    }
  };

  // === UI Helpers ===
  const getBannerIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="w-5 h-5" />;
      case "event":
        return <Calendar className="w-5 h-5" />;
      case "mood":
        return <Sparkles className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getBannerStyles = (banner: HeaderBannerType) => {
    if (banner.bgColor && banner.textColor) {
      return { custom: true, bgColor: banner.bgColor, textColor: banner.textColor };
    }

    switch (banner.type) {
      case "announcement":
        return { custom: false, className: "bg-yellow-50 text-yellow-900 border-yellow-200" };
      case "ad":
        return {
          custom: false,
          className: "bg-gradient-to-r from-primary/10 to-primary/5 text-foreground border-primary/20",
        };
      case "mood":
        return {
          custom: false,
          className: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900 border-purple-200",
        };
      case "event":
        return {
          custom: false,
          className: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-blue-200",
        };
      default:
        return { custom: false, className: "bg-card text-foreground border-border" };
    }
  };

  if (!isVisible || !currentBanner) return null;

  const styles = getBannerStyles(currentBanner);

  return (
    <div
      className={`fixed top-14 left-0 right-0 z-40 border-b shadow-sm animate-fade-in ${
        styles.custom ? "" : styles.className
      }`}
      style={styles.custom ? { backgroundColor: styles.bgColor, color: styles.textColor } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Left: Icon + Text */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          {currentBanner.icon ? (
            <span className="text-2xl flex-shrink-0">{currentBanner.icon}</span>
          ) : (
            <span className="flex-shrink-0">{getBannerIcon(currentBanner.type)}</span>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {currentBanner.type === "ad" && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-black/10">Sponsored</span>
              )}
              <h3 className="font-semibold text-sm md:text-base truncate">{currentBanner.title}</h3>
            </div>
            <p className="text-xs md:text-sm opacity-90 line-clamp-1">{currentBanner.message}</p>
          </div>
        </div>

        {/* Right: CTA + Dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentBanner.link && (
            <button
              onClick={() => handleBannerClick(currentBanner)}
              className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors flex items-center gap-1"
            >
              {currentBanner.linkText || "Learn More"}
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {currentBanner.isDismissible && (
            <button
              onClick={() => handleDismiss(currentBanner.id)}
              className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rotation Progress Indicator */}
      {activeBanners.length > 1 && currentBanner.autoRotate && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10">
          <div
            className="h-full bg-black/30 animate-progress"
            style={{ animationDuration: `${currentBanner.rotationInterval || 30}s` }}
          />
        </div>
      )}
    </div>
  );
}

export default HeaderBanner;
