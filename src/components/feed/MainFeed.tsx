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
import { InlineFeedAd } from "./InlineFeedAd";
import FullBleedHero from "@/components/FullBleedHero";

// ⬇️ Add these two NEW imports at the top with the others
import GoogleAd from "@/components/ads/GoogleAd";
import PersonalBanner from "@/components/ads/PersonalBanner";

/** TEMP: wire to your real auth + location later */
const currentUserId = "TEMP_USER_ID";
const userLocation = { lat: 34.0007, lon: -81.0348 }; // Columbia, SC default

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

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "following" | "nearby" | "popular">("all");

  const loadPage = async (reset = false) => {
    if (loading || exhausted) return;
    setLoading(true);

    // --- Base query (default: "all") ---
    let q: any = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE));

    // --- Filters ---
    if (filter === "following") {
      const followingRef = collection(db, "users", currentUserId, "following");
      const followingSnap = await getDocs(followingRef);
      const followingIds = followingSnap.docs.map((d) => d.id);

      if (followingIds.length > 0) {
        // Firestore "in" max is 10
        q = query(
          collection(db, "posts"),
          where("userId", "in", followingIds.slice(0, 10)),
          orderBy("createdAt", "desc"),
          limit(PAGE)
        );
      } else {
        setPosts([]);
        setLoading(false);
        setExhausted(true);
        return;
      }
    } else if (filter === "nearby") {
      // Fetch a larger page and filter locally by distance
      const allSnap = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE * 3))
      );
      const allPosts = allSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
      const nearby = allPosts.filter((p) => {
        if (!p.location) return false;
        const dist = haversine(userLocation, p.location);
        return dist <= MAX_DISTANCE_KM;
      });

      setPosts(reset ? nearby.slice(0, PAGE) : [...posts, ...nearby.slice(0, PAGE)]);
      setLoading(false);
      setExhausted(nearby.length < PAGE);
      return;
    } else if (filter === "popular") {
      // Simple proxy for "popular" — you can refine later
      q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(PAGE));
    }

    // Pagination (all / following / popular)
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

  // reload when filter changes
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setExhausted(false);
    void loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // infinite scroll
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
      {/* ✅ Full-width hero. Do not wrap in a container. */}
      <FullBleedHero />

      {/* Filter bar (sticky, lightweight) */}
      <div className="sticky top-0 z-20 bg-background/70 backdrop-blur border-b">
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

      {/* Feed content container */}
      <div id="feed" className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500">No posts found.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* Main column */}
          <div className="space-y-5">
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
                {(index + 1) % 20 === 0 && (
                  <InlineFeedAd adIndex={Math.floor((index + 1) / 20)} />
                )}
              </React.Fragment>
            ))}

            {loading && <p className="text-center text-gray-400">Loading…</p>}
            {exhausted && posts.length > 0 && (
              <p className="text-center text-gray-400">You’re all caught up.</p>
            )}
          </div>

          {/* Right rail (reserved for banners, offers, etc.) */}
          <aside className="hidden lg:block space-y-4">
            {/* Example slot — we’ll wire AdSense / personal banner here next */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold mb-2">Grow Your Tribe</div>
              <p className="text-sm text-gray-600">
                Reach more like-minded people with our premium community growth tools and analytics.
              </p>
              <button className="mt-3 inline-flex items-center rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-white">
                Get Started
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

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
