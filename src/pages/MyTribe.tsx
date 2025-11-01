import React from "react";

// Optional: simple house ad component (replace with your AdSense component if you want)
function HouseAd() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold mb-2">Advertisement</div>
      <div className="aspect-[300/250] w-full rounded-md bg-gray-100 grid place-items-center text-gray-500">
        300×250 Ad
      </div>
    </div>
  );
}

export default function MyTribePage() {
  // Mock tribe data — swap with real data later
  const tribe = {
    name: "My Demo Tribe",
    type: "Community",
    members: 156,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      {/* TOP STRIP: subtle panel (no full-bleed hero here) */}
      <div className="rounded-xl border bg-white p-5 md:p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{tribe.name}</h1>
            <div className="mt-1 text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs font-medium border border-green-200">
                {tribe.type}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-700">{tribe.members} members</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="rounded-md px-3 py-2 text-sm font-medium border bg-white hover:bg-gray-50">
              Invite
            </button>
            <button className="rounded-md px-3 py-2 text-sm font-medium text-white bg-[hsl(var(--primary))] hover:opacity-90">
              Start Session
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID: Left ads • Center feed • Right live session */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_360px] gap-6">
        {/* LEFT RAIL (ads) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <HouseAd />
            <HouseAd />
          </div>
        </aside>

        {/* CENTER (tribe feed area / cards) */}
        <main className="space-y-4">
          {/* Composer */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <input
              type="text"
              placeholder="What’s on your mind?"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <div className="mt-3 flex gap-2 text-sm">
              <button className="rounded-md border px-3 py-1.5 bg-white hover:bg-gray-50">
                📹 Live Video
              </button>
              <button className="rounded-md border px-3 py-1.5 bg-white hover:bg-gray-50">
                🖼️ Photo/Video
              </button>
              <button className="rounded-md border px-3 py-1.5 bg-white hover:bg-gray-50">
                🙂 Feeling/Activity
              </button>
            </div>
          </div>

          {/* Example post cards (replace with your real PostCard list) */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="text-sm font-semibold">Tribe Pulse</div>
                    <div className="text-xs text-gray-500">April 12, 2023 • 5 min read</div>
                  </div>
                </div>
                <span className="rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-medium">
                  Community
                </span>
              </div>
              <div className="bg-green-200/50 aspect-[16/9]" />
              <div className="px-4 py-4">
                <h3 className="text-lg font-semibold">
                  Building Stronger Communities in the Digital Age
                </h3>
                <p className="text-gray-600 mt-1">
                  Discover how modern tribes are forming around shared interests and values…
                </p>
              </div>
            </div>
          ))}
        </main>

        {/* RIGHT RAIL (Active / Live Session) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {/* LIVE NOW CARD */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-green-700">LIVE NOW</span>
              </div>
              <div className="rounded-lg border p-4 bg-green-50">
                <div className="text-xs text-gray-600">ROOM</div>
                <div className="mt-0.5 font-semibold">Weekly Tribe Gathering</div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">HOSTED BY</div>
                    <div className="font-medium">Kwame Asante</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">STARTED</div>
                    <div className="font-medium">15 minutes ago</div>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-md bg-[hsl(var(--primary))] py-2 text-white font-medium hover:opacity-90">
                  Join Live Session
                </button>
              </div>
            </div>

            {/* Past Sessions (skeleton style) */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold mb-2">Live Now</div>
              <div className="rounded-md border bg-white p-3">
                <div className="text-sm font-medium">Weekly Tribe Gathering</div>
                <div className="mt-1 text-xs text-gray-500">Host: Kwame Asante • 12 watching</div>
                <button className="mt-3 w-full rounded-md border bg-white py-2 text-sm hover:bg-gray-50">
                  Join Session
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
