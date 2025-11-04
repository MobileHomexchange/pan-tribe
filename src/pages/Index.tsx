import React from "react";
import { useNavigate, Link } from "react-router-dom";
import FullBleedHero from "@/components/FullBleedHero";
import AdSense from "@/components/ads/AdSense";
import HouseAd from "@/components/ads/HouseAd";

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      {/* Full-bleed hero with landing copy */}
      <FullBleedHero
        title="Fresh listings. Real people."
        subtitle="Discover what's new and relevant—curated for you."
        ctaLabel="Create Post"
        onCtaClick={() => navigate("/create-post")}
      />

      {/* Leaderboard Ad (under hero) */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-4">
        <div className="flex justify-center">
          <AdSense
            slot="YOUR_LEADERBOARD_SLOT_ID"
            style={{ display: "block", minHeight: 90, width: "100%" }}
          />
        </div>
      </div>

      {/* Body: KPIs + 2-col responsive layout */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-3xl font-bold text-foreground">1.2K</div>
            <div className="text-sm text-muted-foreground">Tribe Members</div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-3xl font-bold text-foreground">245</div>
            <div className="text-sm text-muted-foreground">Active Now</div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-3xl font-bold text-foreground">89</div>
            <div className="text-sm text-muted-foreground">New Posts</div>
          </div>
        </div>

        {/* Main content grid: intro + actions (left), ads (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* Left column */}
          <section className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">
                What is TribalPulse?
              </h2>
              <p className="mt-2 text-muted-foreground">
                A community engine for real conversations and useful local
                signals — not just noise. Build your tribe, run events, and grow
                together.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/feed"
                  className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition"
                >
                  Browse Feed
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Create your account
                </Link>
              </div>
            </div>

            {/* Secondary section */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">
                Why tribes work
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Aligned interests → higher quality discussions</li>
                <li>• Lighter moderation → faster collaboration</li>
                <li>• Built-in growth tools → momentum compounds</li>
              </ul>
            </div>
          </section>

          {/* Right rail (ads) */}
          <aside className="space-y-4">
            <HouseAd
              href="https://your-offer.example.com"
              image="/ads/house-300x250.jpg"
              title="Promote your tribe"
              subtitle="Boost reach with targeted placements."
            />
            <AdSense
              slot="YOUR_RECTANGLE_SLOT_ID"
              style={{ display: "block", minHeight: 250, width: "100%" }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
