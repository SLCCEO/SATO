import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_CONFIGURED =
    !!SUPABASE_URL &&
    !!SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_PUBLISHABLE_KEY.startsWith("PLACEHOLDER");

export const supabase = SUPABASE_CONFIGURED
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
              storageKey: "sato.sb.auth",
          },
      })
    : null;

// Map a Supabase Discord-auth user into a SATO CodexUser shape
export const toCodexUser = (sbUser) => {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const appMeta = sbUser.app_metadata || {};
    const roles = appMeta.discord_roles || meta.discord_roles || [];
    const { rank, clearance } = rankFromRoles(roles);
    return {
        id: sbUser.id,
        discord_id: meta.provider_id || meta.sub || null,
        username: meta.user_name || meta.preferred_username || meta.name || (sbUser.email?.split("@")[0]) || "operative",
        global_name: meta.full_name || meta.name || null,
        avatar: meta.avatar_url || null,
        email: sbUser.email || null,
        roles,
        sato_rank: rank,
        clearance_level: clearance,
        last_seen: new Date().toISOString(),
    };
};

export const rankFromRoles = (roles = []) => {
    const lower = roles.map((r) => String(r).toLowerCase());
    if (lower.some((r) => r.includes("president") || r.includes("high council"))) {
        return { rank: "HIGH COUNCIL", clearance: 5 };
    }
    if (lower.some((r) => r.includes("admiral") || r.includes("command"))) {
        return { rank: "FLEET COMMAND", clearance: 4 };
    }
    if (lower.some((r) => r.includes("officer") || r.includes("lieutenant") || r.includes("captain"))) {
        return { rank: "OFFICER", clearance: 3 };
    }
    if (lower.some((r) => r.includes("marine") || r.includes("operator") || r.includes("soldier"))) {
        return { rank: "OPERATOR", clearance: 2 };
    }
    return { rank: "RECRUIT", clearance: 1 };
};
