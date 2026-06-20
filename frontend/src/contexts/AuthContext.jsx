import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, SUPABASE_CONFIGURED, toCodexUser } from "../lib/supabase";
import axios from 'axios';

// 1. Define the API instance once.
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', 
    withCredentials: true,
});

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

    // ---------- MOCK PATH ----------
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
                        const { data: row } = await supabase.from("sato_profiles").select("*").eq("id", codex.id).maybeSingle();
                        const merged = { ...codex, ...res.data.profile, ...(row || {}) };
                        setUser(merged);
                        return;
                    }
                } catch (e) {
                    console.warn("sync-roles failed, falling back to direct upsert:", e?.message);
                }
            }

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
        const res = await api.get("/auth/discord/login");
        window.location.href = res.data.url;
    };

    const completeCallback = async ({ code, mock }) => {
        if (SUPABASE_CONFIGURED) {
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

// 2. Export useAuth exactly once at the bottom.
export const useAuth = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext);
