import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, LogIn, LogOut, ChevronRight, Radio } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
    { to: "/", label: "01 // OVERVIEW", short: "OVERVIEW" },
    { to: "/government", label: "02 // GOVERNMENT", short: "GOVERNMENT" },
    { to: "/departments", label: "03 // DEPARTMENTS", short: "DEPARTMENTS" },
    { to: "/operations", label: "04 // OPERATIONS", short: "OPERATIONS" },
    { to: "/personnel", label: "05 // PERSONNEL", short: "PERSONNEL" },
    { to: "/codex", label: "06 // CODEX", short: "CODEX" },
    { to: "/judiciary", label: "07 // JUDICIARY", short: "JUDICIARY" },
    { to: "/archives", label: "08 // ARCHIVES", short: "ARCHIVES" },
];

const ADMIN_NAV = { to: "/admin", label: "09 // ADMIN", short: "ADMIN" };

function useClock() {
    const [t, setT] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setT(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return t;
}

const HudShell = ({ children }) => {
    const { user, login, logout } = useAuth();
    const loc = useLocation();
    const clock = useClock();
    const stardate = `2854.${String(clock.getUTCMonth() + 1).padStart(2, "0")}.${String(clock.getUTCDate()).padStart(2, "0")}`;
    const utc = clock.toISOString().substring(11, 19);
    const nav = (user?.clearance_level >= 5) ? [...NAV, ADMIN_NAV] : NAV;

    return (
        <div className="scanlines min-h-screen text-white">
            {/* TOP BAR */}
            <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-red-600/40">
                <div className="flex items-center justify-between px-4 md:px-8 py-2 text-[11px] font-mono-tech tracking-widest text-red-400">
                    <div className="flex items-center gap-4">
                        <span className="text-red-600 alert-pulse">● LIVE</span>
                        <span className="hidden md:inline">STARDATE {stardate}</span>
                        <span className="hidden md:inline">UTC {utc}</span>
                        <span className="hidden lg:inline">SECTOR: PYRO / KEEGER</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">CLEARANCE: {user?.clearance_level || 0}/5</span>
                        <span className="text-zinc-500">|</span>
                        <span className="text-red-500">SOVEREIGN EYES ONLY</span>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 md:px-8 py-3 border-t border-red-600/30">
                    <Link to="/" className="flex items-center gap-3" data-testid="logo-home">
                        <div className="relative w-12 h-12 chamfer-sm hud-panel-strong flex items-center justify-center overflow-hidden">
                            <img
                                src="/logos/SATO512.png"
                                alt="SATO"
                                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
                                className="w-full h-full object-contain p-0.5"
                                style={{ filter: "drop-shadow(0 0 8px rgba(220,20,60,0.6))" }}
                            />
                            <Shield className="w-5 h-5 text-red-500" strokeWidth={2.5} style={{ display: "none" }} />
                        </div>
                        <div className="leading-none">
                            <div className="font-rajdhani text-xl font-bold tracking-widest text-white">S A T O</div>
                            <div className="text-[10px] font-mono-tech tracking-[0.3em] text-red-400">SOVEREIGN ACCORD</div>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-3" data-testid="user-hud">
                                <div className="hidden md:flex flex-col items-end leading-tight">
                                    <span className="text-xs font-mono-tech text-red-300">{user.global_name || user.username}</span>
                                    <span className="text-[10px] text-zinc-400 tracking-widest">{user.sato_rank} · CLR-{user.clearance_level}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    data-testid="logout-button"
                                    className="chamfer-sm border border-red-600/60 px-3 py-2 text-xs font-mono-tech uppercase tracking-widest hover:bg-red-600 hover:text-black transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-3.5 h-3.5" /> Stand Down
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                data-testid="discord-login-button"
                                className="chamfer-sm bg-red-600 text-black px-4 py-2 text-xs font-rajdhani font-bold uppercase tracking-[0.25em] hover:bg-red-500 transition-colors flex items-center gap-2"
                            >
                                <LogIn className="w-3.5 h-3.5" /> Declare Allegiance
                            </button>
                        )}
                    </div>
                </div>

                {/* NAV */}
                <nav className="border-t border-red-600/30 bg-black/80">
                    <div className="px-2 md:px-6 overflow-x-auto">
                        <ul className="flex items-stretch gap-0 min-w-max">
                            {nav.map((n) => {
                                const active = loc.pathname === n.to;
                                return (
                                    <li key={n.to}>
                                        <NavLink
                                            to={n.to}
                                            data-testid={`nav-${n.to === "/" ? "home" : n.to.slice(1)}`}
                                            className={`block px-4 py-2.5 text-[11px] font-rajdhani font-semibold tracking-[0.2em] uppercase border-r border-red-600/20 transition-colors glitch ${
                                                active
                                                    ? "bg-red-600 text-black"
                                                    : "text-red-300 hover:bg-red-900/30 hover:text-white"
                                            }`}
                                        >
                                            {n.label}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </header>

            <main className="px-4 md:px-8 py-8 max-w-[1600px] mx-auto">
                {children}
            </main>

            <footer className="border-t border-red-600/30 bg-black/80 px-4 md:px-8 py-6 mt-12">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] font-mono-tech text-red-400 tracking-widest uppercase">
                    <div className="flex items-center gap-3">
                        <Radio className="w-4 h-4 text-red-500" />
                        <span>SECURE CHANNEL // SOVEREIGN COMM-NET</span>
                    </div>
                    <div className="text-zinc-500">
                        © 2854 SOLAR ASSOCIATED TREATY ORGANIZATION · CODEX 2854 EDITION
                    </div>
                    <div className="flex items-center gap-2 text-red-500">
                        <ChevronRight className="w-3 h-3" /> CLASSIFIED // SOVEREIGN EYES ONLY
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HudShell;
