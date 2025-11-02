import React from "react";
import AdSense from "./AdSense";
import HouseAd from "./HouseAd";

/**
 * Right-rail ads that stick as you scroll on desktop.
 * - Top: house ad (your promo)
 * - Bottom: AdSense rectangle or second house
 */
type Props = {
  topHouse?: { image: string; href: string; title?: string; subtitle?: string };
  bottomSlot?: string; // AdSense slot for rectangle (e.g., 300x250, responsive)
  bottomHouseFallback?: { image: string; href: string; title?: string; subtitle?: string };
};

export default function StickyRightRail({
  topHouse = {
    image: "/ads/house-300x250.jpg",
    href: "https://your-offer.example.com",
    title: "Grow Your Tribe",
    subtitle: "Promote your community today."
  },
  bottomSlot = "YOUR_RECTANGLE_SLOT_ID",
  bottomHouseFallback = {
    image: "/ads/house-300x250.jpg",
    href: "https://your-offer.example.com",
    title: "Reach More People",
    subtitle: "Smart tools. Real growth."
  },
}: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-4">
        <HouseAd
          image={topHouse.image}
          href={topHouse.href}
          title={topHouse.title}
          subtitle={topHouse.subtitle}
        />

        {/* AdSense rectangle (fallback to house if no slot provided) */}
        {bottomSlot ? (
          <AdSense
            slot={bottomSlot}
            style={{ display: "block", minHeight: 250 }}
          />
        ) : (
          <HouseAd
            image={bottomHouseFallback.image}
            href={bottomHouseFallback.href}
            title={bottomHouseFallback.title}
            subtitle={bottomHouseFallback.subtitle}
          />
        )}
      </div>
    </aside>
  );
}
