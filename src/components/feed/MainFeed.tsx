import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Post {
  id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  content?: string;
  mediaUrl?: string;
  timestamp?: any;
  fontColor?: string;
  bgColor?: string;
}

export default function MainFeed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const feed = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(feed);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error loading posts:", error);
        toast.error("Could not load feed");
      },
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 p-6">Loading posts...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Create Post Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border">
        <div className="flex items-center gap-3">
          {currentUser?.photoURL && (
            <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          )}
          <button
            onClick={() => (window.location.href = "/create-post")}
            className="flex-1 text-left border rounded-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            What’s on your mind, {currentUser?.displayName || "you"}?
          </button>
        </div>
        <div className="flex justify-around text-sm text-gray-500 mt-3">
          <button className="flex items-center gap-1 hover:text-green-600">📸 Photo/Video</button>
          <button className="flex items-center gap-1 hover:text-green-600">😀 Feeling/Activity</button>
          <button className="flex items-center gap-1 hover:text-green-600">🎬 Reel</button>
        </div>
      </div>

      {/* Feed Posts */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border hover:shadow-md transition duration-300 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            {post.userAvatar && (
              <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{post.userName || "Anonymous"}</h3>
              <span className="text-xs text-gray-400">
                {post.timestamp?.toDate ? new Date(post.timestamp.toDate()).toLocaleString() : "Just now"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-4 text-lg leading-relaxed"
            style={{
              color: post.fontColor || "#000",
              backgroundColor: post.bgColor || "#fff",
            }}
          >
            {post.content}
          </div>

          {/* Media */}
          {post.mediaUrl && (
            <div className="bg-black">
              {post.mediaUrl.endsWith(".mp4") || post.mediaUrl.includes("video") ? (
                <video src={post.mediaUrl} controls className="w-full max-h-[500px] object-cover" />
              ) : (
                <img src={post.mediaUrl} alt="Post Media" className="w-full object-cover max-h-[500px]" />
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center border-t px-4 py-3 text-sm text-gray-600">
            <div className="flex gap-4">
              <button className="hover:text-red-500 transition">❤️ Like</button>
              <button className="hover:text-green-600 transition">💬 Comment</button>
            </div>
            {currentUser?.uid === post.userId && (
              <Link to="/manage-posts">
                <Button variant="outline" size="sm" className="text-xs hover:bg-gray-100">
                  Manage
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <p className="text-center text-gray-400 italic mt-6">No posts yet — be the first to share something!</p>
      )}
    </div>
  );
}
