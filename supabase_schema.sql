-- =========================================================
-- SATO  // Solar Associated Treaty Organization
-- Supabase schema for Sovereign Codex
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- =========================================================

-- 1. PROFILES (mirrors Supabase auth.users; auto-populated on login)
create table if not exists public.sato_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    discord_id text,
    username text not null,
    global_name text,
    avatar text,
    email text,
    roles jsonb default '[]'::jsonb,
    sato_rank text default 'RECRUIT',
    clearance_level int default 1,
    joined_at timestamptz default now(),
    last_seen timestamptz default now()
);
alter table public.sato_profiles enable row level security;

-- public can read roster (mask email in client based on clearance)
drop policy if exists "profiles_read_all" on public.sato_profiles;
create policy "profiles_read_all" on public.sato_profiles
    for select using (true);

-- authenticated users can upsert/update their own row
drop policy if exists "profiles_self_write" on public.sato_profiles;
create policy "profiles_self_write" on public.sato_profiles
    for insert with check (auth.uid() = id);
drop policy if exists "profiles_self_update" on public.sato_profiles;
create policy "profiles_self_update" on public.sato_profiles
    for update using (auth.uid() = id);

-- 2. OPERATIONS
create table if not exists public.sato_operations (
    id text primary key,
    codename text not null,
    sector text,
    status text check (status in ('ACTIVE','STANDBY','COMPLETED','RED_ALERT')),
    threat_level int check (threat_level between 1 and 5),
    objective text,
    commanding_officer text,
    created_at timestamptz default now()
);
alter table public.sato_operations enable row level security;
drop policy if exists "ops_read_all" on public.sato_operations;
create policy "ops_read_all" on public.sato_operations for select using (true);

-- 3. JUDICIARY
create table if not exists public.sato_judiciary (
    id text primary key,
    case_no text not null,
    defendant text,
    charge text,
    verdict text check (verdict in ('GUILTY','NOT_GUILTY','EXILED','PENDING')),
    sentence text,
    article text,
    created_at timestamptz default now()
);
alter table public.sato_judiciary enable row level security;
drop policy if exists "jud_read_all" on public.sato_judiciary;
create policy "jud_read_all" on public.sato_judiciary for select using (true);

-- 4. ARCHIVES
create table if not exists public.sato_archives (
    id text primary key,
    year text,
    title text not null,
    summary text,
    created_at timestamptz default now()
);
alter table public.sato_archives enable row level security;
drop policy if exists "arc_read_all" on public.sato_archives;
create policy "arc_read_all" on public.sato_archives for select using (true);

-- =========================================================
-- SEED CONTENT
-- =========================================================
insert into public.sato_operations (id, codename, sector, status, threat_level, objective, commanding_officer) values
 ('op_001','IRON CORRIDOR SWEEP','Pyro / Keeger Belt','ACTIVE',4,'Interdict hostile signatures along the Iron Corridor mining lanes.','Adm. Vex Halloran'),
 ('op_002','GHOST WIRE PROTOCOL','Stanton / Crusader','STANDBY',2,'Field-test stealth dampener arrays. Total comms blackout.','Dr. Sera Voss'),
 ('op_003','WHITE-CROSS ESCORT','Nyx / Levski','ACTIVE',3,'Neutral medical convoy escort. Engage only on Tier 1 violation.','Cpt. Mara Tully'),
 ('op_004','DARK VOID RED ALERT','Classified','RED_ALERT',5,'UI masking enforced. Sovereign-eyes intelligence operation in progress.','High Council'),
 ('op_005','KEEGER REQUISITION','Keeger Belt','COMPLETED',2,'Industrial yield secured. 25% sovereign tax applied to yields.','SATO LOG Command')
on conflict (id) do nothing;

insert into public.sato_judiciary (id, case_no, defendant, charge, verdict, sentence, article) values
 ('cs_001','SATO-T-2854-001','Pvt. R. Caine','High Treason - leaking fleet coordinates','EXILED','Permanent exile / asset confiscation','Code 4.2'),
 ('cs_002','SATO-T-2854-014','Unknown / Vandal-7','White-Cross violation','GUILTY','Open Tier 1 War Crime bounty','Art 2.2'),
 ('cs_003','SATO-T-2854-022','Ens. K. Solari','Unauthorized 5KM buffer breach','GUILTY','30-day flight restriction, formal censure','Art 2.1'),
 ('cs_004','SATO-T-2854-031','Cpl. T. Drexler','Discrimination - Art 5.3 violation','EXILED','Immediate exile, no appeal','Art 5.3'),
 ('cs_005','SATO-T-2854-040','External Black Sun Co.','Unauthorized salvage in SATO battle site','PENDING','Tribunal scheduled - sector lockdown','Art 6.4')
on conflict (id) do nothing;

insert into public.sato_archives (id, year, title, summary) values
 ('ar_001','2851','The Sovereign Accord Signing','Founders ratify the Sovereign Codex aboard the SATOS Tideborn.'),
 ('ar_002','2852','First Keeger Claim','SATO asserts sovereignty over the Keeger Belt. UEE protest filed and ignored.'),
 ('ar_003','2853','Operation: Iron Wolves','Five-ship pirate cartel dismantled. Marine Corps Griffin Strike inaugurated.'),
 ('ar_004','2853','Ghost Wire Prototype Online','Science Division demonstrates first stealth-dampener capable corvette.'),
 ('ar_005','2854','Codex 2854 Edition Ratified','Current authorized protocol takes effect across all SATO territory.')
on conflict (id) do nothing;

-- =========================================================
-- DONE. Set Supabase Auth -> Providers -> Discord
-- Scopes: identify email guilds
-- Redirect URL: https://sovereign-nexus-1.preview.emergentagent.com/auth/callback
-- =========================================================
