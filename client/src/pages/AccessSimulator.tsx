import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Zap } from "lucide-react";

const IDENTITY_TYPES = ["Human Employee", "Bot / Service Account", "AI Agent", "Orphan Account", "New Hire"];
const RESOURCES = ["PII Database", "Finance API", "VPN Group A", "Source Code Repo", "HR System", "AI Training Cluster", "Cloud Admin Console", "Secrets Vault"];
const DEPARTMENTS = ["Engineering", "Finance", "HR", "Legal", "Sales", "IT Ops"];

type SimState = "idle" | "running" | "done";

interface SimResult {
  decision: "APPROVED" | "BLOCKED" | "ESCALATED";
  confidence: number;
  time_ms: number;
  reasons: string[];
  risk_delta: number;
}

function simulate(identityType: string, resource: string, dept: string, explanation: string): SimResult {
  const isOrphan = identityType === "Orphan Account";
  const isBot = identityType === "Bot / Service Account" || identityType === "AI Agent";
  const isNewHire = identityType === "New Hire";
  const isHighRisk = resource === "PII Database" || resource === "Secrets Vault" || resource === "Cloud Admin Console";
  const isSuspicious = explanation.toLowerCase().includes("urgent") || explanation.toLowerCase().includes("bypass");

  if (isOrphan) return {
    decision: "BLOCKED", confidence: 99,
    time_ms: Math.floor(Math.random() * 200 + 80),
    reasons: ["Identity flagged as orphan (>90d inactive)", "No legitimate business justification possible", "Auto-purge recommended"],
    risk_delta: 0,
  };

  if (isBot && isHighRisk) return {
    decision: "BLOCKED", confidence: 95,
    time_ms: Math.floor(Math.random() * 300 + 100),
    reasons: [`${identityType} scoped credentials insufficient for ${resource}`, "Privilege escalation attempt detected", "Peer-Clone: 0/47 similar bots have this access"],
    risk_delta: 0,
  };

  if (isSuspicious) return {
    decision: "ESCALATED", confidence: 78,
    time_ms: Math.floor(Math.random() * 400 + 150),
    reasons: ["Request justification contains anomaly signals", "Manager review triggered", "Access provisioned temporarily (48h) pending approval"],
    risk_delta: 8,
  };

  if (isNewHire && !isHighRisk) return {
    decision: "APPROVED", confidence: 94,
    time_ms: Math.floor(Math.random() * 500 + 200),
    reasons: [`Peer-Clone: 11/12 peers in ${dept} have this access`, "Standard onboarding entitlement confirmed", `Risk delta: +${Math.floor(Math.random() * 5 + 1)} (within threshold)`],
    risk_delta: Math.floor(Math.random() * 5 + 1),
  };

  const rand = Math.random();
  if (rand > 0.7) return {
    decision: "APPROVED", confidence: Math.floor(Math.random() * 15 + 82),
    time_ms: Math.floor(Math.random() * 600 + 300),
    reasons: [`${dept} role alignment confirmed`, `Historical access patterns match (${Math.floor(Math.random() * 20 + 5)} prior accesses)`, "Risk score within acceptable bounds"],
    risk_delta: Math.floor(Math.random() * 8 + 1),
  };

  return {
    decision: "ESCALATED", confidence: Math.floor(Math.random() * 20 + 65),
    time_ms: Math.floor(Math.random() * 500 + 200),
    reasons: ["Moderate confidence — human review recommended", `${resource} access is non-standard for ${dept}`, "Provisioned for 72h pending manager sign-off"],
    risk_delta: Math.floor(Math.random() * 15 + 5),
  };
}

const DECISION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: { bg: "#10b98115", text: "#10b981", border: "#10b98130" },
  BLOCKED: { bg: "#ef444415", text: "#ef4444", border: "#ef444430" },
  ESCALATED: { bg: "#f59e0b15", text: "#f59e0b", border: "#f59e0b30" },
};

const PRESETS = [
  { label: "New hire onboarding", identityType: "New Hire", resource: "Source Code Repo", dept: "Engineering", explanation: "Standard developer access needed for team repo" },
  { label: "Bot privilege escalation", identityType: "Bot / Service Account", resource: "PII Database", dept: "Engineering", explanation: "Need to run analytics job" },
  { label: "Orphan account access", identityType: "Orphan Account", resource: "Finance API", dept: "Finance", explanation: "Legacy process still running" },
  { label: "AI agent requesting secrets", identityType: "AI Agent", resource: "Secrets Vault", dept: "IT Ops", explanation: "Agent needs API keys for pipeline" },
];

export default function AccessSimulator() {
  const [identityType, setIdentityType] = useState(IDENTITY_TYPES[0]);
  const [resource, setResource] = useState(RESOURCES[0]);
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [explanation, setExplanation] = useState("");
  const [simState, setSimState] = useState<SimState>("idle");
  const [result, setResult] = useState<SimResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<Array<SimResult & { identityType: string; resource: string }>>([]);

  const runSim = () => {
    setSimState("running");
    setResult(null);
    setProgress(0);

    const steps = [10, 25, 45, 62, 78, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        const r = simulate(identityType, resource, dept, explanation);
        setResult(r);
        setSimState("done");
        setHistory(h => [{ ...r, identityType, resource }, ...h.slice(0, 9)]);
      }
    }, 200);
  };

  const reset = () => { setSimState("idle"); setResult(null); setProgress(0); };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setIdentityType(p.identityType);
    setResource(p.resource);
    setDept(p.dept);
    setExplanation(p.explanation);
    setSimState("idle");
    setResult(null);
  };

  const STEPS = [
    "Resolving identity context...",
    "Querying identity graph...",
    "Running Peer-Clone analysis...",
    "Evaluating risk delta...",
    "Checking policy references...",
    "Generating audit log...",
    "Decision rendered.",
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>Interactive Demo</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.25rem" }}>Access Request Simulator</h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Submit any access request and watch the Intent Engine decide in real-time. Fully explainable AI.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            {[{ label: "Decisions/day", value: "1,200+", color: "#60a5fa" }, { label: "Auto-resolved", value: "97%", color: "#10b981" }, { label: "Decision time", value: "340ms", color: "#f59e0b" }].map((m) => (
              <div key={m.label} style={{ padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 0 }}>
          {/* Left: form + result */}
          <div style={{ padding: "2rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            {/* Presets */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Quick Presets</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => applyPreset(p)}
                    style={{ padding: "0.375rem 0.875rem", borderRadius: 9999, fontSize: "0.9375rem", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(96,165,250,0.1)"; (e.currentTarget as HTMLElement).style.color = "#60a5fa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[
                { label: "Identity Type", val: identityType, set: setIdentityType, opts: IDENTITY_TYPES },
                { label: "Resource Requested", val: resource, set: setResource, opts: RESOURCES },
                { label: "Department", val: dept, set: setDept, opts: DEPARTMENTS },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>{f.label}</label>
                  <select value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: "0.85rem", outline: "none", cursor: "pointer" }}>
                    {f.opts.map(o => <option key={o} value={o} style={{ backgroundColor: "#1e2433" }}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.5rem" }}>Business Justification</label>
              <textarea value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Describe why this access is needed..." rows={3}
                style={{ width: "100%", padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: "0.85rem", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={runSim} disabled={simState === "running"}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", backgroundColor: simState === "running" ? "rgba(0,97,212,0.3)" : "#0061d4", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: simState === "running" ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                <Play style={{ width: 16, height: 16 }} />
                {simState === "running" ? "Processing..." : "Run Simulation"}
              </button>
              <button onClick={reset}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                <RotateCcw style={{ width: 14, height: 14 }} /> Reset
              </button>
            </div>

            {/* Progress */}
            {simState === "running" && (
              <div style={{ marginTop: "1.5rem", padding: "1.25rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                <div style={{ fontSize: "0.9375rem", color: "#60a5fa", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Zap style={{ width: 14, height: 14 }} />
                  {STEPS[Math.floor((progress / 100) * (STEPS.length - 1))]}
                </div>
                <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "#0061d4", borderRadius: 3, transition: "width 0.2s ease" }} />
                </div>
              </div>
            )}

            {/* Result */}
            {result && simState === "done" && (
              <div style={{ marginTop: "1.5rem", padding: "1.5rem", backgroundColor: DECISION_STYLES[result.decision].bg, border: `1px solid ${DECISION_STYLES[result.decision].border}`, borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>AI Decision</div>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: DECISION_STYLES[result.decision].text }}>{result.decision}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e2e8f0" }}>{result.confidence}%</div>
                    <div style={{ fontSize: "0.68rem", color: "#475569", textTransform: "uppercase" }}>Confidence</div>
                    <div style={{ fontSize: "0.9375rem", color: "#64748b", marginTop: "0.25rem" }}>{result.time_ms}ms decision time</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {result.reasons.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: DECISION_STYLES[result.decision].text, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{r}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History sidebar */}
          <div style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Simulation History</div>
            {history.length === 0 && (
              <div style={{ fontSize: "0.8rem", color: "#374151", fontStyle: "italic" }}>Run your first simulation →</div>
            )}
            {history.map((h, i) => {
              const s = DECISION_STYLES[h.decision];
              return (
                <div key={i} style={{ padding: "0.75rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{h.identityType}</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: s.text }}>{h.decision}</span>
                  </div>
                  <div style={{ fontSize: "0.9375rem", color: "#94a3b8" }}>→ {h.resource}</div>
                  <div style={{ fontSize: "0.68rem", color: "#475569", marginTop: "0.25rem" }}>{h.confidence}% confidence · {h.time_ms}ms</div>
                </div>
              );
            })}

            <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "rgba(0,97,212,0.05)", border: "1px solid rgba(0,97,212,0.15)", borderRadius: 10 }}>
              <div style={{ fontSize: "0.875rem", color: "#60a5fa", fontWeight: 700, marginBottom: "0.5rem" }}>💡 KEY INSIGHT</div>
              <div style={{ fontSize: "0.9375rem", color: "#64748b", lineHeight: 1.5 }}>Unkov processes 1,200+ access requests/day automatically. Only 3% require human review. Legacy tools require 100% manual review.</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
