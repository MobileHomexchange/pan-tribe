-- Fix RLS policies to explicitly cast auth.uid() to UUID for type safety
-- This ensures policies work correctly with UUID user_id columns

-- ============================================
-- TABLE: employer_profiles
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own employer profile" ON public.employer_profiles;
DROP POLICY IF EXISTS "Users can update their own employer profile" ON public.employer_profiles;
DROP POLICY IF EXISTS "Users can view all employer profiles" ON public.employer_profiles;

-- Recreate policies with explicit UUID casting
CREATE POLICY "Users can create their own employer profile"
ON public.employer_profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own employer profile"
ON public.employer_profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can view all employer profiles"
ON public.employer_profiles
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- TABLE: job_applications
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON public.job_applications;

-- Recreate policies with explicit UUID casting
CREATE POLICY "Users can create job applications"
ON public.job_applications
FOR INSERT
TO authenticated
WITH CHECK (applicant_id = auth.uid()::uuid);

CREATE POLICY "Users can view their own applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (applicant_id = auth.uid()::uuid);

CREATE POLICY "Employers can view applications for their jobs"
ON public.job_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.job_listings jl
    JOIN public.employer_profiles ep ON jl.employer_id = ep.id
    WHERE jl.id = job_applications.job_id
      AND ep.user_id = auth.uid()::uuid
  )
);

-- ============================================
-- TABLE: job_flags
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create job flags" ON public.job_flags;
DROP POLICY IF EXISTS "Users can view their own flags" ON public.job_flags;

-- Recreate policies with explicit UUID casting
CREATE POLICY "Users can create job flags"
ON public.job_flags
FOR INSERT
TO authenticated
WITH CHECK (flagger_id = auth.uid()::uuid);

CREATE POLICY "Users can view their own flags"
ON public.job_flags
FOR SELECT
TO authenticated
USING (flagger_id = auth.uid()::uuid);

-- ============================================
-- TABLE: job_listings
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Employers can create job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Employers can update their own job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can view active job listings" ON public.job_listings;

-- Recreate policies with explicit UUID casting
CREATE POLICY "Employers can create job listings"
ON public.job_listings
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.employer_profiles
    WHERE employer_profiles.id = job_listings.employer_id
      AND employer_profiles.user_id = auth.uid()::uuid
  )
);

CREATE POLICY "Employers can update their own job listings"
ON public.job_listings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.employer_profiles
    WHERE employer_profiles.id = job_listings.employer_id
      AND employer_profiles.user_id = auth.uid()::uuid
  )
);

CREATE POLICY "Users can view active job listings"
ON public.job_listings
FOR SELECT
TO authenticated
USING (status = 'active'::job_status);

-- ============================================
-- SUMMARY
-- ============================================
-- Updated RLS policies for 4 tables:
-- 1. employer_profiles: 3 policies (CREATE, UPDATE, SELECT)
-- 2. job_applications: 3 policies (CREATE, SELECT x2)
-- 3. job_flags: 2 policies (CREATE, SELECT)
-- 4. job_listings: 3 policies (CREATE, UPDATE, SELECT)
--
-- All policies now explicitly cast auth.uid() to UUID
-- user_roles table not modified (uses text type correctly)
--
-- Total: 11 policies updated