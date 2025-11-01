import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  where,
} from "firebase/firestore";

import PostCard from "@/components/home/PostCard";
import FullBleedHero from "@/components/FullBleedHero";

// Ads (we already created these earlier)
import AdSense from "@/components/ads/AdSense";
import HouseAd from "@/components/ads/HouseAd";

/** TEMP until auth/location is wired */
const currentUserId = "TEMP_USER_ID";
const userLocation = { lat: 34.0007, lon: -81.0348 }; // Columbia, SC

type FeedFilter = "all" | "following" | "nearby" | "popular";

interface Post {
  id: string;
  authorName?: string;
  createdAt?: any;
  content: string;
  imageUrl?: string;
  likes?: number;
  commentsCount?: number;
  userId?: string;
  userAvatar?: string;
  location?: { lat: number; lon: number };
}

const PAGE = 20;
const MAX_DISTANCE_KM = 100;

/** Simple haversine distance calculator (km) */
function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [filter, setFilter] = useState<FeedFilter>("all");

  const loadPage = async (reset = false) => {
    if (loading || exhausted) return;
    setLoading(true);

    // Base
    let q: any = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE));

    // Filters
    if (filter === "following") {
      const followingRef = collection(db, "users", currentUserId, "following");
      const followingSnap = await getDocs(followingRef);
      const followingIds = followingSnap.docs.map((d) => d.id);
      if (followingIds.length > 0) {
        q = query(
          collection(db, "posts"),
          where("userId", "in", followingIds.slice(0, 10)), // Firestore limit
          orderBy("createdAt", "desc"),
          limit(PAGE)
        );
      } else {
        setPosts([]);
        setExhausted(true);
        setLoading(false);
        return;
      }
    } else if (filter === "nearby") {
      // Pull a bit extra and filter locally
      const allSnap = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE * 3))
      );
      const all = allSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
      const nearby = all.filter((p) => {
        if (!p.location) return false;
        return haversine(userLocation, p.location) <= MAX_DISTANCE_KM;
      });
      setPosts(reset ? nearby.slice(0, PAGE) : [...posts, ...nearby.slice(0, PAGE)]);
      setExhausted(nearby.length < PAGE);
      setLoading(false);
      return;
    } else if (filter === "popular") {
      q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(PAGE));
    }

    const q2 = cursor ? query(q, startAfter(cursor)) : q;
    const snap = await getDocs(q2);

    if (snap.empty) {
      setExhausted(true);
      setLoading(false);
      return;
    }

    const next = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
    setPosts((prev) => (reset ? next : [...prev, ...next]));
    setCursor(snap.docs[snap.docs.length - 1]);
    if (snap.size < PAGE) setExhausted(true);
    setLoading(false);
  };

  // Reload when filter changes
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setExhausted(false);
    void loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom) void loadPage();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cursor, loading, exhausted]);

  return (
    <>
      {/* Full-width hero — keep it outside containers */}
      <FullBleedHero />

      {/* Sticky filter bar, like /my-tribe */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex gap-2">
          {(["all", "following", "nearby", "popular"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1.5 rounded-md text-sm border transition " +
                (filter === f
                  ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                  : "bg-white text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--fb-hover))]")
              }
            >
              {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Ad under the hero (visible on desktop/tablet), mobile hides */}
      <div className="hidden sm:block mx-auto max-w-6xl px-4 sm:px-6 mt-4">
        <AdSense
          adSlot="LEADERBOARD_SLOT_ID"
          layout="responsive"
          style={{ display: "block" }}
        />
      </div>

      {/* Main content + Right rail */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        {/* Feed column */}
        <div className="space-y-5">
          {/* Mobile inline banner (small house ad) */}
          <div className="sm:hidden">
            <HouseAd
              imageSrc="/images/your-offer-mobile.jpg"
              href="#"
              alt="Your Offer"
              aspect="16/9"
            />
          </div>

          {posts.length === 0 && !loading && (
            <p className="text-center text-gray-500">No posts found.</p>
          )}

          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <PostCard
                post={{
                  id: post.id,
                  userId: post.userId || "",
                  userName: post.authorName || "Anonymous",
                  userAvatar: post.userAvatar || "",
                  content: post.content || "",
                  mediaUrl: post.imageUrl || "",
                  mediaType: post.imageUrl ? "image" : undefined,
                  likes: post.likes ?? 0,
                  comments: post.commentsCount ?? 0,
                  timestamp: post.createdAt,
                }}
              />

              {/* Insert a mobile house ad every ~8 posts */}
              {index > 0 && (index + 1) % 8 === 0 && (
                <div className="sm:hidden">
                  <HouseAd
                    imageSrc="/images/your-offer-mobile.jpg"
                    href="#"
                    alt="Sponsored"
                    aspect="16/9"
                  />
                </div>
              )}
            </React.Fragment>
          ))}

          {loading && <p className="text-center text-gray-400">Loading…</p>}
          {exhausted && posts.length > 0 && (
            <p className="text-center text-gray-400">You’re all caught up.</p>
          )}
        </div>

        {/* Right rail: two sticky banners (desktop/tablet only) */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] space-y-4">
            {/* Sticky Banner #1 - AdSense rectangle */}
            <div className="rounded-lg border bg-white p-3 shadow-sm">
              <AdSense
                adSlot="SIDEBAR_RECT_SLOT_ID"
                layout="in-article"
                style={{ display: "block" }}
              />
            </div>

            {/* Sticky Banner #2 - House ad (your personal promo) */}
            <HouseAd
              imageSrc="/images/your-offer-rect.jpg"
              href="#"
              alt="Your Offer"
              aspect="4/5"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
