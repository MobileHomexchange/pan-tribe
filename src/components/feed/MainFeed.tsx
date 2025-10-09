import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  content?: string;
  mediaUrl?: string;
  timestamp?: any;
  type?: string;
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
        // Fetch user posts
        const postsSnap = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
        const posts = postsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isBlog: false,
        })) as Post[];

        // Fetch blog posts
        const blogsSnap = await getDocs(query(collection(db, "blogs"), orderBy("timestamp", "desc")));
        const blogs = blogsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isBlog: true,
        })) as Post[];

        // Merge and sort all items
        const combined = [...posts, ...blogs].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        setFeedItems(combined);
      } catch (error) {
        console.error("❌ Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 p-6">Loading feed...</p>;
  }

  if (feedItems.length === 0) {
    return <p className="text-center text-gray-500 p-6">No posts yet.</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Community Feed</h1>
        <Link to="/create-post">
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow">+ Create Post</Button>
        </Link>
      </div>

      {feedItems.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl p-5 shadow-md border transition transform hover:scale-[1.01] hover:shadow-lg duration-300 ${
            item.isBlog
              ? "bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-100 border-yellow-200"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
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
          {item.mediaUrl && (
            <img
              src={item.mediaUrl}
              alt="Post media"
              className={`w-full rounded-lg mb-3 object-cover max-h-96 ${
                item.isBlog ? "border border-orange-200" : ""
              }`}
            />
          )}
          <p className={`${item.isBlog ? "text-gray-800 leading-relaxed font-medium" : "text-gray-700"} mb-3`}>
            {item.content}
          </p>

          {/* Manage Button (only for current user's posts) */}
          {currentUser?.uid === item.userId && (
            <div className="text-right">
              <Link to="/manage-posts">
                <Button
                  variant="outline"
                  className={`text-xs px-3 py-1 rounded-md ${
                    item.isBlog
                      ? "border-orange-300 text-orange-600 hover:bg-orange-100"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Manage
                </Button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
