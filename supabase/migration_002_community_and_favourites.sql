-- GoBela Migration 002 — Community, Favourites fix, Bookings
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Last updated: May 2026

-- ─────────────────────────────────────────────────────────
-- 1. GOBELA_REVIEWS (matches GoBelaCommunityService)
-- ─────────────────────────────────────────────────────────
create table if not exists public.gobela_reviews (
  id            text primary key default gen_random_uuid()::text,
  profile_id    uuid references public.profiles(id) on delete set null,
  type          text not null,       -- cook | eat | play | learn | shop
  is_hidden     boolean default false,
  posted_at     timestamptz default now(),

  -- Cook fields
  dish_name     text,
  star_rating   int,
  kid_reaction  text,
  time_taken    text,
  difficulty    text,
  supplier_used text,
  tip           text,
  tags          text[] default '{}',
  parent_label  text,
  parent_initials text,

  -- Eat fields
  place_name    text,
  kid_friendly  text,
  seating       text[] default '{}',
  what_to_order text[] default '{}',
  wait_time     text,
  best_for_age  text[] default '{}',

  -- Play fields
  activity_name text,
  age_group     text,
  skills_developed text[] default '{}',
  enjoyment_rating int,
  value_rating  text,

  -- Learn fields
  class_name    text,
  provider_name text,
  child_age     int,
  child_reaction text,
  trial_experience text,
  skills_supported text[] default '{}',

  -- Shop fields
  supplier_name     text,
  supplier_category text,
  product_reviewed  text,
  freshness         text,
  price_level       text,
  delivery_experience text,
  recommended_for   text[] default '{}',
  whats_good        text[] default '{}',
  what_to_avoid     text[] default '{}'
);

alter table public.gobela_reviews enable row level security;
create policy "Public reviews visible"       on public.gobela_reviews for select using (is_hidden = false);
create policy "Users can insert reviews"     on public.gobela_reviews for insert with check (auth.uid() = profile_id);
create policy "Users can update own reviews" on public.gobela_reviews for update using (auth.uid() = profile_id);
create policy "Users can delete own reviews" on public.gobela_reviews for delete using (auth.uid() = profile_id);

-- ─────────────────────────────────────────────────────────
-- 2. REVIEW HELPFUL VOTES
-- ─────────────────────────────────────────────────────────
create table if not exists public.review_helpful (
  review_id  text not null references public.gobela_reviews(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (review_id, profile_id)
);

alter table public.review_helpful enable row level security;
create policy "Users manage own helpful votes" on public.review_helpful for all using (auth.uid() = profile_id);

-- ─────────────────────────────────────────────────────────
-- 3. REVIEW FLAGS
-- ─────────────────────────────────────────────────────────
create table if not exists public.review_flags (
  review_id  text not null references public.gobela_reviews(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reason     text default 'user_reported',
  flagged_at timestamptz default now(),
  primary key (review_id, profile_id)
);

alter table public.review_flags enable row level security;
create policy "Users manage own flags" on public.review_flags for all using (auth.uid() = profile_id);

-- ─────────────────────────────────────────────────────────
-- 4. FIX FAVOURITES TABLE — add recipe_id column
--    (FavouritesService uses recipe_id, schema used item_id)
-- ─────────────────────────────────────────────────────────
alter table public.favourites add column if not exists recipe_id text;

-- ─────────────────────────────────────────────────────────
-- 5. BOOKINGS — add Supabase columns to match BookingService
-- ─────────────────────────────────────────────────────────
alter table public.bookings add column if not exists activity_id  text;
alter table public.bookings add column if not exists partner_id   text;
alter table public.bookings add column if not exists amount       numeric(8,2);
alter table public.bookings add column if not exists commission   numeric(8,2);

-- ─────────────────────────────────────────────────────────
-- VERIFY
-- select table_name from information_schema.tables where table_schema = 'public';
-- ─────────────────────────────────────────────────────────
