import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Shield, Activity, Zap, ExternalLink } from "lucide-react";

const THREAT_SOURCES = ["MITRE ATT&CK", "CISA KEV", "Unkov Sensor Net", "Dark Web Monitor", "CVE Database"];

function randomThreat(id: number) {
  const tactics = ["Initial Access", "Persistence", "Privilege Escalation", "Lateral Movement", "Credential Access", "Collection", "Exfiltration"];
  const techniques = ["T1078.002 – Valid Accounts: Domain Accounts", "T1110.001 – Brute Force: Password Guessing", "T1136.001 – Create Account: Local Account", "T1068 – Exploitation for Privilege Escalation", "T1003.006 – OS Credential Dumping: DCSync", "T1552.001 – Unsecured Credentials: Credentials In Files", "T1087.002 – Account Discovery: Domain Account"];
  const severities = ["critical", "high", "medium"] as const;
  const sources = THREAT_SOURCES;
  const actors = ["APT29 (Cozy Bear)", "Lazarus Group", "FIN7", "Unknown", "BlackCat Ransomware", "Scattered Spider"];
  const targets = ["Financial Services", "Healthcare", "SaaS Providers", "Government", "Mid-Market Enterprise"];

  const sev = severities[Math.floor(Math.random() * severities.length)];
  return {
    id: `TI-${String(10000 + id).slice(-4)}`,
    technique: techniques[Math.floor(Math.random() * techniques.length)],
    tactic: tactics[Math.floor(Math.random() * tactics.length)],
    severity: sev,
    source: sources[Math.floor(Math.random() * sources.length)],
    actor: actors[Math.floor(Math.random() * actors.length)],
    target: targets[Math.floor(Math.random() * targets.length)],
    affected: Math.floor(Math.random() * 200 + 10),
    unkov_blocked: Math.random() > 0.2,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
    cvss: (sev === "critical" ? 8.5 + Math.random() * 1.5 : sev === "high" ? 7 + Math.random() * 1.5 : 4 + Math.random() * 3).toFixed(1),
  };
}

const SEVERITIES = { critical: { color: "#ef4444", bg: "#ef444415", label: "Critical" }, high: { color: "#f97316", bg: "#f9731615", label: "High" }, medium: { color: "#f59e0b", bg: "#f59e0b15", label: "Medium" } };

function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ThreatFeed() {
  const [threats] = useState(() => Array.from({ length: 40 }, (_, i) => randomThreat(i + 1)));
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [live, setLive] = useState(true);
  const [ticker, setTicker] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (live) { intervalRef.current = setInterval(() => setTicker(t => t + 1), 3000); }
    return () => clearInterval(intervalRef.current);
  }, [live]);

  const filtered = threats.filter(t => {
    if (filter !== "all" && t.severity !== filter) return false;
    if (search && !t.technique.toLowerCase().includes(search.toLowerCase()) && !t.actor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const critCount = threats.filter(t => t.severity === "critical").length;
  const highCount = threats.filter(t => t.severity === "high").length;
  const blockedCount = threats.filter(t => t.unkov_blocked).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>Threat Intelligence</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9" }}>Identity Threat Feed</h1>
          </div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {[
              { val: critCount, label: "Critical", color: "#ef4444" },
              { val: highCount, label: "High", color: "#f97316" },
              { val: `${blockedCount}/${threats.length}`, label: "Blocked by Unkov", color: "#10b981" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
            <button onClick={() => setLive(l => !l)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: 9999, border: `1px solid ${live ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, backgroundColor: live ? "rgba(16,185,129,0.08)" : "transparent", color: live ? "#10b981" : "#64748b", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: live ? "#10b981" : "#475569", animation: live ? "pulse3 2s infinite" : "none" }} />
              {live ? "Live" : "Paused"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
          {["all", "critical", "high", "medium"].map(f => {
            const s = f === "all" ? { color: "#60a5fa", bg: "#60a5fa10" } : SEVERITIES[f as keyof typeof SEVERITIES];
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "0.35rem 0.875rem", borderRadius: 9999, fontSize: "0.9375rem", fontWeight: 600, border: `1px solid ${filter === f ? s.color + "40" : "rgba(255,255,255,0.08)"}`, backgroundColor: filter === f ? s.bg : "transparent", color: filter === f ? s.color : "#64748b", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
                {f === "all" ? "All Threats" : s.label}
              </button>
            );
          })}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search technique or actor..."
            style={{ marginLeft: "auto", padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#e2e8f0", fontSize: "0.82rem", outline: "none", width: 260 }} />
        </div>

        {/* Threat table */}
        <div style={{ padding: "1.5rem 2rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["ID", "Severity", "Technique / Tactic", "Threat Actor", "Target Sector", "Source", "CVSS", "Unkov Status", "Detected"].map(h => (
                  <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontSize: "0.8125rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const sev = SEVERITIES[t.severity as keyof typeof SEVERITIES];
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.9375rem", fontFamily: "monospace", color: "#64748b" }}>{t.id}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      <span style={{ padding: "0.2rem 0.625rem", borderRadius: 9999, fontSize: "0.8125rem", fontWeight: 700, backgroundColor: sev.bg, color: sev.color }}>{sev.label}</span>
                    </td>
                    <td style={{ padding: "0.75rem 0.875rem", maxWidth: 260 }}>
                      <div style={{ fontSize: "0.82rem", color: "#e2e8f0", marginBottom: "0.2rem" }}>{t.technique}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{t.tactic}</div>
                    </td>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.8rem", color: "#94a3b8", whiteSpace: "nowrap" }}>{t.actor}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.9375rem", color: "#64748b", whiteSpace: "nowrap" }}>{t.target}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.875rem", color: "#475569", whiteSpace: "nowrap" }}>{t.source}</td>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.82rem", fontWeight: 700, color: parseFloat(t.cvss) >= 8.5 ? "#ef4444" : parseFloat(t.cvss) >= 7 ? "#f97316" : "#f59e0b" }}>{t.cvss}</td>
                    <td style={{ padding: "0.75rem 0.875rem" }}>
                      {t.unkov_blocked ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#10b981" }}>
                          <Shield style={{ width: 12, height: 12 }} /> Auto-Blocked
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#f59e0b" }}>
                          <AlertTriangle style={{ width: 12, height: 12 }} /> Monitoring
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 0.875rem", fontSize: "0.875rem", color: "#475569", whiteSpace: "nowrap" }}>{timeAgo(t.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse3 { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
