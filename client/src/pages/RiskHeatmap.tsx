import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DEPARTMENTS = ["Engineering", "Finance", "HR", "Legal", "Sales", "IT Ops", "ML/AI", "DevOps"];
const RESOURCES = ["PII Database", "Finance API", "VPN Group A", "Source Repo", "HR System", "AI Training", "CRM", "Cloud Admin", "Secrets Vault", "Audit Logs"];

function generateHeatData() {
  return DEPARTMENTS.map(dept => ({
    dept,
    scores: RESOURCES.map(res => {
      // Make some combos always high risk
      const alwaysHigh = (dept === "ML/AI" && res === "PII Database") ||
        (dept === "HR" && res === "Secrets Vault") ||
        (dept === "Finance" && res === "Cloud Admin");
      const alwaysCritical = (dept === "IT Ops" && res === "PII Database") ||
        (dept === "DevOps" && res === "Finance API");
      const val = alwaysCritical ? 85 + Math.random() * 15 :
        alwaysHigh ? 60 + Math.random() * 25 :
        Math.random() * 60;
      return { res, val: Math.round(val), access_count: Math.floor(Math.random() * 200 + 10) };
    })
  }));
}

function riskColor(val: number): string {
  if (val >= 85) return "#ef4444";
  if (val >= 65) return "#f97316";
  if (val >= 45) return "#f59e0b";
  if (val >= 25) return "#84cc16";
  return "#10b981";
}

function riskLabel(val: number): string {
  if (val >= 85) return "CRITICAL";
  if (val >= 65) return "HIGH";
  if (val >= 45) return "MEDIUM";
  if (val >= 25) return "LOW";
  return "SAFE";
}

export default function RiskHeatmap() {
  const [data] = useState(() => generateHeatData());
  const [hoveredCell, setHoveredCell] = useState<{ dept: string; res: string; val: number; access_count: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState("all");

  const critical = data.flatMap(d => d.scores).filter(s => s.val >= 85).length;
  const high = data.flatMap(d => d.scores).filter(s => s.val >= 65 && s.val < 85).length;

  const filteredData = filter === "all" ? data : data.map(d => ({
    ...d,
    scores: d.scores.map(s => ({
      ...s,
      val: filter === "critical" && s.val < 85 ? 0 :
           filter === "high" && (s.val < 65 || s.val >= 85) ? 0 :
           s.val
    }))
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <div style={{ padding: "2rem 2rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>Risk Intelligence</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>Identity Risk Heatmap</h1>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Cross-department × resource access risk scores. Red = immediate remediation required.</p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {[
                { label: "Critical", val: critical, color: "#ef4444" },
                { label: "High Risk", val: high, color: "#f97316" },
                { label: "Dept × Resources", val: `${DEPARTMENTS.length}×${RESOURCES.length}`, color: "#60a5fa" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem 2rem" }}>
          {/* Filter */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {["all", "critical", "high"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "0.4rem 1rem", borderRadius: 9999, fontSize: "0.9375rem", fontWeight: 600, border: "1px solid", borderColor: filter === f ? "#60a5fa40" : "rgba(255,255,255,0.08)", backgroundColor: filter === f ? "#60a5fa10" : "transparent", color: filter === f ? "#60a5fa" : "#64748b", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
                {f === "all" ? "All Risks" : f === "critical" ? "Critical Only" : "High+"}
              </button>
            ))}
          </div>

          {/* Heatmap */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "auto", position: "relative" }}
            onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.875rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)", minWidth: 110 }}>Dept → Resource</th>
                  {RESOURCES.map(res => (
                    <th key={res} style={{ padding: "0.875rem 0.625rem", textAlign: "center", fontSize: "0.8125rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.05em", borderBottom: "1px solid rgba(255,255,255,0.06)", minWidth: 90 }}>
                      {res}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, ri) => (
                  <tr key={row.dept} style={{ borderBottom: ri < filteredData.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <td style={{ padding: "0.625rem 1rem", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.dept}</td>
                    {row.scores.map((cell, ci) => {
                      const c = riskColor(cell.val);
                      const dim = cell.val === 0 && filter !== "all";
                      return (
                        <td key={ci}
                          onMouseEnter={() => setHoveredCell({ dept: row.dept, res: cell.res, val: cell.val, access_count: cell.access_count })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{ padding: "0.375rem", textAlign: "center", cursor: "pointer", transition: "all 0.1s" }}>
                          <div style={{
                            width: "100%", height: 44, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: dim ? "rgba(255,255,255,0.02)" : `${c}${cell.val >= 65 ? "35" : "20"}`,
                            border: `1px solid ${dim ? "rgba(255,255,255,0.04)" : c + "40"}`,
                            transition: "all 0.15s",
                          }}>
                            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: dim ? "#1e2433" : c }}>
                              {dim ? "-" : cell.val}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Hover tooltip */}
            {hoveredCell && (
              <div style={{ position: "fixed", left: mousePos.x + 14, top: mousePos.y + 14, backgroundColor: "rgba(10,15,30,0.95)", border: `1px solid ${riskColor(hoveredCell.val)}40`, borderRadius: 10, padding: "0.875rem 1rem", zIndex: 9999, backdropFilter: "blur(10px)", minWidth: 200, pointerEvents: "none" }}>
                <div style={{ fontSize: "0.9375rem", color: "#94a3b8", marginBottom: "0.5rem" }}>{hoveredCell.dept} → {hoveredCell.res}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: riskColor(hoveredCell.val) }} />
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: riskColor(hoveredCell.val) }}>{hoveredCell.val}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: riskColor(hoveredCell.val), textTransform: "uppercase" }}>{riskLabel(hoveredCell.val)}</span>
                </div>
                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Monthly accesses: <span style={{ color: "#94a3b8" }}>{hoveredCell.access_count}</span></div>
                {hoveredCell.val >= 65 && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#fca5a5", backgroundColor: "#ef444415", borderRadius: 5, padding: "0.375rem 0.5rem" }}>
                    ⚠ Unkov recommends auto-remediation
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.25rem", alignItems: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Risk Scale:</div>
            {[
              { label: "Safe 0–24", color: "#10b981" },
              { label: "Low 25–44", color: "#84cc16" },
              { label: "Medium 45–64", color: "#f59e0b" },
              { label: "High 65–84", color: "#f97316" },
              { label: "Critical 85–100", color: "#ef4444" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: l.color + "40", border: `1px solid ${l.color}` }} />
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
