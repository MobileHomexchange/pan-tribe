import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirebaseService } from "@/lib/firebaseService";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedAlgorithm } from "@/hooks/useFeedAlgorithm";
import { useSavedItems } from "@/hooks/useSavedItems";
import { Button } from "@/components/ui/button";
import { CommentsModal } from "@/components/CommentsModal";
import { ShareModal } from "@/components/ShareModal";
import { Heart, MessageCircle, Share, Bookmark, User, Home, Users, Video } from "lucide-react";
import { Comment } from "@/types";
import { toast } from "@/hooks/use-toast";

interface Video {
  id: string;
  url: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  title?: string;
  description?: string;
  likes: string[];
  comments: Comment[];
  savedBy: string[];
  shares: number;
  createdAt: any;
}

const ReelsHorizontal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateInterests } = useFeedAlgorithm();
  const { isSaved, toggleSave } = useSavedItems();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoForComments, setSelectedVideoForComments] = useState<Video | null>(null);
  const [selectedVideoForShare, setSelectedVideoForShare] = useState<Video | null>(null);
  const [viewStartTimes, setViewStartTimes] = useState<Map<string, number>>(new Map());

  // Fetch videos from Firebase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reels"));
        const videoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          likes: doc.data().likes || [],
          comments: doc.data().comments || [],
          savedBy: doc.data().savedBy || [],
          shares: doc.data().shares || 0
        })) as Video[];
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast({
          title: "Error loading videos",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Autoplay visible video with analytics
  useEffect(() => {
    const vids = containerRef.current?.querySelectorAll("video");
    if (!vids) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          const videoId = videoElement.getAttribute('data-video-id');
          
          if (entry.isIntersecting) {
            videoElement.play();
            // Track view start time
            if (videoId) {
              setViewStartTimes(prev => new Map(prev.set(videoId, Date.now())));
            }
          } else {
            videoElement.pause();
            // Track view duration when video goes out of view
            if (videoId && currentUser) {
              const startTime = viewStartTimes.get(videoId);
              if (startTime) {
                const duration = Math.round((Date.now() - startTime) / 1000);
                FirebaseService.trackView(videoId, currentUser.uid, duration);
                updateInterests(
                  videos.find(v => v.id === videoId) as any,
                  'view',
                  duration
                );
              }
            }
          }
        });
      },
      { threshold: 0.75 }
    );

    vids.forEach((video) => observer.observe(video));
    return () => vids.forEach((video) => observer.unobserve(video));
  }, [videos, currentUser, viewStartTimes, updateInterests]);

  // Interaction handlers
  const handleLike = async (video: Video) => {
    if (!currentUser) return;
    
    try {
      const result = await FirebaseService.toggleLike(video.id, currentUser.uid);
      setVideos(prev => prev.map(v => 
        v.id === video.id 
          ? { ...v, likes: result.liked 
              ? [...v.likes, currentUser.uid]
              : v.likes.filter(id => id !== currentUser.uid)
            }
          : v
      ));
      updateInterests(video as any, 'like');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update like",
        variant: "destructive"
      });
    }
  };

  const handleComment = (video: Video) => {
    setSelectedVideoForComments(video);
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !selectedVideoForComments) return;
    
    try {
      const newComment = await FirebaseService.addComment(
        selectedVideoForComments.id,
        currentUser.uid,
        currentUser.displayName || 'Anonymous',
        content
      );
      
      setVideos(prev => prev.map(v => 
        v.id === selectedVideoForComments.id 
          ? { ...v, comments: [...v.comments, newComment] }
          : v
      ));
      
      updateInterests(selectedVideoForComments as any, 'comment');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add comment",
        variant: "destructive"
      });
    }
  };

  const handleShare = (video: Video) => {
    setSelectedVideoForShare(video);
  };

  const handleShareComplete = async (platform?: string) => {
    if (!currentUser || !selectedVideoForShare) return;
    
    try {
      await FirebaseService.trackShare(selectedVideoForShare.id, currentUser.uid, platform);
      setVideos(prev => prev.map(v => 
        v.id === selectedVideoForShare.id 
          ? { ...v, shares: v.shares + 1 }
          : v
      ));
      updateInterests(selectedVideoForShare as any, 'share');
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const handleSave = (video: Video) => {
    toggleSave({
      id: video.id,
      title: video.title || 'Video',
      type: 'video',
      description: video.description
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="text-center">
          <Video className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No videos available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto w-screen h-screen snap-x snap-mandatory scroll-smooth"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex-none w-full h-full relative snap-start"
        >
          <video
            src={video.url}
            data-video-id={video.id}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Right-side vertical buttons */}
          <div className="absolute bottom-20 right-3 flex flex-col gap-4 items-center">
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none relative"
              onClick={() => handleLike(video)}
            >
              <Heart 
                className={`w-6 h-6 ${
                  currentUser && video.likes.includes(currentUser.uid) 
                    ? 'fill-red-500 text-red-500' 
                    : ''
                }`} 
              />
              {video.likes.length > 0 && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                  {video.likes.length}
                </span>
              )}
            </Button>
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none relative"
              onClick={() => handleComment(video)}
            >
              <MessageCircle className="w-6 h-6" />
              {video.comments.length > 0 && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                  {video.comments.length}
                </span>
              )}
            </Button>
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none relative"
              onClick={() => handleShare(video)}
            >
              <Share className="w-6 h-6" />
              {video.shares > 0 && (
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                  {video.shares}
                </span>
              )}
            </Button>
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => handleSave(video)}
            >
              <Bookmark 
                className={`w-6 h-6 ${
                  isSaved(video.id) ? 'fill-yellow-500 text-yellow-500' : ''
                }`} 
              />
            </Button>
            <Button
              size="lg"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => navigate(`/profile/${video.userId}`)}
            >
              <User className="w-6 h-6" />
            </Button>
          </div>

          {/* Bottom navigation bar */}
          <div className="absolute bottom-0 w-full flex justify-around bg-black/30 py-3 text-white">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
            
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 flex items-center gap-2"
              onClick={() => navigate("/friends")}
            >
              <Users className="w-5 h-5" />
              Friends
            </Button>
            
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 flex items-center gap-2"
              onClick={() => navigate("/reels")}
            >
              <Video className="w-5 h-5" />
              My Videos
            </Button>
          </div>
        </div>
      ))}
      
      {/* Comments Modal */}
      {selectedVideoForComments && (
        <CommentsModal
          post={{
            id: selectedVideoForComments.id,
            author: {
              name: selectedVideoForComments.userName || 'Anonymous',
              avatar: selectedVideoForComments.userAvatar || '',
              initials: (selectedVideoForComments.userName || 'A').charAt(0).toUpperCase()
            },
            comments: selectedVideoForComments.comments.length
          }}
          onClose={() => setSelectedVideoForComments(null)}
          onAddComment={async (content: string) => {
            await handleAddComment(content);
            return true;
          }}
          open={!!selectedVideoForComments}
        />
      )}
      
      {/* Share Modal */}
      {selectedVideoForShare && (
        <ShareModal
          post={{
            id: selectedVideoForShare.id,
            author: {
              name: selectedVideoForShare.userName || 'Anonymous',
              avatar: selectedVideoForShare.userAvatar || '',
              initials: (selectedVideoForShare.userName || 'A').charAt(0).toUpperCase()
            },
            content: selectedVideoForShare.title || 'Check out this video!'
          }}
          onClose={() => setSelectedVideoForShare(null)}
          onShare={handleShareComplete}
          open={!!selectedVideoForShare}
        />
      )}
    </div>
  );
};

export default ReelsHorizontal;