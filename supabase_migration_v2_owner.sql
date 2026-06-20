-- ============================================================
-- SATO Migration v2 :: Owner / Dev super-admin + manual rank lock
-- Adds two columns to sato_profiles:
--   is_owner       — if true, bypasses all clearance checks (full admin)
--   manual_lock    — if true, Discord role-sync will NOT overwrite this user's rank/clearance
-- ============================================================

alter table public.sato_profiles
    add column if not exists is_owner boolean not null default false;

alter table public.sato_profiles
    add column if not exists manual_lock boolean not null default false;

-- Owners can update ANY profile row (not just their own)
drop policy if exists "profiles_owner_update_any" on public.sato_profiles;
create policy "profiles_owner_update_any" on public.sato_profiles
    for update using (
        exists (
            select 1 from public.sato_profiles p
            where p.id = auth.uid() and p.is_owner = true
        )
    );

-- Owners can delete profile rows
drop policy if exists "profiles_owner_delete_any" on public.sato_profiles;
create policy "profiles_owner_delete_any" on public.sato_profiles
    for delete using (
        exists (
            select 1 from public.sato_profiles p
            where p.id = auth.uid() and p.is_owner = true
        )
    );

-- ============================================================
-- BOOTSTRAP STEP (run AFTER your first Discord login):
-- 1. Log in once via "Declare Allegiance" so your profile row exists.
-- 2. Run THIS in SQL editor to make yourself Owner:
--
--    update public.sato_profiles
--    set is_owner=true, manual_lock=true,
--        sato_rank='OWNER', clearance_level=5
--    where username ilike 'jeremiah%';   -- or use your Discord username
--
-- From that moment on, your account has full admin powers regardless of Discord roles.
-- ============================================================
