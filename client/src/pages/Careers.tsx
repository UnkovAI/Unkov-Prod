import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, ArrowRight, Briefcase, Heart, Zap, Globe } from "lucide-react";
import { CareersHeroWidget, HeroWidgetStyles } from "@/components/HeroWidget";

const openings = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote (US)", type: "Full-time", desc: "Own end-to-end delivery of core platform features — from the identity graph API to the governance dashboard UI. You'll work across the stack, shipping real security infrastructure used by enterprise customers.", reqs: ["5+ years full-stack (TypeScript / React / Node.js)", "Experience with graph databases", "Strong grasp of auth, IAM, or security fundamentals", "Comfortable owning features from design to production"] },
  { title: "Machine Learning Engineer", team: "AI / ML", location: "Remote (US)", type: "Full-time", desc: "Design and deploy the ML models behind Unkov's Intent Engine — including Peer-Clone provisioning, Identity Heartbeat scoring, and anomaly detection. You'll work directly on production systems, not research prototypes.", reqs: ["3+ years applied ML in production", "Python and modern ML frameworks", "Graph ML experience a strong plus", "Track record shipping models that drive real product decisions"] },
  { title: "Enterprise Account Executive", team: "Sales", location: "New York, NY / Remote", type: "Full-time", desc: "Drive new enterprise logos in fintech and healthcare. You'll own the full sales cycle — from outbound prospecting to technical evaluation to close — working closely with the founding team on every deal.", reqs: ["5+ years enterprise SaaS sales (security or IAM preferred)", "Proven $500K+ ACV deal history", "Comfortable navigating multi-stakeholder security evaluations", "Strong enough technical grasp to demo the product yourself"] },
  { title: "Senior Product Designer", team: "Design", location: "Remote (US / EU)", type: "Full-time", desc: "Shape the Unkov product experience from scratch. You'll own design across the core governance platform, investor materials, and marketing — with direct input into product direction from day one.", reqs: ["4+ years product design, enterprise SaaS experience", "Strong systems thinking and design systems experience", "Proficiency in Figma, able to prototype interactions", "Comfortable working in a code-adjacent environment"] },
  { title: "Solutions Engineer", team: "Customer Success", location: "Remote (US)", type: "Full-time", desc: "Partner with enterprise customers through deployment, integration, and ongoing value realization. You'll be the technical owner of customer success, translating complex environments into working Unkov deployments.", reqs: ["3+ years solutions or sales engineering", "Deep hands-on knowledge of Okta, AWS IAM, Entra ID, or Workday", "Scripting / API automation experience (Python or Node)", "Excellent written and verbal communication"] },
];

const perks = [
  { icon: Zap,       title: "Equity & upside",       desc: "Meaningful early-stage equity. We share ownership with everyone who helps build it." },
  { icon: Heart,     title: "Full health coverage",   desc: "Medical, dental, and vision for you and your dependents, plus a $100/month wellness stipend." },
  { icon: Globe,     title: "Remote-first",           desc: "Work from wherever you do your best work. We're async-friendly with quarterly in-person offsites." },
  { icon: Briefcase, title: "$2K learning budget",    desc: "Spend it on courses, books, conferences, or anything that sharpens your craft. No approval needed." },
];

export default function Careers() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7", color: "#1a1a2e" }}>
      <Header />
      <HeroWidgetStyles />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2rem, 5vw, 5rem) 0 clamp(1.5rem, 4vw, 4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Careers</span>
            <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>Build the identity gate for the agentic enterprise.</h1>
            <p className="section-sub">We're a small, high-conviction team tackling one of enterprise security's hardest unsolved problems. If you want to own something that matters and ship fast, you'll fit right in.</p>
          </div>
        </section>

        <section className="section-slim" style={{ borderBottom: "1px solid #dcd6ce", backgroundColor: "#f0ece6" }}>
          <div className="container mx-auto px-10">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 md:grid-cols-4 gap-5">
              {perks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="card p-6 text-center" style={{ borderColor: "#dcd6ce" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#edf1ff" }}>
                      <Icon className="w-5 h-5" style={{ color: "#00297a" }} />
                    </div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: "#1a1a2e" }}>{p.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#3d4759" }}>{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-slim">
          <div className="container mx-auto px-10">

            {/* Culture context */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(1.25rem,3vw,3rem)", alignItems: "start", marginBottom: "4rem", paddingBottom: "clamp(2rem,4vw,4rem)", borderBottom: "1px solid #dcd6ce" }}>
              <div>
                <span className="section-label">How we work</span>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>Small team. Real ownership. Fast cycles.</h2>
                <p style={{ fontSize: "1rem", color: "#3d4759", lineHeight: 1.75, marginBottom: "1rem" }}>
                  Unkov is pre-Series A. That means you're not joining a team that's already figured everything out — you're joining a team that's still defining the product, the process, and the culture. The roles are real, the equity is meaningful, and the problems are unsolved.
                </p>
                <p style={{ fontSize: "1rem", color: "#3d4759", lineHeight: 1.75 }}>
                  We value people who write clearly, make decisions with incomplete information, and push back when they disagree. We don't have a lot of meetings. We do have a lot of context-sharing in writing.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Team size",         val: "~10 people"        },
                  { label: "Stage",             val: "Seed / Pre-Series A" },
                  { label: "Engineering stack", val: "TypeScript, React, Python" },
                  { label: "Sales motion",      val: "Enterprise, PLG-assisted" },
                  { label: "Customers",         val: "Fintech & Healthcare pilots" },
                  { label: "Hiring pace",       val: "~5 roles open now"  },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #f0ece6" }}>
                    <span style={{ fontSize: "1rem", color: "#6b7280" }}>{r.label}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a2e" }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8" style={{ color: "#1a1a2e" }}>Open roles</h2>
            <div className="space-y-4 mb-16">
              {openings.map((role, i) => (
                <div key={i} className="card p-6 group" style={{ borderColor: "#dcd6ce" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#00297a")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#dcd6ce")}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#edf1ff", color: "#00297a" }}>{role.team}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#4a5568" }}>{role.location}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#4a5568" }}><Clock className="w-3.5 h-3.5" />{role.type}</span>
                      </div>
                      <h3 className="text-base font-bold mb-2" style={{ color: "#1a1a2e" }}>{role.title}</h3>
                      <p className="text-sm mb-3" style={{ color: "#3d4759" }}>{role.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {role.reqs.map((r, ri) => (
                          <span key={ri} className="text-xs px-2.5 py-1 rounded-md" style={{ backgroundColor: "#f0ece6", color: "#3d4759" }}>{r}</span>
                        ))}
                      </div>
                    </div>
                    <a href="mailto:careers@unkov.com" className="btn-primary shrink-0 text-sm" onClick={e => e.stopPropagation()}>
                      Apply <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-10 text-center text-white" style={{ backgroundColor: "#00297a" }}>
              <h2 className="text-2xl font-bold mb-3">Don't see a perfect fit?</h2>
              <p className="mb-6 max-w-lg mx-auto text-sm" style={{ color: "#c2d4f8" }}>We're always interested in exceptional people. Send a note and tell us how you'd contribute to Unkov's mission.</p>
              <a href="mailto:careers@unkov.com" className="inline-flex items-center gap-2 bg-white font-semibold px-7 py-3 rounded-lg text-sm transition-colors" style={{ color: "#00297a" }}>
                Get in Touch <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
