import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function MainFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
    return unsub;
  }, []);

  return (
    <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                {post.authorName?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{post.authorName || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{post.createdAt?.toDate?.().toLocaleString() || ""}</p>
              </div>
            </div>

            <p className="text-gray-800 mb-2">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post media" className="rounded-md max-h-80 object-cover mb-2" />
            )}

            <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
              <span>❤️ {post.likes ?? 0}</span>
              <span>💬 {post.commentsCount ?? 0}</span>
              <span>🔗 Share</span>
            </div>
          </div>
        ))}
    </div>
  );
}
