-- ═══════════════════════════════════════════════════════════════════
-- Unkov — User management migration
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. Users profile table ──────────────────────────────────────
-- Extends Supabase's built-in auth.users table with Unkov-specific fields.
-- The id column links to auth.users.id (Supabase manages passwords there).
CREATE TABLE IF NOT EXISTS public.users (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            text UNIQUE NOT NULL,
  name             text,
  company          text,
  role             text NOT NULL DEFAULT 'pilot_customer'
                   CHECK (role IN ('pilot_customer', 'paying_customer', 'admin')),
  avatar_initials  text,
  pilot_start_date timestamptz DEFAULT now(),
  contract_date    timestamptz,
  created_at       timestamptz DEFAULT now()
);

-- ─── 2. Row-level security ───────────────────────────────────────
-- Users can only read/update their own row.
-- Admins can read and update all rows.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles (needed for AdminUpgrade page)
CREATE POLICY "Admins can read all profiles"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any user's role (the upgrade action)
CREATE POLICY "Admins can update roles"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── 3. Auto-create profile on signup ────────────────────────────
-- When a new user signs up via Supabase Auth, automatically insert
-- a row into public.users so the profile always exists.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, avatar_initials, pilot_start_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'pilot_customer'),
    -- Corrected initials logic:
    UPPER(
      LEFT(COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 1) ||
      LEFT(COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 2), ''), 1)
    ),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after every new auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 4. Seed test accounts ───────────────────────────────────────
-- Run AFTER creating the users via Supabase Auth (step 4 of setup guide).
-- Replace the UUIDs with the real IDs from your auth.users table.
--
-- Example (fill in real UUIDs from Supabase Dashboard → Authentication → Users):
--
-- INSERT INTO public.users (id, email, name, company, role, avatar_initials)
-- VALUES
--   ('<uuid-of-pilot-user>',   'pilot@acmecorp.com',  'Sarah Chen',        'Acme Financial Corp', 'pilot_customer',  'SC'),
--   ('<uuid-of-paying-user>',  'admin@acmecorp.com',  'James Park',        'Acme Financial Corp', 'paying_customer', 'JP'),
--   ('<uuid-of-admin-user>',   'mustafa@unkov.com',   'Mustafa Albassam',  'Unkov',               'admin',           'MA')
-- ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name;

-- ─── 5. Helper: upgrade a user to production ─────────────────────
-- Call this from a Supabase Edge Function or directly in SQL:
--   SELECT upgrade_to_production('<user-id>');
CREATE OR REPLACE FUNCTION public.upgrade_to_production(target_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET role = 'paying_customer', contract_date = now()
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Verify ──────────────────────────────────────────────────────
-- Run this after migration to confirm everything looks right:
-- SELECT id, email, role, pilot_start_date, contract_date FROM public.users;
