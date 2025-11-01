import React from "react";

type FullBleedHeroProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  activeFilter?: "all" | "following" | "nearby" | "popular";
  onFilterChange?: (filter: FullBleedHeroProps["activeFilter"]) => void;
};

export default function FullBleedHero({
  title = "Fresh listings. Real people.",
  subtitle = "Discover what's new and relevant—curated for you.",
  ctaLabel = "Create Post",
  onCtaClick,
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
    <section className="relative full-bleed isolate">
      {/* Background: subtle African pattern + green gradient; NO overlay */}
      <div
        className={[
          "relative w-screen",
          "min-h-[52vh] md:min-h-[60vh] lg:min-h-[68vh]",
          "bg-pattern",
        ].join(" ")}
      >
        {/* Content */}
        {/* Text content (no glass card) */}
<div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28 text-white">
  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
    {title}
  </h1>
  <p className="mt-4 text-lg md:text-xl opacity-90">{subtitle}</p>
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

      {/* Sticky Sub-Navigation (no glass, no white bg) */}
      <nav className="sticky top-0 z-40 full-bleed bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-center gap-6 px-4 py-3">
          {filters.map((f) => (
            <button
              key={f}
              className={
                "capitalize font-medium text-sm px-3 py-2 rounded-lg transition " +
                (activeFilter === f
                  ? "bg-[hsl(var(--primary))] text-white shadow"
                  : "text-gray-700 hover:bg-gray-100")
              }
              onClick={() => onFilterChange?.(f)}
            >
              {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
