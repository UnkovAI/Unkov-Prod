import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Shield, Zap, ChevronRight, Lock, Unlock } from "lucide-react";

const ATTACK_PATHS = [
  {
    id: 1,
    severity: "critical",
    name: "Lateral Movement via AI Agent",
    description: "Compromised AI agent escalating privileges through service account chain",
    steps: [
      { id: "ext", label: "External Attacker", type: "attacker", x: 60, y: 200 },
      { id: "agent1", label: "AI Agent: bedrock-agent-executor-03", type: "ai_agent", x: 220, y: 200 },
      { id: "svc1", label: "Svc Acct: svc-payment-processor", type: "service", x: 380, y: 150 },
      { id: "svc2", label: "Svc Acct: db-admin", type: "service", x: 540, y: 200 },
      { id: "db", label: "PII Database", type: "resource", x: 700, y: 200 },
    ],
    edges: [["ext","agent1"],["agent1","svc1"],["svc1","svc2"],["svc2","db"]],
    blast_radius: "$4.2M",
    remediation: "Kill-switch on bedrock-agent-executor-03 + revoke etl-runner → db-admin link",
  },
  {
    id: 2,
    severity: "high",
    name: "Orphan Account Takeover",
    description: "Dormant account from departed employee exploited for persistence",
    steps: [
      { id: "ext2", label: "Phishing Vector", type: "attacker", x: 60, y: 200 },
      { id: "orphan", label: "Ghost: j.smith@corp (180d)", type: "orphan", x: 240, y: 200 },
      { id: "vpn", label: "VPN Access Group", type: "service", x: 430, y: 200 },
      { id: "repo", label: "Source Code Repo", type: "resource", x: 620, y: 200 },
    ],
    edges: [["ext2","orphan"],["orphan","vpn"],["vpn","repo"]],
    blast_radius: "$890K",
    remediation: "Auto-purge orphans after 30d inactivity — preventing this path entirely",
  },
  {
    id: 3,
    severity: "medium",
    name: "Bot Credential Sprawl",
    description: "Over-privileged bot credentials accessible across multiple systems",
    steps: [
      { id: "bot1", label: "Bot: report-gen-v2", type: "bot", x: 60, y: 200 },
      { id: "creds", label: "Shared Credential Store", type: "service", x: 250, y: 200 },
      { id: "hr", label: "HR System", type: "resource", x: 430, y: 130 },
      { id: "fin", label: "Finance API", type: "resource", x: 430, y: 270 },
      { id: "crm", label: "CRM Database", type: "resource", x: 620, y: 200 },
    ],
    edges: [["bot1","creds"],["creds","hr"],["creds","fin"],["hr","crm"],["fin","crm"]],
    blast_radius: "$1.1M",
    remediation: "Scope bot credentials to report-only; remove cross-system access",
  },
];

const TYPE_COLORS: Record<string, string> = {
  attacker: "#ef4444",
  ai_agent: "#10b981",
  service: "#f59e0b",
  resource: "#8b5cf6",
  bot: "#f59e0b",
  orphan: "#ef4444",
};

const SEV_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
};

export default function AttackPaths() {
  const [selected, setSelected] = useState(0);
  const [animStep, setAnimStep] = useState(-1);
  const [blocked, setBlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  const path = ATTACK_PATHS[selected];

  useEffect(() => {
    setAnimStep(-1);
    setBlocked(false);
    const timer = setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        setAnimStep(step);
        step++;
        if (step >= path.steps.length) clearInterval(interval);
      }, 600);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [selected]);

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

      // Background
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, W, H);

      const t = tRef.current;
      const scaleX = W / 760;
      const scaleY = H / 400;

      // Draw edges
      path.edges.forEach(([fromId, toId]) => {
        const from = path.steps.find(s => s.id === fromId)!;
        const to = path.steps.find(s => s.id === toId)!;
        const fx = from.x * scaleX, fy = from.y * scaleY;
        const tx = to.x * scaleX, ty = to.y * scaleY;

        const fromIdx = path.steps.findIndex(s => s.id === fromId);
        const toIdx = path.steps.findIndex(s => s.id === toId);
        const active = fromIdx <= animStep && toIdx <= animStep;

        if (!active) {
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
          ctx.setLineDash([]);
          return;
        }

        const color = blocked ? "#10b981" : SEV_COLORS[path.severity];
        // Animated dashes
        ctx.strokeStyle = color + "80";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -(t * 0.3);
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(ty - fy, tx - fx);
        const arrowX = tx - Math.cos(angle) * 28, arrowY = ty - Math.sin(angle) * 28;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(arrowX + Math.cos(angle) * 10, arrowY + Math.sin(angle) * 10);
        ctx.lineTo(arrowX + Math.cos(angle + 2.5) * 7, arrowY + Math.sin(angle + 2.5) * 7);
        ctx.lineTo(arrowX + Math.cos(angle - 2.5) * 7, arrowY + Math.sin(angle - 2.5) * 7);
        ctx.fill();

        // Animated packet
        if (!blocked) {
          const progress = ((t * 0.008) % 1);
          const px = fx + (tx - fx) * progress;
          const py = fy + (ty - fy) * progress;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
          grad.addColorStop(0, color);
          grad.addColorStop(1, color + "00");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Draw nodes
      path.steps.forEach((step, idx) => {
        const nx = step.x * scaleX, ny = step.y * scaleY;
        const active = idx <= animStep;
        const color = TYPE_COLORS[step.type] || "#60a5fa";
        const r = 22;

        if (!active) {
          ctx.fillStyle = "#1e2433";
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("?", nx, ny);
          return;
        }

        // Glow
        const pulse = 1 + Math.sin(t * 0.08 + idx) * 0.1;
        const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.5);
        glow.addColorStop(0, color + (blocked ? "20" : "30"));
        glow.addColorStop(1, color + "00");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(nx, ny, r * 2.5 * pulse, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = blocked ? "#0d1117" : "#1a0a0a";
        ctx.strokeStyle = blocked ? "#10b981" : color;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(nx, ny, r * pulse, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Icon
        ctx.fillStyle = blocked ? "#10b981" : color;
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const icons: Record<string, string> = { attacker: "☠", ai_agent: "🤖", service: "⚙", resource: "💾", bot: "🔧", orphan: "👻" };
        ctx.fillText(icons[step.type] || "●", nx, ny);

        // Label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(step.label, nx, ny + r + 14);

        // Blocked badge
        if (blocked && idx > 1) {
          ctx.fillStyle = "#10b98130";
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(nx + r * 0.7, ny - r * 0.7, 8, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = "#10b981";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText("✓", nx + r * 0.7, ny - r * 0.7);
        }
      });

      tRef.current++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [selected, animStep, blocked]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0d1117", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "1rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>Attack Path Intelligence</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.25rem" }}>Identity Attack Surface Visualizer</h1>
            <p style={{ color: "#64748b", fontSize: "1.0625rem" }}>See exactly how attackers traverse your identity graph — and how Unkov blocks each path automatically.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            {[{ label: "Paths detected", value: "3", color: "#ef4444" }, { label: "Blast radius", value: "$6.2M", color: "#f59e0b" }, { label: "Auto-blocked", value: "100%", color: "#10b981" }].map((m) => (
              <div key={m.label} style={{ padding: "0.5rem 1rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 250px)" }}>
          {/* Sidebar */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
            <div style={{ fontSize: "1.0625rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Detected Attack Paths</div>
            {ATTACK_PATHS.map((p, i) => (
              <button key={p.id} onClick={() => setSelected(i)}
                style={{ width: "100%", textAlign: "left", padding: "1rem", borderRadius: 10, border: `1px solid ${selected === i ? SEV_COLORS[p.severity] + "40" : "rgba(255,255,255,0.06)"}`, backgroundColor: selected === i ? SEV_COLORS[p.severity] + "10" : "transparent", cursor: "pointer", marginBottom: "0.75rem", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: SEV_COLORS[p.severity] }} />
                  <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: SEV_COLORS[p.severity], textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.severity}</span>
                </div>
                <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.25rem" }}>{p.name}</div>
                <div style={{ fontSize: "1.0625rem", color: "#64748b" }}>Blast radius: <span style={{ color: SEV_COLORS[p.severity], fontWeight: 600 }}>{p.blast_radius}</span></div>
              </button>
            ))}

            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: "1rem", color: "#10b981", fontWeight: 700, marginBottom: "0.5rem" }}>UNKOV COVERAGE</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>100%</div>
              <div style={{ fontSize: "1.0625rem", color: "#64748b" }}>All 3 paths auto-blocked with zero manual intervention</div>
            </div>
          </div>

          {/* Canvas area */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <canvas ref={canvasRef} style={{ flex: 1, width: "100%", minHeight: 380 }} />

            {/* Controls + info */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.25rem" }}>{path.name}</div>
                <div style={{ fontSize: "1rem", color: "#64748b", marginBottom: "0.5rem" }}>{path.description}</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <Shield style={{ width: 14, height: 14, color: "#10b981", marginTop: 2, flexShrink: 0 }} />
                  <div style={{ fontSize: "1.0625rem", color: "#10b981" }}><strong>Unkov fix:</strong> {path.remediation}</div>
                </div>
              </div>
              <button onClick={() => setBlocked(b => !b)}
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.75rem 1.5rem", borderRadius: 10, border: "none", backgroundColor: blocked ? "#10b98120" : "#ef444420", borderColor: blocked ? "#10b981" : "#ef4444", color: blocked ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "1.0625rem", cursor: "pointer", transition: "all 0.2s", outline: `1px solid ${blocked ? "#10b98140" : "#ef444440"}` }}>
                {blocked ? <Lock style={{ width: 16, height: 16 }} /> : <Unlock style={{ width: 16, height: 16 }} />}
                {blocked ? "Path Blocked ✓" : "Simulate Block"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
