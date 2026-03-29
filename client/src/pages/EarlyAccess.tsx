import { useState } from 'react';
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle, Zap, Shield, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const perks = [
  { icon: Zap,       title: "Live in your real environment", desc: "Zero-touch deployment. Live Identity Drift dashboard within 30 minutes of connecting." },
  { icon: Shield,    title: "$7,500 pilot fee — credited to Year 1", desc: "Approvable at manager level. Every dollar credited toward your first year production contract." },
  { icon: Clock,     title: "Priority onboarding",         desc: "Direct access to the founding team for your first deployment." },
];

const stats = [
  ["Identity Gate", "Unkov is the authorization layer for AI agents"],
  ["< 30 min", "Time to first live dashboard"],
  ["100%",  "Pilot customer retention rate"],
];

export default function EarlyAccess() {
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", size: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = form.name.trim() && form.email.trim() && form.company.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // Simulate async submission (replace with real API call)
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 60%, #0061d4 100%)", padding: "clamp(2rem, 5vw, 5rem) 0 clamp(1.5rem, 4vw, 4rem)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 40%, rgba(0,97,212,0.4) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div className="container mx-auto px-10" style={{ position: "relative", zIndex: 1, maxWidth: "760px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 1rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", marginBottom: "1.5rem" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#6ee7b7" }} />
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Now onboarding BFSI & healthcare pilot customers</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Apply for early access.<br />Be the first to gate your AI agents.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, maxWidth: "36rem", margin: "0 auto 2rem" }}>
              We're running structured 60-day pilots with BFSI and healthcare teams. See your full AI agent footprint, your real governance gaps, your actual identity risk — in your real environment, not a sandbox. Pilot fee credited to Year 1.
            </p>
            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem,2.5vw,2.5rem)", flexWrap: "wrap" }}>
              {stats.map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em" }}>{v}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginTop: "0.125rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section style={{ padding: "clamp(1.5rem, 4vw, 4rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "960px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1.25rem,3vw,3rem)", alignItems: "start" }}>

              {/* Left — perks */}
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>What you get</h2>
                <p style={{ fontSize: "0.9375rem", color: "#6b7280", marginBottom: "2rem" }}>Early access members get founding pricing and direct support from the team.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {perks.map((perk, i) => {
                    const Icon = perk.icon;
                    return (
                      <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "0.875rem", backgroundColor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon style={{ width: 18, height: 18, color: "#0061d4" }} />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1d1d1f", marginBottom: "0.25rem" }}>{perk.title}</div>
                          <div style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7 }}>{perk.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social proof */}
                <div style={{ marginTop: "2.5rem", padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.875rem" }}>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.625rem" }}>Pilot Results</div>
                  {[
                    "Bot Reputation Network — cross-sector threat intelligence that gets smarter with every customer",
                    "Defined success metrics — agreed before deployment starts",
                    "Hardware-rooted identity (TPM/Secure Enclave) — prevents Agent Cloning and Sleeper Agent attacks",
                    "45+ ghost bots with Admin access discovered per environment",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <CheckCircle style={{ width: 14, height: 14, color: "#059669", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: "0.875rem", color: "#374151" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — form */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "1rem", padding: "2rem", boxShadow: "0 8px 32px rgba(0,41,122,0.08)" }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "1rem 0" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                      <CheckCircle style={{ width: 28, height: 28, color: "#059669" }} />
                    </div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.5rem" }}>You're on the list!</h3>
                    <p style={{ fontSize: "0.9375rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                      We'll be in touch within one business day to set up your Zero-Touch Observation Mode. Check your email client — your request has been pre-filled.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                      <a href="/login" style={{ display: "block", textAlign: "center", padding: "0.75rem 1.5rem", backgroundColor: "#0061d4", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", borderRadius: "0.75rem", textDecoration: "none", transition: "background .15s" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor="#00297a")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor="#0061d4")}>
                        Sign in to view the live dashboard →
                      </a>
                      <p style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center" }}>Sign in with your pilot credentials to access the live dashboard.</p>
                    </div>
                    <button onClick={() => setSubmitted(false)} style={{ fontSize: "0.875rem", color: "#0061d4", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "0.375rem" }}>Apply for a Pilot</h3>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>We review every application. Ideal for enterprises with 500+ employees.</p>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                      {[
                        { key: "name",    label: "Full Name *",        placeholder: "Jane Smith",         type: "text"  },
                        { key: "email",   label: "Work Email *",        placeholder: "jane@company.com",   type: "email" },
                        { key: "company", label: "Company *",           placeholder: "Acme Corp",          type: "text"  },
                        { key: "role",    label: "Your Role",           placeholder: "CISO, IT VP, CTO...", type: "text" },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={(form as any)[f.key]}
                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                            style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #d1d5db", borderRadius: "0.75rem", fontSize: "0.9375rem", color: "#1d1d1f", backgroundColor: "#fafafa", outline: "none", boxSizing: "border-box" }}
                            onFocus={e => e.target.style.borderColor = "#0061d4"}
                            onBlur={e => e.target.style.borderColor = "#d1d5db"}
                          />
                        </div>
                      ))}

                      {/* Team size */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>Company Size</label>
                        <select
                          value={form.size}
                          onChange={e => setForm(p => ({ ...p, size: e.target.value }))}
                          style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #d1d5db", borderRadius: "0.75rem", fontSize: "0.9375rem", color: form.size ? "#1d1d1f" : "#9ca3af", backgroundColor: "#fafafa", outline: "none" }}>
                          <option value="">Select size...</option>
                          <option>500–1,000 employees</option>
                          <option>1,000–5,000 employees</option>
                          <option>5,000–19,000 employees</option>
                          <option>19,000+ employees</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className="btn-primary"
                        style={{ marginTop: "0.5rem", padding: "0.875rem", fontSize: "0.9375rem", opacity: canSubmit && !loading ? 1 : 0.5 }}>
                        {loading ? "Submitting..." : (<>Apply for a Pilot <ArrowRight style={{ width: 16, height: 16 }} /></>)}
                      </button>

                      <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
                        No credit card required. We review every application. We'll be in touch within one business day.
                      </p>
                    </form>
                  </>
                )}
              </div>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
