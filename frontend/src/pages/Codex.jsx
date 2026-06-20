import { useState } from "react";
import { Panel } from "../components/Panel";
import { PREAMBLE, CONSTITUTION, STATUTORY_LAWS, CODEX_ARTICLES } from "../data/codex";
import { ScrollText, Gavel, ListChecks } from "lucide-react";

const TABS = [
    { key: "constitution", label: "Constitution", icon: ScrollText, count: 13 },
    { key: "statutes",     label: "Statutory Laws", icon: Gavel, count: 8 },
    { key: "reference",    label: "Quick Reference", icon: ListChecks, count: 6 },
];

const Tag = ({ children }) => (
    <span className="text-[9px] font-mono-tech tracking-widest border border-red-600/40 text-red-300 px-1.5 py-0.5 uppercase">
        {children}
    </span>
);

const ConstitutionView = () => (
    <div className="space-y-6">
        {/* Preamble */}
        <Panel label="Preamble" code="CONST/000" strong dataTestId="preamble">
            <p className="font-rajdhani text-lg md:text-xl text-zinc-100 leading-relaxed italic">
                "{PREAMBLE}"
            </p>
        </Panel>

        {CONSTITUTION.map((art) => (
            <Panel key={art.article} label={`${art.article} :: ${art.title}`} code={art.tags?.[0] || "CONST"} dataTestId={`art-${art.article.replace(/\s+/g, "-").toLowerCase()}`}>
                {art.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {art.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                )}
                <ul className="space-y-4">
                    {art.sections.map((s) => (
                        <li key={s.code} className="border-l-2 border-red-600/70 pl-4">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-mono-tech text-xs text-red-400">{s.code}</span>
                                <span className="font-rajdhani font-bold uppercase tracking-wide text-white">{s.title}</span>
                                {s.tags && s.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                            </div>
                            <p className="text-sm text-zinc-300 mt-1.5 leading-relaxed">{s.text}</p>
                        </li>
                    ))}
                </ul>
            </Panel>
        ))}
    </div>
);

const StatutoryView = () => (
    <div className="space-y-6">
        <Panel label="Statutory Code Index" code="STAT/IDX" strong dataTestId="stat-index">
            <p className="text-sm text-zinc-300 leading-relaxed">
                Statutory law derives its authority from the Constitution and operationalizes its principles into enforceable rules of daily SATO life — from asset management to penal procedure. All citations resolve to the High Tribunal under Article IV.
            </p>
        </Panel>

        <div className="grid lg:grid-cols-2 gap-5">
            {STATUTORY_LAWS.map((law) => (
                <Panel key={law.code} label={`${law.code}. ${law.title}`} code={`STAT-${law.code}`} dataTestId={`stat-${law.code}`}>
                    <ul className="space-y-3">
                        {law.sections.map((s, i) => (
                            <li key={s.title} className="border-l-2 border-red-600/70 pl-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-mono-tech text-[10px] text-red-400">§{law.code}.{i + 1}</span>
                                    <span className="font-rajdhani font-bold uppercase tracking-wide text-white">{s.title}</span>
                                </div>
                                <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{s.text}</p>
                            </li>
                        ))}
                    </ul>
                </Panel>
            ))}
        </div>
    </div>
);

const ReferenceView = () => (
    <div className="grid lg:grid-cols-2 gap-5">
        {CODEX_ARTICLES.map((sec) => (
            <Panel key={sec.section} label={sec.section} code="REF" dataTestId={`ref-${sec.section.split('.')[0].trim()}`}>
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
);

const Codex = () => {
    const [tab, setTab] = useState("constitution");

    return (
        <div className="space-y-6" data-testid="codex-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">06 // Authorized Protocol · 2854 Edition</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">The Sovereign Codex</h1>
                <p className="text-zinc-400 mt-2 max-w-3xl">
                    The complete and binding law of the Solar Associated Treaty Organization — Constitution, Statutory Code,
                    and the Administrative By-laws by which every operative is bound. Violations resolve to the High Tribunal
                    under Article IV.
                </p>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => {
                    const Icon = t.icon;
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            data-testid={`codex-tab-${t.key}`}
                            onClick={() => setTab(t.key)}
                            className={`chamfer-sm px-4 py-2.5 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] border border-red-600/50 flex items-center gap-2 ${
                                active ? "bg-red-600 text-black" : "text-red-300 hover:bg-red-900/30"
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {t.label}
                            <span className={`text-[10px] font-mono-tech px-1 ${active ? "text-black/70" : "text-zinc-500"}`}>
                                ({t.count})
                            </span>
                        </button>
                    );
                })}
            </div>

            {tab === "constitution" && <ConstitutionView />}
            {tab === "statutes" && <StatutoryView />}
            {tab === "reference" && <ReferenceView />}

            <div className="warning-stripes chamfer border border-red-600/40 px-6 py-3 text-center">
                <span className="font-rajdhani uppercase tracking-[0.3em] text-sm text-red-200">
                    Sovereign Codex · Authorized · 2854 Edition · Unauthorized Reproduction Prohibited
                </span>
            </div>
        </div>
    );
};

export default Codex;
