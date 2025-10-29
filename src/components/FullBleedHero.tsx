export default function FullBleedHero() {
  const desktop = "/images/hero-grow-your-tribe.webp";
  const mobile = "/images/hero-grow-your-tribe-mobile.webp";

  return (
    <section className="relative full-bleed">
      <div className="relative w-screen h-[44vh] md:h-[52vh] lg:h-[60vh] overflow-hidden rounded-2xl">
        <picture>
          <source media="(max-width: 640px)" srcSet={mobile} />
          <img
            src={desktop}
            alt="Green African pattern background for Grow Your Tribe"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl items-center px-4 sm:px-6">
          <div className="text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3 mb-2">
              <span aria-hidden>🚀</span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold">Grow Your Tribe</h1>
            </div>
            <p className="max-w-xl text-sm md:text-base lg:text-lg opacity-95">
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
