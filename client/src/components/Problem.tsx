import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const problems = [
  { value: "100:1", unit: "ratio",  label: "AI agents to humans — and most enterprises have no idea what their agents are doing", color: "#dc2626" },
  { value: "16",    unit: "min",    label: "Time for an attacker to fully compromise an enterprise AI system — per Zscaler 2026", color: "#f59e0b" },
  { value: "241",   unit: "days",   label: "Average breach lifecycle — identity attacks stay hidden before anyone notices", color: "#7c3aed" },
];

export default function Problem() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="problem" ref={ref} style={{ padding: "clamp(2.5rem, 5vw, 5rem) 0", backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce", borderBottom: "1px solid #dcd6ce" }}>
      <div className="container mx-auto px-10" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem,4vw,4rem)", alignItems: "center" }}>
          <div>
            <span className="section-label">The Problem</span>
            <h2 className="section-heading" style={{ marginBottom: "1rem" }}>Your AI agents are acting.<br />Nobody's governing them.</h2>
            <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.8, maxWidth: "28rem" }}>
              Legacy IAM tools were built for human employees in quarterly review cycles. Today's enterprise runs hundreds of AI agents for every person — calling APIs, accessing data, executing workflows — with privileges nobody scoped, governed, or can revoke.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {problems.map((p, i) => (
              <div key={i} style={{ backgroundColor: "#ffffff", borderLeft: `4px solid ${p.color}`, borderTop: `1px solid ${p.color}22`, borderRight: `1px solid ${p.color}22`, borderBottom: `1px solid ${p.color}22`, borderRadius: "0.75rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "clamp(0.75rem,1.5vw,1.5rem)", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${p.color}18`; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ minWidth: "7rem" }}>
                  <span style={{ fontSize: "clamp(1.375rem,3.5vw,2rem)", fontWeight: 800, color: p.color, letterSpacing: "-0.04em", lineHeight: 1 }}>{p.value}</span>
                  <span style={{ fontSize: "1.0625rem", fontWeight: 600, color: p.color, marginLeft: "0.25rem" }}>{p.unit}</span>
                </div>
                <span style={{ fontSize: "1.0625rem", color: "#374151", fontWeight: 500, lineHeight: 1.45 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
