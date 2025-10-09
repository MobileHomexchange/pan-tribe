import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  addDoc,
} from "firebase/firestore";
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
  likes?: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: any;
}

export default function MainFeed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
      setPosts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch comments for each post
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    posts.forEach((post) => {
      const q = query(collection(db, `posts/${post.id}/comments`), orderBy("timestamp", "asc"));
      const unsub = onSnapshot(q, (snap) => {
        setComments((prev) => ({
          ...prev,
          [post.id]: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Comment[],
        }));
      });
      unsubscribers.push(unsub);
    });
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [posts]);

  const toggleLike = async (postId: string, liked: boolean) => {
    if (!currentUser) return toast.error("Log in to like posts");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
  };

  const addComment = async (postId: string) => {
    const text = newComment[postId];
    if (!text?.trim()) return;
    await addDoc(collection(db, `posts/${postId}/comments`), {
      userId: currentUser?.uid,
      userName: currentUser?.displayName || "Anonymous",
      userAvatar: currentUser?.photoURL || "",
      text,
      timestamp: new Date(),
    });
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  const getNextPost = (currentPost: Post) => {
    const related = posts.find(
      (p) => p.userId === currentPost.userId && p.id !== currentPost.id && p.content?.toLowerCase().includes("part"),
    );
    return related || posts[Math.floor(Math.random() * posts.length)];
  };

  if (loading) return <p className="text-center text-gray-500 p-6">Loading feed...</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const liked = currentUser && post.likes?.includes(currentUser.uid);
        const postComments = comments[post.id] || [];

        return (
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
              <div className="flex gap-4 items-center">
                <button
                  className={`transition ${liked ? "text-red-500" : "hover:text-red-500"}`}
                  onClick={() => toggleLike(post.id, liked)}
                >
                  ❤️ {post.likes?.length || 0}
                </button>
                <button
                  className="hover:text-green-600"
                  onClick={() => document.getElementById(`comments-${post.id}`)?.classList.toggle("hidden")}
                >
                  💬 {postComments.length}
                </button>
                {post.mediaUrl && (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      const next = getNextPost(post);
                      toast.success(`Next content: ${next.userName || "New Creator"}`);
                      document.getElementById(next.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    ⏭️ Next Video
                  </button>
                )}
              </div>

              {currentUser?.uid === post.userId && (
                <Link to="/manage-posts">
                  <Button variant="outline" size="sm" className="text-xs">
                    Manage
                  </Button>
                </Link>
              )}
            </div>

            {/* Comment Section */}
            <div id={`comments-${post.id}`} className="hidden border-t bg-gray-50 p-3">
              {postComments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 mb-2">
                  <img src={c.userAvatar || "/default-avatar.png"} alt="" className="w-8 h-8 rounded-full" />
                  <div className="bg-white p-2 rounded-lg shadow text-sm flex-1">
                    <strong>{c.userName}</strong>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-3 py-1 text-sm"
                  value={newComment[post.id] || ""}
                  onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                />
                <button onClick={() => addComment(post.id)} className="text-green-600 font-semibold">
                  Post
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
