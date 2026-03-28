import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Zap, Shield, CheckCircle, Bell, Download } from "lucide-react";

// ─── Styles ───────────────────────────────────────────────
const S = {
  bg:"#0a0f1e",
  panel:"rgba(255,255,255,0.03)",
  border:"rgba(255,255,255,0.07)",
  text:"#e2e8f0",
  muted:"#64748b",
};

// ─── Demo Data ─────────────────────────────────────────────
const DEMO_IDENTITIES = [
  { id:"ID-001", type:"human", name:"sarah.chen", risk:12, status:"active", accessCount:24 },
  { id:"ID-002", type:"ai_agent", name:"ai-agent-01", risk:91, status:"flagged", accessCount:147 },
  { id:"ID-003", type:"service", name:"svc-payment", risk:97, status:"flagged", accessCount:34 },
  { id:"ID-004", type:"orphan", name:"ghost-user", risk:88, status:"orphan", accessCount:18 },
];

// ✅ FIXED: computed metrics (replaces kTotal etc.)
const metrics = (() => {
  const total = DEMO_IDENTITIES.length;
  const orphans = DEMO_IDENTITIES.filter(i => i.status === "orphan").length;
  const aiAgents = DEMO_IDENTITIES.filter(i => i.type === "ai_agent").length;
  const toxic = DEMO_IDENTITIES.filter(i => i.risk >= 90).length;

  const humans = DEMO_IDENTITIES.filter(i => i.type === "human").length;
  const ratio = humans > 0 ? `${Math.round((total - humans)/humans)}:1` : "N/A";

  return { total, orphans, aiAgents, toxic, ratio };
})();

// ─── Components ────────────────────────────────────────────
function Card({ children }: any) {
  return (
    <div style={{
      background:S.panel,
      border:`1px solid ${S.border}`,
      borderRadius:10,
      padding:"1rem"
    }}>
      {children}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function DemoDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ background:S.bg, minHeight:"100vh", color:S.text }}>
      <Header/>

      <div style={{ padding:"2rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <h1>Demo Dashboard</h1>
          <div>
            {user ? (
              <button onClick={()=>{logout();navigate("/login")}}>Logout</button>
            ) : (
              <button onClick={()=>navigate("/login")}>Login</button>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1rem", marginTop:"2rem" }}>
          <Card>Total: {metrics.total}</Card>
          <Card>Orphans: {metrics.orphans}</Card>
          <Card>AI Agents: {metrics.aiAgents}</Card>
          <Card>Toxic: {metrics.toxic}</Card>
          <Card>Ratio: {metrics.ratio}</Card>
        </div>

        {/* Table */}
        <Card>
          <table style={{ width:"100%", marginTop:"1rem" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Risk</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {/* ✅ FIXED: removed activeIds */}
              {DEMO_IDENTITIES.map(i => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.type}</td>
                  <td>{i.risk}</td>
                  {/* ✅ FIXED: removed permissions */}
                  <td>{i.accessCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Timer */}
        <div style={{ marginTop:"2rem" }}>
          Deployment Time: {time}s
        </div>

      </div>

      <Footer/>
    </div>
  );
}