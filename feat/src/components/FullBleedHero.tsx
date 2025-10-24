export default function FullBleedHero() {
  return (
    <section className="relative full-bleed">
      <div className="relative h-[44vh] md:h-[52vh] lg:h-[60vh] w-screen">
        <img
          src="/images/hero-grow-your-tribe.jpg"
          alt="Grow Your Tribe"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl items-center px-4 sm:px-6">
          <div className="text-white max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
              Grow Your Tribe
            </h1>
            <p className="mt-3 text-base md:text-lg">
              Reach more like-minded people with our premium community growth tools and analytics.
            </p>
            <button className="mt-6 rounded-xl bg-white/90 px-5 py-3 text-gray-900 font-medium hover:bg-white">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
