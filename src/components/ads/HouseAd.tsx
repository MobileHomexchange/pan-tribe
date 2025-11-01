import React from "react";

/**
 * Simple house ad / personal banner card.
 * Use for your own offers or static sponsor images.
 */
type HouseAdProps = {
  image: string;
  href: string;
  title?: string;
  subtitle?: string;
  alt?: string;
};

export default function HouseAd({
  image,
  href,
  title = "Your Offer",
  subtitle = "Promote something here",
  alt = "House Ad",
}: HouseAdProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
    >
      <img src={image} alt={alt} className="w-full h-auto" />
      {(title || subtitle) && (
        <div className="p-3">
          {title && <div className="font-semibold">{title}</div>}
          {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
        </div>
      )}
    </a>
  );
}
