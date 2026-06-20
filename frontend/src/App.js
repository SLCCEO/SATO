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
import AuthCallback from "@/pages/AuthCallback";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/auth/callback" element={<HudShell><AuthCallback /></HudShell>} />
                        <Route path="/" element={<HudShell><Home /></HudShell>} />
                        <Route path="/government" element={<HudShell><Government /></HudShell>} />
                        <Route path="/departments" element={<HudShell><Departments /></HudShell>} />
                        <Route path="/operations" element={<HudShell><Operations /></HudShell>} />
                        <Route path="/personnel" element={<HudShell><Personnel /></HudShell>} />
                        <Route path="/codex" element={<HudShell><Codex /></HudShell>} />
                        <Route path="/judiciary" element={<HudShell><Judiciary /></HudShell>} />
                        <Route path="/archives" element={<HudShell><Archives /></HudShell>} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
