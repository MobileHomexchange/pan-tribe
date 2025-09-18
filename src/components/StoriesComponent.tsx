import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Story {
  id: string;
  userId: string;
  imageUrl: string;
}

export const StoriesComponent = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "stories"));
        const storyList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Story[];
        setStories(storyList);
      } catch (error) {
        console.log("Error fetching stories:", error);
        // Fallback mock data
        setStories([
          { id: "1", userId: "user1", imageUrl: "https://picsum.photos/80/80?random=1" },
          { id: "2", userId: "user2", imageUrl: "https://picsum.photos/80/80?random=2" },
          { id: "3", userId: "user3", imageUrl: "https://picsum.photos/80/80?random=3" },
          { id: "4", userId: "user4", imageUrl: "https://picsum.photos/80/80?random=4" },
          { id: "5", userId: "user5", imageUrl: "https://picsum.photos/80/80?random=5" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex overflow-x-auto py-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="min-w-[80px] h-[80px] mr-2 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto py-2">
      {stories.map((story) => (
        <div
          key={story.id}
          className="min-w-[80px] h-[80px] mr-2 rounded-full overflow-hidden border-2 border-primary"
        >
          <img 
            src={story.imageUrl} 
            alt="story" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://picsum.photos/80/80?random=" + story.id;
            }}
          />
        </div>
      ))}
    </div>
  );
};