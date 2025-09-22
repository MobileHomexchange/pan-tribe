// ===========================
// SOCIAL COMMERCE MODULE TYPES
// ===========================

// 1. DASHBOARD INTERFACES
export interface DashboardMetrics {
  totalSales: number;
  engagementRate: number;
  conversionRate: number;
  activeUsers: number;
  growthPercentage: number;
  totalRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

export type DashboardFilter = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface DashboardGraph {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface DashboardSection {
  metrics: DashboardMetrics;
  filter: DashboardFilter;
  salesGraph: DashboardGraph[];
  engagementGraph: DashboardGraph[];
  conversionGraph: DashboardGraph[];
}

// 2. NETWORK EFFECT INTERFACES
export interface ReferralSource {
  source: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface NetworkGrowthTrend {
  date: string;
  newConnections: number;
  totalConnections: number;
  growthRate: number;
}

export interface InfluencerMetrics {
  userId: string;
  name: string;
  referralsGenerated: number;
  conversionRate: number;
  totalRevenueGenerated: number;
}

export interface NetworkEffect {
  referralsCount: number;
  referralSources: ReferralSource[];
  networkGrowthTrend: NetworkGrowthTrend[];
  viralCoefficient: number;
  topInfluencers: InfluencerMetrics[];
  averageReferralsPerUser: number;
  networkValue: number;
}

// 3. TRENDING CONTENT INTERFACES
export type MediaType = "image" | "video" | "article" | "carousel" | "story" | "reel";
export type ContentCategory = "product" | "lifestyle" | "tutorial" | "review" | "behind-scenes" | "announcement";

export interface Engagement {
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  views: number;
  clickThroughRate: number;
}

export interface ContentPerformance {
  reach: number;
  impressions: number;
  engagementRate: number;
  conversionRate: number;
  revenueGenerated: number;
}

export interface TrendingContent {
  contentId: string;
  title: string;
  description: string;
  mediaType: MediaType;
  category: ContentCategory;
  mediaUrl: string;
  thumbnailUrl?: string;
  engagement: Engagement;
  performance: ContentPerformance;
  postedAt: Date;
  trendScore: number;
  hashtags: string[];
  mentions: string[];
  isPromoted: boolean;
  authorId: string;
  authorName: string;
}

// 4. SOCIAL PROOF INTERFACES
export interface SocialProofUser {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  followerCount?: number;
}

export interface ProductReview {
  productId: string;
  productName: string;
  productImageUrl: string;
}

export interface SocialProof {
  reviewId: string;
  user: SocialProofUser;
  rating: number; // 1–5
  testimonial: string;
  verifiedPurchase: boolean;
  timestamp: Date;
  helpfulVotes: number;
  product?: ProductReview;
  images?: string[];
  videoUrl?: string;
  sentiment: "positive" | "neutral" | "negative";
  isPublic: boolean;
  responseFromBrand?: string;
  responseTimestamp?: Date;
}

// 5. FOLLOWERS ENGINE INTERFACES
export type EngagementLevel = "low" | "medium" | "high" | "super";
export type FollowerSource = "organic" | "paid" | "referral" | "influencer" | "event";
export type FollowerStatus = "active" | "inactive" | "churned" | "new";

export interface FollowerEngagement {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  lastInteraction: Date;
  averageSessionDuration: number;
}

export interface FollowerDemographics {
  ageGroup: string;
  gender: string;
  country: string;
  city?: string;
  language: string;
  timezone: string;
}

export interface Follower {
  followerId: string;
  name: string;
  username: string;
  profilePic: string;
  followedSince: Date;
  engagementLevel: EngagementLevel;
  followerSource: FollowerSource;
  status: FollowerStatus;
  demographics: FollowerDemographics;
  interests: string[];
  engagement: FollowerEngagement;
  lifetimeValue: number;
  totalPurchases: number;
  lastPurchaseDate?: Date;
  isInfluencer: boolean;
  socialHandles?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export interface FollowersEngineMetrics {
  totalFollowers: number;
  newFollowersToday: number;
  followerGrowthRate: number;
  averageEngagementRate: number;
  topInterests: string[];
  followersBySource: Record<FollowerSource, number>;
  churnRate: number;
}

export interface FollowersEngine {
  metrics: FollowersEngineMetrics;
  followers: Follower[];
  growthTrend: Array<{
    date: string;
    followers: number;
    unfollows: number;
    netGrowth: number;
  }>;
}

// 6. UNIFIED INBOX INTERFACES
export type MessageChannel = "email" | "sms" | "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "website";
export type MessageStatus = "read" | "unread" | "archived" | "starred" | "replied" | "pending";
export type MessagePriority = "low" | "normal" | "high" | "urgent";
export type MessageType = "inquiry" | "complaint" | "compliment" | "order" | "support" | "collaboration";

export interface InboxSender {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  channel: MessageChannel;
  isVerified: boolean;
  followerCount?: number;
}

export interface MessageAttachment {
  type: "image" | "video" | "document" | "audio";
  url: string;
  filename: string;
  size: number;
}

export interface InboxMessage {
  messageId: string;
  threadId: string;
  sender: InboxSender;
  recipientId: string;
  messageBody: string;
  status: MessageStatus;
  priority: MessagePriority;
  messageType: MessageType;
  receivedAt: Date;
  readAt?: Date;
  repliedAt?: Date;
  attachments: MessageAttachment[];
  mentions: string[];
  hashtags: string[];
  sentiment: "positive" | "neutral" | "negative";
  language: string;
  isAutomatedResponse: boolean;
  originalPostUrl?: string;
  parentMessageId?: string;
  assignedTo?: string;
  tags: string[];
}

export interface InboxMetrics {
  totalMessages: number;
  unreadMessages: number;
  averageResponseTime: number;
  responseRate: number;
  satisfactionScore: number;
  messagesByChannel: Record<MessageChannel, number>;
  messagesByType: Record<MessageType, number>;
}

export interface UnifiedInbox {
  metrics: InboxMetrics;
  messages: InboxMessage[];
  filters: {
    channels: MessageChannel[];
    statuses: MessageStatus[];
    priorities: MessagePriority[];
    types: MessageType[];
    dateRange: {
      start: Date;
      end: Date;
    };
  };
}

// 7. UGC GALLERY INTERFACES
export type ApprovalStatus = "pending" | "approved" | "rejected" | "requires_review";
export type UGCType = "photo" | "video" | "story" | "review" | "unboxing" | "tutorial";
export type UGCSource = "instagram" | "tiktok" | "youtube" | "facebook" | "twitter" | "website" | "email";

export interface UGCUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  followerCount: number;
  isInfluencer: boolean;
  verificationLevel: "none" | "email" | "phone" | "identity";
}

export interface UGCEngagement {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  clickThroughRate: number;
}

export interface UGCProductTag {
  productId: string;
  productName: string;
  productSku: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface UGCItem {
  ugcId: string;
  user: UGCUser;
  ugcType: UGCType;
  source: UGCSource;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  originalCaption?: string;
  hashtags: string[];
  mentions: string[];
  tags: string[];
  productTags: UGCProductTag[];
  approvalStatus: ApprovalStatus;
  submittedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  engagement: UGCEngagement;
  sentiment: "positive" | "neutral" | "negative";
  qualityScore: number;
  isRightsCleared: boolean;
  rightsExpiryDate?: Date;
  campaignId?: string;
  originalPostUrl?: string;
  downloadUrl?: string;
  usageRights: string[];
  location?: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface UGCMetrics {
  totalSubmissions: number;
  pendingApproval: number;
  approvedContent: number;
  rejectedContent: number;
  approvalRate: number;
  averageQualityScore: number;
  totalReach: number;
  totalEngagement: number;
  conversionRate: number;
  revenueGenerated: number;
}

export interface UGCGallery {
  metrics: UGCMetrics;
  items: UGCItem[];
  campaigns: Array<{
    campaignId: string;
    name: string;
    hashtag: string;
    startDate: Date;
    endDate: Date;
    submissionsCount: number;
    status: "active" | "ended" | "draft";
  }>;
  moderationQueue: UGCItem[];
}

// 8. SETTINGS INTERFACES
export type ProfileVisibility = "public" | "private" | "friends_only" | "custom";
export type ThemePreference = "light" | "dark" | "auto" | "custom";
export type DataRetentionPeriod = "30_days" | "90_days" | "1_year" | "2_years" | "indefinite";

export interface PrivacySettings {
  dataSharing: boolean;
  profileVisibility: ProfileVisibility;
  allowTagging: boolean;
  allowMentions: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  dataRetentionPeriod: DataRetentionPeriod;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  thirdPartySharing: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  desktop: boolean;
  frequency: "real_time" | "hourly" | "daily" | "weekly";
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  categories: {
    newFollowers: boolean;
    mentions: boolean;
    comments: boolean;
    likes: boolean;
    shares: boolean;
    messages: boolean;
    ugcSubmissions: boolean;
    reviews: boolean;
    orders: boolean;
    campaigns: boolean;
  };
}

export interface Integration {
  platform: string;
  displayName: string;
  connected: boolean;
  lastSync?: Date;
  status: "active" | "error" | "syncing" | "paused";
  errorMessage?: string;
  permissions: string[];
  autoSync: boolean;
  syncFrequency: "real_time" | "hourly" | "daily";
  accountId?: string;
  accountName?: string;
}

export interface APISettings {
  apiKey: string;
  webhookUrl?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  allowedOrigins: string[];
  enableCORS: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number; // minutes
  passwordLastChanged: Date;
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  allowedIPs: string[];
  blockedIPs: string[];
}

export interface Settings {
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  integrations: Integration[];
  themePreference: ThemePreference;
  language: string;
  timezone: string;
  currency: string;
  api: APISettings;
  security: SecuritySettings;
  preferences: {
    autoApproveUGC: boolean;
    autoRespondMessages: boolean;
    contentModerationLevel: "strict" | "moderate" | "relaxed";
    analyticsRetention: DataRetentionPeriod;
    exportFormat: "json" | "csv" | "excel";
  };
}

// ROOT INTERFACE
export interface SocialCommerceModule {
  dashboard: DashboardSection;
  networkEffect: NetworkEffect;
  trendingContent: TrendingContent[];
  socialProof: SocialProof[];
  followersEngine: FollowersEngine;
  unifiedInbox: UnifiedInbox;
  ugcGallery: UGCGallery;
  settings: Settings;
  metadata: {
    lastUpdated: Date;
    version: string;
    userId: string;
    businessId: string;
  };
}

// ===========================
// MOCK DATA FOR TESTING
// ===========================

export const mockSocialCommerceData: SocialCommerceModule = {
  dashboard: {
    metrics: {
      totalSales: 125000,
      engagementRate: 4.2,
      conversionRate: 2.8,
      activeUsers: 15420,
      growthPercentage: 12.5,
      totalRevenue: 85000,
      averageOrderValue: 67.50,
      customerLifetimeValue: 245.80
    },
    filter: "monthly",
    salesGraph: [
      { date: "2024-01-01", value: 25000, label: "January" },
      { date: "2024-02-01", value: 32000, label: "February" },
      { date: "2024-03-01", value: 28000, label: "March" },
      { date: "2024-04-01", value: 40000, label: "April" }
    ],
    engagementGraph: [
      { date: "2024-01-01", value: 3.8, label: "January" },
      { date: "2024-02-01", value: 4.1, label: "February" },
      { date: "2024-03-01", value: 3.9, label: "March" },
      { date: "2024-04-01", value: 4.2, label: "April" }
    ],
    conversionGraph: [
      { date: "2024-01-01", value: 2.1, label: "January" },
      { date: "2024-02-01", value: 2.4, label: "February" },
      { date: "2024-03-01", value: 2.6, label: "March" },
      { date: "2024-04-01", value: 2.8, label: "April" }
    ]
  },
  networkEffect: {
    referralsCount: 1250,
    referralSources: [
      { source: "Instagram", count: 450, percentage: 36, conversionRate: 12.5 },
      { source: "WhatsApp", count: 380, percentage: 30.4, conversionRate: 18.2 },
      { source: "Direct Link", count: 250, percentage: 20, conversionRate: 8.9 },
      { source: "Email", count: 170, percentage: 13.6, conversionRate: 15.3 }
    ],
    networkGrowthTrend: [
      { date: "2024-01-01", newConnections: 120, totalConnections: 5200, growthRate: 2.4 },
      { date: "2024-02-01", newConnections: 180, totalConnections: 5380, growthRate: 3.5 },
      { date: "2024-03-01", newConnections: 220, totalConnections: 5600, growthRate: 4.1 },
      { date: "2024-04-01", newConnections: 280, totalConnections: 5880, growthRate: 5.0 }
    ],
    viralCoefficient: 1.35,
    topInfluencers: [
      { userId: "inf_001", name: "Sarah Johnson", referralsGenerated: 89, conversionRate: 22.5, totalRevenueGenerated: 15680 },
      { userId: "inf_002", name: "Mike Chen", referralsGenerated: 67, conversionRate: 18.9, totalRevenueGenerated: 12340 },
      { userId: "inf_003", name: "Emma Davis", referralsGenerated: 45, conversionRate: 25.2, totalRevenueGenerated: 9890 }
    ],
    averageReferralsPerUser: 3.2,
    networkValue: 425000
  },
  trendingContent: [
    {
      contentId: "content_001",
      title: "Summer Collection Lookbook",
      description: "Explore our latest summer fashion trends",
      mediaType: "video",
      category: "product",
      mediaUrl: "https://example.com/video/summer-lookbook.mp4",
      thumbnailUrl: "https://example.com/thumbnails/summer-lookbook.jpg",
      engagement: {
        likes: 2450,
        shares: 380,
        comments: 190,
        saves: 520,
        views: 15600,
        clickThroughRate: 8.2
      },
      performance: {
        reach: 25000,
        impressions: 45000,
        engagementRate: 15.7,
        conversionRate: 4.2,
        revenueGenerated: 8950
      },
      postedAt: new Date("2024-04-15T10:00:00Z"),
      trendScore: 92.5,
      hashtags: ["#SummerFashion", "#OOTD", "#Trendy"],
      mentions: ["@fashionista", "@styleinfluencer"],
      isPromoted: true,
      authorId: "user_001",
      authorName: "FashionBrand Official"
    },
    {
      contentId: "content_002",
      title: "Customer Review: Amazing Quality!",
      description: "Real customer sharing their experience",
      mediaType: "image",
      category: "review",
      mediaUrl: "https://example.com/images/customer-review.jpg",
      engagement: {
        likes: 1680,
        shares: 240,
        comments: 85,
        saves: 320,
        views: 8900,
        clickThroughRate: 6.8
      },
      performance: {
        reach: 12000,
        impressions: 18500,
        engagementRate: 18.9,
        conversionRate: 7.2,
        revenueGenerated: 3240
      },
      postedAt: new Date("2024-04-14T14:30:00Z"),
      trendScore: 87.3,
      hashtags: ["#CustomerLove", "#Quality", "#Review"],
      mentions: ["@happycustomer"],
      isPromoted: false,
      authorId: "user_002",
      authorName: "Jessica Miller"
    }
  ],
  socialProof: [
    {
      reviewId: "review_001",
      user: {
        id: "user_001",
        name: "Alice Thompson",
        avatarUrl: "https://example.com/avatars/alice.jpg",
        isVerified: true,
        followerCount: 15600
      },
      rating: 5,
      testimonial: "Absolutely love this product! The quality exceeded my expectations and the customer service was fantastic. Will definitely order again!",
      verifiedPurchase: true,
      timestamp: new Date("2024-04-10T16:20:00Z"),
      helpfulVotes: 23,
      product: {
        productId: "prod_001",
        productName: "Premium Cotton T-Shirt",
        productImageUrl: "https://example.com/products/tshirt.jpg"
      },
      images: ["https://example.com/reviews/alice-photo1.jpg", "https://example.com/reviews/alice-photo2.jpg"],
      sentiment: "positive",
      isPublic: true,
      responseFromBrand: "Thank you so much for your kind words, Alice! We're thrilled you love your new t-shirt!",
      responseTimestamp: new Date("2024-04-11T09:15:00Z")
    },
    {
      reviewId: "review_002",
      user: {
        id: "user_002",
        name: "David Rodriguez",
        avatarUrl: "https://example.com/avatars/david.jpg",
        isVerified: false,
        followerCount: 890
      },
      rating: 4,
      testimonial: "Great product overall. Fast shipping and good quality. Only minor issue was the sizing ran a bit small.",
      verifiedPurchase: true,
      timestamp: new Date("2024-04-08T11:45:00Z"),
      helpfulVotes: 12,
      product: {
        productId: "prod_002",
        productName: "Classic Jeans",
        productImageUrl: "https://example.com/products/jeans.jpg"
      },
      sentiment: "positive",
      isPublic: true
    }
  ],
  followersEngine: {
    metrics: {
      totalFollowers: 45680,
      newFollowersToday: 127,
      followerGrowthRate: 5.2,
      averageEngagementRate: 7.8,
      topInterests: ["Fashion", "Lifestyle", "Beauty", "Travel", "Food"],
      followersBySource: {
        organic: 25600,
        paid: 12400,
        referral: 5680,
        influencer: 1800,
        event: 200
      },
      churnRate: 2.1
    },
    followers: [
      {
        followerId: "follower_001",
        name: "Emma Wilson",
        username: "emmaw_style",
        profilePic: "https://example.com/profiles/emma.jpg",
        followedSince: new Date("2024-01-15T09:30:00Z"),
        engagementLevel: "high",
        followerSource: "organic",
        status: "active",
        demographics: {
          ageGroup: "25-34",
          gender: "Female",
          country: "United States",
          city: "New York",
          language: "English",
          timezone: "America/New_York"
        },
        interests: ["Fashion", "Beauty", "Travel"],
        engagement: {
          totalLikes: 45,
          totalComments: 12,
          totalShares: 8,
          lastInteraction: new Date("2024-04-15T14:20:00Z"),
          averageSessionDuration: 320
        },
        lifetimeValue: 450.25,
        totalPurchases: 6,
        lastPurchaseDate: new Date("2024-04-10T16:45:00Z"),
        isInfluencer: false,
        socialHandles: {
          instagram: "@emmaw_style",
          twitter: "@emmawilson"
        }
      }
    ],
    growthTrend: [
      { date: "2024-04-01", followers: 45200, unfollows: 125, netGrowth: 480 },
      { date: "2024-04-02", followers: 45350, unfollows: 98, netGrowth: 150 },
      { date: "2024-04-03", followers: 45480, unfollows: 87, netGrowth: 130 },
      { date: "2024-04-04", followers: 45680, unfollows: 76, netGrowth: 200 }
    ]
  },
  unifiedInbox: {
    metrics: {
      totalMessages: 1250,
      unreadMessages: 47,
      averageResponseTime: 2.5, // hours
      responseRate: 92.5,
      satisfactionScore: 4.6,
      messagesByChannel: {
        instagram: 450,
        facebook: 320,
        email: 280,
        twitter: 120,
        sms: 80,
        whatsapp: 0,
        telegram: 0,
        website: 0
      },
      messagesByType: {
        inquiry: 520,
        support: 380,
        compliment: 180,
        complaint: 120,
        order: 45,
        collaboration: 5
      }
    },
    messages: [
      {
        messageId: "msg_001",
        threadId: "thread_001",
        sender: {
          id: "user_001",
          name: "Sarah Johnson",
          username: "sarahj_beauty",
          avatarUrl: "https://example.com/avatars/sarah.jpg",
          channel: "instagram",
          isVerified: true,
          followerCount: 15600
        },
        recipientId: "brand_001",
        messageBody: "Hi! I love your latest collection! Do you have the blue dress in size medium?",
        status: "unread",
        priority: "normal",
        messageType: "inquiry",
        receivedAt: new Date("2024-04-15T16:30:00Z"),
        attachments: [],
        mentions: [],
        hashtags: [],
        sentiment: "positive",
        language: "English",
        isAutomatedResponse: false,
        tags: ["product-inquiry", "dress"]
      },
      {
        messageId: "msg_002",
        threadId: "thread_002",
        sender: {
          id: "user_002",
          name: "Mike Chen",
          username: "mike_chen",
          channel: "email",
          isVerified: false
        },
        recipientId: "brand_001",
        messageBody: "I received my order but one item was missing. Can you help me with this?",
        status: "read",
        priority: "high",
        messageType: "complaint",
        receivedAt: new Date("2024-04-15T14:20:00Z"),
        readAt: new Date("2024-04-15T15:10:00Z"),
        attachments: [
          {
            type: "image",
            url: "https://example.com/attachments/order-photo.jpg",
            filename: "order-photo.jpg",
            size: 245680
          }
        ],
        mentions: [],
        hashtags: [],
        sentiment: "negative",
        language: "English",
        isAutomatedResponse: false,
        assignedTo: "support_agent_001",
        tags: ["missing-item", "order-issue"]
      }
    ],
    filters: {
      channels: ["instagram", "facebook", "email"],
      statuses: ["unread", "read"],
      priorities: ["normal", "high"],
      types: ["inquiry", "support"],
      dateRange: {
        start: new Date("2024-04-01T00:00:00Z"),
        end: new Date("2024-04-15T23:59:59Z")
      }
    }
  },
  ugcGallery: {
    metrics: {
      totalSubmissions: 2850,
      pendingApproval: 125,
      approvedContent: 2100,
      rejectedContent: 625,
      approvalRate: 77.2,
      averageQualityScore: 8.4,
      totalReach: 485000,
      totalEngagement: 125600,
      conversionRate: 5.8,
      revenueGenerated: 95600
    },
    items: [
      {
        ugcId: "ugc_001",
        user: {
          id: "user_001",
          name: "Jessica Martinez",
          username: "jessicam_style",
          avatarUrl: "https://example.com/avatars/jessica.jpg",
          followerCount: 8900,
          isInfluencer: false,
          verificationLevel: "email"
        },
        ugcType: "photo",
        source: "instagram",
        mediaUrl: "https://example.com/ugc/jessica-outfit.jpg",
        thumbnailUrl: "https://example.com/ugc/thumbnails/jessica-outfit.jpg",
        caption: "Obsessed with this new dress from @brandname! Perfect for date night 💕",
        originalCaption: "Obsessed with this new dress from @brandname! Perfect for date night 💕 #OOTD #Fashion",
        hashtags: ["#OOTD", "#Fashion", "#DateNight"],
        mentions: ["@brandname"],
        tags: ["outfit", "dress", "fashion"],
        productTags: [
          {
            productId: "prod_001",
            productName: "Silk Mini Dress",
            productSku: "SMD-001",
            coordinates: { x: 0.3, y: 0.6 }
          }
        ],
        approvalStatus: "approved",
        submittedAt: new Date("2024-04-12T18:45:00Z"),
        approvedAt: new Date("2024-04-13T09:20:00Z"),
        approvedBy: "moderator_001",
        engagement: {
          likes: 245,
          comments: 18,
          shares: 12,
          saves: 34,
          views: 3200,
          clickThroughRate: 4.2
        },
        sentiment: "positive",
        qualityScore: 9.2,
        isRightsCleared: true,
        rightsExpiryDate: new Date("2025-04-12T18:45:00Z"),
        originalPostUrl: "https://instagram.com/p/example123",
        downloadUrl: "https://example.com/ugc/downloads/jessica-outfit-hq.jpg",
        usageRights: ["social_media", "website", "advertising"],
        location: {
          city: "Los Angeles",
          country: "United States",
          coordinates: { lat: 34.0522, lng: -118.2437 }
        }
      }
    ],
    campaigns: [
      {
        campaignId: "campaign_001",
        name: "Summer Vibes 2024",
        hashtag: "#SummerVibes2024",
        startDate: new Date("2024-04-01T00:00:00Z"),
        endDate: new Date("2024-06-30T23:59:59Z"),
        submissionsCount: 450,
        status: "active"
      }
    ],
    moderationQueue: []
  },
  settings: {
    privacy: {
      dataSharing: true,
      profileVisibility: "public",
      allowTagging: true,
      allowMentions: true,
      showOnlineStatus: true,
      allowDirectMessages: true,
      dataRetentionPeriod: "2_years",
      analyticsConsent: true,
      marketingConsent: true,
      thirdPartySharing: false
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true,
      desktop: false,
      frequency: "real_time",
      quietHours: {
        enabled: true,
        startTime: "22:00",
        endTime: "08:00",
        timezone: "America/New_York"
      },
      categories: {
        newFollowers: true,
        mentions: true,
        comments: true,
        likes: false,
        shares: true,
        messages: true,
        ugcSubmissions: true,
        reviews: true,
        orders: true,
        campaigns: true
      }
    },
    integrations: [
      {
        platform: "instagram",
        displayName: "Instagram",
        connected: true,
        lastSync: new Date("2024-04-15T16:00:00Z"),
        status: "active",
        permissions: ["read_profile", "read_media", "read_comments"],
        autoSync: true,
        syncFrequency: "real_time",
        accountId: "17841400027244616",
        accountName: "@brandname"
      },
      {
        platform: "facebook",
        displayName: "Facebook",
        connected: true,
        lastSync: new Date("2024-04-15T15:45:00Z"),
        status: "active",
        permissions: ["pages_read_engagement", "pages_show_list"],
        autoSync: true,
        syncFrequency: "hourly",
        accountId: "123456789",
        accountName: "Brand Name"
      },
      {
        platform: "tiktok",
        displayName: "TikTok",
        connected: false,
        status: "error",
        errorMessage: "Authentication expired",
        permissions: [],
        autoSync: false,
        syncFrequency: "daily"
      }
    ],
    themePreference: "auto",
    language: "en-US",
    timezone: "America/New_York",
    currency: "USD",
    api: {
      apiKey: "sk_live_1234567890abcdef",
      webhookUrl: "https://api.brandname.com/webhooks/social-commerce",
      rateLimits: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      allowedOrigins: ["https://brandname.com", "https://app.brandname.com"],
      enableCORS: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 120,
      passwordLastChanged: new Date("2024-02-15T10:30:00Z"),
      loginNotifications: true,
      suspiciousActivityAlerts: true,
      allowedIPs: [],
      blockedIPs: []
    },
    preferences: {
      autoApproveUGC: false,
      autoRespondMessages: true,
      contentModerationLevel: "moderate",
      analyticsRetention: "2_years",
      exportFormat: "json"
    }
  },
  metadata: {
    lastUpdated: new Date("2024-04-15T16:30:00Z"),
    version: "1.0.0",
    userId: "user_001",
    businessId: "business_001"
  }
};

// UTILITY TYPES FOR FRONTEND COMPONENTS
export type SocialCommerceSection = keyof Omit<SocialCommerceModule, 'metadata'>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}