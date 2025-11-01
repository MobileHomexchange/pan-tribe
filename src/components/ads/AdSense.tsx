import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type Props = {
  /** Your AdSense slot ID */
  slot: string;
  /** Default "auto". Can be "auto" | "fluid" | "rectangle" | "horizontal" */
  format?: string;
  /** If true, <ins> can grow/shrink to full width */
  responsive?: boolean;
  /** Optional: AdSense layout key for fluid units */
  layoutKey?: string;
  /** Optional style (width/height/minHeight, etc.) */
  style?: React.CSSProperties;
};

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
}: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore if blocked */
    }
  }, [slot]);

  return (
    <ins
      className="adsbygoogle"
      style={style ?? { display: "block" }}
      data-ad-client={import.meta.env.VITE_GADS_CLIENT}  // set in .env
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } as any : {})}
    />
  );
}
