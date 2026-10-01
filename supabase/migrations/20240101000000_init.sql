create extension if not exists "pgcrypto";

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  caption text,
  cloudinary_public_id text,
  cloudinary_url text not null,
  series text,
  exif_location text,
  exif_shot_at timestamptz,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  cover_photo_id uuid references public.photos(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists photos_published_created_idx
  on public.photos (published, created_at desc);
create index if not exists photos_series_idx on public.photos (series);

alter table public.photos enable row level security;
alter table public.series enable row level security;

-- Public can read published photos only.
create policy "public reads published photos"
  on public.photos for select
  to anon, authenticated
  using (published = true);

-- Public can read all series.
create policy "public reads series"
  on public.series for select
  to anon, authenticated
  using (true);

-- Authenticated admin has full control.
create policy "admin full access photos"
  on public.photos for all
  to authenticated
  using (true) with check (true);

create policy "admin full access series"
  on public.series for all
  to authenticated
  using (true) with check (true);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger photos_touch_updated_at
  before update on public.photos
  for each row execute function public.touch_updated_at();
