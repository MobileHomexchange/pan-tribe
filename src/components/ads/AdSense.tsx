import React, { useEffect, useRef } from "react";

type Props = {
  slot: string;              // required: "xxxxxxxxxx"
  format?: "auto" | "fluid"; // default: auto
  responsive?: boolean;      // default: true
  layoutKey?: string;        // only for fluid in-feed formats
  style?: React.CSSProperties;
};

// Pull your client id from an env or hardcode for now.
// If you use Vite envs, set VITE_ADSENSE_CLIENT in the Lovable env UI.
const ADS_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || ""; // e.g. "ca-pub-1234567890"

export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
}: Props) {
  const insRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Don’t even try if:
    // - no client id
    // - no window (SSR/preview hydration)
    // - ad blockers remove the script
    if (!ADS_CLIENT || typeof window === "undefined") return;

    // If the script isn’t present yet, inject it once.
    const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      ADS_CLIENT
    )}`;

    const already = Array.from(document.scripts).some((s) => s.src === SCRIPT_SRC);
    if (!already) {
      const s = document.createElement("script");
      s.async = true;
      s.src = SCRIPT_SRC;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }

    // Try to push after a microtask; if blocked, swallow it
    const t = setTimeout(() => {
      try {
        // @ts-ignore — Google attaches this at runtime
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore errors in preview/ad-blocked environments
      }
    }, 50);

    return () => clearTimeout(t);
  }, []);

  // If no client id configured, render nothing — avoids crashes in preview.
  if (!ADS_CLIENT) return null;

  // IMPORTANT: the <ins> tag must have these data-* attributes for AdSense
  return (
    <ins
      ref={insRef as any}
      className="adsbygoogle"
      style={{ display: "block", ...(style || {}) }}
      data-ad-client={ADS_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(format === "fluid" && layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
