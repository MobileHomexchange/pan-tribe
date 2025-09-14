import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Heart, MessageCircle, Share2 } from "lucide-react";

const Video = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const videos = [
    {
      id: 1,
      title: "African Traditional Dance Performance",
      creator: "Adunni Cultural Group",
      views: "125K",
      likes: "4.2K",
      duration: "5:32",
      thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      live: false
    },
    {
      id: 2,
      title: "LIVE: Pan-African Unity Conference",
      creator: "Unity Broadcasting",
      viewers: "2.1K",
      duration: "LIVE",
      thumbnail: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      live: true
    },
    {
      id: 3,
      title: "African Cuisine Cooking Tutorial",
      creator: "Chef Amara",
      views: "89K",
      likes: "3.1K",
      duration: "12:45",
      thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      live: false
    },
    {
      id: 4,
      title: "African Business Success Stories",
      creator: "Entrepreneur Hub",
      views: "156K",
      likes: "5.8K",
      duration: "18:22",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      live: false
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Video Hub</h1>
                  <p className="text-muted-foreground">Discover and share content from the African diaspora</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Go Live
                </Button>
              </div>

              {/* Featured Video */}
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Featured video"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Play className="w-6 h-6 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                    LIVE
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Pan-African Unity Summit 2024</h3>
                  <p className="text-muted-foreground mb-4">
                    Join leaders from across Africa and the diaspora as they discuss unity, progress, and cultural preservation.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        2.1K watching
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        4.2K likes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Grid */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Trending Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        <div className="absolute bottom-2 right-2">
                          {video.live ? (
                            <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                              LIVE
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {video.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{video.creator}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {video.live ? `${video.viewers} watching` : `${video.views} views`}
                          </span>
                          {!video.live && (
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {video.likes}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Music", icon: "🎵" },
                    { name: "Culture", icon: "🎭" },
                    { name: "Business", icon: "💼" },
                    { name: "Education", icon: "📚" },
                    { name: "Sports", icon: "⚽" },
                    { name: "Food", icon: "🍽️" }
                  ].map((category) => (
                    <Card key={category.name} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Video;