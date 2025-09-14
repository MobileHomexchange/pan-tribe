import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, FileText, Calendar, Images } from "lucide-react";

export default function Profile() {
  const { userId } = useParams();

  // Mock user data - in a real app this would be fetched based on userId
  const user = {
    id: userId || "kwame-asante",
    name: "Kwame Asante",
    location: "Accra, Ghana",
    initials: "KA",
    bio: "Music enthusiast, loves African rhythms and cultural exchange. Based in Accra but connected to the diaspora. Passionate about promoting African culture worldwide. Founder of the African Music Lovers group.",
    stats: {
      friends: 127,
      posts: 47,
      groups: 12,
      events: 8,
    },
    friends: [
      { id: "1", name: "Amina Diallo", initials: "AD" },
      { id: "2", name: "Thabo Johnson", initials: "TJ" },
      { id: "3", name: "Nia Mbeki", initials: "NM" },
      { id: "4", name: "Chijioke Okoro", initials: "CO" },
      { id: "5", name: "Fatou Diop", initials: "FD" },
      { id: "6", name: "Elias Mbeki", initials: "ES" },
    ],
    photos: [
      { id: "1", url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop" },
      { id: "2", url: "https://images.unsplash.com/photo-1516527653392-602455dd9cf3?w=400&h=400&fit=crop" },
      { id: "3", url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=400&fit=crop" },
      { id: "4", url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=400&fit=crop" },
      { id: "5", url: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&h=400&fit=crop" },
      { id: "6", url: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400&h=400&fit=crop" },
    ]
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => {}} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Banner */}
          <div className="relative">
            <div className="h-80 rounded-t-xl bg-gradient-to-br from-pan-green to-pan-black overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?w=1200&h=400&fit=crop"
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Profile Header Card */}
            <Card className="relative -mt-24 mx-4 pt-20 border-light-gold/20">
              <CardContent className="text-center space-y-6">
                {/* Profile Avatar */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <Avatar className="w-32 h-32 border-4 border-card shadow-xl">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-pan-green to-pan-black text-pan-gold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Profile Info */}
                <div className="pt-4 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{user.stats.friends}</div>
                      <div className="text-sm text-muted-foreground">Friends</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{user.stats.posts}</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{user.stats.groups}</div>
                      <div className="text-sm text-muted-foreground">Groups</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{user.stats.events}</div>
                      <div className="text-sm text-muted-foreground">Events</div>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="bg-muted/30 rounded-lg p-4 text-left max-w-2xl mx-auto">
                    <p className="text-foreground leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Friends Card */}
            <Card className="border-light-gold/20">
              <CardHeader className="border-b border-light-gold/20">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends
                  <Badge variant="secondary" className="ml-auto">
                    {user.stats.friends} friends
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {user.friends.map((friend) => (
                    <Link key={friend.id} to={`/profile/${friend.id}`} className="text-center space-y-2 cursor-pointer group">
                      <Avatar className="w-16 h-16 mx-auto group-hover:-translate-y-1 transition-transform">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-pan-green to-pan-black text-pan-gold">
                          {friend.initials}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                    </Link>
                  ))}
                </div>
                <div className="text-center">
                  <button className="text-primary hover:underline font-medium">
                    View All Friends
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* Photos Card */}
            <Card className="lg:col-span-2 border-light-gold/20">
              <CardHeader className="border-b border-light-gold/20">
                <CardTitle className="flex items-center gap-2">
                  <Images className="w-5 h-5" />
                  Photos
                  <Badge variant="secondary" className="ml-auto">
                    42 photos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {user.photos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <img 
                        src={photo.url}
                        alt={`Photo ${photo.id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button className="text-primary hover:underline font-medium">
                    View All Photos
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}