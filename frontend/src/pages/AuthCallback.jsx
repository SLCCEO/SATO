import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
    const [params] = useSearchParams();
    const { completeCallback } = useAuth();
    const nav = useNavigate();
    const [msg, setMsg] = useState("Authenticating with Discord COMM-NET...");
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        const code = params.get("code");
        const mock = params.get("mock");
        (async () => {
            try {
                await completeCallback({ code, mock });
                setMsg("Allegiance accepted. Redirecting to roster...");
                setTimeout(() => nav("/personnel"), 700);
            } catch (e) {
                setMsg("Authentication failed. Returning to overview...");
                setTimeout(() => nav("/"), 1500);
            }
        })();
    }, [params, completeCallback, nav]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center" data-testid="auth-callback">
            <div className="font-terminal text-2xl text-red-400 cursor">{msg}</div>
            <div className="mt-6 text-[10px] font-mono-tech tracking-[0.3em] text-zinc-500 uppercase">
                Sovereign Codex Handshake // OAuth 2.0
            </div>
        </div>
    );
};

export default AuthCallback;
