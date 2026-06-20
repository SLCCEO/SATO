import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { useAuth } from "../contexts/AuthContext";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabase";
import { Trash2, Save, Lock, Crown, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { RANK_HIERARCHY } from "../data/ranks";

// --- CONSTANTS ---
const TABLES = [
    {
        key: "sato_operations",
        label: "Operations",
        idLabel: "ID",
        fields: [
            { name: "id", placeholder: "op_006", required: true },
            { name: "codename", placeholder: "OPERATION CODENAME" },
            { name: "sector", placeholder: "Stanton / ArcCorp" },
            { name: "status", type: "select", options: ["ACTIVE", "STANDBY", "COMPLETED", "RED_ALERT"] },
            { name: "threat_level", type: "number", placeholder: "1-5" },
            { name: "objective", type: "textarea", placeholder: "Mission objective..." },
            { name: "commanding_officer", placeholder: "Cpt. Name" },
        ],
    },
    {
        key: "sato_judiciary",
        label: "Judiciary",
        idLabel: "Case ID",
        fields: [
            { name: "id", placeholder: "cs_006", required: true },
            { name: "case_no", placeholder: "SATO-T-2854-XXX" },
            { name: "defendant", placeholder: "Defendant name" },
            { name: "charge", type: "textarea", placeholder: "Charges..." },
            { name: "verdict", type: "select", options: ["PENDING", "GUILTY", "NOT_GUILTY", "EXILED"] },
            { name: "sentence", type: "textarea", placeholder: "Sentence details..." },
            { name: "article", placeholder: "Art X.Y" },
        ],
    },
    {
        key: "sato_archives",
        label: "Archives",
        idLabel: "Entry ID",
        fields: [
            { name: "id", placeholder: "ar_006", required: true },
            { name: "year", placeholder: "2855" },
            { name: "title", placeholder: "Event title" },
            { name: "summary", type: "textarea", placeholder: "Historical summary..." },
        ],
    },
];

// --- HELPER COMPONENTS ---
const Field = ({ field, value, onChange }) => {
    const common = "w-full bg-black/60 border border-red-600/40 chamfer-sm px-3 py-2 text-sm text-white font-mono-tech focus:border-red-500 focus:outline-none";
    if (field.type === "textarea") return <textarea className={common + " min-h-[70px]"} placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />;
    if (field.type === "select") return (
        <select className={common} value={value || ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">— select —</option>
            {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    );
    return <input type={field.type || "text"} className={common} placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) || "" : e.target.value)} />;
};

const AdminTable = ({ table, rows, refresh }) => {
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);
    const setField = (n, v) => setForm((p) => ({ ...p, [n]: v }));

    const save = async () => {
        if (!form.id) return toast.error("ID is required");
        const { error } = await supabase.from(table.key).upsert(form, { onConflict: "id" });
        if (error) return toast.error(`Save failed: ${error.message}`);
        toast.success(editing ? "Entry updated" : "Entry created");
        setForm({}); setEditing(null); refresh();
    };

    const remove = async (id) => {
        if (!window.confirm(`Permanently destroy entry ${id}?`)) return;
        const { error } = await supabase.from(table.key).delete().eq("id", id);
        if (error) return toast.error(`Delete failed: ${error.message}`);
        toast.success("Entry purged"); refresh();
    };

    return (
        <div className="space-y-4">
            <Panel label={editing ? `EDIT ${table.label} :: ${editing}` : `CREATE NEW ${table.label} ENTRY`} code={table.key} strong>
                <div className="grid md:grid-cols-2 gap-3">
                    {table.fields.map((f) => (
                        <label key={f.name} className="block">
                            <span className="text-[10px] font-mono-tech tracking-widest text-zinc-400 uppercase">{f.name}</span>
                            <Field field={f} value={form[f.name]} onChange={(v) => setField(f.name, v)} />
                        </label>
                    ))}
                </div>
                <button onClick={save} className="mt-4 chamfer-sm bg-red-600 text-black px-4 py-2 text-xs font-bold uppercase">{editing ? "Update" : "Create"}</button>
            </Panel>
            <Panel label={`${table.label} :: ${rows.length} ENTRIES`} code="LIVE">
                <table className="w-full text-sm">
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id} className="border-b border-red-600/10">
                                <td className="py-2 text-red-300">{r.id}</td>
                                <td className="py-2 text-zinc-200">{r.codename || r.title || r.case_no}</td>
                                <td className="py-2"><button onClick={() => { setForm(r); setEditing(r.id); }} className="text-red-400">edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Panel>
        </div>
    );
};

const PersonnelEditor = ({ rows, refresh, currentUserId }) => {
    const updateRow = async (id, patch) => {
        const { error } = await supabase.from("sato_profiles").update(patch).eq("id", id);
        if (error) return toast.error("Update failed");
        toast.success("Operative updated"); refresh();
    };

    return (
        <Panel label="Personnel Registry" code="OWNER/MGMT" strong>
            <table className="w-full text-sm">
                {rows.map((r) => (
                    <tr key={r.id}>
                        <td>{r.username}</td>
                        <td><select value={r.clearance_level} onChange={(e) => updateRow(r.id, { clearance_level: Number(e.target.value) })}><option value="1">1</option><option value="5">5</option></select></td>
                    </tr>
                ))}
            </table>
        </Panel>
    );
};

// --- MAIN COMPONENT ---
const Admin = () => {
    const { user, refresh: refreshAuth } = useAuth();
    const [active, setActive] = useState("sato_operations");
    const [data, setData] = useState({ sato_operations: [], sato_judiciary: [], sato_archives: [], sato_profiles: [] });

    const refresh = async () => {
        if (!SUPABASE_CONFIGURED) return;
        const [ops, jud, arc, prof] = await Promise.all([
            supabase.from("sato_operations").select("*"),
            supabase.from("sato_judiciary").select("*"),
            supabase.from("sato_archives").select("*"),
            supabase.from("sato_profiles").select("*"),
        ]);
        setData({ sato_operations: ops.data || [], sato_judiciary: jud.data || [], sato_archives: arc.data || [], sato_profiles: prof.data || [] });
    };

    useEffect(() => {
        refresh();
        const channel = supabase.channel('admin-realtime').on('postgres_changes', { event: '*', schema: 'public' }, () => refresh()).subscribe();
        return () => supabase.removeChannel(channel);
    }, [user?.id]);

    if (!SUPABASE_CONFIGURED || !user || (!user.is_owner && user.clearance_level < 5)) return <Panel label="ACCESS DENIED" code="CLR-ERR" />;

    const activeTable = TABLES.find((t) => t.key === active);

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold uppercase">Admin</h1>
            <div className="flex gap-2">
                {TABLES.map((t) => <button key={t.key} onClick={() => setActive(t.key)} className="px-4 py-2 bg-red-600">{t.label}</button>)}
            </div>
            {active === "sato_profiles" ? <PersonnelEditor rows={data.sato_profiles} refresh={refresh} /> : <AdminTable table={activeTable} rows={data[active]} refresh={refresh} />}
        </div>
    );
};

export default Admin;
