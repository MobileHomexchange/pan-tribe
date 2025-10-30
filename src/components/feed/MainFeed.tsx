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

/** Adjust this when you add auth context */
const currentUserId = "TEMP_USER_ID"; // replace with your auth user later
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
const MAX_DISTANCE_KM = 100; // adjust radius for “Nearby” filter

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  const loadPage = async (reset = false) => {
    if (loading || exhausted) return;
    setLoading(true);

    // --- Base query ---
    let q: any = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE));

    // --- Filter logic ---
    if (filter === "following") {
      // Filter posts only by people the user follows
      const followingRef = collection(db, "users", currentUserId, "following");
      const followingSnap = await getDocs(followingRef);
      const followingIds = followingSnap.docs.map((d) => d.id);
      if (followingIds.length > 0) {
        q = query(
          collection(db, "posts"),
          where("userId", "in", followingIds.slice(0, 10)), // Firestore max 10 items
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
      // For now, we fetch all and filter by distance locally
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
    }

    // Pagination
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

  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setExhausted(false);
    void loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
      <FullBleedHero
        backgroundUrl={posts[0]?.imageUrl}
        activeFilter={filter}
        onFilterChange={(f) => {
          setFilter(f);
        }}
      />

      <div id="feed" className="space-y-5 max-w-2xl mx-auto p-4">
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
    </>
  );
}

/**
 * Simple haversine distance calculator (km)
 */
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
