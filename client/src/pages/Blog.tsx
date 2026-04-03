import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";

const posts = [
  {
    title: "The 5.2:1 Problem: Why AI Agents Are Breaking Identity Governance",
    excerpt: "In the agentic enterprise, AI agents already outnumber human employees at a 5.2:1 ratio. Legacy IAM tools weren't built for this reality.",
    body: `The numbers are staggering. By 2026, the average enterprise runs 100+ non-human identities for every human employee. Service accounts, API keys, OAuth tokens, CI/CD pipelines, AI copilots — each one a potential attack vector, most of them invisible to legacy IAM tools.\n\nTraditional identity governance was designed for humans. Role-based access control assumes predictable job functions. Access reviews assume someone can read a spreadsheet and make a judgment call. Certification campaigns assume quarterly cadence is fast enough.\n\nNone of those assumptions hold for AI agents. An agent spun up for a specific task can accumulate permissions in minutes. It doesn't follow a job description. It doesn't show up in an HR system. And if it's compromised, it doesn't behave oddly enough to trigger an alert — it just quietly exfiltrates data or escalates privileges.\n\nUnkov was built for this reality. The identity gate maps every non-human identity in real time, scores its risk continuously, and remediates automatically when anomalies are detected. No spreadsheets. No quarterly reviews. No human latency in the loop.\n\nThe 5.2:1 problem isn't coming — it's here. The only question is whether your identity governance can keep up.`,
    category: "Thought Leadership", date: "March 10, 2026", readTime: "6 min read", featured: true,
  },
  {
    title: "How Unkov Reduced Manual Access Review by 90% for a Tier-1 Fintech",
    excerpt: "A leading fintech firm was spending 120+ hours per quarter on manual access reviews. After deploying Unkov, that dropped to under 12 hours.",
    body: `A leading fintech firm came to us with a familiar problem: their quarterly access review process had become untenable. Three dedicated IT staff spending 40+ hours each, every quarter, manually reviewing spreadsheets of user permissions, service account access, and API key assignments.\n\nThe real cost wasn't just the 120 hours. It was the quality of those reviews. When a human reviews 4,000 access records in a spreadsheet, cognitive fatigue sets in around record 200. Anomalies get missed. Outliers get rubber-stamped. The whole exercise becomes a compliance checkbox rather than a genuine security control.\n\nAfter deploying Unkov's identity gate, the firm's quarterly review time dropped to under 12 hours — a 90% reduction. More importantly, the quality improved dramatically. Unkov's continuous scoring meant that by the time humans reviewed anything, they were only looking at flagged anomalies rather than the entire access universe.\n\nThe firm achieved full audit readiness within 30 days of deployment, passed their next SOC 2 Type II examination with zero access-related findings, and identified three previously unknown service accounts with admin-level database access — all within the first week.`,
    category: "Case Study", date: "February 28, 2026", readTime: "8 min read", featured: false,
  },
  {
    title: "Understanding Non-Human Identities: The New Frontier of IAM",
    excerpt: "Service accounts, API keys, OAuth tokens, AI agents — the explosion of NHIs has created an identity attack surface most organizations can't see. And alerting alone won't fix it. You need an identity gate.",
    body: `When most security teams talk about identity, they mean users. Directory accounts, SSO logins, MFA enrolments. But the fastest-growing category of identity in the enterprise isn't human at all.\n\nNon-human identities (NHIs) include service accounts, API keys, OAuth tokens, machine certificates, CI/CD pipeline credentials, cloud workload identities, and increasingly, AI agent identities. In a typical mid-market enterprise, NHIs outnumber human identities by a factor of 10 to 50. In AI-forward organisations, that ratio can exceed 5.2:1.\n\nThe problem isn't just volume — it's visibility. NHIs are created by developers, DevOps engineers, and increasingly by automated provisioning systems. They don't go through HR. They don't appear in identity governance workflows. They accumulate permissions over time through a process called "identity drift," where small, justified access expansions compound into massive, unjustified privilege.\n\nThe attack surface implications are severe. In 2025, over 60% of major data breaches involved compromised non-human credentials. The average NHI has access to 3x more sensitive data than the human who created it, and 40% of NHIs in production environments have not been used in the past 90 days — meaning they're dormant, unmonitored, and potentially compromised.\n\nUnkov's Discovery Engine finds all of it. Zero-touch scanning builds a complete NHI inventory in under 30 minutes, with continuous updates as new identities are created.`,
    category: "Education", date: "February 14, 2026", readTime: "5 min read", featured: false,
  },
  {
    title: "PCI DSS 4.0 and the Autonomous Compliance Mandate",
    excerpt: "PCI DSS 4.0's new access control requirements are now in full effect. We explain what changed and how Unkov automates the hard parts.",
    body: `PCI DSS 4.0 became the mandatory standard in March 2024, replacing version 3.2.1. For identity and access management teams, the changes are significant — and the enforcement deadline has passed.\n\nThe key changes affecting identity governance include Requirement 7's expanded scope for access control, now explicitly covering system components, software, and application accounts in addition to user identities. Requirement 8 introduced stricter requirements for service account management, including mandatory periodic reviews of all system and application accounts — a category that maps directly to non-human identities.\n\nMost critically, 4.0 introduced the concept of "customised approach" — a flexibility provision that also raises the bar for documentation. Organisations choosing customised controls must demonstrate equivalent or greater security outcomes, with objective evidence.\n\nFor organisations still relying on manual quarterly access reviews, 4.0 creates a significant compliance risk. The requirement for "periodic" reviews has been tightened, and auditors are increasingly interpreting "periodic" as continuous or near-real-time for high-risk access categories.\n\nUnkov's Predictive Compliance module generates audit-ready reports aligned to PCI DSS 4.0 requirements automatically, maps every access decision to specific requirement clauses, and maintains a continuous evidence trail that satisfies both the standard and the customised approach documentation requirements.`,
    category: "Compliance", date: "January 30, 2026", readTime: "7 min read", featured: false,
  },
  {
    title: "The Spreadsheet Trap: Why Manual Identity Reviews Are Killing IT Productivity",
    excerpt: "IT teams across the enterprise are spending hundreds of hours each quarter manually reviewing access spreadsheets. This is a systemic security risk.",
    body: `There's a ritual that plays out in IT departments across the world every quarter. Someone exports a CSV of user permissions from Active Directory. Another person exports service account data from the cloud console. A third person tries to merge them in Excel. Then three people spend the next two weeks clicking through rows and trying to remember why someone in finance has read access to the production database.\n\nThis is the spreadsheet trap — and it's not just a productivity problem. It's a security crisis.\n\nThe fundamental issue is that manual access review was designed for a world where identity change was slow, access was hierarchical, and the number of accounts was manageable. None of those conditions hold in 2026. Access changes happen continuously. Identities include machines, agents, and APIs. And the sheer volume of accounts in a mid-market enterprise — often exceeding 50,000 — makes meaningful human review impossible.\n\nThe consequences are predictable: rubber-stamping, missed anomalies, alert fatigue, and a compliance posture built on checkbox exercises rather than genuine security controls.\n\nUnkov eliminates the spreadsheet entirely. The identity gate provides continuous access intelligence, automatic anomaly detection, and AI-generated remediation recommendations. When humans do need to review something, they're reviewing a curated list of genuine anomalies — not 50,000 rows of a CSV.`,
    category: "Thought Leadership", date: "January 15, 2026", readTime: "4 min read", featured: false,
  },
];

const catColor: Record<string, string> = {
  "Thought Leadership": "#00297a",
  "Case Study": "#059669",
  "Education": "#0061d4",
  "Compliance": "#92400e",
  "Company": "#00297a",
};
const catBg: Record<string, string> = {
  "Thought Leadership": "#e8f0fe",
  "Case Study": "#d1fae5",
  "Education": "#dbeafe",
  "Compliance": "#fef3c7",
  "Company": "#e8f0fe",
};

export default function Blog() {
  const [open, setOpen] = useState<typeof posts[0] | null>(null);
  const [activeCat, setActiveCat] = useState("All");
  const featured = posts.find(p => p.featured)!;
  const rest = posts.filter(p => !p.featured && (activeCat === "All" || p.category === activeCat));

  if (open) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
        <Header />
        <div style={{ paddingTop: 60, minHeight: "100vh" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
            <button onClick={() => setOpen(null)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem", fontWeight: 600, color: "#00297a", background: "none", border: "none", cursor: "pointer", marginBottom: "2.5rem", padding: 0 }}>
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </button>
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: catBg[open.category] || "#e8f0fe", color: catColor[open.category] || "#00297a" }}>
              {open.category}
            </span>
            <h1 style={{ fontSize: "clamp(1.375rem,3.5vw,2.25rem)", fontWeight: 600, color: "#1a1a2e", lineHeight: 1.2, margin: "1.25rem 0 1rem", letterSpacing: "-0.025em" }}>
              {open.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem,1.5vw,1.5rem)", flexWrap: "wrap", fontSize: "1rem", color: "#6b7280", marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Calendar className="w-4 h-4" />{open.date}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Clock className="w-4 h-4" />{open.readTime}</span>
            </div>
            <div style={{ fontSize: "1.0625rem", color: "#374151", lineHeight: 1.85 }}>
              {open.body.split("\n\n").map((para, i) => (
                <p key={i} style={{ marginBottom: "1.75rem" }}>{para}</p>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem, 5vw, 5rem) 0 clamp(1.5rem, 4vw, 4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Blog</span>
            <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              AI Agent Identity,<br />Governance & Security
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#3d4759", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Thought leadership, research, and practical guides from the team building the identity gate between every human, AI agent, and everything they can touch.
            </p>
            {/* Category filter pills */}
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {["All", "Thought Leadership", "Case Study", "Compliance", "Education"].map((cat) => (
                <span key={cat} onClick={() => setActiveCat(cat)} style={{ padding: "0.375rem 1rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 600, backgroundColor: activeCat === cat ? "#111827" : "#f3f4f6", color: activeCat === cat ? "#fff" : "#374151", cursor: "pointer", border: "1px solid transparent", transition: "all 0.15s" }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "clamp(1.5rem, 4vw, 3.5rem) 0 clamp(2rem, 5vw, 5rem)" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>

            {/* Featured */}
            <div className="card mb-6 overflow-hidden" style={{ borderColor: "#e5e7eb", cursor: "pointer", borderRadius: "1rem" }}
              onClick={() => setOpen(featured)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00297a"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,41,122,0.09)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <div style={{ padding: "2.5rem 2.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <span style={{ padding: "0.25rem 0.875rem", borderRadius: "9999px", fontSize: "1.0625rem", fontWeight: 700, backgroundColor: catBg[featured.category], color: catColor[featured.category] }}>{featured.category}</span>
                  <span style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280" }}>Featured</span>
                </div>
                <h2 style={{ fontSize: "1.625rem", fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: "0.875rem", maxWidth: "600px" }}>{featured.title}</h2>
                <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: "560px" }}>{featured.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem,1.5vw,1.5rem)", flexWrap: "wrap", fontSize: "1rem", color: "#6b7280" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "1rem", fontWeight: 700, color: "#00297a" }}>
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2" style={{ gap: "1.25rem" }}>
              {rest.map((p, i) => (
                <div key={i} className="card" style={{ borderColor: "#e5e7eb", cursor: "pointer", padding: "1.5rem", borderRadius: "0.875rem" }}
                  onClick={() => setOpen(p)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00297a"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,41,122,0.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <span style={{ padding: "0.2rem 0.75rem", borderRadius: "9999px", fontSize: "1rem", fontWeight: 700, backgroundColor: catBg[p.category] || "#e8f0fe", color: catColor[p.category] || "#00297a", marginBottom: "1rem", display: "inline-block" }}>{p.category}</span>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", lineHeight: 1.45, marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: 1.7, marginBottom: "1.25rem" }}>{p.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1rem", color: "#6b7280" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Calendar className="w-3 h-3" />{p.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock className="w-3 h-3" />{p.readTime}</span>
                    </div>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "1rem", fontWeight: 700, color: "#00297a" }}>
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
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
