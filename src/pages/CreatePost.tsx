import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, query, where, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title?: string;
  content?: string;
  mediaUrl?: string;
  timestamp?: any;
}

export default function ManagePosts() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newContent, setNewContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch user's posts
  useEffect(() => {
    if (!currentUser) return;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "posts"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const postList: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postList);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        toast.error("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser]);

  // 🗑️ Delete Post
  const handleDelete = async (post: Post) => {
    if (!currentUser) {
      toast.error("Please log in to delete a post.");
      navigate("/login");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      // Delete from storage if it has media
      if (post.mediaUrl) {
        const fileRef = ref(storage, post.mediaUrl);
        await deleteObject(fileRef).catch(() => {
          console.warn("⚠️ Could not delete media from storage.");
        });
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "posts", post.id));

      // Update local state
      setPosts((prev) => prev.filter((p) => p.id !== post.id));

      toast.success("🗑️ Post deleted successfully!");
    } catch (error: any) {
      console.error("❌ Error deleting post:", error);
      toast.error(`Failed to delete post: ${error.message}`);
    }
  };

  // ✏️ Edit Post (optional media re-upload)
  const handleEdit = async (post: Post, file?: File) => {
    if (!currentUser) {
      toast.error("Please log in to edit a post.");
      navigate("/login");
      return;
    }

    try {
      let updatedMediaUrl = post.mediaUrl;

      // If new media is uploaded
      if (file instanceof File) {
        const isImage = file.type.startsWith("image/");
        const uploadFile = isImage
          ? await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            })
          : file;

        const fileRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}_${uploadFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, uploadFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("❌ Upload error:", error);
              toast.error("Upload failed. Please try again.");
              reject(error);
            },
            async () => {
              updatedMediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(100);
              resolve();
            },
          );
        });
      }

      // Update Firestore document
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        content: newContent || post.content,
        mediaUrl: updatedMediaUrl,
      });

      // Update local state
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, content: newContent, mediaUrl: updatedMediaUrl } : p)),
      );

      toast.success("✅ Post updated successfully!");
      setEditingPost(null);
      setUploadProgress(null);
    } catch (error: any) {
      console.error("❌ Error editing post:", error);
      toast.error(`Failed to update post: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center p-6">Loading your posts...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Your Posts</h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">You haven’t created any posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-xl shadow-sm bg-white">
                {editingPost?.id === post.id ? (
                  <>
                    <textarea
                      className="w-full border rounded p-2 mb-2"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Edit post content..."
                    />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="mb-2"
                      onChange={(e) =>
                        e.target.files && e.target.files.length > 0
                          ? handleEdit(post, e.target.files[0])
                          : handleEdit(post)
                      }
                    />
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setEditingPost(null)} variant="outline">
                        Cancel
                      </Button>
                      <Button onClick={() => handleEdit(post)}>Save</Button>
                    </div>

                    {uploadProgress !== null && (
                      <div className="w-full bg-gray-200 h-2 mt-4 rounded">
                        <div
                          className="bg-green-600 h-2 rounded transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {post.mediaUrl && (
                      <img src={post.mediaUrl} alt="Post" className="rounded-xl w-full mb-2 object-cover max-h-64" />
                    )}
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPost(post);
                          setNewContent(post.content || "");
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(post)}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
