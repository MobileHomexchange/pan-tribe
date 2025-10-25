export default function PromoCard() {
  return (
    <div className="rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 p-6 text-white shadow-md">
      <h3 className="text-xl font-semibold">Grow Your Tribe</h3>
      <p className="mt-2 text-sm opacity-90">
        Reach more like-minded people with our premium community growth tools and analytics.
      </p>
      <button className="mt-4 rounded-lg bg-white/90 px-4 py-2 text-gray-900 hover:bg-white transition">
        Get Started
      </button>
    </div>
  );
}
