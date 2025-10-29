import { useEffect } from "react";

declare global {
  interface Window { adsbygoogle?: unknown[]; }
}

type Props = {
  slot: string;                  // AdSense slot id from your AdSense UI
  format?: "auto" | "fluid";     // default "auto"
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;          // default true
  layoutKey?: string;            // for fluid units (optional)
};

export default function AdSense({
  slot,
  format = "auto",
  className = "",
  style,
  responsive = true,
  layoutKey,
}: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* ignore if blocked */ }
  }, []);

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={style ?? { display: "block" }}
      data-ad-client={import.meta.env.VITE_GADS_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } as any : {})}
    />
  );
}
