import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import PostCard from "@/components/home/PostCard";
import { InlineFeedAd } from "./InlineFeedAd";
import FullBleedHero from "@/components/FullBleedHero";

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
}

const PAGE = 20;

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [filter, setFilter] = useState("all");

  const loadPage = async () => {
    if (loading || exhausted) return;
    setLoading(true);

    const baseQ = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(PAGE)
    );
    const q2 = cursor ? query(baseQ, startAfter(cursor)) : baseQ;
    const snap = await getDocs(q2);

    if (snap.empty) {
      setExhausted(true);
      setLoading(false);
      return;
    }

    const next = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
    setPosts((prev) => [...prev, ...next]);
    setCursor(snap.docs[snap.docs.length - 1]);
    if (snap.size < PAGE) setExhausted(true);
    setLoading(false);
  };

  useEffect(() => {
    void loadPage();
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
          setPosts([]);
          setCursor(null);
          setExhausted(false);
          setFilter(f);
        }}
      />

      <div id="feed" className="space-y-5 max-w-2xl mx-auto p-4">
        {posts.length === 0 && !loading && (
          <p className="text-center text-gray-500">No posts yet.</p>
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
