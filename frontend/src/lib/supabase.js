import { createClient } from "@supabase/supabase-js";
import { rankFromRoles as _rankFromRoles } from "../data/ranks";

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

export const rankFromRoles = _rankFromRoles;

// Map a Supabase Discord-auth user into a SATO CodexUser shape
export const toCodexUser = (sbUser) => {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const appMeta = sbUser.app_metadata || {};
    const roles = appMeta.discord_roles || meta.discord_roles || [];
    const { rank, clearance, branch } = rankFromRoles(roles);
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
        branch,
        is_owner: false,
        manual_lock: false,
        last_seen: new Date().toISOString(),
    };
};
