import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSavedItems } from "@/hooks/useSavedItems";
import { Heart, MessageCircle, Share2, Calendar, Camera, Trophy, MapPin } from "lucide-react";

export default function Memories() {
  const { savedItems, toggleSave, isSaved } = useSavedItems();

  // Sample memories data
  const memories = [
    {
      id: "1",
      title: "Afrobeat Concert Night",
      date: "2023-12-15",
      type: "event",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Amazing night at the Afrobeat concert with friends. The energy was incredible!",
      location: "Club Zenith, Accra",
      likes: 24,
      comments: 8
    },
    {
      id: "2",
      title: "Food Festival Weekend",
      date: "2023-12-10",
      type: "photo",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Trying all the amazing local dishes at the Accra Food Festival.",
      location: "Independence Square",
      likes: 18,
      comments: 5
    },
    {
      id: "3",
      title: "Marathon Achievement",
      date: "2023-12-05",
      type: "milestone",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Completed my first marathon! Personal best time of 4:15:32.",
      location: "Osu Sports Complex",
      likes: 45,
      comments: 12
    },
    {
      id: "4",
      title: "Art Gallery Opening",
      date: "2023-11-28",
      type: "event",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Contemporary art exhibition showcasing local African artists.",
      location: "National Museum of Ghana",
      likes: 31,
      comments: 9
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo": return <Camera className="w-4 h-4" />;
      case "event": return <Calendar className="w-4 h-4" />;
      case "milestone": return <Trophy className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "photo": return "bg-blue-100 text-blue-700";
      case "event": return "bg-green-100 text-green-700";
      case "milestone": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredMemories = (type?: string) => {
    if (!type || type === "all") return memories;
    return memories.filter(memory => memory.type === type);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">My Memories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Relive your favorite moments and milestones. Your memories are automatically 
            created from your activities and can be saved for easy access.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{memories.length}</div>
            <div className="text-sm text-muted-foreground">Total Memories</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {memories.filter(m => m.type === "photo").length}
            </div>
            <div className="text-sm text-muted-foreground">Photos</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {memories.filter(m => m.type === "event").length}
            </div>
            <div className="text-sm text-muted-foreground">Events</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {memories.filter(m => m.type === "milestone").length}
            </div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Memories</TabsTrigger>
            <TabsTrigger value="photo">Photos</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="milestone">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <MemoryGrid memories={filteredMemories("all")} toggleSave={toggleSave} isSaved={isSaved} />
          </TabsContent>
          
          <TabsContent value="photo" className="space-y-4">
            <MemoryGrid memories={filteredMemories("photo")} toggleSave={toggleSave} isSaved={isSaved} />
          </TabsContent>
          
          <TabsContent value="event" className="space-y-4">
            <MemoryGrid memories={filteredMemories("event")} toggleSave={toggleSave} isSaved={isSaved} />
          </TabsContent>
          
          <TabsContent value="milestone" className="space-y-4">
            <MemoryGrid memories={filteredMemories("milestone")} toggleSave={toggleSave} isSaved={isSaved} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function MemoryGrid({ memories, toggleSave, isSaved }: { 
  memories: any[], 
  toggleSave: (item: any) => void, 
  isSaved: (id: string) => boolean 
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "photo": return <Camera className="w-4 h-4" />;
      case "event": return <Calendar className="w-4 h-4" />;
      case "milestone": return <Trophy className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "photo": return "bg-blue-100 text-blue-700";
      case "event": return "bg-green-100 text-green-700";
      case "milestone": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {memories.map((memory) => (
        <Card key={memory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48">
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(memory.type)}`}>
              {getTypeIcon(memory.type)}
              {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{memory.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(memory.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground">{memory.description}</p>
            
            {memory.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {memory.location}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {memory.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {memory.comments}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSave({
                    id: memory.id,
                    title: memory.title,
                    type: "memory",
                    image: memory.image
                  })}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isSaved(memory.id) ? "fill-red-500 text-red-500" : ""
                    }`} 
                  />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}