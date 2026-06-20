import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL =
window.location.hostname === "satoaccord.com"
? "https://api.satoaccord.com/api"
: "http://127.0.0.1:8000/api";

const api = axios.create({
baseURL: API_BASE_URL,
withCredentials: true,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

```
const fetchPersonnelProfile = async (discordId) => {
    try {
        const res = await api.get("/personnel");

        const personnel = res.data.personnel || [];

        return (
            personnel.find(
                (p) => String(p.discord_id) === String(discordId)
            ) || {}
        );
    } catch (e) {
        console.error("Failed to fetch personnel profile:", e);
        return {};
    }
};

const login = useCallback(async () => {
    try {
        const res = await api.get("/auth/discord/login");

        if (res.data?.url) {
            window.location.href = res.data.url;
        } else {
            throw new Error("No Discord login URL returned");
        }
    } catch (e) {
        console.error("Discord login failed:", e);
    }
}, []);

const logout = useCallback(async () => {
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.error("Logout failed:", e);
    }

    setUser(null);
}, []);

const completeCallback = useCallback(async ({ code }) => {
    if (!code) {
        throw new Error("No authorization code provided");
    }

    const res = await api.post("/auth/discord/callback", {
        code,
    });

    const discordUser = res.data.user;

    if (!discordUser) {
        throw new Error("No Discord user returned");
    }

    const dbProfile = await fetchPersonnelProfile(discordUser.id);

    const mergedUser = {
        id: discordUser.id,
        discord_id: discordUser.id,
        username: discordUser.username,
        global_name: discordUser.global_name,
        avatar: discordUser.avatar,
        email: discordUser.email,
        sato_rank: dbProfile.sato_rank || "RECRUIT",
        clearance_level: dbProfile.clearance_level || 0,
        ...dbProfile,
    };

    setUser(mergedUser);

    return mergedUser;
}, []);

const checkSession = useCallback(async () => {
    try {
        const res = await api.get("/auth/me");

        if (res.data?.authenticated) {
            setUser(res.data.user);
        } else {
            setUser(null);
        }
    } catch (e) {
        setUser(null);
    } finally {
        setLoading(false);
    }
}, []);

useEffect(() => {
    checkSession();
}, [checkSession]);

return (
    <AuthContext.Provider
        value={{
            user,
            loading,
            login,
            logout,
            completeCallback,
        }}
    >
        {children}
    </AuthContext.Provider>
);
```

};

export const useAuth = () => {
const context = useContext(AuthContext);

```
if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
}

return context;
```

};

