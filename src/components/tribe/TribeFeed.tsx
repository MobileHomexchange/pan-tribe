import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, getDocs, or } from "firebase/firestore";
import { TribeFeedPost } from "./TribeFeedPost";
import { CreateTribePost } from "./CreateTribePost";
import { InlineFeedAd } from "@/components/feed/InlineFeedAd";
import { useAuth } from "@/contexts/AuthContext";

interface TribePost {
  id: string;
  tribeId: string;
  tribeName: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  sessionSummary?: {
    sessionName: string;
    duration: number;
    participants: number;
  };
  createdAt: any;
  likes: number;
  commentsCount: number;
}

interface TribeFeedProps {
  currentTribeId: string;
  userTribeIds: string[];
}

export function TribeFeed({ currentTribeId, userTribeIds }: TribeFeedProps) {
  const [posts, setPosts] = useState<TribePost[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query posts from public tribes and user's tribes (excluding private blackout rooms)
        const postsRef = collection(db, "tribePosts");
        
        // Get all tribe IDs including current tribe
        const allTribeIds = [...new Set([currentTribeId, ...userTribeIds])];
        
        // For now, using a simple query - in production you'd filter by visibility
        const q = query(
          postsRef,
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const postsData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            // Filter out private tribes on client side for now
            .filter((post: any) => {
              // Only show posts from public tribes or tribes user is part of
              return allTribeIds.includes(post.tribeId);
            }) as TribePost[];
          
          setPosts(postsData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching tribe posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentTribeId, userTribeIds]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl p-6 shadow-md animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4" />
            <div className="h-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Create Post Input */}
      <CreateTribePost 
        tribeId={currentTribeId}
        userAvatar={currentUser?.photoURL || ""}
        userName={currentUser?.displayName || "Anonymous"}
      />

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-md">
          <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div key={post.id}>
            <TribeFeedPost post={post} />
            
            {/* Inject ad every 20 posts */}
            {(index + 1) % 20 === 0 && (
              <InlineFeedAd adIndex={Math.floor((index + 1) / 20)} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
