import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, MoreHorizontal, Edit, Trash2, CalendarPlus, History, Settings, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for user's events
const mockEvents = [
  {
    id: "1",
    title: "African Tech Innovation Summit",
    description: "Annual summit bringing together tech innovators from across Africa",
    date: "2024-03-25",
    time: "09:00",
    location: "Lagos Convention Center",
    category: "Conference",
    status: "upcoming",
    attendees: 245,
    maxAttendees: 300,
    visibility: "public"
  },
  {
    id: "2",
    title: "Diaspora Art Exhibition Opening",
    description: "Virtual gallery opening featuring contemporary African artists",
    date: "2024-03-18",
    time: "18:00",
    location: "Virtual Event",
    category: "Arts & Culture",
    status: "upcoming",
    attendees: 89,
    maxAttendees: 150,
    visibility: "public"
  },
  {
    id: "3",
    title: "Community Leadership Workshop",
    description: "Monthly workshop for community leaders and organizers",
    date: "2024-03-15",
    time: "14:00",
    location: "Community Center",
    category: "Workshop",
    status: "upcoming",
    attendees: 32,
    maxAttendees: 50,
    visibility: "members"
  },
  {
    id: "4",
    title: "Music Festival Planning Meeting",
    description: "Planning session for upcoming music festival",
    date: "2024-03-10",
    time: "10:00",
    location: "Conference Room A",
    category: "Meeting",
    status: "completed",
    attendees: 12,
    maxAttendees: 15,
    visibility: "private"
  }
];

export default function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingEvents = filteredEvents.filter(e => e.status === "upcoming");
  const completedEvents = filteredEvents.filter(e => e.status === "completed");

  const handleEditEvent = (eventId: string) => {
    // Navigate to edit event page
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      // Handle delete logic here
      console.log("Deleting event:", eventId);
    }
  };

  const EventCard = ({ event }: { event: typeof mockEvents[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                {event.status}
              </Badge>
              <Badge variant="outline">{event.visibility}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.attendees}/{event.maxAttendees} attendees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">My Events</h1>
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
                <div className="flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-lg">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">My Events</span>
                </div>
                <button 
                  onClick={() => navigate('/event-history')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span>Event History</span>
                </button>
                <button 
                  onClick={() => navigate('/event-settings')}
                  className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  Upcoming Events ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed Events ({completedEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any upcoming events. Create your first event to get started.
                      </p>
                      <Button onClick={() => navigate('/create-event')}>
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedEvents.length > 0 ? (
                  completedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No completed events</h3>
                      <p className="text-muted-foreground">
                        Your completed events will appear here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}