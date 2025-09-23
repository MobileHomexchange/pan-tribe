import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface AdBanner {
  isActive: boolean;
  content: string;
  clicks?: number;
  uniqueClicks?: Record<string, any>;
}

const PostCard = ({ post }: { post: Post }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.authorAvatar} />
          <AvatarFallback>{post.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold text-foreground">{post.author}</div>
          <div className="text-sm text-muted-foreground">{post.timestamp}</div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4 text-foreground">{post.content}</div>
      
      <div className="flex items-center gap-6 pt-3 border-t border-border">
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share className="h-4 w-4" />
          {post.shares}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const MainFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [adBanner, setAdBanner] = useState<AdBanner>({ isActive: false, content: "" });
  const { currentUser } = useAuth();

  useEffect(() => {
    // Mock posts data - replace with actual Firebase query
    setPosts([
      {
        id: "1",
        content: "Just attended an amazing tech conference! The future of AI looks incredibly promising. Can't wait to implement some of these new ideas in our upcoming projects.",
        author: "Sarah Chen",
        authorAvatar: "",
        timestamp: "2 hours ago",
        likes: 24,
        comments: 8,
        shares: 3
      },
      {
        id: "2",
        content: "Sharing my latest startup journey insights. Building a sustainable business model is challenging but rewarding. Here are 5 key lessons I learned this quarter...",
        author: "Marcus Johnson",
        authorAvatar: "",
        timestamp: "4 hours ago",
        likes: 45,
        comments: 12,
        shares: 7
      },
      {
        id: "3",
        content: "Beautiful sunrise from our company retreat in the mountains. Sometimes stepping away from the screen gives you the best perspective on solving complex problems.",
        author: "Elena Rodriguez",
        authorAvatar: "",
        timestamp: "6 hours ago",
        likes: 67,
        comments: 15,
        shares: 12
      },
      {
        id: "4",
        content: "Excited to announce that our team just launched the beta version of our new productivity app! Looking for beta testers who want to revolutionize their workflow.",
        author: "David Kim",
        authorAvatar: "",
        timestamp: "8 hours ago",
        likes: 89,
        comments: 23,
        shares: 18
      },
      {
        id: "5",
        content: "Hosting a virtual networking event next week for entrepreneurs in the fintech space. DM me if you're interested in joining! Let's build amazing connections.",
        author: "Priya Patel",
        authorAvatar: "",
        timestamp: "10 hours ago",
        likes: 56,
        comments: 19,
        shares: 14
      }
    ]);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "adminSettings", "adBanner"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdBanner({ 
          isActive: data.isActive || false, 
          content: data.content || "",
          clicks: data.clicks || 0,
          uniqueClicks: data.uniqueClicks || {}
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdClick = async () => {
    if (!currentUser) return;
    
    try {
      const adRef = doc(db, "adminSettings", "adBanner");
      await updateDoc(adRef, {
        clicks: increment(1),
        [`uniqueClicks.${currentUser.uid}`]: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Open ad link - replace with actual ad destination
      window.open("https://example.com/ad-destination", "_blank");
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  };

  // Insert ads every 4 posts
  const feedWithAds: (Post | AdBanner)[] = [];
  posts.forEach((post, index) => {
    feedWithAds.push(post);
    if ((index + 1) % 4 === 0 && adBanner.isActive && adBanner.content) {
      feedWithAds.push({ ...adBanner, id: `ad-${index}` } as AdBanner & { id: string });
    }
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {feedWithAds.map((item, idx) => {
        if ("isActive" in item) {
          return (
            <div key={`ad-${idx}`} className="relative -mx-6 lg:-mx-20 xl:-mx-32">
              <div 
                onClick={handleAdClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 py-8 px-6 lg:px-8"
              >
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">📢</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                        Sponsored Listing
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {item.content}
                    </h3>
                    <p className="text-emerald-100 text-sm md:text-base">
                      Reach more buyers with promoted listings
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors duration-200 shadow-lg">
                      Promote Your Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return <PostCard key={item.id} post={item} />;
        }
      })}
    </div>
  );
};

export default MainFeed;