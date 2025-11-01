import React from "react";

/**
 * FloatingMobileBanner
 * Small, dismissible banner fixed to the bottom of small screens only.
 * Use it for personal/house promos or a smaller AdSense unit.
 */
export default function FloatingMobileBanner() {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;

  return (
    <div className="lg:hidden fixed left-1/2 -translate-x-1/2 bottom-3 z-40 w-[94%] max-w-md">
      <div className="rounded-xl border bg-white/95 backdrop-blur shadow-lg">
        <div className="flex items-center gap-3 p-3">
          <img
            src="/images/ads/mini-320x50.png"
            alt="Offer"
            className="h-10 w-auto rounded"
          />
          <div className="text-sm">
            <div className="font-semibold">Grow Your Tribe</div>
            <div className="text-gray-600">Boost your reach in minutes.</div>
          </div>
          <button
            className="ml-auto inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
