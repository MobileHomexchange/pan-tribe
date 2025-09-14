import { Button } from "@/components/ui/button";

interface GroupPost {
  id: string;
  author: {
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

export function GroupDiscussions() {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
          <i className="fas fa-file-alt text-primary"></i>
          Group Discussions
        </h3>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <i className="fas fa-plus mr-2"></i>
          New Post
        </Button>
      </div>
      
      <div className="space-y-5">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-background rounded-lg p-4 shadow-sm border border-border">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center font-bold text-accent mr-3">
                {post.author.initials}
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
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <i className="fas fa-thumbs-up"></i>
                <span>Like ({post.likes})</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <i className="fas fa-comment"></i>
                <span>Comment ({post.comments})</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
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