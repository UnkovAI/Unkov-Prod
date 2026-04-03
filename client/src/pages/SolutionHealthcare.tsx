import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Shield, Eye, FileCheck } from "lucide-react";
import { useLocation } from "wouter";

const pains = [
  {
    icon: Eye,
    title: "AI agents are accessing patient data — without adequate governance",
    desc: "Clinical AI systems query EHRs, access PACS, and trigger workflows continuously. There is no inline authorization layer between those agents and patient records. If an agent is compromised or misconfigured, nothing stops it before data is exposed.",
  },
  {
    icon: Shield,
    title: "HIPAA now demands AI-specific audit trails",
    desc: "When HHS asks which system accessed a patient record and why, 'we have logs somewhere' is not an answer. You need to prove — with an immutable, timestamped audit trail — exactly which AI agent touched which record, under what authorization.",
  },
  {
    icon: FileCheck,
    title: "Staff turnover creates orphaned access daily",
    desc: "Clinicians leave. Contractors rotate. Travel nurses onboard. Each creates a window of orphaned access — credentials that remain valid long after the person left. In a healthcare environment, that's not a compliance risk. It's a breach waiting to happen.",
  },
];

export default function SolutionHealthcare() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #047857 0%, #065f46 60%, #064e3b 100%)", padding: "clamp(3rem,6vw,7rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Healthcare & Life Sciences</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem", maxWidth: "32rem" }}>
              The identity gate between every human, AI agent, and everything they can touch.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75, maxWidth: "36rem", marginBottom: "2rem" }}>
              Prove which AI agent touched which patient record and why — automatically. HIPAA compliance as a byproduct of the identity gate, not a separate audit project.
            </p>
            <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ backgroundColor: "#ffffff", color: "#065f46", border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

        {/* Pain points */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ maxWidth: "480px", marginBottom: "2.5rem" }}>
              <span className="section-label">The Problem</span>
              <h2 className="section-heading">AI agents are accessing<br />patient data — governance has not caught up.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", alignItems: "stretch" }}>
              {pains.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="card" style={{ padding: "1.75rem", borderColor: "#dcd6ce", display: "flex", flexDirection: "column" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "0.625rem", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                      <Icon style={{ width: 16, height: 16, color: "#047857" }} />
                    </div>
                    <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.625rem" }}>{p.title}</div>
                    <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.75, flex: 1 }}>{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What Unkov does */}
        <section style={{ padding: "clamp(2rem,4vw,4rem) 0", backgroundColor: "#f0ece6", borderTop: "1px solid #dcd6ce", borderBottom: "1px solid #dcd6ce" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ maxWidth: "480px", marginBottom: "2rem" }}>
              <span className="section-label">The Solution</span>
              <h2 className="section-heading">The identity gate built for regulated healthcare.</h2>
              <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.8, marginTop: "0.75rem" }}>
                Every AI agent that touches patient data must pass through Unkov first. Patient Data Lineage is built automatically — proving exactly which agent accessed which record, under what authorization, for every audit. HIPAA evidence collected continuously as a byproduct.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", alignItems: "stretch" }}>
              {[
                { v: "< 30 min", l: "Zero-touch deployment" },
                { v: "100%",     l: "Agent actions logged" },
                { v: "1-click",  l: "HIPAA evidence export" },
                { v: "Instant",  l: "Orphaned access revocation" },
              ].map(({ v, l }) => (
                <div key={l} className="card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "#dcd6ce", backgroundColor: "#ffffff" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#047857", letterSpacing: "-0.04em", marginBottom: "0.375rem" }}>{v}</div>
                  <div style={{ fontSize: "1.0625rem", color: "#4a5568" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "680px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.025em", marginBottom: "1rem" }}>
              Know exactly which AI agent touched which patient record.
            </h2>
            <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.75, marginBottom: "2rem" }}>
              30 minutes. Your real environment. Defined success metrics from day one.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => navigate("/features")} className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                See the platform
              </button>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
