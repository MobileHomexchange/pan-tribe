// Blog & Backlink Submission System Types
export type BlogCategory = 'Cultural Story' | 'Business Feature' | 'Guide' | 'News' | 'Educational';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export type ValidationReasonCode = 
  | 'spam_keywords'
  | 'unsafe_links'
  | 'short_content'
  | 'clickbait_headline'
  | 'adult_content'
  | 'plagiarism_detected'
  | 'broken_links'
  | 'misleading_content';

export interface BlogSubmissionChecklist {
  original_content: boolean;
  family_safe: boolean;
  accurate: boolean;
  links_safe: boolean;
  headline_not_clickbait: boolean;
  social_platform_compliant: boolean;
  community_value: boolean;
}

export interface BlogSubmission {
  id: string;
  title: string;
  content: string;
  backlinks: string[];
  author: string;
  authorId: string;
  category: BlogCategory;
  featured_image?: string;
  timestamp: string; // ISO8601
  checklist: BlogSubmissionChecklist;
  platform_safety_score: number; // 0-100
  moderation: {
    status: ModerationStatus;
    reason_codes: ValidationReasonCode[];
    moderator_id?: string;
    moderation_timestamp?: string;
    admin_notes?: string;
  };
  user_reputation_score: number; // 0-100
  community_reports: CommunityReport[];
  badges: string[];
}

export interface CommunityReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  report_type: 'spam' | 'scam' | 'misleading' | 'offensive' | 'copyright';
  reason: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface ValidationResult {
  score: number;
  passed: boolean;
  flags: ValidationReasonCode[];
  suggestions: string[];
  safe_for_platforms: string[];
}

export interface ModerationStats {
  total_submissions: number;
  pending_review: number;
  approved_today: number;
  rejected_today: number;
  auto_approved: number;
  flagged_content: number;
  avg_review_time: number; // hours
}

export interface UserReputation {
  user_id: string;
  username: string;
  reputation_score: number;
  total_submissions: number;
  approved_submissions: number;
  rejected_submissions: number;
  community_reports_against: number;
  badges: string[];
  restrictions: {
    daily_limit: number;
    requires_manual_review: boolean;
    banned_until?: string;
  };
}

// Mock data for development
export const mockBlogSubmissions: BlogSubmission[] = [
  {
    id: "blog_001",
    title: "Traditional Eid Celebrations in the Diaspora",
    content: "Celebrating Eid while living abroad brings unique challenges and opportunities. This comprehensive guide explores how diaspora communities maintain their cultural traditions while adapting to new environments. From finding halal ingredients to organizing community events, we share practical tips and heartwarming stories from families across different countries.",
    backlinks: [
      "https://islamic-society.org/eid-traditions",
      "https://diaspora-cultures.edu/religious-celebrations"
    ],
    author: "Fatima Al-Zahra",
    authorId: "user_123",
    category: "Cultural Story",
    featured_image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800",
    timestamp: "2024-09-21T10:30:00Z",
    checklist: {
      original_content: true,
      family_safe: true,
      accurate: true,
      links_safe: true,
      headline_not_clickbait: true,
      social_platform_compliant: true,
      community_value: true
    },
    platform_safety_score: 95,
    moderation: {
      status: "approved",
      reason_codes: [],
      moderator_id: "mod_001",
      moderation_timestamp: "2024-09-21T11:15:00Z"
    },
    user_reputation_score: 88,
    community_reports: [],
    badges: ["Safe for Social Sharing", "Community Favorite", "Cultural Story Expert"]
  },
  {
    id: "blog_002",
    title: "Starting a Business in Your New Country: A Practical Guide",
    content: "Entrepreneurship in the diaspora requires understanding both cultural nuances and legal requirements. This guide covers registration processes, finding funding, building networks, and overcoming common challenges faced by immigrant entrepreneurs.",
    backlinks: [
      "https://small-business-administration.gov/startup-guide",
      "https://entrepreneur-network.org/immigrant-resources"
    ],
    author: "Marcus Okonkwo",
    authorId: "user_456",
    category: "Business Feature",
    featured_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    timestamp: "2024-09-21T09:15:00Z",
    checklist: {
      original_content: true,
      family_safe: true,
      accurate: true,
      links_safe: true,
      headline_not_clickbait: true,
      social_platform_compliant: true,
      community_value: true
    },
    platform_safety_score: 87,
    moderation: {
      status: "pending",
      reason_codes: ["short_content"],
      admin_notes: "Content could be expanded with more specific examples"
    },
    user_reputation_score: 76,
    community_reports: [],
    badges: ["Business Expert"]
  },
  {
    id: "blog_003",
    title: "MAKE MONEY FAST - Work From Home Opportunity!!!",
    content: "Make $5000 per week working from home! No experience needed. Just send $99 startup fee to begin your amazing journey to financial freedom. Contact us now!",
    backlinks: [
      "https://suspicious-website.net/signup",
      "https://fake-testimonials.com/reviews"
    ],
    author: "Quick Money",
    authorId: "user_spam_001",
    category: "Business Feature",
    timestamp: "2024-09-21T08:45:00Z",
    checklist: {
      original_content: false,
      family_safe: true,
      accurate: false,
      links_safe: false,
      headline_not_clickbait: false,
      social_platform_compliant: false,
      community_value: false
    },
    platform_safety_score: 15,
    moderation: {
      status: "rejected",
      reason_codes: ["spam_keywords", "unsafe_links", "clickbait_headline", "misleading_content"],
      moderator_id: "mod_002",
      moderation_timestamp: "2024-09-21T08:50:00Z",
      admin_notes: "Clear scam attempt. User flagged for review."
    },
    user_reputation_score: 12,
    community_reports: [
      {
        id: "report_001",
        reporter_id: "user_789",
        reporter_name: "Sarah Johnson",
        report_type: "scam",
        reason: "This is clearly a scam asking for money upfront",
        timestamp: "2024-09-21T08:47:00Z",
        status: "reviewed"
      }
    ],
    badges: []
  }
];

export const mockModerationStats: ModerationStats = {
  total_submissions: 1247,
  pending_review: 23,
  approved_today: 8,
  rejected_today: 3,
  auto_approved: 45,
  flagged_content: 12,
  avg_review_time: 2.5
};

export const mockUserReputations: UserReputation[] = [
  {
    user_id: "user_123",
    username: "fatima_alzahra",
    reputation_score: 88,
    total_submissions: 24,
    approved_submissions: 22,
    rejected_submissions: 2,
    community_reports_against: 0,
    badges: ["Trusted Author", "Cultural Expert", "Community Leader"],
    restrictions: {
      daily_limit: 5,
      requires_manual_review: false
    }
  },
  {
    user_id: "user_spam_001",
    username: "quick_money",
    reputation_score: 12,
    total_submissions: 15,
    approved_submissions: 1,
    rejected_submissions: 14,
    community_reports_against: 8,
    badges: [],
    restrictions: {
      daily_limit: 1,
      requires_manual_review: true,
      banned_until: "2024-10-21T00:00:00Z"
    }
  }
];