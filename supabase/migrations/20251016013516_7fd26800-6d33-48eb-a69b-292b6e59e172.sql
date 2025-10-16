-- Create social_commerce_accounts table
CREATE TABLE IF NOT EXISTS public.social_commerce_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL,
  description TEXT,
  assigned_user_id TEXT NOT NULL,
  created_by_admin_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.social_commerce_accounts ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all social commerce accounts"
  ON public.social_commerce_accounts
  FOR ALL
  TO authenticated
  USING (has_role((auth.jwt() ->> 'sub'::text), 'admin'::app_role))
  WITH CHECK (has_role((auth.jwt() ->> 'sub'::text), 'admin'::app_role));

-- Assigned users can view their own accounts
CREATE POLICY "Users can view their assigned accounts"
  ON public.social_commerce_accounts
  FOR SELECT
  TO authenticated
  USING (assigned_user_id = (auth.jwt() ->> 'sub'::text));

-- Assigned users can update their own accounts
CREATE POLICY "Users can update their assigned accounts"
  ON public.social_commerce_accounts
  FOR UPDATE
  TO authenticated
  USING (assigned_user_id = (auth.jwt() ->> 'sub'::text))
  WITH CHECK (assigned_user_id = (auth.jwt() ->> 'sub'::text));

-- Create trigger for updated_at
CREATE TRIGGER update_social_commerce_accounts_updated_at
  BEFORE UPDATE ON public.social_commerce_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_social_commerce_accounts_assigned_user 
  ON public.social_commerce_accounts(assigned_user_id);