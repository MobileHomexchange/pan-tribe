import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { InlineFeedAd } from "./InlineFeedAd";

export default function MainFeed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    console.log("🔥 Firestore connected:", db);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
    return unsub;
  }, []);

  return (
    <div className="space-y-5 w-full">
      {posts.map((post, index) => (
        <React.Fragment key={post.id}>
          <div className="bg-white rounded-lg shadow-sm border p-4 w-full">
            {/* Author row */}
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 flex-shrink-0">
                {post.authorName?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="ml-3 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{post.authorName || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{post.createdAt?.toDate?.().toLocaleString() || ""}</p>
              </div>
            </div>

            {/* Post content */}
            <p className="text-gray-800 mb-2 break-words">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post media"
                className="rounded-md w-full max-w-full h-auto object-cover mb-2"
              />
            )}

            {/* Post footer */}
            <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
              <span>❤️ {post.likes ?? 0}</span>
              <span>💬 {post.commentsCount ?? 0}</span>
              <span>🔗 Share</span>
            </div>
          </div>

          {/* Inject ad every 20 posts */}
          {(index + 1) % 20 === 0 && <InlineFeedAd adIndex={Math.floor((index + 1) / 20)} />}
        </React.Fragment>
      ))}
    </div>
  );
}
