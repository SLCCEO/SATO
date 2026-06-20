import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const login = async () => {
        const res = await api.get("/auth/discord/login");
        window.location.href = res.data.url;
    };

    const completeCallback = async ({ code, mock }) => {
        const res = await api.post("/auth/discord/callback", { code, mock: !!mock });
        if (res.data?.token) {
            localStorage.setItem("sato_token", res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        try { await api.post("/auth/logout"); } catch (e) { /* noop */ }
        localStorage.removeItem("sato_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refresh, completeCallback }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
