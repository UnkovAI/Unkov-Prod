import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

const moats = [
  { num: "M1", color: "#0061d4", bg: "#e8f0fe", title: "Identity Gate",           timing: "Live — Q2 2026" },
  { num: "M2", color: "#059669", bg: "#f0fdf4", title: "Network Intelligence",     timing: "Q3 2026" },
  { num: "M3", color: "#7c3aed", bg: "#faf5ff", title: "Hardware Identity",        timing: "Q2 2026 foundation" },
  { num: "M4", color: "#d97706", bg: "#fffbeb", title: "Compliance System of Record", timing: "Q4 2026" },
];

const items = [
  {
    q: "Now — Q2 2026", phase: "Design Partner Phase", status: "current",
    title: "Identity gate live — onboarding pilot customers",
    desc: "The identity gate is live. Every human and AI agent passes through Unkov before acting. We are now running structured 60-day pilots with BFSI and healthcare organizations. Zero-touch deployment delivers a live identity dashboard in under 30 minutes. Pilot success metrics agreed upfront — no pilot purgatory.",
    features: [
      "Identity gate — inline authorization layer, every agent verified before acting (Moat 1 active)",
      "Identity graph — discovers every human, AI agent, bot, and service account",
      "Connectors live: Okta, AWS IAM, Microsoft Entra ID, Workday, GitHub",
      "Real-time Identity Drift dashboard — live in < 30 minutes",
      "Autonomous kill-switch + orphaned account purge",
      "60-day structured pilot — $7,500 fee credited to Year 1",
      "Pilot success metrics framework — defined before deployment starts",
    ],
    milestone: "First 3 paying customers",
    cta: { label: "Apply for pilot", href: "/early-access" },
  },
  {
    q: "Q3 2026", phase: "Seed Phase", status: "upcoming",
    title: "Network intelligence + AWS Marketplace",
    desc: "Launch the cross-sector intelligence network (Moat 2): anonymous threat signals shared across all customers. When an agent type acts maliciously at one organization, all organizations are pre-emptively protected. List on AWS Marketplace to unlock procurement from existing cloud budgets.",
    features: [
      "Cross-sector intelligence network — anonymous threat signals across all customers",
      "Pre-emptive protection — threat at Customer A protects Customer B before it strikes",
      "AWS Marketplace listing — zero-friction procurement from existing cloud budgets",
      "First MSP channel partner — white-labeled multi-tenant dashboard",
      "Network effect compounds: more customers = smarter gate for everyone",
    ],
    milestone: "10 paying customers / $200K+ ARR",
    cta: null,
  },
  {
    q: "Q4 2026", phase: "Seed Phase", status: "upcoming",
    title: "Compliance System of Record + SOC 2",
    desc: "Establish Unkov as the system of record for AI governance audits (Moat 4). When the SEC or HHS asks for proof, the customer hits Export — not scramble. SOC 2 Type II certification removes the top enterprise procurement blocker. Patient Data Lineage ships for healthcare — the deepest vertical moat.",
    features: [
      "Compliance System of Record — one-click SEC + HHS export (Moat 4 active)",
      "Patient Data Lineage — which AI agent touched which patient record and why",
      "PCI DSS 4.0, HIPAA and SOC 2 Type II automated evidence collection",
      "SOC 2 Type II certification achieved",
      "Audit readiness as a byproduct of normal operation — not a quarterly project",
    ],
    milestone: "SOC 2 Type II certified",
    cta: null,
  },
  {
    q: "Q1 2027", phase: "Series A Target", status: "upcoming",
    title: "Series A — all four moats fully active",
    desc: "All four structural moats operational. Raise Series A with $300K–$500K ARR, 15–20 enterprise customers, and NRR > 110%. Scale engineering team and expand integrations marketplace.",
    features: [
      "$300K–$500K ARR / 15–20 enterprise customers",
      "All four moats active: Identity Gate, Network Intelligence, Hardware Identity, Compliance Record",
      "On-premise and hybrid deployment options",
      "Intent Engine ML — peer-based provisioning from behavioral data",
      "Custom integrations marketplace open to partners",
    ],
    milestone: "Series A — $20M raise",
    cta: null,
  },
  {
    q: "Year 2", phase: "Post Series A", status: "future",
    title: "Hardware identity — full TPM depth",
    desc: "Extend hardware identity (Moat 3) to full TPM/Secure Enclave depth — a cryptographic fingerprint for every AI agent that cannot be spoofed in software. Prevents Agent Cloning and Sleeper Agent attacks that every software-only tool misses. No named competitor has announced this capability.",
    features: [
      "Full TPM/Secure Enclave hardware identity binding for every agent",
      "Prevention of Agent Cloning and Sleeper Agent attacks",
      "Prior art filing for hardware-rooted agent identity",
      "Network intelligence scaled to 100+ enterprise tenants",
      "Industry-specific threat benchmarking — BFSI, Healthcare, Retail",
    ],
    milestone: "Hardware identity moat — filed as prior art",
    cta: null,
  },
  {
    q: "Year 2–3", phase: "Post Series A", status: "future",
    title: "Compliance Autopilot + global expansion",
    desc: "Compliance becomes fully automated: SOC 2, HIPAA, and PCI DSS 4.0 evidence packages generated continuously without human intervention. Expand to EU (GDPR v2, EU AI Act) and launch the native mobile app for manager approvals.",
    features: [
      "Compliance Autopilot — continuous SOC 2, HIPAA, PCI DSS 4.0 evidence",
      "EU AI Act High-Risk AI System transparency compliance",
      "GDPR v2 data residency controls",
      "Native mobile app for real-time alerts and one-touch approvals",
      "Custom compliance rule builder for regulated verticals",
    ],
    milestone: "Compliance as a byproduct — global",
    cta: null,
  },
];

export default function Roadmap() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem,5vw,5rem) 0 clamp(1.5rem,4vw,4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Roadmap</span>
            <h1 style={{ fontSize: "clamp(2.25rem,5vw,3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              From pilot to scale.
            </h1>
            <p className="section-sub" style={{ marginBottom: "2rem" }}>
              Four structural advantages — each one making the identity gate stronger with every new customer. We are in the pilot phase now. The gate is live.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {moats.map((m) => (
                <div key={m.num} style={{ backgroundColor: m.bg, border: `1px solid ${m.color}40`, borderRadius: 8, padding: "0.875rem 1rem" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 2 }}>{m.num}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{m.timing}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legend */}
        <section style={{ padding: "1rem 0", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
              {[
                { color: "#00297a", label: "In Progress — Now" },
                { color: "#94a3b8", label: "Seed Phase" },
                { color: "#d1d5db", label: "Post Series A" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: l.color }} />
                  <span style={{ fontSize: "0.8125rem", color: "#3d4759" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: "clamp(1.5rem,3vw,3rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "760px" }}>
            <div>
              {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                return (
                  <div key={idx} style={{ display: "flex", gap: "1.25rem" }}>
                    {/* Timeline spine */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0, paddingTop: "2rem" }}>
                      <div style={{
                        width: 12, height: 12, borderRadius: "50%", flexShrink: 0, zIndex: 10,
                        backgroundColor: item.status === "current" ? "#00297a" : item.status === "upcoming" ? "#94a3b8" : "#d1d5db",
                        boxShadow: item.status === "current" ? "0 0 0 4px #ffffff, 0 0 0 6px #c2d4f8" : "0 0 0 3px #ffffff",
                      }} />
                      {!isLast && <div style={{ width: 1, flex: 1, backgroundColor: "#e5e7eb", marginTop: 4 }} />}
                    </div>

                    {/* Card */}
                    <div style={{
                      flex: 1, marginBottom: "1.25rem",
                      border: `1px solid ${item.status === "current" ? "#bfcfee" : item.status === "future" ? "#e5e7eb" : "#e5e7eb"}`,
                      borderRadius: "0.875rem",
                      backgroundColor: item.status === "future" ? "#f9fafb" : "#ffffff",
                      padding: "1.75rem",
                      borderStyle: item.status === "future" ? "dashed" : "solid",
                    }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
                        <span style={{
                          fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "9999px",
                          backgroundColor: item.status === "current" ? "#00297a" : item.status === "upcoming" ? "#e8f0fe" : "#f3f4f6",
                          color: item.status === "current" ? "#ffffff" : item.status === "upcoming" ? "#00297a" : "#6b7280",
                          border: item.status === "upcoming" ? "1px solid #c2d4f8" : "none",
                        }}>{item.q}</span>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{item.phase}</span>
                        {item.status === "current" && (
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#059669", display: "inline-block" }} /> Live now
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.625rem" }}>{item.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.75, marginBottom: "1.25rem" }}>{item.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1.25rem" }}>
                        {item.features.map((f, fi) => (
                          <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                            <CheckCircle style={{ width: 14, height: 14, color: item.status === "current" ? "#0061d4" : "#94a3b8", flexShrink: 0, marginTop: 2 }} />
                            {f}
                          </div>
                        ))}
                      </div>
                      <div style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.6875rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Milestone:</span>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>{item.milestone}</span>
                        </div>
                        {item.cta && (
                          <button onClick={() => navigate(item.cta!.href)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", fontWeight: 700, color: "#0061d4", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            {item.cta.label} <ArrowRight style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Design partner CTA */}
        <section style={{ padding: "clamp(2rem,4vw,4rem) 0 clamp(2.5rem,5vw,5rem)" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "760px" }}>
            <div style={{ backgroundColor: "#00297a", borderRadius: "1rem", padding: "clamp(1.75rem,4vw,3rem)", textAlign: "center" }}>
              <h2 style={{ fontSize: "clamp(1.25rem,3vw,1.75rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
                We're in the pilot phase now.
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "32rem", margin: "0 auto 2rem" }}>
                60-day pilot. Your real environment. $7,500 — credited to Year 1. If we don't hit the metrics we agreed on, you have no obligation to continue.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/early-access")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#ffffff", color: "#00297a", fontWeight: 700, fontSize: "0.9375rem", padding: "0.75rem 1.75rem", borderRadius: "9999px", border: "none", cursor: "pointer" }}>
                  Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
                <a href="mailto:info@unkov.com"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.9375rem", padding: "0.75rem 1.75rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.3)", textDecoration: "none" }}>
                  Talk to us first
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
