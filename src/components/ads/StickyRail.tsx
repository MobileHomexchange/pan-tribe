import React from "react";

/**
 * StickyRail
 * Right-column ad rail with two independently sticky ad slots.
 * - Slot A: sticks under the header
 * - Slot B: sits a bit lower so both can be visible on tall screens
 *
 * Replace the <img> or <div> placeholders with your AdSense component
 * if you’ve already wired it (client/slot). This ships with safe placeholders.
 */
export default function StickyRail() {
  return (
    <aside className="hidden lg:block">
      <div className="space-y-6">
        {/* Sticky Slot A */}
        <div className="sticky top-24">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {/* Replace this with your <AdSense client="pub-XXXX" slot="YYYY" /> */}
            <img
              src="/images/ads/leaderboard-728x90.png"
              alt="Ad – Leaderboard"
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* Sticky Slot B */}
        <div className="sticky top-[420px]">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {/* Replace this with your <AdSense client="pub-XXXX" slot="ZZZZ" /> */}
            <img
              src="/images/ads/rectangle-300x250.png"
              alt="Ad – Rectangle"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
