import React, { useEffect, useState } from "react";
import AdSense from "./AdSense";
import HouseAd from "./HouseAd";

type Props = {
  adsenseSlot?: string;
  houseImage?: string;
  houseHref?: string;
  delayMs?: number;
};

export default function MobileStickyBanner({
  adsenseSlot,
  houseImage = "/ads/house-300x250.jpg",
  houseHref = "https://your-offer.example.com",
  delayMs = 800,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-2 z-50 sm:hidden px-2">
      <div className="mx-auto max-w-md rounded-xl border bg-white/90 backdrop-blur shadow-lg">
        <div className="flex justify-end">
          <button
            aria-label="Close"
            onClick={() => setVisible(false)}
            className="m-1 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="px-3 pb-3">
          {adsenseSlot ? (
            <AdSense
              slot={adsenseSlot}
              format="auto"
              style={{ display: "block", minHeight: 80 }}
            />
          ) : (
            <HouseAd image={houseImage} href={houseHref} />
          )}
        </div>
      </div>
    </div>
  );
}
