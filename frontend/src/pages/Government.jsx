import { Panel } from "../components/Panel";
import { GOVERNMENT } from "../data/sato";
import { Crown } from "lucide-react";

const branchColor = (branch) => ({
    "Executive Cabinet": "border-red-600/70",
    "Marine Corps": "border-red-500/70",
}[branch] || "border-red-600/40");

const Government = () => (
    <div className="space-y-6" data-testid="government-page">
        <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">02 // High Command</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">The Government</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">
                    Sovereign authority rests with the Executive Cabinet and Marine Corps high command.
                    Each seat carries a defined mandate, clearance tier, and chain of command.
                </p>
            </div>
            <span className="classified-stamp text-xs">Tier-1 Disclosure</span>
        </div>

        {/* THE EXECUTIVE CABINET */}
        <div>
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-widest text-red-300 mb-3">// The Executive Cabinet</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {GOVERNMENT.filter((g) => g.branch === "Executive Cabinet").map((g, i) => (
                    <Panel key={g.title} label={g.title} code={`EC-${String(i + 1).padStart(2, "0")} / CLR-${g.clearance}`} dataTestId={`gov-${g.rank.replace(/\s+/g, "-").toLowerCase()}`}>
                        <div className="flex items-start gap-4">
                            <div className={`chamfer-sm hud-panel-strong w-12 h-12 flex items-center justify-center shrink-0 border ${branchColor(g.branch)}`}>
                                <Crown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-rajdhani font-bold text-xl text-white">{g.rank}</span>
                                </div>
                                <p className="text-[10px] font-mono-tech tracking-widest text-red-400 mt-1 uppercase">{g.branch} · Clearance {g.clearance}/5</p>
                                <p className="mt-3 text-sm text-zinc-200 leading-relaxed">{g.mandate}</p>
                            </div>
                        </div>
                    </Panel>
                ))}
            </div>
        </div>

        {/* MARINE CORPS HIGH COMMAND */}
        <div>
            <h2 className="font-rajdhani text-2xl font-bold uppercase tracking-widest text-red-300 mb-3 mt-8">// Marine Corps · High Command</h2>
            <div className="grid md:grid-cols-2 gap-5">
                {GOVERNMENT.filter((g) => g.branch === "Marine Corps").map((g, i) => (
                    <Panel key={g.title} label={g.title} code={`MC-${String(i + 1).padStart(2, "0")} / CLR-${g.clearance}`} dataTestId={`gov-${g.rank.replace(/\s+/g, "-").toLowerCase()}`}>
                        <div className="flex items-start gap-4">
                            <div className="chamfer-sm hud-panel-strong w-12 h-12 flex items-center justify-center shrink-0 border-red-500/70">
                                <Crown className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <span className="font-rajdhani font-bold text-xl text-white">{g.rank}</span>
                                <p className="text-[10px] font-mono-tech tracking-widest text-red-400 mt-1 uppercase">{g.branch} · Clearance {g.clearance}/5</p>
                                <p className="mt-3 text-sm text-zinc-200 leading-relaxed">{g.mandate}</p>
                            </div>
                        </div>
                    </Panel>
                ))}
            </div>
        </div>

        {/* RANK HIERARCHY SUMMARY */}
        <Panel label="Complete Rank Hierarchy" code="HIER/REF" dataTestId="rank-hierarchy">
            <div className="grid md:grid-cols-4 gap-5 text-sm">
                <div>
                    <div className="font-rajdhani font-bold text-red-300 tracking-widest uppercase mb-2 text-xs">// Executive Cabinet (CLR 4-5)</div>
                    <ul className="space-y-1 text-zinc-200">
                        <li>President of SATO</li>
                        <li>Vice President of SATO</li>
                        <li>Chief of Naval Operations</li>
                        <li>Chief Technical Officer</li>
                        <li>Director of Intelligence</li>
                        <li>High Admiral of Logistics</li>
                        <li>Trade Minister</li>
                    </ul>
                </div>
                <div>
                    <div className="font-rajdhani font-bold text-red-300 tracking-widest uppercase mb-2 text-xs">// Officer Corps (CLR 3)</div>
                    <ul className="space-y-1 text-zinc-200">
                        <li>Commander</li>
                        <li>Recruitment Officer</li>
                        <li>Lieutenant</li>
                        <li>Operations Officer</li>
                        <li>Intelligence Officer</li>
                    </ul>
                </div>
                <div>
                    <div className="font-rajdhani font-bold text-red-300 tracking-widest uppercase mb-2 text-xs">// Marine Corps</div>
                    <ul className="space-y-1 text-zinc-200">
                        <li>Marine (CLR 2)</li>
                        <li>Commander (CLR 3)</li>
                        <li>Brigadier (CLR 4)</li>
                        <li>Grand Marshal (CLR 5)</li>
                    </ul>
                </div>
                <div>
                    <div className="font-rajdhani font-bold text-red-300 tracking-widest uppercase mb-2 text-xs">// Enlisted & Civilian (CLR 1-2)</div>
                    <ul className="space-y-1 text-zinc-200">
                        <li>Cadet</li>
                        <li>Crewman</li>
                        <li>Medical Personnel</li>
                        <li>Vanguard</li>
                        <li className="pt-2 text-[10px] tracking-widest text-zinc-500">// Civil Registry</li>
                        <li>Citizen of SATO</li>
                        <li>Merchant Pilot</li>
                        <li>Foreign Consultant</li>
                    </ul>
                </div>
            </div>
        </Panel>
    </div>
);

export default Government;
