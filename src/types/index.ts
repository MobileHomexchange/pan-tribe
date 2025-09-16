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
  comments: Comment[];
  createdAt: any;
  category?: string;
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