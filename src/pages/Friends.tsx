import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Friends() {
  const [interests, setInterests] = useState([
    "Afrobeat Music",
    "African History", 
    "Dance",
    "Cooking"
  ]);
  const [newInterest, setNewInterest] = useState("");

  const addInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const friends = [
    { id: "kwame-asante", name: "Kwame Asante", initials: "KA" },
    { id: "amina-diallo", name: "Amina Diallo", initials: "AD" },
    { id: "thabo-johnson", name: "Thabo Johnson", initials: "TJ" },
    { id: "nia-mbeki", name: "Nia Mbeki", initials: "NM" },
    { id: "chijioke-okoro", name: "Chijioke Okoro", initials: "CJ" },
    { id: "fatou-diop", name: "Fatou Diop", initials: "FD" }
  ];

  const suggestions = [
    { id: "obinna-dike", name: "Obinna Dike", initials: "OD", mutualFriends: 12, location: "Lagos, Nigeria" },
    { id: "sade-sowande", name: "Sade Sowande", initials: "SS", mutualFriends: 8, location: "Dakar, Senegal" },
    { id: "elias-mbeki", name: "Elias Mbeki", initials: "EM", mutualFriends: 5, location: "Johannesburg, South Africa" },
    { id: "amina-keita", name: "Amina Keita", initials: "AK", mutualFriends: 17, location: "Nairobi, Kenya" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-primary to-black text-primary-foreground">
        <div className="flex justify-between items-center px-5 h-[70px]">
          <div className="flex items-center gap-3">
            <i className="fas fa-users text-accent text-2xl"></i>
            <span className="text-2xl font-bold">Tribe Pulse</span>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-fire"></i>
            </div>
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
            </div>
            <div className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-accent/30 transition-colors">
              <i className="fas fa-envelope"></i>
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">7</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center font-bold text-accent cursor-pointer">
              JS
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-black px-5">
        <div className="flex justify-between items-center h-[50px]">
          <div className="flex gap-1">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link to="/my-tribe" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-user-friends"></i>
              <span>My Tribe</span>
            </Link>
            <Link to="/friends" className="flex items-center gap-2 px-4 py-2 text-white bg-primary rounded-md">
              <i className="fas fa-heart"></i>
              <span>Friends</span>
            </Link>
            <Link to="/reels" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-video"></i>
              <span>Reels</span>
            </Link>
            <Link to="/careers" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-primary rounded-md transition-colors">
              <i className="fas fa-briefcase"></i>
              <span>Careers</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center bg-white/15 rounded-full px-4 py-2 w-64">
            <i className="fas fa-search text-white/70 mr-3"></i>
            <input 
              type="text" 
              placeholder="Search Tribe Pulse..." 
              className="bg-transparent text-white placeholder-white/70 border-none outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex p-5 gap-5 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="flex-1 space-y-5">
          {/* Profile Definition Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-user-edit text-primary"></i>
                Define Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea 
                  defaultValue="Music enthusiast, loves African rhythms and cultural exchange. Based in Accra but connected to the diaspora."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input defaultValue="Accra, Ghana" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Hometown</label>
                <Input defaultValue="Kumasi, Ghana" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <i 
                        className="fas fa-times cursor-pointer text-destructive hover:text-destructive/80"
                        onClick={() => removeInterest(index)}
                      ></i>
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add an interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button variant="secondary" onClick={addInterest}>
                    <i className="fas fa-plus"></i>
                  </Button>
                </div>
              </div>
              
              <Button className="w-full">
                <i className="fas fa-save mr-2"></i>
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Friends List Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-friends text-primary"></i>
                  Your Friends
                </div>
                <span className="text-sm font-normal">127 friends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {friends.map((friend, index) => (
                  <Link key={index} to={`/profile/${friend.id}`} className="text-center hover:bg-muted/50 rounded-lg p-2 transition-colors">
                    <Avatar className="w-16 h-16 mx-auto mb-2">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-black text-accent font-bold text-lg">
                        {friend.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">{friend.name}</div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <a href="#" className="text-primary hover:underline font-medium">
                  View All Friends
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="flex-1 space-y-5">
          {/* Analytics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-chart-line text-primary"></i>
                Friends Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">127</div>
                  <div className="text-sm text-muted-foreground">Total Friends</div>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">12</div>
                  <div className="text-sm text-muted-foreground">New This Month</div>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">24</div>
                  <div className="text-sm text-muted-foreground">Mutual Connections</div>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">86%</div>
                  <div className="text-sm text-muted-foreground">Active This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Suggestions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-user-plus text-primary"></i>
                People You May Know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Link to={`/profile/${suggestion.id}`}>
                      <Avatar className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-black text-accent font-bold">
                          {suggestion.initials}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    
                    <div className="flex-1">
                      <Link to={`/profile/${suggestion.id}`} className="hover:underline">
                        <h3 className="font-medium">{suggestion.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.mutualFriends} mutual friends · {suggestion.location}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <i className="fas fa-user-plus mr-1"></i> Add
                      </Button>
                      <Button variant="secondary" size="sm">
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-5 mt-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <i className="fas fa-users text-accent text-xl"></i>
            <span className="text-xl font-bold">Tribe Pulse</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-accent hover:underline">About Us</a>
            <a href="#" className="text-accent hover:underline">Privacy Policy</a>
            <a href="#" className="text-accent hover:underline">Terms of Service</a>
            <a href="#" className="text-accent hover:underline">Contact</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2023 Tribe Pulse. Connecting Africa.
          </div>
        </div>
      </footer>
    </div>
  );
}