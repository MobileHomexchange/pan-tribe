import React from "react";
import { Rocket } from "lucide-react";

/**
 * Slimmer “Grow Your Tribe” promo card
 * - Smaller min-height
 * - Tighter padding
 * - Scales up modestly on larger screens
 * - Responsive text sizes so it doesn’t dominate mobile
 */
export default function GrowYourTribeCard() {
  return (
    <section
      className={[
        // container
        "w-full rounded-2xl shadow-sm border border-[hsl(var(--border))]",
        // slimmer height + padding
        "min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]",
        "px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7",
        // subtle gradient that matches your palette
        "bg-gradient-to-br from-[hsl(var(--forest))/90] to-[hsl(var(--sage))/70]"
      ].join(" ")}
      aria-labelledby="grow-tribe-title"
    >
      <div className="mx-auto max-w-4xl grid grid-cols-[auto,1fr] gap-3 sm:gap-4 items-center">
        {/* Icon */}
        <div className="flex items-center justify-center rounded-xl bg-white/15 p-2 sm:p-3">
          <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>

        {/* Copy */}
        <div>
          <h2
            id="grow-tribe-title"
            className="text-white font-extrabold tracking-tight
                       text-xl sm:text-2xl"
          >
            Grow Your Tribe
          </h2>
          <p className="text-white/90 mt-1 sm:mt-1.5 leading-relaxed text-sm sm:text-[0.95rem]">
            Reach more like-minded people with our premium community growth tools
            and analytics.
          </p>

          <div className="mt-3 sm:mt-4">
            <button
              className="inline-flex items-center rounded-xl bg-white text-[hsl(var(--foreground))]
                         px-4 py-2 text-sm font-semibold shadow
                         hover:shadow-md transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
