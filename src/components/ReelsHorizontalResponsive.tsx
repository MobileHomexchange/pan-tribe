import React, { useRef, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { CommentsModal } from "./CommentsModal";
import { ShareModal } from "./ShareModal";
import { Heart, MessageCircle, Share, Bookmark, User, Maximize, Minimize, ChevronUp, ChevronDown } from "lucide-react";

interface Video {
  id: string;
  url: string;
  userId: string;
  userName: string;
  likes: number;
  comments: number;
  shares: number;
  savedBy: string[];
  liked?: boolean;
  saved?: boolean;
}

const mockVideos: Video[] = [
  {
    id: "1",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    userId: "user1",
    userName: "John Doe",
    likes: 1200,
    comments: 45,
    shares: 23,
    savedBy: [],
  },
  {
    id: "2", 
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    userId: "user2",
    userName: "Jane Smith",
    likes: 890,
    comments: 32,
    shares: 15,
    savedBy: [],
  },
  {
    id: "3",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
    userId: "user3",
    userName: "Mike Johnson",
    likes: 1500,
    comments: 67,
    shares: 45,
    savedBy: [],
  },
];

const buttonStyle = {
  width: "12vw",
  height: "12vw",
  borderRadius: "6vw",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  fontSize: "6vw",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ReelsHorizontalResponsive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Lock orientation to portrait on mount
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('portrait');
        }
      } catch (error) {
        console.log('Orientation lock not supported:', error);
      }
    };
    lockOrientation();

    return () => {
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch videos from Firestore with fallback to mock data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reels"));
        if (!querySnapshot.empty) {
          const videoList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Video[];
          setVideos(videoList);
        } else {
          setVideos(mockVideos);
        }
      } catch (error) {
        console.log("Using mock data due to Firebase error:", error);
        setVideos(mockVideos);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Autoplay visible video
  useEffect(() => {
    if (!containerRef.current) return;
    
    const vids = containerRef.current.querySelectorAll("video");
    if (!vids.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(console.error);
            // Update current video index
            const index = video.getAttribute('data-index');
            if (index !== null) {
              setCurrentVideoIndex(parseInt(index, 10));
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    vids.forEach((video) => observer.observe(video));
    return () => vids.forEach((video) => observer.unobserve(video));
  }, [videos]);

  const handleLike = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { 
            ...video, 
            liked: !video.liked,
            likes: video.liked ? video.likes - 1 : video.likes + 1
          }
        : video
    ));
  };

  const handleComment = (videoId: string) => {
    setSelectedVideoId(videoId);
    setCommentsModalOpen(true);
  };

  const handleShare = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShareModalOpen(true);
  };

  const handleSave = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, saved: !video.saved }
        : video
    ));
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const scrollToPreviousReel = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = containerRef.current?.querySelectorAll('video')[currentVideoIndex - 1];
      prevVideo?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToNextReel = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextVideo = containerRef.current?.querySelectorAll('video')[currentVideoIndex + 1];
      nextVideo?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        color: "white",
        fontSize: "5vw"
      }}>
        Loading videos...
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div style={{
        width: "100vw", 
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        color: "white",
        fontSize: "5vw"
      }}>
        No videos available
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          width: "100vw",
          height: "100vh",
          scrollBehavior: "smooth",
          background: "black",
          zIndex: 9999,
        }}
      >
        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          style={{
            position: "fixed",
            top: "2vh",
            right: "3vw",
            zIndex: 10000,
            background: "rgba(0,0,0,0.6)",
            border: "none",
            borderRadius: "50%",
            width: "10vw",
            height: "10vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Navigation Arrow - Previous (Top Center) */}
        <button
          onClick={scrollToPreviousReel}
          style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            background: "rgba(0,0,0,0.6)",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "50%",
            width: "14vw",
            height: "14vw",
            display: currentVideoIndex === 0 ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <ChevronUp size={24} />
        </button>

        {/* Navigation Arrow - Next (Bottom Center) */}
        <button
          onClick={scrollToNextReel}
          style={{
            position: "fixed",
            bottom: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            background: "rgba(0,0,0,0.6)",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "50%",
            width: "14vw",
            height: "14vw",
            display: currentVideoIndex === videos.length - 1 ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <ChevronDown size={24} />
        </button>

        {videos.map((video, index) => (
          <div
            key={video.id}
            style={{
              minHeight: "100vh",
              scrollSnapAlign: "start",
              position: "relative",
            }}
          >
            <video
              src={video.url}
              data-index={index}
              style={{
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
              }}
              muted
              loop
              playsInline
            />

            {/* User info overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "20vh",
                left: "3vw",
                color: "white",
                textShadow: "0 0 10px rgba(0,0,0,0.8)",
              }}
            >
              <div 
                style={{ 
                  fontSize: "4vw", 
                  fontWeight: "bold", 
                  marginBottom: "1vw",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                onClick={() => navigate(`/profile/${video.userId}`)}
              >
                @{video.userName}
              </div>
            </div>

            {/* Right-side vertical buttons */}
            <div
              style={{
                position: "absolute",
                bottom: "12vh",
                right: "3vw",
                display: "flex",
                flexDirection: "column",
                gap: "4vw",
                alignItems: "center",
              }}
            >
              <button 
                style={{ ...buttonStyle, color: video.liked ? "#ff6b6b" : "white" }}
                onClick={() => handleLike(video.id)}
              >
                <Heart size="6vw" fill={video.liked ? "currentColor" : "none"} />
              </button>
              <div style={{ color: "white", fontSize: "3vw", textAlign: "center" }}>
                {video.likes}
              </div>

              <button 
                style={buttonStyle}
                onClick={() => handleComment(video.id)}
              >
                <MessageCircle size="6vw" />
              </button>
              <div style={{ color: "white", fontSize: "3vw", textAlign: "center" }}>
                {video.comments}
              </div>

              <button 
                style={buttonStyle}
                onClick={() => handleShare(video.id)}
              >
                <Share size="6vw" />
              </button>
              <div style={{ color: "white", fontSize: "3vw", textAlign: "center" }}>
                {video.shares}
              </div>

              <button 
                style={{ ...buttonStyle, color: video.saved ? "#ffd93d" : "white" }}
                onClick={() => handleSave(video.id)}
              >
                <Bookmark size="6vw" fill={video.saved ? "currentColor" : "none"} />
              </button>

              <button
                style={buttonStyle}
                onClick={() => navigate(`/profile/${video.userId}`)}
              >
                <User size="6vw" />
              </button>
            </div>

            {/* Bottom navigation for Reels */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                background: "rgba(0,0,0,0.3)",
                padding: "2vh 0",
                color: "white",
              }}
            >
              <button 
                onClick={() => navigate("/")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "white", 
                  fontSize: "4vw",
                  cursor: "pointer"
                }}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => navigate("/friends")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "white", 
                  fontSize: "4vw",
                  cursor: "pointer"
                }}
              >
                👥 Friends
              </button>
              <button 
                onClick={() => navigate("/create-post")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "white", 
                  fontSize: "4vw",
                  cursor: "pointer"
                }}
              >
                🎬 Create Reel
              </button>
            </div>
          </div>
        ))}
      </div>

      <CommentsModal
        open={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        post={{
          id: selectedVideoId,
          author: { name: "User", avatar: "", initials: "U" },
          comments: 0
        }}
        onAddComment={async () => true}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        post={{
          id: selectedVideoId,
          author: { name: "User", avatar: "", initials: "U" },
          content: "Video content"
        }}
        onShare={() => {}}
      />
    </>
  );
};

export default ReelsHorizontalResponsive;