import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import MainFeed from "@/components/feed/MainFeed";
import { UserProfileCard } from "@/components/home/UserProfileCard";
import { YourTribesCard } from "@/components/home/YourTribesCard";
import { WhatsOnYourMindCard } from "@/components/home/WhatsOnYourMindCard";
import { Header } from "@/components/home/Header";
import { AdRotator } from "@/components/home/AdRotator";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Mock tribes data
  const userTribes = [
    {
      id: "1",
      name: "Faith Mobile Homes",
      avatar: "",
      memberCount: 234
    },
    {
      id: "2",
      name: "Tech Enthusiasts",
      avatar: "",
      memberCount: 156
    },
    {
      id: "3",
      name: "Pan-African Unity",
      avatar: "",
      memberCount: 892
    }
  ];

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-6 p-4 bg-[#E8F5F0] min-h-screen">
        {/* Left Column - Only YourTribesCard */}
        <div className="space-y-4">
          <YourTribesCard userTribes={userTribes} />
        </div>

        {/* Middle Column - Sticky Header + WhatsOnYourMind + UserCard + Feed */}
        <div className="space-y-4">
          {/* Sticky Section */}
          <div className="sticky top-4 z-20 space-y-4">
            <Header />
            <WhatsOnYourMindCard 
              userAvatar={currentUser?.photoURL || ""} 
              onCreatePost={() => navigate("/create-post")}
            />
          </div>
          
          {/* User Profile Card */}
          <UserProfileCard 
            userName={currentUser?.displayName || "User"}
            userAvatar={currentUser?.photoURL || ""}
            tribeName="My Tribe"
            status="Active"
          />
          
          {/* Main Feed */}
          <MainFeed />
        </div>

        {/* Right Column - Only Sticky AdBanner */}
        <div className="space-y-4">
          <div className="sticky top-4">
            <AdRotator />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
