import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BrainCircuit, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const DECISIONS = [
  {
    id: "D-4421",
    type: "access_grant",
    user: "sarah.chen@acme.com",
    resource: "Finance Analytics Dashboard",
    decision: "APPROVED",
    confidence: 97,
    timestamp: "2 min ago",
    reasoning: [
      { factor: "Peer-Clone Match", weight: 38, detail: "12 of 14 peers in Finance Analyst role have identical access. Behavior pattern 99.1% similar.", positive: true },
      { factor: "Historical Pattern", weight: 28, detail: "User accessed similar finance tools 47 times in last 90 days without incident.", positive: true },
      { factor: "Role Alignment", weight: 22, detail: "Resource is in standard entitlement set for 'Senior Finance Analyst' role definition.", positive: true },
      { factor: "Time & Location", weight: 8, detail: "Request during standard working hours from known corporate IP.", positive: true },
      { factor: "Risk Score Delta", weight: 4, detail: "Granting access increases identity risk score by only +2 points (23 → 25).", positive: true },
    ],
    policy_refs: ["SOC2-AC-01", "PCI-DSS-7.1", "Internal:RBAC-Finance-v3"],
    audit_trail: "Auto-approved via Intent Engine — no human review needed.",
  },
  {
    id: "D-4420",
    type: "access_deny",
    user: "bot:report-gen-v2",
    resource: "HR Employee Records (Full)",
    decision: "BLOCKED",
    confidence: 99,
    timestamp: "15 min ago",
    reasoning: [
      { factor: "Access Scope Violation", weight: 45, detail: "Bot is scoped to 'read:reports' — HR Employee Records requires 'read:pii'. This is a privilege escalation attempt.", positive: false },
      { factor: "Peer-Clone Anomaly", weight: 30, detail: "Zero peers (0/23 similar bots) have this access. Extreme outlier behavior detected.", positive: false },
      { factor: "Toxic Link Pattern", weight: 15, detail: "report-gen-v2 → HR Records creates a known lateral movement path to Finance API.", positive: false },
      { factor: "Ghost Access Marker", weight: 10, detail: "Bot last accessed any resource 62 days ago — dormancy + new escalation = high-risk signal.", positive: false },
    ],
    policy_refs: ["HIPAA-§164.514", "SOC2-AC-02", "Internal:NHI-Policy-v1"],
    audit_trail: "Hard-blocked by NHI Governance Engine. Incident ticket auto-created: INC-8847.",
  },
  {
    id: "D-4419",
    type: "remediation",
    user: "j.smith@acme.com (departed)",
    resource: "ALL (Orphan Purge)",
    decision: "AUTO-REMEDIATED",
    confidence: 100,
    timestamp: "1 hour ago",
    reasoning: [
      { factor: "Identity Drift Detected", weight: 50, detail: "Account inactive for 180 days. HR system shows departure date 6 months prior. Zero legitimate use case.", positive: false },
      { factor: "Active Session Risk", weight: 30, detail: "Despite inactivity, account credentials remain valid with VPN + Finance API access still provisioned.", positive: false },
      { factor: "Ransomware Vector Match", weight: 20, detail: "Access pattern matches 3 of top 5 ransomware entry vectors from MITRE ATT&CK: T1078.002.", positive: false },
    ],
    policy_refs: ["SOC2-AC-03", "Internal:Offboarding-SLA-24h", "NIST-SP800-53-AC-2"],
    audit_trail: "Orphan Kill-Switch executed. All 14 access tokens revoked. Manager notified. IGA audit log updated.",
  },
];

const DECISION_STYLES: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  APPROVED: { bg: "#10b98115", text: "#10b981", border: "#10b98130", icon: CheckCircle },
  BLOCKED: { bg: "#ef444415", text: "#ef4444", border: "#ef444430", icon: XCircle },
  "AUTO-REMEDIATED": { bg: "#f59e0b15", text: "#f59e0b", border: "#f59e0b30", icon: AlertCircle },
};

export default function AIExplainability() {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState<number[]>([]);
  const d = DECISIONS[selected];
  const ds = DECISION_STYLES[d.decision];
  const DIcon = ds.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>AI Transparency</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.25rem" }}>Decision Explainability Panel</h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Every AI decision is fully auditable — see exactly why Unkov approved, blocked, or remediated each event.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            {[{ label: "Auto-Approved", value: "1,243", color: "#10b981" }, { label: "Blocked", value: "47", color: "#ef4444" }, { label: "Remediated", value: "12", color: "#f59e0b" }].map((m) => (
              <div key={m.label} style={{ padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 220px)" }}>
          {/* Sidebar: decision list */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
            <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Recent AI Decisions</div>
            {DECISIONS.map((dec, i) => {
              const s = DECISION_STYLES[dec.decision];
              return (
                <button key={dec.id} onClick={() => setSelected(i)}
                  style={{ width: "100%", textAlign: "left", padding: "1rem", borderRadius: 10, border: `1px solid ${selected === i ? s.border : "rgba(255,255,255,0.06)"}`, backgroundColor: selected === i ? s.bg : "transparent", cursor: "pointer", marginBottom: "0.75rem", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontFamily: "monospace", color: "#64748b" }}>{dec.id}</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: s.text, backgroundColor: s.bg, border: `1px solid ${s.border}`, padding: "0.1rem 0.5rem", borderRadius: 9999 }}>{dec.decision}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dec.user}</div>
                  <div style={{ fontSize: "0.875rem", color: "#475569" }}>→ {dec.resource}</div>
                  <div style={{ fontSize: "0.68rem", color: "#374151", marginTop: "0.375rem" }}>{dec.timestamp}</div>
                </button>
              );
            })}

            {/* Stats */}
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
              <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Today's Decisions</div>
              {[["Auto-Approved", "1,243", "#10b981"], ["Blocked", "47", "#ef4444"], ["Remediated", "12", "#f59e0b"]].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9375rem", color: "#64748b" }}>{l}</span>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: c as string }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main panel */}
          <div style={{ padding: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ padding: "0.625rem", backgroundColor: ds.bg, border: `1px solid ${ds.border}`, borderRadius: 10 }}>
                    <DIcon style={{ width: 20, height: 20, color: ds.text }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f1f5f9" }}>Decision {d.id}</div>
                    <div style={{ fontSize: "0.9375rem", color: "#64748b" }}>{d.timestamp} · Confidence: <span style={{ color: ds.text, fontWeight: 700 }}>{d.confidence}%</span></div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div><div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Identity</div><div style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "monospace" }}>{d.user}</div></div>
                  <div><div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Resource</div><div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{d.resource}</div></div>
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "1.25rem 2rem", backgroundColor: ds.bg, border: `1px solid ${ds.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>Verdict</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: ds.text }}>{d.decision}</div>
              </div>
            </div>

            {/* Reasoning factors */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.9375rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BrainCircuit style={{ width: 14, height: 14 }} /> AI Reasoning Factors
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {d.reasoning.map((r, i) => (
                  <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
                    <button
                      onClick={() => setExpanded(e => e.includes(i) ? e.filter(x => x !== i) : [...e, i])}
                      style={{ width: "100%", padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.875rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: r.positive ? "#10b981" : "#ef4444", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0" }}>{r.factor}</span>
                          <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: r.positive ? "#10b981" : "#ef4444" }}>Weight: {r.weight}%</span>
                        </div>
                        {/* Weight bar */}
                        <div style={{ marginTop: "0.375rem", height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${r.weight}%`, backgroundColor: r.positive ? "#10b981" : "#ef4444", borderRadius: 2, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                      {expanded.includes(i) ? <ChevronDown style={{ width: 14, height: 14, color: "#475569" }} /> : <ChevronRight style={{ width: 14, height: 14, color: "#475569" }} />}
                    </button>
                    {expanded.includes(i) && (
                      <div style={{ padding: "0 1rem 0.875rem 2.75rem", fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.75rem" }}>
                        {r.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Policy refs + audit */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.25rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Policy References</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {d.policy_refs.map(p => (
                    <span key={p} style={{ padding: "0.25rem 0.625rem", backgroundColor: "#0061d415", border: "1px solid #0061d430", borderRadius: 6, fontSize: "0.875rem", color: "#60a5fa", fontFamily: "monospace" }}>{p}</span>
                  ))}
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "1.25rem" }}>
                <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Audit Trail</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{d.audit_trail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
