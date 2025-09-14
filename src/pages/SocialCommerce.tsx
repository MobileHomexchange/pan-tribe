import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
  Plus,
  Hash,
  BarChart3,
  Network,
  Flame,
  Star,
  Inbox,
  Images,
  Settings,
  Bell
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const SocialCommerce = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeInboxTab, setActiveInboxTab] = useState("all");

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Facebook Engagement',
        data: [12, 19, 15, 17, 14, 16, 20],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsla(var(--primary), 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'TikTok Engagement',
        data: [8, 12, 16, 14, 18, 22, 25],
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsla(var(--destructive), 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'WeChat Engagement',
        data: [10, 14, 12, 16, 15, 13, 18],
        borderColor: 'hsl(var(--secondary))',
        backgroundColor: 'hsla(var(--secondary), 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const platformData = {
    labels: ['Facebook', 'TikTok', 'WeChat', 'Instagram'],
    datasets: [{
      data: [35, 30, 20, 15],
      backgroundColor: [
        'hsl(var(--primary))',
        'hsl(var(--destructive))',
        'hsl(var(--secondary))',
        'hsl(var(--accent))'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Network, label: "Network Effect" },
    { icon: Flame, label: "Trending Content" },
    { icon: Star, label: "Social Proof" },
    { icon: Users, label: "Followers Engine" },
    { icon: Inbox, label: "Unified Inbox" },
    { icon: Images, label: "UGC Gallery" },
    { icon: Settings, label: "Settings" }
  ];

  const socialPlatforms = [
    { name: "Facebook", icon: "📘", metric: "1.2K Clicks", color: "text-blue-600" },
    { name: "TikTok", icon: "🎵", metric: "45.7K Views", color: "text-black" },
    { name: "WeChat", icon: "💬", metric: "582 Shares", color: "text-green-600" },
    { name: "Instagram", icon: "📷", metric: "3.5K Likes", color: "text-pink-600" }
  ];

  const messages = [
    {
      id: 1,
      sender: "Amina Diallo",
      avatar: "AD",
      preview: "Hi, I'm interested in the handmade dress. Do you have it in size medium?",
      time: "2h ago",
      unread: 2,
      platform: "facebook"
    },
    {
      id: 2,
      sender: "Michael Kwame",
      avatar: "MK",
      preview: "When will the new sneakers be available? I'd like to purchase two pairs.",
      time: "5h ago",
      unread: 0,
      platform: "facebook"
    },
    {
      id: 3,
      sender: "TikTok User",
      avatar: "TT",
      preview: "Loved your video! Can you ship to South Africa?",
      time: "1d ago",
      unread: 0,
      platform: "tiktok"
    }
  ];

  const ugcItems = [
    { id: 1, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=300&fit=crop", user: "@FashionistaGhana" },
    { id: 2, image: "https://images.unsplash.com/photo-1525299374597-911581e1bdef?w=300&h=300&fit=crop", user: "@StyleByAmina" },
    { id: 3, image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300&h=300&fit=crop", user: "@NairobiFashion" },
    { id: 4, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300&h=300&fit=crop", user: "@LagosStyle" },
    { id: 5, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop", user: "@AccraTrends" },
    { id: 6, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop", user: "@CapeTownFashion" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        Social Commerce
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {sidebarItems.map((item, index) => (
                        <Button
                          key={index}
                          variant={item.active ? "default" : "ghost"}
                          className="w-full justify-start gap-2"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Social Commerce Dashboard</CardTitle>
                      <p className="text-muted-foreground">Track and optimize your social selling performance across all platforms</p>
                    </CardHeader>
                    <CardContent>
                      {/* Score Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">87</div>
                            <div className="text-sm text-muted-foreground mb-3">Network Effect Score</div>
                            <Progress value={87} className="mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Based on your social sharing activity and engagement
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">92</div>
                            <div className="text-sm text-muted-foreground mb-3">Trending Content Score</div>
                            <Progress value={92} className="mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Based on external platform buzz and virality
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-red-600 mb-2">78</div>
                            <div className="text-sm text-muted-foreground mb-3">Social Proof Score</div>
                            <Progress value={78} className="mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Based on engagement across all linked platforms
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Social Platforms */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {socialPlatforms.map((platform, index) => (
                          <Card key={index}>
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl mb-2">{platform.icon}</div>
                              <div className="font-semibold text-sm mb-1">{platform.name}</div>
                              <div className="text-primary font-bold">{platform.metric}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Social Engagement Trends</CardTitle>
                          <Select defaultValue="7days">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7days">Last 7 Days</SelectItem>
                              <SelectItem value="30days">Last 30 Days</SelectItem>
                              <SelectItem value="90days">Last 90 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <Line data={engagementData} options={chartOptions} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Platform Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <Doughnut data={platformData} options={doughnutOptions} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Unified Inbox */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Unified Messaging Inbox</CardTitle>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Message
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeInboxTab} onValueChange={setActiveInboxTab}>
                        <TabsList className="mb-4">
                          <TabsTrigger value="all">All Messages</TabsTrigger>
                          <TabsTrigger value="facebook">Facebook</TabsTrigger>
                          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                          <TabsTrigger value="wechat">WeChat</TabsTrigger>
                          <TabsTrigger value="instagram">Instagram</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value={activeInboxTab} className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted cursor-pointer">
                              <Avatar>
                                <AvatarFallback>{message.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold">{message.sender}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {message.preview}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground mb-1">{message.time}</div>
                                {message.unread > 0 && (
                                  <Badge variant="default" className="rounded-full w-6 h-6 p-0 flex items-center justify-center">
                                    {message.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* UGC Gallery */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>User-Generated Content</CardTitle>
                      <Button variant="outline">
                        <Hash className="w-4 h-4 mr-2" />
                        #TribePulseFashion
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {ugcItems.map((item) => (
                          <div key={item.id} className="relative group cursor-pointer">
                            <img
                              src={item.image}
                              alt="UGC"
                              className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                              <div className="text-xs truncate">{item.user}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SocialCommerce;