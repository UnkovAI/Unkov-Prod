import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function AgenticShift() {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="solution" style={{ padding: "clamp(3.5rem,6vw,6.5rem) 0", backgroundColor: "#00297a", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 75% 50%, rgba(0,97,212,0.32) 0%, transparent 55%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(0,21,80,0.45) 0%, transparent 50%)", pointerEvents: "none" }} />

      <div className="container mx-auto px-10" ref={ref} style={{ position: "relative", zIndex: 1, opacity: isVisible ? 1 : 0, transform: isVisible ? "none" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", padding: "0.25rem 1rem", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.12)" }}>How Unkov Works</span>

          <h2 style={{ fontSize: "clamp(1.875rem,4vw,3rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: "#ffffff", marginBottom: "1.25rem" }}>
            The identity gate your<br />AI agents cannot bypass.
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "480px", margin: "0 auto 3.5rem" }}>
            Unkov sits inline between every AI agent and everything it can touch. No agent acts without a verified identity and an explicit authorization. Remove Unkov and agentic operations stop — that's not a bug, it's the moat.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "1rem", overflow: "hidden" }}>
            {[
              { num: "01", label: "Identity Gate",           sub: "Every agent authorized before it acts"       },
              { num: "02", label: "Inline Enforcement",      sub: "Sits between agent and resource — always"    },
              { num: "03", label: "Hardware-Rooted ID",      sub: "Cryptographic agent fingerprinting"          },
              { num: "04", label: "Compliance System of Record", sub: "Audit-ready for SEC, HHS, and PCI"      },
            ].map((s, i) => (
              <div key={i} style={{ padding: "2rem 1.5rem", backgroundColor: "rgba(255,255,255,0.04)", textAlign: "center", transition: "background-color 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>{s.num}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.92)", marginBottom: "0.375rem", lineHeight: 1.3 }}>{s.label}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
