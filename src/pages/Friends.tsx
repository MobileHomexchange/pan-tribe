import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClickableAvatar } from "@/components/ui/ClickableAvatar";
import { useToast } from "@/components/ui/use-toast";

export default function Friends() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"friends" | "suggestions" | "requests">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  // Sample data
  const ownProfile = {
    name: 'John Doe',
    initials: 'JD',
    location: 'Lagos, Nigeria',
    friendCount: 245
  };
  
  const otherProfile = {
    name: 'Sarah Konate',
    initials: 'SK',
    location: 'Abidjan, Ivory Coast',
    friendCount: 128
  };

  const currentProfile = isOwnProfile ? ownProfile : otherProfile;

  const friends = [
    { id: "1", name: "Amina Diallo", initials: "AD", mutualFriends: 12, location: "Dakar, Senegal" },
    { id: "2", name: "Thabo Johnson", initials: "TJ", mutualFriends: 8, location: "Johannesburg, SA" },
    { id: "3", name: "Nia Mbeki", initials: "NM", mutualFriends: 5, location: "Nairobi, Kenya" },
    { id: "4", name: "Chijioke Okoro", initials: "CO", mutualFriends: 3, location: "Lagos, Nigeria" },
    { id: "5", name: "Fatou Diop", initials: "FD", mutualFriends: 7, location: "Dakar, Senegal" },
    { id: "6", name: "Elias Mbeki", initials: "ES", mutualFriends: 2, location: "Cape Town, SA" }
  ];

  const suggestions = [
    { id: "7", name: "Kofi Addo", initials: "KA", mutualFriends: 15, location: "Accra, Ghana" },
    { id: "8", name: "Aisha Mensah", initials: "AM", mutualFriends: 4, location: "Kumasi, Ghana" },
    { id: "9", name: "Jelani Bello", initials: "JB", mutualFriends: 9, location: "Lagos, Nigeria" },
    { id: "10", name: "Nneka Dike", initials: "ND", mutualFriends: 6, location: "Enugu, Nigeria" },
    { id: "11", name: "Youssef Masoud", initials: "YM", mutualFriends: 11, location: "Cairo, Egypt" },
    { id: "12", name: "Leyla Kante", initials: "LK", mutualFriends: 1, location: "Abidjan, Ivory Coast" }
  ];

  const requests = [
    { id: "13", name: "Tunde Alabi", initials: "TA", mutualFriends: 3, location: "Ibadan, Nigeria" },
    { id: "14", name: "Zara Mwangi", initials: "ZM", mutualFriends: 7, location: "Nairobi, Kenya" },
    { id: "15", name: "Sipho Moloi", initials: "SM", mutualFriends: 2, location: "Pretoria, SA" }
  ];

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(request => 
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (personName: string) => {
    toast({
      title: "Message sent",
      description: `Opening chat with ${personName}`,
    });
    // In a real app, this would navigate to a chat interface
    // navigate(`/messages/${personId}`);
  };

  const handleProfileClick = (personId: string, personName: string) => {
    toast({
      title: "Viewing profile",
      description: `Opening ${personName}'s profile`,
    });
    navigate(`/profile/${personId}`);
  };

  const renderFriendCard = (person: any, type: "friend" | "suggestion" | "request") => (
    <Card key={person.id} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="space-y-4">
        <ClickableAvatar
          userId={person.id}
          userName={person.name}
          size="xl"
          className="mx-auto"
        />
        <div>
          <h3 className="font-semibold text-lg mb-1">{person.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {person.mutualFriends} mutual friends
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
            <i className="fas fa-map-marker-alt"></i>
            <span>{person.location}</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          {type === "friend" && (
            <>
              <Button 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleMessageClick(person.name)}
              >
                <i className="fas fa-comment text-sm"></i>
                Message
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleProfileClick(person.id, person.name)}
              >
                <i className="fas fa-user text-sm"></i>
                Profile
              </Button>
            </>
          )}
          
          {type === "suggestion" && (
            <>
              <Button size="sm" className="flex items-center gap-1">
                <i className="fas fa-user-plus text-sm"></i>
                Add Friend
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <i className="fas fa-times text-sm"></i>
                Remove
              </Button>
            </>
          )}
          
          {type === "request" && (
            <>
              <Button size="sm" className="flex items-center gap-1">
                <i className="fas fa-check text-sm"></i>
                Confirm
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <i className="fas fa-times text-sm"></i>
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (title: string, description: string) => (
    <div className="text-center py-16 text-muted-foreground">
      <div className="text-6xl mb-6">🔒</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="max-w-md mx-auto">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="fas fa-globe-africa text-2xl"></i>
              <span className="text-2xl font-bold">DiasporaConnect</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors">
                <i className="fas fa-home"></i> Home
              </Link>
              <Link to="/friends" className="flex items-center gap-2 text-accent border-b-2 border-accent pb-1">
                <i className="fas fa-user-friends"></i> Friends
              </Link>
              <Link to="/photos" className="flex items-center gap-2 hover:text-accent transition-colors">
                <i className="fas fa-images"></i> Photos
              </Link>
              <Link to="/my-tribe" className="flex items-center gap-2 hover:text-accent transition-colors">
                <i className="fas fa-users"></i> Groups
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsOwnProfile(true)}
                className="border-white/20 hover:bg-white/10"
              >
                <i className="fas fa-user mr-2"></i>
                My Profile
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsOwnProfile(false)}
                className="bg-white text-primary hover:bg-white/90"
              >
                <i className="fas fa-users mr-2"></i>
                Other Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl font-bold">
                  {currentProfile.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentProfile.name}</h2>
                <p className="text-muted-foreground mb-3">{currentProfile.location}</p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <i className="fas fa-user-friends"></i>
                  <span>{currentProfile.friendCount} friends</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <i className="fas fa-user-friends text-primary"></i>
                {isOwnProfile ? "Your Friends" : "Friends"}
              </h2>
              {isOwnProfile && (
                <Link to="#" className="text-primary hover:underline font-medium flex items-center gap-2">
                  View All <i className="fas fa-chevron-right"></i>
                </Link>
              )}
            </div>

            {/* Search Box */}
            <div className="flex mb-6 max-w-md">
              <Input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button className="rounded-l-none px-6">
                <i className="fas fa-search"></i>
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "friends"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("friends")}
              >
                <i className="fas fa-users"></i>
                {isOwnProfile ? "Your Friends" : "Friends"}
              </button>
              
              <button
                className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "suggestions"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("suggestions")}
              >
                <i className="fas fa-user-plus"></i>
                People You May Know
              </button>
              
              {isOwnProfile && (
                <button
                  className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "requests"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("requests")}
                >
                  <i className="fas fa-user-clock"></i>
                  Friend Requests
                  <span className="bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {requests.length}
                  </span>
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "friends" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFriends.map(friend => renderFriendCard(friend, "friend"))}
                </div>
              )}

              {activeTab === "suggestions" && (
                <div>
                  {!isOwnProfile ? (
                    renderEmptyState(
                      "Content unavailable",
                      "Friend suggestions are only available on your own profile."
                    )
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSuggestions.map(person => renderFriendCard(person, "suggestion"))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "requests" && isOwnProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRequests.map(request => renderFriendCard(request, "request"))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}