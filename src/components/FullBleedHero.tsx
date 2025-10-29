export default function FullBleedHero() {
  return (
    <section className="relative full-bleed h-[44vh] md:h-[52vh] lg:h-[60vh] w-screen">
      <img 
        src="/images/hero-grow-your-tribe.png" 
        alt="Grow Your Tribe" 
        className="h-full w-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Grow Your Tribe
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Connect with like-minded people and build meaningful communities
          </p>
        </div>
      </div>
    </section>
  );
}
