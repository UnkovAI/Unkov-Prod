-- ─────────────────────────────────────────────────────────────────
-- Unkov — Client Sign-Up Flow
-- Migration: 002_client_signup.sql
--
-- Run in: Supabase dashboard → SQL Editor → New query → Run
--
-- What this creates:
--   1. public.users  — linked to auth.users (one row per client)
--   2. handle_new_user  — Postgres trigger function
--   3. on_auth_user_created — fires on every new auth.users insert
--   4. Row-level security — users see only their own profile
-- ─────────────────────────────────────────────────────────────────


-- ── 1. Create public.users ────────────────────────────────────
-- This table stores client-facing data (name, company, role, etc.)
-- and is linked 1:1 to auth.users via the same UUID primary key.

create table if not exists public.users (
  id               uuid        primary key references auth.users(id) on delete cascade,
  email            text        not null,
  name             text,
  company          text,
  role             text        not null default 'pilot_customer'
                               check (role in ('pilot_customer', 'paying_customer', 'admin')),
  avatar_initials  text,
  pilot_start_date timestamptz,
  contract_date    timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.users;
create trigger profiles_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();


-- ── 2. Trigger function: handle_new_user ────────────────────────
-- Fires whenever a new row is inserted into auth.users.
-- Reads name + company from the user's raw_user_meta_data if provided
-- (set via the `options.data` field in supabase.auth.signUp).

create or replace function public.handle_new_user()
returns trigger as $$
declare
  _name    text;
  _company text;
  _initials text;
begin
  -- Pull optional metadata passed at sign-up time
  _name    := coalesce(new.raw_user_meta_data->>'name',    null);
  _company := coalesce(new.raw_user_meta_data->>'company', null);

  -- Derive initials from name (e.g. "Sarah Chen" → "SC")
  if _name is not null then
    select string_agg(upper(left(word, 1)), '')
    into _initials
    from regexp_split_to_table(_name, '\s+') as word
    limit 2;
  end if;

  insert into public.users (id, email, name, company, role, avatar_initials)
  values (
    new.id,
    new.email,
    _name,
    _company,
    'pilot_customer',   -- all self-sign-up clients start as pilot_customer
    _initials
  )
  on conflict (id) do nothing;  -- idempotent — safe to run multiple times

  return new;
end;
$$ language plpgsql security definer;


-- ── 3. Attach trigger to auth.users ─────────────────────────────
-- Runs AFTER INSERT so new.id is available.

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 4. Row-level security ────────────────────────────────────────
-- Users can read and update their own profile only.
-- Admins (role = 'admin') can read all profiles.

alter table public.users enable row level security;

-- Users see their own row
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own row (name, company — not role)
drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
drop policy if exists "Admins can view all profiles" on public.users;
create policy "Admins can view all profiles"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );


-- ── 5. Helper: upgrade a client to production ───────────────────
-- Call from SQL editor or admin console:
--   SELECT upgrade_to_production('<client-uuid>');

create or replace function public.upgrade_to_production(client_id uuid)
returns void as $$
begin
  update public.users
  set role = 'paying_customer', contract_date = now()
  where id = client_id;
end;
$$ language plpgsql security definer;


-- ── 6. Backfill existing auth users (run once if needed) ────────
-- If you already have users in auth.users with no profile row,
-- this inserts placeholder users for them.

insert into public.users (id, email, role)
select id, email, 'pilot_customer'
from auth.users
where id not in (select id from public.users)
on conflict (id) do nothing;


-- ─────────────────────────────────────────────────────────────────
-- Verification queries (run these to confirm setup)
-- ─────────────────────────────────────────────────────────────────

-- Check users table exists and has correct columns
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'users' ORDER BY ordinal_position;

-- Check trigger is attached
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE trigger_name = 'on_auth_user_created';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- ─────────────────────────────────────────────────────────────────
-- NOTE: If your existing code references public.users (not profiles),
-- you can either:
--   (a) Rename: ALTER TABLE public.users RENAME TO users;
--   (b) Create a view: CREATE VIEW public.users AS SELECT * FROM public.users;
-- The existing AuthContext reads from "users" — update the table
-- name in supabase.ts DbUser interface if you rename.
-- ─────────────────────────────────────────────────────────────────
