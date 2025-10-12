import React, { useEffect, useState } from "react";
import TribeLayout from "@/components/layout/TribeLayout";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function MyTribeSimple() {
  const [posts, setPosts] = useState([]);
  const currentUser = { id: "demoUser", name: "Kevin" }; // Replace with real auth

  useEffect(() => {
    const q = query(collection(db, "posts"), where("authorId", "==", currentUser.id));
    const unsub = onSnapshot(q, (snapshot) =>
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return unsub;
  }, []);

  return (
    <TribeLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-green-700 mb-4">My Tribe Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-lg shadow-sm p-4"
            >
              <p className="font-semibold text-gray-800">{post.title}</p>
              <p className="text-gray-700 mt-1">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">
            You haven't posted anything yet.
          </p>
        )}
      </div>
    </TribeLayout>
  );
}
