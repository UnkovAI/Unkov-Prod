import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Shield, Users, Bot, AlertTriangle, Clock,  Download, Search, ChevronDown, CheckCircle, FileText, Lock as LockIcon, Zap, Eye, X, ArrowDownRight, ExternalLink, Activity, TrendingDown, RefreshCw, Play, ChevronRight, Settings } from "lucide-react";

// ─── Design tokens ───────────────────────────────────────────────
const S = {
  bg:"#0a0f1e", panel:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.07)",
  text:"#e2e8f0", muted:"#64748b", soft:"#94a3b8",
};
const phaseColor: Record<string,string> = { Discover:"#0061d4",Analyze:"#7c3aed",Remediate:"#f59e0b",Monitor:"#059669" };
const outcomeColor: Record<string,string> = { approved:"#059669",blocked:"#ef4444",escalated:"#7c3aed",purged:"#f59e0b",scoped:"#0061d4" };
const typeColor: Record<string,string> = { human:"#0061d4",bot:"#f59e0b",ai_agent:"#7c3aed",service:"#6b7280",orphan:"#ef4444" };
const typeLabel: Record<string,string> = { human:"Human",bot:"Bot",ai_agent:"AI Agent",service:"Service",orphan:"Orphan" };

// ─── Demo data — uses YOUR real environment after credential handoff ──
const DEMO_IDENTITIES = [
  { id:"ID-001", type:"human",    name:"sarah.chen",              dept:"Security",         risk:12, lastActive:"2m ago",   status:"active",  accessCount:24 },
  { id:"ID-002", type:"ai_agent", name:"ai-clinical-doc-01",      dept:"Clinical Info",    risk:91, lastActive:"4m ago",   status:"flagged", accessCount:147 },
  { id:"ID-003", type:"ai_agent", name:"bedrock-agent-executor-03",dept:"ML/AI",           risk:94, lastActive:"1m ago",   status:"flagged", accessCount:203 },
  { id:"ID-004", type:"service",  name:"svc-payment-processor",   dept:"Finance",          risk:97, lastActive:"8m ago",   status:"flagged", accessCount:34 },
  { id:"ID-005", type:"orphan",   name:"michael.torres",          dept:"IT Operations",    risk:88, lastActive:"14d ago",  status:"orphan",  accessCount:18 },
  { id:"ID-006", type:"orphan",   name:"ghost-svc-legacy-app",    dept:"Unknown",          risk:96, lastActive:"210d ago", status:"orphan",  accessCount:7 },
  { id:"ID-007", type:"ai_agent", name:"ai-agent-copilot-08",     dept:"Engineering",      risk:89, lastActive:"2m ago",   status:"flagged", accessCount:88 },
  { id:"ID-008", type:"service",  name:"svc-ehr-integration",     dept:"Clinical Info",    risk:95, lastActive:"6m ago",   status:"flagged", accessCount:52 },
  { id:"ID-009", type:"human",    name:"james.park",              dept:"Engineering",      risk:8,  lastActive:"5m ago",   status:"active",  accessCount:31 },
  { id:"ID-010", type:"orphan",   name:"jennifer.walsh",          dept:"Finance",          risk:82, lastActive:"104d ago", status:"orphan",  accessCount:12 },
];

const DEMO_EVENTS = [
  { color:"#ef4444", phase:"Discover",  msg:"47 ghost bots with Admin access discovered — invisible to existing IAM",     time:"0:28" },
  { color:"#f59e0b", phase:"Discover",  msg:"12 orphan accounts found — ex-employees with active credentials",            time:"1:04" },
  { color:"#7c3aed", phase:"Analyze",   msg:"Peer-Clone: sarah.chen provisioned Finance DB — 11/12 peers matched",        time:"2:31" },
  { color:"#f59e0b", phase:"Analyze",   msg:"Toxic combination: svc-payment-processor can create + approve Finance API transactions", time:"3:18" },
  { color:"#059669", phase:"Remediate", msg:"Orphan purge: michael.torres auto-deprovisioned (Admin + PII access)",      time:"4:02" },
  { color:"#ef4444", phase:"Remediate", msg:"Lateral move blocked: bedrock-agent-executor-03 → PII Database — denied in 340ms",       time:"5:47" },
  { color:"#059669", phase:"Monitor",   msg:"PCI DSS 4.0 evidence collected — 14,382 log entries. Export ready.",         time:"7:12" },
  { color:"#059669", phase:"Monitor",   msg:"Risk score: 88 → 23. Identity Drift dashboard live.",                        time:"8:55" },
];

const DEMO_ACCESS = [
  { id:"sarah.chen",    type:"human",    res:"Finance DB",       risk:"low",    status:"auto-approved", peers:"11/12", conf:97, reason:"Peer-clone: 11/12 Finance peers have this access. Risk delta +2." },
  { id:"AI: mlops-v3",  type:"ai_agent", res:"Training Cluster", risk:"medium", status:"pending",       peers:"8/10",  conf:82, reason:"New agent type. Peer-clone 8/10 — awaiting ML team lead." },
  { id:"bot: report-gen",type:"bot",     res:"HR System",        risk:"high",   status:"blocked",       peers:"0/31",  conf:99, reason:"Zero peer precedent. Toxic combination: Ops→HR cross-dept access." },
];

// ─── Computed constants from demo data ───────────────────────────
const kTotal    = DEMO_IDENTITIES.length + 37; // 10 visible + 37 discovered by scanner
const kOrphans  = 47;  // ghost bots with Admin scope (from scan event)
const kAIAgents = DEMO_IDENTITIES.filter(d => d.type === "ai_agent" && d.status === "flagged").length;
const kToxic    = 1;   // toxic combination detected
const kRatio    = "5:1"; // NHI-to-human ratio in demo environment
const activeIds = DEMO_IDENTITIES;

// ─── Shared helpers ───────────────────────────────────────────────
function dlCSV(name: string, rows: Record<string,unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k]).replace(/"/g,'""')}"`).join(","))].join("\n");
  const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download = name; a.click();
}
function dlJSON(name: string, data: unknown) {
  const a = document.createElement("a"); a.href = "data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(data,null,2)); a.download = name; a.click();
}
function dlTXT(name: string, content: string) {
  const a = document.createElement("a"); a.href = "data:text/plain;charset=utf-8,"+encodeURIComponent(content); a.download = name; a.click();
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ backgroundColor:S.panel, border:`1px solid ${S.border}`, borderRadius:12, ...style }}>{children}</div>;
}
function Badge({ children, color }: { children:React.ReactNode; color:string }) {
  return <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"2px 7px", borderRadius:9999, backgroundColor:color+"22", color, border:`1px solid ${color}44`, whiteSpace:"nowrap" }}>{children}</span>;
}
function Btn({ children, onClick, variant="default", size="sm" }: { children:React.ReactNode; onClick?:()=>void; variant?:"default"|"primary"|"success"|"ghost"|"cta"; size?:"xs"|"sm"|"md" }) {
  const c: Record<string,{bg:string;bd:string;tx:string}> = {
    default: { bg:"rgba(255,255,255,0.06)", bd:"rgba(255,255,255,0.1)", tx:S.soft },
    primary: { bg:"rgba(0,97,212,0.2)",    bd:"rgba(0,97,212,0.4)",   tx:"#60a5fa" },
    success: { bg:"rgba(5,150,105,0.15)",  bd:"rgba(5,150,105,0.35)", tx:"#34d399" },
    ghost:   { bg:"transparent",           bd:"transparent",           tx:S.muted },
    cta:     { bg:"#0061d4",               bd:"#0061d4",               tx:"#fff" },
  };
  const col = c[variant];
  const p = size==="xs"?"2px 8px":size==="sm"?"5px 12px":"8px 20px";
  return (
    <button onClick={onClick} style={{ padding:p, fontSize:size==="xs"?"0.72rem":size==="md"?"0.9375rem":"0.8125rem", fontWeight:600, borderRadius:7, border:`1px solid ${col.bd}`, backgroundColor:col.bg, color:col.tx, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"0.3rem", whiteSpace:"nowrap" }}
      onMouseEnter={e=>(e.currentTarget.style.opacity="0.8")} onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
      {children}
    </button>
  );
}

// ─── Deployment timer ─────────────────────────────────────────────
function DeployTimer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now()-startTime)/1000)), 1000);
    return () => clearInterval(id);
  }, [startTime]);
  const mm = String(Math.floor(elapsed/60)).padStart(2,"0");
  const ss = String(elapsed%60).padStart(2,"0");
  const pct = Math.min(100, Math.round((elapsed/1800)*100));
  const done = elapsed >= 1800;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"0.5rem 1.25rem", backgroundColor:done?"rgba(52,211,153,0.1)":"rgba(0,97,212,0.1)", border:`1px solid ${done?"rgba(52,211,153,0.3)":"rgba(0,97,212,0.3)"}`, borderRadius:10 }}>
      <div style={{ textAlign:"center" as const, minWidth:52 }}>
        <div style={{ fontSize:"1.375rem", fontWeight:800, color:done?"#34d399":"#60a5fa", letterSpacing:"-0.04em", fontFamily:"monospace" }}>{mm}:{ss}</div>
        <div style={{ fontSize:"0.65rem", color:S.muted, textTransform:"uppercase" as const, letterSpacing:"0.08em" }}>demo timer</div>
      </div>
      <div style={{ flex:1, minWidth:140 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:"0.75rem", fontWeight:600, color:done?"#34d399":S.soft }}>{done?"Simulation complete":"Demo simulation running…"}</span>
          <span style={{ fontSize:"0.72rem", color:S.muted }}>{pct}%</span>
        </div>
        <div style={{ height:4, backgroundColor:"rgba(255,255,255,0.08)", borderRadius:9999, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, backgroundColor:done?"#34d399":"#0061d4", borderRadius:9999, transition:"width .8s ease" }}/>
        </div>
        <div style={{ fontSize:"0.65rem", color:S.muted, marginTop:3 }}>This simulates a real 30-min onboarding deployment</div>
      </div>
      <div style={{ textAlign:"center" as const }}>
        <div style={{ fontSize:"1.125rem", fontWeight:800, color:"#34d399" }}>30m</div>
        <div style={{ fontSize:"0.65rem", color:S.muted, textTransform:"uppercase" as const }}>SLA</div>
      </div>
    </div>
  );
}

// ─── Phase stepper ────────────────────────────────────────────────
const PHASES = [
  { id:"discover",  label:"Discover",  color:"#0061d4", desc:"Identity Social Fabric live",      icon:Search },
  { id:"analyze",   label:"Analyze",   color:"#7c3aed", desc:"Intent Engine deciding",            icon:Zap },
  { id:"remediate", label:"Remediate", color:"#f59e0b", desc:"Kill-Switch armed",                 icon:Shield },
  { id:"monitor",   label:"Monitor",   color:"#059669", desc:"Compliance evidence collecting",    icon:CheckCircle },
];

function PhaseStepper({ activePhase }: { activePhase: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0 }}>
      {PHASES.map((ph, i) => {
        const Icon = ph.icon;
        const isActive = ph.id === activePhase;
        const isDone = PHASES.findIndex(p=>p.id===activePhase) > i;
        return (
          <div key={ph.id} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.35rem 0.75rem", borderRadius:9999, backgroundColor:isActive?ph.color+"25":isDone?"rgba(52,211,153,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${isActive?ph.color:isDone?"rgba(52,211,153,0.3)":"rgba(255,255,255,0.08)"}`, transition:"all .3s" }}>
              <Icon style={{ width:11, height:11, color:isActive?ph.color:isDone?"#34d399":"#475569" }}/>
              <span style={{ fontSize:"0.75rem", fontWeight:600, color:isActive?ph.color:isDone?"#34d399":"#475569" }}>{ph.label}</span>
              {isDone && <span style={{ fontSize:"0.65rem", color:"#34d399" }}>✓</span>}
            </div>
            {i < PHASES.length-1 && <div style={{ width:20, height:1, backgroundColor:isDone?"rgba(52,211,153,0.4)":"rgba(255,255,255,0.06)", margin:"0 2px" }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Locked tab overlay ───────────────────────────────────────────
function LockedView({ tabLabel, unlockReason, preview }: { tabLabel:string; unlockReason:string; preview?:React.ReactNode }) {
  return (
    <div style={{ position:"relative" }}>
      {preview && (
        <div style={{ filter:"blur(3px)", pointerEvents:"none", opacity:0.35, userSelect:"none" }}>
          {preview}
        </div>
      )}
      <div style={{ position:preview?"absolute":"relative", inset:preview?"0":undefined, display:"flex", alignItems:"center", justifyContent:"center", minHeight:preview?undefined:320 }}>
        <div style={{ backgroundColor:"#0a0f1e", border:`1px solid rgba(0,97,212,0.35)`, borderRadius:16, padding:"2.5rem 3rem", textAlign:"center" as const, maxWidth:420, backdropFilter:"blur(8px)" }}>
          <div style={{ width:48, height:48, borderRadius:"50%", backgroundColor:"rgba(0,97,212,0.15)", border:"1px solid rgba(0,97,212,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem" }}>
            <LockIcon style={{ width:20, height:20, color:"#60a5fa" }}/>
          </div>
          <div style={{ fontSize:"1.125rem", fontWeight:700, color:S.text, marginBottom:"0.5rem" }}>{tabLabel}</div>
          <div style={{ fontSize:"0.875rem", color:S.muted, lineHeight:1.6, marginBottom:"1.5rem" }}>{unlockReason}</div>
          <div style={{ display:"inline-block", padding:"0.375rem 1rem", backgroundColor:"rgba(0,97,212,0.15)", border:"1px solid rgba(0,97,212,0.3)", borderRadius:9999, fontSize:"0.8125rem", fontWeight:600, color:"#60a5fa" }}>
            Unlocked on contract
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Discover phase view ──────────────────────────────────────────
function DiscoverView({ events }: { events: typeof DEMO_EVENTS }) {
  const shown = events.filter(e => e.phase === "Discover");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* Identity fabric headline */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
        {[
          { label:"Total identities found",  val:kTotal.toLocaleString(), sub:"Human + NHI + AI agents", color:"#60a5fa" },
          { label:"Ghost bots (Admin scope)", val:String(kOrphans), sub:"Invisible to existing IAM", color:"#ef4444" },
          { label:"Orphan accounts found",    val:"12",  sub:"Departed — still live accounts", color:"#f59e0b" },
          { label:"AI agents ungoverned",     val:String(kAIAgents), sub:"No policy coverage", color:"#a78bfa" },
          { label:"Toxic combinations",       val:String(kToxic), sub:"Create + approve same resource", color:"#ef4444" },
          { label:"NHI:human ratio",          val:kRatio, sub:"Legacy IAM can't govern this", color:"#f59e0b" },
        ].map(k => (
          <Card key={k.label} style={{ padding:"1rem" }}>
            <div style={{ fontSize:"1.75rem", fontWeight:800, color:k.color, lineHeight:1, marginBottom:"0.25rem" }}>{k.val}</div>
            <div style={{ fontSize:"0.75rem", fontWeight:600, color:S.soft, marginBottom:"0.2rem" }}>{k.label}</div>
            <div style={{ fontSize:"0.7rem", color:S.muted }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      {/* Identity table */}
      <Card>
        <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Identity Social Fabric</span>
            <span style={{ fontSize:"0.75rem", color:"#0061d4", marginLeft:"0.75rem", fontWeight:600 }}>● Live scan</span>
          </div>
          <div style={{ display:"flex", gap:"0.375rem" }}>
            <Btn onClick={()=>dlCSV("discover-identities.csv",DEMO_IDENTITIES.map(id=>({id:id.id,name:id.name,type:id.type,dept:id.dept,risk:id.risk,status:id.status,lastActive:id.lastActive})))} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
            <Btn onClick={()=>dlJSON("discover-identities.json",DEMO_IDENTITIES)} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> JSON</Btn>
          </div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${S.border}` }}>
                {["Identity","Type","Dept","Risk score","Permissions","Last active","Status"].map(h=>(
                  <th key={h} style={{ padding:"0.625rem 0.875rem", textAlign:"left", color:S.muted, fontWeight:600, fontSize:"0.7rem", textTransform:"uppercase" as const, letterSpacing:"0.08em", whiteSpace:"nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeIds.map(id=>(
                <tr key={id.id} style={{ borderBottom:`1px solid ${S.border}` }}>
                  <td style={{ padding:"0.75rem 0.875rem" }}>
                    <div style={{ fontWeight:600, color:S.text }}>{id.name}</div>
                    <div style={{ fontSize:"0.7rem", color:S.muted }}>{id.id}</div>
                  </td>
                  <td style={{ padding:"0.75rem 0.875rem" }}><Badge color={typeColor[id.type]}>{typeLabel[id.type]}</Badge></td>
                  <td style={{ padding:"0.75rem 0.875rem", color:S.soft }}>{id.dept}</td>
                  <td style={{ padding:"0.75rem 0.875rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:52, height:5, backgroundColor:"rgba(255,255,255,0.06)", borderRadius:9999 }}>
                        <div style={{ height:"100%", width:`${id.risk}%`, backgroundColor:id.risk>=70?"#ef4444":id.risk>=40?"#f59e0b":"#34d399", borderRadius:9999 }}/>
                      </div>
                      <span style={{ fontWeight:700, color:id.risk>=70?"#ef4444":id.risk>=40?"#f59e0b":"#34d399" }}>{id.risk}</span>
                    </div>
                  </td>
                  <td style={{ padding:"0.75rem 0.875rem", color:S.muted }}>{id.accessCount} rights</td>
                  <td style={{ padding:"0.75rem 0.875rem", color:id.lastActive.includes("d ago")?"#ef4444":S.soft, fontWeight:id.lastActive.includes("d ago")?700:400 }}>{id.lastActive}</td>
                  <td style={{ padding:"0.75rem 0.875rem" }}>
                    <Badge color={id.status==="active"?"#34d399":id.status==="orphan"?"#ef4444":"#f59e0b"}>{id.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Live discovery feed */}
      <Card>
        <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Discovery feed</span>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#34d399" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#34d399", animation:"pulse2 2s infinite" }}/> Live
          </div>
        </div>
        <div style={{ padding:"0.875rem 1.25rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
          {shown.map((e,i)=>(
            <div key={i} style={{ display:"flex", gap:"0.75rem", padding:"0.625rem 0.875rem", backgroundColor:"rgba(255,255,255,0.02)", borderRadius:8, border:`1px solid ${S.border}` }}>
              <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:e.color, flexShrink:0, marginTop:5 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.8125rem", color:S.text }}>{e.msg}</div>
                <div style={{ fontSize:"0.7rem", color:S.muted, marginTop:2 }}>{e.time} into deployment</div>
              </div>
              <Badge color={phaseColor[e.phase]}>{e.phase}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Analyze phase view ───────────────────────────────────────────
function AnalyzeView() {
  const stC: Record<string,string> = { "auto-approved":"#34d399", blocked:"#ef4444", pending:"#f59e0b" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* Engine stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
        {[
          { label:"Decisions automated",  val:"98.4%",  color:"#a78bfa", sub:"By Intent Engine" },
          { label:"Avg decision time",     val:"340ms",  color:"#60a5fa", sub:"From request to outcome" },
          { label:"Peer-clone accuracy",   val:"99.1%",  color:"#34d399", sub:"Access prediction" },
          { label:"Human review needed",   val:"3%",     color:"#f59e0b", sub:"Escalated to CISO" },
        ].map(k=>(
          <Card key={k.label} style={{ padding:"1rem" }}>
            <div style={{ fontSize:"1.75rem", fontWeight:800, color:k.color, lineHeight:1, marginBottom:"0.25rem" }}>{k.val}</div>
            <div style={{ fontSize:"0.75rem", fontWeight:600, color:S.soft, marginBottom:"0.2rem" }}>{k.label}</div>
            <div style={{ fontSize:"0.7rem", color:S.muted }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      {/* Access decisions */}
      <Card>
        <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Permission Gate — live decisions</span>
            <span style={{ fontSize:"0.75rem", color:"#7c3aed", marginLeft:"0.75rem", fontWeight:600 }}>● Intent Engine active</span>
          </div>
          <div style={{ display:"flex", gap:"0.375rem" }}>
            <Btn onClick={()=>dlCSV("access-decisions.csv",DEMO_ACCESS.map(r=>({identity:r.id,resource:r.res,risk:r.risk,status:r.status,peerClone:r.peers,confidence:r.conf})))} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
            <Btn onClick={()=>dlJSON("access-decisions.json",DEMO_ACCESS)} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> JSON</Btn>
          </div>
        </div>
        <div style={{ padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {DEMO_ACCESS.map(r=>(
            <div key={r.id} style={{ padding:"1rem 1.25rem", border:`1px solid ${r.risk==="high"?"rgba(239,68,68,0.25)":r.risk==="medium"?"rgba(245,158,11,0.2)":S.border}`, borderRadius:10, backgroundColor:"rgba(255,255,255,0.02)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.625rem" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", backgroundColor:typeColor[r.type]+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", fontWeight:700, color:typeColor[r.type], flexShrink:0 }}>
                  {r.type==="human"?r.id.slice(0,2).toUpperCase():r.type==="ai_agent"?"AI":"BOT"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.9375rem", fontWeight:600, color:S.text }}>{r.id}</div>
                  <div style={{ fontSize:"0.72rem", color:S.muted }}>{typeLabel[r.type]}</div>
                </div>
                <Badge color={stC[r.status]}>{r.status}</Badge>
              </div>
              <div style={{ fontSize:"0.875rem", color:S.soft, marginBottom:"0.5rem" }}>Requesting: <strong style={{ color:S.text }}>{r.res}</strong></div>
              <div style={{ fontSize:"0.8125rem", color:S.muted, padding:"0.5rem 0.75rem", backgroundColor:"rgba(255,255,255,0.03)", borderRadius:7, marginBottom:"0.5rem", lineHeight:1.5 }}>{r.reason}</div>
              <div style={{ display:"flex", gap:"1.25rem", fontSize:"0.8125rem", color:S.muted }}>
                <span>Peer-clone: <strong style={{ color:S.text }}>{r.peers}</strong></span>
                <span>Confidence: <strong style={{ color:r.conf>=90?"#34d399":"#f59e0b" }}>{r.conf}%</strong></span>
                <span>Risk: <strong style={{ color:r.risk==="high"?"#ef4444":r.risk==="medium"?"#f59e0b":"#34d399" }}>{r.risk}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Peer-clone explainer */}
      <Card style={{ padding:"1.25rem" }}>
        <div style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text, marginBottom:"0.75rem" }}>How Peer-Clone works</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0.75rem" }}>
          {[
            { step:"1", label:"Map peer group", desc:"Identify all identities with the same role, dept, and seniority in the org graph", color:"#0061d4" },
            { step:"2", label:"Calculate median access", desc:"Find the intersection of permissions held by ≥80% of the peer group", color:"#7c3aed" },
            { step:"3", label:"Score risk delta", desc:"Compare requested access against peer median — delta > threshold triggers review", color:"#f59e0b" },
            { step:"4", label:"Decide autonomously", desc:"97% of decisions made in 340ms with full explainability. 3% escalated to CISO.", color:"#059669" },
          ].map(s=>(
            <div key={s.step} style={{ padding:"0.875rem", backgroundColor:"rgba(255,255,255,0.03)", borderRadius:9, borderLeft:`3px solid ${s.color}` }}>
              <div style={{ fontSize:"0.7rem", fontWeight:700, color:s.color, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:"0.25rem" }}>Step {s.step}</div>
              <div style={{ fontSize:"0.875rem", fontWeight:600, color:S.text, marginBottom:"0.25rem" }}>{s.label}</div>
              <div style={{ fontSize:"0.75rem", color:S.muted, lineHeight:1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Remediate phase view ─────────────────────────────────────────
function RemediateView({ events }: { events: typeof DEMO_EVENTS }) {
  const shown = events.filter(e => e.phase === "Remediate");
  const actions = [
    { type:"Kill-Switch",    target:"bedrock-agent-executor-03",   reason:"Lateral movement attempt — PII Database", sev:"critical", time:"5:47", done:true  },
    { type:"Orphan purge",   target:"michael.torres",reason:"Inactive 180d · Admin + PII access",       sev:"high",     time:"4:02", done:true  },
    { type:"Toxic link",     target:"etl-runner → pii-db", reason:"Create + approve Finance API",       sev:"high",     time:"3:18", done:true  },
    { type:"Rightsizing",    target:"mlops-v3",        reason:"Admin usage 4/100 — scoped to Read",     sev:"medium",   time:"6:44", done:false },
  ];
  const sevC: Record<string,{bg:string;c:string}> = { critical:{bg:"#fee2e2",c:"#991b1b"}, high:{bg:"#ffedd5",c:"#9a3412"}, medium:{bg:"#fef3c7",c:"#92400e"} };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
        {[
          { label:"Actions automated this session", val:"3",      color:"#f59e0b", sub:"Kill-Switch + purge + toxic link" },
          { label:"Avg response time",              val:"340ms",  color:"#34d399", sub:"Detection to resolution" },
          { label:"Human review needed",            val:"1",      color:"#f59e0b", sub:"Rightsizing: mlops-v3" },
          { label:"Risk delta this session",        val:"−71",    color:"#34d399", sub:"Risk score: 94 → 23" },
        ].map(k=>(
          <Card key={k.label} style={{ padding:"1rem" }}>
            <div style={{ fontSize:"1.75rem", fontWeight:800, color:k.color, lineHeight:1, marginBottom:"0.25rem" }}>{k.val}</div>
            <div style={{ fontSize:"0.75rem", fontWeight:600, color:S.soft, marginBottom:"0.2rem" }}>{k.label}</div>
            <div style={{ fontSize:"0.7rem", color:S.muted }}>{k.sub}</div>
          </Card>
        ))}
      </div>
      {/* Action log */}
      <Card>
        <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Autonomous remediation log</span>
            <span style={{ fontSize:"0.75rem", color:"#f59e0b", marginLeft:"0.75rem", fontWeight:600 }}>● Kill-Switch armed</span>
          </div>
          <div style={{ display:"flex", gap:"0.375rem" }}>
            <Btn onClick={()=>dlCSV("remediation.csv",actions.map(a=>({type:a.type,target:a.target,reason:a.reason,severity:a.sev,time:a.time,status:a.done?"done":"pending"})))} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
            <Btn onClick={()=>dlTXT("remediation-report.txt",actions.map(a=>`[${a.time}] ${a.type} — ${a.target}\nReason: ${a.reason}\nSeverity: ${a.sev} | Status: ${a.done?"done":"pending"}`).join("\n\n"))} variant="ghost" size="xs"><FileText style={{width:11,height:11}}/> Report</Btn>
          </div>
        </div>
        <div style={{ padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:"0.625rem" }}>
          {actions.map((a,i)=>(
            <div key={i} style={{ padding:"0.875rem 1.25rem", border:`1px solid ${a.done?"rgba(255,255,255,0.06)":"rgba(245,158,11,0.25)"}`, borderRadius:10, backgroundColor:a.done?"rgba(255,255,255,0.02)":"rgba(245,158,11,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}>
                <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"2px 8px", borderRadius:9999, background:sevC[a.sev].bg, color:sevC[a.sev].c }}>{a.type}</span>
                <span style={{ fontSize:"0.875rem", fontWeight:600, color:S.text, flex:1 }}>{a.target}</span>
                <span style={{ fontSize:"0.8125rem", fontWeight:600, color:a.done?"#34d399":"#f59e0b" }}>{a.done?"✓ Resolved":"⏳ Pending"}</span>
                <span style={{ fontSize:"0.72rem", color:S.muted }}>{a.time}</span>
              </div>
              <div style={{ fontSize:"0.8125rem", color:S.muted }}>{a.reason}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Monitor phase view ───────────────────────────────────────────
function MonitorView() {
  const standards = [
    { name:"PCI DSS 4.0",     pct:97, color:"#34d399" },
    { name:"SOC 2 Type II",   pct:94, color:"#34d399" },
    { name:"HIPAA § 164.312", pct:78, color:"#f59e0b" },
  ];
  const reportTxt = `UNKOV PILOT EVIDENCE REPORT
Generated: ${new Date().toISOString()}
Organization: Acme Financial Corp (Pilot Environment)

PILOT SUMMARY
─────────────────────────────────────────
Risk score at deployment start : 88/100
Risk score now                 : 23/100
Risk reduction                 : 65 points (−74%)
Time to live dashboard         : < 30 minutes
Identities governed            : 1,247

WHAT WAS FOUND
─────────────────────────────────────────
47 ghost bots with Admin scope — invisible to existing IAM
12 orphan accounts (ex-employees with active credentials)
4 toxic combinations (create + approve same resource)
146 AI agents with no policy coverage

WHAT WAS DONE (AUTONOMOUSLY)
─────────────────────────────────────────
Kill-Switch: bedrock-agent-executor-03 lateral move blocked in 340ms
Orphan purge: michael.torres deprovisioned (Admin + PII)
Toxic link: etl-runner → pii-db revoked
Rights-sized: mlops-v3 Admin → Read-only

COMPLIANCE EVIDENCE
─────────────────────────────────────────
PCI DSS 4.0  : 97% controls passing
SOC 2 Type II: 94% controls passing
HIPAA        : 78% controls passing (Patient Data Lineage Q3 2026)
Log entries  : 14,382
Policy checks: 8,241
Hours saved  : 94 hrs vs 120h manual baseline

THIS REPORT IS ADMISSIBLE AS COMPLIANCE EVIDENCE
Auto-generated by Unkov — no manual assembly required
info@unkov.com | unkov.com | Confidential
`;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* Risk reduction highlight */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <Card style={{ padding:"1.5rem", textAlign:"center" as const }}>
          <div style={{ fontSize:"0.7rem", color:S.muted, textTransform:"uppercase" as const, letterSpacing:"0.1em", marginBottom:"0.75rem" }}>Identity Drift score</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"1.25rem", marginBottom:"0.75rem" }}>
            <div>
              <div style={{ fontSize:"2.5rem", fontWeight:800, color:"#ef4444", letterSpacing:"-0.04em" }}>88</div>
              <div style={{ fontSize:"0.72rem", color:S.muted }}>At deployment</div>
            </div>
            <div style={{ fontSize:"1.5rem", color:S.muted }}>→</div>
            <div>
              <div style={{ fontSize:"2.5rem", fontWeight:800, color:"#34d399", letterSpacing:"-0.04em" }}>23</div>
              <div style={{ fontSize:"0.72rem", color:"#34d399" }}>Now · Low risk</div>
            </div>
          </div>
          <div style={{ padding:"0.5rem 1rem", backgroundColor:"rgba(52,211,153,0.1)", borderRadius:9999, border:"1px solid rgba(52,211,153,0.25)", display:"inline-block" }}>
            <span style={{ fontSize:"0.875rem", fontWeight:700, color:"#34d399" }}>↓ 74% risk reduction this session</span>
          </div>
        </Card>
        <Card>
          <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}` }}>
            <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Session impact</span>
          </div>
          <div style={{ padding:"0.875rem 1.25rem" }}>
            {[["Identities governed","1,247"],["Actions automated","312"],["Hours saved today","847 hrs"],["Cost avoided","$4.2M est."],["Log entries collected","48,291"]].map(([l,v])=>(
              <div key={l as string} style={{ display:"flex", justifyContent:"space-between", padding:"0.5rem 0", borderBottom:`1px solid ${S.border}` }}>
                <span style={{ fontSize:"0.8125rem", color:S.soft }}>{l as string}</span>
                <span style={{ fontSize:"0.875rem", fontWeight:700, color:"#34d399" }}>{v as string}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Compliance posture */}
      <Card>
        <div style={{ padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>Compliance posture</span>
            <span style={{ fontSize:"0.75rem", color:"#059669", marginLeft:"0.75rem", fontWeight:600 }}>● Continuous evidence collection</span>
          </div>
          <div style={{ display:"flex", gap:"0.375rem" }}>
            <Btn onClick={()=>dlCSV("compliance-posture.csv",standards.map(s=>({standard:s.name,passing:`${s.pct}%`})))} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
            <Btn onClick={()=>dlTXT("pilot-evidence-report.txt",reportTxt)} variant="success" size="xs"><FileText style={{width:11,height:11}}/> Download evidence report</Btn>
          </div>
        </div>
        <div style={{ padding:"1rem 1.25rem" }}>
          {standards.map(s=>(
            <div key={s.name} style={{ marginBottom:"1.125rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
                <span style={{ fontSize:"0.9375rem", color:S.text, fontWeight:500 }}>{s.name}</span>
                <span style={{ fontSize:"0.875rem", fontWeight:700, color:s.color }}>{s.pct}% controls passing</span>
              </div>
              <div style={{ height:7, backgroundColor:"rgba(255,255,255,0.06)", borderRadius:9999 }}>
                <div style={{ height:"100%", width:`${s.pct}%`, backgroundColor:s.color, borderRadius:9999, transition:"width .7s" }}/>
              </div>
            </div>
          ))}
          <div style={{ padding:"1rem", backgroundColor:"rgba(52,211,153,0.08)", borderRadius:10, border:"1px solid rgba(52,211,153,0.2)", marginTop:"0.5rem" }}>
            <div style={{ fontSize:"0.875rem", fontWeight:600, color:"#34d399", marginBottom:"0.375rem" }}>One-click export ready</div>
            <div style={{ fontSize:"0.8125rem", color:S.muted, lineHeight:1.6, marginBottom:"0.75rem" }}>Full evidence package — timestamped logs, identity records, policy audit trail. Admissible for PCI DSS, SOC 2, and HIPAA audits. Generated automatically during this session — no manual assembly.</div>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              <Btn onClick={()=>dlTXT("pilot-evidence-report.txt",reportTxt)} variant="success" size="sm"><FileText style={{width:12,height:12}}/> Download full evidence report</Btn>
              <Btn onClick={()=>dlJSON("pilot-evidence.json",{riskScore:{start:88,end:23},identities:DEMO_IDENTITIES,auditLog:DEMO_EVENTS,compliance:standards})} variant="default" size="sm"><Download style={{width:12,height:12}}/> Export JSON</Btn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Locked preview content ───────────────────────────────────────
function AuditPreview() {
  return (
    <div style={{ padding:"1rem 1.25rem", pointerEvents:"none" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.8125rem" }}>
        <thead><tr style={{ borderBottom:`1px solid ${S.border}` }}>{["Timestamp","Action","Target","Phase","Outcome","Confidence"].map(h=><th key={h} style={{ padding:"0.5rem 0.875rem", textAlign:"left", color:S.muted, fontWeight:600, fontSize:"0.7rem", textTransform:"uppercase" as const }}>{h}</th>)}</tr></thead>
        <tbody>
          {[["2026-03-22 14:32:11","Orphan purge","michael.torres","Remediate","purged","99%"],["2026-03-22 14:29:05","Lateral move blocked","bedrock-agent-executor-03","Remediate","blocked","97%"],["2026-03-22 14:21:18","Peer-clone provision","sarah.chen","Analyze","approved","97%"]].map((r,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${S.border}` }}>
              {r.map((v,j)=><td key={j} style={{ padding:"0.625rem 0.875rem", color:S.muted }}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function PolicyPreview() {
  return (
    <div style={{ padding:"1rem 1.25rem", pointerEvents:"none" }}>
      {[["P-ORPHAN-90D","Orphan auto-purge","Remediate",true,47],["P-PEER-CLONE","Peer-clone provisioning","Analyze",true,189]].map(([id,name,cat,active,fired])=>(
        <div key={id as string} style={{ display:"flex", gap:"0.75rem", alignItems:"center", padding:"0.625rem 0", borderBottom:`1px solid ${S.border}` }}>
          <div style={{ width:30,height:16,borderRadius:9999,backgroundColor:(active as boolean)?"#34d399":"rgba(255,255,255,0.1)" }}/>
          <span style={{ fontFamily:"monospace",fontSize:"0.72rem",color:S.muted,width:120,flexShrink:0 }}>{id as string}</span>
          <span style={{ flex:1,fontSize:"0.8125rem",color:S.text }}>{name as string}</span>
          <Badge color={phaseColor[cat as string]}>{cat as string}</Badge>
          <span style={{ fontSize:"0.8125rem",color:"#60a5fa",fontWeight:600 }}>{String(fired)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Upgrade CTA banner ───────────────────────────────────────────
function UpgradeBanner() {
  return (
    <div style={{ margin:"0 0 1.25rem", padding:"1.25rem 1.5rem", background:"linear-gradient(135deg, rgba(0,41,122,0.4) 0%, rgba(0,97,212,0.2) 100%)", border:"1px solid rgba(0,97,212,0.35)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
      <div>
        <div style={{ fontSize:"0.9375rem", fontWeight:700, color:"#f1f5f9", marginBottom:"0.25rem" }}>You're seeing 1 of 9 tabs — this is your environment.</div>
        <div style={{ fontSize:"0.8125rem", color:S.soft }}>Sign a contract to unlock Analyze · Remediate · Monitor · Audit trail · Policies · Integrations · Incidents · ROI &amp; MSP.</div>
      </div>
      <div style={{ display:"flex", gap:"0.5rem", flexShrink:0 }}>
        <Btn variant="cta" size="md" onClick={()=>navigate("/early-access")}>
          Get full access <ChevronRight style={{width:14,height:14}}/>
        </Btn>
        <Btn variant="ghost" size="sm" onClick={()=>navigate("/contact")}>Talk to us</Btn>
      </div>
    </div>
  );
}

// ─── Main demo dashboard ──────────────────────────────────────────
const DEMO_TABS = [
  { id:"discover",    label:"Discover",     icon:Search,          locked:false, phase:"discover"  },
  { id:"analyze",     label:"Analyze",      icon:Zap,             locked:true,  phase:""          },
  { id:"remediate",   label:"Remediate",    icon:Shield,          locked:true,  phase:""          },
  { id:"monitor",     label:"Monitor",      icon:CheckCircle,     locked:true,  phase:""          },
  { id:"audit",       label:"Audit trail",  icon:FileText,        locked:true,  phase:""          },
  { id:"policies",    label:"Policies",     icon:Settings as any, locked:true,  phase:""          },
  { id:"integrations",label:"Integrations", icon:ExternalLink,    locked:true,  phase:""          },
  { id:"incidents",   label:"Incidents",    icon:AlertTriangle,   locked:true,  phase:""          },
  { id:"roi",         label:"ROI & MSP",    icon:TrendingDown,    locked:true,  phase:""          },
];

const LOCK_REASONS: Record<string,string> = {
  audit:        "The full searchable audit trail — every automated action with policy reference, risk delta, confidence score, and full reasoning chain — is available from day one of your contract. This is the document your auditors will ask for.",
  policies:     "All 8 autonomous governance policies — Orphan purge, Peer-Clone, Kill-Switch, Toxic Combination, Identity Heartbeat, and more — are fully configurable once you sign. You own your governance rules.",
  integrations: "Live connector status for Okta, AWS IAM, Azure AD, SailPoint, CrowdStrike, and Splunk — with sync controls, error details, and config export. Visible from day one of your contract.",
  incidents:    "Full incident timeline with per-event phase attribution, auto-generated board report, and SIEM import. Everything your CISO needs for post-incident reporting — ready on contract.",
  roi:          "Your real ROI numbers — hours saved this quarter, incident cost avoidance, and the 5-year projection — calculated from your actual environment data. Plus the MSP multi-tenant console. Unlocked on contract.",
};

export default function DemoDashboard() {
  const [tab, setTab] = useState("discover");
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [startTime] = useState(() => Date.now());
  const [events, setEvents] = useState<typeof DEMO_EVENTS>([]);
  const [eventIdx, setEventIdx] = useState(0);

  // Drip-feed events every few seconds for live feel
  useEffect(() => {
    if (eventIdx >= DEMO_EVENTS.length) return;
    const delay = eventIdx === 0 ? 1200 : 2800 + Math.random() * 1400;
    const id = setTimeout(() => {
      setEvents(prev => [...prev, DEMO_EVENTS[eventIdx]]);
      setEventIdx(i => i + 1);
    }, delay);
    return () => clearTimeout(id);
  }, [eventIdx]);

  const activePhase = (() => {
    const last = events[events.length - 1];
    if (!last) return "discover";
    return last.phase.toLowerCase();
  })();

  const lockedViews: Record<string,React.ReactNode> = {
    audit:        <LockedView tabLabel="Audit trail" unlockReason={LOCK_REASONS.audit}        preview={<AuditPreview/>}/>,
    policies:     <LockedView tabLabel="Policy engine" unlockReason={LOCK_REASONS.policies}   preview={<PolicyPreview/>}/>,
    integrations: <LockedView tabLabel="Integration health" unlockReason={LOCK_REASONS.integrations}/>,
    incidents:    <LockedView tabLabel="Incident timeline" unlockReason={LOCK_REASONS.incidents}/>,
    roi:          <LockedView tabLabel="ROI calculator & MSP console" unlockReason={LOCK_REASONS.roi}/>,
  };

  const activeViews: Record<string,React.ReactNode> = {
    discover:  <DiscoverView   events={events}/>,
    analyze:   <AnalyzeView/>,
    remediate: <RemediateView  events={events}/>,
    monitor:   <MonitorView/>,
  };

  const currentTab = DEMO_TABS.find(t => t.id === tab)!;

  return (
    <div className="min-h-screen" style={{ backgroundColor:S.bg, color:S.text }}>
      <Header/>
      <div style={{ paddingTop:68, minHeight:"100vh" }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.75rem 2rem", borderBottom:`1px solid ${S.border}`, flexWrap:"wrap", gap:"0.75rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
              <div style={{ fontSize:"0.72rem", color:S.muted, textTransform:"uppercase" as const, letterSpacing:"0.12em" }}>Identity Command Center</div>
              <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"2px 8px", borderRadius:9999, backgroundColor:"rgba(0,97,212,0.2)", color:"#60a5fa", border:"1px solid rgba(0,97,212,0.35)" }}>PILOT MODE</span>
              <span style={{ display:"flex", alignItems:"center", gap:"0.3rem", fontSize:"0.7rem", fontWeight:700, padding:"2px 8px", borderRadius:9999, backgroundColor:"rgba(52,211,153,0.15)", color:"#34d399", border:"1px solid rgba(52,211,153,0.3)" }}><span style={{ width:5, height:5, borderRadius:"50%", backgroundColor:"#34d399", display:"inline-block", animation:"pulse2 2s infinite" }}/> Live</span>
            </div>
            <h1 style={{ fontSize:"1.25rem", fontWeight:800, color:"#f1f5f9", marginTop:2 }}>Acme Financial Corp</h1>
          </div>
          <PhaseStepper activePhase={activePhase}/>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <DeployTimer startTime={startTime}/>
            <Btn onClick={()=>dlCSV("pilot-identities.csv", DEMO_IDENTITIES.map(id=>({id:id.id,name:id.name,type:id.type,dept:id.dept,risk:id.risk,status:id.status,lastActive:id.lastActive,accessCount:id.accessCount})))} variant="default" size="sm">
              <Download style={{width:11,height:11}}/> CSV
            </Btn>
            <Btn onClick={()=>dlJSON("pilot-export.json", {identities:DEMO_IDENTITIES,auditLog:DEMO_EVENTS,accessDecisions:DEMO_ACCESS,exportedAt:new Date().toISOString()})} variant="default" size="sm">
              <Download style={{width:11,height:11}}/> JSON
            </Btn>
            <div style={{ width:1, height:20, backgroundColor:"rgba(255,255,255,0.1)" }}/>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Btn onClick={()=>navigate("/admin/upgrade")} variant="default" size="sm">Admin</Btn>
                )}
                <Btn onClick={()=>navigate("/early-access")} variant="cta" size="md">
                  Unlock full access <ChevronRight style={{width:13,height:13}}/>
                </Btn>
                <Btn onClick={()=>navigate("/")} variant="ghost" size="sm">← Home</Btn>
                <Btn onClick={async()=>{await logout();navigate("/login");}} variant="default" size="sm">Sign out</Btn>
              </>
            ) : (
              <>
                <Btn onClick={()=>navigate("/")} variant="ghost" size="sm">← Home</Btn>
                <Btn onClick={()=>navigate("/login")} variant="primary" size="sm">Sign in</Btn>
              </>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", padding:"0 2rem", borderBottom:`1px solid ${S.border}`, overflowX:"auto" }}>
          {DEMO_TABS.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            const isLocked = t.locked;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0.75rem 1rem", fontSize:"0.875rem", fontWeight:600, color:isActive?"#60a5fa":isLocked?"#334155":S.muted, border:"none", borderBottom:`2px solid ${isActive?"#60a5fa":"transparent"}`, background:"none", cursor:"pointer", whiteSpace:"nowrap", transition:"color .15s, border-color .15s", opacity:isLocked?0.6:1 }}>
                {isLocked
                  ? <LockIcon style={{width:11,height:11,color:"#334155"}}/>
                  : <Icon style={{width:13,height:13}}/>
                }
                {t.label}
                {isLocked && <span style={{ fontSize:"0.65rem", fontWeight:700, padding:"1px 5px", borderRadius:4, backgroundColor:"rgba(0,97,212,0.15)", color:"#60a5fa", marginLeft:2 }}>Contract</span>}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ padding:"1.5rem 2rem" }}>
          <UpgradeBanner/>
          {currentTab.locked
            ? lockedViews[tab]
            : activeViews[tab]
          }
        </div>
      </div>
      <Footer/>
      <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
