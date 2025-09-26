import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, CalendarPlus, History, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simplified mock data for user's own event history
const mockUserEventHistory = [
  {
    id: "1",
    title: "Weekly Community Meetup",
    date: "2024-02-15",
    time: "18:00",
    location: "Community Center",
    category: "Social",
    attendees: 28,
    maxAttendees: 50,
    status: "completed"
  },
  {
    id: "2",
    title: "African Music Workshop",
    date: "2024-01-20",
    time: "14:00",
    location: "Virtual Event",
    category: "Workshop",
    attendees: 45,
    maxAttendees: 60,
    status: "completed"
  },
  {
    id: "3",
    title: "Tech Networking Event",
    date: "2023-12-10",
    time: "17:00",
    location: "Tech Hub",
    category: "Networking",
    attendees: 67,
    maxAttendees: 80,
    status: "completed"
  },
  {
    id: "4",
    title: "Art Exhibition Opening",
    date: "2023-11-05",
    time: "16:00",
    location: "Art Gallery",
    category: "Cultural",
    attendees: 89,
    maxAttendees: 100,
    status: "completed"
  }
];

export default function EventHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  const filteredEvents = mockUserEventHistory.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalEvents = mockUserEventHistory.length;
  const totalAttendees = mockUserEventHistory.reduce((sum, event) => sum + event.attendees, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">My Event History</h1>
          </div>
          <Button onClick={() => navigate('/create-event')}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button 
                  onClick={() => navigate('/create-event')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
                <button 
                  onClick={() => navigate('/my-events')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Events</span>
                </button>
                <div className="flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-lg">
                  <History className="h-4 w-4" />
                  <span className="font-medium">Event History</span>
                </div>
                <button 
                  onClick={() => navigate('/event-settings')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </CardContent>
            </Card>

            {/* Simple Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{totalEvents}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-2xl font-bold">{totalAttendees}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event History List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge variant="outline">{event.category}</Badge>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees}/{event.maxAttendees} attendees</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't organized any events yet or they don't match your search.
                  </p>
                  <Button onClick={() => navigate('/create-event')}>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}