import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import PostCard from "@/components/home/PostCard";
import { InlineFeedAd } from "./InlineFeedAd";

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

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("🔥 Firestore connected:", db);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(data);
    });

    return unsub;
  }, []);

  return (
    <div className="space-y-5 max-w-2xl mx-auto p-4">
      {posts.length === 0 && <p className="text-center text-gray-500">No posts yet.</p>}

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

          {/* Inject ad every 20 posts */}
          {(index + 1) % 20 === 0 && <InlineFeedAd adIndex={Math.floor((index + 1) / 20)} />}
        </React.Fragment>
      ))}
    </div>
  );
}
