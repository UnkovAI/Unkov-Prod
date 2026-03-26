import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does Unkov differ from Okta, SailPoint, CyberArk, Astrix, and other identity vendors?",
    a: "Okta, SailPoint, and Microsoft Entra are discovery and policy tools — they find problems and set rules, but enforcement happens separately. CyberArk focuses on privileged access for humans. Astrix and Grip do non-human identity discovery but stop at alerting. Zscaler inspects network traffic. None of them sit inline as the authorization layer that every AI agent must pass through before it acts. That is the Unkov difference.",
  },
  {
    q: "Does Unkov replace our existing IAM, or sit on top of it?",
    a: "Either. Unkov operates as a standalone platform or connects to Okta, SailPoint, or Azure AD. Most teams start in overlay mode — live in under 30 minutes without changing any existing workflows.",
  },
  {
    q: "What does the pilot process look like?",
    a: "Zero-Touch Observation Mode delivers a live Identity Drift dashboard within 30 minutes. No professional services, no integration project. You see your own environment from day one, with success metrics defined upfront.",
  },
  {
    q: "What stage is Unkov at?",
    a: "Unkov is pre-revenue and actively onboarding design partners in BFSI and healthcare. The identity gate engine is in active development for Q2 2026 pilot deployments. We are building with our first design partners, not for a theoretical market.",
  },
  {
    q: "Which compliance frameworks does Unkov support?",
    a: "Unkov automates evidence collection for PCI DSS 4.0 (Requirements 7 & 8), HIPAA (§ 164.312(a)), and SOC 2 Type II. Evidence is collected continuously during normal operation — not assembled before an audit.",
  },
  {
    q: "How does Unkov handle AI agents and service accounts?",
    a: "Unkov sits inline between every AI agent and everything it can touch. Every agent is verified before it acts — service accounts, API keys, CI/CD credentials, AI agent tokens all governed with the same rigor as human identities. Anomalous behavior triggers automated revocation instantly, no ticket required.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ padding: "clamp(3rem,6vw,6rem) 0", backgroundColor: "#ffffff" }}>
      <div className="container mx-auto px-10">
        <div style={{ maxWidth: "480px", marginBottom: "3.5rem" }}>
          <span className="section-label">FAQ</span>
          <h2 className="section-heading" style={{ marginBottom: "0.5rem" }}>Common questions.</h2>
          <p style={{ fontSize: "1rem", color: "#6b7280" }}>Can't find an answer? <a href="/contact" style={{ color: "#0061d4", fontWeight: 600, textDecoration: "none" }}>Reach out</a> — we respond within one business day.</p>
        </div>
        <div style={{ maxWidth: "760px" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.375rem 0", textAlign: "left", background: "none", border: "none", cursor: "pointer", gap: "1.5rem" }}>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a2e", lineHeight: 1.4, letterSpacing: "-0.01em" }}>{faq.q}</span>
                <ChevronDown
                  style={{ width: 18, height: 18, color: "#9ca3af", flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {open === i && (
                <div style={{ paddingBottom: "1.375rem" }}>
                  <p style={{ fontSize: "0.9375rem", color: "#4a5568", lineHeight: 1.8 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
