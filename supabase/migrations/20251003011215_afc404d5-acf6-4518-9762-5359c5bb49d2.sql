-- Fix calculate_visibility_score function to have immutable search_path
-- This addresses the security linter warning about mutable search_path

DROP FUNCTION IF EXISTS public.calculate_visibility_score(uuid);

CREATE OR REPLACE FUNCTION public.calculate_visibility_score(job_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;