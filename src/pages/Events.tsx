import { useState } from "react";
import { Calendar, Plus, MapPin, ChevronDown, Search, Share2, Heart, Users, Music, Utensils, Palette, GraduationCap, Zap, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const eventCategories = [
  { id: "music", name: "Music", icon: Music },
  { id: "food", name: "Food & Drink", icon: Utensils },
  { id: "art", name: "Art & Culture", icon: Palette },
  { id: "community", name: "Community", icon: Users },
  { id: "sports", name: "Sports & Fitness", icon: Zap },
  { id: "education", name: "Education", icon: GraduationCap },
];

const mockEvents = [
  {
    id: 1,
    title: "Afrobeat Night with DJ Kweku",
    date: "SAT, JUN 10 • 7:00 PM",
    location: "Club Zenith, Accra",
    distance: "2.3 km away",
    attendees: 124,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: true,
    category: "music",
  },
  {
    id: 2,
    title: "Accra Food Festival 2023",
    date: "SUN, JUN 11 • 12:00 PM",
    location: "Independence Square, Accra",
    distance: "5.1 km away",
    attendees: 342,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: false,
    category: "food",
  },
  {
    id: 3,
    title: "Contemporary Art Exhibition Opening",
    date: "FRI, JUN 16 • 6:00 PM",
    location: "National Museum of Ghana",
    distance: "1.8 km away",
    attendees: 87,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: false,
    category: "art",
  },
  {
    id: 4,
    title: "Accra Marathon 2023",
    date: "SAT, JUN 17 • 8:00 AM",
    location: "Osu Sports Complex, Accra",
    distance: "3.7 km away",
    attendees: 512,
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: false,
    category: "sports",
  },
  {
    id: 5,
    title: "Ghana Tech Summit",
    date: "SUN, JUN 18 • 3:00 PM",
    location: "Accra International Conference Centre",
    distance: "7.2 km away",
    attendees: 231,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: false,
    category: "education",
  },
  {
    id: 6,
    title: "Jazz Night at the Botanical Gardens",
    date: "FRI, JUN 23 • 7:30 PM",
    location: "Accra Botanical Gardens",
    distance: "4.5 km away",
    attendees: 98,
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    featured: false,
    category: "music",
  },
];

const locations = [
  { name: "Use Current Location", description: "Detect my current location automatically", current: true },
  { name: "Accra, Ghana", description: "Greater Accra Region, Ghana" },
  { name: "Kumasi, Ghana", description: "Ashanti Region, Ghana" },
  { name: "Lagos, Nigeria", description: "Lagos State, Nigeria" },
  { name: "Nairobi, Kenya", description: "Nairobi County, Kenya" },
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("music");
  const [currentLocation, setCurrentLocation] = useState("Accra, Ghana");
  const [savedEvents, setSavedEvents] = useState(new Set<number>());
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const toggleSaveEvent = (eventId: number) => {
    const newSavedEvents = new Set(savedEvents);
    if (newSavedEvents.has(eventId)) {
      newSavedEvents.delete(eventId);
    } else {
      newSavedEvents.add(eventId);
    }
    setSavedEvents(newSavedEvents);
  };

  const filteredEvents = selectedCategory === "all" 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Local Events</h1>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Location Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentLocation}</h3>
                  <p className="text-muted-foreground">Showing events within 20 km of your location</p>
                </div>
              </div>
              <Dialog open={locationModalOpen} onOpenChange={setLocationModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-accent hover:bg-accent/80">
                    <MapPin className="h-4 w-4 mr-2" />
                    Change Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Location</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search for a city or location..." className="pl-10" />
                    </div>
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <div
                          key={location.name}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => {
                            if (!location.current) {
                              setCurrentLocation(location.name);
                            }
                            setLocationModalOpen(false);
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Filter Events</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="gap-2"
                >
                  All Events
                </Button>
                {eventCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {event.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Featured
                  </Badge>
                )}
                <Badge variant="secondary" className="absolute top-2 right-2 bg-black/70 text-white">
                  {event.distance}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-primary">{event.date}</div>
                  <h3 className="font-bold text-lg line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{event.attendees} going</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Share functionality would go here
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveEvent(event.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            savedEvents.has(event.id) ? 'fill-red-500 text-red-500' : ''
                          }`} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More Events
          </Button>
        </div>
      </div>
    </Layout>
  );
}