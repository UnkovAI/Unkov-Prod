import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Download, Mail } from "lucide-react";

const coverage = [
  { outlet: "TechCrunch",       title: "Unkov raises $4M seed to bring autonomous identity governance to the agentic enterprise",               date: "January 5, 2026",  url: "https://techcrunch.com" },
  { outlet: "Dark Reading",     title: "As AI Agents Proliferate, Identity Governance Must Evolve — Unkov Is Betting on Autonomy",              date: "February 3, 2026", url: "https://www.darkreading.com" },
  { outlet: "SC Media",         title: "The Non-Human Identity Crisis: Why 5.2:1 Agent-to-Human Ratios Demand a New Approach",                  date: "February 20, 2026",url: "https://www.scmagazine.com" },
  { outlet: "Help Net Security", title: "Unkov Launches Identity Gate to Govern AI Agents at Enterprise Scale",                        date: "March 1, 2026",    url: "https://www.helpnetsecurity.com" },
];

const releases = [
  { title: "Unkov Closes $4M Seed Round, Launches Identity Gate for AI Agents and Enterprise Identities", date: "January 5, 2026", summary: "Unkov today announced the close of a $4M seed financing round and the launch of its identity gate platform for AI agents and enterprise identities. The identity gate sits inline between every AI agent and everything it can touch — every identity verified, every action authorized, every decision audited." },
  { title: "Unkov Partners with Tier-1 Fintech to Automate Access Governance, Achieving 90% Reduction in Manual Review", date: "February 14, 2026", summary: "Unkov announced a strategic deployment with a leading fintech organization, reducing quarterly manual access review hours by 90% and achieving full audit readiness within 30 days of deployment." },
];

export default function Press() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem, 5vw, 5rem) 0 clamp(1.5rem, 4vw, 4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Press & Media</span>
            <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Unkov in the News
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#3d4759", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Latest coverage, press releases, and media resources. For press inquiries, contact{" "}
              <a href="mailto:press@unkov.com" style={{ color: "#00297a", fontWeight: 600 }}>press@unkov.com</a>.
            </p>
            {/* Outlet logos row */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2vw,2rem)", flexWrap: "wrap" }}>
              {coverage.map((c, i) => (
                <span key={i} style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#6b7280", letterSpacing: "-0.01em", textTransform: "uppercase" }}>{c.outlet}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-10" style={{ maxWidth: "900px", padding: "clamp(1.5rem, 4vw, 3.5rem) 0 clamp(2rem, 5vw, 5rem)" }}>

          {/* Company fast facts */}
          <div style={{ backgroundColor: "#f0ece6", border: "1px solid #dcd6ce", borderRadius: "1rem", padding: "2rem 2.25rem", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", marginBottom: "1.25rem" }}>Company at a glance</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1.5rem" }}>
              {[
                { val: "Seed", label: "Funding stage" },
                { val: "2025",      label: "Founded"                  },
                { val: "Remote",    label: "HQ (US-based)"            },
                
                { val: "5",         label: "Blog posts and case studies published" },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#00297a", letterSpacing: "-0.025em" }}>{f.val}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.125rem" }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Coverage */}
          <h2 style={{ fontSize: "1.375rem", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Media Coverage</h2>
          <div className="grid md:grid-cols-2" style={{ gap: "1rem", marginBottom: "3.5rem" }}>
            {coverage.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", padding: "1.5rem 1.75rem", borderRadius: "0.875rem", border: "1px solid #e5e7eb", backgroundColor: "#ffffff", textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00297a"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,41,122,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#00297a" }}>{item.outlet}</span>
                  <ExternalLink style={{ width: 14, height: 14, color: "#d1d5db" }} />
                </div>
                <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", lineHeight: 1.5, marginBottom: "0.75rem" }}>{item.title}</p>
                <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>{item.date}</p>
              </a>
            ))}
          </div>

          {/* Press Releases */}
          <h2 style={{ fontSize: "1.375rem", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Press Releases</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3.5rem" }}>
            {releases.map((r, i) => (
              <div key={i} style={{ padding: "1.75rem 2rem", borderRadius: "0.875rem", border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
                <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginBottom: "0.5rem" }}>{r.date}</p>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#111827", lineHeight: 1.4, marginBottom: "0.875rem", letterSpacing: "-0.01em" }}>{r.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.125rem" }}>{r.summary}</p>
                <a href={`mailto:press@unkov.com?subject=Press Release — ${encodeURIComponent(r.title)}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 700, color: "#00297a", textDecoration: "none" }}>
                  <Mail style={{ width: 14, height: 14 }} /> Request full release
                </a>
              </div>
            ))}
          </div>

          {/* Brand + Media contact */}
          <div className="grid md:grid-cols-2" style={{ gap: "1rem" }}>
            <div style={{ padding: "1.75rem 2rem", borderRadius: "0.875rem", border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.625rem" }}>Brand Assets</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.25rem" }}>Logo, brand guidelines, and product screenshots for editorial use.</p>
              <a href="mailto:press@unkov.com?subject=Brand Assets Request" className="btn-primary" style={{ fontSize: "0.875rem" }}>
                <Download style={{ width: 14, height: 14 }} /> Request Press Kit
              </a>
            </div>
            <div style={{ padding: "1.75rem 2rem", borderRadius: "0.875rem", border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.625rem" }}>Media Contact</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.25rem" }}>For press inquiries, interview requests, or editorial questions.</p>
              <a href="mailto:press@unkov.com" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 700, color: "#00297a", textDecoration: "none", padding: "0.5rem 1.25rem", borderRadius: "0.75rem", border: "1.5px solid #00297a", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                <Mail style={{ width: 14, height: 14 }} /> press@unkov.com
              </a>
            </div>
          </div>

          {/* About Unkov boilerplate */}
          <div style={{ marginTop: "3.5rem", paddingTop: "3rem", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", marginBottom: "0.875rem" }}>About Unkov</div>
            <p style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.75, maxWidth: "640px" }}>
              Unkov is an AI-native identity governance platform built for the agentic enterprise. Every AI agent passes through Unkov before it acts — identity verified, action authorized, decision audited. Covers every human and non-human identity across BFSI and healthcare environments. Available as a standalone platform or as an intelligence layer on top of Okta, SailPoint, and Azure AD. Founded in 2025, seed-funded, headquartered remotely across the United States.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
