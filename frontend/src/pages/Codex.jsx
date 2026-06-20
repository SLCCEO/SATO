import { Panel } from "../components/Panel";
import { CODEX_ARTICLES } from "../data/sato";

const Codex = () => (
    <div className="space-y-6" data-testid="codex-page">
        <div>
            <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">06 // Authorized Protocol · 2854 Edition</p>
            <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">The Sovereign Codex</h1>
            <p className="text-zinc-400 mt-2 max-w-3xl">
                The complete and binding law of the Solar Associated Treaty Organization. Violations carry sentences ranging from formal censure to permanent exile.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
            {CODEX_ARTICLES.map((sec) => (
                <Panel key={sec.section} label={sec.section} code="LAW" dataTestId={`codex-${sec.section.split('.')[0].trim()}`}>
                    <ul className="space-y-3">
                        {sec.items.map((it) => (
                            <li key={it.code} className="border-l-2 border-red-600/70 pl-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-mono-tech text-xs text-red-400">{it.code}</span>
                                    <span className="font-rajdhani font-bold uppercase tracking-wide text-white">{it.title}</span>
                                </div>
                                <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{it.text}</p>
                            </li>
                        ))}
                    </ul>
                </Panel>
            ))}
        </div>

        <div className="warning-stripes chamfer border border-red-600/40 px-6 py-3 text-center">
            <span className="font-rajdhani uppercase tracking-[0.3em] text-sm text-red-200">
                Sovereign Codex · Authorized · 2854 Edition · Unauthorized Reproduction Prohibited
            </span>
        </div>
    </div>
);

export default Codex;
