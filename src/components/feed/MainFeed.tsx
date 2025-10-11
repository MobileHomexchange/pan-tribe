// MainFeed.tsx - Updated visual styling
// Add this import at the top
import { useLocation } from "react-router-dom";

export default function MainFeed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isMyTribePage = location.pathname === "/my-tribe" || location.pathname.includes("tribe");

  // ... rest of your existing state and functions remain the same

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-500">Loading feed...</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {posts.length === 0 && !loading ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => {
          const liked = currentUser && post.likes?.includes(currentUser.uid);
          const postComments = comments[post.id] || [];

          return (
            <div
              key={post.id}
              id={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Header - Improved styling */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                {post.userAvatar ? (
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {post.userName?.charAt(0) || "A"}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {post.userName || "Anonymous"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {post.timestamp?.toDate
                      ? new Date(post.timestamp.toDate()).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Just now"}
                  </span>
                </div>
              </div>

              {/* Content - Improved spacing and typography */}
              <div
                className="p-5 text-base leading-relaxed whitespace-pre-wrap"
                style={{
                  color: post.fontColor || "#1f2937",
                  backgroundColor: post.bgColor || "#fff",
                }}
              >
                {post.content}
              </div>

              {/* Media - Improved sizing */}
              {post.mediaUrl && (
                <div className="bg-gray-900 flex justify-center">
                  {post.mediaUrl.endsWith(".mp4") || post.mediaUrl.includes("video") ? (
                    <video src={post.mediaUrl} controls className="max-w-full max-h-[600px] object-contain" />
                  ) : (
                    <img src={post.mediaUrl} alt="Post Media" className="max-w-full max-h-[600px] object-contain" />
                  )}
                </div>
              )}

              {/* Footer Actions - Improved button styling */}
              <div className="flex justify-between items-center border-t border-gray-100 px-4 py-3 text-sm">
                <div className="flex gap-4 items-center">
                  <button
                    className={`flex items-center gap-1 transition-all duration-200 ${
                      liked ? "text-red-500 font-semibold" : "text-gray-600 hover:text-red-500"
                    }`}
                    onClick={() => toggleLike(post.id, liked)}
                  >
                    <span className="text-lg">❤️</span>
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors duration-200"
                    onClick={() => document.getElementById(`comments-${post.id}`)?.classList.toggle("hidden")}
                  >
                    <span className="text-lg">💬</span>
                    <span>{postComments.length}</span>
                  </button>
                  {post.mediaUrl && (
                    <button
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => {
                        const next = getNextPost(post);
                        toast.success(`Next content from ${next.userName || "New Creator"}`);
                        document.getElementById(next.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      <span className="text-lg">⏭️</span>
                      <span>Next</span>
                    </button>
                  )}
                </div>

                {currentUser?.uid === post.userId && (
                  <Link to="/manage-posts">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Manage
                    </Button>
                  </Link>
                )}
              </div>

              {/* Comment Section - Improved styling */}
              <div id={`comments-${post.id}`} className="hidden border-t border-gray-100 bg-gray-50/50 p-4">
                <div className="space-y-3">
                  {postComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <img
                        src={c.userAvatar || "/default-avatar.png"}
                        alt=""
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-sm text-gray-900">{c.userName}</strong>
                          <span className="text-xs text-gray-400">
                            {c.timestamp?.toDate
                              ? new Date(c.timestamp.toDate()).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                })
                              : "Now"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input - Improved styling */}
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newComment[post.id] || ""}
                    onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === "Enter" && addComment(post.id)}
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
