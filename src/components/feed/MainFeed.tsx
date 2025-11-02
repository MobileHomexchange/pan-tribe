import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebaseConfig";
import {
  collection, getDocs, orderBy, query, limit, startAfter, where,
} from "firebase/firestore";
import PostCard from "../home/PostCard";
import FullBleedHero from "../FullBleedHero";
import AdSense from "../ads/AdSense";
import StickyRightRail from "../ads/StickyRightRail";
import MobileStickyBanner from "../ads/MobileStickyBanner";

const currentUserId = "TEMP_USER_ID";
const userLocation = { lat: 34.0007, lon: -81.0348 };
const PAGE = 20;
const MAX_DISTANCE_KM = 100;

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

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "following" | "nearby" | "popular">("all");

  const loadPage = async (reset = false) => {
    if (loading || exhausted) return;
    setLoading(true);

    let qBase: any = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE));

    if (filter === "following") {
      const followingRef = collection(db, "users", currentUserId, "following");
      const followingSnap = await getDocs(followingRef);
      const followingIds = followingSnap.docs.map((d) => d.id);
      if (followingIds.length === 0) {
        setPosts([]); setLoading(false); setExhausted(true); return;
      }
      qBase = query(
        collection(db, "posts"),
        where("userId", "in", followingIds.slice(0, 10)),
        orderBy("createdAt", "desc"),
        limit(PAGE)
      );
    } else if (filter === "nearby") {
      const allSnap = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE * 3))
      );
      const allPosts = allSnap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) } as Post));
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
      qBase = query(collection(db, "posts"), orderBy("likes", "desc"), limit(PAGE));
    }

    const q = cursor ? query(qBase, startAfter(cursor)) : qBase;
    const snap = await getDocs(q);
    if (snap.empty) { setExhausted(true); setLoading(false); return; }

    const next = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) } as Post));
    setPosts((prev) => (reset ? next : [...prev, ...next]));
    setCursor(snap.docs[snap.docs.length - 1]);
    if (snap.size < PAGE) setExhausted(true);
    setLoading(false);
  };

  useEffect(() => {
    setPosts([]); setCursor(null); setExhausted(false);
    void loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
      if (nearBottom) void loadPage();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cursor, loading, exhausted]);

  return (
    <>
      <FullBleedHero />

      {/* Leaderboard under hero */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-3 mb-2">
        <div className="flex justify-center">
          <AdSense
            slot="YOUR_LEADERBOARD_SLOT_ID"
            style={{ display: "block", minHeight: 90 }}
          />
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 bg-[hsl(var(--background))]/70 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex gap-2">
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

      <div id="feed" className="mx-auto max-w-6xl px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* Main column */}
          <div className="space-y-5">
            {/* In-feed fluid ad (optional) */}
            <AdSense
              slot="YOUR_INFEED_SLOT_ID"
              format="fluid"
              layoutKey="-gw-3+1f-3d+2z"
              style={{ display: "block" }}
            />

            {posts.map((post) => (
              <PostCard
                key={post.id}
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
            ))}

            {loading && <p className="text-center text-gray-400">Loading…</p>}
            {exhausted && posts.length > 0 && (
              <p className="text-center text-gray-400">You’re all caught up.</p>
            )}
          </div>

          {/* Sticky right rail with two banners (desktop) */}
          <StickyRightRail
            topHouse={{
              image: "/ads/house-300x250.jpg",
              href: "https://your-offer.example.com",
              title: "Grow Your Tribe",
              subtitle: "Promote your community today."
            }}
            bottomSlot="YOUR_RECTANGLE_SLOT_ID"
          />
        </div>
      </div>

      {/* Mobile sticky banner */}
      <MobileStickyBanner
        adsenseSlot="YOUR_MOBILE_SLOT_ID"
        // houseImage="/ads/house-300x250.jpg"
        // houseHref="https://your-offer.example.com"
        delayMs={800}
      />
    </>
  );
}

/** haversine (km) */
function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
