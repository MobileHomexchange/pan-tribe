import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Bookmark, User, Home, Users, Video } from "lucide-react";

interface Video {
  id: string;
  url: string;
  userId: string;
  title?: string;
  description?: string;
}

// Placeholder videos - replace with Firebase data
const videos: Video[] = [
  { id: "1", url: "https://path-to-video1.mp4", userId: "user1", title: "Amazing Video 1" },
  { id: "2", url: "https://path-to-video2.mp4", userId: "user2", title: "Cool Content 2" },
  { id: "3", url: "https://path-to-video3.mp4", userId: "user3", title: "Awesome Reel 3" },
];

const ReelsHorizontal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Autoplay visible video
  useEffect(() => {
    if (!containerRef.current) return;

    const vids = containerRef.current.querySelectorAll("video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(console.error);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    vids.forEach((video) => observer.observe(video));
    return () => vids.forEach((video) => observer.unobserve(video));
  }, []);

  const handleLike = (videoId: string) => {
    // TODO: Implement like functionality with Firebase
    console.log("Liked video:", videoId);
  };

  const handleComment = (videoId: string) => {
    // TODO: Implement comment functionality
    console.log("Comment on video:", videoId);
  };

  const handleShare = (videoId: string) => {
    // TODO: Implement share functionality
    console.log("Share video:", videoId);
  };

  const handleSave = (videoId: string) => {
    // TODO: Implement save functionality
    console.log("Save video:", videoId);
  };

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
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* Right-side vertical buttons */}
          <div className="absolute bottom-20 right-3 flex flex-col gap-4 items-center">
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => handleLike(video.id)}
            >
              <Heart className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => handleComment(video.id)}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => handleShare(video.id)}
            >
              <Repeat2 className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={() => handleSave(video.id)}
            >
              <Bookmark className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
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
    </div>
  );
};

export default ReelsHorizontal;