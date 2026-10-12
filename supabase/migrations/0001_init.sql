-- Cycling AE - initial schema (Supabase / Postgres 15+)
-- Run once in Supabase Dashboard > SQL Editor (see docs/BACKEND_SETUP.md).
-- Principles:
--   * RLS enabled on EVERY table, explicit policies only.
--   * Verified metrics are NULLABLE and carry provenance (source + verified_at). No invented defaults.
--   * Roles live in user_roles; only the service role / SQL editor can write them.
--   * No payment data of any kind is stored here.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'user');
create type public.emirate as enum (
  'abu_dhabi', 'dubai', 'sharjah', 'ajman', 'umm_al_quwain', 'ras_al_khaimah', 'fujairah'
);
create type public.content_status as enum ('draft', 'pending', 'published', 'archived');

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  avatar_path text,
  preferred_language text not null default 'ar' check (preferred_language in ('ar', 'en')),
  emirate public.emirate,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- is_admin(): SECURITY DEFINER so policies can read user_roles without recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  emirate public.emirate not null,
  difficulty text check (difficulty in ('easy', 'moderate', 'hard')),
  surface text check (surface in ('road', 'gravel', 'mtb', 'mixed')),
  start_lat double precision check (start_lat between -90 and 90),
  start_lng double precision check (start_lng between -180 and 180),
  -- Verified metrics: NULL until someone measures them. Never default to invented numbers.
  distance_km numeric(7, 2) check (distance_km > 0),
  elevation_gain_m integer check (elevation_gain_m >= 0),
  est_duration_min integer check (est_duration_min > 0),
  source text,            -- where the metrics came from (e.g. "GPX recorded by X", "official park map")
  verified_at timestamptz, -- when a human verified them
  gpx_path text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint routes_title_present check (
    coalesce(btrim(title_ar), '') <> '' or coalesce(btrim(title_en), '') <> ''
  ),
  constraint routes_metrics_have_provenance check (
    (distance_km is null and elevation_gain_m is null and est_duration_min is null)
    or (source is not null and btrim(source) <> '' and verified_at is not null)
  )
);

create table public.route_images (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  storage_path text not null,
  alt_ar text,
  alt_en text,
  credit text,   -- photographer / rights holder
  license text,  -- confirmed usage rights
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.route_reviews (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text check (body is null or char_length(body) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (route_id, user_id)
);

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  route_id uuid not null references public.routes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, route_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  emirate public.emirate,
  location_text text,
  starts_at timestamptz,
  ends_at timestamptz,
  external_url text check (external_url is null or external_url ~* '^https?://'),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_present check (
    coalesce(btrim(title_ar), '') <> '' or coalesce(btrim(title_en), '') <> ''
  ),
  constraint events_dates_ordered check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_ar text,
  name_en text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_present check (
    coalesce(btrim(name_ar), '') <> '' or coalesce(btrim(name_en), '') <> ''
  )
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  price_aed numeric(10, 2) check (price_aed >= 0), -- NULL = price not set; display only, no checkout
  stock integer check (stock >= 0),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_title_present check (
    coalesce(btrim(title_ar), '') <> '' or coalesce(btrim(title_en), '') <> ''
  )
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_ar text,
  alt_en text,
  credit text,
  license text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Used-gear classifieds. No contact details are stored publicly (privacy);
-- a safe in-app contact flow is a later phase.
create table public.used_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null check (char_length(title) between 3 and 140),
  description text check (description is null or char_length(description) <= 4000),
  condition text check (condition in ('new', 'like_new', 'good', 'fair', 'parts')),
  price_aed numeric(10, 2) check (price_aed >= 0),
  emirate public.emirate,
  image_paths text[] not null default '{}' check (cardinality(image_paths) <= 8),
  status text not null default 'pending'
    check (status in ('pending', 'published', 'sold', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'info',
  title_ar text,
  title_en text,
  body_ar text,
  body_en text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_ar text,
  name_en text,
  billing_interval text not null check (billing_interval in ('month', 'year')),
  price_aed numeric(10, 2) check (price_aed >= 0), -- NULL until the owner decides pricing
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Records entitlement only. No card data, no payment provider secrets. No real payments yet.
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid not null references public.subscription_plans (id),
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'canceled', 'expired')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users (id),
  action text not null check (char_length(action) between 1 and 120),
  table_name text,
  record_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (foreign keys + common filters)
-- ---------------------------------------------------------------------------
create index routes_status_emirate_idx on public.routes (status, emirate);
create index routes_owner_idx on public.routes (owner_id);
create index route_images_route_idx on public.route_images (route_id, sort_order);
create index route_reviews_route_idx on public.route_reviews (route_id, status);
create index route_reviews_user_idx on public.route_reviews (user_id);
create index favorites_route_idx on public.favorites (route_id);
create index events_status_start_idx on public.events (status, starts_at);
create index products_status_cat_idx on public.products (status, category_id);
create index product_images_product_idx on public.product_images (product_id, sort_order);
create index used_listings_status_idx on public.used_listings (status, emirate);
create index used_listings_seller_idx on public.used_listings (seller_id);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index subscriptions_user_idx on public.subscriptions (user_id);
create index subscriptions_plan_idx on public.subscriptions (plan_id);
create index audit_actor_idx on public.admin_audit_logs (actor_id, created_at desc);
create index user_roles_role_idx on public.user_roles (role);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'routes', 'route_images', 'route_reviews', 'events', 'categories',
    'products', 'product_images', 'used_listings', 'notifications',
    'subscription_plans', 'subscriptions'
  ] loop
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.set_updated_at()',
      t || '_set_updated_at', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- New auth user -> profile row (never grants any role)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Table privileges (defense in depth on top of RLS)
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

-- public (anon + signed-in) can read; RLS limits rows to published content
grant select on public.routes, public.route_images, public.route_reviews, public.events,
  public.categories, public.products, public.product_images, public.used_listings,
  public.subscription_plans to anon, authenticated;

-- signed-in users
grant select, insert, update, delete on public.routes, public.route_images,
  public.route_reviews, public.events, public.categories, public.products,
  public.product_images, public.used_listings, public.subscription_plans
  to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, delete on public.notifications to authenticated;
grant insert on public.notifications to authenticated;          -- admin-only via RLS
grant update (read_at) on public.notifications to authenticated; -- users may only mark read
grant select, insert, update, delete on public.subscriptions to authenticated; -- RLS: admin writes
grant select on public.user_roles to authenticated;              -- no write grant, ever
grant select, insert on public.admin_audit_logs to authenticated; -- no update/delete

-- ---------------------------------------------------------------------------
-- Row Level Security: enable on every table
-- ---------------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.user_roles          enable row level security;
alter table public.routes              enable row level security;
alter table public.route_images        enable row level security;
alter table public.route_reviews       enable row level security;
alter table public.favorites           enable row level security;
alter table public.events              enable row level security;
alter table public.categories          enable row level security;
alter table public.products            enable row level security;
alter table public.product_images      enable row level security;
alter table public.used_listings       enable row level security;
alter table public.notifications       enable row level security;
alter table public.subscription_plans  enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.admin_audit_logs    enable row level security;

-- profiles: own row + admin. (No public profile exposure; add a safe view later if needed.)
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_admin_all on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- user_roles: read own roles (admins read all). NO insert/update/delete policy exists,
-- so only the service role / SQL editor (which bypass RLS) can change roles.
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- routes
create policy routes_public_read on public.routes for select to anon, authenticated
  using (status = 'published');
create policy routes_owner_read on public.routes for select to authenticated
  using (owner_id = (select auth.uid()));
create policy routes_owner_insert on public.routes for insert to authenticated
  with check (owner_id = (select auth.uid()) and status in ('draft', 'pending'));
create policy routes_owner_update on public.routes for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()) and status in ('draft', 'pending'));
create policy routes_owner_delete on public.routes for delete to authenticated
  using (owner_id = (select auth.uid()) and status <> 'published');
create policy routes_admin_all on public.routes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- route_images: visible if parent route is published; route owner manages own; admin all
create policy route_images_public_read on public.route_images for select to anon, authenticated
  using (exists (select 1 from public.routes r where r.id = route_id and r.status = 'published'));
create policy route_images_owner_all on public.route_images for all to authenticated
  using (exists (select 1 from public.routes r
                 where r.id = route_id and r.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.routes r
                      where r.id = route_id and r.owner_id = (select auth.uid())));
create policy route_images_admin_all on public.route_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- route_reviews: published are public; authors write own but can never self-publish
create policy route_reviews_public_read on public.route_reviews for select to anon, authenticated
  using (status = 'published');
create policy route_reviews_owner_read on public.route_reviews for select to authenticated
  using (user_id = (select auth.uid()));
create policy route_reviews_owner_insert on public.route_reviews for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
create policy route_reviews_owner_update on public.route_reviews for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and status = 'pending');
create policy route_reviews_owner_delete on public.route_reviews for delete to authenticated
  using (user_id = (select auth.uid()));
create policy route_reviews_admin_all on public.route_reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- favorites: strictly private
create policy favorites_owner_select on public.favorites for select to authenticated
  using (user_id = (select auth.uid()));
create policy favorites_owner_insert on public.favorites for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy favorites_owner_delete on public.favorites for delete to authenticated
  using (user_id = (select auth.uid()));
create policy favorites_admin_select on public.favorites for select to authenticated
  using (public.is_admin());

-- events: public read published; admin manages
create policy events_public_read on public.events for select to anon, authenticated
  using (status = 'published');
create policy events_admin_all on public.events for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- categories
create policy categories_public_read on public.categories for select to anon, authenticated
  using (is_active);
create policy categories_admin_all on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- products / product_images
create policy products_public_read on public.products for select to anon, authenticated
  using (status = 'published');
create policy products_admin_all on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy product_images_public_read on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published'));
create policy product_images_admin_all on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- used_listings: published public; sellers manage own but cannot self-publish
create policy used_listings_public_read on public.used_listings for select to anon, authenticated
  using (status = 'published');
create policy used_listings_owner_read on public.used_listings for select to authenticated
  using (seller_id = (select auth.uid()));
create policy used_listings_owner_insert on public.used_listings for insert to authenticated
  with check (seller_id = (select auth.uid()) and status = 'pending');
create policy used_listings_owner_update on public.used_listings for update to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()) and status in ('pending', 'sold', 'removed'));
create policy used_listings_owner_delete on public.used_listings for delete to authenticated
  using (seller_id = (select auth.uid()));
create policy used_listings_admin_all on public.used_listings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- notifications: user reads/marks-read/deletes own (column grant limits update to read_at);
-- only admins (or the service role) create them
create policy notifications_owner_select on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy notifications_owner_update on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy notifications_owner_delete on public.notifications for delete to authenticated
  using (user_id = (select auth.uid()));
create policy notifications_admin_insert on public.notifications for insert to authenticated
  with check (public.is_admin());

-- subscription_plans: active plans public; admin manages
create policy plans_public_read on public.subscription_plans for select to anon, authenticated
  using (is_active);
create policy plans_admin_all on public.subscription_plans for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- subscriptions: user reads own; ONLY admins/service role write (no self-granted plans)
create policy subscriptions_owner_select on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()));
create policy subscriptions_admin_all on public.subscriptions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- admin_audit_logs: admins may insert (as themselves) and read; nobody updates/deletes
create policy audit_admin_insert on public.admin_audit_logs for insert to authenticated
  with check (public.is_admin() and actor_id = (select auth.uid()));
create policy audit_admin_select on public.admin_audit_logs for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets: public-read images, 5 MB cap, JPEG/PNG/WebP only
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('route-images',   'route-images',   true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('listing-images', 'listing-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars',        'avatars',        true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Everyone can read these image buckets
create policy "images public read" on storage.objects for select to anon, authenticated
  using (bucket_id in ('route-images', 'product-images', 'listing-images', 'avatars'));

-- route/product images: admins only
create policy "catalog images admin write" on storage.objects for insert to authenticated
  with check (bucket_id in ('route-images', 'product-images') and public.is_admin());
create policy "catalog images admin update" on storage.objects for update to authenticated
  using (bucket_id in ('route-images', 'product-images') and public.is_admin())
  with check (bucket_id in ('route-images', 'product-images') and public.is_admin());
create policy "catalog images admin delete" on storage.objects for delete to authenticated
  using (bucket_id in ('route-images', 'product-images') and public.is_admin());

-- listing images + avatars: signed-in user, only inside their own folder "<uid>/..."
create policy "user images insert own folder" on storage.objects for insert to authenticated
  with check (bucket_id in ('listing-images', 'avatars')
              and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "user images update own folder" on storage.objects for update to authenticated
  using (bucket_id in ('listing-images', 'avatars')
         and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id in ('listing-images', 'avatars')
              and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "user images delete own folder" on storage.objects for delete to authenticated
  using (bucket_id in ('listing-images', 'avatars')
         and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));

-- ---------------------------------------------------------------------------
-- FIRST ADMIN: never automatic. After signing up normally, run the one-time
-- statement in docs/BACKEND_SETUP.md (SQL Editor runs as owner and bypasses RLS).
-- ---------------------------------------------------------------------------
