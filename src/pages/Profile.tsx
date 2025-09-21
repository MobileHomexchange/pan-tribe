import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

// Profile data for different users
const profilesData = {
  "kwame-asante": {
    id: "kwame-asante",
    name: "Kwame Asante",
    location: "Accra, Ghana",
    initials: "KA",
    bio: "Music enthusiast, loves African rhythms and cultural exchange. Connecting the diaspora one beat at a time.",
    stats: {
      friends: 127,
      posts: 47,
      groups: 12,
      events: 8,
    },
  },
  "amina-diallo": {
    id: "amina-diallo",
    name: "Amina Diallo",
    location: "Dakar, Senegal",
    initials: "AD",
    bio: "Fashion designer blending traditional African prints with contemporary styles. Passionate about sustainable fashion.",
    stats: {
      friends: 89,
      posts: 32,
      groups: 6,
      events: 4,
    },
  },
  "thabo-johnson": {
    id: "thabo-johnson",
    name: "Thabo Johnson",
    location: "Johannesburg, South Africa",
    initials: "TJ",
    bio: "Tech entrepreneur focused on innovative solutions for African markets. Loves basketball and jazz music.",
    stats: {
      friends: 156,
      posts: 64,
      groups: 8,
      events: 12,
    },
  },
  "nia-mbeki": {
    id: "nia-mbeki",
    name: "Nia Mbeki",
    location: "Nairobi, Kenya",
    initials: "NM",
    bio: "Documentary filmmaker telling stories of African innovation and resilience. Coffee enthusiast and hiking lover.",
    stats: {
      friends: 203,
      posts: 87,
      groups: 15,
      events: 9,
    },
  },
  "chijioke-okoro": {
    id: "chijioke-okoro",
    name: "Chijioke Okoro",
    location: "Lagos, Nigeria",
    initials: "CO",
    bio: "Software engineer building fintech solutions for African businesses. Marathon runner and chess player.",
    stats: {
      friends: 98,
      posts: 41,
      groups: 7,
      events: 6,
    },
  },
  "fatou-diop": {
    id: "fatou-diop",
    name: "Fatou Diop",
    location: "Dakar, Senegal",
    initials: "FD",
    bio: "Environmental scientist working on climate solutions for West Africa. Passionate about ocean conservation.",
    stats: {
      friends: 134,
      posts: 56,
      groups: 11,
      events: 8,
    },
  },
};

const friendsList = [
  { id: "amina-diallo", name: "Amina Diallo", initials: "AD" },
  { id: "thabo-johnson", name: "Thabo Johnson", initials: "TJ" },
  { id: "nia-mbeki", name: "Nia Mbeki", initials: "NM" },
  { id: "chijioke-okoro", name: "Chijioke Okoro", initials: "CO" },
  { id: "fatou-diop", name: "Fatou Diop", initials: "FD" },
  { id: "kwame-asante", name: "Kwame Asante", initials: "KA" },
];

export default function Profile() {
  const { userId } = useParams();
  const [selectedProfile, setSelectedProfile] = useState<string>(userId || "kwame-asante");
  
  // Get the current profile data
  const currentProfile = profilesData[selectedProfile as keyof typeof profilesData] || profilesData["kwame-asante"];
  
  // Filter friends to exclude current user
  const availableFriends = friendsList.filter(friend => friend.id !== selectedProfile);

  const handleFriendClick = (friendId: string) => {
    setSelectedProfile(friendId);
    // Update URL without page reload
    window.history.pushState({}, '', `/profile/${friendId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => {}} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 p-4 bg-card rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-primary">DiasporaConnect</h1>
                <div className="flex gap-4">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">Home</button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">Friends</button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">Photos</button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">Groups</button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Profile Card */}
                <div className="lg:col-span-1">
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      {/* Profile Header */}
                      <div className="flex items-center mb-6">
                        <Avatar className="w-20 h-20 mr-4">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                            {currentProfile.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-semibold">{currentProfile.name}</h2>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{currentProfile.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="font-bold text-lg text-primary">{currentProfile.stats.friends}</div>
                          <div className="text-xs text-muted-foreground">Friends</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="font-bold text-lg text-primary">{currentProfile.stats.posts}</div>
                          <div className="text-xs text-muted-foreground">Posts</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="font-bold text-lg text-primary">{currentProfile.stats.groups}</div>
                          <div className="text-xs text-muted-foreground">Groups</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <div className="font-bold text-lg text-primary">{currentProfile.stats.events}</div>
                          <div className="text-xs text-muted-foreground">Events</div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm leading-relaxed">{currentProfile.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Friends Section */}
                <div className="lg:col-span-3">
                  <Card className="shadow-lg">
                    <CardHeader className="border-b">
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Friends
                        </CardTitle>
                        <button className="text-primary hover:underline font-medium">
                          View All Friends
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {availableFriends.map((friend) => (
                          <div
                            key={friend.id}
                            onClick={() => handleFriendClick(friend.id)}
                            className="bg-muted/30 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                          >
                            <Avatar className="w-16 h-16 mx-auto mb-3">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                                {friend.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-sm">{friend.name}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}