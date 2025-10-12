import React, { useEffect, useState } from "react";
import TribeLayout from "@/components/layout/TribeLayout";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MyTribe() {
  const [posts, setPosts] = useState([]);
  const currentUser = { id: "demoUser", name: "Kevin" }; // replace later

  useEffect(() => {
    const q = query(collection(db, "posts"), where("authorId", "==", currentUser.id));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  return (
    <TribeLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-green-700 mb-4">My Tribe Posts</h1>
        {posts.length ? (
          posts.map((p) => (
            <div key={p.id} className="bg-white border rounded-lg shadow-sm p-4">
              <p className="font-semibold text-gray-800">{p.title}</p>
              <p className="text-gray-700 mt-1">{p.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">You haven’t posted anything yet.</p>
        )}
      </div>
    </TribeLayout>
  );
}
