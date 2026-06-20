import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { api } from "../lib/api";
import { Radar, AlertOctagon } from "lucide-react";

const statusColor = (s) => ({
    ACTIVE: "text-red-400",
    STANDBY: "text-yellow-300",
    COMPLETED: "text-zinc-400",
    RED_ALERT: "text-red-500 alert-pulse",
}[s] || "text-white");

const Operations = () => {
    const [ops, setOps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/operations").then((r) => { setOps(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6" data-testid="operations-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">04 // Live Theaters</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Operations</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">Active fleet operations across SATO territory. Refresh every cycle. Red-Alert designators are sovereign-eyes only.</p>
            </div>

            <Panel label="Tactical Overview" code="TAC/HUD" dataTestId="tac-hud">
                <div className="grid sm:grid-cols-4 gap-3 text-center">
                    {[
                        { l: "ACTIVE", v: ops.filter(o => o.status === "ACTIVE").length, c: "text-red-400" },
                        { l: "STANDBY", v: ops.filter(o => o.status === "STANDBY").length, c: "text-yellow-300" },
                        { l: "RED ALERT", v: ops.filter(o => o.status === "RED_ALERT").length, c: "text-red-500 alert-pulse" },
                        { l: "COMPLETED", v: ops.filter(o => o.status === "COMPLETED").length, c: "text-zinc-300" },
                    ].map((x) => (
                        <div key={x.l} className="chamfer-sm border border-red-600/30 p-4 bg-black/60">
                            <div className={`font-rajdhani text-4xl font-bold ${x.c}`}>{String(x.v).padStart(2, "0")}</div>
                            <div className="text-[10px] font-mono-tech tracking-[0.3em] text-zinc-500 uppercase">{x.l}</div>
                        </div>
                    ))}
                </div>
            </Panel>

            {loading ? (
                <p className="text-red-400 font-terminal">> querying SATO COMM-NET ...</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-5">
                    {ops.map((op) => (
                        <Panel key={op.id} label={op.codename} code={op.id.toUpperCase()} dataTestId={`op-${op.id}`}>
                            <div className="flex items-start gap-4">
                                <div className="chamfer-sm hud-panel-strong w-12 h-12 flex items-center justify-center shrink-0">
                                    {op.status === "RED_ALERT" ? <AlertOctagon className="w-5 h-5 text-red-500" /> : <Radar className="w-5 h-5 text-red-500" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`text-xs font-rajdhani font-bold tracking-widest uppercase ${statusColor(op.status)}`}>{op.status.replace("_", " ")}</span>
                                        <span className="text-[10px] font-mono-tech tracking-widest text-zinc-500">THREAT {Array(op.threat_level).fill("▲").join("")}</span>
                                    </div>
                                    <p className="text-xs font-mono-tech text-zinc-400 mt-1">Sector: {op.sector}</p>
                                    <p className="text-sm text-zinc-200 mt-3 leading-relaxed">{op.objective}</p>
                                    <div className="divider-red mt-4" />
                                    <p className="mt-2 text-[11px] font-mono-tech tracking-widest text-red-300 uppercase">
                                        CO :: {op.commanding_officer}
                                    </p>
                                </div>
                            </div>
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Operations;
