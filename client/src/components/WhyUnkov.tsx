import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const moats = [
  {
    number: "01", color: "#0061d4", bg: "#eff6ff", border: "#bfcfee",
    title: "Inline, not a sidecar",
    outcome: "Operationally impossible to remove",
    body: "Every other tool discovers, alerts, or reports. Unkov sits between every AI agent and everything it can touch — inline, at the authorization layer. Once embedded, removing Unkov means your entire AI workforce stops. That's lock-in through architecture, not contracts.",
  },
  {
    number: "02", color: "#059669", bg: "#f0fdf4", border: "#6ee7b7",
    title: "Network intelligence that compounds",
    outcome: "Gets smarter with every customer",
    body: "When a threat pattern emerges at one organization, every organization is protected automatically. This cross-sector intelligence is impossible to replicate from scratch. A new entrant with one customer cannot compete with a network of hundreds.",
  },
  {
    number: "03", color: "#7c3aed", bg: "#faf5ff", border: "#c4b5fd",
    title: "Purpose-built for the agentic era",
    outcome: "Not retrofitted — designed from day one",
    body: "Okta governs humans. CyberArk governs privileged accounts. Zscaler inspects traffic. None were built to govern AI agents as first-class identities. Unkov is purpose-built for a world where agents outnumber humans 100:1.",
  },
  {
    number: "04", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    title: "Compliance becomes a byproduct",
    outcome: "System of Record — not a project",
    body: "Because every agent action passes through Unkov, every action is logged. SEC, HHS, PCI DSS — when regulators ask, your team hits Export. CFOs don't cancel the tool that made them pass their last audit.",
  },
];

const comparison = [
  { category: "Control point",  them: "After the fact — discover, alert, report",        unkov: "Before the action — inline authorization" },
  { category: "Identity scope", them: "Humans, or specific NHI types in isolation",       unkov: "Every identity: human, agent, bot, service account" },
  { category: "AI agents",      them: "Bolt-on module or not supported",                 unkov: "First-class identity from day one" },
  { category: "Deployment",     them: "Weeks to months of professional services",        unkov: "Live in 30 minutes, zero professional services" },
  { category: "Lock-in",        them: "Data and workflow integrations",                  unkov: "Operational dependency — remove it and agents stop" },
];

export default function WhyUnkov() {
  const [, navigate] = useLocation();
  return (
    <section style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb", padding: "clamp(2.5rem, 5vw, 5.5rem) 0" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "560px", marginBottom: "3rem" }}>
          <span className="section-label">Why Unkov</span>
          <h2 className="section-heading">Built differently.<br />Positioned to stay.</h2>
          <p style={{ fontSize: "1rem", color: "#4b5563", lineHeight: 1.8, marginTop: "0.875rem" }}>
            The market has discovery tools, alert tools, and policy tools. Unkov is the enforcement layer — the one place every AI agent must pass through before it acts. That is a different architecture, and a different moat.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
          {moats.map((m, i) => (
            <div key={i} style={{ border: `1px solid ${m.border}`, borderRadius: "1rem", padding: "1.75rem", backgroundColor: m.bg, transition: "box-shadow 0.2s, transform 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${m.color}18`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
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
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < comparison.length - 1 ? "1px solid #e5e7eb" : "none", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>{row.category}</td>
                    <td style={{ padding: "0.875rem 1.25rem", color: "#6b7280" }}>{row.them}</td>
                    <td style={{ padding: "0.875rem 1.25rem", color: "#00297a", fontWeight: 500 }}>{row.unkov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: "0.5rem", paddingLeft: "0.25rem" }}>
            Incumbents referenced: Okta, SailPoint, Microsoft Entra, CyberArk, Saviynt, Zscaler, Astrix, Grip Security, Lumos
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/early-access")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9375rem", fontWeight: 600, color: "#00297a", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Become a design partner <ArrowRight style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>
    </section>
  );
}
