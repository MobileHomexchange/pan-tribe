import React from "react";

type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  backgroundUrl?: string; // optional override
  activeFilter?: "all" | "following" | "nearby" | "popular";
  onFilterChange?: (filter: FullBleedHeroProps["activeFilter"]) => void;
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
  const filters: FullBleedHeroProps["activeFilter"][] = [
    "all",
    "following",
    "nearby",
    "popular",
  ];

  return (
    <section className="full-bleed relative isolate">
      {/* Background: image fills the viewport width, no inner card */}
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={
            backgroundUrl || "/images/hero-grow-your-tribe-mobile.webp"
          }
        />
        <img
          src={backgroundUrl || "/images/hero-grow-your-tribe.webp"}
          alt=""
          className="block w-screen h-[44vh] md:h-[60vh] lg:h-[68vh] object-cover"
          fetchPriority="high"
        />
      </picture>

      {/* Subtle gradient & pattern mask (no box) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Pan-African darkening gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/0" />
        {/* Very light pattern mask so text pops but design shows through */}
        <div className="absolute inset-0 mix-blend-soft-light opacity-25 bg-pattern" />
      </div>

      {/* Text content (no background) */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-6xl px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-95">{subtitle}</p>
          <div className="mt-8 flex items-center gap-3">
            <button
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

      {/* Sticky Sub-nav (clean, no box) */}
      <nav className="sticky top-0 z-40 full-bleed bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-center gap-6 px-4 py-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange?.(f)}
              className={
                "capitalize font-medium text-sm px-3 py-2 rounded-lg transition " +
                (activeFilter === f
                  ? "bg-[hsl(var(--primary))] text-white shadow"
                  : "text-gray-700 hover:bg-gray-100")
              }
            >
              {f === "all" ? "All" : f[0]!.toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
