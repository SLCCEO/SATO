import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import HudShell from "@/components/HudShell";
import Home from "@/pages/Home";
import Government from "@/pages/Government";
import Departments from "@/pages/Departments";
import Operations from "@/pages/Operations";
import Personnel from "@/pages/Personnel";
import Codex from "@/pages/Codex";
import Judiciary from "@/pages/Judiciary";
import Archives from "@/pages/Archives";
import Admin from "@/pages/Admin";
import AuthCallback from "@/pages/AuthCallback";
import { Toaster } from "sonner";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="*" element={<HudShell><Home /></HudShell>} />
                        <Route path="/auth/callback" element={<HudShell><AuthCallback /></HudShell>} />
                        <Route path="/" element={<HudShell><Home /></HudShell>} />
                        <Route path="/government" element={<HudShell><Government /></HudShell>} />
                        <Route path="/departments" element={<HudShell><Departments /></HudShell>} />
                        <Route path="/operations" element={<HudShell><Operations /></HudShell>} />
                        <Route path="/personnel" element={<HudShell><Personnel /></HudShell>} />
                        <Route path="/codex" element={<HudShell><Codex /></HudShell>} />
                        <Route path="/judiciary" element={<HudShell><Judiciary /></HudShell>} />
                        <Route path="/archives" element={<HudShell><Archives /></HudShell>} />
                        <Route path="/admin" element={<HudShell><Admin /></HudShell>} />
                    </Routes>
                    <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { background: "#0c0c0e", border: "1px solid rgba(220,20,60,0.5)", color: "#fff" } }} />
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
