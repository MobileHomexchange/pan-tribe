import React from "react";

/**
 * Full-bleed hero with responsive background and a clean CTA row.
 * Requires:
 *   /public/images/hero-grow-your-tribe.webp (2560×1200)
 *   /public/images/hero-grow-your-tribe-mobile.webp (1080×1200)
 */
type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export default function FullBleedHero({
  title = "Fresh listings. Real people.",
  subtitle = "Discover what's new and relevant—curated for you.",
  ctaLabel = "Create Post",
  onCtaClick,
}: Props) {
  return (
    <section className="relative full-bleed isolate">
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="/images/hero-grow-your-tribe-mobile.webp"
        />
        <img
          src="/images/hero-grow-your-tribe.webp"
          alt="TribalPulse hero"
          className="w-screen h-[38vh] sm:h-[44vh] md:h-[48vh] lg:h-[52vh] object-cover object-center"
          loading="eager"
        />
      </picture>

      {/* Slightly stronger overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-6 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg opacity-95">{subtitle}</p>

          <div className="mt-4 flex items-center gap-2">
            <button
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:shadow-lg transition"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </button>
            <a
              href="#feed"
              className="rounded-xl border border-white/40 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Browse Feed
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
