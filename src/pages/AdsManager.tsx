import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { AdData } from "@/types/ads";
import { 
  Rocket, 
  TrendingUp, 
  Crown,
  CheckCircle2,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  BarChart3,
  Target
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  icon: any;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Boost",
    price: 15,
    badge: "Most Popular",
    icon: Rocket,
    description: "Perfect for testing the waters with a single high-priority item.",
    features: [
      "20,000+ guaranteed impressions",
      "Prime placement in category feeds",
      "Featured Listings carousel",
      "1 listing promoted"
    ]
  },
  {
    id: "steady",
    name: "Steady Seller",
    price: 35,
    badge: "Best Value",
    icon: TrendingUp,
    description: "Ideal for sellers with small inventory who want consistent results.",
    features: [
      "50,000+ guaranteed impressions",
      "Top of search results placement",
      "Priority in location feeds",
      "Up to 3 listings promoted"
    ],
    isPopular: true
  },
  {
    id: "power",
    name: "Power Seller",
    price: 75,
    icon: Crown,
    description: "For serious sellers who rely on our platform for significant sales.",
    features: [
      "Unlimited impressions",
      "Premium homepage placement",
      "Enhanced analytics dashboard",
      "All active listings promoted"
    ]
  }
];

const faqs = [
  {
    question: "How do I choose the right plan for my business?",
    answer: "If you're new to advertising or have just a few items, start with the Starter Boost. For consistent sellers with multiple items, the Steady Seller offers great value. Power sellers with large inventories will benefit most from the Power Seller plan."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle."
  },
  {
    question: "How are impressions counted?",
    answer: "An impression is counted each time your ad is shown to a potential buyer. We guarantee a minimum number of impressions based on your selected plan."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, all plans are month-to-month with no long-term commitment. You can cancel at any time."
  }
];

interface UserAd extends AdData {
  userId: string;
  title: string;
  description: string;
  adType: "feedAds" | "reelsAds";
  plan: string;
  createdAt: Date;
  expiresAt: Date;
}

const AdsManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [userAds, setUserAds] = useState<UserAd[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { currentUser } = useAuth();
  
  // New ad form state
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    content: "",
    adType: "feedAds" as "feedAds" | "reelsAds",
    plan: "starter",
    priority: 3
  });

  // Fetch user's ads
  useEffect(() => {
    if (!currentUser?.uid) return;
    
    const feedQuery = query(
      collection(db, "feedAds"), 
      where("userId", "==", currentUser.uid)
    );
    const reelsQuery = query(
      collection(db, "reelsAds"), 
      where("userId", "==", currentUser.uid)
    );
    
    const unsubscribeFeed = onSnapshot(feedQuery, (snapshot) => {
      const feedAds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        adType: "feedAds" as const
      } as UserAd));
      
      const unsubscribeReels = onSnapshot(reelsQuery, (snapshot) => {
        const reelsAds = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          adType: "reelsAds" as const
        } as UserAd));
        
        setUserAds([...feedAds, ...reelsAds]);
      });
      
      return () => unsubscribeReels();
    });
    
    return () => unsubscribeFeed();
  }, [currentUser?.uid]);

  const handleSelectPlan = (tierName: string) => {
    setNewAd(prev => ({ ...prev, plan: tierName.toLowerCase().replace(" ", "") }));
    setActiveTab("create");
    toast.success(`${tierName} plan selected! Now create your ad.`);
  };

  const handleCreateAd = async () => {
    if (!currentUser?.uid || !newAd.title || !newAd.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const adData = {
        userId: currentUser.uid,
        title: newAd.title,
        description: newAd.description,
        content: newAd.content,
        isActive: true,
        priority: newAd.priority,
        clicks: 0,
        impressions: 0,
        uniqueClicks: {},
        segments: {},
        dailyClicks: {},
        dailyImpressions: {},
        isPremium: newAd.plan !== "starter",
        plan: newAd.plan,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      };

      await addDoc(collection(db, newAd.adType), adData);
      
      setNewAd({
        title: "",
        description: "",
        content: "",
        adType: "feedAds",
        plan: "starter",
        priority: 3
      });
      
      setActiveTab("listings");
      toast.success("Ad created successfully!");
    } catch (error) {
      toast.error("Failed to create ad");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAd = async (ad: UserAd) => {
    try {
      await updateDoc(doc(db, ad.adType, ad.id), { 
        isActive: !ad.isActive 
      });
      toast.success(`Ad ${ad.isActive ? 'paused' : 'activated'}`);
    } catch (error) {
      toast.error("Failed to update ad");
    }
  };

  const deleteAd = async (ad: UserAd) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    
    try {
      await deleteDoc(doc(db, ad.adType, ad.id));
      toast.success("Ad deleted successfully");
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 pt-16 px-5 pb-5">
            <div className="max-w-6xl mx-auto">
              {/* Page Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Ads Manager
                  </h1>
                  <p className="text-muted-foreground">
                    Create and manage your advertising campaigns
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("pricing")}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    View Plans
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("create")}
                    disabled={!currentUser}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="listings">My Ads ({userAds.length})</TabsTrigger>
                  <TabsTrigger value="create">Create Ad</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
                </TabsList>

                {/* My Ads Tab */}
                <TabsContent value="listings" className="space-y-6">
                  {userAds.length === 0 ? (
                    <Card className="p-12 text-center">
                      <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No ads yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first ad to start boosting your visibility
                      </p>
                      <Button onClick={() => setActiveTab("create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Ad
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userAds.map((ad) => (
                        <Card key={ad.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{ad.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {ad.adType === "feedAds" ? "Feed Ad" : "Reels Ad"} • {ad.plan}
                                </p>
                              </div>
                              <Badge variant={ad.isActive ? "default" : "secondary"}>
                                {ad.isActive ? "Active" : "Paused"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm">{ad.description}</p>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Clicks</p>
                                <p className="text-xl font-bold text-primary">{ad.clicks}</p>
                              </div>
                              <div>
                                <p className="font-medium">Impressions</p>
                                <p className="text-xl font-bold text-blue-600">{ad.impressions}</p>
                              </div>
                              <div>
                                <p className="font-medium">CTR</p>
                                <p className="text-xl font-bold text-green-600">
                                  {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0"}%
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAd(ad)}
                                >
                                  {ad.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  {ad.isActive ? "Pause" : "Activate"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteAd(ad)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Expires: {new Date(ad.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Create Ad Tab */}
                <TabsContent value="create" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Ad</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Fill in the details below to create your advertising campaign
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Ad Title *</label>
                            <Input
                              value={newAd.title}
                              onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter ad title"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={newAd.description}
                              onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe your ad campaign"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ad Type *</label>
                            <Select 
                              value={newAd.adType} 
                              onValueChange={(value: "feedAds" | "reelsAds") => 
                                setNewAd(prev => ({ ...prev, adType: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="feedAds">Feed Ad</SelectItem>
                                <SelectItem value="reelsAds">Reels Ad</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Content/URL *</label>
                            <Textarea
                              value={newAd.content}
                              onChange={(e) => setNewAd(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Enter ad content or media URL"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Selected Plan</label>
                            <Input value={newAd.plan} disabled />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Priority (1-5)</label>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              value={newAd.priority}
                              onChange={(e) => setNewAd(prev => ({ 
                                ...prev, 
                                priority: parseInt(e.target.value) || 1 
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("listings")}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateAd}
                          disabled={isCreating || !newAd.title || !newAd.content}
                        >
                          {isCreating ? "Creating..." : "Create Ad"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing Plans Tab */}
                <TabsContent value="pricing" className="space-y-6">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Choose Your Plan
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Simple, predictable pricing to increase your visibility and sales
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {pricingTiers.map((tier) => {
                      const Icon = tier.icon;
                      return (
                        <Card 
                          key={tier.id}
                          className={`relative p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${
                            tier.isPopular ? 'border-2 border-primary scale-105' : ''
                          }`}
                        >
                          {tier.badge && (
                            <Badge 
                              className="absolute -top-3 right-4 bg-primary text-primary-foreground"
                            >
                              {tier.badge}
                            </Badge>
                          )}
                          
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          
                          <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                          
                          <div className="text-4xl font-bold text-primary mb-6">
                            ${tier.price}
                            <span className="text-lg font-medium text-muted-foreground">/month</span>
                          </div>
                          
                          <p className="text-muted-foreground mb-8">{tier.description}</p>
                          
                          <div className="space-y-3 mb-8">
                            {tier.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-left">
                                <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full"
                            variant={tier.isPopular ? "default" : "outline"}
                            onClick={() => handleSelectPlan(tier.name)}
                          >
                            Select Plan
                          </Button>
                        </Card>
                      );
                    })}
                  </div>

                  {/* FAQ Section */}
                  <Card className="p-10">
                    <h3 className="text-2xl font-bold text-center mb-8">
                      Frequently Asked Questions
                    </h3>
                    
                    <div className="space-y-6">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-border pb-4 last:border-b-0">
                          <h4 className="font-semibold mb-2 text-foreground">
                            {faq.question}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdsManager;