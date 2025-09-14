import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Calendar, MapPin, Users } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
  interactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  participants: string[];
}

const Memories = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const memories: Memory[] = [
    {
      id: "1",
      title: "Ghana Independence Day Celebration",
      date: "March 6, 2024",
      location: "Black Star Square, Accra",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      description: "Amazing celebration with traditional drums and cultural performances. The energy was incredible!",
      tags: ["Culture", "Independence", "Ghana", "Celebration"],
      interactions: { likes: 24, comments: 8, shares: 3 },
      participants: ["KA", "AD", "MK", "FD"]
    },
    {
      id: "2",
      title: "Lagos Fashion Week Experience",
      date: "October 15, 2023",
      location: "Victoria Island, Lagos",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=300&fit=crop",
      description: "Front row seats to witness the future of African fashion. Incredible designs and creativity on display.",
      tags: ["Fashion", "Lagos", "Design", "Style"],
      interactions: { likes: 45, comments: 12, shares: 7 },
      participants: ["AD", "JS", "NK", "TM"]
    },
    {
      id: "3",
      title: "Cape Town Wine Tasting",
      date: "September 2, 2023",
      location: "Stellenbosch, Cape Town",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=300&fit=crop",
      description: "Beautiful vineyard tour with friends. The sunset over the mountains was breathtaking.",
      tags: ["Wine", "Cape Town", "Friends", "Vineyard"],
      interactions: { likes: 32, comments: 6, shares: 2 },
      participants: ["MK", "FD", "AD"]
    }
  ];

  const filteredMemories = memories.filter(memory => {
    if (activeTab === "all") return true;
    return memory.tags.some(tag => tag.toLowerCase().includes(activeTab.toLowerCase()));
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Your Memories</h1>
                <p className="text-muted-foreground">Relive your favorite moments and experiences</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Memories</TabsTrigger>
                  <TabsTrigger value="culture">Culture</TabsTrigger>
                  <TabsTrigger value="fashion">Fashion</TabsTrigger>
                  <TabsTrigger value="friends">Friends</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <div className="grid gap-6">
                    {filteredMemories.map((memory) => (
                      <Card key={memory.id} className="overflow-hidden">
                        <div className="md:flex">
                          <div className="md:w-1/3">
                            <img
                              src={memory.image}
                              alt={memory.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <CardHeader className="p-0 mb-4">
                              <CardTitle className="text-xl">{memory.title}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {memory.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {memory.location}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <p className="text-muted-foreground mb-4">{memory.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {memory.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Button variant="ghost" size="sm">
                                    <Heart className="w-4 h-4 mr-1" />
                                    {memory.interactions.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    {memory.interactions.comments}
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="w-4 h-4 mr-1" />
                                    {memory.interactions.shares}
                                  </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <div className="flex -space-x-2">
                                    {memory.participants.slice(0, 3).map((participant, index) => (
                                      <Avatar key={index} className="w-8 h-8 border-2 border-background">
                                        <AvatarFallback className="text-xs">{participant}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {memory.participants.length > 3 && (
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-background">
                                        +{memory.participants.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Memories;