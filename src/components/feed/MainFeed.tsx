import { Post } from "@/components/feed/Post";
import { Post as PostType } from "@/types";
import { useFeedAlgorithm } from "@/hooks/useFeedAlgorithm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockPosts: PostType[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Kwame Asante",
    userAvatar: "KA",
    content: "Just visited the National Museum of Ghana! The exhibits on Ashanti history were absolutely fascinating. 🏛️\n\n#Ghana #Ashanti #History #AfricanCulture",
    imageUrl: undefined,
    videoUrl: undefined,
    likes: ["user2", "user3", "user4"], // Array of user IDs who liked
    saves: ["user2"], // Array of user IDs who saved
    shares: 32,
    externalShares: 8, // Shared to TikTok, FB, etc.
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "culture",
    tags: ["Ghana", "Ashanti", "History", "AfricanCulture"],
    viewTime: 45,
    replays: 2
  },
  {
    id: "2",
    userId: "user2",
    userName: "Amina Diallo", 
    userAvatar: "AD",
    content: "My new article about sustainable farming in West Africa is finally published! Check it out if you're interested in agricultural innovation.\n\nRead it here: SustainableAfrica.org/farming",
    imageUrl: undefined,
    videoUrl: undefined,
    likes: ["user1", "user3"], // Array of user IDs who liked
    saves: ["user1", "user3"], // Array of user IDs who saved
    shares: 21,
    externalShares: 5,
    comments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    category: "agriculture",
    tags: ["farming", "sustainability", "WestAfrica", "innovation"],
    viewTime: 30,
    replays: 1
  },
  {
    id: "3",
    userId: "user3",
    userName: "Samuel Osei",
    userAvatar: "SO", 
    content: "Building a new mobile app for local market vendors. Technology can really empower small businesses! 💻📱\n\n#TechForGood #Entrepreneurship #MobileApp",
    imageUrl: undefined,
    videoUrl: undefined,
    likes: ["user1"],
    saves: [],
    shares: 5,
    externalShares: 1,
    comments: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    category: "technology",
    tags: ["TechForGood", "Entrepreneurship", "MobileApp"],
    viewTime: 20,
    replays: 0
  }
];

export function MainFeed() {
  const { rankPosts, changeFeedMode, feedMode, updateInterests } = useFeedAlgorithm();
  
  // Apply algorithm ranking to posts
  const rankedPosts = rankPosts(mockPosts);

  const handlePostInteraction = (post: PostType, type: 'like' | 'comment' | 'share' | 'view') => {
    updateInterests(post, type);
  };

  return (
    <div className="space-y-4">
      {/* Feed Mode Selector */}
      <div className="bg-card rounded-lg p-4 border border-social-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-card-foreground">Feed Algorithm</h3>
          <Badge variant="secondary">{feedMode} mode</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant={feedMode === 'discovery' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeFeedMode('discovery')}
          >
            Discovery
          </Button>
          <Button
            variant={feedMode === 'tribal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeFeedMode('tribal')}
          >
            Tribal
          </Button>
          <Button
            variant={feedMode === 'chronological' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeFeedMode('chronological')}
          >
            Latest
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      {rankedPosts.map((post) => (
        <Post 
          key={post.id} 
          post={post} 
          onInteraction={(type) => handlePostInteraction(post, type)}
        />
      ))}
    </div>
  );
}