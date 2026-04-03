import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, AlertTriangle, CheckCircle, Shield, TrendingDown, Users, Bot, ChevronRight, Zap } from "lucide-react";

const TENANTS = [
  { id: "T-001", name: "Acme Financial Corp", industry: "Banking", employees: 4800, identities: 18200, risk: 34, status: "healthy", orphans: 12, ai_agents: 142, incidents: 0, mrr: "$4,200" },
  { id: "T-002", name: "Meridian Health Systems", industry: "Healthcare", employees: 2100, identities: 7400, risk: 71, status: "warning", orphans: 47, ai_agents: 38, incidents: 2, mrr: "$2,800" },
  { id: "T-003", name: "Vertex SaaS Platform", industry: "Technology", employees: 680, identities: 2900, risk: 28, status: "healthy", orphans: 3, ai_agents: 201, incidents: 0, mrr: "$1,400" },
  { id: "T-004", name: "Cascade Logistics Inc", industry: "Supply Chain", employees: 3400, identities: 9800, risk: 88, status: "critical", orphans: 134, ai_agents: 67, incidents: 5, mrr: "$3,100" },
  { id: "T-005", name: "NovaBridge Insurance", industry: "Insurance", employees: 1200, identities: 4100, risk: 45, status: "warning", orphans: 28, ai_agents: 19, incidents: 1, mrr: "$1,900" },
  { id: "T-006", name: "Stellar EdTech", industry: "Education", employees: 420, identities: 1600, risk: 19, status: "healthy", orphans: 2, ai_agents: 54, incidents: 0, mrr: "$800" },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string; label: string }> = {
  healthy: { color: "#10b981", bg: "#10b98110", border: "#10b98125", label: "Healthy" },
  warning: { color: "#f59e0b", bg: "#f59e0b10", border: "#f59e0b25", label: "Warning" },
  critical: { color: "#ef4444", bg: "#ef444410", border: "#ef444425", label: "Critical" },
};

function riskBar(val: number) {
  const color = val >= 70 ? "#ef4444" : val >= 45 ? "#f59e0b" : "#10b981";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <div style={{ flex: 1, height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val}%`, backgroundColor: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: "1.0625rem", fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{val}</span>
    </div>
  );
}

export default function MSPConsole() {
  const [selected, setSelected] = useState<typeof TENANTS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = TENANTS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.industry.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = TENANTS.reduce((sum, t) => sum + parseInt(t.mrr.replace(/\D/g, "")), 0);
  const criticalTenants = TENANTS.filter(t => t.status === "critical").length;
  const totalIdentities = TENANTS.reduce((sum, t) => sum + t.identities, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "1rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.2rem" }}>MSP Command Center</div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9" }}>Multi-Tenant Console</h1>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { val: TENANTS.length, label: "Active Tenants", color: "#60a5fa" },
              { val: totalIdentities.toLocaleString(), label: "Total Identities", color: "#a78bfa" },
              { val: criticalTenants, label: "Need Attention", color: "#ef4444" },
              { val: `$${totalMRR.toLocaleString()}`, label: "Monthly Revenue", color: "#10b981" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 400px" : "1fr", gap: 0 }}>
          {/* Tenant list */}
          <div style={{ borderRight: selected ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            {/* Search + filter bar */}
            <div style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "1rem" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..."
                style={{ padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#e2e8f0", fontSize: "1.0625rem", outline: "none", flex: 1, maxWidth: 300 }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["All", "Critical", "Warning"].map(f => (
                  <button key={f} style={{ padding: "0.375rem 0.875rem", borderRadius: 9999, fontSize: "1rem", fontWeight: 600, border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "transparent", color: "#64748b", cursor: "pointer" }}>{f}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Tenant", "Industry", "Identities", "Risk Score", "Orphans", "AI Agents", "Incidents", "MRR", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "0.625rem 1rem", textAlign: "left", fontSize: "1.0625rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const st = STATUS_STYLES[t.status];
                    const isSelected = selected?.id === t.id;
                    return (
                      <tr key={t.id}
                        onClick={() => setSelected(isSelected ? null : t)}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", backgroundColor: isSelected ? "rgba(96,165,250,0.06)" : "transparent", transition: "background 0.1s" }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#e2e8f0" }}>{t.name}</div>
                          <div style={{ fontSize: "1.0625rem", fontFamily: "monospace", color: "#475569" }}>{t.id}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "1.0625rem", color: "#64748b" }}>{t.industry}</td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "1.0625rem", fontWeight: 600, color: "#94a3b8" }}>{t.identities.toLocaleString()}</td>
                        <td style={{ padding: "0.875rem 1rem", minWidth: 140 }}>{riskBar(t.risk)}</td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "1.0625rem", color: t.orphans > 50 ? "#ef4444" : t.orphans > 20 ? "#f59e0b" : "#10b981", fontWeight: 600 }}>{t.orphans}</td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "1.0625rem", color: "#a78bfa", fontWeight: 600 }}>{t.ai_agents}</td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: t.incidents > 0 ? "#ef4444" : "#10b981" }}>{t.incidents}</span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "1.0625rem", fontWeight: 700, color: "#10b981" }}>{t.mrr}</td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{ padding: "0.2rem 0.625rem", borderRadius: 9999, fontSize: "1.0625rem", fontWeight: 700, backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <ChevronRight style={{ width: 16, height: 16, color: "#475569" }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tenant detail panel */}
          {selected && (
            <div style={{ padding: "1.5rem", overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{selected.id} · {selected.industry}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9" }}>{selected.name}</div>
              </div>

              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "Identities", val: selected.identities.toLocaleString(), icon: Users, color: "#60a5fa" },
                  { label: "Risk Score", val: selected.risk, icon: AlertTriangle, color: selected.risk >= 70 ? "#ef4444" : "#f59e0b" },
                  { label: "Orphan Accounts", val: selected.orphans, icon: Bot, color: "#f97316" },
                  { label: "AI Agents", val: selected.ai_agents, icon: Zap, color: "#a78bfa" },
                ].map(k => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                        <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</div>
                        <Icon style={{ width: 14, height: 14, color: k.color }} />
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: k.color }}>{k.val}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { label: `Run orphan purge (${selected.orphans} accounts)`, color: "#ef4444" },
                    { label: "Generate compliance report (SOC 2)", color: "#60a5fa" },
                    { label: "Export identity graph snapshot", color: "#a78bfa" },
                    { label: "Trigger full access review", color: "#f59e0b" },
                  ].map(a => (
                    <button key={a.label}
                      style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: a.color, fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.12s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `rgba(255,255,255,0.04)`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"; }}>
                      → {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "1rem", backgroundColor: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10 }}>
                <div style={{ fontSize: "1rem", color: "#10b981", fontWeight: 700, marginBottom: "0.375rem" }}>MRR CONTRIBUTION</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#10b981" }}>{selected.mrr}</div>
                <div style={{ fontSize: "1rem", color: "#64748b" }}>/ month · Node-based pricing</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
