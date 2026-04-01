import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const moats = [
  {
    number: "01", color: "#0061d4", bg: "#eff6ff", border: "#bfcfee",
    title: "Inline, not a sidecar",
    outcome: "Works before problems happen, not after",
    body: "Most security tools sit on the side — they watch, alert, and report after something happens. Unkov sits between your AI agents and the systems they need access to. Every request is checked in real time, before it goes through. Your security team sees everything. Your agents stay productive. And your compliance team stops running manual reviews.",
  },
  {
    number: "02", color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd",
    title: "AI Proxy — you control the keys",
    outcome: "Every LLM call gated before it reaches the model",
    body: "Clients route AI tool calls through Unkov instead of directly to OpenAI or Anthropic. Unkov holds the provider keys. Every call is logged with identity context. Ungoverned AI agents are blocked before they can invoke a model. This is the fastest path to provable AI governance — one endpoint change gives you complete visibility and control.",
  },
  {
    number: "03", color: "#059669", bg: "#f0fdf4", border: "#6ee7b7",
    title: "Real-time, not nightly",
    outcome: "Risk scores update in seconds, not 24 hours",
    body: "A privilege escalation at 9am shouldn't go undetected until 2am the next day. Okta webhooks, AWS CloudTrail via Kinesis, and GitHub webhooks feed the risk engine continuously. When an identity's score jumps to critical, an incident is created immediately — and the gate can block or challenge the next request in milliseconds.",
  },
  {
    number: "04", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    title: "Compliance becomes a byproduct",
    outcome: "System of Record — not a project",
    body: "Because every identity action and every AI tool call passes through Unkov, every action is logged. SEC, HHS, PCI DSS — when regulators ask, your team hits Export. The gate doesn't just secure your environment — it produces the evidence auditors need as a side effect of normal operation. CFOs don't cancel the tool that made them pass their last audit.",
  },
];

const comparison = [
  { category: "Control point",      them: "After the fact — discover, alert, report",           unkov: "Before the action — inline authorization" },
  { category: "AI tool calls",      them: "No visibility into what LLMs are called",             unkov: "AI Proxy — every call logged and governed" },
  { category: "Risk scoring",       them: "Rule-based, nightly refresh",                         unkov: "Weighted model, real-time event updates" },
  { category: "Identity scope",     them: "Humans, or specific NHI types in isolation",          unkov: "Every identity: human, agent, bot, service account" },
  { category: "AI agents",          them: "Bolt-on module or not supported",                     unkov: "First-class identity from day one" },
  { category: "Deployment",         them: "Weeks to months of professional services",            unkov: "Live in 30 minutes, zero professional services" },
  { category: "Lock-in",            them: "Data and workflow integrations",                      unkov: "Operational dependency — remove it and agents stop" },
];

export default function WhyUnkov() {
  const [, navigate] = useLocation();
  return (
    <section style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "clamp(2.5rem, 5vw, 5.5rem) 0" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "560px", marginBottom: "3rem" }}>
          <span className="section-label">Why Unkov</span>
          <h2 className="section-heading">One control point.<br />Every AI agent, every action.</h2>
          <p style={{ fontSize: "1rem", color: "#4b5563", lineHeight: 1.8, marginTop: "0.875rem" }}>
            Most security tools sit on the side — they watch, report, and alert after something has already happened. Unkov enforces before the action, not after. Four structural advantages make that defensible at scale.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
          {moats.map((m, i) => (
            <div
              key={i}
              style={{ border: `1px solid ${m.border}`, borderRadius: "1rem", padding: "1.75rem", backgroundColor: m.bg, transition: "box-shadow 0.2s, transform 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${m.color}18`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: m.color, letterSpacing: "0.1em" }}>{m.number}</span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>{m.title}</span>
              </div>
              <div style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, color: m.color, backgroundColor: "#ffffff", border: `1px solid ${m.border}`, borderRadius: "9999px", padding: "0.2rem 0.75rem", marginBottom: "0.875rem" }}>
                {m.outcome}
              </div>
              <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.75 }}>{m.body}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "1.25rem" }}>How Unkov compares to the incumbent approach</h3>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.875rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0ece6", borderBottom: "1px solid #dcd6ce" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Area</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Incumbents</th>
                  <th style={{ textAlign: "left", padding: "0.75rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, color: "#00297a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Unkov</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: ri % 2 === 0 ? "#ffffff" : "#faf9f7" }}>
                    <td style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>{row.category}</td>
                    <td style={{ padding: "0.75rem 1.25rem", color: "#6b7280" }}>{row.them}</td>
                    <td style={{ padding: "0.75rem 1.25rem", color: "#00297a", fontWeight: 500 }}>{row.unkov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/features")}
            className="btn-primary"
            style={{ fontSize: "0.9rem", padding: "0.75rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            See full platform <ArrowRight style={{ width: 15, height: 15 }} />
          </button>
          <button
            onClick={() => navigate("/early-access")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "9999px", border: "1.5px solid #bfcfee", backgroundColor: "transparent", color: "#0061d4", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            Apply for pilot
          </button>
        </div>
      </div>
    </section>
  );
}
