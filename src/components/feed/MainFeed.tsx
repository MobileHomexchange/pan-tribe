import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

/* ---------- Types ---------- */
interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

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
  likes?: string[]; // array of userIds
  comments?: Comment[];
}

/* ---------- Component ---------- */
export default function MainFeed() {
  const { currentUser } = useAuth();
  const [feedItems, setFeedItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Manage modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Comment state
  const [commentText, setCommentText] = useState("");

  /* ---------- Fetch posts + blogs ---------- */
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

        // Merge and algorithmic sort
        const combined = [...posts, ...blogs].sort((a, b) => {
          const aScore = scorePost(a);
          const bScore = scorePost(b);
          return bScore - aScore;
        });

        setFeedItems(combined);
      } catch (error) {
        console.error("❌ Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  /* ---------- Algorithmic Ranking ---------- */
  const scorePost = (post: Post): number => {
    const likes = post.likes?.length || 0;
    const comments = post.comments?.length || 0;
    const ageHours = post.timestamp?.seconds ? (Date.now() / 1000 - post.timestamp.seconds) / 3600 : 0;
    // Weight recent & engaging content
    return likes * 2 + comments * 3 - ageHours * 0.2;
  };

  /* ---------- Likes ---------- */
  const toggleLike = async (post: Post) => {
    if (!currentUser) return toast.error("Log in to like posts");
    const postRef = doc(db, post.isBlog ? "blogs" : "posts", post.id);
    const hasLiked = post.likes?.includes(currentUser.uid);

    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });

    setFeedItems((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: hasLiked ? p.likes?.filter((id) => id !== currentUser.uid) : [...(p.likes || []), currentUser.uid],
            }
          : p,
      ),
    );
  };

  /* ---------- Comments ---------- */
  const addComment = async (post: Post) => {
    if (!currentUser) return toast.error("Log in to comment");
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      userId: currentUser.uid,
      userName: currentUser.displayName || "Anonymous",
      content: commentText.trim(),
      timestamp: Date.now(),
    };

    const postRef = doc(db, post.isBlog ? "blogs" : "posts", post.id);
    await updateDoc(postRef, { comments: arrayUnion(newComment) });

    setFeedItems((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, comments: [...(p.comments || []), newComment] } : p)),
    );
    setCommentText("");
  };

  /* ---------- Edit / Delete ---------- */
  const handleSave = async (file?: File) => {
    if (!selectedPost) return;
    try {
      let newMediaUrl = selectedPost.mediaUrl;
      if (file instanceof File) {
        const isImage = file.type.startsWith("image/");
        const uploadFile = isImage
          ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true })
          : file;
        const fileRef = ref(storage, `posts/${currentUser?.uid}/${Date.now()}_${uploadFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, uploadFile);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (s) => setUploadProgress((s.bytesTransferred / s.totalBytes) * 100),
            reject,
            async () => {
              newMediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            },
          );
        });
      }
      const postRef = doc(db, selectedPost.isBlog ? "blogs" : "posts", selectedPost.id);
      await updateDoc(postRef, { content: editContent, mediaUrl: newMediaUrl });
      setFeedItems((prev) =>
        prev.map((p) => (p.id === selectedPost.id ? { ...p, content: editContent, mediaUrl: newMediaUrl } : p)),
      );
      toast.success("✅ Post updated");
      setSelectedPost(null);
      setUploadProgress(null);
      setPreviewUrl(null);
    } catch (e: any) {
      toast.error(`Error: ${e.message}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    if (!confirm("Delete this post?")) return;
    const postRef = doc(db, selectedPost.isBlog ? "blogs" : "posts", selectedPost.id);
    if (selectedPost.mediaUrl) {
      const fileRef = ref(storage, selectedPost.mediaUrl);
      await deleteObject(fileRef).catch(() => {});
    }
    await deleteDoc(postRef);
    setFeedItems((prev) => prev.filter((p) => p.id !== selectedPost.id));
    setSelectedPost(null);
    toast.success("🗑️ Deleted");
  };

  const handleFilePreview = (file: File) => setPreviewUrl(URL.createObjectURL(file));

  /* ---------- UI ---------- */
  if (loading) return <p className="text-center text-gray-500 p-6">Loading feed...</p>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Community Feed</h1>
        <Link to="/create-post">
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow">+ Create Post</Button>
        </Link>
      </div>

      {/* Posts */}
      {feedItems.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl p-5 shadow-md border transition hover:shadow-lg ${
            item.isBlog
              ? "bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-100 border-yellow-200"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            {item.userAvatar && <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full" />}
            <div>
              <h3 className="font-semibold text-gray-900">{item.userName || "Anonymous"}</h3>
              {item.isBlog && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                  Featured Blog
                </span>
              )}
            </div>
          </div>

          {/* Media + Text */}
          {item.mediaUrl && (
            <img src={item.mediaUrl} alt="Post" className="w-full rounded-lg mb-3 object-cover max-h-96" />
          )}
          <p className="text-gray-800 mb-3 leading-relaxed">{item.content}</p>

          {/* Reaction Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleLike(item)} className="flex items-center gap-1 hover:text-red-500">
                {item.likes?.includes(currentUser?.uid || "") ? "❤️" : "🤍"}
                <span>{item.likes?.length || 0}</span>
              </button>
              <button className="flex items-center gap-1">
                💬 <span>{item.comments?.length || 0}</span>
              </button>
            </div>
            {currentUser?.uid === item.userId && (
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${
                  item.isBlog
                    ? "border-orange-300 text-orange-600 hover:bg-orange-100"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedPost(item);
                  setEditContent(item.content || "");
                  setPreviewUrl(item.mediaUrl || null);
                }}
              >
                Manage
              </Button>
            )}
          </div>

          {/* Comment Section */}
          <div className="mt-3 space-y-2">
            {(item.comments || []).slice(-3).map((c) => (
              <div key={c.id} className="text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-semibold">{c.userName}:</span> {c.content}
              </div>
            ))}

            {currentUser && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => addComment(item)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Post
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Manage Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Post</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border rounded p-3"
                rows={4}
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => e.target.files?.[0] && handleFilePreview(e.target.files[0])}
              />
              {previewUrl && (
                <div className="mt-3">
                  {previewUrl.match(/\.mp4|\.webm/) ? (
                    <video src={previewUrl} controls className="rounded-lg w-full max-h-80" />
                  ) : (
                    <img src={previewUrl} className="rounded-lg w-full max-h-80" />
                  )}
                </div>
              )}
              {uploadProgress !== null && (
                <div className="w-full bg-gray-200 h-2 rounded mt-3">
                  <div
                    className="bg-green-600 h-2 rounded transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedPost(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave()}
              disabled={!editContent.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
