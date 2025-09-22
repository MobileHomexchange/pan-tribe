import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
  Bell,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  Heart,
  MessageCircle,
  Share,
  Download,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  Globe,
  Lock,
  Shield,
  Palette,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
  ExternalLink
} from "lucide-react";
import { mockSocialCommerceData, type SocialCommerceModule } from "@/types/socialCommerce";

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

type ActiveSection = 'dashboard' | 'networkEffect' | 'trendingContent' | 'socialProof' | 'followersEngine' | 'unifiedInbox' | 'ugcGallery' | 'settings';

const SocialCommerce = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [activeInboxTab, setActiveInboxTab] = useState("all");
  const [data] = useState<SocialCommerceModule>(mockSocialCommerceData);

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
    { icon: BarChart3, label: "Dashboard", key: 'dashboard' as ActiveSection },
    { icon: Network, label: "Network Effect", key: 'networkEffect' as ActiveSection },
    { icon: Flame, label: "Trending Content", key: 'trendingContent' as ActiveSection },
    { icon: Star, label: "Social Proof", key: 'socialProof' as ActiveSection },
    { icon: Users, label: "Followers Engine", key: 'followersEngine' as ActiveSection },
    { icon: Inbox, label: "Unified Inbox", key: 'unifiedInbox' as ActiveSection },
    { icon: Images, label: "UGC Gallery", key: 'ugcGallery' as ActiveSection },
    { icon: Settings, label: "Settings", key: 'settings' as ActiveSection }
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

  // Dashboard Section Component
  const DashboardSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Social Commerce Dashboard</CardTitle>
          <CardDescription>Track and optimize your social selling performance across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-3xl font-bold">${data.dashboard.metrics.totalSales.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +{data.dashboard.metrics.growthPercentage}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                    <p className="text-3xl font-bold">{data.dashboard.metrics.engagementRate}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <Progress value={data.dashboard.metrics.engagementRate * 20} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold">{data.dashboard.metrics.activeUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold">{data.dashboard.metrics.conversionRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={data.dashboard.metrics.conversionRate * 10} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line data={engagementData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            
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
        </CardContent>
      </Card>
    </div>
  );

  // Network Effect Section Component
  const NetworkEffectSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Network Effect Analytics
          </CardTitle>
          <CardDescription>Track how your content spreads through social networks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{data.networkEffect.referralsCount}</p>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-green-600">{data.networkEffect.viralCoefficient}</p>
                <p className="text-sm text-muted-foreground">Viral Coefficient</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-blue-600">${data.networkEffect.networkValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Network Value</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Referral Sources</h3>
            {data.networkEffect.referralSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">{source.count} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{source.percentage}%</p>
                  <p className="text-sm text-muted-foreground">{source.conversionRate}% conversion</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Trending Content Section Component
  const TrendingContentSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Trending Content
          </CardTitle>
          <CardDescription>Discover what's performing best across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.trendingContent.map((content, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {content.mediaType === 'video' ? (
                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">VIDEO</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{content.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{content.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {content.engagement.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share className="w-4 h-4" />
                              {content.engagement.shares}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {content.engagement.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {content.engagement.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2">
                            Score: {content.trendScore}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {content.postedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {content.hashtags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Social Proof Section Component
  const SocialProofSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Social Proof & Reviews
          </CardTitle>
          <CardDescription>Customer testimonials and social validation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.socialProof.map((proof, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={proof.user.avatarUrl} />
                      <AvatarFallback>{proof.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{proof.user.name}</h4>
                          {proof.user.isVerified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                          {proof.verifiedPurchase && (
                            <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < proof.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{proof.testimonial}</p>
                      {proof.product && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                            <img src={proof.product.productImageUrl} alt="" className="w-8 h-8 rounded" />
                          </div>
                          <span className="text-sm">{proof.product.productName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{proof.timestamp.toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span>{proof.helpfulVotes} found helpful</span>
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Followers Engine Section Component
  const FollowersEngineSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Followers Engine
          </CardTitle>
          <CardDescription>Analyze and grow your social following</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold">{data.followersEngine.metrics.totalFollowers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Followers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-green-600">+{data.followersEngine.metrics.newFollowersToday}</p>
                <p className="text-sm text-muted-foreground">New Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{data.followersEngine.metrics.averageEngagementRate}%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-red-600">{data.followersEngine.metrics.churnRate}%</p>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Interests</h3>
            <div className="flex flex-wrap gap-2">
              {data.followersEngine.metrics.topInterests.map((interest, index) => (
                <Badge key={index} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Unified Inbox Section Component
  const UnifiedInboxSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Unified Inbox
          </CardTitle>
          <CardDescription>Manage all your social messages in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{data.unifiedInbox.metrics.totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{data.unifiedInbox.metrics.unreadMessages}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{data.unifiedInbox.metrics.responseRate}%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{data.unifiedInbox.metrics.averageResponseTime}h</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {data.unifiedInbox.messages.map((message, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={message.sender.avatarUrl} />
                      <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{message.sender.name}</h4>
                          <Badge variant="outline" className="text-xs">{message.sender.channel}</Badge>
                          <Badge variant={message.status === 'unread' ? 'default' : 'secondary'} className="text-xs">
                            {message.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {message.receivedAt.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{message.messageBody}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{message.messageType}</Badge>
                        <Badge variant={message.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // UGC Gallery Section Component
  const UGCGallerySection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="w-5 h-5" />
            User-Generated Content Gallery
          </CardTitle>
          <CardDescription>Curate and showcase customer content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{data.ugcGallery.metrics.totalSubmissions}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{data.ugcGallery.metrics.pendingApproval}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{data.ugcGallery.metrics.approvalRate}%</p>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{data.ugcGallery.metrics.averageQualityScore}/10</p>
                <p className="text-sm text-muted-foreground">Avg Quality Score</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {data.ugcGallery.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Images className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{item.user.name}</h4>
                          <Badge variant="outline" className="text-xs">@{item.user.username}</Badge>
                          <Badge variant={item.approvalStatus === 'approved' ? 'default' : 'secondary'} className="text-xs">
                            {item.approvalStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{item.ugcType}</Badge>
                          <span className="text-sm text-muted-foreground">Score: {item.qualityScore}/10</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.caption}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.hashtags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.submittedAt.toLocaleDateString()}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {item.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {item.engagement.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.engagement.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Settings Section Component
  const SettingsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings & Configuration
          </CardTitle>
          <CardDescription>Manage your social commerce preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="privacy" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Sharing</p>
                      <p className="text-sm text-muted-foreground">Allow data sharing with partners</p>
                    </div>
                    <Badge variant={data.settings.privacy.dataSharing ? 'default' : 'secondary'}>
                      {data.settings.privacy.dataSharing ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Badge variant="secondary">{data.settings.privacy.profileVisibility}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Badge variant={data.settings.notifications.email ? 'default' : 'secondary'}>
                      {data.settings.notifications.email ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Badge variant={data.settings.notifications.push ? 'default' : 'secondary'}>
                      {data.settings.notifications.push ? 'On' : 'Off'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.settings.integrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{integration.displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {integration.connected ? `Connected as ${integration.accountName}` : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={integration.connected ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <Badge variant="secondary">{data.settings.themePreference}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">Set your language preference</p>
                    </div>
                    <Badge variant="secondary">{data.settings.language}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Currency</p>
                      <p className="text-sm text-muted-foreground">Display currency</p>
                    </div>
                    <Badge variant="secondary">{data.settings.currency}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'networkEffect':
        return <NetworkEffectSection />;
      case 'trendingContent':
        return <TrendingContentSection />;
      case 'socialProof':
        return <SocialProofSection />;
      case 'followersEngine':
        return <FollowersEngineSection />;
      case 'unifiedInbox':
        return <UnifiedInboxSection />;
      case 'ugcGallery':
        return <UGCGallerySection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
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
                          variant={activeSection === item.key ? "default" : "ghost"}
                          className="w-full justify-start gap-2"
                          onClick={() => setActiveSection(item.key)}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                  {renderActiveSection()}
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