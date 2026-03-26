import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { metric: "90%",   label: "Reduction in manual review labor",    detail: "Quarterly reviews down from 120+ hrs",  color: "#0061d4", bg: "#eff6ff" },
  { metric: "100%",  label: "Pilot customer retention",            detail: "Every pilot deployed has renewed",      color: "#059669", bg: "#f0fdf4" },
  { metric: "$1.9M", label: "Avg. incident cost avoided",          detail: "Per customer deployment",              color: "#7c3aed", bg: "#faf5ff" },
  { metric: "< 30m", label: "Time to first live dashboard",        detail: "Zero professional services required",   color: "#f59e0b", bg: "#fffbeb" },
];

export default function Traction() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="traction" style={{ padding: "clamp(3rem,6vw,6rem) 0", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" }}>
      <div className="container mx-auto px-10" ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "none" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-label">Early Results</span>
          <h2 className="section-heading" style={{ marginBottom: "0.75rem" }}>Validated in the field.</h2>
          <p className="section-sub" style={{ margin: "0 auto", textAlign: "center" }}>Financial services and healthcare pilots. Every deployment renewed.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ backgroundColor: s.bg, border: "1px solid transparent", borderRadius: "1.125rem", padding: "2rem 1.5rem", textAlign: "center", transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${s.color}1a`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = s.color + "2a"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "transparent"; }}>
              <div style={{ fontSize: "clamp(2rem,5vw,2.625rem)", fontWeight: 800, color: s.color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "0.625rem" }}>{s.metric}</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: "0.375rem", lineHeight: 1.35 }}>{s.label}</div>
              <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
