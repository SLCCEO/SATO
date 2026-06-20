# SATO — Solar Associated Treaty Organization
## Star Citizen Org Portal — PRD

### Original Problem Statement
> build me an website that acts as Sovereign Nation website but it must match star citizens style and it needs to be an dark and red theme style but it is for an org on star citizens it must also have the ablity to use discord as login and have database in the background for roles and access.
> Architecture: index.html, government.html, departments.html, operations.html, personnel.html, codex.html, judiciary.html, archives.html
> Shared Resources: css/style.css, js/app.js

### User Choices
- Discord OAuth: scaffold with placeholders (later moved to **Supabase Auth + Discord provider**)
- Org name: **Solar Associated Treaty Organization (SATO)**
- Role system: **auto-synced from Discord roles**
- Architecture: **React SPA** with routes mirroring requested page names
- Visual reference: https://satoaccord.com
- Database: **Supabase** (user pivoted from MongoDB)

### User Personas
- **Recruit (CLR-1)** — public visitor, can read overview/codex/government/departments/archives
- **Operator (CLR-2)** — Discord-authed grunt, listed in roster
- **Officer (CLR-3+)** — can see masked roster details (email)
- **Fleet Command (CLR-4)** — admiralty
- **High Council (CLR-5)** — sovereign

### Core Requirements (static)
1. Dark + red Star Citizen Aegis HUD aesthetic — chamfered panels, scanlines, terminal text
2. 8 page routes mirroring requested HTML files (/, /government, /departments, /operations, /personnel, /codex, /judiciary, /archives)
3. Discord OAuth login (auto-rank from roles)
4. Persistent DB for users + roles
5. Lore-consistent content (Sovereign Accord, Sovereign Codex 2854, 7 State Departments, Iron Corridor, Keeger Belt, Ghost Wire, Griffin Strike, White-Cross)

### What's Implemented (2026-02)
- ✅ Full HUD shell: top bar (live stardate/UTC/clearance), logo, nav, footer with CRT scanlines
- ✅ Home: ASCII banner, hero, terminal boot-typing, stat blocks (Enlisted/Active Ops/Capital Hulls/Gov Tax), warning stripe (Art 2.1), department mini-index
- ✅ Government: 6 High Council seats with mandates
- ✅ Departments: 7 state wings with icons + descriptions
- ✅ Operations: live theaters from DB (ACTIVE / STANDBY / RED_ALERT / COMPLETED), threat-level pips, tactical overview counter
- ✅ Personnel: roster table (rank, clearance, Discord roles, last pulse) — auth-gated banner
- ✅ Codex: 6 sections, 19 binding articles
- ✅ Judiciary: tribunal records with verdicts (GUILTY / EXILED / PENDING)
- ✅ Archives: vertical timeline of historical entries (2851–2854)
- ✅ Backend (`/app/backend/server.py`): FastAPI on `/api` prefix; Discord OAuth scaffold + mock mode; `/auth/discord/login`, `/auth/discord/callback`, `/auth/me`, `/auth/logout`, `/personnel`, `/operations`, `/judiciary`, `/archives`. PyJWT session cookies + Bearer header fallback. Auto-seeds 5 ops + 5 cases.
- ✅ Supabase wired: `@supabase/supabase-js` installed, `supabase.auth.signInWithOAuth({provider:'discord'})`, RLS-scoped queries via `dataSource` layer. Auto-detects `REACT_APP_SUPABASE_PUBLISHABLE_KEY` and switches from mock → live.
- ✅ SQL migration `/app/supabase_schema.sql` (tables: sato_profiles, sato_operations, sato_judiciary, sato_archives + RLS policies + seed data)

### Pending / Next Action Items (P0)
- ⏳ User to paste real `SUPABASE_PUBLISHABLE_KEY` into `frontend/.env` and `SUPABASE_SECRET_KEY` into `backend/.env`
- ⏳ User to run `/app/supabase_schema.sql` in Supabase SQL editor
- ⏳ Confirm Supabase Auth → Discord provider Redirect URL = `https://sovereign-nexus-1.preview.emergentagent.com/auth/callback`

### P1 Backlog
- Discord guild role-fetch via service-role function (so we sync actual guild roles instead of profile-only metadata)
- Admin panel: edit Operations / Judiciary / Archives via UI
- Real-time op-status updates via Supabase Realtime subscription
- Personnel detail page (per-operative ship list, ops history)
- File uploads (ship images, after-action reports) via Supabase Storage
- Light theme NOT planned — diegetic dark only

### Architecture Notes
- Frontend: CRA + Tailwind + shadcn primitives (overridden to sharp/chamfered)
- Backend: FastAPI + Motor (Mongo) — kept as fallback / seed-data server while Supabase keys pending
- Auth: Supabase when configured, else FastAPI mock with random sample identities
- Data: `dataSource` layer transparently switches between Supabase tables and FastAPI seed endpoints
