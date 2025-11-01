import React from "react";

/**
 * Full-bleed hero with Pan-African green background + gold pattern.
 * No white/glass overlays. Text stays readable via a dark gradient veil.
 */
type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundUrl?: string;           // optional override (keeps pattern if not provided)
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
      {/* Background layer */}
      <div
        className={[
          "relative w-screen overflow-hidden",
          // taller on desktop for drama, shorter on mobile
          "min-h-[44vh] md:min-h-[56vh] lg:min-h-[64vh]",
          // base: gradient + African pattern (from index.css utilities)
          "bg-[radial-gradient(1200px_600px_at_0%_-10%,hsl(155_60%_40%),transparent)]",
          "bg-[linear-gradient(180deg,hsl(155_52%_35%)_0%,hsl(155_48%_28%)_60%,hsl(155_46%_23%)_100%)]",
          "bg-pattern",
        ].join(" ")}
        style={
          backgroundUrl
            ? {
                backgroundImage: `
                  linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45)),
                  url(${backgroundUrl})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Subtle dark veil for readability (no white/glass) */}
        {!backgroundUrl && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />
        )}

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16 lg:py-20 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-95 max-w-3xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
            {subtitle}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={onCtaClick}
              className="rounded-xl px-5 py-3 text-sm font-semibold shadow-md transition
                         bg-[hsl(var(--pan-gold))] text-[hsl(var(--pan-black))]
                         hover:brightness-105 active:brightness-95"
            >
              {ctaLabel}
            </button>

            <a
              href="#feed"
              className="rounded-xl px-5 py-3 text-sm font-semibold transition
                         border border-white/35 text-white/95 hover:bg-white/10"
            >
              Browse Feed
            </a>
          </div>
        </div>
      </div>

      {/* Sticky filter (no white background, slight translucent dark bar) */}
      <nav className="sticky top-0 z-40 full-bleed border-t border-black/10 bg-black/20 backdrop-blur-[2px]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap gap-2">
          {filters.map((f) => {
            const selected = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => onFilterChange?.(f)}
                className={[
                  "capitalize text-sm font-medium px-3 py-1.5 rounded-md transition border",
                  selected
                    ? "bg-[hsl(var(--pan-gold))] text-[hsl(var(--pan-black))] border-[hsl(var(--pan-gold))]"
                    : "text-white/90 border-white/25 hover:bg-white/10",
                ].join(" ")}
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
