export default function Market() {
  return (
    <section id="market" className="section" style={{ backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce", borderBottom: "1px solid #dcd6ce" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "520px", marginBottom: "3.5rem" }}>
          <span className="section-label">Market Opportunity</span>
          <h2 className="section-heading" style={{ marginBottom: "0.875rem" }}>A $30B+ market at an inflection point.</h2>
          <p className="section-sub">Unkov operates at the intersection of Identity Governance and Identity Threat Detection — a gap created by AI agent proliferation that legacy tools cannot bridge.</p>
        </div>

        <div className="grid md:grid-cols-3" style={{ gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { v: "$10.7B",  l: "IGA market (2026)",  n: "Regulatory mandates + NHI explosion",            hi: false },
            { v: "$19.66B", l: "ITDR market (2026)", n: "Behavior-based anomaly detection growth",         hi: false },
            { v: "~$30B+",  l: "Combined TAM",       n: "AI agent proliferation + escalating breach costs", hi: true  },
          ].map((m, i) => (
            <div key={i} className="card" style={{ padding: "1.75rem", borderColor: m.hi ? "#c2d4f8" : "#dcd6ce", backgroundColor: m.hi ? "#e8f0fe" : "#ffffff" }}>
              <div style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.04em", color: m.hi ? "#00297a" : "#1d1d1f", marginBottom: "0.25rem" }}>{m.v}</div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "#3d3d5c", marginBottom: "0.375rem" }}>{m.l}</div>
              <p style={{ fontSize: "1.0625rem", color: "#4a5568", lineHeight: 1.6 }}>{m.n}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3" style={{ gap: "1rem" }}>
          {[
            { label: "Primary",   name: "Mid-Market Accelerator", desc: "500–19,000 employees. Fastest-growing IGA segment. Average 1,062 apps per firm but no budget for legacy professional services." },
            { label: "Secondary", name: "Agent-Heavy Enterprise",  desc: "Large BFSI and Technology organizations where service accounts and AI agents account for the majority of privileged actions." },
            { label: "Tertiary",  name: "Regulated Sectors",      desc: "Healthcare ($7.42M average breach cost) and Retail (PCI DSS 4.0). Automated SOC 2 / HIPAA evidence is now a procurement requirement." },
          ].map((seg, i) => (
            <div key={i} className="card" style={{ padding: "1.5rem", borderColor: "#dcd6ce" }}>
              <span className="badge-blue" style={{ marginBottom: "0.875rem", display: "inline-flex" }}>{seg.label}</span>
              <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#1a1a2e", marginBottom: "0.5rem" }}>{seg.name}</div>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#3d4759" }}>{seg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
