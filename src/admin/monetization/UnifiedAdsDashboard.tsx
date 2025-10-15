import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bar, Line } from "react-chartjs-2";
import { AdData } from "@/types/ads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";


export default function UnifiedAdsDashboard() {
  const [feedAds, setFeedAds] = useState<AdData[]>([]);
  const [newAdContent, setNewAdContent] = useState("");
  const [newAdPriority, setNewAdPriority] = useState(3);

  // Fetch Feed Ads
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "feedAds"), (snapshot) => {
      const ads = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as AdData));
      setFeedAds(ads);
    });
    return () => unsubscribe();
  }, []);

  const toggleAd = async (adType: "feedAds", ad: AdData) => {
    await updateDoc(doc(db, adType, ad.id), { isActive: !ad.isActive });
  };

  const resetAd = async (adType: "feedAds", ad: AdData) => {
    await updateDoc(doc(db, adType, ad.id), { 
      clicks: 0, 
      impressions: 0, 
      uniqueClicks: {}, 
      segments: {}, 
      dailyClicks: {}, 
      dailyImpressions: {} 
    });
  };

  const updatePriority = async (adType: "feedAds", ad: AdData, priority: number) => {
    await updateDoc(doc(db, adType, ad.id), { priority });
  };

  const updateContent = async (adType: "feedAds", ad: AdData, content: string) => {
    await updateDoc(doc(db, adType, ad.id), { content });
  };

  const addNewAd = async (adType: "feedAds") => {
    if (!newAdContent.trim()) return;
    
    await addDoc(collection(db, adType), {
      content: newAdContent,
      isActive: true,
      priority: newAdPriority,
      clicks: 0,
      impressions: 0,
      uniqueClicks: {},
      segments: {},
      dailyClicks: {},
      dailyImpressions: {},
      isPremium: newAdPriority >= 4,
      userId: "admin",
      title: "Admin Created Ad",
      description: "Created from admin dashboard",
      plan: "admin",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    });
    
    setNewAdContent("");
    setNewAdPriority(3);
  };

  const deleteAd = async (adType: "feedAds", ad: AdData) => {
    await deleteDoc(doc(db, adType, ad.id));
  };

  const getCTR = (ad: AdData) => {
    return ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0";
  };

  const getUniqueClickCount = (ad: AdData) => Object.keys(ad.uniqueClicks || {}).length;

  const renderSegmentChart = (segments?: Record<string, {clicks: number, impressions: number}>) => {
    if (!segments || Object.keys(segments).length === 0) return null;
    
    const labels = Object.keys(segments);
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Segment Performance</h4>
        <Bar 
          data={{
            labels,
            datasets: [
              {
                label: "Clicks",
                data: labels.map(l => segments[l].clicks),
                backgroundColor: "#F97316"
              },
              {
                label: "Impressions", 
                data: labels.map(l => segments[l].impressions),
                backgroundColor: "#60A5FA"
              }
            ]
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={200}
        />
      </div>
    );
  };

  const renderDailyChart = (dailyData?: Record<string, number>, label: string = "Clicks") => {
    if (!dailyData || Object.keys(dailyData).length === 0) return null;
    
    const labels = Object.keys(dailyData).sort();
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Daily {label}</h4>
        <Line 
          data={{
            labels,
            datasets: [{
              label,
              data: labels.map(date => dailyData[date]),
              borderColor: label === "Clicks" ? "#EA580C" : "#2563EB",
              backgroundColor: label === "Clicks" ? "rgba(234,88,12,0.3)" : "rgba(37,99,235,0.3)",
              tension: 0.1
            }]
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={150}
        />
      </div>
    );
  };

  const renderAdCard = (ad: AdData & { userId?: string; title?: string; plan?: string }, adType: "feedAds") => (
    <Card key={ad.id} className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            <span className="truncate">{ad.title || ad.content}</span>
            {ad.userId && (
              <p className="text-xs text-muted-foreground">
                User: {ad.userId} • Plan: {ad.plan || 'Unknown'}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={ad.isActive}
              onCheckedChange={() => toggleAd(adType, ad)}
            />
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => deleteAd(adType, ad)}
            >
              Delete
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Priority (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={ad.priority || 1}
              onChange={(e) => updatePriority(adType, ad, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Premium</label>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs ${ad.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                {ad.isPremium ? 'Premium' : 'Standard'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Content</label>
          <Textarea
            value={ad.content}
            onChange={(e) => updateContent(adType, ad, e.target.value)}
            placeholder="Ad content or video URL"
            className="w-full mt-1"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium">Clicks</p>
            <p className="text-2xl font-bold text-orange-600">{ad.clicks}</p>
          </div>
          <div>
            <p className="font-medium">Impressions</p>
            <p className="text-2xl font-bold text-blue-600">{ad.impressions}</p>
          </div>
          <div>
            <p className="font-medium">Unique Clicks</p>
            <p className="text-2xl font-bold text-green-600">{getUniqueClickCount(ad)}</p>
          </div>
          <div>
            <p className="font-medium">CTR</p>
            <p className="text-2xl font-bold text-purple-600">{getCTR(ad)}%</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => resetAd(adType, ad)}
          >
            Reset Analytics
          </Button>
        </div>

        {renderDailyChart(ad.dailyClicks, "Daily Clicks")}
        {renderDailyChart(ad.dailyImpressions, "Daily Impressions")}
        {renderSegmentChart(ad.segments)}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Unified Ads Dashboard</h1>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList>
          <TabsTrigger value="feed">Feed Ads ({feedAds.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Feed Ad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newAdContent}
                    onChange={(e) => setNewAdContent(e.target.value)}
                    placeholder="Enter ad content or video URL"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority (1-5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={newAdPriority}
                    onChange={(e) => setNewAdPriority(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <Button 
                    onClick={() => addNewAd("feedAds")}
                    className="w-full mt-2"
                    disabled={!newAdContent.trim()}
                  >
                    Add Feed Ad
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedAds.map(ad => renderAdCard(ad, "feedAds"))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}