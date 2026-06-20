import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { supabase, SUPABASE_CONFIGURED, toCodexUser } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode] = useState(SUPABASE_CONFIGURED ? "supabase" : "mock");

    // ---------- SUPABASE PATH ----------
    useEffect(() => {
        if (!SUPABASE_CONFIGURED) return;
        let sub;
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const codex = toCodexUser(session.user);
                setUser(codex);
                await upsertProfile(codex);
            }
            setLoading(false);
            sub = supabase.auth.onAuthStateChange(async (_event, sess) => {
                if (sess?.user) {
                    const codex = toCodexUser(sess.user);
                    setUser(codex);
                    await upsertProfile(codex);
                } else {
                    setUser(null);
                }
            });
        })();
        return () => { sub?.data?.subscription?.unsubscribe?.(); };
    }, []);

    // ---------- MOCK PATH (no supabase keys yet) ----------
    const refreshMock = useCallback(async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (SUPABASE_CONFIGURED) return;
        refreshMock();
    }, [refreshMock]);

    const upsertProfile = async (codex) => {
        if (!codex) return;
        try {
            // 1) Ask backend to pull Discord guild roles via bot token + write to sato_profiles
            const { data: { session } } = await supabase.auth.getSession();
            const discordId = session?.user?.user_metadata?.provider_id
                || session?.user?.user_metadata?.sub
                || codex.discord_id;
            if (discordId) {
                try {
                    const res = await api.post("/discord/sync-roles", {
                        user_id: codex.id,
                        discord_id: String(discordId),
                        username: codex.username,
                        global_name: codex.global_name,
                        avatar: codex.avatar,
                        email: codex.email,
                    });
                    if (res.data?.profile) {
                        // 1a) re-read from supabase to pick up is_owner/manual_lock flags
                        const { data: row } = await supabase.from("sato_profiles").select("*").eq("id", codex.id).maybeSingle();
                        const merged = { ...codex, ...res.data.profile, ...(row || {}) };
                        setUser(merged);
                        return;
                    }
                } catch (e) {
                    console.warn("sync-roles failed, falling back to direct upsert:", e?.message);
                }
            }

            // 2) Direct fallback (no guild-role enrichment)
            await supabase.from("sato_profiles").upsert({
                id: codex.id,
                discord_id: codex.discord_id,
                username: codex.username,
                global_name: codex.global_name,
                avatar: codex.avatar,
                email: codex.email,
                roles: codex.roles,
                sato_rank: codex.sato_rank,
                clearance_level: codex.clearance_level,
                last_seen: codex.last_seen,
            }, { onConflict: "id" });

            // re-read to pick up is_owner/manual_lock
            const { data: row } = await supabase.from("sato_profiles").select("*").eq("id", codex.id).maybeSingle();
            if (row) setUser((prev) => ({ ...prev, ...row }));
        } catch (e) {
            console.warn("sato_profiles upsert skipped:", e.message);
        }
    };

    const login = async () => {
        if (SUPABASE_CONFIGURED) {
            await supabase.auth.signInWithOAuth({
                provider: "discord",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    scopes: "identify email guilds",
                },
            });
            return;
        }
        // mock fallback
        const res = await api.get("/auth/discord/login");
        window.location.href = res.data.url;
    };

    const completeCallback = async ({ code, mock }) => {
        if (SUPABASE_CONFIGURED) {
            // Supabase handles the code automatically via detectSessionInUrl
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const codex = toCodexUser(session.user);
                setUser(codex);
                await upsertProfile(codex);
                return codex;
            }
            return null;
        }
        const res = await api.post("/auth/discord/callback", { code, mock: !!mock });
        if (res.data?.token) localStorage.setItem("sato_token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        if (SUPABASE_CONFIGURED) {
            await supabase.auth.signOut();
            setUser(null);
            return;
        }
        try { await api.post("/auth/logout"); } catch (e) { /* noop */ }
        localStorage.removeItem("sato_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, completeCallback, mode, refresh: refreshMock }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
