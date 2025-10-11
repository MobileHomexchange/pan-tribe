import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClickableAvatar } from "@/components/ui/ClickableAvatar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GroupPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  content: string;
  image?: boolean;
  likes: number;
  comments: number;
  timeAgo: string;
}

const mockPosts: GroupPost[] = [
  {
    id: "1",
    author: {
      id: "kwame-asante",
      name: "Kwame Asante",
      avatar: "KA",
      initials: "KA"
    },
    content: "What's everyone's favorite African music genre? I'm particularly fond of Afrobeat and Highlife. 🎵",
    likes: 42,
    comments: 15,
    timeAgo: "3 hours ago"
  },
  {
    id: "2",
    author: {
      id: "amina-diallo",
      name: "Amina Diallo",
      avatar: "AD",
      initials: "AD"
    },
    content: "Check out this amazing new artist from Senegal! Her blend of traditional mbalax with modern Afrobeat is incredible.",
    image: true,
    likes: 87,
    comments: 23,
    timeAgo: "1 day ago"
  }
];

export function TribeDiscussions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    const isLiked = likedPosts.has(postId);
    
    if (isLiked) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1 } : post
      ));
      toast({
        title: "Post unliked",
        description: "You removed your like from this post",
      });
    } else {
      setLikedPosts(prev => new Set(prev.add(postId)));
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
      toast({
        title: "Post liked",
        description: "You liked this post!",
      });
    }
  };

  const handleComment = (postId: string, authorName: string) => {
    toast({
      title: "Opening comments",
      description: `Viewing comments for ${authorName}'s post`,
    });
    // In a real app, this would navigate to comments or open a comments modal
  };

  const handleShare = (postId: string, content: string) => {
    toast({
      title: "Post shared",
      description: "Post has been shared to your network",
    });
    // In a real app, this would open share options or copy link
  };
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
          <i className="fas fa-file-alt text-primary"></i>
          Tribe Discussions
        </h3>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => navigate('/create-post?returnTo=/my-tribe')}
        >
          <i className="fas fa-plus mr-2"></i>
          New Post
        </Button>
      </div>
      
      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-background rounded-lg p-4 shadow-sm border border-border">
            <div className="flex items-center mb-3">
              <div className="mr-3">
                <ClickableAvatar 
                  userId={post.author.id}
                  userName={post.author.name}
                  showTooltip
                />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{post.author.name}</h4>
                <p className="text-sm text-primary">Posted {post.timeAgo}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-foreground leading-relaxed">{post.content}</p>
            </div>
            
            {post.image && (
              <div className="bg-secondary rounded-lg h-48 flex items-center justify-center text-primary text-4xl mb-3">
                <i className="fas fa-headphones"></i>
              </div>
            )}
            
            <div className="flex justify-around border-t border-border pt-3">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors ${
                  likedPosts.has(post.id) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <i className={`fas fa-thumbs-up ${likedPosts.has(post.id) ? 'text-primary' : ''}`}></i>
                <span>Like ({post.likes})</span>
              </button>
              <button 
                onClick={() => handleComment(post.id, post.author.name)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <i className="fas fa-comment"></i>
                <span>Comment ({post.comments})</span>
              </button>
              <button 
                onClick={() => handleShare(post.id, post.content)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <i className="fas fa-share"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}