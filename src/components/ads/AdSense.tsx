import React, { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type Props = {
  slot: string;
  client?: string;
  format?: "auto" | "fluid";
  responsive?: boolean;
  layoutKey?: string;
  style?: React.CSSProperties;
};

export default function AdSense({
  slot,
  client,
  format = "auto",
  responsive = true,
  layoutKey,
  style,
}: Props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore dev errors */
    }
  }, [slot, client, format, responsive, layoutKey]);

  return (
    <ins
      className="adsbygoogle"
      style={style ?? { display: "block" }}
      data-ad-slot={slot}
      {...(client ? { "data-ad-client": client } : {})}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
