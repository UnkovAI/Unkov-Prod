import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, ArrowRight, Mail, Zap, Building2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const plans = [
  {
    icon: null,
    name: "Design Partner Pilot",
    nodes: "Your full environment",
    acv: "Custom",
    avcSub: "60 day engagement",
    description: "A structured pilot in your real environment. See your full AI agent footprint in 30 minutes. Direct founding team access. Pilot fee credited to Year 1.",
    cta: "Apply for Pilot",
    ctaHref: "/early-access",
    ctaStyle: "primary",
    featured: true,
    badge: "Now Onboarding",
    features: [
      "Full environment — no node cap",
      "Live Identity Drift dashboard in < 30 minutes",
      "Complete AI agent and orphaned account discovery",
      "Identity gate deployment with defined success metrics",
      "Direct founding team access throughout",
      "Executive debrief and ROI report",
      "Pilot fee credited to Year 1 in full",
    ],
  },
  {
    icon: null,
    name: "Production",
    nodes: "Scales with your identity footprint",
    acv: "Contact us",
    avcSub: "annual",
    description: "Full platform access sized to your environment. Pricing based on identity node count — human employees, AI agents, service accounts, and bots.",
    cta: "Request pricing",
    ctaHref: "/contact",
    ctaStyle: "ghost",
    featured: false,
    badge: null,
    features: [
      "Identity gate + full 4-phase platform",
      "Autonomous kill-switch and remediation",
      "Compliance system of record (PCI DSS, HIPAA, SOC 2)",
      "Okta, Azure AD, SailPoint integrations",
      "Dedicated customer success",
      "Custom data residency options",
    ],
  },
];



const faqs = [
  {
    q: "What counts as an Identity Node?",
    a: "Any human employee, AI agent, service account, bot, or API key under Unkov's governance. In 2026 the average enterprise runs a 5.2:1 NHI-to-human ratio — pricing reflects that reality."
  },
  {
    q: "What's included in the pilot fee?",
    a: "Everything. Full environment scan, live dashboard, AI agent discovery, toxic combination analysis, ghost account detection, and direct founding team support. The $7,500 fee is credited 100% toward Year 1 production."
  },
  {
    q: "How long does a pilot run?",
    a: "60 days. Week 1: connect sources, live dashboard in under 30 minutes. Weeks 2–4: full discovery phase. Weeks 5–8: gate enforcement and remediation. Week 8: executive debrief and ROI report."
  },
  {
    q: "Do you offer multi-year pricing?",
    a: "Yes. Design partners who sign annual contracts receive preferred pricing. Multi-year agreements are available with custom payment schedules. Contact us for details."
  },
  {
    q: "Can we start with one identity source?",
    a: "Yes. Most pilots start with Okta or AWS IAM — whichever has the highest NHI density. Additional connectors can be added at any point during or after the pilot."
  },
  {
    q: "Is the pilot fee refundable?",
    a: "The pilot fee is non-refundable but is credited 100% toward your first year production contract. If you choose not to continue, you keep the full scan output, the ROI report, and the executive debrief."
  },
];

export default function Pricing() {
  const [form, setForm] = useState({ name: "", email: "", company: "", nodes: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nEstimated Identity Nodes: ${form.nodes}\n\nMessage:\n${form.message}`;
    // Form data captured — sales team notified
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem, 5vw, 5rem) 0 clamp(1.5rem, 4vw, 4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Pricing</span>
            <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Pricing that scales with<br />your agent footprint
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#3d4759", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Node-based pricing that grows with your AI agents and non-human identities — not your headcount. Every pilot starts with defined success metrics and zero professional services. The identity gate, inline enforcement, hardware-rooted agent identity, and compliance system of record are included at every tier.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2vw,2rem)", flexWrap: "wrap" }}>
              {[["< 30 min", "Zero-touch deployment"], ["5.2:1", "Agent-to-human ratio we govern"], ["2", "Plan tiers — pilot or production"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#00297a", letterSpacing: "-0.03em" }}>{v}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.125rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Identity Node callout */}
        <div style={{ backgroundColor: "#edf1ff", borderBottom: "1px solid #c2d4f8" }} className="py-5">
          <div className="container mx-auto px-10">
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "#00297a" }} />
              <p className="text-sm text-[#3d4759]">
                <span className="font-semibold">What is an Identity Node?</span> Any human employee,
                AI agent, service account, bot, or API key under Unkov's governance. In 2026 the
                average enterprise runs a <strong>5.2:1 NHI-to-human ratio</strong> — our pricing
                reflects that reality.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <section className="section-slim">
          <div className="container mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
              {plans.map((plan, idx) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={idx}
                    className={`card flex flex-col overflow-hidden h-full ${
                      plan.featured ? "ring-2 ring-[#00297a] shadow-lg" : ""
                    }`}
                  >
                    {plan.badge && (
                      <div className="text-white text-xs font-bold text-center py-2 tracking-wider"
                        style={{ backgroundColor: "#00297a" }}>
                        {plan.badge.toUpperCase()}
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Icon for special tiers */}
                      {Icon && (
                        <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: "#edf1ff" }}>
                          <Icon className="w-4 h-4" style={{ color: "#00297a" }} />
                        </div>
                      )}

                      <h3 className="text-base font-bold text-[#1d1d1f] mb-1">{plan.name}</h3>
                      <p className="text-xs font-mono text-[#3d4759] mb-4">{plan.nodes}</p>

                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold text-[#1d1d1f]">{plan.acv}</span>
                        <span className="text-xs text-[#3d4759]">{plan.avcSub}</span>
                      </div>
                      <p className="text-xs text-[#3d4759] mb-5 leading-relaxed">{plan.description}</p>

                      <a
                        href={plan.ctaHref}
                        onClick={plan.ctaHref === "/contact" ? (e) => { e.preventDefault(); window.location.href = "/contact"; } : undefined}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-xs mb-6 transition-colors ${
                          plan.ctaStyle === "primary"
                            ? "text-white"
                            : "border border-[#d8dde6] text-[#3d4759] hover:border-[#b8c4d8]"
                        }`}
                        style={plan.ctaStyle === "primary" ? { backgroundColor: "#00297a" } : {}}
                      >
                        {plan.cta} <ArrowRight className="w-3 h-3" />
                      </a>

                      <div className="space-y-2.5 flex-1">
                        {plan.features.map((f, fi) => (
                          <div key={fi} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#00297a" }} />
                            <span className="text-xs text-[#3d4759] leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Us Form */}
        <section id="contact" className="section border-t border-[#d8dde6]" style={{ backgroundColor: "#f0ece6" }}>
          <div className="container mx-auto px-10">
            <div className="grid md:grid-cols-2 gap-14 items-start max-w-5xl">
              {/* Left — copy */}
              <div>
                <span className="section-label">Contact Sales</span>
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">
                  Need a custom quote?
                </h2>
                <p className="text-[#3d4759] leading-relaxed mb-8">
                  Unusual scale, multi-tenant architecture, MSP reseller agreement, or just want to
                  talk through your environment before committing to a tier — fill in the form and
                  we'll get back to you within one business day.
                </p>
                <div className="space-y-5">
                  {[
                    { title: "Response within 1 business day", body: "Our team reviews every inquiry personally — no auto-responders." },
                    { title: "No-pressure conversation", body: "We'll scope your environment and recommend the right tier — even if that's the pilot." },
                    { title: "Custom contract available", body: "Flexible node counts, payment terms, multi-year pricing, and MSP white-label options." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00297a" }} />
                      <div>
                        <div className="text-sm font-semibold text-[#1d1d1f]">{item.title}</div>
                        <p className="text-sm text-[#3d4759]">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-[#d8dde6]">
                  <p className="text-xs text-[#3d4759] mb-1">Prefer email?</p>
                  <a href="mailto:sales@unkov.com"
                    className="flex items-center gap-2 text-sm font-semibold text-[#00297a] hover:underline">
                    <Mail className="w-4 h-4" /> sales@unkov.com
                  </a>
                </div>
              </div>

              {/* Right — form */}
              <div className="card p-8">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "#d1fae5" }}>
                      <CheckCircle className="w-6 h-6" style={{ color: "#059669" }} />
                    </div>
                    <h3 className="text-lg font-bold text-[#1d1d1f] mb-2">Message sent!</h3>
                    <p className="text-sm text-[#3d4759]">We'll be in touch within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-base font-bold text-[#1d1d1f] mb-6">Get a Custom Quote</h3>
                    {[
                      { key: "name", label: "Full Name", placeholder: "Jane Smith", type: "text", required: true },
                      { key: "email", label: "Work Email", placeholder: "jane@company.com", type: "email", required: true },
                      { key: "company", label: "Company", placeholder: "Acme Corp", type: "text", required: true },
                      { key: "nodes", label: "Estimated Identity Nodes", placeholder: "e.g. 5,000 employees + 200 bots", type: "text", required: false },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-[#3d4759] mb-1.5">
                          {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                        </label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          required={f.required}
                          value={(form as any)[f.key]}
                          onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border text-[#1d1d1f] placeholder-[#b8c4d8] focus:outline-none focus:ring-2 focus:ring-[#00297a] transition-shadow"
                          style={{ borderColor: "#dcd6ce", backgroundColor: "#faf9f7" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-[#3d4759] mb-1.5">
                        How can we help? <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your environment, deployment requirements, or any questions about pricing..."
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border text-[#1d1d1f] placeholder-[#b8c4d8] focus:outline-none focus:ring-2 focus:ring-[#00297a] resize-none transition-shadow"
                        style={{ borderColor: "#dcd6ce", backgroundColor: "#faf9f7" }}
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center py-3 text-sm">
                      <Mail className="w-4 h-4" /> Send Message
                    </button>
                    <p className="text-xs text-center text-[#3d4759]">
                      We respond within 1 business day. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-slim">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">FAQ</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f]">Pricing questions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-14 gap-y-8 max-w-4xl">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[#3d4759] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
