import React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export default function FullBleedHero({
  title = "Building Stronger Communities in the Digital Age",
  subtitle = "Discover how modern tribes are forming around shared interests and values online, creating meaningful connections that transcend geographical boundaries.",
  ctaLabel = "Hear the Story",
  onCtaClick,
}: Props) {
  return (
    <section className="text-center py-12 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <button
          onClick={onCtaClick}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200"
        >
          {ctaLabel} →
        </button>
      </div>
    </section>
  );
}
