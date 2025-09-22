-- Create job_categories enum
CREATE TYPE job_category AS ENUM (
  'technology',
  'healthcare',
  'finance',
  'education',
  'marketing',
  'sales',
  'consulting',
  'manufacturing',
  'retail',
  'hospitality',
  'government',
  'nonprofit',
  'creative',
  'other'
);

-- Create job_status enum  
CREATE TYPE job_status AS ENUM (
  'active',
  'flagged', 
  'blocked',
  'expired'
);

-- Create employer_profiles table
CREATE TABLE public.employer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  company_description TEXT,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  reputation_score DECIMAL(3,2) DEFAULT 5.0,
  total_jobs_posted INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_listings table
CREATE TABLE public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  category job_category NOT NULL,
  skills TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  remote_option BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  status job_status DEFAULT 'active',
  visibility_score DECIMAL(5,2) DEFAULT 0,
  trust_score DECIMAL(5,2) DEFAULT 0,
  freshness_score DECIMAL(5,2) DEFAULT 0,
  relevance_score DECIMAL(5,2) DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(5,2) DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  flagged_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_flags table
CREATE TABLE public.job_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  flagger_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_flags ENABLE ROW LEVEL SECURITY;

-- Employer profiles policies
CREATE POLICY "Users can view all employer profiles" 
ON public.employer_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own employer profile" 
ON public.employer_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile" 
ON public.employer_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Job listings policies
CREATE POLICY "Users can view active job listings" 
ON public.job_listings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Employers can create job listings" 
ON public.job_listings 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.employer_profiles 
  WHERE id = employer_id AND user_id = auth.uid()
));

CREATE POLICY "Employers can update their own job listings" 
ON public.job_listings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.employer_profiles 
  WHERE id = employer_id AND user_id = auth.uid()
));

-- Job applications policies
CREATE POLICY "Users can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (applicant_id = auth.uid());

CREATE POLICY "Employers can view applications for their jobs" 
ON public.job_applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.job_listings jl
  JOIN public.employer_profiles ep ON jl.employer_id = ep.id
  WHERE jl.id = job_id AND ep.user_id = auth.uid()
));

CREATE POLICY "Users can create job applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (applicant_id = auth.uid());

-- Job flags policies
CREATE POLICY "Users can create job flags" 
ON public.job_flags 
FOR INSERT 
WITH CHECK (flagger_id = auth.uid());

CREATE POLICY "Users can view their own flags" 
ON public.job_flags 
FOR SELECT 
USING (flagger_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_job_listings_category ON public.job_listings(category);
CREATE INDEX idx_job_listings_location ON public.job_listings(location);
CREATE INDEX idx_job_listings_visibility_score ON public.job_listings(visibility_score DESC);
CREATE INDEX idx_job_listings_created_at ON public.job_listings(created_at DESC);
CREATE INDEX idx_job_listings_status ON public.job_listings(status);
CREATE INDEX idx_employer_profiles_verified ON public.employer_profiles(verified);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate visibility score
CREATE OR REPLACE FUNCTION public.calculate_visibility_score(job_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  trust_weight DECIMAL := 0.30;
  freshness_weight DECIMAL := 0.20;
  relevance_weight DECIMAL := 0.25;
  engagement_weight DECIMAL := 0.15;
  quality_weight DECIMAL := 0.10;
  
  trust_val DECIMAL := 0;
  freshness_val DECIMAL := 0;
  relevance_val DECIMAL := 0;
  engagement_val DECIMAL := 0;
  quality_val DECIMAL := 0;
  
  job_record RECORD;
  employer_record RECORD;
  hours_old DECIMAL;
  total_engagement INTEGER;
BEGIN
  -- Get job data
  SELECT * INTO job_record FROM public.job_listings WHERE id = job_id;
  SELECT * INTO employer_record FROM public.employer_profiles WHERE id = job_record.employer_id;
  
  -- Calculate trust score (0-10)
  trust_val := employer_record.reputation_score;
  IF employer_record.verified THEN
    trust_val := trust_val + 2;
  END IF;
  trust_val := LEAST(trust_val, 10);
  
  -- Calculate freshness score (0-10, higher for newer posts)
  hours_old := EXTRACT(EPOCH FROM (now() - job_record.created_at)) / 3600;
  freshness_val := GREATEST(10 - (hours_old / 24), 1); -- Decay over 24 hours
  
  -- Calculate relevance score (0-10, based on completeness)
  relevance_val := 5; -- Base score
  IF job_record.salary_min IS NOT NULL THEN relevance_val := relevance_val + 1; END IF;
  IF array_length(job_record.skills, 1) > 0 THEN relevance_val := relevance_val + 1; END IF;
  IF length(job_record.job_description) > 200 THEN relevance_val := relevance_val + 1; END IF;
  IF job_record.remote_option THEN relevance_val := relevance_val + 0.5; END IF;
  relevance_val := LEAST(relevance_val, 10);
  
  -- Calculate engagement score (0-10)
  total_engagement := job_record.clicks + job_record.saves + job_record.shares + (job_record.applications * 3);
  engagement_val := LEAST(total_engagement / 10.0, 10);
  
  -- Calculate quality score (0-10)
  quality_val := 8; -- Base score
  IF job_record.flagged_count > 0 THEN 
    quality_val := quality_val - (job_record.flagged_count * 2);
  END IF;
  quality_val := GREATEST(quality_val, 1);
  
  -- Calculate weighted final score
  RETURN (trust_val * trust_weight) + 
         (freshness_val * freshness_weight) + 
         (relevance_val * relevance_weight) + 
         (engagement_val * engagement_weight) + 
         (quality_val * quality_weight);
END;
$$ LANGUAGE plpgsql;