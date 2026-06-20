export const Panel = ({ label, code, children, className = "", strong = false, dataTestId }) => {
    return (
        <section
            data-testid={dataTestId}
            className={`chamfer ${strong ? "hud-panel-strong" : "hud-panel"} relative ${className}`}
        >
            {(label || code) && (
                <header className="flex items-center justify-between border-b border-red-600/40 px-5 py-2.5 bg-black/40">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-none alert-pulse" />
                        <h3 className="font-rajdhani uppercase tracking-[0.25em] text-xs md:text-sm text-red-300">
                            {label}
                        </h3>
                    </div>
                    {code && (
                        <span className="text-[10px] font-mono-tech tracking-widest text-zinc-500">
                            {code}
                        </span>
                    )}
                </header>
            )}
            <div className="p-5 md:p-6">{children}</div>
        </section>
    );
};

export const StatBlock = ({ label, value, accent = false, testId }) => (
    <div data-testid={testId} className="border border-red-600/30 chamfer-sm p-3 bg-black/60">
        <div className="text-[10px] font-mono-tech tracking-[0.3em] text-zinc-500 uppercase">{label}</div>
        <div className={`mt-1 font-rajdhani text-2xl md:text-3xl font-bold ${accent ? "text-red-500 glow-red" : "text-white"}`}>
            {value}
        </div>
    </div>
);
