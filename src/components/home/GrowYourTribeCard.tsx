import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GrowYourTribeCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-forest to-sage text-white rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

      <div className="relative z-10">
        <Rocket className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Grow Your Tribe</h2>
        <p className="text-white/90 mb-6 text-sm leading-relaxed">
          Reach more like-minded people with our premium community growth tools
          and analytics.
        </p>
        <button
          onClick={() => navigate("/ads-manager")}
          className="bg-white text-[hsl(var(--forest))] font-semibold px-8 py-3 rounded-full hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
