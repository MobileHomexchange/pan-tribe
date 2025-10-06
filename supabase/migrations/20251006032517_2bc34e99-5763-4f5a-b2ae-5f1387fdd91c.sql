-- Drop unused job listing tables and all dependencies
-- These tables were created for a job board feature but the app uses Firebase exclusively

-- Drop tables in order (dependencies first)
DROP TABLE IF EXISTS public.job_flags CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.job_listings CASCADE;
DROP TABLE IF EXISTS public.employer_profiles CASCADE;

-- Drop the enum types that were only used by job tables
DROP TYPE IF EXISTS public.job_status CASCADE;
DROP TYPE IF EXISTS public.job_category CASCADE;

-- user_roles table is preserved (used for admin RBAC)
-- has_role() function is preserved (used for authorization)
-- app_role enum type is preserved (used by user_roles)