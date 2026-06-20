import { useEffect, useState } from "react";
import { Panel, StatBlock } from "../components/Panel";
import { ASCII_BANNER, DEPARTMENTS } from "../data/sato";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, AlertTriangle, Scroll } from "lucide-react";
import { Link } from "react-router-dom";

const TYPING_LINES = [
    "> initiating sovereign codex...",
    "> handshake with COMM-NET node 7.2.A ............ OK",
    "> verifying clearance signature ................. OK",
    "> mounting tactical overlay ..................... OK",
    "> WELCOME, OPERATIVE.",
];

const TypedTerminal = () => {
    const [lines, setLines] = useState([""]);
    useEffect(() => {
        let i = 0, j = 0;
        const id = setInterval(() => {
            setLines((prev) => {
                const next = [...prev];
                if (i >= TYPING_LINES.length) return prev;
                if (j <= TYPING_LINES[i].length) {
                    next[i] = TYPING_LINES[i].slice(0, j);
                    j += 2;
                } else {
                    i += 1; j = 0;
                    if (i < TYPING_LINES.length) next.push("");
                }
                return next;
            });
            if (i >= TYPING_LINES.length) clearInterval(id);
        }, 35);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="font-terminal text-xl md:text-2xl text-red-400 leading-tight">
            {lines.map((l, idx) => (
                <div key={idx} className={idx === lines.length - 1 ? "cursor" : ""}>{l || "\u00A0"}</div>
            ))}
        </div>
    );
};

const Home = () => {
    const { user, login } = useAuth();
    return (
        <div className="space-y-8" data-testid="home-page">
            {/* HERO */}
            <section className="relative chamfer hud-panel-strong overflow-hidden boot-reveal">
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage: "url('https://images.pexels.com/photos/30547574/pexels-photo-30547574.jpeg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "grayscale(1) sepia(0.5) hue-rotate(-50deg) contrast(1.2)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/95 pointer-events-none" />
                <div className="relative px-6 md:px-12 py-12 md:py-20">
                    <pre className="text-red-500 text-[10px] md:text-xs font-terminal whitespace-pre overflow-x-auto">{ASCII_BANNER}</pre>
                    <div className="mt-6 flex items-center gap-3">
                        <span className="classified-stamp text-xs">Sovereign Eyes Only</span>
                        <span className="text-[10px] font-mono-tech text-zinc-400 tracking-widest uppercase">
                            Type: Independent Militarized Power
                        </span>
                    </div>

                    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-rajdhani font-bold tracking-tight text-white">
                        THE <span className="text-red-500 glow-red">SOVEREIGN ACCORD</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base md:text-lg text-zinc-300 leading-relaxed">
                        A nomadic, sovereign military force maintaining its own laws, borders, and lethal authority beyond UEE reach.
                        We are the <span className="text-red-400">Solar Associated Treaty Organization</span>. We answer to no flag but our own.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {!user && (
                            <button
                                onClick={login}
                                data-testid="hero-declare-allegiance"
                                className="chamfer-sm bg-red-600 text-black px-6 py-3 font-rajdhani font-bold uppercase tracking-[0.25em] text-sm hover:bg-red-500 transition-all flex items-center gap-2"
                            >
                                Declare Allegiance <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        <Link
                            to="/codex"
                            data-testid="hero-review-codex"
                            className="chamfer-sm border border-red-600/60 text-red-300 px-6 py-3 font-rajdhani font-bold uppercase tracking-[0.25em] text-sm hover:bg-red-900/30 transition-all flex items-center gap-2"
                        >
                            Review The Laws <Scroll className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBlock testId="stat-personnel" label="ENLISTED" value="1,247" />
                <StatBlock testId="stat-active-ops" label="ACTIVE OPS" value="03" accent />
                <StatBlock testId="stat-fleet" label="CAPITAL HULLS" value="22" />
                <StatBlock testId="stat-tax" label="GOV TAX" value="25%" />
            </div>

            {/* TERMINAL + INTEL */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Panel label="Terminal" code="VT/001" className="lg:col-span-2" dataTestId="terminal-panel">
                    <TypedTerminal />
                    <div className="divider-red mt-6" />
                    <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Primary Directive</div>
                            <p className="mt-1 text-zinc-200">Set SATO as your Primary Organization (Art 1.3). Pulse logs required every 30 days.</p>
                        </div>
                        <div>
                            <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Current Red Alert</div>
                            <p className="mt-1 text-red-300 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Dark Void Protocol active — Sector classified.</p>
                        </div>
                    </div>
                </Panel>

                <Panel label="State Wings" code="DEPT/IDX" dataTestId="dept-mini-panel">
                    <ul className="space-y-2">
                        {DEPARTMENTS.slice(0, 7).map((d) => (
                            <li key={d.slug} className="flex items-center justify-between border-b border-red-600/15 pb-2">
                                <Link to="/departments" data-testid={`mini-dept-${d.slug}`} className="text-sm text-zinc-200 hover:text-red-400 glitch">
                                    <span className="text-red-500 font-mono-tech text-xs mr-2">{d.cipher}</span>
                                    {d.name}
                                </Link>
                                <span className="text-[10px] font-mono-tech text-zinc-500">{d.code}</span>
                            </li>
                        ))}
                    </ul>
                </Panel>
            </div>

            {/* BANNER STRIPE */}
            <div className="warning-stripes chamfer border border-red-600/40 px-6 py-3 flex flex-wrap items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-red-500 alert-pulse" />
                <span className="font-rajdhani uppercase tracking-[0.25em] text-sm text-red-200">
                    Notice: Unauthorized approach within 5KM of any SATO Capital ship constitutes a hostile act (Art 2.1)
                </span>
            </div>
        </div>
    );
};

export default Home;
