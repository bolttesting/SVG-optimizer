-- Run in Supabase SQL Editor (Dashboard → SQL) once per project.

-- Posts published from /admin/blog when Supabase is configured
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  body text not null,
  category text not null default 'general',
  tags text[] not null default '{}',
  author text,
  published_on date not null,
  updated_on date,
  meta_title text,
  keywords text[],
  og_title text,
  og_description text,
  og_image text,
  twitter_image text,
  canonical_url text,
  robots text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_on_idx on public.blog_posts (published_on desc);

alter table public.blog_posts enable row level security;

-- Anyone can read posts (site is public). Writes use service role from API (bypasses RLS).
drop policy if exists "blog_posts_select_anon" on public.blog_posts;
create policy "blog_posts_select_anon"
  on public.blog_posts
  for select
  to anon, authenticated
  using (true);

-- Public bucket for featured / inline images (5 MB default cap in dashboard if needed)
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "blog_storage_read" on storage.objects;
create policy "blog_storage_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog');

-- Uploads go through your Next.js API using SUPABASE_SERVICE_ROLE_KEY (no anon insert needed).
