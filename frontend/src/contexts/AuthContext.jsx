import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, SUPABASE_CONFIGURED, toCodexUser } from "../lib/supabase";
import axios from 'axios';

// 1. Updated API configuration with explicit base URL
const API_BASE_URL = window.location.hostname === "satoaccord.com" 
    ? "https://api.satoaccord.com/api" 
    : "http://127.0.0.1:8000/api"; // Ensure this matches your FastAPI port

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to fetch full profile including sato_rank and clearance_level
    const fetchPersonnelProfile = async (discordId) => {
        try {
            // Now pointing to the backend that correctly returns sato_rank and clearance_level
            const res = await api.get(`/personnel`); 
            const personnel = res.data.personnel || [];
            const profile = personnel.find(p => String(p.discord_id) === String(discordId));
            return profile || {};
        } catch (e) {
            console.error("Failed to fetch personnel profile:", e);
            return {};
        }
    };

    const upsertProfile = async (codex) => {
        if (!codex) return;
        try {
            // Sync with backend
            const res = await api.post("/discord/sync-roles", {
                user_id: codex.id,
                discord_id: String(codex.discord_id),
                username: codex.username,
                // ... rest of your fields
            });

            // Merge local codex data with backend database data
            const dbProfile = await fetchPersonnelProfile(codex.discord_id);
            const merged = { ...codex, ...res.data?.profile, ...dbProfile };
            setUser(merged);
        } catch (e) {
            console.warn("Profile sync failed:", e.message);
        }
    };

    // ... (keep your existing login, logout, and completeCallback logic)

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, completeCallback }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
