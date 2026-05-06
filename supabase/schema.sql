-- GoBela Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Last updated: May 2026

-- ─────────────────────────────────────────────────────────
-- 1. PROFILES (one per auth user)
-- ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text,
  district      text,
  household_size int default 3,
  budget_range  text default 'mid',
  cuisine_prefs text[] default '{}',
  dietary_needs text[] default '{}',
  parent_type   text default 'working',
  member_tier   text default 'free',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────
-- 2. CHILD PROFILES (multiple per user)
-- ─────────────────────────────────────────────────────────
create table if not exists public.child_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  birth_date  date,
  gender      text,
  allergies   text[] default '{}',
  interests   text[] default '{}',
  is_active   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- 3. COMMUNITY REVIEWS
-- ─────────────────────────────────────────────────────────
create table if not exists public.community_reviews (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  type          text not null, -- cook | eat | play | learn | shop
  title         text not null,
  body          text,
  rating        int check (rating between 1 and 5),
  kid_reaction  text,         -- loved_it | it_was_ok | not_for_us
  image_url     text,
  location      text,
  tags          text[] default '{}',
  likes         int default 0,
  is_approved   boolean default true,
  posted_at     timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- 4. FAVOURITES
-- ─────────────────────────────────────────────────────────
create table if not exists public.favourites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,  -- recipe | event | activity | restaurant
  item_id     text not null,  -- the recipe id, event id, etc.
  item_title  text,
  created_at  timestamptz default now(),
  unique(user_id, type, item_id)
);

-- ─────────────────────────────────────────────────────────
-- 5. BOOKINGS
-- ─────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete set null,
  child_id        uuid references public.child_profiles(id) on delete set null,
  event_id        text not null,
  event_title     text,
  event_provider  text,
  booking_date    date,
  time_slot       text,
  status          text default 'confirmed', -- confirmed | cancelled | completed
  price_sgd       numeric(8,2),
  booking_url     text,
  notes           text,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- 6. PARTNER APPLICATIONS
-- ─────────────────────────────────────────────────────────
create table if not exists public.partner_applications (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  contact_name    text not null,
  email           text not null,
  phone           text,
  partner_type    text not null,  -- activity | restaurant | supplier | other
  website         text,
  message         text,
  status          text default 'pending',  -- pending | approved | rejected
  submitted_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────

-- Profiles: users can only read/update their own
alter table public.profiles enable row level security;
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);

-- Child profiles: users manage their own children
alter table public.child_profiles enable row level security;
create policy "Users can manage own children" on public.child_profiles for all using (auth.uid() = user_id);

-- Community reviews: approved ones are public; users manage their own
alter table public.community_reviews enable row level security;
create policy "Approved reviews are public"   on public.community_reviews for select using (is_approved = true);
create policy "Users can insert reviews"      on public.community_reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews"  on public.community_reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews"  on public.community_reviews for delete using (auth.uid() = user_id);

-- Favourites: private to each user
alter table public.favourites enable row level security;
create policy "Users can manage own favourites" on public.favourites for all using (auth.uid() = user_id);

-- Bookings: private to each user
alter table public.bookings enable row level security;
create policy "Users can manage own bookings" on public.bookings for all using (auth.uid() = user_id);

-- Partner applications: insert only (no auth required so website form works)
alter table public.partner_applications enable row level security;
create policy "Anyone can submit partner application" on public.partner_applications for insert with check (true);

-- ─────────────────────────────────────────────────────────
-- DONE — verify with:
-- select table_name from information_schema.tables where table_schema = 'public';
-- ─────────────────────────────────────────────────────────
