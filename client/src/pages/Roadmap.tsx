import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Clock, Zap } from "lucide-react";
import { useLocation } from "wouter";

const moats = [
  { num: "M1", color: "#0061d4", bg: "#e8f0fe", title: "Identity Gate",              timing: "Live — Q2 2026" },
  { num: "M2", color: "#059669", bg: "#f0fdf4", title: "AI Proxy Control",            timing: "Live — Q2 2026" },
  { num: "M3", color: "#7c3aed", bg: "#faf5ff", title: "Network Intelligence",        timing: "Q3 2026" },
  { num: "M4", color: "#d97706", bg: "#fffbeb", title: "Compliance System of Record", timing: "Q4 2026" },
];

const items = [
  {
    q: "Now — Q2 2026", phase: "Design Partner Phase", status: "current",
    title: "Identity gate + AI Proxy live — onboarding pilot customers",
    desc: "The identity gate is live. Connectors pull every identity from 20 systems. The risk engine scores each one continuously across three dimensions. The gate enforces decisions in real time — at login, at every API call, and at every AI tool invocation. Every AI tool call routes through Unkov before reaching the provider.",
    features: [
      "Identity gate — inline authorization layer, every agent verified before acting",
      "AI Proxy — every AI tool call identity-checked before reaching the model provider",
      "20 connectors live: Okta, AWS IAM, Entra, GitHub, Workday + 15 more",
      "Live identity graph — every relationship mapped across all connected systems",
      "Real-time event pipeline — risk scores update in seconds as events happen",
      "Continuous risk scoring across behavior, permissions, and relationships",
      "3 Claude analysis agents: risk explainer, anomaly detector, CISO executive summary",
      "Recommend mode: approval queue → approved actions execute in source system",
      "60-day structured pilot — $7,500 fee credited to Year 1",
    ],
    milestone: "First 3 paying customers",
    cta: { label: "Apply for pilot", href: "/early-access" },
  },
  {
    q: "Q3 2026", phase: "Seed Phase", status: "upcoming",
    title: "Network intelligence + AWS Marketplace",
    desc: "Launch the cross-sector intelligence network: anonymous threat signals shared across all customers. When an agent type acts maliciously at one organization, all organizations are pre-emptively protected. The AI Proxy network effect compounds — every new customer adds signal to the behavioral model. List on AWS Marketplace to unlock procurement from existing cloud budgets.",
    features: [
      "Cross-sector intelligence network — anonymous threat signals across all customers",
      "Pre-emptive protection — threat at Customer A protects Customer B before it strikes",
      "AI Proxy behavioral baseline — what 'normal' looks like for each agent type across all customers",
      "AWS Marketplace listing — zero-friction procurement from existing cloud budgets",
      "First MSP channel partner — white-labeled multi-tenant dashboard",
      "Per-customer credential isolation — each customer's data and access fully separated",
    ],
    milestone: "10 paying customers / $200K+ ARR",
    cta: null,
  },
  {
    q: "Q4 2026", phase: "Seed Phase", status: "upcoming",
    title: "Compliance System of Record + SOC 2",
    desc: "Establish Unkov as the system of record for AI governance audits. Because every identity action and every AI tool call passes through Unkov, every action is logged. Compliance exports map findings to specific framework controls. SOC 2 Type II certification removes the top enterprise procurement blocker.",
    features: [
      "Compliance System of Record — one-click PCI DSS 4.0, HIPAA, SOC 2 export",
      "Patient Data Lineage — which AI agent touched which patient record and why",
      "Automated evidence collection — not a quarterly project",
      "SOC 2 Type II certification achieved",
      "Unkov system audit log (what Unkov itself does) — immutable, S3 export",
      "Network isolation — all compute runs in a private, isolated environment",
    ],
    milestone: "SOC 2 Type II certified",
    cta: null,
  },
  {
    q: "Q1 2027", phase: "Series A Target", status: "upcoming",
    title: "Series A — all moats fully active",
    desc: "Identity Gate, AI Proxy, Network Intelligence, and Compliance System of Record all operational. Autonomous gate enforcement — no human approval needed for clear policy violations. Intent Engine ML producing peer-based provisioning recommendations from behavioral data. Series A raise with $300K–$500K ARR.",
    features: [
      "$300K–$500K ARR / 15–20 enterprise customers",
      "Autonomous gate — auto-block score >80 without human approval",
      "Auto-revoke stale API keys, orphaned roles, inactive service principals",
      "Intent Engine ML — peer-based provisioning from behavioral data across all tenants",
      "Policy customization API — customers define their own rules and thresholds",
      "Custom integrations marketplace open to partners",
    ],
    milestone: "Series A — $20M raise",
    cta: null,
  },
  {
    q: "Year 2", phase: "Post Series A", status: "future",
    title: "Hardware identity — full TPM depth",
    desc: "Extend hardware identity to full TPM/Secure Enclave depth — a cryptographic fingerprint for every AI agent that cannot be spoofed in software. Prevents Agent Cloning and Sleeper Agent attacks that every software-only tool misses. The AI Proxy gains hardware-rooted attestation: not just 'who is calling' but 'which physical machine is this agent running on.'",
    features: [
      "Full TPM/Secure Enclave hardware identity binding for every agent",
      "AI Proxy hardware attestation — physical machine identity on every call",
      "Prevention of Agent Cloning and Sleeper Agent attacks",
      "Prior art filing for hardware-rooted agent identity",
      "Network intelligence scaled to 100+ enterprise tenants",
    ],
    milestone: "First hardware identity deployment",
    cta: null,
  },
];

const statusColors: Record<string, { dot: string; badge: string; label: string }> = {
  current:  { dot: "#0061d4", badge: "#e8f0fe", label: "In Progress" },
  upcoming: { dot: "#d97706", badge: "#fffbeb", label: "Upcoming" },
  future:   { dot: "#9ca3af", badge: "#f3f4f6", label: "Planned" },
};

export default function Roadmap() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 60%, #0061d4 100%)", padding: "clamp(3rem,6vw,7rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "1.25rem", padding: "0.25rem 1rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.15)" }}>Product Roadmap</span>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              From gate to autonomous enforcement.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "36rem", marginBottom: "2.5rem" }}>
              The identity gate is live. The AI Proxy is running. Real-time events are flowing. Here is where we are and what comes next.
            </p>

            {/* Moat chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {moats.map((m, i) => (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 1rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>{m.num}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#ffffff" }}>{m.title}</span>
                  <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.45)" }}>{m.timing}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: "clamp(3rem,5vw,6rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {items.map((item, idx) => {
                const sc = statusColors[item.status]!;
                return (
                  <div key={idx} style={{ border: `1px solid ${item.status === "current" ? "#bfcfee" : "#e5e7eb"}`, borderRadius: "1.25rem", padding: "2rem", backgroundColor: item.status === "current" ? "#f5f7ff" : "#ffffff", position: "relative" }}>

                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.875rem", borderRadius: "9999px", backgroundColor: sc.badge }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: sc.dot }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: sc.dot, letterSpacing: "0.06em" }}>{sc.label}</span>
                      </div>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#6b7280" }}>{item.q}</span>
                      <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>·</span>
                      <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>{item.phase}</span>
                    </div>

                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0a0f1e", marginBottom: "0.875rem", letterSpacing: "-0.025em" }}>{item.title}</h3>
                    <p style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.75, marginBottom: "1.5rem" }}>{item.desc}</p>

                    {/* Features */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.5rem", marginBottom: item.cta || item.milestone ? "1.5rem" : 0 }}>
                      {item.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <CheckCircle style={{ width: 14, height: 14, color: item.status === "current" ? "#0061d4" : "#d1d5db", flexShrink: 0, marginTop: 3 }} />
                          <span style={{ fontSize: "0.875rem", color: item.status === "current" ? "#374151" : "#6b7280", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    {(item.milestone || item.cta) && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", paddingTop: "1.25rem", borderTop: "1px solid #e5e7eb" }}>
                        {item.milestone && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {item.status === "current"
                              ? <Clock style={{ width: 14, height: 14, color: "#0061d4" }} />
                              : <Zap style={{ width: 14, height: 14, color: "#d97706" }} />
                            }
                            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: item.status === "current" ? "#0061d4" : "#d97706" }}>Milestone: {item.milestone}</span>
                          </div>
                        )}
                        {item.cta && (
                          <button
                            onClick={() => navigate(item.cta!.href)}
                            className="btn-primary"
                            style={{ fontSize: "0.875rem", padding: "0.625rem 1.375rem", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                          >
                            {item.cta.label} <ArrowRight style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
