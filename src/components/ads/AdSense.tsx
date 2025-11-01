import React, { useEffect, useRef } from "react";

/**
 * Lightweight, typed AdSense wrapper.
 * Props map 1:1 to AdSense attributes you actually need in this project.
 */
type AdSenseProps = {
  /** Your ad slot id (required) */
  slot: string;
  /** Your publisher id (optional; if provided we’ll load the script with ?client=) */
  client?: string;
  /** "auto" or "fluid" (default: "auto") */
  format?: "auto" | "fluid";
  /** Set true for responsive units (default: true) */
  responsive?: boolean;
  /** Only for "fluid" units that require a layout key */
  layoutKey?: string;
  /** Optional inline styles for the <ins> wrapper (e.g., width, minHeight) */
  style?: React.CSSProperties;
  /** Optional className for the <ins> element */
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ensureScript = (client?: string) => {
  const ID = "adsbygoogle-js";
  if (document.getElementById(ID)) return;

  const s = document.createElement("script");
  s.id = ID;
  s.async = true;
  s.src = client
    ? `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        client
      )}`
    : "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
};

export default function AdSense({
  slot,
  client,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
  className,
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // load script once
    ensureScript(client);

    // push a render tick (retry a few times while script boots)
    let tries = 0;
    const tick = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        if (tries++ < 10) setTimeout(tick, 400);
      }
    };
    tick();
  }, [client, slot, format, responsive, layoutKey]);

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={style ?? { display: "block" }}
      data-ad-slot={slot}
      // Helpful to pass client again on the unit (Google is fine with either approach)
      {...(client ? { "data-ad-client": client } : {})}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
