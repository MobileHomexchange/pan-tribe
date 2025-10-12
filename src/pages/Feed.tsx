import React, { useEffect, useState } from "react";
import TribeLayout from "@/components/layout/TribeLayout";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  return (
    <TribeLayout>
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                {p.authorName?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-semibold">{p.authorName || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{p.createdAt?.toDate?.().toLocaleString() || ""}</p>
              </div>
            </div>
            <p className="text-gray-800 mb-2">{p.content}</p>
            {p.imageUrl && <img src={p.imageUrl} alt="Post media" className="rounded-md max-h-80 object-cover mb-2" />}
            <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
              <span>❤️ {p.likes ?? 0}</span>
              <span>💬 {p.commentsCount ?? 0}</span>
              <span>🔗 Share</span>
            </div>
          </div>
        ))}
      </div>
    </TribeLayout>
  );
}
