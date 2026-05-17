-- PackGuard Supabase schema
-- Run this in the Supabase SQL editor after creating a new project

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- waitlist (early access signups — no auth needed)
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  source text not null default 'unknown'
);
alter table public.waitlist enable row level security;
-- only service role can insert/read waitlist rows
create policy "service role only" on public.waitlist using (false);

-- orgs
create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  razorpay_subscription_id text,
  policy_config jsonb not null default '{}'
);

-- org_members
create table public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  unique(org_id, user_id)
);

-- scan_results
create table public.scan_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  org_id uuid references public.orgs(id) on delete set null,
  package_name text not null,
  package_version text,
  registry text not null default 'npm' check (registry in ('npm', 'pypi', 'cargo')),
  verdict text not null check (verdict in ('pass', 'blocked', 'warning')),
  findings jsonb not null default '[]',
  cli_version text,
  run_from text
);

-- subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  razorpay_subscription_id text not null unique,
  razorpay_plan_id text,
  status text not null check (status in ('active', 'paused', 'cancelled')),
  current_period_end timestamptz
);

-- events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in (
    'page_view', 'signup', 'activated', 'paid',
    'scan_run', 'package_blocked', 'secret_found', 'ai_artifact_found',
    'source_map_flagged', 'hook_installed', 'org_invited_member'
  )),
  metadata jsonb not null default '{}',
  utm_source text,
  utm_campaign text
);

-- RLS
alter table public.orgs enable row level security;
alter table public.org_members enable row level security;
alter table public.scan_results enable row level security;
alter table public.subscriptions enable row level security;
alter table public.events enable row level security;

-- orgs: readable by owner or members
create policy "org members can read" on public.orgs
  for select using (
    auth.uid() = owner_user_id or
    exists (
      select 1 from public.org_members
      where org_id = orgs.id and user_id = auth.uid()
    )
  );

create policy "owner can update org" on public.orgs
  for update using (auth.uid() = owner_user_id);

-- scan_results: readable by the user who ran it or org members
create policy "user can read own scans" on public.scan_results
  for select using (
    auth.uid() = user_id or
    (org_id is not null and exists (
      select 1 from public.org_members
      where org_id = scan_results.org_id and user_id = auth.uid()
    ))
  );

-- service role only can insert into events
create policy "service role inserts events" on public.events
  for insert with check (false); -- only service_role bypasses RLS

-- subscriptions: readable by org members
create policy "org members can read subscriptions" on public.subscriptions
  for select using (
    exists (
      select 1 from public.org_members
      where org_id = subscriptions.org_id and user_id = auth.uid()
    )
  );
