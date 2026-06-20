"""
SATO Sovereign Comm-Net Bot
============================
Auto-syncs Discord guild role changes to Supabase sato_profiles in real time.
Exposes slash commands for the SATO citizenry.

Run with:
    cd /app/discord_bot && python bot.py
"""
import os
import asyncio
import logging
from datetime import datetime, timezone
from pathlib import Path

import httpx
import discord
from discord import app_commands
from dotenv import load_dotenv

# Load env from /app/discord_bot/.env first, then fall back to /app/backend/.env
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

BOT_TOKEN     = os.environ["DISCORD_BOT_TOKEN"]
GUILD_ID      = int(os.environ["DISCORD_GUILD_ID"])
SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_SECRET_KEY"]
SITE_URL      = os.environ.get("FRONTEND_URL", "https://satoaccord.com")
CADET_ROLE    = os.environ.get("SATO_CADET_ROLE", "Cadet")
WELCOME_CHAN  = os.environ.get("SATO_WELCOME_CHANNEL")  # optional channel name for public welcome

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s :: %(message)s")
log = logging.getLogger("sato.bot")

# ============ RANK HIERARCHY (mirrors site) ============
RANK_HIERARCHY = [
    ("vice president of sato",    "VICE PRESIDENT", 5),
    ("president of sato",         "PRESIDENT", 5),
    ("grand marshal",             "GRAND MARSHAL", 5),
    ("chief of naval operations", "CHIEF OF NAVAL OPS", 4),
    ("chief technical officer",   "CHIEF TECHNICAL OFFICER", 4),
    ("director of intelligence",  "DIRECTOR OF INTELLIGENCE", 4),
    ("high admiral of logistics", "HIGH ADMIRAL OF LOGISTICS", 4),
    ("trade minister",            "TRADE MINISTER", 4),
    ("brigadier",                 "BRIGADIER", 4),
    ("commander",                 "COMMANDER", 3),
    ("recruitment officer",       "RECRUITMENT OFFICER", 3),
    ("lieutenant",                "LIEUTENANT", 3),
    ("operations officer",        "OPERATIONS OFFICER", 3),
    ("intelligence officer",      "INTELLIGENCE OFFICER", 3),
    ("marine",                    "MARINE", 2),
    ("crewman",                   "CREWMAN", 2),
    ("medical personnel",         "MEDICAL PERSONNEL", 2),
    ("vanguard",                  "VANGUARD", 2),
    ("cadet",                     "CADET", 1),
    ("citizen of sato",           "CITIZEN", 1),
    ("merchant pilot",            "MERCHANT PILOT", 1),
    ("foreign consultant",        "FOREIGN CONSULTANT", 1),
]

def rank_from_role_names(roles):
    lower = [r.lower().strip() for r in roles]
    for match, label, clearance in RANK_HIERARCHY:
        for r in lower:
            if r == match or match in r:
                return label, clearance
    return "RECRUIT", 1

# ============ SUPABASE HELPERS ============
async def supabase_find_profile_by_discord_id(http: httpx.AsyncClient, discord_id: int):
    r = await http.get(
        f"{SUPABASE_URL}/rest/v1/sato_profiles?discord_id=eq.{discord_id}&select=*",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
    )
    if r.status_code == 200 and r.json():
        return r.json()[0]
    return None

async def supabase_update_profile(http: httpx.AsyncClient, profile_id: str, patch: dict):
    r = await http.patch(
        f"{SUPABASE_URL}/rest/v1/sato_profiles?id=eq.{profile_id}",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        json=patch,
    )
    if r.status_code not in (200, 204):
        log.warning("Supabase update failed: %s %s", r.status_code, r.text[:300])
        return None
    return r.json() if r.status_code == 200 else patch

# ============ SYNC ============
async def sync_member(member: discord.Member, reason: str = "manual"):
    """Pull role names → recompute rank → push to Supabase (respects manual_lock)."""
    role_names = [r.name for r in member.roles if r.name != "@everyone"]
    rank, clearance = rank_from_role_names(role_names)

    async with httpx.AsyncClient(timeout=15.0) as http:
        existing = await supabase_find_profile_by_discord_id(http, member.id)
        if not existing:
            log.info("[%s] %s not yet in sato_profiles (no first-login) — skipping role sync", reason, member.name)
            return False

        if existing.get("manual_lock"):
            patch = {
                "roles": role_names,
                "global_name": member.display_name,
                "last_seen": datetime.now(timezone.utc).isoformat(),
            }
            log.info("[%s] %s is manual_lock'd — updating roles only, rank preserved", reason, member.name)
        else:
            patch = {
                "roles": role_names,
                "sato_rank": rank,
                "clearance_level": clearance,
                "global_name": member.display_name,
                "last_seen": datetime.now(timezone.utc).isoformat(),
            }
            log.info("[%s] %s → rank=%s clearance=%d roles=%d", reason, member.name, rank, clearance, len(role_names))

        await supabase_update_profile(http, existing["id"], patch)
        return True

# ============ DISCORD CLIENT ============
intents = discord.Intents.default()
intents.members = True  # PRIVILEGED — enable in Dev Portal
intents.guilds = True

class SatoBot(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        self.guild_obj = discord.Object(id=GUILD_ID)

    async def setup_hook(self):
        self.tree.copy_global_to(guild=self.guild_obj)
        synced = await self.tree.sync(guild=self.guild_obj)
        log.info("Slash commands synced :: %d", len(synced))

bot = SatoBot()

# ============ LIFECYCLE ============
@bot.event
async def on_ready():
    log.info("Logged in as %s (id=%s) — guilds=%d", bot.user, bot.user.id, len(bot.guilds))
    await bot.change_presence(activity=discord.Game(name="patrolling the Iron Corridor"))

# Role changes → re-sync to Supabase
@bot.event
async def on_member_update(before: discord.Member, after: discord.Member):
    if before.guild.id != GUILD_ID:
        return
    if set(r.id for r in before.roles) != set(r.id for r in after.roles):
        await sync_member(after, reason="role_change")

# New recruits → welcome + ensure Cadet role + log
@bot.event
async def on_member_join(member: discord.Member):
    if member.guild.id != GUILD_ID:
        return
    log.info("New recruit: %s (id=%s)", member.name, member.id)

    # Auto-grant Cadet role if it exists
    cadet = discord.utils.get(member.guild.roles, name=CADET_ROLE)
    if cadet:
        try:
            await member.add_roles(cadet, reason="Auto-enlistment :: SATO Cadet")
        except discord.Forbidden:
            log.warning("Bot lacks permission to assign Cadet role")

    # DM the new operative
    try:
        embed = discord.Embed(
            title="SOVEREIGN ACCORD :: WELCOME, OPERATIVE",
            description=(
                f"Welcome to the **Solar Associated Treaty Organization**, {member.mention}.\n\n"
                "You have been provisionally registered as a **Cadet**. To complete enlistment:\n"
                "- Set SATO as your **Primary Organization** in the RSI portal (Codex Art 1.3)\n"
                "- Log in to the Sovereign Codex at the link below to register your profile\n"
                "- Review the Sovereign Codex 2854 Edition\n\n"
                f"**Sovereign Comm-Net:** {SITE_URL}"
            ),
            color=0xDC143C,
        )
        embed.set_footer(text="SATO :: Sovereign Eyes Only")
        await member.send(embed=embed)
    except discord.Forbidden:
        log.info("Could not DM %s (DMs disabled)", member.name)

    # Optional public welcome message
    if WELCOME_CHAN:
        chan = discord.utils.get(member.guild.text_channels, name=WELCOME_CHAN)
        if chan:
            await chan.send(f"🛰  **{member.display_name}** has declared allegiance. Welcome, Cadet.")

# ============ SLASH COMMANDS ============
@bot.tree.command(name="rank", description="Show your current SATO rank and clearance level.")
async def slash_rank(interaction: discord.Interaction):
    member = interaction.user
    role_names = [r.name for r in member.roles if r.name != "@everyone"]
    rank, clearance = rank_from_role_names(role_names)
    embed = discord.Embed(
        title=f"OPERATIVE :: {member.display_name}",
        color=0xDC143C,
    )
    embed.add_field(name="Rank", value=f"`{rank}`", inline=True)
    embed.add_field(name="Clearance", value=f"`CLR-{clearance}/5`", inline=True)
    embed.add_field(name="Roles", value=", ".join(role_names) or "—", inline=False)
    embed.set_footer(text="SATO :: Sovereign Codex")
    if member.avatar:
        embed.set_thumbnail(url=member.avatar.url)
    await interaction.response.send_message(embed=embed, ephemeral=True)

@bot.tree.command(name="site", description="Open the SATO Sovereign Codex web portal.")
async def slash_site(interaction: discord.Interaction):
    embed = discord.Embed(
        title="SOVEREIGN COMM-NET :: PORTAL LINK",
        description=f"Live HUD, Operations, Codex, and Tribunal records:\n{SITE_URL}",
        color=0xDC143C,
    )
    await interaction.response.send_message(embed=embed, ephemeral=True)

@bot.tree.command(name="codex", description="Look up a SATO Codex article by code (e.g. 'Art 2.1').")
@app_commands.describe(code="Article code such as 'Art 2.1', 'Code 4.2', or section name")
async def slash_codex(interaction: discord.Interaction, code: str):
    CODEX = {
        "art 1.1": ("AUTHORITY", "Command authority lies with the President and CO during Ops."),
        "art 1.2": ("PULSE MANDATE", "30-day activity logs required for rank maintenance."),
        "art 1.3": ("PRIMARY DIRECTIVE", "Leadership requires SATO to be set as the Primary Organization."),
        "art 2.1": ("THE 5KM BUFFER", "Unauthorized approach to Capital Ships is a hostile act."),
        "art 2.2": ("WHITE-CROSS", "Medical craft are neutral; attacks are Tier 1 War Crimes."),
        "art 3.1": ("TAXATION", "Citizen 10% · Partner 15% · Government 25% of yield."),
        "art 3.2": ("STATE REQUISITION", "Capital ships may be commanded by the State during Red Alert."),
        "art 3.3": ("INDUSTRIAL YIELD", "Mining/Salvage must yield to Military refueling in combat."),
        "code 4.1": ("DARK VOID", "UI masking required for all streams during official Ops."),
        "code 4.2": ("HIGH TREASON", "Leaking fleet intel is grounds for permanent exile."),
        "art 5.1": ("REAL-WORLD PRIMACY", "Real-world commitments always supersede game tasks."),
        "art 5.2": ("DEEP SPACE TRANSIT", "Absences over 14 days require a 'Deep Space Transit' notice."),
        "art 5.3": ("ZERO-TOLERANCE", "Discrimination results in immediate exile."),
        "art 5.4": ("UNIFORM", "SATO gear is required for formal State functions."),
        "art 6.1": ("KEEGER SOVEREIGNTY", "SATO claims the Keeger Belt; all mining is taxed."),
        "art 6.3": ("PIONEER CLAUSE", "Outpost placement must be approved by the High Council."),
        "art 6.4": ("SALVAGE SANCTION", "Only SATO-tagged ships may salvage in SATO battle sites."),
    }
    key = code.lower().strip()
    entry = CODEX.get(key)
    if not entry:
        await interaction.response.send_message(
            f"`{code}` not found in indexed Codex. Full Codex at {SITE_URL}/codex",
            ephemeral=True,
        )
        return
    title, text = entry
    embed = discord.Embed(title=f"{code.upper()} :: {title}", description=text, color=0xDC143C)
    embed.set_footer(text="Sovereign Codex 2854 Edition")
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="resync", description="(OFFICERS) Force re-sync of a member's roles to the Codex.")
@app_commands.describe(target="The operative to re-sync")
async def slash_resync(interaction: discord.Interaction, target: discord.Member):
    invoker_roles = [r.name for r in interaction.user.roles]
    _, invoker_clr = rank_from_role_names(invoker_roles)
    if invoker_clr < 3:
        await interaction.response.send_message("Insufficient clearance. CLR-3+ required.", ephemeral=True)
        return
    ok = await sync_member(target, reason=f"manual_by:{interaction.user.name}")
    msg = f"Re-synced **{target.display_name}** to Sovereign Codex." if ok \
        else f"**{target.display_name}** has no Codex profile yet (must log in to the site once)."
    await interaction.response.send_message(msg, ephemeral=True)

@bot.tree.command(name="ping", description="Check that the Sovereign Comm-Net link is alive.")
async def slash_ping(interaction: discord.Interaction):
    latency_ms = round(bot.latency * 1000)
    await interaction.response.send_message(
        f"COMM-NET online :: latency {latency_ms}ms", ephemeral=True
    )

# ============ ENTRYPOINT ============
if __name__ == "__main__":
    try:
        bot.run(BOT_TOKEN)
    except KeyboardInterrupt:
        log.info("Shutdown requested.")
