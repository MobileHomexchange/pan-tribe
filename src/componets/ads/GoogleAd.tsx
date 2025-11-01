import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type Props = {
  /** Your AdSense slot ID (numbers) */
  slot: string;
  /** CSS style override (width/height) */
  style?: React.CSSProperties;
  /** ad format: "auto" | "horizontal" | "rectangle" etc. */
  format?: string;
  /** "true" to allow responsive fill */
  responsive?: "true" | "false";
};

export default function GoogleAd({
  slot,
  style,
  format = "auto",
  responsive = "true",
}: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* no-op */
    }
  }, [slot]);

  return (
    <ins
      className="adsbygoogle"
      style={style ?? { display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"   // <-- replace with your publisher ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
}
