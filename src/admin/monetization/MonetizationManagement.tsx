import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MousePointer,
  Eye,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AdBannerData {
  isActive: boolean;
  content: string;
  clicks: number;
  uniqueClicks: Record<string, any>;
  targetUrl?: string;
  budget?: number;
  impressions?: number;
  updatedAt?: any;
}

const MonetizationManagement = () => {
  const [adBannerData, setAdBannerData] = useState<AdBannerData>({
    isActive: false,
    content: '',
    clicks: 0,
    uniqueClicks: {},
    targetUrl: '',
    budget: 0,
    impressions: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "adminSettings", "adBanner"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdBannerData({
          isActive: data.isActive || false,
          content: data.content || '',
          clicks: data.clicks || 0,
          uniqueClicks: data.uniqueClicks || {},
          targetUrl: data.targetUrl || '',
          budget: data.budget || 0,
          impressions: data.impressions || 0,
          updatedAt: data.updatedAt
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveAdBanner = async () => {
    setSaving(true);
    try {
      const adRef = doc(db, "adminSettings", "adBanner");
      await setDoc(adRef, {
        ...adBannerData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving ad banner:", error);
    } finally {
      setSaving(false);
    }
  };

  const uniqueClicksCount = Object.keys(adBannerData.uniqueClicks).length;
  const clickThroughRate = adBannerData.impressions > 0 ? 
    ((adBannerData.clicks / adBannerData.impressions) * 100).toFixed(2) : 0;
  const uniqueClickRate = adBannerData.clicks > 0 ? 
    ((uniqueClicksCount / adBannerData.clicks) * 100).toFixed(2) : 0;

  // Chart data for analytics
  const performanceData = {
    labels: ['Total Clicks', 'Unique Clicks', 'Impressions'],
    datasets: [
      {
        label: 'Ad Performance',
        data: [adBannerData.clicks, uniqueClicksCount, adBannerData.impressions],
        backgroundColor: ['#F97316', '#EA580C', '#FB923C'],
        borderColor: ['#F97316', '#EA580C', '#FB923C'],
        borderWidth: 1
      }
    ]
  };

  // Mock daily data for trend chart
  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Clicks',
        data: [12, 19, 15, 25, 22, 18, 28],
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4
      },
      {
        label: 'Daily Unique Clicks',
        data: [8, 14, 11, 18, 16, 13, 21],
        borderColor: '#EA580C',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Monetization Management</h1>
        <p className="text-muted-foreground">Manage sponsored content, advertisements, and revenue streams.</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold">${(adBannerData.budget || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total Clicks</span>
            </div>
            <div className="text-2xl font-bold">{adBannerData.clicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Unique Clicks</span>
            </div>
            <div className="text-2xl font-bold">{uniqueClicksCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">CTR</span>
            </div>
            <div className="text-2xl font-bold">{clickThroughRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banner" className="space-y-6">
        <TabsList>
          <TabsTrigger value="banner">Ad Banner Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="subscriptions">Premium Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="banner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ad Banner Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="adActive" className="text-base font-medium">
                    Ad Banner Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the ad banner across the platform
                  </p>
                </div>
                <Switch
                  id="adActive"
                  checked={adBannerData.isActive}
                  onCheckedChange={(checked) => 
                    setAdBannerData(prev => ({ ...prev, isActive: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adContent">Ad Content</Label>
                <Textarea
                  id="adContent"
                  placeholder="Enter your ad content here..."
                  value={adBannerData.content}
                  onChange={(e) => 
                    setAdBannerData(prev => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    placeholder="https://example.com"
                    value={adBannerData.targetUrl}
                    onChange={(e) => 
                      setAdBannerData(prev => ({ ...prev, targetUrl: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    value={adBannerData.budget}
                    onChange={(e) => 
                      setAdBannerData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveAdBanner} disabled={saving}>
                {saving ? 'Saving...' : 'Save Ad Banner Settings'}
              </Button>

              {/* Preview */}
              {adBannerData.content && (
                <div className="mt-6">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-8 px-6">
                      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold">📢</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                              Sponsored Listing
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {adBannerData.content}
                          </h3>
                          <p className="text-emerald-100 text-sm md:text-base">
                            Reach more buyers with promoted listings
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg shadow-lg">
                            Promote Your Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={performanceData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={trendData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Click-Through Rate</div>
                  <div className="text-2xl font-bold text-orange-600">{clickThroughRate}%</div>
                  <div className="text-xs text-muted-foreground">
                    {adBannerData.clicks} clicks from {adBannerData.impressions} impressions
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Unique Click Rate</div>
                  <div className="text-2xl font-bold text-blue-600">{uniqueClickRate}%</div>
                  <div className="text-xs text-muted-foreground">
                    {uniqueClicksCount} unique users out of {adBannerData.clicks} total clicks
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Cost Per Click</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${adBannerData.clicks > 0 ? ((adBannerData.budget || 0) / adBannerData.clicks).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on current budget and clicks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Premium Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Subscription Management</h3>
                <p className="text-muted-foreground">
                  Premium subscription features will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default MonetizationManagement;