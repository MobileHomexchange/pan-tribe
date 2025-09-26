import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, CalendarPlus, History, Settings, BarChart3, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for event history with analytics
const mockEventHistory = [
  {
    id: "1",
    title: "African Tech Innovation Summit 2023",
    date: "2023-11-15",
    time: "09:00",
    location: "Lagos Convention Center",
    category: "Conference",
    attendees: 298,
    maxAttendees: 300,
    successRate: 99,
    feedback: 4.8,
    revenue: 15000
  },
  {
    id: "2",
    title: "Diaspora Cultural Festival",
    date: "2023-10-28",
    time: "14:00",
    location: "Virtual Event",
    category: "Cultural",
    attendees: 1247,
    maxAttendees: 1500,
    successRate: 83,
    feedback: 4.6,
    revenue: 0
  },
  {
    id: "3",
    title: "Leadership Workshop Series",
    date: "2023-09-20",
    time: "10:00",
    location: "Community Center",
    category: "Workshop",
    attendees: 45,
    maxAttendees: 50,
    successRate: 90,
    feedback: 4.9,
    revenue: 2250
  },
  {
    id: "4",
    title: "Music Producer Meetup",
    date: "2023-08-12",
    time: "18:00",
    location: "Recording Studio",
    category: "Networking",
    attendees: 28,
    maxAttendees: 30,
    successRate: 93,
    feedback: 4.7,
    revenue: 0
  },
  {
    id: "5",
    title: "African Art Exhibition",
    date: "2023-07-08",
    time: "16:00",
    location: "Art Gallery",
    category: "Exhibition",
    attendees: 156,
    maxAttendees: 200,
    successRate: 78,
    feedback: 4.5,
    revenue: 3900
  }
];

export default function EventHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const navigate = useNavigate();

  const filteredEvents = mockEventHistory.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalAttendees = mockEventHistory.reduce((sum, event) => sum + event.attendees, 0);
  const totalEvents = mockEventHistory.length;
  const avgSuccessRate = mockEventHistory.reduce((sum, event) => sum + event.successRate, 0) / totalEvents;
  const avgFeedback = mockEventHistory.reduce((sum, event) => sum + event.feedback, 0) / totalEvents;

  const exportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Export functionality would download event history data as CSV");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Event History</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => navigate('/create-event')}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
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

            {/* Analytics Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{totalEvents}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-2xl font-bold">{totalAttendees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Feedback</p>
                  <p className="text-2xl font-bold">{avgFeedback.toFixed(1)}/5</p>
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
                  placeholder="Search event history..."
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
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="2years">Last 2 Years</SelectItem>
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
                    
                    {/* Analytics */}
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
                    Try adjusting your search terms or filters.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setDateRange("all");
                  }}>
                    Clear Filters
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