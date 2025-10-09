import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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
  isBlog?: boolean;
}

export default function MainFeed() {
  const { currentUser } = useAuth();
  const [feedItems, setFeedItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const postsSnap = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        const posts = postsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isBlog: false,
        })) as Post[];

        const blogsSnap = await getDocs(query(collection(db, "blogs"), orderBy("timestamp", "desc")));
        const blogs = blogsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isBlog: true,
        })) as Post[];

        const combined = [...posts, ...blogs].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        setFeedItems(combined);
      } catch (error) {
        console.error("❌ Error loading feed:", error);
        toast.error("Could not load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 p-6">Loading feed...</p>;
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

      {/* Feed Cards */}
      {feedItems.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-xl shadow-sm border transition hover:shadow-md duration-300 ${
            item.isBlog ? "border-yellow-200 bg-yellow-50" : "border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            {item.userAvatar && (
              <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{item.userName || "Anonymous"}</h3>
              {item.isBlog && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                  Featured Blog
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          {item.mediaUrl && <img src={item.mediaUrl} alt="Post" className="w-full object-cover max-h-96" />}
          <div className="p-4 text-gray-800 leading-relaxed">{item.content}</div>

          {/* Reactions Bar */}
          <div className="flex justify-between items-center border-t px-4 py-2 text-sm text-gray-600">
            <div className="flex gap-3">
              <button className="hover:text-red-500">❤️ Like</button>
              <button className="hover:text-green-600">💬 Comment</button>
            </div>
            {currentUser?.uid === item.userId && (
              <Link to="/manage-posts">
                <Button variant="outline" size="sm" className="text-xs">
                  Manage
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
