// src/components/ads/AdSense.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type Props = {
  slot: string;                   // your ad slot id
  format?: "auto" | "fluid";
  responsive?: boolean;           // true => data-full-width-responsive="true"
  layoutKey?: string;             // for fluid in-feed
  style?: React.CSSProperties;    // optional style
};

export default function AdSense({
  slot,
  format = "auto",
  responsive,
  layoutKey,
  style,
}: Props) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // Guard: DOM not ready or adsbygoogle not present? bail quietly.
    const canPush =
      typeof window !== "undefined" &&
      window.adsbygoogle &&
      typeof window.adsbygoogle.push === "function" &&
      insRef.current;

    if (!canPush) return;

    try {
      // re-init (in case React reuses the node)
      (insRef.current as any).innerHTML = "";
      window.adsbygoogle!.push({});
    } catch {
      // never throw in production preview
    }
  }, [slot, format, responsive, layoutKey]);

  return (
    <ins
      ref={insRef as any}
      className="adsbygoogle"
      style={style ?? { display: "block" }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      {...(format ? { "data-ad-format": format } : {})}
      {...(responsive ? { "data-full-width-responsive": "true" } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
