import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NODE_TYPES = [
  { type: "human", color: "#0061d4", label: "Human Identity", count: 42 },
  { type: "bot", color: "#f59e0b", label: "Bot / Service Account", count: 186 },
  { type: "ai_agent", color: "#10b981", label: "AI Agent", count: 67 },
  { type: "resource", color: "#8b5cf6", label: "Resource / App", count: 94 },
  { type: "orphan", color: "#ef4444", label: "Orphaned / Ghost", count: 23 },
];

function generateNodes(count: number) {
  const nodes: any[] = [];
  for (let i = 0; i < count; i++) {
    const typeIdx = Math.floor(Math.random() * NODE_TYPES.length);
    nodes.push({
      id: i,
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      type: NODE_TYPES[typeIdx].type,
      color: NODE_TYPES[typeIdx].color,
      label: `${NODE_TYPES[typeIdx].type}_${i}`,
      risk: Math.random(),
      connections: [] as number[],
    });
  }
  // create edges
  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const numConn = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < numConn; j++) {
      const target = Math.floor(Math.random() * count);
      if (target !== i) {
        edges.push([i, target]);
        nodes[i].connections.push(target);
      }
    }
  }
  return { nodes, edges };
}

export default function IdentityGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef(generateNodes(120));
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [stats, setStats] = useState({ total: 412, risk: 23, active: 389, drifted: 47 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 400, y: 300 });
  const scaleRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = "rgba(0,41,122,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;
      const sc = scaleRef.current;
      const { nodes, edges } = dataRef.current;

      // Animate nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (Math.abs(n.x) > 450) n.vx *= -1;
        if (Math.abs(n.y) > 350) n.vy *= -1;
      });

      // Draw edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        if (selectedFilter !== "all" && na.type !== selectedFilter && nb.type !== selectedFilter) return;
        const ax = na.x * sc + ox, ay = na.y * sc + oy;
        const bx = nb.x * sc + ox, by = nb.y * sc + oy;
        const pulse = (Math.sin(t * 0.02 + a * 0.1) + 1) / 2;
        ctx.strokeStyle = `rgba(0,97,212,${0.04 + pulse * 0.06})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();

        // Animate packet along edge
        if (Math.random() < 0.002) {
          const px = ax + (bx - ax) * ((t * 0.5) % 1);
          const py = ay + (by - ay) * ((t * 0.5) % 1);
          ctx.fillStyle = na.color;
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        if (selectedFilter !== "all" && n.type !== selectedFilter) return;
        const nx = n.x * sc + ox;
        const ny = n.y * sc + oy;
        if (nx < -20 || nx > W + 20 || ny < -20 || ny > H + 20) return;

        const r = n.type === "resource" ? 5 : n.type === "human" ? 7 : 5;
        const pulse = 1 + Math.sin(t * 0.05 + n.id * 0.3) * 0.15;

        // Glow for risky nodes
        if (n.type === "orphan" || n.risk > 0.85) {
          const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 4);
          grad.addColorStop(0, `${n.color}40`);
          grad.addColorStop(1, `${n.color}00`);
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(nx, ny, r * 4, 0, Math.PI * 2); ctx.fill();
        }

        // Node circle
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(nx, ny, r * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Ring for high-risk
        if (n.risk > 0.8) {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(nx, ny, r * 2.2, 0, Math.PI * 2); ctx.stroke();
        }
      });

      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Mouse hover detection
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };

      const { nodes } = dataRef.current;
      const ox = offsetRef.current.x, oy = offsetRef.current.y, sc = scaleRef.current;
      let found = null;
      for (const n of nodes) {
        const nx = n.x * sc + ox, ny = n.y * sc + oy;
        if (Math.hypot(mx - nx, my - ny) < 12) { found = n; break; }
      }
      setHoveredNode(found);
    };

    canvas.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [selectedFilter]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1e", color: "#e2e8f0" }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(10,15,30,0.95)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem,1.5vw,1.5rem)", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.875rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.1em" }}>Identity Graph</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e2e8f0" }}>Live Social Fabric — Acme Corp</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["all", ...NODE_TYPES.map(n => n.type)].map(f => (
                <button key={f} onClick={() => setSelectedFilter(f)}
                  style={{ padding: "0.3rem 0.75rem", borderRadius: 9999, fontSize: "0.9375rem", fontWeight: 600, border: "1px solid", borderColor: selectedFilter === f ? "#0061d4" : "rgba(255,255,255,0.1)", backgroundColor: selectedFilter === f ? "#0061d420" : "transparent", color: selectedFilter === f ? "#60a5fa" : "#cbd5e1", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {[
              { label: "Total Identities", val: stats.total, color: "#60a5fa" },
              { label: "Active", val: stats.active, color: "#10b981" },
              { label: "Ghost / Orphan", val: stats.risk, color: "#ef4444" },
              { label: "Drifted", val: stats.drifted, color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div style={{ position: "relative", height: "calc(100vh - 200px)", minHeight: 500 }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

          {/* Legend */}
          <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", backgroundColor: "rgba(10,15,30,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1rem 1.25rem", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "0.8rem", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.9375rem" }}>Node Types</div>
            {NODE_TYPES.map(n => (
              <div key={n.type} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: n.color, boxShadow: `0 0 6px ${n.color}` }} />
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{n.label}</div>
                <div style={{ fontSize: "0.8rem", color: n.color, fontWeight: 700, marginLeft: "auto", paddingLeft: "1rem" }}>{n.count}</div>
              </div>
            ))}
          </div>

          {/* Hover tooltip */}
          {hoveredNode && (
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", backgroundColor: "rgba(10,15,30,0.92)", border: `1px solid ${hoveredNode.color}40`, borderRadius: 12, padding: "1rem 1.25rem", backdropFilter: "blur(10px)", minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9375rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: hoveredNode.color }} />
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>{hoveredNode.label}</div>
              </div>
              <div style={{ fontSize: "0.9375rem", color: "#cbd5e1", marginBottom: "0.25rem" }}>Type: <span style={{ color: "#cbd5e1" }}>{hoveredNode.type}</span></div>
              <div style={{ fontSize: "0.9375rem", color: "#cbd5e1", marginBottom: "0.25rem" }}>Connections: <span style={{ color: "#cbd5e1" }}>{hoveredNode.connections.length}</span></div>
              <div style={{ fontSize: "0.9375rem", color: "#cbd5e1", marginBottom: "0.5rem" }}>Risk Score: <span style={{ color: hoveredNode.risk > 0.7 ? "#ef4444" : hoveredNode.risk > 0.4 ? "#f59e0b" : "#10b981" }}>{(hoveredNode.risk * 100).toFixed(0)}%</span></div>
              {hoveredNode.risk > 0.7 && (
                <div style={{ backgroundColor: "#ef444420", border: "1px solid #ef444440", borderRadius: 6, padding: "0.375rem 0.625rem", fontSize: "0.875rem", color: "#fca5a5" }}>
                  ⚠ High-risk identity — remediation recommended
                </div>
              )}
            </div>
          )}

          {/* Live badge */}
          <div style={{ position: "absolute", top: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(10,15,30,0.8)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 9999, padding: "0.375rem 1rem", backdropFilter: "blur(8px)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 6px #10b981", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.9375rem", color: "#10b981", fontWeight: 600 }}>LIVE — Updating every 2s</span>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1rem 2rem", display: "flex", gap: "clamp(1.25rem,3vw,3rem)", backgroundColor: "rgba(10,15,30,0.95)" }}>
          {[
            { label: "Orphan accounts auto-killed this week", val: "134", unit: "identities" },
            { label: "Avg onboarding time", val: "< 10", unit: "minutes" },
            { label: "NHI:Human ratio", val: "5.2:1", unit: "detected" },
            { label: "Access reviews automated", val: "98.2%", unit: "of total" },
            { label: "Ghost access eliminated", val: "$4.2M", unit: "breach value saved" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#60a5fa" }}>{s.val} <span style={{ fontSize: "0.875rem", color: "#cbd5e1", fontWeight: 400 }}>{s.unit}</span></div>
              <div style={{ fontSize: "0.8rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
