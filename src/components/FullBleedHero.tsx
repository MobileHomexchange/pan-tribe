import React from "react";

type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;

  /** Optional: overrides the default African-pattern art */
  backgroundUrl?: string;

  /** Filter state for the sticky sub-nav */
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

  const desktop = "/images/hero-grow-your-tribe.webp";        // 2560×1200
  const mobile  = "/images/hero-grow-your-tribe-mobile.webp"; // 1080×1200

  return (
    <section className="relative full-bleed isolate">
      {/* === Full-bleed visual === */}
      <div className="relative w-screen overflow-hidden min-h-[44vh] sm:min-h-[52vh] lg:min-h-[60vh]">
        {/* If a custom backgroundUrl is provided, use it; otherwise use responsive art */}
        {backgroundUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
            aria-hidden
          />
        ) : (
          <picture aria-hidden>
            <source media="(max-width: 640px)" srcSet={mobile} />
            <img
              src={desktop}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        )}

        {/* legibility overlay */}
        <div className="absolute inset-0 bg-black/40" aria-hidden />

        {/* centered content (keep inside a max-width, but hero itself is outside containers) */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl opacity-90">{subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:shadow-lg transition"
              onClick={onCtaClick}
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

      {/* === Sticky Sub-Navigation (stays edge-to-edge; content centered) === */}
      <nav className="sticky top-0 z-40 full-bleed bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-center gap-2 sm:gap-4 px-4 py-2.5">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            const label = filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1);
            return (
              <button
                key={filter}
                type="button"
                className={[
                  "capitalize font-medium text-sm px-3 py-2 rounded-lg transition",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white shadow"
                    : "text-gray-700 bg-white border border-[hsl(var(--fb-border))] hover:bg-[hsl(var(--fb-hover))]",
                ].join(" ")}
                onClick={() => onFilterChange?.(filter)}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
