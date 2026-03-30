import { useState, useRef, useEffect } from "react";
import {
  Menu, X, ChevronDown, ArrowRight,
  GitBranch, BrainCircuit, ShieldCheck, Activity, Gauge,
  Landmark, Stethoscope, Bot, Building2, BookOpen, FileText,
  Code2, Newspaper, Users, LogIn,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogoMark } from "./LogoMark";

const nav = [
  {
    label: "Features",
    wide: false,
    sections: [
      {
        heading: "The Identity Gate",
        headingDesc: "Inline enforcement between every identity and everything it can touch.",
        headingHref: "/features",
        items: [
          { icon: GitBranch,    label: "Identity Social Fabric",      desc: "Real-time graph of every human, bot, and AI agent",     href: "/features#identity-social-fabric",       tag: null      },
          { icon: BrainCircuit, label: "Intent Engine",               desc: "ML predicts access needs from peer-clone behavior",      href: "/features#intent-engine",               tag: null      },
          { icon: ShieldCheck,  label: "Autonomous Remediation",      desc: "Kill-switch, orphan purge, toxic link revocation",       href: "/features#autonomous-remediation-engine", tag: null    },
          { icon: Activity,     label: "Compliance System of Record", desc: "PCI DSS 4.0, HIPAA, SOC 2 — one-click audit export",    href: "/features#compliance",                  tag: "Q4 2026" },
        ],
        cta: { label: "All features", href: "/features" },
      },
    ],
  },
  {
    label: "Solutions",
    wide: false,
    sections: [
      {
        heading: "By Industry",
        items: [
          { icon: Landmark,    label: "Banking & Financial Services", desc: "Access governance for fintech and BFSI",  href: "/solutions/bfsi",      tag: null },
          { icon: Stethoscope, label: "Healthcare & Life Sciences",   desc: "HIPAA-automated audit trails",            href: "/solutions/healthcare", tag: null },
        ],
        cta: { label: "Explore all features", href: "/features" },
      },
    ],
  },
  {
    label: "Resources",
    wide: true,
    sections: [
      {
        heading: "Learn",
        items: [
          { icon: BookOpen,  label: "How It Works",  desc: "Discover → Analyze → Remediate → Monitor",       href: "/features", tag: null },
          { icon: Code2,     label: "Documentation", desc: "Connector guides — Okta, AWS IAM, Entra, GitHub", href: "/docs",     tag: null },
          { icon: FileText,  label: "Blog",          desc: "Identity governance thought leadership",           href: "/blog",     tag: null },
          { icon: Newspaper, label: "Press",         desc: "Coverage, press releases, brand assets",           href: "/press",    tag: null },
        ],
      },
      {
        heading: "Company",
        items: [
          { icon: Users,    label: "About Us",      desc: "Mission, values, and the team",                href: "/company",        tag: null   },
          { icon: Gauge,    label: "For Investors", desc: "Pitch deck, data room, roadmap",               href: "/investor-gate",  tag: null   },
          { icon: Activity, label: "Live Demo",     desc: "Pilot-mode dashboard — real data format",      href: "/login",          tag: "Demo" },
        ],
        cta: { label: "Apply for pilot", href: "/early-access" },
      },
    ],
  },
];

const NAV_H = 72;

export default function Header() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, navigate] = useLocation();
  const { user, dashboardPath } = useAuth();

  const go = (href: string) => {
    setMobileOpen(false); setMobileGroup(null); setActiveGroup(null);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (href.startsWith("http")) window.open(href, "_blank");
    else if (href.includes("#")) { window.location.href = href; }
    else navigate(href);
  };

  const openGroup  = (label: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveGroup(label); };
  const startClose = () => { closeTimer.current = setTimeout(() => setActiveGroup(null), 200); };
  const keepOpen   = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("header") && !t.closest("[data-dropdown]")) setActiveGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => { document.removeEventListener("mousedown", handler); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const activeNav = nav.find(g => g.label === activeGroup);

  return (
    <>
      {/* ── Bar ─────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: NAV_H,
        backgroundColor: "rgba(250,249,247,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

          {/* Logo */}
          <button onClick={() => go("/")} style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <LogoMark size={50} />
            <span style={{ fontWeight: 700, fontSize: "1.5rem", color: "#0a0f1e", letterSpacing: "-0.025em" }}>
              <span style={{ color: "#00c6e0" }}>U</span>nkov
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.125rem", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {nav.map(group => (
              <div key={group.label} style={{ position: "relative" }}
                onMouseEnter={() => openGroup(group.label)} onMouseLeave={startClose}>
                <button
                  onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.4rem 0.75rem",
                    fontSize: "0.875rem", fontWeight: activeGroup === group.label ? 600 : 450,
                    color: activeGroup === group.label ? "#00297a" : "#3d3d52",
                    backgroundColor: activeGroup === group.label ? "#eeeae4" : "transparent",
                    borderRadius: "0.5rem", border: "none", cursor: "pointer",
                    whiteSpace: "nowrap", transition: "color 0.12s, background-color 0.12s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#00297a"; el.style.backgroundColor = "#eeeae4"; el.style.fontWeight = "600"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = activeGroup === group.label ? "#00297a" : "#3d3d52"; el.style.backgroundColor = activeGroup === group.label ? "#eeeae4" : "transparent"; el.style.fontWeight = activeGroup === group.label ? "600" : "450"; }}
                >
                  {group.label}
                  <ChevronDown style={{ width: 10, height: 10, color: activeGroup === group.label ? "#00297a" : "#a0aab4", flexShrink: 0, transition: "transform 0.15s", transform: activeGroup === group.label ? "rotate(180deg)" : "rotate(0)" }} />
                </button>
              </div>
            ))}

            {/* Separator */}
            <div style={{ width: 1, height: 14, backgroundColor: "#d8d3cc", margin: "0 0.5rem", flexShrink: 0 }} />

            {/* Direct links */}
            {[{ label: "Pricing", href: "/pricing" }, { label: "Integrations", href: "/integrations" }].map(link => (
              <button key={link.label} onClick={() => go(link.href)}
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.8125rem", fontWeight: 450, color: "#3d3d52", backgroundColor: "transparent", borderRadius: "0.5rem", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.12s, background-color 0.12s", letterSpacing: "-0.01em" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#00297a"; el.style.backgroundColor = "#eeeae4"; el.style.fontWeight = "600"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#3d3d52"; el.style.backgroundColor = "transparent"; el.style.fontWeight = "450"; }}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
            {!user && (
              <button onClick={() => go("/login")}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.875rem", fontWeight: 500, color: "#6b7280", backgroundColor: "transparent", padding: "0.35rem 0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.12s, background-color 0.12s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#0a0f1e"; el.style.backgroundColor = "#eeeae4"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#6b7280"; el.style.backgroundColor = "transparent"; }}>
                <LogIn style={{ width: 12, height: 12 }} />
                Log in
              </button>
            )}
            {(!user || user.role === "pilot_customer") && (
              <button onClick={() => go("/demo/dashboard")}
                style={{ fontSize: "0.875rem", fontWeight: 500, color: "#0061d4", padding: "0.4rem 1rem", borderRadius: "9999px", border: "1px solid #c0d7f5", backgroundColor: "transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "background-color 0.12s, border-color 0.12s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#e8f0fe"; el.style.borderColor = "#93c2f0"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.borderColor = "#c0d7f5"; }}>
                Live demo
              </button>
            )}
            <button onClick={() => go("/early-access")}
              style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff", padding: "0.5rem 1.125rem", borderRadius: "9999px", border: "none", backgroundColor: "#00297a", cursor: "pointer", whiteSpace: "nowrap", transition: "background-color 0.12s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#001f5c"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#00297a"; }}>
              Apply for pilot
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ padding: "0.5rem", borderRadius: "0.5rem", color: "#3d3d52", border: "none", backgroundColor: "transparent", cursor: "pointer", flexShrink: 0 }}>
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </header>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      {activeGroup && activeNav && (
        <div data-dropdown className="hidden md:block"
          onMouseEnter={keepOpen} onMouseLeave={startClose}
          style={{ position: "fixed", top: NAV_H, left: 0, right: 0, zIndex: 999, backgroundColor: "#faf9f7", borderBottom: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 24px 64px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", animation: "slideDown 0.14s ease forwards" }}>
          <div className="container" style={{ padding: "2rem 2rem 2.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: activeNav.wide ? "1fr 1fr" : "1fr", gap: activeNav.wide ? "5rem" : "0", maxWidth: activeNav.wide ? "600px" : "280px" }}>
              {activeNav.sections.map((section, si) => (
                <div key={si}>
                  {"headingHref" in section && (section as any).headingHref ? (
                    <button onClick={() => go((section as any).headingHref)}
                      style={{ width: "100%", textAlign: "left", border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "0 0 1rem 0", transition: "opacity 0.12s" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0a0f1e", letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>{section.heading}</div>
                      <div style={{ fontSize: "0.7rem", color: "#a0aab4", lineHeight: 1.5 }}>{(section as any).headingDesc}</div>
                    </button>
                  ) : (
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0c8d0", marginBottom: "1rem" }}>
                      {section.heading}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {section.items.map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.label} onClick={() => go(item.href)}
                          style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.625rem 0.75rem", borderRadius: "0.625rem", textAlign: "left", border: "none", backgroundColor: "transparent", cursor: "pointer", width: "100%", transition: "background-color 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ede9e3")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                          <div style={{ width: 30, height: 30, borderRadius: "0.5rem", backgroundColor: "#eef3fd", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon style={{ width: 13, height: 13, color: "#0061d4" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.1875rem" }}>
                              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111827", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{item.label}</span>
                              {item.tag && (
                                <span style={{ fontSize: "0.55rem", fontWeight: 700, padding: "0.1rem 0.375rem", borderRadius: "9999px", backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", textTransform: "uppercase", flexShrink: 0 }}>{item.tag}</span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#8896a5", lineHeight: 1.45, letterSpacing: "-0.005em" }}>{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {"cta" in section && section.cta && (
                    <button onClick={() => go(section.cta!.href)}
                      style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 600, color: "#0061d4", border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", transition: "all 0.1s" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "#ede9e3"; el.style.color = "#00297a"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = "#0061d4"; }}>
                      {section.cta.label} <ArrowRight style={{ width: 10, height: 10 }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      {mobileOpen && (
        <div style={{ position: "fixed", top: NAV_H, left: 0, right: 0, bottom: 0, backgroundColor: "#faf9f7", zIndex: 998, overflowY: "auto", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "0.25rem 1.5rem 3rem" }}>
            {nav.map(group => (
              <div key={group.label} style={{ borderBottom: "1px solid #ece8e2" }}>
                <button onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 0", fontSize: "0.9375rem", fontWeight: 600, color: "#0a0f1e", border: "none", backgroundColor: "transparent", cursor: "pointer", letterSpacing: "-0.015em" }}>
                  {group.label}
                  <ChevronDown style={{ width: 15, height: 15, color: "#a0aab4", transform: mobileGroup === group.label ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", flexShrink: 0 }} />
                </button>
                {mobileGroup === group.label && (
                  <div style={{ paddingBottom: "1rem" }}>
                    {group.sections.flatMap(s => s.items).map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.label} onClick={() => go(item.href)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.625rem 0.375rem", borderRadius: "0.75rem", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ width: 34, height: 34, borderRadius: "0.625rem", backgroundColor: "#eef3fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon style={{ width: 15, height: 15, color: "#0061d4" }} />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#0a0f1e", letterSpacing: "-0.015em" }}>{item.label}</div>
                            <div style={{ fontSize: "0.775rem", color: "#6b7280", marginTop: "0.125rem", lineHeight: 1.4 }}>{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                    {group.sections.find(s => "cta" in s && s.cta) && (
                      <button onClick={() => go(group.sections.find(s => "cta" in s && s.cta)!.cta!.href)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.375rem", fontSize: "0.8375rem", fontWeight: 600, color: "#0061d4", border: "none", backgroundColor: "transparent", cursor: "pointer", marginTop: "0.25rem" }}>
                        {group.sections.find(s => "cta" in s && s.cta)!.cta!.label} <ArrowRight style={{ width: 12, height: 12 }} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {[{ label: "Pricing", href: "/pricing" }, { label: "Integrations", href: "/integrations" }].map(link => (
              <div key={link.label} style={{ borderBottom: "1px solid #ece8e2" }}>
                <button onClick={() => go(link.href)} style={{ width: "100%", textAlign: "left", padding: "0.875rem 0", fontSize: "0.9375rem", fontWeight: 600, color: "#0a0f1e", border: "none", backgroundColor: "transparent", cursor: "pointer", letterSpacing: "-0.015em" }}>
                  {link.label}
                </button>
              </div>
            ))}
            <div style={{ paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {(!user || user.role === "pilot_customer") && (<button onClick={() => go("/demo/dashboard")} style={{ width: "100%", textAlign: "center", fontSize: "0.9375rem", fontWeight: 500, color: "#0061d4", border: "1px solid #c0d7f5", backgroundColor: "transparent", cursor: "pointer", padding: "0.75rem", borderRadius: "9999px" }}>Live demo</button>)}
              <button onClick={() => go(user ? (user.role === "admin" ? "/admin/upgrade" : dashboardPath) : "/login")} style={{ width: "100%", textAlign: "center", fontSize: "0.9375rem", fontWeight: 500, color: "#4a4a5e", border: "1px solid #d8d3cc", backgroundColor: "transparent", cursor: "pointer", padding: "0.75rem", borderRadius: "9999px" }}>{user ? (user.role === "admin" ? "Admin console" : user.role === "paying_customer" ? "Dashboard" : "") : "Log in"}</button>
              <button onClick={() => go("/early-access")} style={{ width: "100%", textAlign: "center", fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff", border: "none", backgroundColor: "#00297a", cursor: "pointer", padding: "0.75rem", borderRadius: "9999px" }}>Apply for pilot</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
