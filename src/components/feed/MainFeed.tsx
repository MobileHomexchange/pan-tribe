import { Post } from "@/components/feed/Post";
import { Post as PostType } from "@/types";

const posts: PostType[] = [
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
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "culture"
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
    comments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    category: "agriculture"
  }
];

export function MainFeed() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}