import React from "react";

type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Optional background image. Falls back to gradient if omitted. */
  backgroundUrl?: string;
};

export default function FullBleedHero({
  title = "Fresh listings. Real people.",
  subtitle = "Discover what's new and relevant—curated for you.",
  ctaLabel = "Create Post",
  onCtaClick,
  backgroundUrl,
}: FullBleedHeroProps) {
  const hasBg = Boolean(backgroundUrl);

  return (
    <section
      className={[
        "full-bleed relative isolate",
        "min-h-[52vh] md:min-h-[60vh] lg:min-h-[68vh]",
        hasBg
          ? "bg-cover bg-center"
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
      ].join(" ")}
      style={hasBg ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      aria-label="Featured"
    >
      {/* overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* content container */}
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">{subtitle}</p>

          <div className="mt-8 flex items-center gap-3">
            <button
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:shadow-lg transition"
              onClick={onCtaClick}
              type="button"
            >
              {ctaLabel}
            </button>
            <a
              href="#feed"
              className="rounded-2xl border border-white/40 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
            >
              Browse Feed
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
