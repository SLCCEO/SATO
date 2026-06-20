from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Annotated
from datetime import datetime, timezone, timedelta
import httpx
import jwt
from urllib.parse import urlencode

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ============ ENV ============
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
DISCORD_CLIENT_ID = os.environ.get('DISCORD_CLIENT_ID', '')
DISCORD_CLIENT_SECRET = os.environ.get('DISCORD_CLIENT_SECRET', '')
DISCORD_REDIRECT_URI = os.environ.get('DISCORD_REDIRECT_URI', '')
DISCORD_BOT_TOKEN = os.environ.get('DISCORD_BOT_TOKEN', '')
DISCORD_GUILD_ID = os.environ.get('DISCORD_GUILD_ID', '')
JWT_SECRET = os.environ.get('JWT_SECRET', 'change_me')
FRONTEND_URL = os.environ.get('FRONTEND_URL', '')

MOCK_MODE = (
    not DISCORD_CLIENT_ID
    or DISCORD_CLIENT_ID.startswith('PLACEHOLDER')
    or not DISCORD_CLIENT_SECRET
    or DISCORD_CLIENT_SECRET.startswith('PLACEHOLDER')
)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="SATO Sovereign Codex API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("sato")

# ============ MODELS ============
class CodexUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str  # discord user id (or mock id)
    username: str
    discriminator: Optional[str] = None
    global_name: Optional[str] = None
    avatar: Optional[str] = None
    email: Optional[str] = None
    roles: List[str] = Field(default_factory=list)
    sato_rank: str = "RECRUIT"
    clearance_level: int = 1
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_seen: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Operation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    codename: str
    sector: str
    status: str  # ACTIVE | STANDBY | COMPLETED | RED_ALERT
    threat_level: int  # 1-5
    objective: str
    commanding_officer: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class JudiciaryRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    case_no: str
    defendant: str
    charge: str
    verdict: str  # GUILTY | NOT_GUILTY | EXILED | PENDING
    sentence: str
    article: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============ AUTH HELPERS ============
def create_jwt(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_jwt(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except Exception:
        return None


async def get_current_user(request: Request) -> Optional[CodexUser]:
    token = request.cookies.get("sato_session")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        return None
    user_id = decode_jwt(token)
    if not user_id:
        return None
    doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not doc:
        return None
    return CodexUser(**doc)


CurrentUser = Annotated[Optional[CodexUser], Depends(get_current_user)]


def rank_from_roles(roles: List[str]) -> tuple[str, int]:
    """Map Discord role names to SATO ranks + clearance."""
    role_lower = [r.lower() for r in roles]
    if any("president" in r or "high council" in r for r in role_lower):
        return ("HIGH COUNCIL", 5)
    if any("admiral" in r or "command" in r for r in role_lower):
        return ("FLEET COMMAND", 4)
    if any("officer" in r or "lieutenant" in r or "captain" in r for r in role_lower):
        return ("OFFICER", 3)
    if any("marine" in r or "soldier" in r or "operator" in r for r in role_lower):
        return ("OPERATOR", 2)
    return ("RECRUIT", 1)


# ============ ROUTES: ROOT ============
@api_router.get("/")
async def root():
    return {"service": "SATO Sovereign Codex", "status": "ONLINE", "mock_mode": MOCK_MODE}


@api_router.get("/status")
async def status_check():
    return {"status": "OPERATIONAL", "timestamp": datetime.now(timezone.utc).isoformat()}


# ============ ROUTES: DISCORD AUTH ============
@api_router.get("/auth/discord/login")
async def discord_login(request: Request):
    """Returns redirect URL for Discord OAuth or mock-mode URL."""
    state = secrets.token_urlsafe(16)
    if MOCK_MODE:
        # Return mock login URL pointing to our callback with mock=1
        cb = f"{FRONTEND_URL}/auth/callback?mock=1&state={state}"
        return {"url": cb, "mock": True}
    params = {
        "client_id": DISCORD_CLIENT_ID,
        "redirect_uri": DISCORD_REDIRECT_URI,
        "response_type": "code",
        "scope": "identify email guilds guilds.members.read",
        "state": state,
    }
    url = f"https://discord.com/api/oauth2/authorize?{urlencode(params)}"
    return {"url": url, "mock": False}


@api_router.post("/auth/discord/callback")
async def discord_callback(payload: dict, response: Response):
    """Exchange code for token, fetch user + guild roles, persist, set session cookie."""
    code = payload.get("code")
    mock = payload.get("mock", False)

    if mock or MOCK_MODE:
        # Generate deterministic mock identities for demo
        mock_users = [
            {"id": "mock_001", "username": "Jeremiah_YT", "global_name": "President Jeremiah",
             "avatar": None, "email": "president@sato.mil",
             "roles": ["High Council", "President", "Fleet Command"]},
            {"id": "mock_002", "username": "VoidSentinel", "global_name": "Adm. Vex Halloran",
             "avatar": None, "email": "vhalloran@sato.mil",
             "roles": ["Admiral", "Fleet Command", "Navy"]},
            {"id": "mock_003", "username": "GriffinStrike", "global_name": "Cpt. Mara Tully",
             "avatar": None, "email": "mtully@sato.mil",
             "roles": ["Captain", "Marine Corps", "Officer"]},
            {"id": "mock_004", "username": "GhostWire", "global_name": "Operator Ka'el",
             "avatar": None, "email": "kael@sato.mil",
             "roles": ["Operator", "Intel"]},
        ]
        import random
        u = random.choice(mock_users)
        rank, clearance = rank_from_roles(u["roles"])
        user = CodexUser(
            id=u["id"], username=u["username"], global_name=u["global_name"],
            avatar=u["avatar"], email=u["email"], roles=u["roles"],
            sato_rank=rank, clearance_level=clearance,
            last_seen=datetime.now(timezone.utc),
        )
    else:
        if not code:
            raise HTTPException(400, "Missing code")
        async with httpx.AsyncClient(timeout=15.0) as http:
            token_res = await http.post(
                "https://discord.com/api/oauth2/token",
                data={
                    "client_id": DISCORD_CLIENT_ID,
                    "client_secret": DISCORD_CLIENT_SECRET,
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": DISCORD_REDIRECT_URI,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if token_res.status_code != 200:
                raise HTTPException(400, f"Discord token exchange failed: {token_res.text}")
            tok = token_res.json()
            access_token = tok["access_token"]

            user_res = await http.get(
                "https://discord.com/api/users/@me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            duser = user_res.json()

            role_names: List[str] = []
            if DISCORD_GUILD_ID and DISCORD_BOT_TOKEN:
                member_res = await http.get(
                    f"https://discord.com/api/guilds/{DISCORD_GUILD_ID}/members/{duser['id']}",
                    headers={"Authorization": f"Bot {DISCORD_BOT_TOKEN}"},
                )
                if member_res.status_code == 200:
                    member = member_res.json()
                    role_ids = member.get("roles", [])
                    guild_roles_res = await http.get(
                        f"https://discord.com/api/guilds/{DISCORD_GUILD_ID}/roles",
                        headers={"Authorization": f"Bot {DISCORD_BOT_TOKEN}"},
                    )
                    if guild_roles_res.status_code == 200:
                        id_to_name = {r["id"]: r["name"] for r in guild_roles_res.json()}
                        role_names = [id_to_name.get(rid, rid) for rid in role_ids]

        rank, clearance = rank_from_roles(role_names)
        user = CodexUser(
            id=duser["id"],
            username=duser.get("username", "unknown"),
            discriminator=duser.get("discriminator"),
            global_name=duser.get("global_name"),
            avatar=duser.get("avatar"),
            email=duser.get("email"),
            roles=role_names,
            sato_rank=rank,
            clearance_level=clearance,
            last_seen=datetime.now(timezone.utc),
        )

    doc = user.model_dump()
    doc["joined_at"] = doc["joined_at"].isoformat()
    doc["last_seen"] = doc["last_seen"].isoformat()
    await db.users.update_one(
        {"id": user.id},
        {"$set": doc, "$setOnInsert": {"first_seen": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )

    token = create_jwt(user.id)
    response.set_cookie(
        "sato_session", token,
        httponly=True, secure=True, samesite="none",
        max_age=60 * 60 * 24 * 7, path="/",
    )
    return {"user": user.model_dump(), "token": token}


@api_router.get("/auth/me")
async def me(user: CurrentUser):
    if not user:
        raise HTTPException(401, "Not authenticated")
    return user.model_dump()


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("sato_session", path="/")
    return {"ok": True}


# ============ ROUTES: PERSONNEL ============
@api_router.get("/personnel")
async def personnel_list(user: CurrentUser):
    cursor = db.users.find({}, {"_id": 0}).sort("clearance_level", -1).limit(200)
    docs = await cursor.to_list(200)
    # Mask sensitive info unless current user has clearance >= 3
    can_see_email = bool(user and user.clearance_level >= 3)
    out = []
    for d in docs:
        if not can_see_email:
            d.pop("email", None)
        out.append(d)
    return out


# ============ ROUTES: OPERATIONS ============
async def seed_operations():
    count = await db.operations.count_documents({})
    if count > 0:
        return
    seed = [
        Operation(id="op_001", codename="IRON CORRIDOR SWEEP", sector="Pyro / Keeger Belt",
                  status="ACTIVE", threat_level=4,
                  objective="Interdict hostile signatures along the Iron Corridor mining lanes.",
                  commanding_officer="Adm. Vex Halloran"),
        Operation(id="op_002", codename="GHOST WIRE PROTOCOL", sector="Stanton / Crusader",
                  status="STANDBY", threat_level=2,
                  objective="Field-test stealth dampener arrays. Total comms blackout.",
                  commanding_officer="Dr. Sera Voss"),
        Operation(id="op_003", codename="WHITE-CROSS ESCORT", sector="Nyx / Levski",
                  status="ACTIVE", threat_level=3,
                  objective="Neutral medical convoy escort. Engage only on Tier 1 violation.",
                  commanding_officer="Cpt. Mara Tully"),
        Operation(id="op_004", codename="DARK VOID RED ALERT", sector="Classified",
                  status="RED_ALERT", threat_level=5,
                  objective="UI masking enforced. Sovereign-eyes intelligence operation in progress.",
                  commanding_officer="High Council"),
        Operation(id="op_005", codename="KEEGER REQUISITION", sector="Keeger Belt",
                  status="COMPLETED", threat_level=2,
                  objective="Industrial yield secured. 25% sovereign tax applied to yields.",
                  commanding_officer="SATO LOG Command"),
    ]
    for op in seed:
        d = op.model_dump()
        d["timestamp"] = d["timestamp"].isoformat()
        await db.operations.insert_one(d)


@api_router.get("/operations")
async def list_ops():
    await seed_operations()
    docs = await db.operations.find({}, {"_id": 0}).to_list(100)
    return docs


# ============ ROUTES: JUDICIARY ============
async def seed_judiciary():
    count = await db.judiciary.count_documents({})
    if count > 0:
        return
    seed = [
        JudiciaryRecord(id="cs_001", case_no="SATO-T-2854-001", defendant="Pvt. R. Caine",
                        charge="High Treason - leaking fleet coordinates",
                        verdict="EXILED", sentence="Permanent exile / asset confiscation",
                        article="Code 4.2"),
        JudiciaryRecord(id="cs_002", case_no="SATO-T-2854-014", defendant="Unknown / 'Vandal-7'",
                        charge="White-Cross violation",
                        verdict="GUILTY", sentence="Open Tier 1 War Crime bounty",
                        article="Art 2.2"),
        JudiciaryRecord(id="cs_003", case_no="SATO-T-2854-022", defendant="Ens. K. Solari",
                        charge="Unauthorized 5KM buffer breach",
                        verdict="GUILTY", sentence="30-day flight restriction, formal censure",
                        article="Art 2.1"),
        JudiciaryRecord(id="cs_004", case_no="SATO-T-2854-031", defendant="Cpl. T. Drexler",
                        charge="Discrimination - Art 5.3 violation",
                        verdict="EXILED", sentence="Immediate exile, no appeal",
                        article="Art 5.3"),
        JudiciaryRecord(id="cs_005", case_no="SATO-T-2854-040", defendant="External 'Black Sun Co.'",
                        charge="Unauthorized salvage in SATO battle site",
                        verdict="PENDING", sentence="Tribunal scheduled - sector lockdown",
                        article="Art 6.4"),
    ]
    for r in seed:
        d = r.model_dump()
        d["timestamp"] = d["timestamp"].isoformat()
        await db.judiciary.insert_one(d)


@api_router.get("/judiciary")
async def list_judiciary():
    await seed_judiciary()
    docs = await db.judiciary.find({}, {"_id": 0}).to_list(100)
    return docs


# ============ ROUTES: ARCHIVES ============
@api_router.get("/archives")
async def archives():
    # Static historical entries representing past operations
    return [
        {"id": "ar_001", "year": "2851", "title": "The Sovereign Accord Signing",
         "summary": "Founders ratify the Sovereign Codex aboard the SATOS 'Tideborn'."},
        {"id": "ar_002", "year": "2852", "title": "First Keeger Claim",
         "summary": "SATO asserts sovereignty over the Keeger Belt. UEE protest filed and ignored."},
        {"id": "ar_003", "year": "2853", "title": "Operation: Iron Wolves",
         "summary": "Five-ship pirate cartel dismantled. Marine Corps 'Griffin Strike' inaugurated."},
        {"id": "ar_004", "year": "2853", "title": "Ghost Wire Prototype Online",
         "summary": "Science Division demonstrates first stealth-dampener capable corvette."},
        {"id": "ar_005", "year": "2854", "title": "Codex 2854 Edition Ratified",
         "summary": "Current authorized protocol takes effect across all SATO territory."},
    ]


# ============ INCLUDE ============
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
