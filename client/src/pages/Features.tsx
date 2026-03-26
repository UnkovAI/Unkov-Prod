import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { Network, Brain, Zap, BarChart3, ArrowRight, CheckCircle, X } from "lucide-react";

const A = "#00297a";
const H = "#1d1d1f";
const M = "#374151";
const S = "#4b5563";
const B = "#dcd6ce";
const W = "#ffffff";

const modules = [
  {
    n: "01", icon: Network, color: "#0061d4",
    title: "Identity Gate",
    sub: "The inline authorization layer",
    anchorId: "identity-gate",
    desc: "Unkov sits inline between every AI agent and everything it can touch. No agent calls an API, accesses data, or triggers a workflow without passing through the gate and presenting a verified identity. No token — no action.",
    caps: [
      "Inline agent interception before every execution",
      "Real-time identity graph — every human, bot, AI agent mapped",
      "Orphaned account and ghost agent discovery",
      "Identity Drift scoring across your full environment",
      "Toxic combination detection for privilege abuse",
    ],
    stat: "< 30 min", statL: "To first live dashboard",
  },
  {
    n: "02", icon: Brain, color: "#059669",
    title: "Intent Engine",
    sub: "Contextual intelligence that learns",
    anchorId: "intent-engine",
    desc: "Behavioral analysis across every agent and identity predicts exactly what access each one needs — before they request it. The more organizations run through Unkov, the more accurate the gate becomes. Cross-sector signals compound into an intelligence advantage no single-tenant tool can replicate.",
    caps: [
      "Peer-based provisioning from role-equivalent colleagues",
      "New hire onboarding in under 10 minutes",
      "Usage-based rightsizing — Admin to Read-only automatically",
      "Fully explainable, auditable decisions",
    ],
    stat: "< 10 min", statL: "New hire onboarding",
  },
  {
    n: "03", icon: Zap, color: "#f59e0b",
    title: "Autonomous Kill-Switch",
    sub: "Instant revocation — no ticket required",
    anchorId: "kill-switch",
    desc: "When an agent crosses a policy line, Unkov doesn't send an alert — it acts. Access is revoked autonomously, with a full audit trail, before damage occurs. Configurable from recommend-only to fully autonomous. The gate doesn't wait for a human to respond.",
    caps: [
      "Hard kill-switch on rogue or compromised agents",
      "Automated purging of orphaned accounts",
      "Instant revocation of toxic privilege combinations",
      "Configurable escalation — recommend to autonomous",
    ],
    stat: "90%", statL: "Reduction in manual review",
  },
  {
    n: "04", icon: BarChart3, color: "#7c3aed",
    title: "Compliance System of Record",
    sub: "Continuous audit trail — one-click export",
    anchorId: "compliance",
    desc: "Because every agent action passes through Unkov, every action is logged. This makes Unkov the definitive system of record for SEC, HHS, and PCI DSS governance audits. When regulators ask, your team hits Export — not scramble.",
    caps: [
      "PCI DSS 4.0 / HIPAA / SOC 2 continuous monitoring",
      "Automated evidence collection — not quarterly",
      "Patient Data Lineage for HIPAA audit-readiness",
      "Real-time drift detection and anomaly alerting",
    ],
    stat: "1-click", statL: "Compliance export",
  },
];

type CompRow = { f: string; u: boolean | string; ok: boolean | string; sp: boolean | string; ca: boolean | string; as: boolean | string; zs: boolean | string };
const comp: CompRow[] = [
  { f: "Inline enforcement (before the action)", u: true,              ok: false,     sp: false,     ca: false,      as: false,     zs: "Network only" },
  { f: "AI agent governance (first-class)",      u: true,              ok: "Partial", sp: "Partial", ca: false,      as: "Partial", zs: false },
  { f: "Human identity lifecycle",               u: true,              ok: true,      sp: true,      ca: true,       as: false,     zs: false },
  { f: "Autonomous remediation",                 u: true,              ok: false,     sp: false,     ca: false,      as: false,     zs: false },
  { f: "Cross-tenant threat intelligence",       u: true,              ok: false,     sp: false,     ca: false,      as: false,     zs: "Partial" },
  { f: "Zero professional services deployment",  u: "< 30 min",        ok: "Weeks",   sp: "Months",  ca: "Months",   as: "Days",    zs: "Weeks" },
  { f: "Compliance system of record",            u: true,              ok: "Partial", sp: "Partial", ca: false,      as: false,     zs: false },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true)  return <CheckCircle className="w-4 h-4 mx-auto" style={{ color: "#0061d4" }} />;
  if (v === false) return <X className="w-4 h-4 mx-auto" style={{ color: "#d1ccc5" }} />;
  return <span style={{ fontSize: "0.8125rem", color: M, fontWeight: 500 }}>{v}</span>;
}

export default function Features() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive(a => (a + 1) % modules.length), 4200);
    return () => clearInterval(id);
  }, [paused]);

  const mod = modules[active];
  const Icon = mod.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: W, color: H }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ borderBottom: `1px solid ${B}`, padding: "clamp(2rem,5vw,5rem) 0 clamp(1.5rem,4vw,4rem)", backgroundColor: W }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Platform</span>
            <h1 style={{ fontSize: "clamp(2.25rem,5vw,3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              The identity gate.<br />Four capabilities. One continuous loop.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#3d4759", lineHeight: 1.75, maxWidth: "36rem", marginBottom: "2rem" }}>
              Every AI agent passes through Unkov before it acts. What happens in between — discovery, analysis, enforcement, and compliance — is the platform.
            </p>
            <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Become a design partner <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

        {/* Interactive module explorer */}
        <section style={{ padding: "clamp(1.5rem,3vw,3rem) 0", backgroundColor: "#f0ece6", borderBottom: `1px solid ${B}` }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "960px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "2rem" }}>
              {modules.map((m, i) => (
                <button key={i} onClick={() => { setActive(i); setPaused(true); }}
                  style={{ flex: 1, height: 3, borderRadius: 9999, border: "none", cursor: "pointer", backgroundColor: i === active ? "#0061d4" : "#d8d4ce", transition: "background-color 0.3s", padding: 0 }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1rem,2.5vw,2.5rem)", alignItems: "start" }}>
              {/* Nav */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {modules.map((m, i) => {
                  const MIcon = m.icon;
                  const isActive = i === active;
                  return (
                    <button key={i} onClick={() => { setActive(i); setPaused(true); }}
                      style={{ textAlign: "left", padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid", borderColor: isActive ? "#0061d440" : "transparent", backgroundColor: isActive ? W : "transparent", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "0.875rem", backgroundColor: isActive ? A : "#e8e4de", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.2s" }}>
                        <MIcon style={{ width: 16, height: 16, color: isActive ? W : "#6b7280" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: isActive ? H : "#6b7280" }}>{m.n} — {m.title}</div>
                        <div style={{ fontSize: "0.75rem", color: isActive ? S : "#9ca3af", marginTop: "1px" }}>{m.sub}</div>
                      </div>
                      {isActive && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1rem", fontWeight: 700, color: A }}>{m.stat}</div>
                          <div style={{ fontSize: "0.6875rem", color: S }}>{m.statL}</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detail */}
              <div key={active} style={{ backgroundColor: W, border: `1px solid ${B}`, borderRadius: "1rem", padding: "1.75rem", animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.875rem", backgroundColor: A, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color: W }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: H }}>{mod.title}</div>
                    <div style={{ fontSize: "0.75rem", color: S }}>{mod.sub}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.9375rem", color: M, lineHeight: 1.75, marginBottom: "1.25rem" }}>{mod.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {mod.caps.map((cap, ci) => (
                    <div key={ci} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: mod.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: H }}>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </section>

        {/* Competitive comparison */}
        <section style={{ padding: "clamp(2rem,4vw,4rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "960px" }}>
            <div style={{ maxWidth: "560px", marginBottom: "2rem" }}>
              <span className="section-label">Competitive Landscape</span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 600, color: H, letterSpacing: "-0.025em", marginBottom: "0.75rem" }}>
                Where everyone else stops.<br />Where Unkov starts.
              </h2>
              <p style={{ fontSize: "0.9375rem", color: M, lineHeight: 1.75 }}>
                Okta, SailPoint, CyberArk, and Zscaler are all approaching AI governance from their existing architectures — human identity, privileged access, network inspection. Astrix and Grip are discovery-first. None of them enforce inline, before the action executes.
              </p>
            </div>

            <div style={{ border: `1px solid ${B}`, borderRadius: "0.875rem", overflow: "hidden", marginBottom: "1.25rem" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0ece6", borderBottom: `1px solid ${B}` }}>
                      <th style={{ textAlign: "left", padding: "0.875rem 1.25rem", fontSize: "0.7rem", fontWeight: 600, color: S, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 200 }}>Capability</th>
                      {[{ label: "Unkov", highlight: true }, { label: "Okta" }, { label: "SailPoint" }, { label: "CyberArk" }, { label: "Astrix" }, { label: "Zscaler" }].map(col => (
                        <th key={col.label} style={{ padding: "0.875rem 0.875rem", fontSize: "0.7rem", fontWeight: col.highlight ? 700 : 600, color: col.highlight ? A : S, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center", minWidth: 100, backgroundColor: col.highlight ? "#e8f0fe" : "transparent" }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comp.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i < comp.length - 1 ? `1px solid ${B}` : "none", backgroundColor: i % 2 === 0 ? W : "#fafafa" }}>
                        <td style={{ padding: "0.75rem 1.25rem", fontWeight: 500, color: H }}>{row.f}</td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center", backgroundColor: "#f0f5ff" }}><Cell v={row.u} /></td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}><Cell v={row.ok} /></td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}><Cell v={row.sp} /></td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}><Cell v={row.ca} /></td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}><Cell v={row.as} /></td>
                        <td style={{ padding: "0.75rem 0.875rem", textAlign: "center" }}><Cell v={row.zs} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: "#e8f0fe", border: "1px solid #bfcfee", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: A, marginBottom: "0.25rem" }}>The gap that won't close quickly</p>
              <p style={{ fontSize: "0.875rem", color: "#3d4759", lineHeight: 1.7 }}>
                Incumbents are retrofitting AI governance onto architectures built for human employees. Becoming an inline authorization layer requires a fundamentally different architecture — not a feature release.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(2rem,4vw,4rem) 0", backgroundColor: "#f0ece6", borderTop: `1px solid ${B}` }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "680px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 700, color: H, letterSpacing: "-0.025em", marginBottom: "1rem" }}>
              See your real AI agent footprint.
            </h2>
            <p style={{ fontSize: "1rem", color: S, lineHeight: 1.75, marginBottom: "2rem" }}>
              We're onboarding design partners in BFSI and healthcare. 30-minute deployment, your real environment, defined success metrics from day one.
            </p>
            <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Become a design partner <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
