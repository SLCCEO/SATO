# SATO Deployment Guide — Vercel + Render + satoaccord.com

End-to-end migration from Emergent preview to your own GitHub + Vercel + custom domain.

---

## Architecture (Production)

```
        satoaccord.com (Vercel)
             │
             ├─► /api/* ──► sato-backend.onrender.com (Render Web Service)
             │                                │
             │                                ├─► Supabase REST
             │                                └─► Discord REST API
             │
             └─► Supabase Auth (Discord OAuth via Supabase callback)

        Independent process: sato-discord-bot (Render Worker)
                              │
                              ├─► Discord Gateway (websocket)
                              └─► Supabase REST (role-sync writes)
```

- **Frontend** (CRA) → Vercel (free tier, native CDN)
- **Backend** (FastAPI) → Render Web Service (free tier, persistent)
- **Discord Bot** (discord.py) → Render Worker (free tier, persistent websocket)
- **Database / Auth** → Supabase (already live)

---

## Step 1 — Push to GitHub

In the Emergent chat interface, click **"Save to GitHub"** at the top-right. Choose your repo (e.g. `satoaccord-website`) and branch (`main`). The entire `/app` directory pushes up.

---

## Step 2 — Deploy Backend to Render

1. https://render.com → **New +** → **Blueprint**
2. Connect your GitHub repo → Render auto-detects `/app/render.yaml`
3. Click **Apply** — it creates both services (`sato-backend` web + `sato-discord-bot` worker) at once
4. Render prompts for the `sync: false` env vars — paste these values:
   ```
   MONGO_URL         = mongodb+srv://... (your MongoDB URI; or any throwaway free Atlas cluster)
   DB_NAME           = sato_production
   DISCORD_BOT_TOKEN = MTUxNzgz...
   DISCORD_GUILD_ID  = 1494788633088098554
   SUPABASE_URL      = https://ijuxzuzdcuvnhkjrfcwg.supabase.co
   SUPABASE_SECRET_KEY = eyJhbGciOi... (your service_role key)
   ```
5. First deploy takes ~3 minutes. When complete you get:
   - Backend URL: `https://sato-backend.onrender.com`
   - Worker is running invisibly — check **Logs** tab to see the bot connect

> ⚠ **Free Render tier sleeps after 15 min idle.** First request after sleep takes ~30 sec to wake. For production paid tier ($7/mo) keeps it always-on.

---

## Step 3 — Deploy Frontend to Vercel

1. https://vercel.com → **Add New → Project** → import your GitHub repo
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App (auto-detected)
   - Build/output paths come from `frontend/vercel.json` automatically
3. **Environment Variables** (paste exactly):
   ```
   REACT_APP_BACKEND_URL          = https://sato-backend.onrender.com
   REACT_APP_SUPABASE_URL         = https://ijuxzuzdcuvnhkjrfcwg.supabase.co
   REACT_APP_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOi... (your anon key)
   ```
4. Click **Deploy** — first build takes ~2 min.

---

## Step 4 — Attach `satoaccord.com`

In your Vercel project → **Settings → Domains**:
1. Add `satoaccord.com`
2. Add `www.satoaccord.com`
3. Vercel shows DNS records — at your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare):
   - **A record**: `@` → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`
4. Delete any conflicting A records that point elsewhere
5. Vercel auto-provisions SSL within ~5-15 min

---

## Step 5 — Update Supabase + Discord Redirects

### Supabase Dashboard → Authentication → URL Configuration
- **Site URL**: `https://satoaccord.com`
- **Redirect URLs** (allowlist):
  ```
  https://satoaccord.com/auth/callback
  https://www.satoaccord.com/auth/callback
  ```

### Discord Developer Portal → your app → OAuth2 → Redirects
- Keep: `https://ijuxzuzdcuvnhkjrfcwg.supabase.co/auth/v1/callback`
- (Supabase handles the OAuth — no need to add satoaccord.com here)

---

## Step 6 — Verification Checklist

After DNS propagation:
- [ ] `https://satoaccord.com` loads the HUD
- [ ] Footer shows live "ENLISTED" + "VOID-SIDE NOW" counters → confirms backend reachable
- [ ] Click **Declare Allegiance** → redirects to Discord → back to `satoaccord.com/auth/callback` → personnel page
- [ ] Your rank appears in the top-right HUD
- [ ] If CLR-5 / Owner: `09 // ADMIN` link appears in nav
- [ ] In Discord, type `/rank` — bot responds (proves Render worker is alive)
- [ ] Change someone's role in Discord → within 5 sec their rank updates on `/personnel`

---

## Step 7 — Optional Cleanup

Once `satoaccord.com` is verified:
- Pause the Emergent preview deployment to avoid duplicate Discord webhook hits (the preview's bot was running in the dev container; the prod Render worker has now taken over)
- Or keep Emergent active as a staging environment — point a separate `staging.satoaccord.com` subdomain to it for safe testing

---

## Cost Summary (Free Tier)

| Service        | Plan           | Cost    | Notes                                   |
|----------------|----------------|---------|-----------------------------------------|
| Vercel         | Hobby          | $0      | Unlimited bandwidth for personal use    |
| Render web     | Free           | $0      | Sleeps after 15 min idle                |
| Render worker  | Free           | $0      | 750 hrs/month free                      |
| Supabase       | Free           | $0      | 500 MB DB, 50k MAU                      |
| Domain         | yours          | ~$12/yr |                                          |
| **Total**      |                | **~$1/mo** | bumps to ~$15/mo if you upgrade Render web to keep it always-on |

---

## Troubleshooting

- **CORS errors after deploy**: Render's `CORS_ORIGINS` env var must include `https://satoaccord.com,https://www.satoaccord.com` (already set in `render.yaml`)
- **Discord OAuth loop**: re-check Supabase Site URL exactly matches `https://satoaccord.com` (no trailing slash)
- **Bot offline after deploy**: Check Render → sato-discord-bot → Logs. Ensure Server Members Intent is still enabled in Discord Dev Portal
- **Slow first load**: Render free tier cold-start. Upgrade to Starter ($7/mo) for always-on
