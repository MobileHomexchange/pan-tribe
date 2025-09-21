import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Image, UserCircle } from "lucide-react";
import { useSavedItems } from "@/hooks/useSavedItems";

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

// User-specific friends data
const userFriendsData = {
  "kwame-asante": ["amina-diallo", "thabo-johnson", "nia-mbeki", "chijioke-okoro", "fatou-diop"],
  "amina-diallo": ["kwame-asante", "fatou-diop", "nia-mbeki", "thabo-johnson"],
  "thabo-johnson": ["kwame-asante", "chijioke-okoro", "nia-mbeki", "amina-diallo", "fatou-diop"],
  "nia-mbeki": ["kwame-asante", "amina-diallo", "thabo-johnson", "chijioke-okoro", "fatou-diop"],
  "chijioke-okoro": ["kwame-asante", "thabo-johnson", "nia-mbeki", "fatou-diop"],
  "fatou-diop": ["amina-diallo", "kwame-asante", "nia-mbeki", "thabo-johnson"],
};

// Mock photos data for each user
const userPhotosData = {
  "kwame-asante": [
    { id: "1", title: "Music Festival in Accra", type: "event", description: "Amazing night of African rhythms" },
    { id: "2", title: "Traditional Drumming", type: "cultural", description: "Learning ancestral beats" },
    { id: "3", title: "Studio Session", type: "music", description: "Working on new fusion tracks" },
    { id: "4", title: "Community Concert", type: "event", description: "Bringing diaspora together through music" },
  ],
  "amina-diallo": [
    { id: "1", title: "Fashion Week Dakar", type: "fashion", description: "Showcasing sustainable African prints" },
    { id: "2", title: "Design Studio", type: "work", description: "Creating contemporary African wear" },
    { id: "3", title: "Traditional Textiles", type: "cultural", description: "Sourcing authentic fabrics" },
  ],
  "thabo-johnson": [
    { id: "1", title: "Tech Conference JHB", type: "work", description: "Presenting African tech solutions" },
    { id: "2", title: "Basketball Game", type: "sports", description: "Weekend game with friends" },
    { id: "3", title: "Jazz Club", type: "music", description: "Enjoying local jazz scene" },
    { id: "4", title: "Startup Pitch", type: "work", description: "Funding round presentation" },
  ],
  "nia-mbeki": [
    { id: "1", title: "Documentary Shoot", type: "work", description: "Filming innovation stories" },
    { id: "2", title: "Mount Kenya Hike", type: "adventure", description: "Weekend hiking adventure" },
    { id: "3", title: "Coffee Farm Visit", type: "cultural", description: "Exploring local coffee culture" },
    { id: "4", title: "Film Festival", type: "event", description: "Premiering latest documentary" },
  ],
  "chijioke-okoro": [
    { id: "1", title: "Fintech Demo", type: "work", description: "Presenting payment solutions" },
    { id: "2", title: "Marathon Training", type: "sports", description: "Preparing for Lagos Marathon" },
    { id: "3", title: "Chess Tournament", type: "games", description: "Local chess competition" },
  ],
  "fatou-diop": [
    { id: "1", title: "Ocean Research", type: "work", description: "Marine conservation project" },
    { id: "2", title: "Climate Summit", type: "environment", description: "West Africa climate solutions" },
    { id: "3", title: "Beach Cleanup", type: "volunteer", description: "Community conservation effort" },
    { id: "4", title: "Research Station", type: "work", description: "Environmental data collection" },
  ],
};

// Groups data for each user
const userGroupsData = {
  "kwame-asante": [
    { id: "1", name: "African Music Producers", members: 245, description: "Connecting music creators across Africa" },
    { id: "2", name: "Diaspora Artists Network", members: 1200, description: "Global African artist community" },
    { id: "3", name: "Ghana Music Heritage", members: 567, description: "Preserving traditional Ghanaian music" },
    { id: "4", name: "Accra Tech & Music", members: 89, description: "Where technology meets music" },
  ],
  "amina-diallo": [
    { id: "1", name: "Sustainable Fashion Africa", members: 890, description: "Eco-friendly fashion movement" },
    { id: "2", name: "Senegalese Designers", members: 234, description: "Local fashion talent network" },
    { id: "3", name: "African Print Innovation", members: 456, description: "Modern takes on traditional patterns" },
  ],
  "thabo-johnson": [
    { id: "1", name: "African Tech Entrepreneurs", members: 2100, description: "Building the future of African tech" },
    { id: "2", name: "Johannesburg Startups", members: 678, description: "Local startup ecosystem" },
    { id: "3", name: "Basketball SA", members: 1234, description: "South African basketball community" },
    { id: "4", name: "Jazz Enthusiasts JHB", members: 345, description: "Local jazz music lovers" },
  ],
  "nia-mbeki": [
    { id: "1", name: "African Documentary Makers", members: 567, description: "Telling African stories through film" },
    { id: "2", name: "Kenya Film Community", members: 789, description: "Local filmmaking network" },
    { id: "3", name: "Coffee Culture Kenya", members: 432, description: "Celebrating Kenyan coffee heritage" },
    { id: "4", name: "Nairobi Hikers", members: 1100, description: "Exploring Kenya's natural beauty" },
  ],
  "chijioke-okoro": [
    { id: "1", name: "Nigerian Fintech", members: 1500, description: "Financial technology in Nigeria" },
    { id: "2", name: "Lagos Marathon Club", members: 890, description: "Running community in Lagos" },
    { id: "3", name: "Chess Masters Nigeria", members: 234, description: "Nigerian chess players network" },
  ],
  "fatou-diop": [
    { id: "1", name: "West Africa Climate Action", members: 1800, description: "Fighting climate change together" },
    { id: "2", name: "Ocean Conservation Africa", members: 945, description: "Protecting African coastlines" },
    { id: "3", name: "Senegal Environmental Scientists", members: 156, description: "Local environmental research" },
    { id: "4", name: "Dakar Sustainability", members: 623, description: "Sustainable living community" },
  ],
};

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getSavedItemsByType } = useSavedItems();
  const [selectedProfile, setSelectedProfile] = useState<string>(userId || "kwame-asante");
  const [activeSection, setActiveSection] = useState<'friends' | 'photos' | 'groups'>('friends');
  
  // Get the current profile data
  const currentProfile = profilesData[selectedProfile as keyof typeof profilesData] || profilesData["kwame-asante"];
  
  // Get user-specific data
  const userFriends = userFriendsData[selectedProfile as keyof typeof userFriendsData] || [];
  const userPhotos = userPhotosData[selectedProfile as keyof typeof userPhotosData] || [];
  const userGroups = userGroupsData[selectedProfile as keyof typeof userGroupsData] || [];
  const savedPhotos = getSavedItemsByType('post').filter(item => item.image);

  const handleFriendClick = (friendId: string) => {
    setSelectedProfile(friendId);
    // Update URL without page reload
    window.history.pushState({}, '', `/profile/${friendId}`);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'friends':
        const friends = userFriends.map(friendId => 
          friendsList.find(friend => friend.id === friendId)
        ).filter(Boolean);
        
        return (
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends ({friends.length})
                </CardTitle>
                <button className="text-primary hover:underline font-medium">
                  View All Friends
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend?.id}
                    onClick={() => handleFriendClick(friend?.id || '')}
                    className="bg-muted/30 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                        {friend?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-sm">{friend?.name}</div>
                  </div>
                ))}
              </div>
              {friends.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No friends to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'photos':
        const allPhotos = [...userPhotos, ...savedPhotos.map(item => ({
          id: item.id,
          title: item.title, 
          type: 'saved',
          description: item.description || 'Saved photo'
        }))];

        return (
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Photos ({allPhotos.length})
                </CardTitle>
                <button className="text-primary hover:underline font-medium">
                  View All Photos
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-muted/30 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center mb-3">
                      <Image className="w-8 h-8 text-primary/40" />
                    </div>
                    <div className="font-medium text-sm mb-1">{photo.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{photo.description}</div>
                  </div>
                ))}
              </div>
              {allPhotos.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No photos to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'groups':
        return (
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Groups ({userGroups.length})
                </CardTitle>
                <button className="text-primary hover:underline font-medium">
                  View All Groups
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-muted/30 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6 text-primary/60" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{group.name}</div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {group.members.toLocaleString()} members
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{group.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {userGroups.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No groups to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
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
                  <button 
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setActiveSection('friends')}
                    className={`transition-colors ${
                      activeSection === 'friends' 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Friends
                  </button>
                  <button 
                    onClick={() => setActiveSection('photos')}
                    className={`transition-colors ${
                      activeSection === 'photos' 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Photos
                  </button>
                  <button 
                    onClick={() => setActiveSection('groups')}
                    className={`transition-colors ${
                      activeSection === 'groups' 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Groups
                  </button>
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

                {/* Dynamic Content Section */}
                <div className="lg:col-span-3">
                  {renderSectionContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}