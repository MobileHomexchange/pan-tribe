export interface SegmentData {
  [segment: string]: { clicks: number; impressions: number };
}

export interface AdData {
  id: string;
  content: string;
  isActive: boolean;
  priority: number; // 1–5
  clicks: number;
  impressions: number;
  uniqueClicks: Record<string, any>;
  segments?: SegmentData;
  dailyClicks?: Record<string, number>;
  dailyImpressions?: Record<string, number>;
  isPremium?: boolean;
}