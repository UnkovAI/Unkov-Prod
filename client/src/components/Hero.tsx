import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <section style={{
      paddingTop: "7rem",
      paddingBottom: "5rem",
      backgroundColor: "#faf9f7",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "60%", height: "120%", background: "radial-gradient(ellipse at top right, #dde8ff 0%, #f0eee8 40%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(2rem,4vw,4rem)", alignItems: "center" }} className="grid-hero">

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.875rem", borderRadius: "9999px", backgroundColor: "#e8f0fe", border: "1px solid #bfcfee", marginBottom: "1.75rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#0061d4" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#00297a", letterSpacing: "0.06em", textTransform: "uppercase" }}>AI Identity Governance</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.035em", color: "#0a0f1e", marginBottom: "1.375rem" }}>
              The identity gate between<br />
              <span style={{ background: "linear-gradient(90deg, #0061d4 0%, #00297a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                humans, AI agents, and everything they can touch.
              </span>
            </h1>

            <p style={{ fontSize: "1.0625rem", color: "#3d4759", lineHeight: 1.75, marginBottom: "2.25rem", maxWidth: "30rem" }}>
              Before any AI agent acts, Unkov verifies it for you — authorizing requests in real time and logging them automatically so you stay in control of every identity at scale.
            </p>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", marginBottom: "3rem" }}>
              <button onClick={() => navigate("/early-access")} className="btn-primary"
                style={{ fontSize: "0.9375rem", padding: "0.8rem 1.875rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Apply for Pilot <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => navigate("/login")}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", borderRadius: "9999px", border: "1.5px solid #c0d7f5", backgroundColor: "transparent", color: "#0061d4", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                See live demo
              </button>
            </div>


          </div>

          {/* Right — dashboard widget */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }} className="hidden md:flex">
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #d8dde6", borderRadius: "1.25rem", padding: "1.75rem", boxShadow: "0 20px 60px rgba(0,41,122,0.1), 0 4px 16px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Identity Drift Score</div>
                  <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1d1d1f", letterSpacing: "-0.04em", lineHeight: 1 }}>87 <span style={{ fontSize: "1rem", color: "#9ca3af", fontWeight: 500 }}>/100</span></div>
                </div>
                <div style={{ padding: "0.325rem 0.75rem", borderRadius: "9999px", backgroundColor: "#d1fae5", border: "1px solid #6ee7b7" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669" }}>↑ 12 pts</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "2.75rem", marginBottom: "0.5rem" }}>
                {[35,60,42,78,52,88,65,82,58,92,72,87].map((h,i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0", backgroundColor: i===11 ? "#0061d4" : i>=9 ? "#bfcfee" : "#e8f0fe" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.6875rem", color: "#d1d5db" }}>30 days ago</span>
                <span style={{ fontSize: "0.6875rem", color: "#d1d5db" }}>Today</span>
              </div>
            </div>
            {[
              { label: "Ghost bots purged",            val: "12",   color: "#059669", bg: "#d1fae5", border: "#6ee7b7" },
              { label: "Toxic combinations resolved",   val: "3",    color: "#0061d4", bg: "#e8f0fe", border: "#bfcfee" },
              { label: "Non-human identities governed", val: "100+", color: "#00297a", bg: "#dbeafe", border: "#93c5fd" },
            ].map(item => (
              <div key={item.label} style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.875rem", padding: "0.875rem 1.125rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}>
                <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: item.color, backgroundColor: item.bg, border: `1px solid ${item.border}`, padding: "0.125rem 0.625rem", borderRadius: "0.625rem" }}>{item.val}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
