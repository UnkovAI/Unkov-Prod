import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lightbulb, Eye, Zap, Heart, Shield, Target, Users, Mail, ArrowRight } from "lucide-react";
import { Linkedin, Twitter, Github } from "lucide-react";

const values = [
  { icon: Zap,    title: "Innovation",          desc: "We push the boundaries of AI and graph technology to solve problems that legacy tools structurally cannot. Our architecture isn't a feature — it's a fundamentally different model." },
  { icon: Heart,  title: "Customer Obsession",  desc: "Every product decision is anchored in the real operational pain of CISOs and IT leaders. We don't build features in the abstract; we solve the problems that cost enterprises $1.2M a year." },
  { icon: Shield, title: "Integrity",            desc: "We operate with full transparency — our AI is explainable, auditable, and never a black box. Every automated action is logged, traceable, and defensible in any audit." },
  { icon: Target, title: "Resilience",           desc: "We build systems that improve with use — the Intent Engine becomes more accurate with every identity interaction, and every customer deployment makes the platform more capable for everyone." },
];

const teamRoles = [
  { role: "Chief Executive Officer",  focus: "Vision, fundraising, and enterprise go-to-market leadership" },
  { role: "Chief Technology Officer", focus: "Graph architecture, AI/ML engineering, and cloud infrastructure" },
  { role: "Chief Revenue Officer",    focus: "Enterprise SaaS sales in cybersecurity or identity" },
  { role: "Head of Product",          focus: "Identity security domain expertise and product roadmap" },
];

export default function Company() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <section style={{ borderBottom: "1px solid #e5e7eb", padding: "clamp(2.5rem,5vw,5rem) 0 clamp(2rem,4vw,4rem)", backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Company</span>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              About Us
            </h1>
            <p className="section-sub">
              We're building the identity gate enterprises need to govern every AI agent and human identity — inline, at machine speed, before anything acts.
            </p>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-[#e8f0fe] rounded-lg"><Lightbulb className="w-5 h-5 text-[#00297a]" /></div>
                  <h2 className="text-lg font-bold text-[#1d1d1f]">Mission</h2>
                </div>
                <p className="text-[#3d4759] leading-relaxed">
                  To transform enterprise identity from a manual, reactive burden into an autonomous, self-healing system — turning the most exploited attack surface in cybersecurity into a strategic competitive advantage.
                </p>
              </div>
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-[#e8f0fe] rounded-lg"><Eye className="w-5 h-5 text-[#00297a]" /></div>
                  <h2 className="text-lg font-bold text-[#1d1d1f]">Vision</h2>
                </div>
                <p className="text-[#3d4759] leading-relaxed">
                  To become the identity gate every enterprise depends on — the inline authorization layer that every AI agent and human identity must pass through before it can act on anything.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="max-w-3xl">
              <span className="section-label">Our Story</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6">Built to solve a problem legacy tools can't see</h2>
              <div className="space-y-5 text-[#3d4759] leading-relaxed" style={{ fontSize: "0.9375rem" }}>
                <p>Unkov was founded to address a structural gap in enterprise security. Legacy IAM solutions like Okta and SailPoint were built for a world where humans controlled identity governance — defined by flat relational databases and manual approval queues. That world no longer exists.</p>
                <p>With AI agents proliferating across enterprises at ratios as high as 5.2:1, the traditional human-in-the-loop model breaks down completely. You cannot manually review and approve access for thousands of AI agents. You need autonomous governance — and that's exactly what we built.</p>
                <p>Unkov is the identity gate between every human, AI agent, and everything they can touch. No agent acts without Unkov's permission — every identity verified, every action authorized, every decision audited. Unlike Okta (human-only, reactive), Entro/Astrix (detection without enforcement), or Zscaler (network-layer, not identity-native), Unkov sits inline as the authorization layer — hardware-rooted identity, cross-sector intelligence, and compliance system of record built in from day one.</p>
                <p className="text-[#3d4759] italic text-sm border-l-2 border-[#c2d4f8] pl-4">
                  The core Identity Graph engine and Zero-Touch Observation Mode are production-ready, delivering a live Identity Drift dashboard within 30 minutes of deployment.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="max-w-xl mb-8">
              <span className="section-label">Values</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f]">How we operate</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="card p-7">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-[#e8f0fe] rounded-lg shrink-0"><Icon className="w-4 h-4 text-[#00297a]" /></div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1d1d1f] mb-2">{v.title}</h3>
                        <p className="text-sm text-[#3d4759] leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="max-w-xl mb-6">
              <span className="section-label">Team</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Leadership</h2>
              <p className="text-sm text-[#3d4759]">Our founding team brings deep expertise in enterprise security, identity governance, and AI infrastructure.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {teamRoles.map((m, i) => (
                <div key={i} className="card p-6" style={{ borderColor: "#d8dde6", backgroundColor: "#fafafa" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#00297a]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#1d1d1f] mb-1">{m.role}</div>
                      <p className="text-xs text-[#3d4759]">{m.focus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="max-w-xl mb-6">
              <span className="section-label">Responsible AI</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Every decision is explainable</h2>
              <p className="text-[#3d4759] leading-relaxed">Every automated action Unkov takes is explainable, auditable, and defensible — because our customers require nothing less from their own regulators.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: "Transparency & Explainability", body: "Every provisioning decision includes a plain-language rationale. No black boxes — every action is logged, traceable, and defensible in any SOC 2 or HIPAA audit." },
                { title: "Regulatory Alignment",          body: "Unkov maps to EU AI Act High-Risk AI System standards and is fully aligned with the Colorado AI Act (effective June 30, 2026) regarding algorithmic accountability." },
                { title: "Privacy by Design",             body: "Data minimization and anonymization applied by default. Sensitive PII is never used for broader model training. Monthly algorithmic audits remove unintended bias." },
              ].map((item, i) => (
                <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                  <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: "#00297a" }} />
                  <h3 className="text-sm font-bold text-[#1d1d1f] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#3d4759] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap mt-6">
              {["ISO 42001:2023 (pursuing)", "EU AI Act — High-Risk System compliant", "Colorado AI Act aligned", "NIST AI RMF"].map((badge, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#e8f0fe", color: "#00297a", border: "1px solid #bfcfee" }}>{badge}</span>
              ))}
            </div>
          </div>
        </section>
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="max-w-xl mb-6">
              <span className="section-label">Long-Term Vision</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">The identity gate for the agentic enterprise</h2>
              <p className="text-[#3d4759] leading-relaxed">The end-state is a world where every identity — human, bot, or AI agent — is governed inline before it can act. Unkov becomes the gate every enterprise's agentic workforce depends on. No manual reviews. No orphaned accounts. No AI agent operating without authorization. Four compounding moats: identity gate lock-in, cross-sector network intelligence, hardware-rooted agent identity, and compliance system of record. Governance as infrastructure.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-7" style={{ borderColor: "#dcd6ce" }}>
                <h3 className="text-sm font-bold text-[#1d1d1f] mb-4">Where we're headed</h3>
                <div className="space-y-3">
                  {[
                    { title: "Compliance Autopilot",              desc: "Continuous SOC 2, HIPAA, and PCI DSS evidence — generated automatically, always audit-ready." },
                    { title: "Cross-tenant threat intelligence",   desc: "Anonymized behavioral patterns across the customer base surface novel attack vectors before they reach any enterprise." },
                    { title: "Full agentic economy coverage",      desc: "Agent-to-agent trust relationships, AI identity lifecycle management, and governance for emerging agentic architectures." },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: "#00297a" }} />
                      <div>
                        <div className="text-sm font-semibold text-[#1d1d1f]">{a.title}</div>
                        <div className="text-xs text-[#3d4759] mt-0.5">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-7" style={{ borderColor: "#dcd6ce" }}>
                <h3 className="text-sm font-bold text-[#1d1d1f] mb-4">The category we're defining</h3>
                <p className="text-sm text-[#3d4759] leading-relaxed mb-5">Unkov is building what we call Autonomous Identity Orchestration — the intelligence layer between your existing IAM tools and the continuously shifting identity landscape of the agentic enterprise.</p>
                <div className="space-y-2">
                  {[
                    ["Today",      "Identity Gate live — design partner pilots running in BFSI and healthcare"],
                    ["Near-term",  "Bot Reputation Network + Compliance System of Record"],
                    ["Long-term",  "Hardware TPM identity + SEC/HHS System of Record + Patient Data Lineage + Global 2000 standard"],
                  ].map(([y, d]) => (
                    <div key={y} className="flex items-start gap-3 text-sm">
                      <span className="font-bold shrink-0 text-xs" style={{ color: "#00297a", minWidth: 72 }}>{y}</span>
                      <span className="text-[#3d4759]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-slim">
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <div className="card p-10 border-0 text-center" style={{ backgroundColor: "#00297a" }}>
              <h2 className="text-2xl font-bold text-white mb-3">Work with us or invest</h2>
              <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "#c2d4f8" }}>
                Whether you're an investor exploring the opportunity or a CISO ready to eliminate the Manual Review Tax — we'd love to talk.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#ffffff] text-[#00297a] hover:bg-[#e8f0fe] font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                  <Mail className="w-4 h-4" /> Get in touch
                </a>
                <a href="/investor-gate" className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm text-white" style={{ backgroundColor: "#001f5c" }}>
                  Investor Overview <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center justify-center gap-4 mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <a href="https://x.com/UnkovAI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#c2d4f8" }}>
                  <Twitter className="w-4 h-4" /> @UnkovAI
                </a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="https://www.linkedin.com/company/112230801" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#c2d4f8" }}>
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                <a href="https://github.com/UnkovAI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#c2d4f8" }}>
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
