import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../lib/firebaseConfig"; // adjust if your file is named differently
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: if you have an AuthContext, pull from there.
// For now, use safe fallbacks so this page still works.
const getCurrentUser = () => ({
  uid: "TEMP_USER_ID",
  displayName: "Anonymous",
  photoURL: "",
});

export default function CreatePost() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim() && !file) {
      setError("Write something or attach an image.");
      return;
    }

    try {
      setUploading(true);

      // Upload image (optional)
      let imageUrl = "";
      if (file) {
        const path = `posts/${user.uid}/${Date.now()}-${file.name}`;
        const r = ref(storage, path);
        await uploadBytes(r, file);
        imageUrl = await getDownloadURL(r);
      }

      // Write the post (fields match MainFeed expectations)
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        authorName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "",
        content: content.trim(),
        imageUrl: imageUrl || "",
        likes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(), // MainFeed orders by createdAt
        timestamp: serverTimestamp(), // leave also for older code using 'timestamp'
        // Optional: location
        // location: { lat: 34.0007, lon: -81.0348 }
      });

      navigate("/feed");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <textarea
          className="w-full min-h-[140px] rounded-md border p-3"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center justify-between gap-4">
          <input type="file" accept="image/*" onChange={onSelect} />
          {file && (
            <span className="text-sm text-gray-600 truncate max-w-[60%]">
              {file.name}
            </span>
          )}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={uploading}
            className={
              "inline-flex items-center rounded-md px-4 py-2 text-white " +
              (uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[hsl(var(--primary))] hover:opacity-90")
            }
          >
            {uploading ? "Posting…" : "Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md px-4 py-2 border"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
