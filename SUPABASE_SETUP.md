# SATO — Supabase Setup Guide

Two-step activation. The site already runs in **mock mode** so you can preview everything immediately.

---

## Step 1 — Get your keys (30 seconds)

Open Supabase Dashboard → **Settings → API** and copy two values:

| Field | What it looks like |
|---|---|
| **Project URL** | `https://ijuxzuzdcuvnhkjrfcwg.supabase.co` ✓ already set |
| **Publishable / `anon` key** | starts with `eyJhbGciOi...` — safe to ship to browser |
| **Secret / `service_role` key** | starts with `eyJhbGciOi...` — **NEVER share, server-only** |

---

## Step 2 — Paste keys into 2 files

### A. `/app/frontend/.env`
Replace the placeholder line:
```
REACT_APP_SUPABASE_PUBLISHABLE_KEY=PLACEHOLDER_PASTE_PUBLISHABLE_ANON_KEY_HERE
```
with your real **publishable / anon** key.

### B. `/app/backend/.env`
Replace the placeholder line:
```
SUPABASE_SECRET_KEY=PLACEHOLDER_PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE
```
with your real **service_role** key.

Then restart:
```
sudo supervisorctl restart backend frontend
```

---

## Step 3 — Create the tables (one-time)

Open Supabase Dashboard → **SQL Editor → New Query**, paste the contents of
`/app/supabase_schema.sql`, and click **Run**.

This creates `sato_profiles`, `sato_operations`, `sato_judiciary`, `sato_archives`
with row-level security policies and seed data (5 operations, 5 tribunal cases,
5 archive entries).

---

## Step 4 — Confirm Discord provider settings

Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL** = `https://sovereign-nexus-1.preview.emergentagent.com`
- **Redirect URLs** (allowlist) must include:
  `https://sovereign-nexus-1.preview.emergentagent.com/auth/callback`

Supabase Dashboard → **Authentication → Providers → Discord**:
- Discord Client ID + Secret from https://discord.com/developers/applications
- Toggle **Enabled**

In the Discord Developer Portal → OAuth2 → Redirects, add:
`https://ijuxzuzdcuvnhkjrfcwg.supabase.co/auth/v1/callback`

---

## Done ✓
After step 2, the **Declare Allegiance** button switches from mock-cycle to real Discord OAuth via Supabase, and all data reads from your Supabase tables.

If anything fails, the app automatically falls back to FastAPI mock data so the site never appears broken.
