import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Video, 
  Calendar, 
  Briefcase, 
  ShoppingCart, 
  Users,
  MessageSquare,
  Camera,
  Heart,
  TrendingUp,
  Palette,
  Bell
} from 'lucide-react';

interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'social' | 'commerce' | 'content' | 'engagement';
  enabled: boolean;
  icon: any;
  hasAdvancedSettings?: boolean;
  settings?: Record<string, any>;
}

const FeatureToggles = () => {
  const [features, setFeatures] = useState<FeatureConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [algorithmWeights, setAlgorithmWeights] = useState({
    engagement: 0.4,
    recency: 0.3,
    relevance: 0.2,
    diversity: 0.1
  });

  useEffect(() => {
    // Simulate fetching feature configs - replace with actual Firebase query
    const mockFeatures: FeatureConfig[] = [
      {
        id: 'live_conferences',
        name: 'Live Conferences',
        description: 'Enable live video conferences within tribes',
        category: 'core',
        enabled: true,
        icon: Video,
        hasAdvancedSettings: true,
        settings: { maxParticipants: 50, recordingEnabled: true }
      },
      {
        id: 'reels',
        name: 'Reels & Short Videos',
        description: 'Allow users to create and share short video content',
        category: 'content',
        enabled: true,
        icon: Camera,
        hasAdvancedSettings: true,
        settings: { maxDuration: 60, autoplay: true }
      },
      {
        id: 'memories',
        name: 'Memories',
        description: 'Photo and video memories feature',
        category: 'content',
        enabled: false,
        icon: Heart
      },
      {
        id: 'raise_hand',
        name: 'Raise Hand / Hit Drum',
        description: 'Speaking request features in live conferences',
        category: 'core',
        enabled: true,
        icon: Users
      },
      {
        id: 'marketplace',
        name: 'Social Commerce',
        description: 'Marketplace and product listings',
        category: 'commerce',
        enabled: true,
        icon: ShoppingCart,
        hasAdvancedSettings: true,
        settings: { commissionRate: 5, autoApproval: false }
      },
      {
        id: 'events',
        name: 'Events Module',
        description: 'Event creation and management',
        category: 'social',
        enabled: true,
        icon: Calendar
      },
      {
        id: 'careers',
        name: 'Career Hub',
        description: 'Job postings and career networking',
        category: 'commerce',
        enabled: true,
        icon: Briefcase,
        hasAdvancedSettings: true,
        settings: { jobPostingFee: 99, verificationRequired: true }
      },
      {
        id: 'discussions',
        name: 'Tribe Discussions',
        description: 'Threaded discussions within tribes',
        category: 'social',
        enabled: true,
        icon: MessageSquare
      }
    ];
    
    setTimeout(() => {
      setFeatures(mockFeatures);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
    // Here you would typically update the backend
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(feature => feature.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return Settings;
      case 'social': return Users;
      case 'commerce': return ShoppingCart;
      case 'content': return Camera;
      case 'engagement': return TrendingUp;
      default: return Settings;
    }
  };

  const categories = [
    { id: 'core', name: 'Core Features', description: 'Essential platform functionality' },
    { id: 'social', name: 'Social Features', description: 'Community and social interactions' },
    { id: 'content', name: 'Content Features', description: 'Media and content creation tools' },
    { id: 'commerce', name: 'Commerce Features', description: 'Monetization and marketplace' },
    { id: 'engagement', name: 'Engagement', description: 'User engagement and retention' }
  ];

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
        <h1 className="text-3xl font-bold text-foreground">Feature Management</h1>
        <p className="text-muted-foreground">Control platform features, algorithm settings, and user experience.</p>
      </div>

      {/* Algorithm Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Feed Algorithm Weights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Engagement Score</span>
                <span>{Math.round(algorithmWeights.engagement * 100)}%</span>
              </div>
              <Slider
                value={[algorithmWeights.engagement * 100]}
                onValueChange={(value) => setAlgorithmWeights(prev => ({ ...prev, engagement: value[0] / 100 }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Recency Score</span>
                <span>{Math.round(algorithmWeights.recency * 100)}%</span>
              </div>
              <Slider
                value={[algorithmWeights.recency * 100]}
                onValueChange={(value) => setAlgorithmWeights(prev => ({ ...prev, recency: value[0] / 100 }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Relevance Score</span>
                <span>{Math.round(algorithmWeights.relevance * 100)}%</span>
              </div>
              <Slider
                value={[algorithmWeights.relevance * 100]}
                onValueChange={(value) => setAlgorithmWeights(prev => ({ ...prev, relevance: value[0] / 100 }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Diversity Score</span>
                <span>{Math.round(algorithmWeights.diversity * 100)}%</span>
              </div>
              <Slider
                value={[algorithmWeights.diversity * 100]}
                onValueChange={(value) => setAlgorithmWeights(prev => ({ ...prev, diversity: value[0] / 100 }))}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
          <Button>Save Algorithm Settings</Button>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      {categories.map(category => {
        const categoryFeatures = getFeaturesByCategory(category.id);
        const CategoryIcon = getCategoryIcon(category.id);
        
        if (categoryFeatures.length === 0) return null;
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                {category.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryFeatures.map(feature => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded">
                          <FeatureIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{feature.name}</h3>
                            {feature.hasAdvancedSettings && (
                              <Badge variant="outline" className="text-xs">Advanced</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.settings && (
                            <div className="flex gap-2 mt-2">
                              {Object.entries(feature.settings).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {String(value)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {feature.hasAdvancedSettings && (
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">Allow users to toggle dark mode</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">Enable push notifications for all users</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h3 className="font-medium">Analytics Tracking</h3>
              <p className="text-sm text-muted-foreground">Track user behavior for insights</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h3 className="font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">Enable maintenance mode for platform updates</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureToggles;