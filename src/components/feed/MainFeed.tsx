import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  userName: string;
  userAvatar?: string;
  mediaUrl?: string | null;
  postType?: string;
  timestamp?: { seconds: number; nanoseconds: number };
  [key: string]: any;
}

const MainFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(postData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">No posts yet. Be the first to share something!</div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 shadow-sm">
          {/* User Header */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              {post.userAvatar ? (
                <AvatarImage src={post.userAvatar} alt={post.userName} />
              ) : (
                <AvatarFallback>{post.userName?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold text-card-foreground">{post.userName}</p>
              {post.postType && <span className="text-xs text-muted-foreground capitalize">{post.postType}</span>}
            </div>
          </div>

          {/* Text content */}
          {post.content && <p className="text-sm text-card-foreground mb-3 whitespace-pre-line">{post.content}</p>}

          {/* Media content */}
          {post.mediaUrl && (
            <div className="mb-3">
              {post.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img src={post.mediaUrl} alt="Post media" className="rounded-lg max-h-96 w-full object-contain" />
              ) : (
                <video src={post.mediaUrl} controls className="rounded-lg max-h-96 w-full object-contain" />
              )}
            </div>
          )}

          {/* Separator and footer */}
          <Separator className="my-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>❤️ {post.likes || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MainFeed;
