import { Panel } from "../components/Panel";
import { GOVERNMENT } from "../data/sato";
import { Crown } from "lucide-react";

const Government = () => (
    <div className="space-y-6" data-testid="government-page">
        <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">02 // High Command</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">The Government</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                    Sovereign authority rests with the High Council. Command flows downward through Fleet, Marines, Intel, Judiciary, and Industrial branches.
                </p>
            </div>
            <span className="classified-stamp text-xs">Tier-1 Disclosure</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
            {GOVERNMENT.map((g, i) => (
                <Panel
                    key={g.title}
                    label={g.title}
                    code={`${String(i + 1).padStart(2, "0")} / HC-${g.clearance}`}
                    dataTestId={`gov-${g.rank.toLowerCase()}`}
                >
                    <div className="flex items-start gap-4">
                        <div className="chamfer-sm hud-panel-strong w-14 h-14 flex items-center justify-center shrink-0">
                            <Crown className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-rajdhani font-bold text-2xl text-white">{g.occupant}</span>
                                <span className="text-[10px] font-mono-tech tracking-widest text-red-400 border border-red-600/50 px-2 py-0.5">
                                    {g.rank}
                                </span>
                            </div>
                            <p className="text-xs font-mono-tech text-zinc-400 mt-1">{g.dept} · Clearance {g.clearance}/5</p>
                            <p className="mt-3 text-sm text-zinc-200 leading-relaxed">{g.mandate}</p>
                        </div>
                    </div>
                </Panel>
            ))}
        </div>
    </div>
);

export default Government;
