import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, MapPin, Eye, Trash2 } from "lucide-react";

interface SavedItem {
  id: string;
  type: "product" | "post" | "event";
  title: string;
  price?: number;
  location?: string;
  seller?: { name: string; avatar: string };
  image: string;
  savedDate: string;
  description?: string;
  badge?: string;
}

const Saved = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: "1",
      type: "product",
      title: "Designer Sneakers - Like New",
      price: 120,
      location: "Accra, Ghana",
      seller: { name: "Kwame", avatar: "KA" },
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
      savedDate: "2 days ago",
      badge: "Hot Deal"
    },
    {
      id: "2",
      type: "product",
      title: "Handcrafted Leather Bag",
      price: 35,
      location: "Dakar, Senegal",
      seller: { name: "Fatou", avatar: "FD" },
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop",
      savedDate: "1 week ago",
      badge: "Free Shipping"
    },
    {
      id: "3",
      type: "event",
      title: "African Music Festival 2024",
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
      savedDate: "3 days ago",
      description: "Join us for the biggest African music celebration of the year!"
    },
    {
      id: "4",
      type: "post",
      title: "Traditional Recipe: Jollof Rice",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop", 
      savedDate: "5 days ago",
      description: "A step-by-step guide to making authentic West African Jollof rice"
    }
  ]);

  const removeSavedItem = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const filteredItems = savedItems.filter(item => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Saved Items</h1>
                <p className="text-muted-foreground">Items you've saved for later</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All ({savedItems.length})</TabsTrigger>
                  <TabsTrigger value="product">
                    Products ({savedItems.filter(item => item.type === "product").length})
                  </TabsTrigger>
                  <TabsTrigger value="event">
                    Events ({savedItems.filter(item => item.type === "event").length})
                  </TabsTrigger>
                  <TabsTrigger value="post">
                    Posts ({savedItems.filter(item => item.type === "post").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredItems.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No saved items yet</h3>
                        <p className="text-muted-foreground">
                          Start exploring and save items you're interested in!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredItems.map((item) => (
                        <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                            {item.badge && (
                              <Badge className="absolute top-2 left-2" variant="secondary">
                                {item.badge}
                              </Badge>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-8 h-8 p-0"
                                onClick={() => removeSavedItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-sm leading-tight">{item.title}</h3>
                              {item.price && (
                                <span className="text-lg font-bold text-primary">
                                  ${item.price}
                                </span>
                              )}
                            </div>

                            {item.seller && (
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">{item.seller.avatar}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-muted-foreground">{item.seller.name}</span>
                              </div>
                            )}

                            {item.location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-4 h-4" />
                                {item.location}
                              </div>
                            )}

                            {item.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {item.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                Saved {item.savedDate}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Saved;