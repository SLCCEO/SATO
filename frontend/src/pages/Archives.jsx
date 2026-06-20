import { useEffect, useState } from "react";
import { Panel } from "../components/Panel";
import { dataSource } from "../lib/dataSource";
import { BookOpen } from "lucide-react";

const Archives = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dataSource.listArchives()
            .then((d) => {
                // Ensure we handle both direct arrays and objects that contain an array
                setItems(Array.isArray(d) ? d : (d.archives || []));
                setLoading(false);
            })
            .catch(() => {
                setItems([]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6" data-testid="archives-page">
            <div>
                <p className="text-[10px] tracking-[0.4em] text-red-400 uppercase">08 // Historical Vault</p>
                <h1 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-tight">Archives</h1>
                <p className="text-zinc-400 mt-2 max-w-2xl">Declassified records of significant SATO operations, treaties, and turning points.</p>
            </div>

            <div className="relative pl-6">
                <div className="absolute left-0 top-1 bottom-1 w-px bg-red-600/40" />
                
                {loading ? (
                    <p className="text-red-400 font-terminal text-sm">> accessing vault records ...</p>
                ) : (Array.isArray(items) ? items : []).map((it) => (
                    <div key={it.id} className="relative mb-6" data-testid={`archive-${it.id}`}>
                        <div className="absolute -left-[14px] top-2 w-3 h-3 bg-red-600 rotate-45" />
                        <Panel label={it.title} code={it.year}>
                            <div className="flex items-start gap-4">
                                <div className="chamfer-sm hud-panel-strong w-12 h-12 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-zinc-200 text-sm leading-relaxed">{it.summary}</p>
                            </div>
                        </Panel>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Archives;
