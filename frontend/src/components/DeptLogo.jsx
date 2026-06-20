import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { logoUrl } from "../data/sato";

const DeptLogo = ({ file, name, size = 56 }) => {
    const [errored, setErrored] = useState(false);
    const src = logoUrl(file);
    if (!src || errored) {
        return (
            <div
                className="chamfer-sm hud-panel-strong flex items-center justify-center shrink-0"
                style={{ width: size, height: size }}
            >
                <ShieldCheck className="w-1/2 h-1/2 text-red-500" strokeWidth={2.5} />
            </div>
        );
    }
    return (
        <div
            className="chamfer-sm hud-panel-strong flex items-center justify-center shrink-0 overflow-hidden"
            style={{ width: size, height: size }}
        >
            <img
                src={src}
                alt={name}
                onError={() => setErrored(true)}
                className="w-full h-full object-contain p-1"
                style={{ filter: "drop-shadow(0 0 8px rgba(220,20,60,0.45))" }}
            />
        </div>
    );
};

export default DeptLogo;
