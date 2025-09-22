export type JobCategory = 
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'marketing'
  | 'sales'
  | 'consulting'
  | 'manufacturing'
  | 'retail'
  | 'hospitality'
  | 'government'
  | 'nonprofit'
  | 'creative'
  | 'other';

export type JobStatus = 'active' | 'flagged' | 'blocked' | 'expired';

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_description?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  verified: boolean;
  verification_date?: string;
  reputation_score: number;
  total_jobs_posted: number;
  total_applications: number;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  employer_id: string;
  job_title: string;
  job_description: string;
  category: JobCategory;
  skills: string[];
  location: string;
  salary_min?: number;
  salary_max?: number;
  remote_option: boolean;
  featured: boolean;
  featured_until?: string;
  status: JobStatus;
  visibility_score: number;
  trust_score: number;
  freshness_score: number;
  relevance_score: number;
  engagement_score: number;
  quality_score: number;
  clicks: number;
  saves: number;
  shares: number;
  applications: number;
  flagged_count: number;
  created_at: string;
  updated_at: string;
  employer_profile?: EmployerProfile;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  applied_at: string;
}

export interface JobFlag {
  id: string;
  job_id: string;
  flagger_id: string;
  reason: string;
  details?: string;
  resolved: boolean;
  created_at: string;
}

export interface JobSearchFilters {
  category?: JobCategory;
  location?: string;
  remote_only?: boolean;
  salary_min?: number;
  salary_max?: number;
  skills?: string[];
  search_query?: string;
}

export interface VisibilityScoreBreakdown {
  trust_score: number;
  freshness_score: number;
  relevance_score: number;
  engagement_score: number;
  quality_score: number;
  total_score: number;
  boost_factors: string[];
}