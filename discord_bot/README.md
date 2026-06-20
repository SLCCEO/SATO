# SATO Sovereign Comm-Net Bot

A Discord bot that lives in your SATO guild, syncs role changes into Supabase in real time, welcomes new recruits, and exposes slash commands.

## Features

- **Auto-sync on role change** — when anyone's Discord roles change, the bot recomputes their SATO rank + clearance and pushes it to `sato_profiles` (respects `manual_lock=true` set by Owners)
- **Welcome flow** — on join: auto-assigns the Cadet role + sends a lore-flavored DM with the site link
- **Slash commands**:
  - `/rank` — show your current SATO rank & clearance (ephemeral)
  - `/codex <code>` — look up any Codex article (e.g. `Art 2.1`)
  - `/site` — get the Sovereign Codex web portal link
  - `/resync <target>` — CLR-3+ only: force re-pull a member's roles
  - `/ping` — comm-net health check
- **Presence** — bot sets activity to "patrolling the Iron Corridor"

## Prereqs

1. **Bot already exists** — you already have a token (used by the website's `/api/discord/*` endpoints)
2. **Privileged Intent** — in [Discord Developer Portal](https://discord.com/developers/applications) → your app → **Bot** → enable **SERVER MEMBERS INTENT** (required for `on_member_update`)
3. **Bot permissions** — when inviting (or re-inviting) the bot, use these scopes/perms:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: `Send Messages`, `Embed Links`, `View Members`, `Manage Roles` (for auto-Cadet on join)

## Setup

```
cd /app/discord_bot
pip install -r requirements.txt
```

The bot reads env vars from (in order): `/app/discord_bot/.env`, `/app/backend/.env`. Required vars (already in `/app/backend/.env`):

- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Optional:
- `FRONTEND_URL` (defaults to your preview URL)
- `SATO_CADET_ROLE` (default: `Cadet`)
- `SATO_WELCOME_CHANNEL` (e.g. `general` — if set, posts a public "X has declared allegiance" message)

## Run

**Foreground (testing)**:
```
cd /app/discord_bot && python bot.py
```

You should see:
```
[INFO] sato.bot :: Logged in as YourBot#1234 (id=...) — guilds=1
[INFO] sato.bot :: Slash commands synced :: 5
```

**Background (production)**:
```
cd /app/discord_bot && nohup python bot.py > bot.log 2>&1 &
```

**Systemd (Linux server)**:
A unit file is at `sato-bot.service`. Copy it, edit paths, then:
```
sudo cp sato-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now sato-bot
sudo journalctl -u sato-bot -f
```

## Verifying

In your Discord server, type `/` — you should see `/rank`, `/site`, `/codex`, `/resync`, `/ping`. Try `/rank` first — it'll return your current rank/clearance inline. Then change someone's role in Discord and within ~2 seconds the bot logs the change and pushes the new rank to Supabase (visible on `/personnel` page immediately).

## Limitations

- Slash commands are guild-scoped (sync to your SATO guild only) for instant updates. To make them global, change `.copy_global_to` → `.sync()` without guild.
- `on_member_update` only fires while the bot is online. If the bot is offline when a role changes, sync happens on next user login to the website (the website's own `/api/discord/sync-roles` is the fallback).
