-- Anonymous usage: one row per visitor per calendar day (UTC), max once per browser per day.
-- Run in Supabase SQL Editor after 001_blog_and_storage.sql

create table if not exists public.analytics_sessions (
  id bigserial primary key,
  visitor_id uuid not null,
  path text not null default '/',
  created_at timestamptz not null default now()
);

create index if not exists analytics_sessions_visitor_idx on public.analytics_sessions (visitor_id);
create index if not exists analytics_sessions_created_idx on public.analytics_sessions (created_at desc);

alter table public.analytics_sessions enable row level security;

-- No direct client access; inserts via Next.js API (service role).

create or replace function public.get_analytics_summary()
returns table (
  total_records bigint,
  unique_visitors bigint,
  visits_last_7d bigint,
  visits_last_24h bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*)::bigint from public.analytics_sessions),
    (select count(distinct visitor_id)::bigint from public.analytics_sessions),
    (select count(*)::bigint from public.analytics_sessions where created_at > now() - interval '7 days'),
    (select count(*)::bigint from public.analytics_sessions where created_at > now() - interval '24 hours');
$$;

revoke all on function public.get_analytics_summary() from public;
grant execute on function public.get_analytics_summary() to service_role;
