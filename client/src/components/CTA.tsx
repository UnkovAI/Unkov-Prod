import { ArrowRight, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function CTA() {
  const [, navigate] = useLocation();
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "clamp(2.5rem, 6vw, 6rem) 0", background: "linear-gradient(135deg, #00297a 0%, #0041a8 60%, #0061d4 100%)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(0,97,212,0.35) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", marginBottom: "1.5rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#6ee7b7" }} />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.03em" }}>Now onboarding pilot customers in BFSI & healthcare</span>
        </div>

        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.875rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem", lineHeight: 1.15 }}>
          Nothing touches your data<br />without passing through Unkov.
        </h2>
        <p style={{ fontSize: "clamp(0.9375rem, 2.5vw, 1.0625rem)", color: "rgba(255,255,255,0.7)", marginBottom: "2rem", maxWidth: "34rem", marginLeft: "auto", marginRight: "auto", lineHeight: 1.75 }}>
          See your real AI agent footprint in 30 minutes. Defined success metrics from day one — no pilot purgatory. We're currently onboarding BFSI and healthcare organizations.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }} className="cta-buttons">
          <button onClick={() => navigate("/login")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", borderRadius: "9999px", border: "1.5px solid rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: "1rem", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}>
            See live demo →
          </button>
          <button onClick={() => navigate("/early-access")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", backgroundColor: "#ffffff", color: "#00297a", fontWeight: 700, borderRadius: "9999px", fontSize: "0.9375rem", border: "none", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Apply for Pilot <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
          <a href="/contact"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.875rem 2rem", backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", fontWeight: 600, borderRadius: "9999px", fontSize: "0.9375rem", textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)", transition: "background-color 0.2s, transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <Mail style={{ width: 16, height: 16 }} /> info@unkov.com
          </a>
        </div>
      </div>
    </section>
  );
}
