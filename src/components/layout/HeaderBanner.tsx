import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, ExternalLink, Megaphone, Calendar, Sparkles } from "lucide-react";
import { HeaderBanner as HeaderBannerType } from "@/types/banner";

interface HeaderBannerProps {
  onHeightChange?: (height: number) => void;
}

export function HeaderBanner({ onHeightChange }: HeaderBannerProps) {
  const [currentBanner, setCurrentBanner] = useState<HeaderBannerType | null>(null);
  const [activeBanners, setActiveBanners] = useState<HeaderBannerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch active banners from Firebase
  useEffect(() => {
    const now = new Date();
    const bannersQuery = query(
      collection(db, "headerBanners"),
      where("isActive", "==", true),
      orderBy("priority", "desc")
    );

    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const banners: HeaderBannerType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as HeaderBannerType;
        const startDate = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
        const endDate = data.endDate ? (data.endDate instanceof Date ? data.endDate : new Date(data.endDate)) : null;

        // Check if banner is within date range
        if (startDate <= now && (!endDate || endDate >= now)) {
          // Check if not dismissed
          const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
          if (!dismissedBanners.includes(doc.id)) {
            banners.push({ ...data, id: doc.id });
          }
        }
      });

      setActiveBanners(banners);
      if (banners.length > 0) {
        setCurrentBanner(banners[0]);
        setIsVisible(true);
        
        // Track view
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

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % activeBanners.length;
        setCurrentBanner(activeBanners[nextIndex]);
        trackBannerView(activeBanners[nextIndex].id);
        return nextIndex;
      });
    }, (currentBanner.rotationInterval || 30) * 1000);

    return () => clearInterval(interval);
  }, [activeBanners, currentBanner, currentIndex]);

  // Track banner height changes
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(isVisible ? 60 : 0);
    }
  }, [isVisible, onHeightChange]);

  const trackBannerView = async (bannerId: string) => {
    try {
      const bannerRef = doc(db, "headerBanners", bannerId);
      await updateDoc(bannerRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error("Error tracking banner view:", error);
    }
  };

  const trackBannerClick = async (bannerId: string) => {
    try {
      const bannerRef = doc(db, "headerBanners", bannerId);
      await updateDoc(bannerRef, {
        clicks: increment(1)
      });
    } catch (error) {
      console.error("Error tracking banner click:", error);
    }
  };

  const handleDismiss = async (bannerId: string) => {
    const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
    localStorage.setItem('dismissedBanners', JSON.stringify([...dismissedBanners, bannerId]));
    
    try {
      const bannerRef = doc(db, "headerBanners", bannerId);
      await updateDoc(bannerRef, {
        dismissals: increment(1)
      });
    } catch (error) {
      console.error("Error tracking dismissal:", error);
    }

    setIsVisible(false);
    
    // Show next banner if available
    const nextBanners = activeBanners.filter(b => b.id !== bannerId);
    if (nextBanners.length > 0) {
      setTimeout(() => {
        setCurrentBanner(nextBanners[0]);
        setActiveBanners(nextBanners);
        setIsVisible(true);
      }, 300);
    }
  };

  const handleBannerClick = (banner: HeaderBannerType) => {
    if (banner.link) {
      trackBannerClick(banner.id);
      if (banner.link.startsWith('http')) {
        window.open(banner.link, '_blank');
      } else {
        window.location.href = banner.link;
      }
    }
  };

  const getBannerIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'mood':
        return <Sparkles className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getBannerStyles = (banner: HeaderBannerType) => {
    if (banner.bgColor && banner.textColor) {
      return {
        backgroundColor: banner.bgColor,
        color: banner.textColor,
        isCustom: true
      };
    }

    // Default styles by type
    switch (banner.type) {
      case 'announcement':
        return { className: 'bg-yellow-50 text-yellow-900 border-yellow-200', isCustom: false };
      case 'ad':
        return { className: 'bg-gradient-to-r from-primary/10 to-primary/5 text-foreground border-primary/20', isCustom: false };
      case 'mood':
        return { className: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900 border-purple-200', isCustom: false };
      case 'event':
        return { className: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-blue-200', isCustom: false };
      default:
        return { className: 'bg-card text-foreground border-border', isCustom: false };
    }
  };

  if (!isVisible || !currentBanner) return null;

  const styles = getBannerStyles(currentBanner);
  const customStyle = styles.isCustom ? { backgroundColor: styles.backgroundColor, color: styles.color } : {};

  return (
    <div
      className={`fixed top-14 left-0 right-0 z-25 border-b shadow-sm animate-fade-in ${styles.className || ''}`}
      style={customStyle}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Icon + Content */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          {currentBanner.icon ? (
            <span className="text-2xl flex-shrink-0">{currentBanner.icon}</span>
          ) : (
            <span className="flex-shrink-0">{getBannerIcon(currentBanner.type)}</span>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {currentBanner.type === 'ad' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-black/10">
                  Sponsored
                </span>
              )}
              <h3 className="font-semibold text-sm md:text-base truncate">
                {currentBanner.title}
              </h3>
            </div>
            <p className="text-xs md:text-sm opacity-90 line-clamp-1">
              {currentBanner.message}
            </p>
          </div>
        </div>

        {/* Right: CTA + Dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentBanner.link && (
            <button
              onClick={() => handleBannerClick(currentBanner)}
              className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors flex items-center gap-1"
            >
              {currentBanner.linkText || 'Learn More'}
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

      {/* Rotation indicator */}
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
