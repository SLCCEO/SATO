import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { dataSource } from "../lib/dataSource";
import { Gavel } from "lucide-react";

const verdictColor = (v) => ({
    GUILTY: "text-red-400",
    EXILED: "text-red-500 alert-pulse",
    NOT_GUILTY: "text-zinc-300",
    PENDING: "text-yellow-300",
}[v] || "text-white");

const Judiciary = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dataSource.listJudiciary().then(d => { setRecords(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6" data-testid="judiciary-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">07 // Tribunal</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Judiciary</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">Sovereign Tribunal proceedings. Verdicts under the authority of the Magistrate per the Sovereign Codex.</p>
            </div>

            {loading ? (
                <p className="text-red-400 font-terminal">> fetching tribunal records ...</p>
            ) : (
                <div className="space-y-4">
                    {records.map((r) => (
                        <Panel key={r.id} label={r.case_no} code={r.article} dataTestId={`case-${r.id}`}>
                            <div className="flex items-start gap-4">
                                <div className="chamfer-sm hud-panel-strong w-12 h-12 flex items-center justify-center shrink-0">
                                    <Gavel className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1 grid md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-widest">Defendant</div>
                                        <div className="font-rajdhani text-xl font-bold text-white">{r.defendant}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-widest">Charge</div>
                                        <div className="text-zinc-200 text-sm mt-1">{r.charge}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-widest">Verdict</div>
                                        <div className={`font-rajdhani text-2xl font-bold tracking-widest ${verdictColor(r.verdict)}`}>{r.verdict.replace("_", " ")}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider-red mt-5" />
                            <p className="mt-3 text-sm text-zinc-300">
                                <span className="text-[10px] font-mono-tech text-zinc-500 tracking-widest uppercase mr-2">Sentence:</span>
                                {r.sentence}
                            </p>
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Judiciary;
