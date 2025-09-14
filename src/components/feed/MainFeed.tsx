import { Post } from "@/components/feed/Post";

const posts = [
  {
    id: "1",
    author: {
      name: "Kwame Asante",
      avatar: "KA",
      initials: "KA"
    },
    timeAgo: "2 hours ago",
    visibility: "public" as const,
    content: "Just visited the National Museum of Ghana! The exhibits on Ashanti history were absolutely fascinating. 🏛️\n\n#Ghana #Ashanti #History #AfricanCulture",
    hasImage: true,
    imageIcon: "landmark",
    likes: 245,
    comments: 84,
    shares: 32
  },
  {
    id: "2",
    author: {
      name: "Amina Diallo",
      avatar: "AD",
      initials: "AD"
    },
    timeAgo: "5 hours ago",
    visibility: "friends" as const,
    content: "My new article about sustainable farming in West Africa is finally published! Check it out if you're interested in agricultural innovation.\n\nRead it here: SustainableAfrica.org/farming",
    hasImage: false,
    likes: 189,
    comments: 47,
    shares: 21
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