import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Shield, Users, Lock, Unlock } from "lucide-react";

// In production this would fetch from your DB.
// Placeholder shown only when Supabase is not configured (local dev).
// In production, real pilot clients are loaded from Supabase below.
const DEV_PILOT_CLIENTS = [
  {
    id: "dev_001",
    name: "Dev Pilot User",
    email: import.meta.env.VITE_DEV_PILOT_EMAIL || "pilot@localhost.dev",
    company: "Dev Environment",
    industry: "Testing",
    pilotStart: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10),
    riskReduction: "—",
    orphansFound: 0,
    incidentsBlocked: 0,
    complianceEvidence: false,
    dashboardLive: true,
    status: "pilot",
  },
];

export default function AdminUpgrade() {
  const { user, upgradeToProduction, logout, usingTestAccounts } = useAuth();
  const [, navigate] = useLocation();
  const [upgraded, setUpgraded] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [clients, setClients] = useState(DEV_PILOT_CLIENTS);
  const [fetchError, setFetchError] = useState("");

  // Load real pilot clients from Supabase when configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return; // use hardcoded PILOT_CLIENTS
    supabase
      .from("users")
      .select("*")
      .eq("role", "pilot_customer")
      .then(({ data, error }) => {
        if (error) { setFetchError(error.message); return; }
        if (data && data.length > 0) {
          setClients(data.map((u: any) => ({
            id: u.id,
            name: u.name || u.email,
            email: u.email,
            company: u.company || "—",
            industry: "—",
            pilotStart: u.pilot_start_date?.slice(0, 10) || "—",
            riskReduction: "—",
            orphansFound: 0,
            incidentsBlocked: 0,
            complianceEvidence: false,
            dashboardLive: false,
            status: "pilot",
          })));
        }
      });
  }, []);

  const handleUpgrade = async (clientId: string) => {
    await upgradeToProduction(clientId);
    setUpgraded(prev => [...prev, clientId]);
    setConfirming(null);
  };

  const S = {
    bg: "#0a0f1e", panel: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)", text: "#e2e8f0", muted: "#64748b",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: S.bg, color: S.text }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh", padding: "68px 2rem 3rem" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: S.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 4 }}>Unkov Admin Console</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9" }}>Client Upgrade Manager</h1>
            <p style={{ fontSize: "0.875rem", color: S.muted, marginTop: 4 }}>
              Logged in as <strong style={{ color: "#60a5fa" }}>{user?.name}</strong> ({user?.email})
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ padding: "0.5rem 1rem", borderRadius: 8, border: `1px solid ${S.border}`, backgroundColor: S.panel, color: S.text, cursor: "pointer", fontSize: "0.875rem" }}>
              → Production dashboard
            </button>
            <button onClick={() => { logout(); navigate("/login"); }}
              style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: "0.875rem" }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Active pilots",      val: clients.length.toString(),                                 color: "#f59e0b", icon: Users },
            { label: "Ready to upgrade",   val: clients.filter(c => c.complianceEvidence && c.dashboardLive).length.toString(), color: "#34d399", icon: CheckCircle },
            { label: "Upgraded this month",val: upgraded.length.toString(),                                      color: "#60a5fa", icon: Unlock },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} style={{ backgroundColor: S.panel, border: `1px solid ${S.border}`, borderRadius: 12, padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", color: S.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{k.label}</span>
                  <Icon style={{ width: 14, height: 14, color: k.color }} />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: k.color }}>{k.val}</div>
              </div>
            );
          })}
        </div>

        {/* Client list */}
        <div style={{ backgroundColor: S.panel, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${S.border}` }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: S.text }}>Pilot clients</span>
          </div>

          {clients.map(client => {
            const isUpgraded = upgraded.includes(client.id);
            const ready = client.complianceEvidence && client.dashboardLive && client.orphansFound > 0;
            return (
              <div key={client.id} style={{ padding: "1.5rem", borderBottom: `1px solid ${S.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start" }}>
                  <div>
                    {/* Client header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(0,97,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: S.text, fontSize: "1rem" }}>{client.name}</div>
                        <div style={{ fontSize: "0.8125rem", color: S.muted }}>{client.email} · {client.company} · {client.industry}</div>
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999, backgroundColor: isUpgraded ? "rgba(52,211,153,0.15)" : "rgba(245,158,11,0.15)", color: isUpgraded ? "#34d399" : "#f59e0b", border: `1px solid ${isUpgraded ? "rgba(52,211,153,0.3)" : "rgba(245,158,11,0.3)"}` }}>
                        {isUpgraded ? "✓ Production" : "Pilot active"}
                      </span>
                    </div>

                    {/* Pilot success metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0.625rem" }}>
                      {[
                        { label: "Pilot start",              val: client.pilotStart,                                              met: true  },
                        { label: "Risk reduction",           val: client.riskReduction,                                          met: true  },
                        { label: "Orphans discovered",       val: `${client.orphansFound} accounts`,                             met: client.orphansFound > 0 },
                        { label: "Incidents blocked",        val: `${client.incidentsBlocked} actions`,                          met: client.incidentsBlocked > 0 },
                        { label: "Compliance evidence",      val: client.complianceEvidence ? "Generated ✓" : "Not yet",        met: client.complianceEvidence },
                        { label: "Dashboard live in <30min", val: client.dashboardLive ? "Confirmed ✓" : "Pending",             met: client.dashboardLive },
                      ].map(m => (
                        <div key={m.label} style={{ padding: "0.625rem 0.875rem", backgroundColor: m.met ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", borderRadius: 8, border: `1px solid ${m.met ? "rgba(52,211,153,0.2)" : S.border}` }}>
                          <div style={{ fontSize: "0.65rem", color: S.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{m.label}</div>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: m.met ? "#34d399" : S.muted }}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upgrade action */}
                  <div style={{ width: 200, flexShrink: 0 }}>
                    {isUpgraded ? (
                      <div style={{ padding: "1rem", backgroundColor: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 10, textAlign: "center" as const }}>
                        <CheckCircle style={{ width: 24, height: 24, color: "#34d399", margin: "0 auto 0.5rem" }} />
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#34d399", marginBottom: "0.25rem" }}>Upgraded</div>
                        <div style={{ fontSize: "0.75rem", color: S.muted }}>Now on /dashboard</div>
                        <button onClick={() => { logout(); navigate("/login"); }}
                          style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}>
                          Log in as client →
                        </button>
                      </div>
                    ) : confirming === client.id ? (
                      <div style={{ padding: "1rem", backgroundColor: "rgba(0,97,212,0.1)", border: "1px solid rgba(0,97,212,0.3)", borderRadius: 10 }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#60a5fa", marginBottom: "0.5rem" }}>Confirm upgrade</div>
                        <div style={{ fontSize: "0.75rem", color: S.muted, marginBottom: "0.75rem", lineHeight: 1.5 }}>
                          This will unlock all 9 dashboard tabs and switch {client.name} from /demo/dashboard to /dashboard.
                        </div>
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          <button onClick={() => handleUpgrade(client.id)}
                            style={{ flex: 1, padding: "0.5rem", backgroundColor: "#0061d4", color: "#fff", fontWeight: 700, fontSize: "0.8125rem", border: "none", borderRadius: 7, cursor: "pointer" }}>
                            Confirm
                          </button>
                          <button onClick={() => setConfirming(null)}
                            style={{ padding: "0.5rem 0.75rem", backgroundColor: "transparent", color: S.muted, fontSize: "0.8125rem", border: `1px solid ${S.border}`, borderRadius: 7, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "1rem", backgroundColor: ready ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${ready ? "rgba(52,211,153,0.25)" : S.border}`, borderRadius: 10, textAlign: "center" as const }}>
                        {ready
                          ? <Unlock style={{ width: 22, height: 22, color: "#34d399", margin: "0 auto 0.5rem" }} />
                          : <Lock   style={{ width: 22, height: 22, color: S.muted,   margin: "0 auto 0.5rem" }} />}
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: ready ? "#34d399" : S.muted, marginBottom: "0.25rem" }}>
                          {ready ? "Ready to upgrade" : "Pilot in progress"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: S.muted, marginBottom: "0.75rem" }}>
                          {ready ? "All success metrics met" : "Awaiting metric sign-off"}
                        </div>
                        <button onClick={() => setConfirming(client.id)} disabled={!ready}
                          style={{ width: "100%", padding: "0.5rem", backgroundColor: ready ? "#0061d4" : "rgba(255,255,255,0.04)", color: ready ? "#fff" : S.muted, fontWeight: 600, fontSize: "0.8125rem", border: "none", borderRadius: 7, cursor: ready ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                          Upgrade to production <ArrowRight style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What happens note */}
        <div style={{ marginTop: "1.5rem", padding: "1.25rem 1.5rem", backgroundColor: "rgba(0,97,212,0.08)", border: "1px solid rgba(0,97,212,0.2)", borderRadius: 12 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#60a5fa", marginBottom: "0.5rem" }}>What happens when you click "Upgrade to production"</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.625rem", fontSize: "0.8125rem", color: S.muted }}>
            {[
              "User's role flips: pilot_customer → paying_customer",
              "Next login redirects to /dashboard (all 9 tabs)",
              "Locked tabs disappear — full access immediately",
              "ROI tab shows their real pilot numbers",
              "Deployment timer and pilot banner removed",
              "Send them: unkov.com/dashboard with their login",
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#34d399", flexShrink: 0 }}>✓</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
