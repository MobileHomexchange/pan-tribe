import React, { useEffect, useRef } from "react";

type AdSenseProps = {
  slot: string;                 // your slot id
  format?: "auto" | "fluid";    // default "auto"
  layoutKey?: string;           // only for in-feed fluid layouts
  responsive?: boolean;         // default true
  style?: React.CSSProperties;  // default { display: "block" }
  className?: string;
};

/**
 * Crash-proof AdSense component:
 * - Never throws if the script/client isn't present
 * - No-ops when ads are disabled via env
 * - Only pushes once per mount
 */
const AdSense: React.FC<AdSenseProps> = ({
  slot,
  format = "auto",
  layoutKey,
  responsive = true,
  style,
  className,
}) => {
  const insRef = useRef<HTMLDivElement | null>(null);

  // Kill switch from env (default OFF if not set)
  const ADS_ENABLED =
    (import.meta as any).env?.VITE_ENABLE_ADS?.toString() === "true";

  useEffect(() => {
    if (!ADS_ENABLED) return;                // ads disabled
    if (typeof window === "undefined") return;

    try {
      const w = window as any;
      // If the Google script hasn’t loaded, do nothing (don’t crash)
      if (!w.adsbygoogle || !Array.isArray(w.adsbygoogle)) return;

      // Only push once
      if (insRef.current && !(insRef.current as any)._adsbygoogleLoaded) {
        w.adsbygoogle.push({});
        (insRef.current as any)._adsbygoogleLoaded = true;
      }
    } catch {
      // Silently ignore any ad init errors
    }
  }, [ADS_ENABLED]);

  if (!ADS_ENABLED) return null;

  return (
    <ins
      ref={insRef as any}
      className={`adsbygoogle ${className ?? ""}`}
      style={style ?? { display: "block" }}
      data-ad-client={(import.meta as any).env?.VITE_ADSENSE_CLIENT || ""}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
};

export default AdSense;
