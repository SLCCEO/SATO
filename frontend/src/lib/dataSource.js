import { supabase, SUPABASE_CONFIGURED } from "./supabase";
import { api } from "./api";

// Unified data layer: prefers Supabase when configured, else falls back to FastAPI mock.
export const dataSource = {
    configured: SUPABASE_CONFIGURED,

    async listOperations() {
        if (SUPABASE_CONFIGURED) {
            const { data, error } = await supabase
                .from("sato_operations")
                .select("*")
                .order("threat_level", { ascending: false });
            if (!error && data?.length) return data;
        }
        const r = await api.get("/operations");
        return r.data;
    },

    async listJudiciary() {
        if (SUPABASE_CONFIGURED) {
            const { data, error } = await supabase
                .from("sato_judiciary")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data?.length) return data;
        }
        const r = await api.get("/judiciary");
        return r.data;
    },

    async listArchives() {
        if (SUPABASE_CONFIGURED) {
            const { data, error } = await supabase
                .from("sato_archives")
                .select("*")
                .order("year", { ascending: true });
            if (!error && data?.length) return data;
        }
        const r = await api.get("/archives");
        return r.data;
    },

    async listPersonnel() {
        if (SUPABASE_CONFIGURED) {
            const { data, error } = await supabase
                .from("sato_profiles")
                .select("*")
                .order("clearance_level", { ascending: false });
            if (!error && data) return data;
        }
        const r = await api.get("/personnel");
        return r.data;
    },
};
