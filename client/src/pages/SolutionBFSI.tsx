import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Shield, Clock, FileCheck } from "lucide-react";
import { useLocation } from "wouter";

const pains = [
  {
    icon: Shield,
    title: "AI agents moving money with no governance",
    desc: "Your fintech runs dozens of AI agents executing transactions, querying customer records, and calling external services — autonomously, around the clock. There is no inline authorization layer. If an agent is compromised or over-privileged, no tool stops it before damage occurs.",
  },
  {
    icon: Clock,
    title: "120+ hours every quarter in access review",
    desc: "Three IT staff spending 40 hours each, reviewing spreadsheets, rubber-stamping rows they stopped reading at row 200. This is the quarterly manual review tax — and it produces no measurable security improvement.",
  },
  {
    icon: FileCheck,
    title: "PCI DSS 4.0 demands continuous proof",
    desc: "Regulators no longer accept quarterly snapshots. Requirements 7 and 8 now require continuous access monitoring and automated evidence. Building that from spreadsheets is structurally impossible.",
  },
];

export default function SolutionBFSI() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 60%, #0061d4 100%)", padding: "clamp(3rem,6vw,7rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", marginBottom: "1.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Banking & Financial Services</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem", maxWidth: "32rem" }}>
              The identity gate between every human, AI agent, and everything they can touch.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75, maxWidth: "36rem", marginBottom: "2rem" }}>
              No AI agent moves money, accesses customer data, or calls an external service without Unkov's authorization. PCI DSS 4.0 compliance as a byproduct — not a project.
            </p>
            <button onClick={() => navigate("/early-access")} className="btn-primary" style={{ backgroundColor: "#ffffff", color: "#00297a", border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </section>

        {/* Pain points */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ maxWidth: "480px", marginBottom: "2.5rem" }}>
              <span className="section-label">The Problem</span>
              <h2 className="section-heading">Your AI agents are operating.<br />Nobody's governing them.</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {pains.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="card" style={{ padding: "1.75rem", borderColor: "#dcd6ce" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "0.625rem", backgroundColor: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                      <Icon style={{ width: 16, height: 16, color: "#dc2626" }} />
                    </div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1a1a2e", marginBottom: "0.625rem" }}>{p.title}</div>
                    <p style={{ fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.75 }}>{p.desc}</p>
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
              <h2 className="section-heading">The identity gate built for fintech scale.</h2>
              <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.8, marginTop: "0.75rem" }}>
                Sits inline between every AI agent and every financial action. No authorization, no execution. Live in 30 minutes — no rip-and-replace. PCI DSS 4.0 evidence collected continuously as a byproduct of normal operation.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { v: "< 30 min", l: "Zero-touch deployment" },
                { v: "90%", l: "Reduction in manual review" },
                { v: "1-click", l: "PCI DSS 4.0 evidence export" },
                { v: "100%", l: "Agent actions logged" },
              ].map(({ v, l }) => (
                <div key={l} className="card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "#dcd6ce", backgroundColor: "#ffffff" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#00297a", letterSpacing: "-0.04em", marginBottom: "0.375rem" }}>{v}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#4a5568" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "680px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.025em", marginBottom: "1rem" }}>
              See your fintech's real AI agent footprint.
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
