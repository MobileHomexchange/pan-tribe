import React from "react";

/**
 * Full-bleed hero with NO white/glass layers.
 * - Uses the full-bleed utility to span the viewport width
 * - Background is your image (or fallback gradient)
 * - A light *dark* overlay improves text readability without washing colors
 * - Sticky filter bar lives directly beneath the hero
 */
type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundUrl?: string;
  activeFilter?: "all" | "following" | "nearby" | "popular";
  onFilterChange?: (filter: "all" | "following" | "nearby" | "popular") => void;
};

export default function FullBleedHero({
  title = "Fresh listings. Real people.",
  subtitle = "Discover what's new and relevant—curated for you.",
  ctaLabel = "Create Post",
  onCtaClick,
  backgroundUrl,
  activeFilter = "all",
  onFilterChange,
}: FullBleedHeroProps) {
  const filters: Array<"all" | "following" | "nearby" | "popular"> = [
    "all",
    "following",
    "nearby",
    "popular",
  ];

  return (
    <section className="relative full-bleed isolate">
      {/* Background (image or fallback gradient), no white layers */}
      <div
        className={[
          "relative w-screen overflow-hidden",
          "min-h-[44vh] md:min-h-[52vh] lg:min-h-[60vh]",
          backgroundUrl ? "bg-cover bg-center" : "bg-gradient-to-br from-emerald-700 to-teal-700",
        ].join(" ")}
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      >
        {/* Subtle dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/25 md:bg-black/20" />

        {/* Content — pure text/buttons, no white cards */}
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-14 md:py-20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-95 max-w-3xl">
            {subtitle}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              className="rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-5 py-3 text-sm font-semibold shadow hover:opacity-95 transition"
              onClick={onCtaClick}
            >
              {ctaLabel}
            </button>
            <a
              href="#feed"
              className="rounded-xl border border-white/50 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Browse Feed
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar — neutral, not white-glassy */}
      <nav className="sticky top-0 z-40 full-bleed border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 backdrop-blur">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-2 px-4 md:px-6 py-3">
          {filters.map((f) => {
            const active = f === activeFilter;
            return (
              <button
                key={f}
                onClick={() => onFilterChange?.(f)}
                className={
                  "capitalize font-medium text-sm px-3 py-1.5 rounded-md border transition " +
                  (active
                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow"
                    : "text-[hsl(var(--foreground))] bg-[hsl(var(--input))] border-[hsl(var(--border))] hover:bg-[hsl(var(--fb-hover))]")
                }
              >
                {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
              </button>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
