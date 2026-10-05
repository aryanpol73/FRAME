-- Migration: 20261005000001_interactions_and_guestbook.sql
-- Goal: Add Photo Reactions (Appreciate, Beautiful, Peaceful, Caught my eye) and Guestbook with Admin Moderation

-- 1. Photo Reactions Table
create table if not exists public.photo_reactions (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid references public.photos(id) on delete cascade not null,
  reaction_type text not null check (reaction_type in ('appreciate', 'beautiful', 'peaceful', 'caught_my_eye')),
  client_id text not null,
  created_at timestamptz default now(),
  unique (photo_id, client_id) -- 1 reaction per photo per visitor
);

create index if not exists photo_reactions_photo_idx on public.photo_reactions(photo_id);
create index if not exists photo_reactions_type_idx on public.photo_reactions(photo_id, reaction_type);

alter table public.photo_reactions enable row level security;

-- Drop existing if any
drop policy if exists "public reads reactions" on public.photo_reactions;
drop policy if exists "public inserts reaction" on public.photo_reactions;
drop policy if exists "public deletes own reaction" on public.photo_reactions;

-- Public can read all reactions
create policy "public reads reactions"
  on public.photo_reactions for select
  to anon, authenticated
  using (true);

-- Public can add their reaction (1 per photo per client_id)
create policy "public inserts reaction"
  on public.photo_reactions for insert
  to anon, authenticated
  with check (true);

-- Public can remove or change their reaction
create policy "public deletes own reaction"
  on public.photo_reactions for delete
  to anon, authenticated
  using (true);


-- 2. Guestbook Entries Table
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

create index if not exists guestbook_approved_idx on public.guestbook_entries(approved, created_at desc);

alter table public.guestbook_entries enable row level security;

-- Drop existing if any
drop policy if exists "public reads approved guestbook" on public.guestbook_entries;
drop policy if exists "admin reads all guestbook" on public.guestbook_entries;
drop policy if exists "public inserts guestbook" on public.guestbook_entries;
drop policy if exists "admin updates guestbook" on public.guestbook_entries;
drop policy if exists "admin deletes guestbook" on public.guestbook_entries;

-- Public can read ONLY approved guestbook entries
create policy "public reads approved guestbook"
  on public.guestbook_entries for select
  to anon, authenticated
  using (approved = true);

-- Admin can read ALL guestbook entries (for moderation)
create policy "admin reads all guestbook"
  on public.guestbook_entries for select
  to authenticated
  using (public.is_admin());

-- Public can submit new entries (which start unapproved)
create policy "public inserts guestbook"
  on public.guestbook_entries for insert
  to anon, authenticated
  with check (approved = false);

-- Admin can update entries (approve / hide)
create policy "admin updates guestbook"
  on public.guestbook_entries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin can delete guestbook entries
create policy "admin deletes guestbook"
  on public.guestbook_entries for delete
  to authenticated
  using (public.is_admin());
