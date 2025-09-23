import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Crown, 
  FileText, 
  TrendingUp,
  DollarSign,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTribes: number;
  totalPosts: number;
  totalRevenue: number;
  monthlyGrowth: number;
  engagementRate: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTribes: 0,
    totalPosts: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    engagementRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate data fetching - replace with actual Firebase queries
        const mockStats: DashboardStats = {
          totalUsers: 15420,
          activeUsers: 8340,
          totalTribes: 234,
          totalPosts: 5670,
          totalRevenue: 24500,
          monthlyGrowth: 12.5,
          engagementRate: 78.2
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: `${stats.activeUsers.toLocaleString()} active this month`
    },
    {
      title: 'Active Tribes',
      value: stats.totalTribes.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Crown,
      description: 'Across all categories'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts.toLocaleString(),
      change: '+25%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'Posts this month'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Monthly recurring revenue'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New tribe created', user: 'TechGeeks', time: '2 minutes ago', type: 'tribe' },
    { id: 2, action: 'User reported content', user: 'user123', time: '5 minutes ago', type: 'report' },
    { id: 3, action: 'Premium subscription', user: 'premium_user', time: '10 minutes ago', type: 'payment' },
    { id: 4, action: 'New job posting', user: 'TechCorp', time: '15 minutes ago', type: 'job' },
    { id: 5, action: 'Blog post published', user: 'blogger', time: '20 minutes ago', type: 'content' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tribe': return Crown;
      case 'report': return Eye;
      case 'payment': return DollarSign;
      case 'job': return FileText;
      case 'content': return MessageSquare;
      default: return Calendar;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'tribe': return 'text-blue-500';
      case 'report': return 'text-red-500';
      case 'payment': return 'text-green-500';
      case 'job': return 'text-purple-500';
      case 'content': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with TribalPulse.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>User Engagement Rate</span>
                <span>{stats.engagementRate}%</span>
              </div>
              <Progress value={stats.engagementRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Growth</span>
                <span>{stats.monthlyGrowth}%</span>
              </div>
              <Progress value={stats.monthlyGrowth} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Active Tribes Rate</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;