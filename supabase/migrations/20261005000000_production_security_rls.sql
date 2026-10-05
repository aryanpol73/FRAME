-- Migration: 20261005000000_production_security_rls.sql
-- Goal: Production-grade Row-Level Security for single-owner portfolio (FRAME)

-- 1. Controlled Admin Registry
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text unique not null,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

-- 2. Helper function to check if current caller is the verified admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  ) or (
    auth.jwt() ->> 'email' = 'aryan.pol737@gmail.com'
  );
$$;

-- 3. Automatic sync trigger when the owner user logs in or is created
create or replace function public.handle_admin_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'aryan.pol737@gmail.com' then
    insert into public.admin_users (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_admin_sync on auth.users;
create trigger on_auth_user_admin_sync
  after insert or update on auth.users
  for each row execute function public.handle_admin_user_sync();

-- Seed existing user if already present in auth.users
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'aryan.pol737@gmail.com'
on conflict (user_id) do nothing;

-- 4. Secure admin_users table policies
drop policy if exists "admin_users read" on public.admin_users;
create policy "admin_users read"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- 5. Hardened Row-Level Security on public.photos
alter table public.photos enable row level security;

-- Drop prior permissive or existing policies
drop policy if exists "admin full access photos" on public.photos;
drop policy if exists "public reads published photos" on public.photos;
drop policy if exists "admin reads all photos" on public.photos;
drop policy if exists "admin inserts photos" on public.photos;
drop policy if exists "admin updates photos" on public.photos;
drop policy if exists "admin deletes photos" on public.photos;

-- Public can SELECT published photos only
create policy "public reads published photos"
  on public.photos for select
  to anon, authenticated
  using (published = true);

-- Admin can SELECT all photos (including drafts/unpublished)
create policy "admin reads all photos"
  on public.photos for select
  to authenticated
  using (public.is_admin());

-- Admin only can INSERT photos (strictly checked against controlled admin identity)
create policy "admin inserts photos"
  on public.photos for insert
  to authenticated
  with check (public.is_admin());

-- Admin only can UPDATE photos
create policy "admin updates photos"
  on public.photos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin only can DELETE photos
create policy "admin deletes photos"
  on public.photos for delete
  to authenticated
  using (public.is_admin());

-- 6. Hardened Row-Level Security on public.series
alter table public.series enable row level security;

-- Drop prior permissive policies
drop policy if exists "admin full access series" on public.series;
drop policy if exists "public reads series" on public.series;
drop policy if exists "admin inserts series" on public.series;
drop policy if exists "admin updates series" on public.series;
drop policy if exists "admin deletes series" on public.series;

-- Public can SELECT series for public portfolio display
create policy "public reads series"
  on public.series for select
  to anon, authenticated
  using (true);

-- Admin only can INSERT series
create policy "admin inserts series"
  on public.series for insert
  to authenticated
  with check (public.is_admin());

-- Admin only can UPDATE series
create policy "admin updates series"
  on public.series for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin only can DELETE series
create policy "admin deletes series"
  on public.series for delete
  to authenticated
  using (public.is_admin());
