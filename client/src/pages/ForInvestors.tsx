import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvestorResources from "@/components/InvestorResources";
import { CheckCircle, ArrowRight, Mail, DollarSign, Shield, Users, TrendingUp, Globe, AlertTriangle, Zap, Brain, BarChart3, Radio } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const terms = [
  ["Round Type",           "Seed — Post-Money SAFE"],
  ["Target Raise",         "Available on request"],
  ["Pre-Money Valuation",  "Available on request"],
  ["Post-Money Valuation", "Available on request"],
  ["Equity Dilution",      "Available on request"],
  ["Cash Runway",          "Available on request"],
];

const funds = [
  { label: "Talent",         pct: 70, amount: "70%", desc: "Engineering — AI/ML and infrastructure specialists" },
  { label: "Infrastructure", pct: 20, amount: "20%", desc: "Infrastructure — graph compute, ML inference, cloud operations" },
  { label: "Go-to-Market",   pct: 10, amount: "10%", desc: "Go-to-Market — targeted outreach in BFSI and Healthcare" },
];

const projections = [
  { year: "Year 1", customers: 5,   acv: "$20K", revenue: "$100K",  ebit: "($1.46M)" },
  { year: "Year 2", customers: 15,  acv: "$25K", revenue: "$375K",  ebit: "($1.24M)" },
  { year: "Year 3", customers: 40,  acv: "$30K", revenue: "$1.2M",  ebit: "($575K)"  },
  { year: "Year 4", customers: 80,  acv: "$35K", revenue: "$2.8M",  ebit: "$705K"    },
  { year: "Year 5", customers: 150, acv: "$40K", revenue: "$6M",    ebit: "$3.27M"   },
];

const milestones = [
  { month: "Month 3",  title: "Team Build-Out",   desc: "5 engineers hired" },
  { month: "Month 6",  title: "First 3 Pilots",   desc: "Signed contracts, live deployments" },
  { month: "Month 8",  title: "AWS Marketplace",  desc: "Active listing, first inbound leads" },
  { month: "Month 12", title: "$200K+ ARR",        desc: "10 paying customers" },
  { month: "Month 14", title: "MSP Partner",       desc: "First active reseller agreement" },
  { month: "Month 16", title: "SOC 2 Type II",     desc: "Clean audit report" },
  { month: "Month 24", title: "$500K ARR",          desc: "15–20 customers → Series A" },
];

const seriesA = [
  { metric: "ARR",       value: "$500K"    },
  { metric: "Customers", value: "15–20"    },
  { metric: "Churn",     value: "< 10%"    },
  { metric: "NRR",       value: "> 110%"   },
  { metric: "Detection", value: "−80 days" },
];

const buyers = [
  { icon: Shield,      role: "CISO / Security Director", pain: "Lateral movement, 241-day breach lifecycle",    hook: "Kill lateral movement before it becomes an incident" },
  { icon: Users,       role: "CIO / IT VP",              pain: "120+ hour quarterly Manual Review Tax",         hook: "Reallocate engineers to strategic security work"     },
  { icon: DollarSign,  role: "CFO",                      pain: "Breach cost exposure, compliance spend",        hook: "$4.2M average savings per incident avoided"         },
  { icon: CheckCircle, role: "Compliance / Audit Lead",  pain: "Spreadsheet theater, audit prep burden",        hook: "System of Record for SEC and HHS — one-click AI governance export"       },
];

const acquirers = [
  { tier: "Tier 1 — Cloud Providers",     cos: ["Amazon Web Services", "Microsoft Azure", "Google Cloud"],       note: "Unkov's deep AWS-native architecture and cloud-first deployment model make it a natural fit for cloud provider portfolio expansion. Identity governance is a key cloud-native service gap." },
  { tier: "Tier 1.5 — Healthcare Systems", cos: ["Epic Systems", "Oracle Health", "Meditech"], note: "Patient Data Lineage — prove which AI agent touched which patient record and why — creates an unbreakable HIPAA compliance moat. HHS System of Record status is the highest-value lock-in in regulated healthcare." },
  { tier: "Tier 2 — Security Platforms",   cos: ["Palo Alto Networks", "CrowdStrike", "Zscaler"],                 note: "Building comprehensive security platforms with track records of acquiring best-in-class point solutions. Unkov's AI Proxy fills the LLM governance gap none of them currently address — a natural bolt-on to SASE and XDR platforms." },
  { tier: "Tier 3 — Enterprise Software", cos: ["ServiceNow", "Salesforce", "SailPoint / Okta"],                 note: "Both ServiceNow and Salesforce have invested significantly in identity and governance workflows. SailPoint/Okta would acquire to defend market share against graph-native + AI proxy competition. Entro, Astrix, and Strata.io validate the NHI governance market but lack Unkov's identity gate lock-in and AI proxy control." },
];

const gtm = [
  { icon: TrendingUp, title: "Zero-Touch Pilot — No Pilot Purgatory", badge: "Pilot", desc: "A structured 30–90 day paid pilot with defined success metrics agreed upfront. If Unkov discovers X orphaned agents or prevents Y unauthorized actions, the customer moves to a paid contract. Pilot fee credited in full toward Year 1 ACV. No open-ended trials." },
  { icon: Users,      title: "Direct Enterprise Sales",      badge: "Direct",   desc: "High-touch, consultative sales targeting CISOs and CIOs at 1,000–19,000 employee organizations. The Zero-Touch Pilot is the primary sales tool — prospects see their own live data in 30 minutes." },
  { icon: Globe,      title: "MSP Channel Partners",         badge: "Channel",  desc: "Managed Service Providers deliver Unkov via a white-labeled multi-tenant dashboard, providing access to a large mid-market customer base at significantly lower customer acquisition cost." },
];

const funnel = [
  { stage: "Awareness",  activity: "Content, conferences, Identity Audit tool",  conversion: "—"           },
  { stage: "Interest",   activity: "Demo request or Audit tool activation",       conversion: "5% of leads" },
  { stage: "Evaluation", activity: "30-minute Zero-Touch Pilot deployment",       conversion: "40% of demos"},
  { stage: "Decision",   activity: "Proposal and contract negotiation",           conversion: "30% of pilots"},
  { stage: "Retention",  activity: "Quarterly business reviews, expansion",       conversion: "< 10% churn" },
];

const competitive = [
  { cap: "Architecture",   unkov: "Graph-native Social Fabric",      legacy: "Relational database (flat lists)"  },
  { cap: "Identity scope", unkov: "Unified human + non-human",      legacy: "Human employees only"              },
  { cap: "Logic",          unkov: "Intent-based (predictive)",      legacy: "Request-based (reactive)"          },
  { cap: "Setup time",     unkov: "< 30 minutes, zero-touch",       legacy: "Months of professional services"   },
  { cap: "Remediation",    unkov: "Autonomous Kill-Switch + purge", legacy: "Manual to-do lists"                },
  { cap: "NHI governance", unkov: "Native, first-class",            legacy: "Afterthought / bolt-on"            },
  { cap: "Authorization model", unkov: "Inline identity gate — every agent verified before acting", legacy: "Static role assignments"            },
  { cap: "Network intel",    unkov: "Cross-tenant Bot Reputation",    legacy: "Siloed, per-customer only"          },
  { cap: "AI tool calls",    unkov: "AI Proxy — every LLM call gated + logged", legacy: "No visibility — providers called directly"  },
  { cap: "Risk scoring",     unkov: "Weighted model, real-time event updates",   legacy: "Rule-based, nightly refresh"                },
  { cap: "Compliance",     unkov: "Continuous evidence collection", legacy: "Point-in-time audit scrambles"     },
];

const swot = [
  { type: "Strengths", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", items: [
    "Graph-native architecture — structurally impossible for legacy vendors to replicate without a complete rebuild of their data foundation",
    "AI Proxy creates irreversible lock-in — once clients route AI calls through Unkov, removing it breaks all AI tooling",
    "First-mover in Agentic AI Governance + AI Proxy control category with pilot validation",
    "Zero-touch deployment removes the biggest enterprise sales objection",
  ]},
  { type: "Weaknesses", color: "#d97706", bg: "#fffbeb", border: "#fde68a", items: [
    "Pre-revenue — validation is pilot-stage, not production-scale",
    "Infrastructure compute costs scale with customer base — managed through tiered provisioning",
    "Small founding team creates execution risk at rapid growth",
    "Brand awareness at zero — requires significant early GTM investment",
  ]},
  { type: "Opportunities", color: "#0061d4", bg: "#eff6ff", border: "#bfdbfe", items: [
    "Mandatory AI inventories for enterprises by late 2026 create urgent compliance demand",
    "5.2:1 NHI-to-human ratio creates an ungoverned attack surface legacy tools cannot address",
    "No competitor currently offers an AI Proxy that gates LLM calls with identity context — first-mover window",
    "Hardware-rooted identity (TPM/Secure Enclave) is a planned Year 2 moat no competitor has announced",
    "MSP channel provides mid-market distribution at low CAC with white-label margins",
    "AWS Marketplace procurement removes typical 12-month enterprise sales cycle friction",
  ]},
  { type: "Threats", color: "#dc2626", bg: "#fff5f5", border: "#fecaca", items: [
    "Legacy vendors (Okta, SailPoint) could attempt to retrofit graph-native capabilities",
    "Prompt injection attacks on AI agents represent a novel, rapidly evolving risk vector",
    "Enterprise sales cycles may extend beyond projections for first 3–5 logos",
    "AWS dependency creates concentration risk if infrastructure pricing changes materially",
  ]},
];

export default function ForInvestors() {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem("unkov_investor_auth") !== "true") {
      navigate("/investor-gate");
    } else {
      sessionStorage.removeItem("unkov_investor_auth");
    }
  }, []);

  if (sessionStorage.getItem("unkov_investor_auth") !== "true") return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f7" }}>
      <Header />
      <div className="pt-20">

        {/* Hero */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-3xl">
              <span className="section-label">Confidential · For Investors</span>
              <h1 className="text-4xl md:text-4xl font-bold text-[#1d1d1f] leading-tight mb-5">
                Unkov — Seed Round<br />Investment Overview
              </h1>
              <p className="section-sub mb-8">
                The identity gate between every human, AI agent, and everything they can touch. No AI agent acts without Unkov's permission. $4M seed at $20M post-money. 32-month runway to $500K ARR and Series A.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#d8dde6]">
                {[["$4M", "Seed round target"], ["$20M", "Post-money valuation"], ["$30B+", "Combined IGA + ITDR TAM"], ["82%", "Target gross margin"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold text-[#00297a]">{v}</div>
                    <div className="text-xs text-[#3d4759] mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f0ece6" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">The Problem</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">AI agents are operating ungoverned. Enterprises have no gate.</h2>
              <p className="text-sm text-[#3d4759] leading-relaxed">Machine identities now outnumber humans 5.2:1 at most enterprises. AI agents call APIs, access sensitive data, execute workflows — autonomously, around the clock — with zero inline governance. Legacy IAM was built for quarterly reviews of human employees. That architecture cannot govern what's happening today.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-7" style={{ borderColor: "#fecaca", backgroundColor: "#fff5f5" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#fecaca" }}><AlertTriangle className="w-4 h-4" style={{ color: "#dc2626" }} /></div>
                  <div className="text-sm font-bold text-[#1d1d1f]">Crisis 1 — The Manual Review Tax</div>
                </div>
                <div className="space-y-3">
                  {[
                    ["120+ hrs/qtr", "Spreadsheet-based access reviews consume three full work weeks per quarter and produce no measurable security improvement."],
                    ["3–5 day delay", "Manual approval chains bottleneck new hire productivity. Managers guess permission needs — creating Privilege Creep from day one."],
                    ["241 days",      "Average breach lifecycle. Identity-based attacks stay hidden because no tool watches non-human identities."],
                  ].map(([stat, desc]) => (
                    <div key={stat} className="flex items-start gap-3">
                      <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: "#dc2626", minWidth: 72 }}>{stat}</span>
                      <p className="text-xs text-[#3d4759] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-7" style={{ borderColor: "#fde68a", backgroundColor: "#fffbeb" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#fde68a" }}><Shield className="w-4 h-4" style={{ color: "#d97706" }} /></div>
                  <div className="text-sm font-bold text-[#1d1d1f]">Crisis 2 — Ghost Access & Architectural Debt</div>
                </div>
                <div className="space-y-3">
                  {[
                    ["Orphaned IDs", "When employees leave, accounts remain active as persistent backdoors. Legacy tools discover this in quarterly reviews — months too late."],
                    ["Ghost bots",   "In pilot environments, 45+ ghost bots with full Admin access undiscovered by legacy IAM — unused for 90+ days, each a live attack vector."],
                    ["Toxic combos", "DevOps users holding Payroll access can both create and approve fraudulent payments — invisible to flat-list IAM tools."],
                  ].map(([stat, desc]) => (
                    <div key={stat} className="flex items-start gap-3">
                      <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: "#d97706", minWidth: 72 }}>{stat}</span>
                      <p className="text-xs text-[#3d4759] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Why Now</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">The agentic shift has made this problem urgent</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { stat: "5.2:1",   label: "NHI-to-human ratio in agent-heavy enterprises (2026)", color: "#0061d4" },
                { stat: "$30B+",   label: "Combined IGA + ITDR market opportunity",               color: "#00297a" },
                { stat: "$10.2M",  label: "Average U.S. enterprise data breach cost (2026)",       color: "#dc2626" },
                { stat: "$4.2M",   label: "Average savings per incident with AI-driven security",  color: "#059669" },
                { stat: "94%",     label: "Of CEOs identify AI as the #1 cybersecurity driver",   color: "#7c3aed" },
                { stat: "80 days", label: "Faster breach detection with autonomous governance",    color: "#0061d4" },
              ].map(s => (
                <div key={s.label} className="card p-5" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.stat}</div>
                  <p className="text-xs text-[#3d4759] leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">The Solution</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">The Identity Gate — Inline, Not a Sidecar</h2>
              <p className="text-sm text-[#3d4759] leading-relaxed">Unkov sits between every AI agent and everything it can touch. No agent acts without passing through the gate and receiving a verified identity token. Four phases enforce this continuously — as a standalone platform or as an overlay on Okta, SailPoint, or Azure AD. Zero rip-and-replace.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              {[
                { icon: Brain,     n: "01", color: "#0061d4", title: "Discover — Identity Graph",      desc: "Zero-touch scan across 20 connectors builds a live Neptune identity graph — every human, bot, AI agent, and service account mapped as nodes with typed edges. Live dashboard in under 30 minutes.", access: "Read-Only / Auditor" },
                { icon: Zap,       n: "02", color: "#10b981", title: "Analyze — Risk Engine",          desc: "Every identity scored continuously: risk = behavior×0.4 + permission×0.3 + graph×0.3. Real-time events from Okta webhooks, CloudTrail, and GitHub update scores as they happen. Claude agents explain every finding.", access: "Telemetry & Metadata Access" },
                { icon: Radio,     n: "03", color: "#f59e0b", title: "Enforce — AI Proxy + Gate",      desc: "AI Proxy routes all LLM calls (OpenAI, Anthropic, Azure) through Unkov — identity checked before every model invocation. Okta inline hook and AWS Lambda authorizer enforce at login and API layer.", access: "Restricted Write (scoped)" },
                { icon: BarChart3, n: "04", color: "#8b5cf6", title: "Monitor — Compliance Record",    desc: "Every gate decision, AI proxy call, and approved action logged immutably. One-click export for PCI DSS 4.0, HIPAA, and SOC 2. Continuous evidence collection — not a quarterly project.", access: "Continuous Auditor / Event Stream" },
              ].map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: p.color + "18" }}>
                        <Icon className="w-4 h-4" style={{ color: p.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold" style={{ color: p.color }}>{p.n}</span>
                          <span className="text-sm font-bold text-[#1d1d1f]">{p.title}</span>
                        </div>
                        <p className="text-xs text-[#3d4759] leading-relaxed mb-3">{p.desc}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: p.color + "15", color: p.color }}>Access: {p.access}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card p-6 max-w-2xl" style={{ borderColor: "#c2d4f8", backgroundColor: "#e8f0fe" }}>
              <div className="text-sm font-bold text-[#00297a] mb-2">Dual-Mode Architecture</div>
              <p className="text-sm text-[#3d4759] leading-relaxed">
                <strong>Mode A — Overlay:</strong> Sits on top of existing IAM (Okta, SailPoint, Azure AD). Ingests data, transforms to graph, pushes remediation back through existing pipes. Zero rip-and-replace friction.<br />
                <strong>Mode B — Standalone:</strong> Acts as the primary Identity OS for organizations managing high NHI-to-human ratios natively without legacy IAM infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* Traction */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Traction</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Validated in pilot environments</h2>
              <p className="text-sm text-[#3d4759]">Core Relationship Graph engine and Zero-Touch Observation Mode are functional and pilot-validated across financial services and healthcare environments.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { metric: "90%",    label: "Reduction in manual access review labor",      detail: "Quarterly reviews that took 120+ hours now complete in under 12." },
                { metric: "100%",   label: "Pilot customer retention rate",                detail: "Every customer that deployed Unkov in pilot renewed at end of term." },
                { metric: "< 30m",  label: "Time to first live Identity Drift dashboard",  detail: "Zero-touch deployment. No professional services required." },
              ].map(s => (
                <div key={s.label} style={{ borderTop: "3px solid #00297a", paddingTop: "1.25rem" }}>
                  <div className="text-2xl font-bold text-[#00297a] mb-1">{s.metric}</div>
                  <div className="text-sm font-semibold text-[#1d1d1f] mb-1">{s.label}</div>
                  <p className="text-xs text-[#3d4759]">{s.detail}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
              {[
                { name: "Tier-1 Fintech",        outcome: "90-day access review backlog cleared in under 24 hours. Zero manual IT hours. Passed SOC 2 Type II with zero access-related findings.", tags: ["PCI DSS 4.0", "SOC 2 Type II"] },
                { name: "Healthcare Enterprise", outcome: "HIPAA audit evidence generated continuously. Orphaned accounts auto-purged on employee departure. 3 previously unknown admin-level service accounts surfaced in week one.", tags: ["HIPAA", "SOC 2 Type II"] },
              ].map((c, i) => (
                <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-xs font-bold tracking-widest uppercase text-[#6b7280] mb-2">{c.name}</div>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed mb-3 font-medium">{c.outcome}</p>
                  <div className="flex gap-2 flex-wrap">
                    {c.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "#e8f0fe", color: "#00297a", border: "1px solid #c2d4f8" }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Structural Moats */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#ffffff" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-8">
              <span className="section-label">Competitive Moats</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Four unbreakable moats</h2>
              <p className="text-sm text-[#3d4759] leading-relaxed">The strongest moat in 2026 is not a feature — it is integration and data gravity. These four structural moats compound over time and are architecturally impossible for legacy vendors to replicate.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              {[
                {
                  num: "M1", color: "#00A8E8", bg: "#E8F4FD", border: "#00A8E8",
                  title: "Identity Gate",
                  sub: "Inline Enforcement Lock-In",
                  body: "Every AI agent must pass through Unkov's identity gate before it can act on anything — move money, access a patient record, call an API. Once embedded as the authorization layer, removing Unkov means the entire AI workforce stops operating. This is not a sidecar tool. It is the gate.",
                  quote: "\"They can't delete Unkov without shutting down their entire agentic operations.\""
                },
                {
                  num: "M2", color: "#00C896", bg: "#E8FDF5", border: "#00C896",
                  title: "Bot Reputation Network",
                  sub: "Cross-Sector Network Effect",
                  body: "Unkov builds an anonymous Bot Reputation Score across every customer. If an agent type acts toxically in a London Fintech firm, Unkov's Intent Engine automatically throttles that same agent type for a New York hospital — before it strikes.",
                  quote: "\"Our moat compounds with every customer. A startup with one can never compete with a network of thousands.\""
                },
                {
                  num: "M3", color: "#A855F7", bg: "#F5E8FD", border: "#A855F7",
                  title: "AI Proxy — LLM Control Moat",
                  sub: "Every AI Tool Call Gated",
                  body: "Unkov holds AI provider keys (OpenAI, Anthropic, Azure). Clients route all LLM calls through Unkov instead of the provider directly. Once embedded, clients cannot invoke AI models without Unkov in the path — every call logged with identity context, ungoverned agents blocked before they reach the model.",
                  quote: "\"We become the mandatory checkpoint between every AI agent and every AI model.\""
                },
                {
                  num: "M4", color: "#F59E0B", bg: "#FDF5E8", border: "#F59E0B",
                  title: "Compliance System of Record",
                  sub: "System-of-Record Lock-In",
                  body: "Unkov becomes the official System of Record for auditors. When the SEC or HHS asks for proof of AI governance, the customer hits Export from Unkov. CFOs never cancel the tool that made them pass their audit — this converts security spend into a protected compliance budget line.",
                  quote: "\"Compliance gravity is the strongest lock-in in enterprise SaaS.\""
                },
              ].map((m, i) => (
                <div key={i} className="card p-6" style={{ borderLeft: `4px solid ${m.border}`, borderTop: `1px solid ${m.border}`, borderRight: `1px solid ${m.border}`, borderBottom: `1px solid ${m.border}`, backgroundColor: "#ffffff" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>{m.num}</span>
                    <span className="text-sm font-bold text-[#1d1d1f]">{m.title}</span>
                    <span className="text-xs text-[#6b7280]">— {m.sub}</span>
                  </div>
                  <p className="text-sm text-[#3d4759] leading-relaxed mb-3">{m.body}</p>
                  <p className="text-xs italic" style={{ color: m.color }}>{m.quote}</p>
                </div>
              ))}
            </div>
            {/* Future roadmap — hardware identity */}
            <div className="card p-5 max-w-3xl mt-4" style={{ borderColor: "#c4b5fd", backgroundColor: "#faf5ff" }}>
              <div className="flex items-start gap-3">
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>🔮</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#7c3aed] uppercase tracking-wider">Future Roadmap — Hardware-Level Identity</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#ede9fe", color: "#7c3aed" }}>Year 2 · Post Series A</span>
                  </div>
                  <p className="text-xs text-[#374151] leading-relaxed">Unkov will root AI agent identity in the TPM or Secure Enclave of the host server — creating a cryptographic physical fingerprint for every agent that cannot be spoofed in software. Prevents Agent Cloning and Sleeper Agent attacks that every software-only tool misses. No named competitor has announced this capability. Requires platform infrastructure build-out planned for Year 2.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Advantage */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Competitive Landscape</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">How Unkov compares</h2>
              <p className="text-sm text-[#3d4759] leading-relaxed">Architectural consequences, not feature gaps. Replicating Unkov's graph-native foundation would require legacy vendors to rebuild their entire data layer from scratch — breaking integrations their thousands of customers depend on.</p>
            </div>
            <div className="card overflow-x-auto mb-8" style={{ borderColor: "#dcd6ce" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#f0ece6", borderBottom: "1px solid #dcd6ce" }}>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#3d4759]">Capability</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center text-[#00297a]">Unkov</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center text-[#6b7280]">Okta IGA / SailPoint</th>
                  </tr>
                </thead>
                <tbody>
                  {competitive.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < competitive.length - 1 ? "1px solid #f3f4f6" : "none", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafaf9" }}>
                      <td className="px-6 py-3.5 text-[#3d4759] font-medium text-sm">{row.cap}</td>
                      <td className="px-6 py-3.5 text-center font-bold text-sm" style={{ color: "#00297a" }}>{row.unkov}</td>
                      <td className="px-6 py-3.5 text-center text-sm text-[#6b7280]">{row.legacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Business Model</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Land-and-Expand pricing strategy</h2>
              <p className="text-sm text-[#3d4759] leading-relaxed">Hybrid pricing — base subscription plus usage-based tiers scaled by active Identity Nodes (humans + bots). A deliberate two-stage motion bypasses the typical 12-month enterprise sales cycle.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-3xl">
              <div className="card p-7" style={{ borderColor: "#c2d4f8", backgroundColor: "#e8f0fe" }}>
                <div className="text-xs font-bold text-[#00297a] uppercase tracking-widest mb-3">Land — Overlay Tier</div>
                <div className="text-2xl font-bold text-[#00297a] mb-1">$10K–$15K <span className="text-base font-normal text-[#3d4759]">ACV</span></div>
                <p className="text-sm text-[#3d4759] leading-relaxed mt-2">"Risk & Drift Dashboard" — rapid acquisition with a read-only overlay. Minimal procurement friction. Delivers immediate value (live Identity Drift dashboard) before any autonomous action is enabled.</p>
              </div>
              <div className="card p-7" style={{ borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" }}>
                <div className="text-xs font-bold text-[#059669] uppercase tracking-widest mb-3">Expand — Platform Tier</div>
                <div className="text-2xl font-bold text-[#059669] mb-1">$25K+ <span className="text-base font-normal text-[#3d4759]">ACV</span></div>
                <p className="text-sm text-[#3d4759] leading-relaxed mt-2">Full Autonomous Engine enabled. Customer upgrades after seeing live findings in their own environment. Natural expansion as Identity Node count grows with their business.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
              {[["82%", "Target gross margin"], ["$4.2M", "Avg. savings per incident"], ["3–5×", "Target ROI by Month 24"]].map(([v, l]) => (
                <div key={l} className="card p-5 text-center" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-2xl font-bold text-[#00297a] mb-1">{v}</div>
                  <div className="text-xs text-[#3d4759]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Funding Terms + Use of Funds */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <span className="section-label">Funding Terms</span>
                <h2 className="text-xl font-bold text-[#1d1d1f] mb-6">The Ask</h2>
                <div className="card overflow-hidden" style={{ borderColor: "#dcd6ce" }}>
                  {terms.map(([k, v], i) => (
                    <div key={i} className={`flex justify-between px-6 py-3.5 text-sm ${i < terms.length - 1 ? "border-b border-[#d8dde6]" : ""}`}>
                      <span className="text-[#3d4759]">{k}</span>
                      <span className="font-semibold text-[#1d1d1f]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="section-label">Use of Funds</span>
                <h2 className="text-xl font-bold text-[#1d1d1f] mb-6">24-Month Deployment</h2>
                <div className="space-y-4">
                  {funds.map((f, i) => (
                    <div key={i} className="card p-5" style={{ borderColor: "#dcd6ce" }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-[#1d1d1f]">{f.label}</span>
                        <span className="text-sm font-bold text-[#00297a]">{f.amount} <span className="text-[#3d4759] font-normal">({f.pct}%)</span></span>
                      </div>
                      <div className="h-1.5 bg-[#eef2f7] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#00297a] rounded-full" style={{ width: `${f.pct}%` }} />
                      </div>
                      <p className="text-xs text-[#3d4759]">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financials */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Financials</span>
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-2">5-Year Projections</h2>
              <p className="text-sm text-[#3d4759]">Conservative model: 5 customers Year 1 → 150 Year 5. ACV grows $20K → $40K as platform matures. Break-even at Year 4 with ~80 customers. 2026 accelerated ARR target: <strong className="text-[#00297a]">$615K</strong> (exceeding initial $500K goal).</p>
            </div>
            <div className="card overflow-x-auto" style={{ borderColor: "#dcd6ce" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d8dde6]">
                    <th className="text-left px-5 py-4 text-xs font-semibold text-[#3d4759] uppercase tracking-wider">Metric</th>
                    {projections.map(p => <th key={p.year} className="px-5 py-4 text-xs font-semibold text-[#3d4759] uppercase tracking-wider">{p.year}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Customers", key: "customers" as const },
                    { label: "Avg. ACV",  key: "acv"       as const },
                    { label: "Revenue",   key: "revenue"   as const },
                    { label: "EBIT",      key: "ebit"      as const },
                  ].map((row, ri) => (
                    <tr key={ri} className="border-b border-[#d8dde6] last:border-0">
                      <td className="px-5 py-3.5 text-[#3d4759] font-medium">{row.label}</td>
                      {projections.map((p, pi) => (
                        <td key={pi} className={`px-5 py-3.5 text-center font-mono ${row.key === "revenue" ? "text-[#00297a] font-bold" : row.key === "ebit" && !String(p[row.key]).startsWith("(") ? "text-[#059669] font-bold" : "text-[#3d4759]"}`}>
                          {String(p[row.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Milestones</span>
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-2">Seed Phase (Months 1–24)</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {milestones.map((m, i) => (
                <div key={i} className="card p-5" style={{ borderColor: i === milestones.length - 1 ? "#c2d4f8" : "#dcd6ce", backgroundColor: i === milestones.length - 1 ? "#e8f0fe" : "#ffffff" }}>
                  <div className="text-xs font-mono text-[#00297a] mb-2">{m.month}</div>
                  <div className="text-sm font-semibold text-[#1d1d1f] mb-1">{m.title}</div>
                  <p className="text-xs text-[#3d4759]">{m.desc}</p>
                </div>
              ))}
            </div>
            <h3 className="text-base font-bold text-[#1d1d1f] mb-4">Series A Gate Metrics</h3>
            <div className="flex flex-wrap gap-4">
              {seriesA.map((s, i) => (
                <div key={i} className="card px-5 py-4 flex items-center gap-3" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-lg font-bold text-[#00297a]">{s.value}</div>
                  <div className="text-xs text-[#3d4759]">{s.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Buyers */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Target Buyers</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f]">Who buys Unkov — and why</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {buyers.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-[#e8f0fe] rounded-lg shrink-0"><Icon className="w-4 h-4 text-[#00297a]" /></div>
                      <div>
                        <div className="text-sm font-bold text-[#1d1d1f] mb-1">{b.role}</div>
                        <div className="text-xs text-[#3d4759] mb-2">Pain: {b.pain}</div>
                        <div className="flex items-start gap-2 text-sm text-[#3d4759]">
                          <ArrowRight className="w-3.5 h-3.5 text-[#00297a] shrink-0 mt-0.5" />{b.hook}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GTM + Funnel */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-8">
              <span className="section-label">Go-to-Market</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">How customers find us</h2>
              <p className="text-sm text-[#3d4759]">Direct Sales + Channel Partner model, prioritising BFSI and Healthcare in Year 1. Mid-market accelerator: firms with 500–19,000 employees managing an average of 1,062 applications.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {gtm.map((g, i) => {
                const Icon = g.icon;
                return (
                  <div key={i} className="card p-7" style={{ borderColor: "#dcd6ce" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#e8f0fe] rounded-lg"><Icon className="w-4 h-4 text-[#00297a]" /></div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#00297a]">{g.badge}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#1d1d1f] mb-2">{g.title}</div>
                    <p className="text-sm text-[#3d4759] leading-relaxed">{g.desc}</p>
                  </div>
                );
              })}
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f] mb-6">Sales Funnel — Conversion Targets</h3>
            <div className="card max-w-3xl overflow-hidden" style={{ borderColor: "#dcd6ce" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d8dde6]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#3d4759] uppercase tracking-wider">Stage</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#3d4759] uppercase tracking-wider">Activity</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-[#3d4759] uppercase tracking-wider">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {funnel.map((row, i) => (
                    <tr key={i} className="border-b border-[#d8dde6] last:border-0">
                      <td className="px-6 py-4 font-semibold text-[#1d1d1f]">{row.stage}</td>
                      <td className="px-6 py-4 text-[#3d4759]">{row.activity}</td>
                      <td className="px-6 py-4 text-right font-mono text-[#00297a] font-semibold">{row.conversion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SWOT */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">SWOT Analysis</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Honest assessment</h2>
              <p className="text-sm text-[#3d4759]">94% of CEOs identify AI as the most significant driver of cybersecurity change in 2026. Unkov is positioned at the intersection of that shift.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {swot.map((s, i) => (
                <div key={i} className="card p-6" style={{ borderColor: s.border, backgroundColor: s.bg }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: s.color }}>{s.type}</div>
                  <div className="space-y-2">
                    {s.items.map((item, ii) => (
                      <div key={ii} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: s.color }} />
                        <p className="text-xs text-[#374151] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Responsible AI */}
        <section className="section border-b border-[#d8dde6]" style={{ backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Responsible AI & ESG</span>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3">Governance and sustainability built in</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { title: "Transparency & Explainability", body: "Every Peer-Clone provisioning decision includes a plain-language rationale. All automated actions are logged, traceable, and defensible in any SOC 2 or HIPAA audit. No black boxes." },
                { title: "Regulatory Alignment",          body: "Maps to EU AI Act High-Risk AI System transparency standards and Colorado AI Act (effective June 30, 2026) algorithmic accountability requirements. PCI DSS 4.0 Requirements 7 & 8 enforced continuously." },
                { title: "Privacy by Design",             body: "AWS-native architecture applies data minimization and anonymization by default. Sensitive PII is never used for broader model training. Monthly algorithmic audits detect and remove access prediction bias." },
                { title: "Green IT Impact",               body: "Ghost bot purge reduces digital carbon footprint by up to 88%. AWS hosting is 4.1× more energy-efficient than on-premises. AWS Customer Carbon Footprint Tool integration for Scope 1, 2, and 3 reporting. Pursuing ISO 42001:2023 and Green Mark certification." },
              ].map((r, i) => (
                <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-sm font-bold text-[#1d1d1f] mb-2">{r.title}</div>
                  <p className="text-sm text-[#3d4759] leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exit Strategy */}
        <section className="section border-b border-[#d8dde6]">
          <div className="container mx-auto px-10">
            <div className="max-w-xl mb-6">
              <span className="section-label">Exit Strategy</span>
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">Strategic acquisition pathway — 5–7 year horizon</h2>
              <p className="text-sm text-[#3d4759]">The identity security market has a strong M&A history. Unkov's graph-native architecture is a differentiated, acquirable asset with IPO optionality as a long-term path to becoming the standard governance OS for Global 2000 enterprises.</p>
            </div>
            <div className="space-y-4 max-w-2xl">
              {acquirers.map((a, i) => (
                <div key={i} className="card p-6" style={{ borderColor: "#dcd6ce" }}>
                  <div className="text-xs font-semibold text-[#00297a] mb-2">{a.tier}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {a.cos.map(c => <span key={c} className="text-xs px-2.5 py-1 rounded-md bg-[#eef2f7] text-[#3d4759]">{c}</span>)}
                  </div>
                  <p className="text-sm text-[#3d4759]">{a.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="resources"><InvestorResources /></div>

      </div>
      <Footer />
    </div>
  );
}
