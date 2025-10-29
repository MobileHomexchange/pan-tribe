import React from "react";

export default function FullBleedHero() {
  const desktop = "/images/hero-grow-your-tribe.webp";       // 2560×1200
  const mobile  = "/images/hero-grow-your-tribe-mobile.webp"; // 1080×1200

  return (
    // ⬇️ This breaks out of any page padding to span the full viewport width
    <section className="relative full-bleed">
      <div className="relative w-screen h-[44vh] sm:h-[52vh] lg:h-[60vh] overflow-hidden">
        <picture>
          <source media="(max-width: 640px)" srcSet={mobile} />
          <img
            src={desktop}
            alt="Green African geometric pattern background"
            className="h-full w-full object-cover"
          />
        </picture>

        {/* Legibility overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Centered content; NOT wrapped by a max-w container above */}
        <div className="absolute inset-0 mx-auto flex max-w-6xl items-center px-4 sm:px-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <span aria-hidden>🚀</span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold">Grow Your Tribe</h1>
            </div>
            <p className="max-w-xl text-sm sm:text-base lg:text-lg opacity-95">
              Reach more like‑minded people with our premium community growth tools and analytics.
            </p>
            <button className="mt-5 inline-flex items-center rounded-2xl bg-white/95 px-5 py-3 font-medium text-gray-900 hover:bg-white">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
