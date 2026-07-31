-- =============================================================================
-- TradeX — User Profiles Migration
-- File: supabase/migrations/20260731_create_user_profiles.sql
--
-- PURPOSE:
--   Creates a `public.profiles` table that extends Supabase's managed
--   `auth.users` table. This is the correct pattern for Supabase — we do NOT
--   replace auth.users with a custom table. Instead we keep a public profile
--   for each user, synced automatically via a trigger.
--
--   Compatible with both email/password AND Google OAuth sign-ins.
--
-- HOW TO RUN:
--   Paste this file into the Supabase Dashboard → SQL Editor → Run
-- =============================================================================

-- 1. Create the profiles table
create table if not exists public.profiles (
  id            uuid        not null references auth.users(id) on delete cascade primary key,
  full_name     text,
  email         text        unique,
  avatar_url    text,
  provider      text        default 'email',  -- 'email' | 'google'
  created_at    timestamptz not null default now(),
  last_sign_in_at timestamptz
);

comment on table public.profiles is 'Public profile data for each authenticated user. Synced from auth.users via trigger.';

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS Policies

-- Users can view their own profile only
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

-- Users can update their own profile only
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- 4. Index on email for fast lookups
create index if not exists profiles_email_idx on public.profiles (email);

-- 5. Trigger function: auto-create a profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  _provider text;
  _full_name text;
  _avatar_url text;
  _email text;
begin
  -- Determine provider (Google OAuth vs email)
  _provider := coalesce(
    new.raw_app_meta_data->>'provider',
    'email'
  );

  -- Extract full name from Google user_metadata or raw_user_meta_data
  _full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  -- Extract avatar URL (Google provides this)
  _avatar_url := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  _email := new.email;

  insert into public.profiles (id, full_name, email, avatar_url, provider, created_at, last_sign_in_at)
  values (
    new.id,
    _full_name,
    _email,
    _avatar_url,
    _provider,
    now(),
    now()
  )
  on conflict (id) do update
    set
      full_name     = excluded.full_name,
      email         = excluded.email,
      avatar_url    = excluded.avatar_url,
      last_sign_in_at = now();

  return new;
end;
$$;

-- 6. Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Trigger to update last_sign_in_at on sign-in
create or replace function public.handle_user_sign_in()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles
  set last_sign_in_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of last_sign_in_at on auth.users
  for each row execute procedure public.handle_user_sign_in();

-- 8. Grant access to authenticated role
grant select, update on public.profiles to authenticated;

-- 9. Realtime (optional — enable if you want live profile updates)
-- alter publication supabase_realtime add table public.profiles;
