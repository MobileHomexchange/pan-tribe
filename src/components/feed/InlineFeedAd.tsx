import React from "react";
import AdSense from "@/components/ads/AdSense";

export function InlineFeedAd({ adIndex }: { adIndex: number }) {
  return (
    <div className="my-6 flex justify-center">
      <AdSense
        slot="YOUR_INFEED_SLOT_ID"   // replace with your slot
        format="auto"
        style={{ display: "block", minHeight: 120, width: "100%" }}
      />
    </div>
  );
}
