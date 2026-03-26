import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { GitBranch, Activity, Gauge, Shield, BrainCircuit, Bot, BookOpen, Building2, AlertTriangle, Zap, ChevronRight } from "lucide-react";

const DEMOS = [
  {
    href: "/identity-graph",
    icon: GitBranch,
    color: "#0061d4",
    glow: "#0061d415",
    badge: "LIVE",
    title: "Identity Graph",
    subtitle: "3D Social Fabric Visualization",
    desc: "Real-time canvas rendering of every human, bot, AI agent, and resource in your enterprise. Watch relationships form live.",
    stats: ["1,247 identities mapped", "5.2:1 NHI ratio", "Sub-3s discovery"],
  },
  {
    href: "/attack-paths",
    icon: Activity,
    color: "#ef4444",
    glow: "#ef444415",
    badge: "INTERACTIVE",
    title: "Attack Path Visualizer",
    subtitle: "Identity Threat Intelligence",
    desc: "See 3 real attack paths across your identity graph. Simulate blocking each one with a single click.",
    stats: ["Critical / High / Medium", "MITRE ATT&CK mapped", "1-click remediation"],
  },
  {
    href: "/dashboard",
    icon: Gauge,
    color: "#10b981",
    glow: "#10b98115",
    badge: "FULL SAAS",
    title: "SaaS Dashboard",
    subtitle: "Identity Command Center",
    desc: "Animated KPI cards, live event feed, risk trend charts, access queue — the complete product experience.",
    stats: ["Live event stream", "Risk trend charts", "Access queue"],
  },
  {
    href: "/risk-heatmap",
    icon: Shield,
    color: "#f59e0b",
    glow: "#f59e0b15",
    badge: "ANALYTICS",
    title: "Risk Heatmap",
    subtitle: "Department × Resource Matrix",
    desc: "8 departments × 10 resources cross-risk scoring. Hover any cell to see AI recommendation.",
    stats: ["80-cell matrix", "Drill-down tooltips", "Filter by severity"],
  },
  {
    href: "/ai-explainability",
    icon: BrainCircuit,
    color: "#8b5cf6",
    glow: "#8b5cf615",
    badge: "AI AUDIT",
    title: "AI Explainability",
    subtitle: "Decision Transparency Panel",
    desc: "See every approve/block/remediate decision with full weight breakdown, policy references, and audit trail.",
    stats: ["3 sample decisions", "Weighted factors", "Full audit trail"],
  },
  {
    href: "/access-simulator",
    icon: Bot,
    color: "#06b6d4",
    glow: "#06b6d415",
    badge: "SIMULATOR",
    title: "Access Simulator",
    subtitle: "Intent Engine in Action",
    desc: "Pick any identity type + resource + department and watch the AI decide in real-time. Try the preset scenarios.",
    stats: ["5 identity types", "8 resources", "Live reasoning"],
  },
  {
    href: "/governance-loop",
    icon: BookOpen,
    color: "#f97316",
    glow: "#f9731615",
    badge: "ANIMATION",
    title: "Governance Loop",
    subtitle: "Discover → Analyze → Remediate → Monitor",
    desc: "Animated visualization of Unkov's continuous governance cycle with live action log.",
    stats: ["4-phase animation", "Live action feed", "Phase metrics"],
  },
  {
    href: "/msp-console",
    icon: Building2,
    color: "#a78bfa",
    glow: "#a78bfa15",
    badge: "MULTI-TENANT",
    title: "MSP Console",
    subtitle: "Multi-Tenant Management",
    desc: "6 enterprise tenants, risk rankings, one-click actions. Built for MSSPs and enterprise channel partners.",
    stats: ["6 demo tenants", "Risk ranking", "Quick actions"],
  },
  {
    href: "/threat-feed",
    icon: AlertTriangle,
    color: "#ef4444",
    glow: "#ef444415",
    badge: "INTEL FEED",
    title: "Threat Feed",
    subtitle: "Identity Threat Intelligence",
    desc: "Live-simulated threat feed with 40+ MITRE ATT&CK techniques, actor attribution, and Unkov block status.",
    stats: ["40+ threats", "MITRE mapped", "Auto-block status"],
  },
  {
    href: "/integrations",
    icon: Zap,
    color: "#10b981",
    glow: "#10b98115",
    badge: "ENTERPRISE",
    title: "Integrations",
    subtitle: "Enterprise Stack Connectivity",
    desc: "30+ live integrations across IdP, Cloud, ITSM, HR, SIEM, and PAM. Zero rip-and-replace.",
    stats: ["30+ integrations", "REST/SCIM APIs", "< 30 min deploy"],
  },
];

export default function DemoHub() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ padding: "4rem 2rem 3rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
          {/* Background glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(0,97,212,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "1rem" }}>Interactive Product Experience</div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#f1f5f9", marginBottom: "1rem", lineHeight: 1.15 }}>
            The Unkov Demo Hub
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: 580, margin: "0 auto 2rem", lineHeight: 1.6 }}>
            A live cybersecurity product demo, investor pitch platform, and SaaS prototype — all in one. Every feature below is fully interactive.
          </p>

          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { val: "10", label: "Interactive Demos", color: "#60a5fa" },
              { val: "30+", label: "Enterprise Integrations", color: "#10b981" },
              { val: "Live", label: "All Data Simulated", color: "#f59e0b" },
              { val: "0", label: "Login Required", color: "#a78bfa" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center", padding: "0.75rem 1.5rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo grid */}
        <div style={{ padding: "3rem 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {DEMOS.map(demo => {
              const Icon = demo.icon;
              return (
                <button key={demo.href} onClick={() => navigate(demo.href)}
                  style={{ textAlign: "left", padding: "1.5rem", backgroundColor: demo.glow, border: `1px solid ${demo.color}20`, borderRadius: 14, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-2px)";
                    el.style.borderColor = demo.color + "50";
                    el.style.backgroundColor = demo.color + "20";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = demo.color + "20";
                    el.style.backgroundColor = demo.glow;
                  }}>
                  {/* Badge */}
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.6rem", fontWeight: 800, color: demo.color, backgroundColor: demo.color + "15", border: `1px solid ${demo.color}30`, padding: "0.15rem 0.5rem", borderRadius: 9999, letterSpacing: "0.1em" }}>
                    {demo.badge}
                  </div>

                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: demo.color + "20", border: `1px solid ${demo.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <Icon style={{ width: 20, height: 20, color: demo.color }} />
                  </div>

                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.2rem" }}>{demo.title}</div>
                  <div style={{ fontSize: "0.875rem", color: demo.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>{demo.subtitle}</div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.55, marginBottom: "1rem" }}>{demo.desc}</div>

                  {/* Stats */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1rem" }}>
                    {demo.stats.map(s => (
                      <span key={s} style={{ fontSize: "0.68rem", color: "#475569", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9999, padding: "0.2rem 0.625rem" }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", fontWeight: 600, color: demo.color }}>
                    Launch Demo <ChevronRight style={{ width: 14, height: 14 }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply for Pilot CTA */}
        <div style={{ margin: "0 2rem 3rem", padding: "2.5rem", backgroundColor: "rgba(0,41,122,0.15)", border: "1px solid rgba(0,97,212,0.2)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>Ready to go live?</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#f1f5f9", marginBottom: "0.5rem" }}>Want a personalized walkthrough?</div>
            <div style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Our team will tailor a 30-minute demo to your exact environment and use case.</div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
            <a href="/early-access"
              style={{ padding: "0.75rem 1.5rem", backgroundColor: "#0061d4", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              Apply for Pilot →
            </a>
            <a href="/contact"
              style={{ padding: "0.75rem 1.25rem", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
