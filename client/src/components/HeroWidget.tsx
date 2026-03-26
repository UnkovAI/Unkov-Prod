/**
 * HeroWidget — live platform sidebar cards shown in page hero sections.
 * Each variant is tuned to the page context so the top-right never feels empty.
 */

import { useEffect, useState } from "react";

/* ─── shared primitives ─────────────────────────────────── */
const Pill = ({ color, label }: { color: string; label: string }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.2rem 0.625rem", borderRadius: 9999, fontSize: "0.875rem",
    fontWeight: 700, letterSpacing: "0.04em",
    backgroundColor: color + "18", color, border: `1px solid ${color}35`,
  }}>{label}</span>
);

const LiveDot = ({ color = "#10b981" }: { color?: string }) => (
  <span style={{
    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
    backgroundColor: color, flexShrink: 0,
    boxShadow: `0 0 0 3px ${color}30`,
    animation: "hw-pulse 2s infinite",
  }} />
);

const MiniBar = ({ pct, color }: { pct: number; color: string }) => (
  <div style={{ height: 5, borderRadius: 3, backgroundColor: "#e2e8f0", overflow: "hidden", flex: 1 }}>
    <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 3, transition: "width 1.2s ease" }} />
  </div>
);

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #dcd6ce",
  borderRadius: 14,
  padding: "1.25rem 1.375rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
};

/* ─── Features page widget ──────────────────────────────── */
export function FeaturesHeroWidget() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 2400); return () => clearInterval(id); }, []);
  const events = [
    { label: "Orphan purged", sub: "ghost-acct-0042", color: "#10b981", t: 0 },
    { label: "Bot re-scoped", sub: "report-gen-v2 → read-only", color: "#0061d4", t: 1 },
    { label: "New hire onboarded", sub: "Peer-Clone: 11/12 match", color: "#0061d4", t: 2 },
    { label: "Toxic link revoked", sub: "etl-runner → pii-db", color: "#f59e0b", t: 3 },
    { label: "Kill-Switch triggered", sub: "data-proc-07 anomaly", color: "#ef4444", t: 4 },
  ];
  const visible = [0, 1, 2, 3].map(i => events[(tick + i) % events.length]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={CARD_STYLE}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568" }}>Live Governance Actions</span>
          <LiveDot />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {visible.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", borderRadius: 8, backgroundColor: i === 0 ? e.color + "0c" : "transparent", transition: "background-color 0.4s" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: e.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
                <div style={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: "monospace" }}>{e.sub}</div>
              </div>
              {i === 0 && <Pill color={e.color} label="LIVE" />}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
        {[
          { label: "Decisions automated", value: "97%", color: "#0061d4" },
          { label: "Avg decision time", value: "340ms", color: "#10b981" },
          { label: "Identities governed", value: "318", color: "#00297a" },
          { label: "Human reviews needed", value: "3%", color: "#f59e0b" },
        ].map((m, i) => (
          <div key={i} style={{ ...CARD_STYLE, padding: "0.875rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
            <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: "0.2rem" }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── How It Works widget ───────────────────────────────── */
export function HowItWorksHeroWidget() {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => { const id = setInterval(() => setActiveStep(s => (s + 1) % 4), 2000); return () => clearInterval(id); }, []);
  const steps = [
    { label: "Discover",   color: "#0061d4", desc: "< 30 min to live dashboard", pct: 100 },
    { label: "Analyze",    color: "#10b981", desc: "97% decisions automated", pct: 97 },
    { label: "Remediate",  color: "#f59e0b", desc: "90% manual labor eliminated", pct: 90 },
    { label: "Monitor",    color: "#8b5cf6", desc: "80-day faster breach detection", pct: 80 },
  ];
  return (
    <div style={CARD_STYLE}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568" }}>Governance Loop</span>
        <LiveDot color="#0061d4" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: i === activeStep ? s.color : s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background-color 0.4s" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, color: i === activeStep ? "#fff" : s.color }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: i === activeStep ? "#1a1a2e" : "#6b7280" }}>{s.label}</span>
                <span style={{ fontSize: "0.68rem", color: s.color, fontWeight: 600 }}>{s.desc}</span>
              </div>
              <MiniBar pct={i <= activeStep ? s.pct : 0} color={s.color} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem", padding: "0.625rem 0.875rem", borderRadius: 8, backgroundColor: "#e8f0fe", border: "1px solid #c2d4f8" }}>
        <div style={{ fontSize: "0.875rem", color: "#00297a", fontWeight: 600 }}>Zero professional services required. Live in 30 minutes.</div>
      </div>
    </div>
  );
}

/* ─── Pricing page widget ───────────────────────────────── */
export function PricingHeroWidget() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={CARD_STYLE}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568", marginBottom: "0.875rem" }}>ROI Calculator — Mid-Market</div>
        {[
          { label: "Quarterly review hours saved", before: "120 hrs", after: "< 12 hrs", color: "#10b981" },
          { label: "Manual access reviews eliminated", before: "100%", after: "97%", color: "#0061d4" },
          { label: "Breach cost exposure reduction", before: "$10.22M", after: "↓ 80%", color: "#f59e0b" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", borderBottom: i < 2 ? "1px solid #f0ece6" : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", color: "#4a5568", marginBottom: "0.2rem" }}>{r.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.9375rem", color: "#6b7280", textDecoration: "line-through" }}>{r.before}</span>
                <span style={{ fontSize: "0.02rem", color: "#d1d5db" }}>→</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: r.color }}>{r.after}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...CARD_STYLE, backgroundColor: "#e8f0fe", border: "1px solid #c2d4f8" }}>
        <div style={{ fontSize: "0.875rem", color: "#00297a", fontWeight: 700, marginBottom: "0.375rem" }}>Pilot → Day 1</div>
        <div style={{ fontSize: "0.9375rem", color: "#3d4759", lineHeight: 1.5 }}>Live Identity Drift dashboard in under 30 minutes. No credit card. No professional services.</div>
      </div>
    </div>
  );
}

/* ─── Company page widget ───────────────────────────────── */
export function CompanyHeroWidget() {
  const stats = [
    { value: "$30B+", label: "Combined TAM (IGA + ITDR)", color: "#00297a" },
    { value: "100:1", label: "NHI-to-human ratio", color: "#0061d4" },
    { value: "$10.22M", label: "Avg U.S. breach cost", color: "#ef4444" },
    { value: "90%", label: "Manual review reduction", color: "#10b981" },
  ];
  return (
    <div style={CARD_STYLE}>
      <div style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568", marginBottom: "1rem" }}>Market Context</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.875rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: "0.875rem", borderRadius: 10, backgroundColor: "#f6f8fa", border: "1px solid #e8e4de" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, letterSpacing: "-0.025em" }}>{s.value}</div>
            <div style={{ fontSize: "0.68rem", color: "#6b7280", marginTop: "0.2rem", lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.875rem", borderRadius: 8, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <LiveDot color="#10b981" />
        <span style={{ fontSize: "0.875rem", color: "#15803d", fontWeight: 600 }}>100% pilot retention · Live in production</span>
      </div>
    </div>
  );
}

/* ─── Blog page widget ──────────────────────────────────── */
export function BlogHeroWidget() {
  const tags = ["Thought Leadership", "Case Study", "Compliance", "Education"];
  const counts = [2, 1, 1, 1];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={CARD_STYLE}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568", marginBottom: "0.875rem" }}>Topics</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {tags.map((tag, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <MiniBar pct={(counts[i] / 2) * 100} color="#0061d4" />
              <span style={{ fontSize: "0.9375rem", color: "#3d4759", whiteSpace: "nowrap", minWidth: 100 }}>{tag}</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#00297a", minWidth: 20, textAlign: "right" }}>{counts[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...CARD_STYLE, backgroundColor: "#e8f0fe", border: "1px solid #c2d4f8", padding: "1rem 1.125rem" }}>
        <div style={{ fontSize: "0.875rem", color: "#00297a", fontWeight: 700, marginBottom: "0.25rem" }}>Latest post</div>
        <div style={{ fontSize: "0.8rem", color: "#1a1a2e", fontWeight: 600, lineHeight: 1.4 }}>The 100:1 Problem: Why AI Agents Are Breaking Identity Governance</div>
        <div style={{ fontSize: "0.68rem", color: "#4a5568", marginTop: "0.375rem" }}>March 10, 2026 · 6 min read</div>
      </div>
    </div>
  );
}

/* ─── Press page widget ─────────────────────────────────── */
export function PressHeroWidget() {
  const outlets = ["TechCrunch", "Dark Reading", "SC Media", "Help Net Security"];
  return (
    <div style={CARD_STYLE}>
      <div style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568", marginBottom: "0.875rem" }}>Featured In</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {outlets.map((o, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.625rem", borderRadius: 8, backgroundColor: "#f6f8fa", border: "1px solid #e8e4de" }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: "#00297a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "#fff" }}>{o.slice(0, 2).toUpperCase()}</span>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a1a2e" }}>{o}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "0.875rem", padding: "0.625rem 0.875rem", borderRadius: 8, backgroundColor: "#f0ece6", border: "1px solid #dcd6ce" }}>
        <div style={{ fontSize: "0.875rem", color: "#3d4759" }}>For press inquiries: <a href="mailto:press@unkov.com" style={{ color: "#0061d4", fontWeight: 600 }}>press@unkov.com</a></div>
      </div>
    </div>
  );
}

/* ─── Careers page widget ───────────────────────────────── */
export function CareersHeroWidget() {
  const roles = [
    { title: "CEO", tag: "Leadership", color: "#00297a" },
    { title: "CTO", tag: "Engineering", color: "#0061d4" },
    { title: "CRO", tag: "Sales", color: "#10b981" },
    { title: "Head of Product", tag: "Product", color: "#f59e0b" },
  ];
  return (
    <div style={CARD_STYLE}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568" }}>Open Positions</span>
        <Pill color="#10b981" label="4 OPEN" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {roles.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.625rem", borderRadius: 8, backgroundColor: "#f6f8fa", border: "1px solid #e8e4de" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1a2e" }}>{r.title}</span>
            <Pill color={r.color} label={r.tag} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "0.875rem", fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.5 }}>Co-founder equity available for the right founding team members.</div>
    </div>
  );
}

/* ─── Roadmap page widget ───────────────────────────────── */
export function RoadmapHeroWidget() {
  const milestones = [
    { label: "$100K ARR", done: true, date: "Q1 2026" },
    { label: "10 paying customers", done: false, date: "Q2 2026" },
    { label: "AWS Marketplace live", done: false, date: "Q3 2026" },
    { label: "Series A milestone", done: false, date: "Q1 2027" },
    { label: "Series A ready", done: false, date: "Q2 2027" },
  ];
  const pct = Math.round((milestones.filter(m => m.done).length / milestones.length) * 100);
  return (
    <div style={CARD_STYLE}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a5568" }}>Seed Phase Progress</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#00297a" }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, backgroundColor: "#e2e8f0", marginBottom: "1rem", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#00297a,#0061d4)", borderRadius: 3 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {milestones.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: m.done ? "#10b981" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {m.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
            </div>
            <span style={{ flex: 1, fontSize: "0.9375rem", color: m.done ? "#1a1a2e" : "#6b7280", fontWeight: m.done ? 600 : 400 }}>{m.label}</span>
            <span style={{ fontSize: "0.68rem", color: "#6b7280" }}>{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CSS ───────────────────────────────────────────────── */
export function HeroWidgetStyles() {
  return (
    <style>{`
      @keyframes hw-pulse {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 3px currentColor22; }
        50%       { opacity: 0.65; box-shadow: 0 0 0 6px currentColor00; }
      }
    `}</style>
  );
}
