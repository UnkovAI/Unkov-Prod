import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function AgenticShift() {
  const { ref, isVisible } = useScrollAnimation();

  const tiles = [
    { num: "01", label: "Identity Gate",               sub: "Every agent authorized before it acts"        },
    { num: "02", label: "Risk Engine",                 sub: "Continuous scoring across 3 risk dimensions"  },
    { num: "03", label: "AI Proxy",                    sub: "Every LLM call governed before it executes"   },
    { num: "04", label: "Autonomous Kill-Switch",       sub: "Instant revocation — no ticket, no delay"     },
    { num: "05", label: "Compliance System of Record",  sub: "Audit-ready for SEC, HHS, and PCI"           },
  ];

  return (
    <section id="solution" style={{ padding: "clamp(3.5rem,6vw,6.5rem) 0", backgroundColor: "#00297a", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 75% 50%, rgba(0,97,212,0.32) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(0,21,80,0.45) 0%, transparent 50%)", pointerEvents: "none" }} />

      <div className="container mx-auto px-10" ref={ref} style={{ position: "relative", zIndex: 1, opacity: isVisible ? 1 : 0, transform: isVisible ? "none" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Header — centred, unconstrained width */}
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem,4vw,3.5rem)" }}>
          <span style={{ display: "inline-block", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "1.5rem", padding: "0.25rem 1rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.25)" }}>
            How Unkov Works
          </span>

          <h2 style={{ fontSize: "clamp(1.875rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: "#ffffff", marginBottom: "1.25rem" }}>
            The identity gate your<br />AI agents cannot bypass.
          </h2>
          <p style={{ fontSize: "clamp(0.9375rem,2.5vw,1.0625rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto" }}>
            Unkov sits between your AI agents and everything they can touch. Before any request executes, Unkov verifies the identity, checks authorization, and writes the log — automatically, as a byproduct of normal operation.
          </p>
        </div>

        {/* 5-tile grid — full container width, wraps to 3+2 on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          overflow: "hidden",
        }}>
          {tiles.map((s, i) => (
            <div
              key={i}
              style={{ padding: "clamp(1.5rem,3vw,2.25rem) clamp(1rem,2vw,1.5rem)", backgroundColor: "rgba(255,255,255,0.04)", textAlign: "center", transition: "background-color 0.18s" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
            >
              <div style={{ fontSize: "1.0625rem", fontWeight: 800, color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em", marginBottom: "0.875rem" }}>{s.num}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem", lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Responsive fallback for narrow screens */}
        <style>{`
          @media (max-width: 640px) {
            #solution .tiles-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
