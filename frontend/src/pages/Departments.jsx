import { Panel } from "../components/Panel";
import { DEPARTMENTS } from "../data/sato";
import DeptLogo from "../components/DeptLogo";

const Departments = () => (
    <div className="space-y-6" data-testid="departments-page">
        <div>
            <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">03 // State Wings</p>
            <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Departments</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl">Functional wings of the Sovereign Accord. Each department operates under direct High Council authority.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {DEPARTMENTS.map((d) => (
                <Panel key={d.slug} label={d.cipher} code={d.code} dataTestId={`dept-${d.slug}`}>
                    <div className="flex items-start gap-4">
                        <DeptLogo file={d.logo_file} name={d.name} size={64} />
                        <div>
                            <h3 className="font-rajdhani text-2xl font-bold text-white tracking-wide">{d.name}</h3>
                            <p className="text-xs font-mono-tech text-zinc-500 uppercase tracking-widest mt-0.5">{d.code}</p>
                            <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{d.desc}</p>
                        </div>
                    </div>
                    <div className="divider-red mt-5" />
                    <div className="mt-3 flex justify-between text-[10px] font-mono-tech tracking-widest text-zinc-500 uppercase">
                        <span>Status: <span className="text-red-400">OPERATIONAL</span></span>
                        <span>Authority: HIGH COUNCIL</span>
                    </div>
                </Panel>
            ))}
        </div>
    </div>
);

export default Departments;
