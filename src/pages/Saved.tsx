import { useState } from "react";
import { Bookmark, Heart, Share2, Trash2, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

export default function Saved() {
  const { savedItems, unsaveItem, getSavedItemsByType } = useSavedItems();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const tabLabel = tabItems.find(tab => tab.value === value)?.label || value;
    toast({
      title: "Filter applied",
      description: `Showing ${tabLabel.toLowerCase()}`,
    });
  };

  const handleCreateNewList = () => {
    toast({
      title: "Create New List",
      description: "New list creation feature coming soon!",
    });
  };

  const handleShareItem = (item: any) => {
    toast({
      title: "Item shared",
      description: `"${item.title}" has been shared`,
    });
    // In a real app, this would open share dialog or copy link
  };

  const tabItems = [
    { value: "all", label: "All Saves", count: savedItems.length },
    { value: "blog", label: "Blogs", count: getSavedItemsByType("blog").length },
    { value: "marketplace", label: "Marketplace", count: getSavedItemsByType("marketplace").length },
    { value: "video", label: "Videos", count: getSavedItemsByType("video").length },
    { value: "event", label: "Events", count: getSavedItemsByType("event").length },
  ];

  const getDisplayItems = () => {
    return activeTab === "all" ? savedItems : getSavedItemsByType(activeTab as any);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event": return "bg-primary";
      case "blog": return "bg-blue-500";
      case "marketplace": return "bg-green-500";
      case "video": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bookmark className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Save What You Love</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bookmark content across Tribe Pulse to easily find it later. Your saved items are organized by category for quick access.
          </p>
        </div>

        {/* Saved Items Hub */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Bookmark className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">My Saves Hub</h2>
              </div>
              <Button variant="outline" onClick={handleCreateNewList}>
                <Plus className="h-4 w-4 mr-2" />
                Create New List
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                {tabItems.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                    {tab.label}
                    {tab.count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {tab.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {getDisplayItems().length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Bookmark className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No saved items yet</h3>
                    <p className="text-muted-foreground">
                      Start exploring and save content you want to revisit later.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getDisplayItems().map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-32 object-cover"
                          />
                          <Badge className={`absolute top-2 left-2 ${getTypeColor(item.type)} text-white`}>
                            {item.type}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            {item.author && (
                              <p className="text-xs text-muted-foreground">by {item.author}</p>
                            )}
                            {item.location && (
                              <p className="text-xs text-muted-foreground">{item.location}</p>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                Saved {formatDate(item.savedAt)}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleShareItem(item)}
                                >
                                  <Share2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  onClick={() => unsaveItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}