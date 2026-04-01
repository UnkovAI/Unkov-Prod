import { useState } from "react";

const rows = [
  { cap: "Architecture",         legacy: "Relational database (flat lists)",    unkov: "Graph-native Social Fabric" },
  { cap: "Identity scope",       legacy: "Human-centric only",                  unkov: "Unified human + NHI + AI agents" },
  { cap: "Threat detection",     legacy: "Reactive rule-based alerts",          unkov: "Predictive, pre-emptive enforcement" },
  { cap: "Remediation",          legacy: "Manual approval queues",              unkov: "Autonomous Kill-Switch at machine speed" },
  { cap: "Deployment",           legacy: "Months of professional services",     unkov: "< 30 minutes, zero-touch" },
  { cap: "Authorization model",  legacy: "Static role assignments",             unkov: "Inline identity gate — agent verified before acting" },
  { cap: "Network intelligence", legacy: "Siloed, per-customer only",           unkov: "Cross-tenant Bot Reputation Score" },
  { cap: "AI tool calls",        legacy: "No visibility — providers called directly",   unkov: "AI Proxy — every LLM call gated + logged" },
  { cap: "Risk scoring",         legacy: "Rule-based, nightly refresh",                 unkov: "Weighted model, real-time event updates" },
  { cap: "Compliance",           legacy: "Manual audit scrambles",              unkov: "System of Record — one-click export" },
  { cap: "NHI governance",       legacy: "Afterthought / bolt-on",              unkov: "Native, first-class from day one" },
];

const anchors = [
  {
    number: "01",
    title: "Identity Gate — Inline Enforcement Lock-In",
    color: "#dc2626",
    bg: "#fff5f5",
    body: "Unkov is the identity gate. Every AI agent must pass through Unkov and receive a verified token before it can move money in Fintech or access a patient record in Healthcare. Once embedded as the authorization layer, it is operationally impossible to remove — the entire AI workforce depends on it.",
    quote: "They can't delete Unkov without shutting down their entire agentic operations.",
  },
  {
    number: "02",
    title: "Cross-Sector Intelligence — Network Effect Moat",
    color: "#d97706",
    bg: "#fffbeb",
    body: "An anonymous Bot Reputation Score compounds across every customer. If an agent type acts toxically at one firm, all customers are pre-emptively protected. A new entrant with one customer cannot compete with a network of hundreds — the data advantage grows with every deployment.",
    quote: "Our moat compounds with every customer. A startup with one can never compete with a network of thousands.",
  },
  {
    number: "03",
    title: "AI Proxy — LLM Control Moat",
    color: "#7c3aed",
    bg: "#faf5ff",
    body: "Unkov holds the AI provider keys (OpenAI, Anthropic, Azure). Clients route AI tool calls through Unkov instead of the provider directly. Once embedded, clients cannot call AI providers without Unkov in the execution path. Every call logged. Ungoverned AI agents blocked before they invoke a model.",
    quote: "We become the mandatory checkpoint between every AI agent and every AI model.",
  },
  {
    number: "04",
    title: "Compliance System of Record — Audit Lock-In",
    color: "#059669",
    bg: "#f0fdf4",
    body: "Unkov becomes the official System of Record for auditors. When the SEC or HHS asks for AI governance proof, the customer hits Export from Unkov. CFOs don't cancel the tool that made them pass their HIPAA or PCI audit — security spend converts to a protected compliance budget line.",
    quote: "Compliance gravity is the strongest lock-in in enterprise SaaS.",
  },
];

const competitors = [
  { name: "Okta",           moat: "Human Identity",               unkovWin: "Agent Identity Graph + AI Proxy + Inline Gate" },
  { name: "Entro / Astrix", moat: "NHI Discovery alerts",         unkovWin: "Intent Engine prediction + Autonomous remediation" },
  { name: "Vanta / Drata",  moat: "Static compliance checklists", unkovWin: "Autonomous Kill-Switch + Compliance-as-Byproduct" },
  { name: "Torq / Gomboc",  moat: "Reactive remediation",         unkovWin: "Predictive prevention + Identity Gate lock-in" },
  { name: "Strata.io",      moat: "Identity orchestration",        unkovWin: "Graph-native + AI Proxy + Network Effect" },
];

export default function Advantage() {
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [showCompetitors, setShowCompetitors] = useState(false);

  return (
    <section id="moat" className="section" style={{ backgroundColor: "#faf9f7" }}>
      <div className="container mx-auto px-10">

        <div style={{ maxWidth: "520px", marginBottom: "3.5rem" }}>
          <span className="section-label">Competitive Moat</span>
          <h2 className="section-heading" style={{ marginBottom: "0.875rem" }}>Four moats. Each unbreakable on its own.</h2>
          <p className="section-sub">
            Integration depth, data gravity, and AI proxy control — architectural advantages legacy vendors cannot replicate without rebuilding from the ground up.
          </p>
        </div>

        {/* Moat cards */}
        <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "3.5rem" }}>
          {anchors.map((a, i) => (
            <button key={i} onClick={() => setActiveAnchor(i)} className="text-left"
              style={{ backgroundColor: activeAnchor === i ? a.bg : "#ffffff", border: `1px solid ${activeAnchor === i ? a.color + "55" : "#dcd6ce"}`, borderRadius: "0.875rem", padding: "1.75rem", cursor: "pointer", transition: "all 0.2s", boxShadow: activeAnchor === i ? `0 0 0 2px ${a.color}18` : "none", outline: "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "0.5rem", backgroundColor: activeAnchor === i ? a.color : "#f0ece6", color: activeAnchor === i ? "#fff" : "#4a5568", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0, transition: "all 0.2s" }}>
                  {a.number}
                </div>
                <div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>{a.title}</div>
                  <p style={{ fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.75 }}>{a.body}</p>
                  {activeAnchor === i && (
                    <div style={{ marginTop: "1rem", paddingLeft: "0.875rem", borderLeft: `2px solid ${a.color}` }}>
                      <p style={{ fontSize: "0.8125rem", fontStyle: "italic", fontWeight: 500, color: a.color }}>"{a.quote}"</p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Why legacy can't catch up + comparison table */}
        <div className="grid md:grid-cols-2" style={{ gap: "3rem", alignItems: "start", marginBottom: "3.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>Why legacy vendors cannot catch up.</h3>
            <p style={{ fontSize: "0.9rem", color: "#3d4759", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Every row where Unkov wins is an architectural consequence — not a feature gap that can be closed in a sprint.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { title: "Identity Gate creates operational lock-in", body: "Once Unkov is the authorization layer for AI agents, removing it means halting operations — stronger than any data or workflow integration." },
                { title: "Network effect compounds every quarter",      body: "Cross-tenant Bot Reputation Scores mean every new customer makes existing customers safer. You cannot buy this with engineering alone." },
                { title: "AI Proxy creates irreversible lock-in",       body: "Once clients route AI calls through Unkov, removing it breaks all AI tooling. No competitor currently offers identity-gated LLM proxy control." },
                { title: "Compliance gravity is the stickiest lock-in", body: "CFOs don't cancel the tool that made them pass their audit. Security spend converts to a protected compliance budget line." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00297a", marginTop: "0.5rem", flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a2e" }}>{item.title} — </span>
                    <span style={{ fontSize: "0.875rem", color: "#3d4759" }}>{item.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ border: "1px solid #dcd6ce", borderRadius: "0.875rem", overflow: "hidden" }}>
            <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#f0ece6", borderBottom: "1px solid #dcd6ce" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3d4759" }}>Capability</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", textAlign: "center" }}>Legacy IAM</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#00297a", textAlign: "center" }}>Unkov</span>
              </div>
            </div>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", padding: "0.75rem 1.25rem", borderBottom: i < rows.length - 1 ? "1px solid #e5e7eb" : "none", backgroundColor: i % 2 === 0 ? "#ffffff" : "#faf9f7" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#3d3d5c" }}>{row.cap}</span>
                <span style={{ fontSize: "0.8125rem", color: "#9ca3af", textAlign: "center" }}>{row.legacy}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#00297a", textAlign: "center" }}>{row.unkov}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Named competitors — collapsible */}
        <div style={{ marginBottom: "3.5rem" }}>
          <button onClick={() => setShowCompetitors(!showCompetitors)}
            style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0061d4", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: showCompetitors ? "1.25rem" : 0 }}>
            <span style={{ fontSize: "0.75rem" }}>{showCompetitors ? "▲" : "▼"}</span> How Unkov beats named competitors
          </button>
          {showCompetitors && (
            <div style={{ border: "1px solid #dcd6ce", borderRadius: "0.875rem", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#f0ece6", borderBottom: "1px solid #dcd6ce", display: "grid", gridTemplateColumns: "1fr 1fr 1.25fr", gap: "0.5rem" }}>
                {["Competitor", "Their Moat", "Unkov's Advantage"].map((h, i) => (
                  <span key={i} style={{ fontSize: "0.72rem", fontWeight: i === 2 ? 700 : 600, textTransform: "uppercase", letterSpacing: "0.08em", color: i === 2 ? "#00297a" : "#3d4759" }}>{h}</span>
                ))}
              </div>
              {competitors.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.25fr", gap: "0.5rem", padding: "0.75rem 1.25rem", borderBottom: i < competitors.length - 1 ? "1px solid #e5e7eb" : "none", backgroundColor: i % 2 === 0 ? "#ffffff" : "#faf9f7" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1a1a2e" }}>{c.name}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>{c.moat}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#00297a" }}>{c.unkovWin}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary pull quote */}
        <div style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 100%)", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.75rem", lineHeight: 1.4 }}>
            "The moat is not a feature. It is integration depth, data gravity, and AI proxy lock-in."
          </p>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Four compounding moats — each grows stronger with every customer, every deployment, every quarter.
          </p>
        </div>

      </div>
    </section>
  );
}
