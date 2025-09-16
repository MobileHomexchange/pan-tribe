export interface Post {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: string[];
  saves: string[];
  shares: number;
  externalShares: number;
  comments: Comment[];
  createdAt: any;
  category?: string;
  tags?: string[];
  viewTime?: number; // Total view time in seconds
  replays?: number; // Number of times post was revisited
}

export interface UserInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'comment' | 'share' | 'view' | 'hide' | 'not_interested';
  timestamp: any;
  duration?: number; // For view interactions
}

export interface TribalConnection {
  userId: string;
  connectedUserId: string;
  strength: number; // 0.0 - 1.0, calculated based on interaction frequency
  sharedTribes: string[];
  lastInteraction: any;
}

export interface UserInterests {
  userId: string;
  categories: { [category: string]: number }; // category -> interest score (0-1)
  tags: { [tag: string]: number }; // tag -> interest score (0-1)
  updatedAt: any;
}

export interface FeedPreferences {
  userId: string;
  mode: 'tribal' | 'discovery' | 'chronological';
  customWeights?: {
    tribalTies: number;
    engagement: number;
    interest: number;
    recency: number;
    externalShares: number;
    randomBoost: number;
  };
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  scheduledTime: any;
  status: 'scheduled' | 'live' | 'ended';
  createdAt: any;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  date: any;
  location: string;
  createdAt: any;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any;
}