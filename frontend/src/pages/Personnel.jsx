import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { dataSource } from "../lib/dataSource";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";

const Personnel = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, login } = useAuth();

    useEffect(() => {
        // FIX 1: Ensure we are always setting an array, even if the API returns an object
        dataSource.listPersonnel()
            .then((d) => { 
                setList(Array.isArray(d) ? d : (d.data || [])); 
                setLoading(false); 
            })
            .catch(() => {
                setList([]);
                setLoading(false);
            });
    }, [user]);

    return (
        <div className="space-y-6" data-testid="personnel-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">05 // Roster</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Personnel</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">Active SATO operatives. Ranks are auto-synced from Discord assignments. Email & ID are restricted to Clearance ≥ 3.</p>
            </div>

            {!user && (
                <div className="warning-stripes chamfer border border-red-600/40 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-rajdhani uppercase tracking-widest text-sm text-red-200">
                        Auth required to view full roster details. Declare allegiance via Discord.
                    </span>
                    <button
                        onClick={login}
                        data-testid="personnel-login-prompt"
                        className="chamfer-sm bg-red-600 text-black px-4 py-2 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] hover:bg-red-500"
                    >
                        Authenticate
                    </button>
                </div>
            )}

            <Panel label="Active Operatives" code={loading ? "ROSTER/---" : `ROSTER/${(list.length).toString().padStart(3, "0")}`} dataTestId="roster-panel">
                {loading ? (
                    <p className="text-red-400 font-terminal">> fetching encrypted roster ...</p>
                ) : list.length === 0 ? (
                    <p className="text-zinc-400 text-sm">
                        No operatives indexed yet. Authenticate to register the first sovereign citizen of the Accord.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[10px] font-mono-tech tracking-widest text-zinc-500 uppercase border-b border-red-600/30">
                                    <th className="py-2 pr-4">Sig</th>
                                    <th className="py-2 pr-4">Operative</th>
                                    <th className="py-2 pr-4">Rank</th>
                                    <th className="py-2 pr-4">CLR</th>
                                    <th className="py-2 pr-4">Roles</th>
                                    <th className="py-2 pr-4">Last Pulse</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* FIX 2: Added optional chaining as an extra safety measure */}
                                {list?.map((p) => (
                                    <tr key={p.id} data-testid={`roster-row-${p.id}`} className="border-b border-red-600/10 hover:bg-red-900/10">
                                        <td className="py-3 pr-4">
                                            <div className="chamfer-sm w-8 h-8 hud-panel-strong flex items-center justify-center">
                                                <User className="w-4 h-4 text-red-500" />
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="font-rajdhani font-bold text-white">{p.global_name || p.username}</div>
                                            <div className="text-[10px] font-mono-tech text-zinc-500">@{p.username}</div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="border border-red-600/50 px-2 py-0.5 text-[10px] font-mono-tech tracking-widest text-red-300">
                                                {p.sato_rank}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-red-400 font-rajdhani font-bold">
                                            {p.clearance_level}/5
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(p.roles || []).slice(0, 4).map((r) => (
                                                    <span key={r} className="text-[10px] font-mono-tech bg-red-900/30 border border-red-600/30 px-1.5 py-0.5">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-zinc-400 text-[11px] font-mono-tech">
                                            {p.last_seen ? new Date(p.last_seen).toISOString().substring(0, 16).replace("T", " ") : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>
        </div>
    );
};

export default Personnel;
