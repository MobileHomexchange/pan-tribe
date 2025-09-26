import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  Download, 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Star,
  UserCheck,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

// Mock data for all platform events with detailed analytics
const mockPlatformEvents = [
  {
    id: "1",
    title: "African Tech Innovation Summit 2023",
    organizer: "Tech Africa Community",
    organizerId: "user_123",
    date: "2023-11-15",
    time: "09:00",
    location: "Lagos Convention Center",
    category: "Conference",
    status: "completed",
    attendees: 298,
    maxAttendees: 300,
    successRate: 99,
    feedback: 4.8,
    revenue: 15000,
    reports: 0,
    visibility: "public"
  },
  {
    id: "2",
    title: "Diaspora Cultural Festival",
    organizer: "Cultural Heritage Group",
    organizerId: "user_456", 
    date: "2023-10-28",
    time: "14:00",
    location: "Virtual Event",
    category: "Cultural",
    status: "completed",
    attendees: 1247,
    maxAttendees: 1500,
    successRate: 83,
    feedback: 4.6,
    revenue: 0,
    reports: 1,
    visibility: "public"
  },
  {
    id: "3",
    title: "Leadership Workshop Series",
    organizer: "Community Leaders Network",
    organizerId: "user_789",
    date: "2023-09-20",
    time: "10:00",
    location: "Community Center",
    category: "Workshop",
    status: "completed",
    attendees: 45,
    maxAttendees: 50,
    successRate: 90,
    feedback: 4.9,
    revenue: 2250,
    reports: 0,
    visibility: "members"
  },
  {
    id: "4",
    title: "Weekly Community Meetup",
    organizer: "John Smith",
    organizerId: "user_current",
    date: "2024-03-20",
    time: "18:00",
    location: "Virtual",
    category: "Social",
    status: "upcoming",
    attendees: 23,
    maxAttendees: 100,
    successRate: null,
    feedback: null,
    revenue: 0,
    reports: 0,
    visibility: "public"
  },
  {
    id: "5",
    title: "Startup Pitch Competition",
    organizer: "Entrepreneur Hub",
    organizerId: "user_101",
    date: "2024-03-25",
    time: "16:00",
    location: "Business Center",
    category: "Business",
    status: "upcoming",
    attendees: 87,
    maxAttendees: 200,
    successRate: null,
    feedback: null,
    revenue: 5000,
    reports: 0,
    visibility: "public"
  }
];

export default function EventAnalytics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredEvents = mockPlatformEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const completedEvents = mockPlatformEvents.filter(e => e.status === "completed");
  const totalAttendees = completedEvents.reduce((sum, event) => sum + event.attendees, 0);
  const totalRevenue = completedEvents.reduce((sum, event) => sum + event.revenue, 0);
  const avgSuccessRate = completedEvents.reduce((sum, event) => sum + (event.successRate || 0), 0) / completedEvents.length;
  const avgFeedback = completedEvents.reduce((sum, event) => sum + (event.feedback || 0), 0) / completedEvents.length;
  const flaggedEvents = mockPlatformEvents.filter(e => e.reports > 0).length;

  const handleEventAction = (action: string, eventId: string) => {
    switch (action) {
      case 'view':
        console.log('Viewing event details:', eventId);
        break;
      case 'edit':
        console.log('Editing event:', eventId);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this event?')) {
          console.log('Deleting event:', eventId);
        }
        break;
    }
  };

  const exportData = () => {
    alert("Export functionality would download detailed analytics as CSV");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze all platform events and their performance metrics.
          </p>
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockPlatformEvents.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalAttendees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{avgFeedback.toFixed(1)}/5</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 border-b last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline">{event.category}</Badge>
                      {event.reports > 0 && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {event.reports} report{event.reports > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Organized by: <span className="font-medium">{event.organizer}</span>
                    </p>
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
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEventAction('view', event.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEventAction('edit', event.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEventAction('delete', event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Analytics for completed events */}
                {event.status === "completed" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{event.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{event.feedback}/5</p>
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{event.attendees}</p>
                      <p className="text-xs text-muted-foreground">Attendees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {event.revenue > 0 ? `$${event.revenue.toLocaleString()}` : 'Free'}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}