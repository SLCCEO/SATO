import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { useAuth } from "../contexts/AuthContext";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabase";
import { Plus, Trash2, Save, Lock } from "lucide-react";
import { toast } from "sonner";

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

const Field = ({ field, value, onChange }) => {
    const common = "w-full bg-black/60 border border-red-600/40 chamfer-sm px-3 py-2 text-sm text-white font-mono-tech focus:border-red-500 focus:outline-none";
    if (field.type === "textarea") {
        return <textarea data-testid={`field-${field.name}`} className={common + " min-h-[70px]"} placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />;
    }
    if (field.type === "select") {
        return (
            <select data-testid={`field-${field.name}`} className={common} value={value || ""} onChange={(e) => onChange(e.target.value)}>
                <option value="">— select —</option>
                {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        );
    }
    return <input data-testid={`field-${field.name}`} type={field.type || "text"} className={common} placeholder={field.placeholder} value={value || ""} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) || "" : e.target.value)} />;
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
        setForm({}); setEditing(null);
        refresh();
    };

    const remove = async (id) => {
        if (!window.confirm(`Permanently destroy entry ${id}?`)) return;
        const { error } = await supabase.from(table.key).delete().eq("id", id);
        if (error) return toast.error(`Delete failed: ${error.message}`);
        toast.success("Entry purged");
        refresh();
    };

    const edit = (row) => { setForm(row); setEditing(row.id); window.scrollTo({ top: 0, behavior: "smooth" }); };

    return (
        <div className="space-y-4">
            <Panel
                label={editing ? `EDIT ${table.label} :: ${editing}` : `CREATE NEW ${table.label} ENTRY`}
                code={table.key}
                strong
                dataTestId={`admin-form-${table.key}`}
            >
                <div className="grid md:grid-cols-2 gap-3">
                    {table.fields.map((f) => (
                        <label key={f.name} className="block">
                            <span className="text-[10px] font-mono-tech tracking-widest text-zinc-400 uppercase">
                                {f.name}{f.required && <span className="text-red-500">*</span>}
                            </span>
                            <div className="mt-1">
                                <Field field={f} value={form[f.name]} onChange={(v) => setField(f.name, v)} />
                            </div>
                        </label>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={save}
                        data-testid={`save-${table.key}`}
                        className="chamfer-sm bg-red-600 text-black px-4 py-2 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] hover:bg-red-500 flex items-center gap-2"
                    >
                        <Save className="w-3.5 h-3.5" /> {editing ? "Update" : "Create"}
                    </button>
                    {editing && (
                        <button
                            onClick={() => { setForm({}); setEditing(null); }}
                            data-testid={`cancel-${table.key}`}
                            className="chamfer-sm border border-red-600/50 px-4 py-2 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] hover:bg-red-900/30"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </Panel>

            <Panel label={`${table.label} :: ${rows.length} ENTRIES`} code="LIVE">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[10px] font-mono-tech tracking-widest text-zinc-500 uppercase border-b border-red-600/30">
                                <th className="py-2 pr-3">ID</th>
                                <th className="py-2 pr-3">Summary</th>
                                <th className="py-2 pr-3 w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id} className="border-b border-red-600/10 hover:bg-red-900/10" data-testid={`row-${table.key}-${r.id}`}>
                                    <td className="py-2 pr-3 text-red-300 font-mono-tech">{r.id}</td>
                                    <td className="py-2 pr-3 text-zinc-200">{r.codename || r.title || r.case_no || ""}</td>
                                    <td className="py-2 pr-3">
                                        <div className="flex gap-2">
                                            <button data-testid={`edit-${r.id}`} onClick={() => edit(r)} className="text-xs text-red-400 hover:text-red-200 uppercase tracking-widest font-rajdhani">edit</button>
                                            <button data-testid={`delete-${r.id}`} onClick={() => remove(r.id)} className="text-xs text-red-500 hover:text-red-300 uppercase tracking-widest font-rajdhani flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" /> purge
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    );
};

const Admin = () => {
    const { user } = useAuth();
    const [active, setActive] = useState(TABLES[0].key);
    const [data, setData] = useState({ sato_operations: [], sato_judiciary: [], sato_archives: [] });

    const refresh = async () => {
        if (!SUPABASE_CONFIGURED) return;
        const [ops, jud, arc] = await Promise.all([
            supabase.from("sato_operations").select("*").order("threat_level", { ascending: false }),
            supabase.from("sato_judiciary").select("*").order("created_at", { ascending: false }),
            supabase.from("sato_archives").select("*").order("year", { ascending: true }),
        ]);
        setData({
            sato_operations: ops.data || [],
            sato_judiciary: jud.data || [],
            sato_archives: arc.data || [],
        });
    };

    useEffect(() => { refresh(); }, [user?.id]);

    // GATE: must be CLR-5 + Supabase live
    if (!SUPABASE_CONFIGURED) {
        return (
            <Panel label="Admin Unavailable" code="DENIED" strong dataTestId="admin-gate-nosupabase">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                        <p className="text-zinc-200">
                            Supabase publishable key is not configured. The admin panel writes to Supabase tables and cannot run in mock mode.
                        </p>
                        <p className="text-xs font-mono-tech text-zinc-500 mt-2">
                            Add <code className="text-red-400">REACT_APP_SUPABASE_PUBLISHABLE_KEY</code> to <code>/app/frontend/.env</code> and restart frontend.
                        </p>
                    </div>
                </div>
            </Panel>
        );
    }
    if (!user) {
        return (
            <Panel label="Authentication Required" code="DENIED" strong dataTestId="admin-gate-anon">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-500 mt-1" />
                    <p className="text-zinc-200">Sovereign authentication required. Declare allegiance via Discord OAuth.</p>
                </div>
            </Panel>
        );
    }
    if (user.clearance_level < 5) {
        return (
            <Panel label="Insufficient Clearance" code="DENIED" strong dataTestId="admin-gate-clr">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-500 mt-1 alert-pulse" />
                    <div>
                        <p className="text-zinc-200">
                            Your current clearance is <span className="text-red-400 font-rajdhani font-bold">CLR-{user.clearance_level}</span>.
                            The Sovereign Codex Admin Console requires <span className="text-red-400 font-rajdhani font-bold">CLR-5</span> (President, Vice President, or Grand Marshal).
                        </p>
                        <p className="text-[10px] font-mono-tech text-zinc-500 mt-2 tracking-widest uppercase">
                            Your roles: {(user.roles || []).join(", ") || "none"}
                        </p>
                    </div>
                </div>
            </Panel>
        );
    }

    const activeTable = TABLES.find((t) => t.key === active);

    return (
        <div className="space-y-6" data-testid="admin-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">09 // Sovereign Console</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Admin</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                    High Council write-access to Operations, Judiciary records, and Archive entries. All changes are immediate and authoritative under Codex Art 1.1.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {TABLES.map((t) => (
                    <button
                        key={t.key}
                        data-testid={`tab-${t.key}`}
                        onClick={() => setActive(t.key)}
                        className={`chamfer-sm px-4 py-2 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] border border-red-600/50 ${
                            active === t.key ? "bg-red-600 text-black" : "text-red-300 hover:bg-red-900/30"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <AdminTable table={activeTable} rows={data[active]} refresh={refresh} />
        </div>
    );
};

export default Admin;
