export type BannerType = 'announcement' | 'ad' | 'mood' | 'event' | 'custom';

export interface HeaderBanner {
  id: string;
  type: BannerType;
  title: string;
  message: string;
  bgColor?: string;
  textColor?: string;
  icon?: string;
  link?: string;
  linkText?: string;
  imageUrl?: string;
  isActive: boolean;
  priority: number;
  startDate: Date;
  endDate?: Date;
  isDismissible: boolean;
  autoRotate: boolean;
  rotationInterval?: number;
  createdBy: string;
  createdAt: Date;
  clicks?: number;
  views?: number;
  dismissals?: number;
}
