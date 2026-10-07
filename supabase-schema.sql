-- ====================================================================
-- ROOMSYNC SUPABASE SCHEMA MIGRATION
-- Run this script in your Supabase SQL Editor (supabase.com -> SQL Editor)
-- ====================================================================

-- 1. PROFILES TABLE (User profiles & preferences)
create table if not exists public.profiles (
  id text primary key,
  email text unique not null,
  full_name text not null,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. LISTINGS TABLE (Verified housing flats & rooms)
create table if not exists public.listings (
  id text primary key,
  owner_id text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PACTS TABLE (Digitally signed roommate agreements)
create table if not exists public.pacts (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EXPENSES TABLE (Shared flatmate bills & splits)
create table if not exists public.expenses (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. REVIEWS TABLE (Landlord & locality student reviews)
create table if not exists public.reviews (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. MESSAGES TABLE (Flatmate candidate chat messages)
create table if not exists public.messages (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.pacts enable row level security;
alter table public.expenses enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

create policy "Allow all on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all on listings" on public.listings for all using (true) with check (true);
create policy "Allow all on pacts" on public.pacts for all using (true) with check (true);
create policy "Allow all on expenses" on public.expenses for all using (true) with check (true);
create policy "Allow all on reviews" on public.reviews for all using (true) with check (true);
create policy "Allow all on messages" on public.messages for all using (true) with check (true);
