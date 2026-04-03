import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { Network, Brain, Zap, BarChart3, Radio, ArrowRight, CheckCircle, X } from "lucide-react";

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
    desc: "Every AI agent, service account, and human identity passes through Unkov before it can act. No API call, no data access, no workflow trigger without a verified identity. The identity graph maps every node and relationship — so when something breaks, you see exactly how the blast radius propagates.",
    caps: [
      "Inline agent interception before every execution",
      "Live identity graph — every human, bot, AI agent, and service account mapped",
      "Path queries: 'find all AI agents with access to PHI'",
      "Orphaned account and ghost agent discovery",
      "Identity Drift scoring across your full environment",
      "Toxic combination detection for privilege abuse",
    ],
    stat: "< 30 min", statL: "To first live dashboard",
  },
  {
    n: "02", icon: Brain, color: "#059669",
    title: "Risk Engine",
    sub: "Weighted behavioral scoring — not rules",
    anchorId: "risk-engine",
    desc: "Every identity receives a composite risk score computed from three dimensions: behavior (what it's doing), permissions (what it can do), and graph proximity (who it's connected to). Real-time events — logins, key changes, privilege escalations — update scores instantly. Claude-powered agents explain every finding in plain English.",
    caps: [
      "Continuous risk scoring across behavior, permissions, and relationships",
      "Risk scores update in real time as events happen across your environment",
      "Unusual time +20 · New geo +30 · Admin access +40 · Path to PHI +50",
      "3 Claude agents: risk explainer, anomaly detector, CISO executive summary",
      "Conversational interface: 'show me all AI agents that accessed PHI this week'",
    ],
    stat: "0–100", statL: "Composite risk score",
  },
  {
    n: "03", icon: Radio, color: "#7c3aed",
    title: "AI Proxy",
    sub: "Every AI tool call routed through Unkov",
    anchorId: "ai-proxy",
    desc: "The AI Proxy routes all calls to OpenAI, Anthropic, and Azure OpenAI through Unkov first. Clients point to your endpoint instead of the provider directly. Unkov holds the AI provider keys — clients never do. Every call is logged with identity context. Ungoverned AI agents are blocked before they can invoke a model.",
    caps: [
      "Every OpenAI, Anthropic, and Azure call identity-checked before reaching the provider",
      "Your team points AI tools at Unkov — Unkov holds the provider keys",
      "Unkov holds provider API keys — clients are never exposed",
      "Rate limiting per identity per hour",
      "High-risk AI agents blocked from calling AI providers",
      "Every AI call logged: who called what model, when, at what risk level",
    ],
    stat: "100%", statL: "AI calls governed",
  },
  {
    n: "04", icon: Zap, color: "#f59e0b",
    title: "Autonomous Kill-Switch",
    sub: "Instant revocation — no ticket required",
    anchorId: "kill-switch",
    desc: "When an identity crosses a policy line, Unkov doesn't send an alert — it acts. Access is revoked autonomously, with a full audit trail, before damage occurs. Configurable from recommend-only to fully autonomous. The gate doesn't wait for a human to respond.",
    caps: [
      "Hard kill-switch on rogue or compromised agents",
      "Automated purging of orphaned accounts",
      "Instant revocation of toxic privilege combinations",
      "Configurable escalation — recommend to autonomous",
      "Connects to your existing identity systems to revoke access automatically",
    ],
    stat: "90%", statL: "Reduction in manual review",
  },
  {
    n: "05", icon: BarChart3, color: "#dc2626",
    title: "Compliance System of Record",
    sub: "Continuous audit trail — one-click export",
    anchorId: "compliance",
    desc: "Because every identity action passes through Unkov, every action is logged. This makes Unkov the definitive system of record for SEC, HHS, and PCI DSS governance audits. Every gate decision, AI proxy call, and recommendation approval creates an immutable record. When regulators ask, your team hits Export.",
    caps: [
      "PCI DSS 4.0 / HIPAA / SOC 2 continuous monitoring",
      "Immutable audit log — every gate decision, AI proxy call, action",
      "Automated evidence collection — not quarterly",
      "Patient Data Lineage for HIPAA audit-readiness",
      "Real-time drift detection and anomaly alerting",
    ],
    stat: "1-click", statL: "Compliance export",
  },
];

type CompRow = { f: string; u: boolean | string; ok: boolean | string; sp: boolean | string; ca: boolean | string; as: boolean | string; zs: boolean | string };
const comp: CompRow[] = [
  { f: "Inline enforcement (before the action)",  u: true,         ok: false,     sp: false,     ca: false,      as: false,     zs: "Network only" },
  { f: "AI agent governance (first-class)",        u: true,         ok: "Partial", sp: "Partial", ca: false,      as: "Partial", zs: false },
  { f: "AI Proxy (controls LLM calls)",            u: true,         ok: false,     sp: false,     ca: false,      as: false,     zs: false },
  { f: "Real-time event pipeline",                 u: true,         ok: "Partial", sp: false,     ca: false,      as: false,     zs: false },
  { f: "Weighted risk scoring (behavior+graph)",   u: true,         ok: false,     sp: false,     ca: false,      as: "Partial", zs: false },
  { f: "Human identity lifecycle",                 u: true,         ok: true,      sp: true,      ca: true,       as: false,     zs: false },
  { f: "Autonomous remediation",                   u: true,         ok: false,     sp: false,     ca: false,      as: false,     zs: false },
  { f: "Cross-tenant threat intelligence",         u: true,         ok: false,     sp: false,     ca: false,      as: false,     zs: "Partial" },
  { f: "Zero professional services deployment",    u: "< 30 min",   ok: "Weeks",   sp: "Months",  ca: "Months",   as: "Days",    zs: "Weeks" },
  { f: "Compliance system of record",              u: true,         ok: "Partial", sp: "Partial", ca: false,      as: false,     zs: false },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true)  return <CheckCircle className="w-4 h-4 mx-auto" style={{ color: "#0061d4" }} />;
  if (v === false) return <X className="w-4 h-4 mx-auto" style={{ color: "#d1ccc5" }} />;
  return <span style={{ fontSize: "1.0625rem", color: M, fontWeight: 500 }}>{v}</span>;
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

  const mod = modules[active]!;
  const Icon = mod.icon;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ backgroundColor: A, padding: "clamp(3rem,6vw,6rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <span style={{ display: "inline-block", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "1.25rem", padding: "0.25rem 1rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.15)" }}>Platform</span>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: W, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Five modules. One gate.<br />Nothing acts without a decision.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: "36rem", marginBottom: "2rem" }}>
              Identity Gate, Risk Engine, AI Proxy, Kill-Switch, and Compliance System of Record — fully integrated, deployed in under 30 minutes.
            </p>
            <button
              onClick={() => navigate("/early-access")}
              className="btn-primary"
              style={{ backgroundColor: W, color: A, border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

        {/* Interactive module selector */}
        <section style={{ padding: "clamp(3rem,5vw,5rem) 0", backgroundColor: W }}>
          <div className="container mx-auto px-10">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>

              {/* Left: module tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {modules.map((m, i) => {
                  const MIcon = m.icon;
                  const isActive = i === active;
                  return (
                    <button
                      key={i}
                      onClick={() => { setActive(i); setPaused(true); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "1.125rem 1.25rem", borderRadius: "0.875rem",
                        border: `1.5px solid ${isActive ? m.color + "55" : "#e5e7eb"}`,
                        backgroundColor: isActive ? m.color + "09" : "transparent",
                        cursor: "pointer", textAlign: "left", transition: "all 0.18s", outline: "none",
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: "0.625rem", backgroundColor: isActive ? m.color + "18" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MIcon style={{ width: 18, height: 18, color: isActive ? m.color : "#9ca3af" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: isActive ? m.color : "#9ca3af", letterSpacing: "0.08em", marginBottom: "0.125rem" }}>{m.n}</div>
                        <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: isActive ? H : M }}>{m.title}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: module detail */}
              <div key={active} style={{ border: "1px solid #e5e7eb", borderRadius: "1.25rem", padding: "2.5rem", backgroundColor: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "0.875rem", backgroundColor: mod.color + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 24, height: 24, color: mod.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: mod.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{mod.n} · {mod.sub}</div>
                    <div style={{ fontSize: "1.375rem", fontWeight: 800, color: H }}>{mod.title}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: mod.color, letterSpacing: "-0.04em" }}>{mod.stat}</div>
                    <div style={{ fontSize: "1rem", color: S }}>{mod.statL}</div>
                  </div>
                </div>
                <p style={{ fontSize: "1.0625rem", color: S, lineHeight: 1.75, marginBottom: "1.5rem" }}>{mod.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {mod.caps.map((cap, ci) => (
                    <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: mod.color, marginTop: "0.5rem", flexShrink: 0 }} />
                      <span style={{ fontSize: "1rem", color: M, lineHeight: 1.6 }}>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive comparison */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0", backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce" }}>
          <div className="container mx-auto px-10">
            <div style={{ maxWidth: "520px", marginBottom: "2.5rem" }}>
              <span className="section-label">Comparison</span>
              <h2 className="section-heading">What Unkov does that incumbents don't</h2>
            </div>
            <div style={{ border: "1px solid #dcd6ce", borderRadius: "1rem", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f0ece6", borderBottom: "1px solid #dcd6ce" }}>
                      {["Capability", "Unkov", "Okta", "SailPoint", "CyberArk", "Astrix", "Zscaler"].map((h, i) => (
                        <th key={i} style={{ textAlign: i === 0 ? "left" : "center", padding: "0.75rem 1rem", fontSize: "1rem", fontWeight: i === 1 ? 700 : 600, color: i === 1 ? A : "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comp.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: ri % 2 === 0 ? W : "#faf9f7" }}>
                        <td style={{ padding: "0.75rem 1rem", color: H, fontWeight: 500 }}>{row.f}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.u} /></td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.ok} /></td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.sp} /></td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.ca} /></td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.as} /></td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}><Cell v={row.zs} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(3rem,6vw,6rem) 0", backgroundColor: A, textAlign: "center" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "560px" }}>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 800, color: W, marginBottom: "1rem", letterSpacing: "-0.03em" }}>
              Ready to see your identity footprint?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              Live dashboard in under 30 minutes. Every AI agent, human, and service account — scored, mapped, and governed.
            </p>
            <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ backgroundColor: W, color: A, border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
