import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PHASES = [
  {
    id: "discover",
    label: "DISCOVER",
    color: "#0061d4",
    glow: "#0061d430",
    angle: 0,
    title: "Identity Discovery",
    desc: "Maps every human, bot, AI agent, and resource in real-time via our graph engine. Detects new identities within seconds.",
    metrics: [
      { label: "Identities mapped", val: "1,247" },
      { label: "Discovery latency", val: "< 3s" },
      { label: "NHI:Human ratio", val: "5.2:1" },
    ],
    actions: ["New employee detected", "Bot spawned by CI/CD", "AI agent registered", "Legacy orphan flagged"],
  },
  {
    id: "analyze",
    label: "ANALYZE",
    color: "#10b981",
    glow: "#10b98130",
    angle: 90,
    title: "Intent Engine Analysis",
    desc: "Peer-Clone ML predicts exact access needs. 97%+ of decisions are fully automated with explainable reasoning.",
    metrics: [
      { label: "Decisions automated", val: "98%" },
      { label: "Avg decision time", val: "340ms" },
      { label: "Peer-clone accuracy", val: "99.1%" },
    ],
    actions: ["Peer-clone match: 11/12", "Risk delta calculated", "Policy refs checked", "Audit log generated"],
  },
  {
    id: "remediate",
    label: "REMEDIATE",
    color: "#f59e0b",
    glow: "#f59e0b30",
    angle: 180,
    title: "Autonomous Remediation",
    desc: "Hard Kill-Switch purges orphans, revokes toxic links, and scopes over-privileged bots — all without human intervention.",
    metrics: [
      { label: "Orphans auto-purged", val: "134/scan" },
      { label: "Breach value saved", val: "$4.2M" },
      { label: "Human review needed", val: "3%" },
    ],
    actions: ["Orphan account purged", "Toxic link revoked", "Bot re-scoped", "Manager notified"],
  },
  {
    id: "monitor",
    label: "MONITOR",
    color: "#8b5cf6",
    glow: "#8b5cf630",
    angle: 270,
    title: "Continuous Compliance",
    desc: "Governance runs 24/7. Continuous drift detection, anomaly scoring, and automated evidence for SOC 2, HIPAA, and PCI DSS 4.0.",
    metrics: [
      { label: "Compliance posture", val: "94%" },
      { label: "Evidence collected", val: "48,291" },
      { label: "Audit readiness", val: "Continuous" },
    ],
    actions: ["HIPAA evidence snapshot", "PCI DSS Req 7 collected", "Drift score updated", "CISO report generated"],
  },
];

export default function GovernanceLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const [activePhase, setActivePhase] = useState(0);
  const [actionLog, setActionLog] = useState<Array<{ phase: string; action: string; color: string; time: string }>>([]);

  // Cycle through phases
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(p => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Add action log entries
  useEffect(() => {
    const phase = PHASES[activePhase];
    const randomAction = phase.actions[Math.floor(Math.random() * phase.actions.length)];
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setActionLog(l => [{ phase: phase.label, action: randomAction, color: phase.color, time }, ...l.slice(0, 14)]);
  }, [activePhase]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.clearRect(0, 0, W, H);
      const t = tRef.current;
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.33;

      // Outer ring
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R + 40, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R - 40, 0, Math.PI * 2); ctx.stroke();

      // Draw arcs between phases
      PHASES.forEach((phase, i) => {
        const startAngle = (phase.angle - 50) * Math.PI / 180;
        const endAngle = (PHASES[(i + 1) % 3].angle + 50) * Math.PI / 180;
        const isActive = i === activePhase;

        const grad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
        grad.addColorStop(0, phase.color + (isActive ? "60" : "20"));
        grad.addColorStop(1, PHASES[(i + 1) % 3].color + (isActive ? "60" : "20"));

        ctx.strokeStyle = isActive ? grad : phase.color + "15";
        ctx.lineWidth = isActive ? 4 : 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, startAngle, endAngle);
        ctx.stroke();

        // Animated particle on active arc
        if (isActive) {
          const progress = (t * 0.008) % 1;
          const particleAngle = startAngle + (endAngle - startAngle) * progress;
          const px = cx + R * Math.cos(particleAngle);
          const py = cy + R * Math.sin(particleAngle);

          const pGlow = ctx.createRadialGradient(px, py, 0, px, py, 16);
          pGlow.addColorStop(0, phase.color);
          pGlow.addColorStop(1, phase.color + "00");
          ctx.fillStyle = pGlow;
          ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = phase.color;
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Phase nodes
      PHASES.forEach((phase, i) => {
        const rad = phase.angle * Math.PI / 180;
        const nx = cx + R * Math.cos(rad);
        const ny = cy + R * Math.sin(rad);
        const isActive = i === activePhase;
        const pulse = 1 + (isActive ? Math.sin(t * 0.1) * 0.15 : 0);

        // Glow
        const gGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 55 * pulse);
        gGrad.addColorStop(0, phase.color + (isActive ? "40" : "15"));
        gGrad.addColorStop(1, phase.color + "00");
        ctx.fillStyle = gGrad;
        ctx.beginPath(); ctx.arc(nx, ny, 55 * pulse, 0, Math.PI * 2); ctx.fill();

        // Circle
        ctx.fillStyle = isActive ? "#0a0f1e" : "#0d1320";
        ctx.strokeStyle = phase.color + (isActive ? "ff" : "60");
        ctx.lineWidth = isActive ? 3 : 1.5;
        ctx.beginPath(); ctx.arc(nx, ny, 36 * pulse, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Label
        ctx.fillStyle = isActive ? phase.color : phase.color + "80";
        ctx.font = `bold ${isActive ? 11 : 10}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(phase.label, nx, ny);
      });

      // Center hub
      const hubPulse = 1 + Math.sin(t * 0.05) * 0.08;
      const hubR = 48;
      const hubGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR * 2.5);
      hubGlow.addColorStop(0, "#0061d430");
      hubGlow.addColorStop(1, "#0061d400");
      ctx.fillStyle = hubGlow;
      ctx.beginPath(); ctx.arc(cx, cy, hubR * 2.5 * hubPulse, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#0a0f1e";
      ctx.strokeStyle = "#0061d4";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, hubR * hubPulse, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("UNKOV", cx, cy - 7);
      ctx.fillStyle = "#475569";
      ctx.font = "9px monospace";
      ctx.fillText("GOVERNANCE", cx, cy + 6);

      tRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [activePhase]);

  const active = PHASES[activePhase];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "1rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>Platform Core</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.25rem" }}>Governance Loop Animation</h1>
            <p style={{ color: "#64748b", fontSize: "1.0625rem" }}>The continuous Discover → Analyze → Remediate cycle runs autonomously 24/7.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            {[{ label: "Identities governed", value: "1,247", color: "#60a5fa" }, { label: "Decisions automated", value: "98%", color: "#10b981" }, { label: "Orphans purged", value: "134", color: "#f59e0b" }, { label: "Compliance", value: "94%", color: "#8b5cf6" }].map((m) => (
              <div key={m.label} style={{ padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0, 340px)", minHeight: "calc(100vh - 240px)" }}>
          {/* Canvas */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", maxHeight: 520 }} />

            {/* Active phase details overlay */}
            <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", textAlign: "center", backgroundColor: "rgba(10,15,30,0.9)", border: `1px solid ${active.color}30`, borderRadius: 14, padding: "1.25rem 2rem", backdropFilter: "blur(10px)", minWidth: 340 }}>
              <div style={{ fontSize: "1.0625rem", color: active.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>Active Phase</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.5rem" }}>{active.title}</div>
              <div style={{ fontSize: "1.0625rem", color: "#64748b", lineHeight: 1.5 }}>{active.desc}</div>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.875rem", justifyContent: "center" }}>
                {active.metrics.map(m => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: active.color }}>{m.val}</div>
                    <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live action log */}
          <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", animation: "pulse4 2s infinite" }} />
              <div style={{ fontSize: "1.0625rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Governance Actions</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {actionLog.map((entry, i) => (
                <div key={i} style={{ padding: "0.625rem 0.875rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 8, opacity: Math.max(0.3, 1 - i * 0.06), transition: "opacity 0.3s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: entry.color, backgroundColor: entry.color + "15", padding: "0.1rem 0.5rem", borderRadius: 9999 }}>{entry.phase}</span>
                    <span style={{ fontSize: "1.0625rem", fontFamily: "monospace", color: "#374151" }}>{entry.time}</span>
                  </div>
                  <div style={{ fontSize: "1.0625rem", color: i === 0 ? "#94a3b8" : "#4b5563" }}>{entry.action}</div>
                </div>
              ))}
            </div>

            {/* Manual phase selector */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Jump to Phase</div>
              {PHASES.map((p, i) => (
                <button key={p.id} onClick={() => setActivePhase(i)}
                  style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: 8, border: `1px solid ${activePhase === i ? p.color + "40" : "rgba(255,255,255,0.06)"}`, backgroundColor: activePhase === i ? p.color + "10" : "transparent", color: activePhase === i ? p.color : "#64748b", fontSize: "1.0625rem", fontWeight: 600, cursor: "pointer", marginBottom: "0.5rem", transition: "all 0.15s" }}>
                  {p.label} — {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse4 { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
