import { Network, Brain, Zap, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  {
    icon: Network,   number: "01", color: "#0061d4", title: "Discover",
    subtitle: "Identity Gate",
    desc: "Zero-touch scan builds a live relationship graph — every human, bot, service account, and AI agent mapped automatically. First live Identity Drift dashboard in under 30 minutes.",
    points: ["Automated discovery across cloud and SaaS", "Hidden bridge detection for lateral movement", "Orphaned and over-privileged account flagging"],
  },
  {
    icon: Brain,     number: "02", color: "#10b981", title: "Analyze",
    subtitle: "Intent Engine",
    desc: "ML clusters peer identities to predict what access each role actually needs. New hires provisioned from real peer data — not a manager's best guess. Sub-10-minute onboarding.",
    points: ["Peer-Clone provisioning from role-equivalent peers", "Identity Heartbeat scoring on actual usage", "Usage-based rightsizing recommendations"],
  },
  {
    icon: Zap,       number: "03", color: "#f59e0b", title: "Remediate",
    subtitle: "Autonomous Engine",
    desc: "Findings become automated actions — Kill-Switch on rogue bots, orphan purge, toxic link revocation. Configurable from recommend-only to fully autonomous.",
    points: ["Hard Kill-Switch on anomalous bots", "Automated orphaned account purge", "Human-in-the-loop escalation for high-stakes actions"],
  },
  {
    icon: BarChart3, number: "04", color: "#8b5cf6", title: "Monitor",
    subtitle: "Continuous Governance",
    desc: "Real-time dashboards keep your governance posture visible at all times. Compliance evidence collected automatically — no scramble before the auditor arrives.",
    points: ["Live Identity Drift dashboard", "Continuous PCI DSS, SOC 2, and HIPAA evidence", "Real-time anomaly alerting"],
  },
];

export default function ProductDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = steps[active];
  const Icon = step.icon;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive(a => (a + 1) % steps.length), 4200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section style={{ padding: "clamp(3rem,6vw,6rem) 0", backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce", borderBottom: "1px solid #dcd6ce" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "480px", marginBottom: "3rem" }}>
          <span className="section-label">How It Works</span>
          <h2 className="section-heading" style={{ marginBottom: "0.625rem" }}>One continuous loop.</h2>
          <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.7 }}>Four phases, running autonomously 24/7. Click any phase to explore.</p>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "2.5rem" }}>
          {steps.map((s, i) => (
            <button key={i} type="button" onClick={() => { setActive(i); setPaused(true); }}
              style={{ flex: 1, height: 3, borderRadius: 9999, border: "none", cursor: "pointer", backgroundColor: i === active ? step.color : "#d8d4ce", transition: "background-color 0.3s", padding: 0 }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1.25rem,3vw,3rem)", alignItems: "start" }}>
          {/* Step nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {steps.map((s, i) => {
              const SI = s.icon;
              const isActive = i === active;
              return (
                <button key={i} type="button" onClick={() => { setActive(i); setPaused(true); }}
                  style={{ width: "100%", textAlign: "left", padding: "1rem 1.125rem", borderRadius: "0.75rem", border: "1px solid", borderColor: isActive ? s.color + "40" : "transparent", backgroundColor: isActive ? "#ffffff" : "transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "0.875rem", outline: "none" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "0.75rem", backgroundColor: isActive ? s.color : "#e8e4de", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.2s" }}>
                    <SI style={{ width: 15, height: 15, color: isActive ? "#ffffff" : "#6b7280" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: isActive ? "#1a1a2e" : "#6b7280", transition: "color 0.2s", letterSpacing: "-0.01em" }}>{s.number} — {s.title}</div>
                    <div style={{ fontSize: "1rem", color: isActive ? "#4a5568" : "#9ca3af", marginTop: "1px" }}>{s.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active step detail */}
          <div key={active} style={{ backgroundColor: "#ffffff", border: "1px solid #dcd6ce", borderRadius: "1rem", padding: "1.875rem", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "0.875rem", backgroundColor: step.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon style={{ width: 18, height: 18, color: "#ffffff" }} />
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>{step.title}</div>
                <div style={{ fontSize: "1rem", color: "#6b7280" }}>{step.subtitle}</div>
              </div>
            </div>
            <p style={{ fontSize: "1.0625rem", color: "#3d4759", lineHeight: 1.75, marginBottom: "1.5rem" }}>{step.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {step.points.map((pt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: step.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "1rem", color: "#1a1a2e" }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
