import React from "react";

type Props = {
  image: string;         // e.g., "/images/your-offer.webp"
  href?: string;         // e.g., "/offer"
  title?: string;        // e.g., "Grow with Tribe Pulse"
  subtitle?: string;     // e.g., "Premium tools to boost your community reach."
};

export default function PersonalBanner({
  image,
  href = "#",
  title = "Your Offer",
  subtitle = "Reach more like-minded people with our premium tools.",
}: Props) {
  return (
    <a
      href={href}
      className="block rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
    >
      <img src={image} alt={title} className="w-full h-auto object-cover" />
      <div className="p-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
    </a>
  );
}
