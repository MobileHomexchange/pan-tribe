import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DOMPurify from "dompurify";
import { detectAndEmbedMedia } from "@/lib/mediaEmbedder";

interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: string[];
}

export const PostComponent = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "posts"));
        const postList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postList);
      } catch (error) {
        console.log("Error fetching posts:", error);
        // Fallback mock data
        setPosts([
          {
            id: "1",
            userId: "John Doe",
            content: "This is a sample post! Loving the new features.",
            imageUrl: "https://picsum.photos/400/300?random=1",
            likes: 15,
            comments: ["Nice post!", "Great content!"]
          },
          {
            id: "2", 
            userId: "Jane Smith",
            content: "Beautiful sunset today! 🌅",
            likes: 23,
            comments: ["Amazing!", "Gorgeous view"]
          },
          {
            id: "3",
            userId: "Mike Johnson", 
            content: "Working on some exciting projects. Stay tuned!",
            imageUrl: "https://picsum.photos/400/300?random=3",
            likes: 8,
            comments: ["Can't wait!"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const likePost = async (postId: string, currentLikes: number) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { likes: currentLikes + 1 });
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (error) {
      console.log("Error liking post:", error);
      // Still update UI optimistically
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    }
  };

  if (loading) {
    return (
      <div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full bg-card mb-2 p-4 rounded-lg shadow-sm border">
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-16 bg-muted rounded animate-pulse mb-2" />
            <div className="h-8 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {posts.map(post => (
        <div
          key={post.id}
          className="w-full bg-card mb-2 p-4 rounded-lg shadow-sm border"
        >
          <div className="font-semibold text-card-foreground mb-2">{post.userId}</div>
          <div 
            className="mb-3 text-card-foreground"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(detectAndEmbedMedia(post.content), {
                ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'a', 'strong', 'em', 'div', 'iframe'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'frameborder', 'allow', 'allowfullscreen']
              })
            }}
          />
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="post" 
              className="w-full rounded-lg mb-3"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex justify-between text-muted-foreground">
            <span 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => likePost(post.id, post.likes)}
            >
              ❤️ {post.likes}
            </span>
            <span>💬 {post.comments.length}</span>
            <span className="cursor-pointer hover:text-primary transition-colors">🔁</span>
          </div>
        </div>
      ))}
    </div>
  );
};