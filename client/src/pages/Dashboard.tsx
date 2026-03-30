import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Shield, Users, Bot, AlertTriangle, Clock,  Settings, Download, Upload, Search, ChevronDown, CheckCircle, FileText, Lock, Zap, Eye, X, ArrowUpRight, ArrowDownRight, ExternalLink, Activity, TrendingDown, Plus, RefreshCw, Terminal, Globe, Filter } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface Identity {
  id: string; type: "human"|"bot"|"ai_agent"|"service"|"orphan";
  name: string; dept: string; risk: number; lastActive: string;
  status: "active"|"suspended"|"orphan"|"flagged";
  accessCount: number; permissions: string[];
}
interface AuditEntry {
  id: string; timestamp: string; action: string; target: string;
  actor: string; phase: string;
  outcome: "approved"|"blocked"|"escalated"|"purged"|"scoped";
  policy: string; riskDelta: number; confidence: number;
}
interface Incident {
  id: string; title: string; severity: "critical"|"high"|"medium";
  status: "active"|"resolved";
  timeline: { time: string; event: string; phase: string }[];
  identitiesAffected: string[]; detectedAt: string; resolvedAt?: string;
}
interface Policy {
  id: string; name: string; trigger: string; action: string;
  active: boolean; fired: number; category: string;
  threshold?: string; notify?: string;
}
interface Integration {
  name: string; type: string; status: "healthy"|"warning"|"error";
  lastSync: string; records: number|null; errors: number;
  latency: string; icon: string; region?: string; version?: string;
}

// ─── Static data ─────────────────────────────────────────────────
const IDENTITIES: Identity[] = [
  { id:"ID-001", type:"human",    name:"sarah.chen",              dept:"Security",           risk:12, lastActive:"2m ago",    status:"active",  accessCount:24, permissions:["Security Console","Audit Logs","Risk Dashboard","SIEM"] },
  { id:"ID-002", type:"ai_agent", name:"ai-clinical-doc-01",      dept:"Clinical Info",      risk:91, lastActive:"4m ago",    status:"flagged", accessCount:147,permissions:["EHR System","PHI Database","HL7 Gateway","Patient Records","Imaging"] },
  { id:"ID-003", type:"ai_agent", name:"bedrock-agent-executor-03",dept:"ML/AI",             risk:94, lastActive:"1m ago",    status:"flagged", accessCount:203,permissions:["AdministratorAccess","S3 Full","DynamoDB Full","Lambda Full","EC2 Full"] },
  { id:"ID-004", type:"service",  name:"svc-payment-processor",   dept:"Finance",            risk:97, lastActive:"8m ago",    status:"flagged", accessCount:34, permissions:["SUPER_ADMIN","APP_ACCESS_PAYROLL","Finance API","Billing Gateway"] },
  { id:"ID-005", type:"orphan",   name:"michael.torres",          dept:"IT Operations",      risk:88, lastActive:"14d ago",   status:"orphan",  accessCount:18, permissions:["Cloud Admin","VPN","Network Config","Firewall Rules"] },
  { id:"ID-006", type:"orphan",   name:"ghost-svc-legacy-app",    dept:"Unknown",            risk:96, lastActive:"210d ago",  status:"orphan",  accessCount:7,  permissions:["AdministratorAccess","PII Database","Secrets Vault","KMS Keys"] },
  { id:"ID-007", type:"ai_agent", name:"ai-agent-copilot-08",     dept:"Engineering",        risk:89, lastActive:"2m ago",    status:"flagged", accessCount:88, permissions:["ORG_ADMIN","Source Repo","Production Secrets","GitHub Actions"] },
  { id:"ID-008", type:"service",  name:"svc-ehr-integration",     dept:"Clinical Info",      risk:95, lastActive:"6m ago",    status:"flagged", accessCount:52, permissions:["SUPER_ADMIN","APP_ACCESS_PHI","EHR Write","Patient Portal Admin"] },
  { id:"ID-009", type:"human",    name:"james.park",              dept:"Engineering",        risk:8,  lastActive:"5m ago",    status:"active",  accessCount:31, permissions:["Source Repo","Dev Cluster","VPN Group A","CI/CD Pipeline"] },
  { id:"ID-010", type:"bot",      name:"svc-payment-processor",     dept:"Data",               risk:74, lastActive:"180d ago",  status:"orphan",  accessCount:4,  permissions:["AmazonRDSFullAccess","DynamoDB Full","S3 Full"] },
  { id:"ID-011", type:"service",  name:"svc-audit-log-mgr",       dept:"Compliance",         risk:93, lastActive:"11m ago",   status:"flagged", accessCount:28, permissions:["READ_WRITE_PHI","AUDIT_LOG_ADMIN","Compliance Export","Evidence Store"] },
  { id:"ID-012", type:"orphan",   name:"jennifer.walsh",          dept:"Finance",            risk:82, lastActive:"104d ago",  status:"orphan",  accessCount:12, permissions:["Payroll System","Finance API","Budget Reports","AP Workflow"] },
  { id:"ID-013", type:"ai_agent", name:"ai-prior-auth-04",        dept:"Revenue Cycle",      risk:41, lastActive:"9m ago",    status:"active",  accessCount:76, permissions:["Claims System","Prior Auth API","Insurance Gateway","Patient Data"] },
  { id:"ID-014", type:"human",    name:"priya.sharma",            dept:"Security",           risk:5,  lastActive:"12m ago",   status:"active",  accessCount:18, permissions:["Audit Logs","Security Reports","Risk Dashboard","Compliance DB"] },
  { id:"ID-015", type:"service",  name:"svc-data-pipeline-007",   dept:"Data",               risk:38, lastActive:"3m ago",    status:"active",  accessCount:22, permissions:["S3 Read","DynamoDB Read","Kinesis","Glue ETL"] },
  { id:"ID-016", type:"orphan",   name:"richard.powell",          dept:"IT Operations",      risk:79, lastActive:"127d ago",  status:"orphan",  accessCount:9,  permissions:["Cloud Admin","Infra Config","Network Access","Server Management"] },
  { id:"ID-017", type:"ai_agent", name:"azure-openai-service",    dept:"Clinical Info",      risk:33, lastActive:"1m ago",    status:"active",  accessCount:441,permissions:["MANAGED_IDENTITY","Cognitive Services","OpenAI API","Storage Read"] },
  { id:"ID-018", type:"bot",      name:"svc-ci-pipeline-user",    dept:"Engineering",        risk:88, lastActive:"45d ago",   status:"flagged", accessCount:6,  permissions:["S3 Full","EC2 ReadOnly","Access Key — 95d old"] },
  { id:"ID-019", type:"human",    name:"elena.rodriguez",         dept:"Finance",            risk:7,  lastActive:"18m ago",   status:"active",  accessCount:19, permissions:["Finance DB","Budget View","Expense Reports","Payroll View"] },
  { id:"ID-020", type:"service",  name:"lambda-fhir-gateway-3",   dept:"Clinical Info",      risk:4,  lastActive:"2m ago",    status:"active",  accessCount:8,  permissions:["AWSLambdaBasicExecutionRole","DynamoDB Read","S3 Read"] },
];

const AUDIT_LOG: AuditEntry[] = [
  { id:"A-1001", timestamp:"2026-03-22 14:32:11", action:"Toxic combo blocked",        target:"svc-payment-processor",          actor:"Unkov Auto",   phase:"Remediate", outcome:"blocked",   policy:"P-TOXIC-COMBO",    riskDelta:-31, confidence:99  },
  { id:"A-1002", timestamp:"2026-03-22 14:29:05", action:"AI agent access denied",     target:"bedrock-agent-03 → PHI DB",      actor:"Unkov Auto",   phase:"Remediate", outcome:"blocked",   policy:"P-LATERAL-001",    riskDelta:0,   confidence:99  },
  { id:"A-1003", timestamp:"2026-03-22 14:22:44", action:"Ghost account flagged",      target:"michael.torres (14d departed)",  actor:"Unkov Auto",   phase:"Discover",  outcome:"escalated", policy:"P-ORPHAN-90D",     riskDelta:0,   confidence:100 },
  { id:"A-1004", timestamp:"2026-03-22 14:18:09", action:"Stale key alert",            target:"svc-ci-pipeline (95d key)",      actor:"Unkov Auto",   phase:"Analyze",   outcome:"escalated", policy:"P-CRED-ROTATE",    riskDelta:22,  confidence:99  },
  { id:"A-1005", timestamp:"2026-03-22 14:09:44", action:"PHI access revoked",         target:"svc-ehr-integration Admin→Read", actor:"Unkov Auto",   phase:"Remediate", outcome:"scoped",    policy:"P-PHI-GOVERN",     riskDelta:-28, confidence:97  },
  { id:"A-1006", timestamp:"2026-03-22 13:58:02", action:"HIPAA evidence snapshot",    target:"§164.312 controls — 1,247 ids",  actor:"Unkov Monitor",phase:"Monitor",   outcome:"approved",  policy:"P-HIPAA-COLLECT",  riskDelta:0,   confidence:100 },
  { id:"A-1007", timestamp:"2026-03-22 13:45:30", action:"AI admin revoke",            target:"ai-agent-copilot-08 → ORG_ADMIN",actor:"Unkov Auto",   phase:"Remediate", outcome:"blocked",   policy:"P-UNGOV-AI",       riskDelta:-34, confidence:98  },
  { id:"A-1008", timestamp:"2026-03-22 13:31:17", action:"Orphan purge queued",        target:"134 orphaned identities",        actor:"Unkov Auto",   phase:"Remediate", outcome:"escalated", policy:"P-ORPHAN-90D",     riskDelta:-44, confidence:100 },
  { id:"A-1009", timestamp:"2026-03-22 13:15:22", action:"Identity scan completed",    target:"1,247 identities — 4 sources",   actor:"Unkov Engine", phase:"Discover",  outcome:"approved",  policy:"P-SCAN-6H",        riskDelta:-8,  confidence:100 },
  { id:"A-1010", timestamp:"2026-03-22 12:44:09", action:"CISO escalation",            target:"svc-audit-log-mgr (PHI+audit)",  actor:"Unkov Gate",   phase:"Analyze",   outcome:"escalated", policy:"P-ESCALATE",       riskDelta:12,  confidence:94  },
  { id:"A-1011", timestamp:"2026-03-22 12:01:55", action:"Workday sync",               target:"12 terminated — accounts live",  actor:"Unkov Engine", phase:"Discover",  outcome:"escalated", policy:"P-OFFBOARD-SYNC",  riskDelta:18,  confidence:100 },
  { id:"A-1012", timestamp:"2026-03-22 11:22:40", action:"PCI DSS 4.0 evidence",       target:"Req 7 & 8 — 1,247 ids audited",  actor:"Unkov Monitor",phase:"Monitor",   outcome:"approved",  policy:"P-PCI-COLLECT",    riskDelta:0,   confidence:100 },
];

const INCIDENTS: Incident[] = [
  {
    id:"INC-001", title:"AI agent bedrock-agent-executor-03 attempted lateral movement to PHI Database — HIPAA §164.312 violation",
    severity:"critical", status:"active",
    timeline:[
      { time:"14:27:01", event:"Identity graph detected anomalous traversal — ai agent outside normal resource scope for its department", phase:"Discover" },
      { time:"14:27:03", event:"Intent Engine scored risk delta +42 — 94th percentile for this agent type in this department", phase:"Analyze" },
      { time:"14:27:04", event:"Identity Gate blocked verified token issuance — access denied in 340ms before any data was accessed", phase:"Remediate" },
      { time:"14:27:05", event:"Agent scope reduced Admin → Read-only automatically by Autonomous Remediation engine", phase:"Remediate" },
      { time:"14:27:06", event:"CISO alert dispatched via Slack #security-critical and email", phase:"Monitor" },
      { time:"14:32:11", event:"Pending CISO review — agent quarantined, no data accessed, full audit trail available", phase:"Monitor" },
    ],
    identitiesAffected:["bedrock-agent-executor-03","phi-database-svc"], detectedAt:"14:27:01",
  },
  {
    id:"INC-002", title:"12 departed employees have live accounts — oldest: lauren.simmons, 182 days post-termination",
    severity:"high", status:"resolved",
    timeline:[
      { time:"14:30:00", event:"Scheduled Discover scan: account last active 180 days ago — orphan threshold exceeded", phase:"Discover" },
      { time:"14:30:01", event:"Cross-referenced HR offboarding records — employee departed 182 days ago, account never deprovisioned", phase:"Analyze" },
      { time:"14:30:02", event:"Autonomous purge executed — all credentials revoked, account deactivated in 1 action", phase:"Remediate" },
      { time:"14:30:03", event:"Immutable audit entry logged with full evidence chain for SOC 2 and PCI DSS", phase:"Monitor" },
    ],
    identitiesAffected:["michael.torres"], detectedAt:"14:30:00", resolvedAt:"14:30:03",
  },
  {
    id:"INC-003", title:"Toxic combination: svc-payment-processor holds SUPER_ADMIN + APP_ACCESS_PAYROLL — payment fraud risk",
    severity:"high", status:"resolved",
    timeline:[
      { time:"13:09:44", event:"Graph analysis detected svc-payment-processor can both create and approve Finance API transactions", phase:"Analyze" },
      { time:"13:09:45", event:"Classified as Toxic Combination — single identity can commit fraud without oversight", phase:"Analyze" },
      { time:"13:09:46", event:"Lower-privilege permission (approve) automatically revoked — create access retained", phase:"Remediate" },
      { time:"13:09:47", event:"Finance team lead notified, audit snapshot saved to compliance evidence store", phase:"Monitor" },
    ],
    identitiesAffected:["svc-payment-processor"], detectedAt:"13:09:44", resolvedAt:"13:09:47",
  },
];

const INITIAL_POLICIES: Policy[] = [
  { id:"P-ORPHAN-90D",  name:"Orphan auto-purge",        trigger:"Account inactive > 90 days",              action:"Purge credentials + deactivate",         active:true,  fired:47, category:"Remediate", threshold:"90 days",  notify:"CISO" },
  { id:"P-LATERAL-001", name:"Lateral movement block",   trigger:"Identity accesses non-peer resource",     action:"Block + alert CISO",                     active:true,  fired:12, category:"Remediate", threshold:"Risk Δ>25",notify:"CISO, Manager" },
  { id:"P-PEER-CLONE",  name:"Peer-clone provisioning",  trigger:"New hire or role change request",         action:"Provision from peer median access",       active:true,  fired:189,category:"Analyze",  threshold:"80% match", notify:"IT Lead" },
  { id:"P-TOXIC-COMBO", name:"Toxic combination revoke", trigger:"Create + Approve same resource",          action:"Revoke lower-risk permission",            active:true,  fired:8,  category:"Remediate", threshold:"Any",      notify:"Manager, Audit" },
  { id:"P-HEARTBEAT",   name:"Identity Heartbeat",       trigger:"Usage < 20% of provisioned access",       action:"Scope to actual usage pattern",           active:true,  fired:23, category:"Analyze",  threshold:"30 day avg",notify:"Owner" },
  { id:"P-CROSS-DEPT",  name:"Cross-dept access gate",   trigger:"Bot/agent cross-department request",      action:"Block + escalate to manager",             active:true,  fired:34, category:"Remediate", threshold:"Any NHI",  notify:"Manager" },
  { id:"P-ESCALATE",    name:"CISO escalation",          trigger:"Risk delta > 35 on single action",        action:"Pause + route to CISO queue",             active:true,  fired:6,  category:"Monitor",  threshold:"Risk Δ>35",notify:"CISO" },
  { id:"P-CRED-ROTATE", name:"Credential rotation",      trigger:"Service account > 90d without rotation",  action:"Force rotation + notify owner",           active:false, fired:0,  category:"Remediate", threshold:"90 days",  notify:"Owner, IT" },
];

const INTEGRATIONS: Integration[] = [
  { name:"Okta",               type:"Identity Provider", status:"healthy",  lastSync:"43s ago",  records:420,  errors:0, latency:"88ms",  icon:"O",  region:"us-east-1",  version:"3.12.1"  },
  { name:"AWS IAM",            type:"Cloud IAM",         status:"healthy",  lastSync:"1m ago",   records:487,  errors:0, latency:"124ms", icon:"A",  region:"us-east-1",  version:"2024-11" },
  { name:"Microsoft Entra ID", type:"Directory",         status:"healthy",  lastSync:"2m ago",   records:180,  errors:0, latency:"201ms", icon:"Z",  region:"westus2",    version:"2.0"     },
  { name:"Workday",            type:"HR System",         status:"healthy",  lastSync:"4m ago",   records:1247, errors:0, latency:"344ms", icon:"W",  region:"us-east-1",  version:"v40.0"   },
  { name:"GitHub",             type:"Developer Tools",   status:"healthy",  lastSync:"2m ago",   records:84,   errors:0, latency:"112ms", icon:"G",  region:"us-east-1",  version:"2022-11" },
];

const TENANTS = [
  { id:"T-001", name:"Meridian Health Systems", industry:"Healthcare",   employees:4200,  identities:22800, risk:71, status:"warning",  orphans:134, ai_agents:146, incidents:4, mrr:7500  },
  { id:"T-002", name:"First National Bancorp",  industry:"Banking",      employees:8400,  identities:47200, risk:44, status:"warning",  orphans:287, ai_agents:312, incidents:2, mrr:12400 },
  { id:"T-003", name:"Summit Insurance Group",  industry:"Insurance",    employees:2800,  identities:11400, risk:38, status:"healthy",  orphans:64,  ai_agents:88,  incidents:1, mrr:4800  },
  { id:"T-004", name:"NeuroPath Diagnostics",   industry:"Healthcare",   employees:1100,  identities:5800,  risk:82, status:"critical", orphans:98,  ai_agents:44,  incidents:6, mrr:3200  },
  { id:"T-005", name:"Cascade Capital Mgmt",    industry:"Finance",      employees:640,   identities:3200,  risk:55, status:"warning",  orphans:41,  ai_agents:127, incidents:1, mrr:2100  },
];

// ─── Design tokens ───────────────────────────────────────────────
const S = {
  bg:"#0a0f1e", panel:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.07)",
  text:"#e2e8f0", muted:"#64748b", soft:"#94a3b8",
};
const typeColor: Record<string,string> = { human:"#0061d4",bot:"#f59e0b",ai_agent:"#7c3aed",service:"#6b7280",orphan:"#ef4444" };
const typeLabel: Record<string,string> = { human:"Human",bot:"Bot",ai_agent:"AI Agent",service:"Service",orphan:"Orphan" };
const outcomeColor: Record<string,string> = { approved:"#059669",blocked:"#ef4444",escalated:"#7c3aed",purged:"#f59e0b",scoped:"#0061d4" };
const phaseColor: Record<string,string> = { Discover:"#0061d4",Analyze:"#7c3aed",Remediate:"#f59e0b",Monitor:"#059669" };
const sevColor: Record<string,string> = { critical:"#ef4444",high:"#f97316",medium:"#f59e0b" };
const statusColor: Record<string,string> = { healthy:"#059669",warning:"#f59e0b",error:"#ef4444",critical:"#ef4444" };

// ─── Download / upload helpers ───────────────────────────────────
function toCSV(rows: Record<string,unknown>[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  return [keys.join(","), ...rows.map(r => keys.map(k => `"${String(r[k]).replace(/"/g,'""')}"`).join(","))].join("\n");
}
function dlCSV(name: string, rows: Record<string,unknown>[]) {
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(toCSV(rows));
  a.download = name; a.click();
}
function dlJSON(name: string, data: unknown) {
  const a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  a.download = name; a.click();
}
function dlTXT(name: string, content: string) {
  const a = document.createElement("a");
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
  a.download = name; a.click();
}
// ─── Dashboard data context ──────────────────────────────────────
// Holds live API data. All tab components read from here.
// Falls back to static constants when API is not configured.
interface DashboardCtx {
  identities:   typeof IDENTITIES;
  auditLog:     typeof AUDIT_LOG;
  incidents:    typeof INCIDENTS;
  integrations: typeof INTEGRATIONS;
  summary:      {
    total: number; humans: number; nhis: number; aiAgents: number;
    orphaned: number; critical: number; high: number; medium: number;
    nhiRatio: string; toxicCombos: number; sources: string[];
  } | null;
  isLive:   boolean;
  loading:  boolean;
}

const DashCtx = createContext<DashboardCtx>({
  identities:   IDENTITIES,
  auditLog:     AUDIT_LOG,
  incidents:    INCIDENTS,
  integrations: INTEGRATIONS,
  summary:      null,
  isLive:       false,
  loading:      false,
});

const useDash = () => useContext(DashCtx);

function complianceTXT(standard: string): string {
  const now = new Date().toISOString();
  return `UNKOV COMPLIANCE EVIDENCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Standard   : ${standard}
Generated  : ${now}
Org        : Acme Financial Corp
Platform   : Unkov Identity Governance

IDENTITY SUMMARY
Total identities : 1,247 · NHI ratio: 5.2:1 (360 human · 607 bot/service · 146 AI agent · 134 orphan)
Risk score       : 23/100 (↓ 65 pts since deployment)
Controls passing : 97%

EVIDENCE LOG (LAST 24H)
${ AUDIT_LOG.map(e=>`[${e.timestamp}] ${e.phase} | ${e.action} | ${e.target} | ${e.outcome} | Policy: ${e.policy} | Confidence: ${e.confidence}%`).join("\n") }

IDENTITY RECORDS
${ IDENTITIES.map(id=>`${id.id} | ${id.name} | ${id.type} | Risk: ${id.risk}/100 | Status: ${id.status} | Last: ${id.lastActive}`).join("\n") }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auto-generated by Unkov · No manual assembly required
info@unkov.com · unkov.com · Confidential
`;
}

// ─── Shared components ───────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ backgroundColor:S.panel, border:`1px solid ${S.border}`, borderRadius:12, ...style }}>{children}</div>;
}

function SectionHeader({ title, count, sub, children }: { title:string; count?:string|number; sub?:string; children?:React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.875rem 1.25rem", borderBottom:`1px solid ${S.border}`, flexWrap:"wrap", gap:"0.5rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
        <span style={{ fontSize:"0.9375rem", fontWeight:700, color:S.text }}>{title}</span>
        {count !== undefined && <span style={{ fontSize:"0.72rem", fontWeight:600, padding:"1px 7px", borderRadius:9999, backgroundColor:"rgba(255,255,255,0.07)", color:S.soft }}>{count}</span>}
        {sub && <span style={{ fontSize:"0.75rem", color:S.muted }}>{sub}</span>}
      </div>
      <div style={{ display:"flex", gap:"0.375rem", alignItems:"center", flexWrap:"wrap" }}>{children}</div>
    </div>
  );
}

function Btn({ children, onClick, variant="default", size="sm" }: {
  children:React.ReactNode; onClick?:()=>void;
  variant?:"default"|"primary"|"danger"|"success"|"ghost"|"warning";
  size?:"xs"|"sm"|"md";
}) {
  const c: Record<string,{bg:string;bd:string;tx:string}> = {
    default: { bg:"rgba(255,255,255,0.06)", bd:"rgba(255,255,255,0.1)",  tx:S.soft    },
    primary: { bg:"rgba(0,97,212,0.2)",    bd:"rgba(0,97,212,0.4)",     tx:"#60a5fa" },
    danger:  { bg:"rgba(239,68,68,0.12)",  bd:"rgba(239,68,68,0.3)",    tx:"#f87171" },
    success: { bg:"rgba(5,150,105,0.12)",  bd:"rgba(5,150,105,0.3)",    tx:"#34d399" },
    warning: { bg:"rgba(245,158,11,0.12)", bd:"rgba(245,158,11,0.3)",   tx:"#fbbf24" },
    ghost:   { bg:"transparent",           bd:"transparent",             tx:S.muted   },
  };
  const col = c[variant];
  const p = size==="xs"?"2px 8px":size==="sm"?"5px 12px":"7px 18px";
  const fs = size==="xs"?"0.72rem":"0.8125rem";
  return (
    <button onClick={onClick} style={{ padding:p, fontSize:fs, fontWeight:600, borderRadius:7, border:`1px solid ${col.bd}`, backgroundColor:col.bg, color:col.tx, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"0.3rem", whiteSpace:"nowrap" }}
      onMouseEnter={e=>(e.currentTarget.style.opacity="0.75")} onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
      {children}
    </button>
  );
}

function Badge({ children, color }: { children:React.ReactNode; color:string }) {
  return <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"2px 7px", borderRadius:9999, backgroundColor:color+"22", color, border:`1px solid ${color}44`, whiteSpace:"nowrap" }}>{children}</span>;
}

function Sel({ value, onChange, options, style }: { value:string; onChange:(v:string)=>void; options:{v:string;l:string}[]; style?:React.CSSProperties }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ padding:"4px 8px", fontSize:"0.8125rem", backgroundColor:"rgba(255,255,255,0.06)", border:`1px solid ${S.border}`, borderRadius:7, color:S.text, cursor:"pointer", ...style }}>
      {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function Inp({ value, onChange, placeholder, style }: { value:string; onChange:(v:string)=>void; placeholder?:string; style?:React.CSSProperties }) {
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      <Search style={{ position:"absolute", left:8, width:12, height:12, color:S.muted }} />
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder??"Search…"}
        style={{ paddingLeft:26, paddingRight:8, paddingTop:5, paddingBottom:5, fontSize:"0.8125rem", backgroundColor:"rgba(255,255,255,0.05)", border:`1px solid ${S.border}`, borderRadius:7, color:S.text, outline:"none", width:200, ...style }} />
    </div>
  );
}

// DownloadBar — always present, every tab
function DBar({ onCSV, onJSON, onTXT, onUpload, uploadLabel }: {
  onCSV:()=>void; onJSON:()=>void; onTXT?:()=>void;
  onUpload?:(file:File)=>void; uploadLabel?:string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display:"flex", gap:"0.25rem", alignItems:"center" }}>
      {onUpload && <>
        <Btn onClick={()=>ref.current?.click()} variant="ghost" size="xs"><Upload style={{width:11,height:11}}/> {uploadLabel||"Import"}</Btn>
        <input ref={ref} type="file" accept=".csv,.json" style={{display:"none"}}
          onChange={e=>{ const f=e.target.files?.[0]; if(f){ onUpload(f); e.target.value=""; } }} />
      </>}
      <Btn onClick={onCSV}  variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
      <Btn onClick={onJSON} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> JSON</Btn>
      {onTXT && <Btn onClick={onTXT} variant="ghost" size="xs"><FileText style={{width:11,height:11}}/> Report</Btn>}
    </div>
  );
}

function TH({ children }: { children:React.ReactNode }) {
  return <th style={{ padding:"0.625rem 0.875rem", textAlign:"left", color:S.muted, fontWeight:600, fontSize:"0.7rem", textTransform:"uppercase" as const, letterSpacing:"0.08em", whiteSpace:"nowrap" as const }}>{children}</th>;
}
function TD({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return <td style={{ padding:"0.75rem 0.875rem", fontSize:"0.8125rem", borderBottom:`1px solid ${S.border}`, ...style }}>{children}</td>;
}

// ─── Overview tab ────────────────────────────────────────────────
function OverviewTab() {
  const { summary, isLive, auditLog: liveAuditLog } = useDash();
  const activeAuditLog = liveAuditLog.length > 0 ? liveAuditLog as typeof AUDIT_LOG : AUDIT_LOG;
  const total    = summary?.total      ?? 1247;
  const orphaned = summary?.orphaned   ?? 134;
  const aiAgents = summary?.aiAgents   ?? 146;
  const critical = summary?.critical   ?? 23;
  const nhiRatio = summary?.nhiRatio   ?? "5.2:1";
  const sources  = summary?.sources?.length ?? 5;

  const kpis = [
    { label:"Total identities",    val:total.toLocaleString(), unit:"",      delta:isLive ? `${nhiRatio} NHI ratio` : "+34 this week",    up:true,  color:"#60a5fa", icon:Users,        phase:"Discover"   },
    { label:"Decisions automated", val:"98",    unit:"%",     delta:"+3% vs last week",    up:true,  color:"#a78bfa", icon:Zap,          phase:"Analyze"    },
    { label:"Incidents blocked",   val:"312",   unit:"/wk",   delta:"↓ 22% improvement",   up:true,  color:"#f59e0b", icon:Shield,       phase:"Remediate"  },
    { label:"Risk score",          val:"23",    unit:"/100",  delta:"↓ 65 pts since deploy",up:true, color:"#34d399", icon:TrendingDown, phase:"Monitor"    },
    { label:"Hours saved/qtr",     val:"847",   unit:" hrs",  delta:"vs 960h baseline",    up:true,  color:"#60a5fa", icon:Clock,        phase:"ROI"        },
    { label:"Orphan accounts",     val:orphaned.toLocaleString(), unit:"",   delta:"Purge queued",         up:false, color:"#ef4444", icon:Bot,          phase:"Remediate"  },
    { label:"Compliance posture",  val:"94",    unit:"%",     delta:"PCI + SOC 2 passing",  up:true,  color:"#34d399", icon:CheckCircle,  phase:"Monitor"    },
    { label:"Integrations",        val:`${sources}/${sources}`, unit:"",    delta:"All connectors live",  up:true,  color:"#60a5fa", icon:ExternalLink,        phase:"Discover"   },
  ];
  const overviewCSVData = kpis.map(k=>({ metric:k.label, value:k.val+k.unit, trend:k.delta, phase:k.phase }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* KPI header with download */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"0.875rem", color:S.muted }}>Command Center — live · last updated just now</span>
        <DBar
          onCSV={()=>dlCSV("overview-kpis.csv", overviewCSVData)}
          onJSON={()=>dlJSON("overview-kpis.json", overviewCSVData)}
          onTXT={()=>dlTXT("dashboard-summary.txt", complianceTXT("Dashboard Overview"))}
        />
      </div>
      {/* KPI grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:"0.875rem" }}>
        {kpis.map(k=>{
          const Icon = k.icon;
          return (
            <Card key={k.label} style={{ padding:"1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                <span style={{ fontSize:"0.7rem", color:S.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{k.phase}</span>
                <div style={{ padding:"0.25rem", backgroundColor:k.color+"18", borderRadius:6 }}><Icon style={{ width:12, height:12, color:k.color }}/></div>
              </div>
              <div style={{ fontSize:"1.75rem", fontWeight:800, color:k.color, lineHeight:1, marginBottom:"0.25rem" }}>{k.val}<span style={{ fontSize:"0.875rem", color:S.muted, fontWeight:400 }}>{k.unit}</span></div>
              <div style={{ fontSize:"0.75rem", color:S.muted, marginBottom:"0.25rem" }}>{k.label}</div>
              <div style={{ fontSize:"0.72rem", color:k.up?"#34d399":"#ef4444", display:"flex", alignItems:"center", gap:3 }}>
                {k.up ? <ArrowDownRight style={{width:10,height:10}}/> : <ArrowUpRight style={{width:10,height:10}}/>}{k.delta}
              </div>
            </Card>
          );
        })}
      </div>
      {/* Risk trend + identity fabric */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem" }}>
        <Card>
          <SectionHeader title="Risk score trend" sub="7-day · lower is safer">
            <DBar onCSV={()=>dlCSV("risk-trend.csv",[{day:"Mon",risk:72,blocked:14},{day:"Tue",risk:68,blocked:22},{day:"Wed",risk:74,blocked:18},{day:"Thu",risk:55,blocked:31},{day:"Fri",risk:48,blocked:27},{day:"Sat",risk:41,blocked:19},{day:"Sun",risk:37,blocked:23}])} onJSON={()=>dlJSON("risk-trend.json",{})} />
          </SectionHeader>
          <div style={{ padding:"1rem 1.25rem" }}>
            {/* Simple canvas chart */}
            <canvas id="risk-canvas" style={{ width:"100%", height:140 }} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Identity fabric">
            <DBar onCSV={()=>dlCSV("identity-fabric.csv",[{type:"Human",count:360,pct:"29%"},{type:"Bot/Service",count:607,pct:"49%"},{type:"AI Agent",count:146,pct:"12%"},{type:"Orphan",count:134,pct:"11%"}])} onJSON={()=>dlJSON("identity-fabric.json",{})} />
          </SectionHeader>
          <div style={{ padding:"1rem 1.25rem" }}>
            {[...[
              {label:"Human employees",    count:summary?.humans    ?? 360, color:"#0061d4"},
              {label:"Bots / service accts",count:(summary ? summary.nhis - summary.aiAgents - summary.orphaned : 607), color:"#f59e0b"},
              {label:"AI agents",          count:summary?.aiAgents  ?? 146, color:"#a78bfa"},
              {label:"Orphan / ghost",     count:summary?.orphaned  ?? 134, color:"#ef4444"},
            ].map(r => ({...r, pct: summary ? Math.round(r.count / summary.total * 100) : (r.color === "#0061d4" ? 29 : r.color === "#f59e0b" ? 49 : r.color === "#a78bfa" ? 12 : 11)}))].map(r=>(
              <div key={r.label} style={{ marginBottom:"0.875rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                  <span style={{ fontSize:"0.8125rem", color:S.soft }}>{r.label}</span>
                  <span style={{ fontSize:"0.8125rem", fontWeight:700, color:r.color }}>{r.count}</span>
                </div>
                <div style={{ height:5, backgroundColor:"rgba(255,255,255,0.06)", borderRadius:9999 }}>
                  <div style={{ height:"100%", width:`${r.pct}%`, backgroundColor:r.color, borderRadius:9999 }}/>
                </div>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${S.border}`, paddingTop:"0.75rem", marginTop:"0.5rem" }}>
              {[["Discover","#0061d4",`${(summary?.total ?? 1247).toLocaleString()} nodes live`],["Analyze","#a78bfa","97% automated"],["Remediate","#f59e0b","Armed"],["Monitor","#34d399","Continuous"]].map(([p,c,s])=>(
                <div key={p as string} style={{ display:"flex", alignItems:"center", gap:7, padding:"4px 0", borderBottom:`1px solid ${S.border}` }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:c as string, animation:"pulse2 2s infinite" }}/>
                  <span style={{ fontSize:"0.8125rem", color:S.text, flex:1 }}>{p as string}</span>
                  <span style={{ fontSize:"0.72rem", color:c as string, fontWeight:600 }}>{s as string}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      {/* Live feed + access queue */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
        <Card>
          <SectionHeader title="Live event feed">
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.8125rem", color:"#34d399" }}><div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#34d399", animation:"pulse2 2s infinite" }}/> Live</div>
            <DBar onCSV={()=>dlCSV("events.csv",activeAuditLog.slice(0,8).map(e=>({id:e.id,timestamp:e.timestamp,action:e.action,target:e.target,outcome:e.outcome})))} onJSON={()=>dlJSON("events.json",activeAuditLog.slice(0,8))} />
          </SectionHeader>
          <div style={{ padding:"0.75rem 1rem", display:"flex", flexDirection:"column", gap:"0.375rem" }}>
            {activeAuditLog.slice(0,8).map(e=>(
              <div key={e.id} style={{ display:"flex", gap:"0.625rem", padding:"0.5rem 0.75rem", backgroundColor:"rgba(255,255,255,0.02)", borderRadius:8, border:`1px solid ${S.border}` }}>
                <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:outcomeColor[e.outcome], flexShrink:0, marginTop:5 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.8125rem", color:S.text }}>{e.action} — <span style={{ color:S.soft }}>{e.target}</span></div>
                  <div style={{ fontSize:"0.7rem", color:S.muted, marginTop:2, display:"flex", gap:6 }}>
                    <span>{e.timestamp.slice(11)}</span>
                    <Badge color={phaseColor[e.phase]}>{e.phase}</Badge>
                    <Badge color={outcomeColor[e.outcome]}>{e.outcome}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Access queue" sub="Permission Gate">
            <DBar onCSV={()=>dlCSV("access-queue.csv",[{identity:"sarah.chen",resource:"Finance DB",status:"auto-approved"},{identity:"mlops-v3",resource:"Training Cluster",status:"pending"}])} onJSON={()=>dlJSON("access-queue.json",[])} />
          </SectionHeader>
          <div style={{ padding:"0.75rem 1rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            {[{id:"sarah.chen",t:"human",res:"Finance DB",st:"auto-approved",risk:"low"},{id:"AI: mlops-v3",t:"ai_agent",res:"Training Cluster",st:"pending",risk:"medium"},{id:"bot: report-gen",t:"bot",res:"HR System",st:"blocked",risk:"high"},{id:"james.park",t:"human",res:"VPN Group A",st:"auto-approved",risk:"low"},{id:"AI: bedrock-agent-03",t:"ai_agent",res:"PII Database",st:"escalated",risk:"high"}].map(r=>{
              const stC: Record<string,string> = {"auto-approved":"#34d399",blocked:"#ef4444",pending:"#f59e0b",escalated:"#a78bfa"};
              return (
                <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 0.75rem", backgroundColor:"rgba(255,255,255,0.02)", borderRadius:8, border:`1px solid ${r.risk==="high"?"rgba(239,68,68,0.2)":r.risk==="medium"?"rgba(245,158,11,0.15)":S.border}` }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", backgroundColor:typeColor[r.t]+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, color:typeColor[r.t], flexShrink:0 }}>
                    {r.t==="human"?r.id.slice(0,2).toUpperCase():r.t==="ai_agent"?"AI":"BOT"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"0.8125rem", fontWeight:600, color:S.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.id}</div>
                    <div style={{ fontSize:"0.7rem", color:S.muted }}>→ {r.res}</div>
                  </div>
                  <Badge color={stC[r.st]}>{r.st}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Identities tab ──────────────────────────────────────────────
function IdentitiesTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Identity|null>(null);
  const { identities: liveIds, isLive } = useDash();
  const [identities, setIdentities] = useState(IDENTITIES);
  // Sync live data when it arrives
  useEffect(() => { if (liveIds.length > 0 && isLive) setIdentities(liveIds as typeof IDENTITIES); }, [liveIds, isLive]);

  const filtered = identities.filter(id=>{
    const q = search.toLowerCase();
    return (!q || id.name.includes(q) || id.dept.toLowerCase().includes(q)) &&
      (filter==="all" || id.type===filter || id.status===filter);
  });

  const toggle = (id:string) => { const s=new Set(selected); s.has(id)?s.delete(id):s.add(id); setSelected(s); };

  const handleImport = (file:File) => {
    const r = new FileReader();
    r.onload = ev => {
      try {
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) setIdentities(prev=>[...prev,...data.slice(0,5)]);
          alert(`Imported ${Math.min(data.length,5)} identities (preview — max 5)`);
        } else {
          alert("CSV import: first 5 rows parsed. In production this would ingest your identity export from Okta/SailPoint.");
        }
      } catch { alert("Could not parse file. Ensure it matches Unkov identity schema."); }
    };
    r.readAsText(file);
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:detail?"1fr 340px":"1fr", gap:"1.25rem" }}>
      <Card>
        <SectionHeader title="Identity registry" count={filtered.length}>
          <Inp value={search} onChange={setSearch} placeholder="Search identity or dept…"/>
          <Sel value={filter} onChange={setFilter} options={[{v:"all",l:"All types"},{v:"human",l:"Human"},{v:"ai_agent",l:"AI Agent"},{v:"bot",l:"Bot"},{v:"service",l:"Service"},{v:"orphan",l:"Orphan"},{v:"flagged",l:"Flagged"}]}/>
          <DBar
            onCSV={()=>dlCSV("identities.csv",filtered.map(id=>({id:id.id,name:id.name,type:id.type,dept:id.dept,risk:id.risk,status:id.status,lastActive:id.lastActive,accessCount:id.accessCount,permissions:id.permissions.join("|")})))}
            onJSON={()=>dlJSON("identities.json",filtered)}
            onTXT={()=>dlTXT("identity-report.txt",complianceTXT("Identity Registry"))}
            onUpload={handleImport}
            uploadLabel="Import identities"
          />
        </SectionHeader>
        {/* Bulk action bar */}
        {selected.size>0 && (
          <div style={{ padding:"0.5rem 1.25rem", backgroundColor:"rgba(0,97,212,0.1)", borderBottom:`1px solid rgba(0,97,212,0.2)`, display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap" }}>
            <span style={{ fontSize:"0.8125rem", color:"#60a5fa", fontWeight:600 }}>{selected.size} selected</span>
            <Btn variant="danger"   size="xs" onClick={()=>{setIdentities(prev=>prev.map(id=>selected.has(id.id)?{...id,status:"suspended"}:id));setSelected(new Set());}}>Purge selected</Btn>
            <Btn variant="primary"  size="xs" onClick={()=>{setIdentities(prev=>prev.map(id=>selected.has(id.id)?{...id,risk:Math.max(5,id.risk-10)}:id));setSelected(new Set());}}>Rightsize selected</Btn>
            <Btn variant="warning"  size="xs" onClick={()=>{setIdentities(prev=>prev.map(id=>selected.has(id.id)?{...id,status:"suspended"}:id));setSelected(new Set());}}>Suspend selected</Btn>
            <Btn variant="ghost"    size="xs" onClick={()=>dlCSV("selected.csv",identities.filter(id=>selected.has(id.id)).map(id=>({id:id.id,name:id.name,type:id.type,risk:id.risk,status:id.status})))}>Export CSV</Btn>
            <Btn variant="ghost"    size="xs" onClick={()=>dlJSON("selected.json",identities.filter(id=>selected.has(id.id)))}>Export JSON</Btn>
            <Btn variant="ghost"    size="xs" onClick={()=>setSelected(new Set())}>Clear</Btn>
          </div>
        )}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${S.border}` }}>
                <TH><input type="checkbox" style={{cursor:"pointer"}} checked={selected.size===filtered.length&&filtered.length>0} onChange={e=>setSelected(e.target.checked?new Set(filtered.map(i=>i.id)):new Set())}/></TH>
                {["Identity","Type","Dept","Risk","Access","Last active","Status",""].map(h=><TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(id=>(
                <tr key={id.id} style={{ cursor:"pointer", backgroundColor:selected.has(id.id)?"rgba(0,97,212,0.08)":"transparent" }}
                  onMouseEnter={e=>{if(!selected.has(id.id))e.currentTarget.style.backgroundColor="rgba(255,255,255,0.02)"}}
                  onMouseLeave={e=>{if(!selected.has(id.id))e.currentTarget.style.backgroundColor="transparent"}}>
                  <TD><input type="checkbox" style={{cursor:"pointer"}} checked={selected.has(id.id)} onChange={()=>toggle(id.id)} onClick={e=>e.stopPropagation()}/></TD>
                  <TD onClick={()=>setDetail(detail?.id===id.id?null:id)}>
                    <div style={{fontWeight:600,color:S.text}}>{id.name}</div>
                    <div style={{fontSize:"0.7rem",color:S.muted}}>{id.id}</div>
                  </TD>
                  <TD><Badge color={typeColor[id.type]}>{typeLabel[id.type]}</Badge></TD>
                  <TD style={{color:S.soft}}>{id.dept}</TD>
                  <TD>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:44,height:4,backgroundColor:"rgba(255,255,255,0.06)",borderRadius:9999}}>
                        <div style={{height:"100%",width:`${id.risk}%`,backgroundColor:id.risk>=70?"#ef4444":id.risk>=40?"#f59e0b":"#34d399",borderRadius:9999}}/>
                      </div>
                      <span style={{fontSize:"0.8125rem",fontWeight:700,color:id.risk>=70?"#ef4444":id.risk>=40?"#f59e0b":"#34d399"}}>{id.risk}</span>
                    </div>
                  </TD>
                  <TD style={{color:S.muted}}>{id.accessCount} rights</TD>
                  <TD style={{color:S.soft}}>{id.lastActive}</TD>
                  <TD><Badge color={id.status==="active"?"#34d399":id.status==="orphan"?"#ef4444":id.status==="flagged"?"#f59e0b":"#6b7280"}>{id.status}</Badge></TD>
                  <TD>
                    <Btn onClick={e=>{e.stopPropagation();setDetail(detail?.id===id.id?null:id)}} variant="ghost" size="xs"><Eye style={{width:11,height:11}}/></Btn>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {/* Drill-down panel */}
      {detail && (
        <Card style={{alignSelf:"start"}}>
          <SectionHeader title={detail.name}>
            <Badge color={typeColor[detail.type]}>{typeLabel[detail.type]}</Badge>
            <DBar onCSV={()=>dlCSV(`identity-${detail.id}.csv`,[{id:detail.id,name:detail.name,type:detail.type,dept:detail.dept,risk:detail.risk,status:detail.status,lastActive:detail.lastActive}])} onJSON={()=>dlJSON(`identity-${detail.id}.json`,detail)}/>
            <Btn onClick={()=>setDetail(null)} variant="ghost" size="xs"><X style={{width:11,height:11}}/></Btn>
          </SectionHeader>
          <div style={{padding:"1rem 1.25rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
              {[["ID",detail.id],["Department",detail.dept],["Status",detail.status],["Last active",detail.lastActive],["Access count",`${detail.accessCount} rights`],["Risk",`${detail.risk}/100`]].map(([k,v])=>(
                <div key={k as string} style={{backgroundColor:"rgba(255,255,255,0.03)",borderRadius:8,padding:"0.5rem 0.75rem"}}>
                  <div style={{fontSize:"0.65rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{k as string}</div>
                  <div style={{fontSize:"0.8125rem",color:S.text,fontWeight:500}}>{v as string}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:"0.7rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.375rem"}}>Risk score</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,height:7,backgroundColor:"rgba(255,255,255,0.06)",borderRadius:9999}}>
                  <div style={{height:"100%",width:`${detail.risk}%`,backgroundColor:detail.risk>=70?"#ef4444":detail.risk>=40?"#f59e0b":"#34d399",borderRadius:9999}}/>
                </div>
                <span style={{fontSize:"1rem",fontWeight:800,color:detail.risk>=70?"#ef4444":detail.risk>=40?"#f59e0b":"#34d399"}}>{detail.risk}/100</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:"0.7rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.375rem"}}>Permissions ({detail.permissions.length})</div>
              {detail.permissions.map(p=>(
                <div key={p} style={{fontSize:"0.8125rem",padding:"4px 8px",backgroundColor:"rgba(255,255,255,0.04)",borderRadius:6,marginBottom:3,color:S.soft,border:`1px solid ${S.border}`}}>{p}</div>
              ))}
            </div>
            <div>
              <div style={{fontSize:"0.7rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.375rem"}}>Audit history</div>
              {AUDIT_LOG.filter(e=>e.target.includes(detail.name.split(".")[0])||e.target.includes(detail.name)).slice(0,4).map(e=>(
                <div key={e.id} style={{padding:"5px 0",borderBottom:`1px solid ${S.border}`,display:"flex",gap:7,alignItems:"flex-start"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",backgroundColor:outcomeColor[e.outcome],flexShrink:0,marginTop:4}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.75rem",color:S.text}}>{e.action}</div>
                    <div style={{fontSize:"0.7rem",color:S.muted}}>{e.timestamp.slice(11)}</div>
                  </div>
                  <Badge color={outcomeColor[e.outcome]}>{e.outcome}</Badge>
                </div>
              ))}
              {AUDIT_LOG.filter(e=>e.target.includes(detail.name.split(".")[0])).length===0 && (
                <div style={{fontSize:"0.8125rem",color:S.muted,padding:"6px 0"}}>No recent entries</div>
              )}
            </div>
            <div style={{display:"flex",gap:"0.375rem",flexWrap:"wrap"}}>
              <Btn variant="danger"  size="sm" onClick={()=>setIdentities(prev=>prev.map(id=>id.id===detail.id?{...id,status:"suspended"}:id))}>Suspend</Btn>
              <Btn variant="primary" size="sm" onClick={()=>setIdentities(prev=>prev.map(id=>id.id===detail.id?{...id,risk:Math.max(5,id.risk-10)}:id))}>Rightsize</Btn>
              <Btn variant="default" size="sm" onClick={()=>dlJSON(`identity-${detail.id}.json`,detail)}><Download style={{width:11,height:11}}/> Export</Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Access queue tab ────────────────────────────────────────────
function AccessTab() {
  const [requests, setRequests] = useState([
    { id:"R-001", identity:"sarah.chen",     type:"human",    resource:"Finance DB",      dept:"Finance",    peers:"11/12", conf:97, risk:"low",    status:"auto-approved", reason:"Peer-clone match: 11/12 Finance peers have this access. Risk delta +2 — within threshold.", time:"10m ago" },
    { id:"R-002", identity:"AI: mlops-v3",   type:"ai_agent", resource:"Training Cluster",dept:"ML/AI",      peers:"8/10",  conf:82, risk:"medium", status:"pending",       reason:"New agent type added to cluster. Peer-clone 8/10 — awaiting ML team lead confirmation.", time:"15m ago" },
    { id:"R-003", identity:"bot: report-gen",type:"bot",      resource:"HR System",       dept:"Ops",        peers:"0/31",  conf:99, risk:"high",   status:"blocked",       reason:"Zero peer precedent in Ops dept. Toxic combination alert — cross-dept access policy violation.", time:"22m ago" },
    { id:"R-004", identity:"james.park",     type:"human",    resource:"VPN Group A",     dept:"Engineering",peers:"14/15", conf:96, risk:"low",    status:"auto-approved", reason:"Standard onboarding entitlement. Peer-clone match 14/15 — role confirmed.", time:"1h ago" },
    { id:"R-005", identity:"AI: bedrock-agent-executor-03",type:"ai_agent",resource:"PII Database",   dept:"Data",       peers:"2/18",  conf:88, risk:"high",   status:"escalated",     reason:"Unusual access pattern. Risk delta +42 — 94th percentile. Escalated to CISO queue.", time:"1h ago" },
  ]);
  const [filter, setFilter] = useState("all");
  const stC: Record<string,string> = {"auto-approved":"#34d399",blocked:"#ef4444",pending:"#f59e0b",escalated:"#a78bfa"};
  const approve = (id:string) => setRequests(p=>p.map(r=>r.id===id?{...r,status:"auto-approved"}:r));
  const block   = (id:string) => setRequests(p=>p.map(r=>r.id===id?{...r,status:"blocked"}:r));
  const filtered = requests.filter(r=>filter==="all"||r.status===filter||r.risk===filter);

  const handleImport = (file:File) => {
    alert(`Import accepted: ${file.name}\nIn production, this ingests access requests from your ITSM (ServiceNow/Jira) or IAM connector export.`);
  };

  return (
    <Card>
      <SectionHeader title="Permission Gate — access queue" count={filtered.length} sub={`${requests.filter(r=>r.status==="pending").length} pending · ${requests.filter(r=>r.status==="escalated").length} escalated`}>
        <Sel value={filter} onChange={setFilter} options={[{v:"all",l:"All"},{v:"auto-approved",l:"Approved"},{v:"pending",l:"Pending"},{v:"blocked",l:"Blocked"},{v:"escalated",l:"Escalated"},{v:"high",l:"High risk"},{v:"medium",l:"Medium risk"}]}/>
        <DBar
          onCSV={()=>dlCSV("access-queue.csv",filtered.map(r=>({id:r.id,identity:r.identity,type:r.type,resource:r.resource,dept:r.dept,risk:r.risk,status:r.status,peerClone:r.peers,confidence:r.conf,reason:r.reason,time:r.time})))}
          onJSON={()=>dlJSON("access-queue.json",filtered)}
          onTXT={()=>dlTXT("access-report.txt",filtered.map(r=>`[${r.id}] ${r.identity} → ${r.resource}\nStatus: ${r.status} | Risk: ${r.risk} | Confidence: ${r.conf}%\nReason: ${r.reason}\n`).join("\n"))}
          onUpload={handleImport}
          uploadLabel="Import requests"
        />
      </SectionHeader>
      <div style={{padding:"1rem 1.25rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {filtered.map(r=>(
          <div key={r.id} style={{padding:"1rem 1.25rem",border:`1px solid ${r.risk==="high"?"rgba(239,68,68,0.25)":r.risk==="medium"?"rgba(245,158,11,0.2)":S.border}`,borderRadius:10,backgroundColor:"rgba(255,255,255,0.02)"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.625rem"}}>
              <div style={{width:32,height:32,borderRadius:"50%",backgroundColor:typeColor[r.type]+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,color:typeColor[r.type],flexShrink:0}}>
                {r.type==="human"?r.identity.slice(0,2).toUpperCase():r.type==="ai_agent"?"AI":"BOT"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.9375rem",fontWeight:600,color:S.text}}>{r.identity}</div>
                <div style={{fontSize:"0.72rem",color:S.muted}}>{typeLabel[r.type]} · {r.dept} · {r.time}</div>
              </div>
              <Badge color={stC[r.status]}>{r.status}</Badge>
            </div>
            <div style={{fontSize:"0.875rem",color:S.soft,marginBottom:"0.5rem"}}>Requesting access to: <strong style={{color:S.text}}>{r.resource}</strong></div>
            <div style={{fontSize:"0.8125rem",color:S.muted,padding:"0.5rem 0.75rem",backgroundColor:"rgba(255,255,255,0.03)",borderRadius:7,marginBottom:"0.625rem",lineHeight:1.5}}>{r.reason}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:"1rem",fontSize:"0.8125rem",color:S.muted}}>
                <span>Peer-clone: <strong style={{color:S.text}}>{r.peers}</strong></span>
                <span>Confidence: <strong style={{color:r.conf>=90?"#34d399":"#f59e0b"}}>{r.conf}%</strong></span>
                <span>Risk: <strong style={{color:r.risk==="high"?"#ef4444":r.risk==="medium"?"#f59e0b":"#34d399"}}>{r.risk}</strong></span>
              </div>
              {(r.status==="pending"||r.status==="escalated") && (
                <div style={{display:"flex",gap:"0.375rem"}}>
                  <Btn variant="success" size="xs" onClick={()=>approve(r.id)}><CheckCircle style={{width:11,height:11}}/> Approve</Btn>
                  <Btn variant="danger"  size="xs" onClick={()=>block(r.id)}><X style={{width:11,height:11}}/> Block</Btn>
                  <Btn variant="ghost"   size="xs" onClick={()=>dlJSON(`request-${r.id}.json`,r)}><Download style={{width:11,height:11}}/></Btn>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Audit trail tab ─────────────────────────────────────────────
function AuditTab() {
  const { auditLog: liveAudit } = useDash();
  const activeAudit = liveAudit.length > 0 ? liveAudit as typeof AUDIT_LOG : AUDIT_LOG;
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [dateFrom, setDateFrom] = useState("");

  const filtered = activeAudit.filter(e=>{
    const q = search.toLowerCase();
    return (!q || e.action.toLowerCase().includes(q)||e.target.toLowerCase().includes(q)||e.policy.toLowerCase().includes(q)) &&
      (phase==="all"||e.phase===phase) &&
      (outcome==="all"||e.outcome===outcome) &&
      (!dateFrom || e.timestamp >= dateFrom);
  });

  return (
    <Card>
      <SectionHeader title="Audit trail" count={filtered.length}>
        <Inp value={search} onChange={setSearch} placeholder="Search action, target, policy…"/>
        <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} title="From date"
          style={{padding:"4px 8px",fontSize:"0.8125rem",backgroundColor:"rgba(255,255,255,0.06)",border:`1px solid ${S.border}`,borderRadius:7,color:S.text,cursor:"pointer"}}/>
        <Sel value={phase} onChange={setPhase} options={[{v:"all",l:"All phases"},{v:"Discover",l:"Discover"},{v:"Analyze",l:"Analyze"},{v:"Remediate",l:"Remediate"},{v:"Monitor",l:"Monitor"}]}/>
        <Sel value={outcome} onChange={setOutcome} options={[{v:"all",l:"All outcomes"},{v:"approved",l:"Approved"},{v:"blocked",l:"Blocked"},{v:"escalated",l:"Escalated"},{v:"purged",l:"Purged"},{v:"scoped",l:"Scoped"}]}/>
        <DBar
          onCSV={()=>dlCSV("audit-trail.csv",filtered.map(e=>({id:e.id,timestamp:e.timestamp,action:e.action,target:e.target,actor:e.actor,phase:e.phase,outcome:e.outcome,policy:e.policy,riskDelta:e.riskDelta,confidence:e.confidence})))}
          onJSON={()=>dlJSON("audit-trail.json",filtered)}
          onTXT={()=>dlTXT("audit-evidence.txt",complianceTXT("Audit Trail"))}
          onUpload={f=>alert(`Import audit log: ${f.name}\nAccepted formats: Splunk CSV, AWS CloudTrail JSON, Okta syslog CSV`)}
          uploadLabel="Import logs"
        />
      </SectionHeader>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8125rem"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${S.border}`}}>
              {["Timestamp","Action","Target","Actor","Phase","Outcome","Policy","Risk Δ","Confidence",""].map(h=><TH key={h}>{h}</TH>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e,i)=>(
              <tr key={e.id} style={{backgroundColor:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                <TD style={{color:S.muted,whiteSpace:"nowrap"}}>{e.timestamp}</TD>
                <TD style={{color:S.text,fontWeight:500}}>{e.action}</TD>
                <TD style={{color:S.soft}}>{e.target}</TD>
                <TD style={{color:S.muted}}>{e.actor}</TD>
                <TD><Badge color={phaseColor[e.phase]}>{e.phase}</Badge></TD>
                <TD><Badge color={outcomeColor[e.outcome]}>{e.outcome}</Badge></TD>
                <TD style={{color:S.muted,fontFamily:"monospace",fontSize:"0.7rem"}}>{e.policy}</TD>
                <TD style={{fontWeight:700,color:e.riskDelta<0?"#34d399":e.riskDelta>0?"#ef4444":S.muted}}>{e.riskDelta<0?e.riskDelta:e.riskDelta>0?`+${e.riskDelta}`:"—"}</TD>
                <TD style={{color:e.confidence>=95?"#34d399":"#f59e0b",fontWeight:600}}>{e.confidence}%</TD>
                <TD><Btn onClick={()=>dlJSON(`audit-${e.id}.json`,e)} variant="ghost" size="xs"><Download style={{width:10,height:10}}/></Btn></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Compliance tab ──────────────────────────────────────────────
function ComplianceTab() {
  const [uploadedEvidence, setUploadedEvidence] = useState<string[]>([]);
  const standards = [
    { name:"PCI DSS 4.0",          pct:97, status:"Compliant",    color:"#34d399", controls:"Req 7 & 8 · Agent token governance · Continuous monitoring" },
    { name:"SOC 2 Type II",         pct:94, status:"Compliant",    color:"#34d399", controls:"CC6 · CC7 · CC9 · A1 — all passing" },
    { name:"HIPAA § 164.312(a)",    pct:78, status:"In progress",  color:"#f59e0b", controls:"ePHI access trail partial · Patient Data Lineage Q3 2026" },
    { name:"ISO 27001",             pct:45, status:"Planned",       color:"#6b7280", controls:"Controls gap analysis Q2 2026 · Certification target 2027" },
  ];
  const handleUpload = (file:File) => {
    setUploadedEvidence(prev=>[...prev,file.name]);
    alert(`Evidence uploaded: ${file.name}\nIn production, this attaches to the relevant compliance framework and is timestamped in the immutable audit log.`);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
        <Card>
          <SectionHeader title="Compliance posture">
            <DBar
              onCSV={()=>dlCSV("compliance.csv",standards.map(s=>({standard:s.name,pct:s.pct,status:s.status,controls:s.controls})))}
              onJSON={()=>dlJSON("compliance.json",standards)}
              onTXT={()=>dlTXT("compliance-report.txt",complianceTXT("All Standards"))}
              onUpload={handleUpload}
              uploadLabel="Upload evidence"
            />
          </SectionHeader>
          <div style={{padding:"1rem 1.25rem"}}>
            {standards.map(s=>(
              <div key={s.name} style={{marginBottom:"1.125rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.3rem"}}>
                  <span style={{fontSize:"0.9375rem",color:S.text,fontWeight:500}}>{s.name}</span>
                  <span style={{fontSize:"0.8125rem",fontWeight:700,color:s.color}}>{s.status}</span>
                </div>
                <div style={{height:6,backgroundColor:"rgba(255,255,255,0.06)",borderRadius:9999,marginBottom:"0.25rem"}}>
                  <div style={{height:"100%",width:`${s.pct}%`,backgroundColor:s.color,borderRadius:9999,transition:"width .7s ease"}}/>
                </div>
                <div style={{fontSize:"0.72rem",color:S.muted}}>{s.pct}% controls passing · {s.controls}</div>
              </div>
            ))}
            {uploadedEvidence.length>0 && (
              <div style={{marginTop:"0.75rem",padding:"0.75rem",backgroundColor:"rgba(52,211,153,0.08)",borderRadius:8,border:"1px solid rgba(52,211,153,0.2)"}}>
                <div style={{fontSize:"0.75rem",fontWeight:600,color:"#34d399",marginBottom:"0.25rem"}}>Uploaded evidence ({uploadedEvidence.length})</div>
                {uploadedEvidence.map(f=><div key={f} style={{fontSize:"0.72rem",color:S.muted}}>{f}</div>)}
              </div>
            )}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Evidence collection">
            <DBar
              onCSV={()=>dlCSV("evidence.csv",[{metric:"Access log entries today",value:"14,382"},{metric:"Policy checks run",value:"8,241"},{metric:"Violations remediated",value:"47"},{metric:"Snapshots saved",value:"3"},{metric:"Hours saved",value:"118"},{metric:"Days to next SOC 2",value:"42"}])}
              onJSON={()=>dlJSON("evidence.json",{})}
            />
          </SectionHeader>
          <div style={{padding:"1rem 1.25rem"}}>
            {[["Access log entries today","14,382","#60a5fa"],["Policy checks run","8,241","#a78bfa"],["Violations auto-remediated","47","#f59e0b"],["Audit snapshots saved","3","#34d399"],["Hours saved vs manual","118 hrs","#34d399"],["Days to next SOC 2 audit","42","#60a5fa"],["Controls evidence items","14,382","#a78bfa"],["Immutable log entries","28,641","#34d399"]].map(([l,v,c])=>(
              <div key={l as string} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.625rem 0",borderBottom:`1px solid ${S.border}`}}>
                <span style={{fontSize:"0.875rem",color:S.soft}}>{l as string}</span>
                <span style={{fontSize:"0.9375rem",fontWeight:700,color:c as string}}>{v as string}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Per-standard export cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>
        {standards.map(s=>(
          <Card key={s.name}>
            <SectionHeader title={s.name}>
              <DBar
                onCSV={()=>dlCSV(`${s.name.replace(/\s/g,"-")}.csv`,[{standard:s.name,pct:s.pct,status:s.status}])}
                onJSON={()=>dlJSON(`${s.name.replace(/\s/g,"-")}.json`,{name:s.name,pct:s.pct,status:s.status,controls:s.controls,auditLog:AUDIT_LOG})}
                onTXT={()=>dlTXT(`${s.name.replace(/\s/g,"-")}-evidence.txt`,complianceTXT(s.name))}
                onUpload={handleUpload}
                uploadLabel="Upload"
              />
            </SectionHeader>
            <div style={{padding:"1rem 1.25rem"}}>
              <div style={{fontSize:"2rem",fontWeight:800,color:s.color,marginBottom:"0.25rem"}}>{s.pct}%</div>
              <div style={{fontSize:"0.8125rem",color:S.muted,marginBottom:"0.75rem"}}>Controls passing</div>
              <div style={{padding:"0.625rem 0.75rem",backgroundColor:s.color+"12",borderRadius:8,border:`1px solid ${s.color}30`,marginBottom:"0.75rem"}}>
                <div style={{fontSize:"0.72rem",fontWeight:600,color:s.color,marginBottom:2}}>One-click export ready</div>
                <div style={{fontSize:"0.7rem",color:S.muted}}>Timestamped evidence package — full audit chain.</div>
              </div>
              <div style={{display:"flex",gap:"0.375rem",flexWrap:"wrap"}}>
                <Btn onClick={()=>dlTXT(`${s.name.replace(/\s/g,"-")}-full.txt`,complianceTXT(s.name))} variant="success" size="xs"><FileText style={{width:11,height:11}}/> Full report</Btn>
                <Btn onClick={()=>dlCSV(`${s.name.replace(/\s/g,"-")}-evidence.csv`,AUDIT_LOG.map(e=>({id:e.id,timestamp:e.timestamp,action:e.action,target:e.target,policy:e.policy,outcome:e.outcome,confidence:e.confidence})))} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> Evidence CSV</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Incidents tab ───────────────────────────────────────────────
function IncidentsTab() {
  const { incidents: liveIncidents } = useDash();
  const activeIncidents = liveIncidents.length > 0 ? liveIncidents as typeof INCIDENTS : INCIDENTS;
  const [open, setOpen] = useState<string|null>(activeIncidents[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = activeIncidents.filter(i=>{
    const q = search.toLowerCase();
    return (!q||i.title.toLowerCase().includes(q)||i.id.toLowerCase().includes(q)) &&
      (sevFilter==="all"||i.severity===sevFilter) &&
      (statusFilter==="all"||i.status===statusFilter);
  });

  const toRows = (inc: typeof activeIncidents) => inc.map(i=>({id:i.id,title:i.title,severity:i.severity,status:i.status,detectedAt:i.detectedAt,resolvedAt:i.resolvedAt||"active",identities:i.identitiesAffected.join("|"),timelineSteps:i.timeline.length}));

  const handleImport = (file:File) => {
    alert(`Import accepted: ${file.name}\nIn production, ingests incidents from your SIEM (Splunk, CrowdStrike, Sentinel) in JSON or CSV format.`);
  };

  return (
    <Card>
      <SectionHeader title="Incident timeline" count={filtered.length}>
        <Inp value={search} onChange={setSearch} placeholder="Search incidents…"/>
        <Sel value={sevFilter} onChange={setSevFilter} options={[{v:"all",l:"All severity"},{v:"critical",l:"Critical"},{v:"high",l:"High"},{v:"medium",l:"Medium"}]}/>
        <Sel value={statusFilter} onChange={setStatusFilter} options={[{v:"all",l:"All status"},{v:"active",l:"Active"},{v:"resolved",l:"Resolved"}]}/>
        <DBar
          onCSV={()=>dlCSV("incidents.csv",toRows(filtered))}
          onJSON={()=>dlJSON("incidents.json",filtered)}
          onTXT={()=>dlTXT("incident-report.txt",filtered.map(inc=>`=== ${inc.id} ===\n${inc.title}\nSeverity: ${inc.severity} | Status: ${inc.status}\nDetected: ${inc.detectedAt} | Resolved: ${inc.resolvedAt||"active"}\n\nTimeline:\n${inc.timeline.map(t=>`  [${t.time}] [${t.phase}] ${t.event}`).join("\n")}`).join("\n\n"))}
          onUpload={handleImport}
          uploadLabel="Import incidents"
        />
      </SectionHeader>
      <div style={{padding:"1rem 1.25rem",display:"flex",flexDirection:"column",gap:"0.875rem"}}>
        {filtered.map(inc=>(
          <div key={inc.id} style={{border:`1px solid ${inc.severity==="critical"?"rgba(239,68,68,0.3)":inc.severity==="high"?"rgba(249,115,22,0.25)":"rgba(245,158,11,0.2)"}`,borderRadius:10,overflow:"hidden"}}>
            <button onClick={()=>setOpen(open===inc.id?null:inc.id)}
              style={{width:"100%",padding:"0.875rem 1.25rem",display:"flex",alignItems:"center",gap:"0.625rem",backgroundColor:inc.severity==="critical"?"rgba(239,68,68,0.07)":inc.severity==="high"?"rgba(249,115,22,0.06)":"rgba(245,158,11,0.06)",border:"none",cursor:"pointer",textAlign:"left"}}>
              <Badge color={sevColor[inc.severity]}>{inc.severity}</Badge>
              <Badge color={inc.status==="active"?"#ef4444":"#34d399"}>{inc.status}</Badge>
              <span style={{flex:1,fontSize:"0.9375rem",fontWeight:600,color:S.text}}>{inc.title}</span>
              <span style={{fontSize:"0.75rem",color:S.muted}}>{inc.id}</span>
              <ChevronDown style={{width:13,height:13,color:S.muted,transform:open===inc.id?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}/>
            </button>
            {open===inc.id && (
              <div style={{padding:"1rem 1.25rem",backgroundColor:"rgba(255,255,255,0.02)"}}>
                <div style={{display:"flex",gap:"1.5rem",marginBottom:"0.875rem",fontSize:"0.8125rem",color:S.muted,flexWrap:"wrap"}}>
                  <span>Detected: <strong style={{color:S.text}}>{inc.detectedAt}</strong></span>
                  {inc.resolvedAt&&<span>Resolved: <strong style={{color:"#34d399"}}>{inc.resolvedAt}</strong></span>}
                  <span>Identities: <strong style={{color:S.text}}>{inc.identitiesAffected.join(", ")}</strong></span>
                </div>
                <div style={{position:"relative",paddingLeft:"1.25rem"}}>
                  <div style={{position:"absolute",left:6,top:8,bottom:8,width:1,backgroundColor:S.border}}/>
                  {inc.timeline.map((t,ti)=>(
                    <div key={ti} style={{display:"flex",gap:"0.625rem",marginBottom:"0.625rem",position:"relative"}}>
                      <div style={{position:"absolute",left:-14,top:4,width:7,height:7,borderRadius:"50%",backgroundColor:phaseColor[t.phase],border:`2px solid ${S.bg}`,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:"0.375rem",alignItems:"center",marginBottom:"0.2rem"}}>
                          <span style={{fontSize:"0.72rem",fontFamily:"monospace",color:S.muted}}>{t.time}</span>
                          <Badge color={phaseColor[t.phase]}>{t.phase}</Badge>
                        </div>
                        <div style={{fontSize:"0.875rem",color:S.soft,lineHeight:1.4}}>{t.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:"0.875rem",display:"flex",gap:"0.375rem",flexWrap:"wrap"}}>
                  <Btn onClick={()=>dlTXT(`${inc.id}-timeline.txt`,`=== ${inc.id} ===\n${inc.title}\n\nTimeline:\n${inc.timeline.map(t=>`[${t.time}] [${t.phase}] ${t.event}`).join("\n")}`)} variant="default" size="xs"><Download style={{width:11,height:11}}/> Export timeline</Btn>
                  <Btn onClick={()=>dlCSV(`${inc.id}.csv`,[{id:inc.id,title:inc.title,severity:inc.severity,status:inc.status,detected:inc.detectedAt,resolved:inc.resolvedAt||"active",identities:inc.identitiesAffected.join("|")}])} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> CSV</Btn>
                  <Btn onClick={()=>dlJSON(`${inc.id}.json`,inc)} variant="ghost" size="xs"><Download style={{width:11,height:11}}/> JSON</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Policies tab ────────────────────────────────────────────────
function PoliciesTab() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<Policy|null>(null);
  const [adding, setAdding] = useState(false);
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({active:true,fired:0,category:"Remediate"});

  const filtered = policies.filter(p=>
    (catFilter==="all"||p.category===catFilter) &&
    (!search||p.name.toLowerCase().includes(search)||p.trigger.toLowerCase().includes(search))
  );

  const toggle = (id:string) => setPolicies(ps=>ps.map(p=>p.id===id?{...p,active:!p.active}:p));
  const save   = (p:Policy)  => { setPolicies(ps=>ps.map(x=>x.id===p.id?p:x)); setEditing(null); };
  const del    = (id:string) => setPolicies(ps=>ps.filter(p=>p.id!==id));
  const addNew = () => {
    if (!newPolicy.name||!newPolicy.trigger||!newPolicy.action) return alert("Name, trigger, and action are required.");
    const np: Policy = {
      id:`P-CUSTOM-${Date.now()}`,
      name:newPolicy.name||"", trigger:newPolicy.trigger||"",
      action:newPolicy.action||"", active:true, fired:0,
      category:newPolicy.category||"Remediate",
      threshold:newPolicy.threshold, notify:newPolicy.notify,
    };
    setPolicies(ps=>[...ps,np]);
    setAdding(false);
    setNewPolicy({active:true,fired:0,category:"Remediate"});
  };
  const handleImport = (file:File) => {
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const data=JSON.parse(ev.target?.result as string);
        if(Array.isArray(data)){
          setPolicies(prev=>[...prev,...data.slice(0,3).map((p:Partial<Policy>)=>({...p,id:p.id||`P-IMP-${Date.now()}`,fired:0,active:true} as Policy))]);
          alert(`Imported ${Math.min(data.length,3)} policies`);
        }
      } catch { alert("Could not parse. Use Unkov policy JSON schema: [{id,name,trigger,action,category}]"); }
    };
    r.readAsText(file);
  };

  const inputStyle: React.CSSProperties = { padding:"6px 10px",fontSize:"0.8125rem",backgroundColor:"rgba(255,255,255,0.05)",border:`1px solid ${S.border}`,borderRadius:7,color:S.text,outline:"none",width:"100%" };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      <Card>
        <SectionHeader title="Policy engine" count={filtered.length}>
          <Inp value={search} onChange={setSearch} placeholder="Search policies…"/>
          <Sel value={catFilter} onChange={setCatFilter} options={[{v:"all",l:"All phases"},{v:"Discover",l:"Discover"},{v:"Analyze",l:"Analyze"},{v:"Remediate",l:"Remediate"},{v:"Monitor",l:"Monitor"}]}/>
          <Btn onClick={()=>setAdding(!adding)} variant="primary" size="sm"><Plus style={{width:12,height:12}}/> New policy</Btn>
          <DBar
            onCSV={()=>dlCSV("policies.csv",filtered.map(p=>({id:p.id,name:p.name,trigger:p.trigger,action:p.action,active:p.active,fired:p.fired,category:p.category,threshold:p.threshold||"",notify:p.notify||""})))}
            onJSON={()=>dlJSON("policies.json",filtered)}
            onTXT={()=>dlTXT("policy-report.txt",filtered.map(p=>`[${p.id}] ${p.name}\nPhase: ${p.category} | Active: ${p.active} | Fired: ${p.fired}\nTrigger: ${p.trigger}\nAction:  ${p.action}\nThreshold: ${p.threshold||"—"} | Notify: ${p.notify||"—"}\n`).join("\n"))}
            onUpload={handleImport}
            uploadLabel="Import policies"
          />
        </SectionHeader>

        {/* Add new policy form */}
        {adding && (
          <div style={{padding:"1rem 1.25rem",borderBottom:`1px solid ${S.border}`,backgroundColor:"rgba(0,97,212,0.06)"}}>
            <div style={{fontSize:"0.875rem",fontWeight:600,color:"#60a5fa",marginBottom:"0.75rem"}}>New policy</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.5rem"}}>
              {[["Policy name","name"],["Trigger condition","trigger"],["Automated action","action"],["Threshold","threshold"],["Notify","notify"]].map(([label,key])=>(
                <div key={key}>
                  <div style={{fontSize:"0.7rem",color:S.muted,marginBottom:"0.25rem"}}>{label}</div>
                  <input value={(newPolicy as Record<string,string>)[key]||""} onChange={e=>setNewPolicy(p=>({...p,[key]:e.target.value}))} placeholder={label} style={inputStyle}/>
                </div>
              ))}
              <div>
                <div style={{fontSize:"0.7rem",color:S.muted,marginBottom:"0.25rem"}}>Phase</div>
                <select value={newPolicy.category||"Remediate"} onChange={e=>setNewPolicy(p=>({...p,category:e.target.value}))} style={inputStyle}>
                  {["Discover","Analyze","Remediate","Monitor"].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:"0.375rem"}}>
              <Btn variant="success" size="sm" onClick={addNew}>Save policy</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>setAdding(false)}>Cancel</Btn>
            </div>
          </div>
        )}

        {/* Edit modal inline */}
        {editing && (
          <div style={{padding:"1rem 1.25rem",borderBottom:`1px solid ${S.border}`,backgroundColor:"rgba(245,158,11,0.05)"}}>
            <div style={{fontSize:"0.875rem",fontWeight:600,color:"#fbbf24",marginBottom:"0.75rem"}}>Edit: {editing.id}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.5rem"}}>
              {([["name","Policy name"],["trigger","Trigger condition"],["action","Automated action"],["threshold","Threshold"],["notify","Notify"]] as [keyof Policy, string][]).map(([key,label])=>(
                <div key={key}>
                  <div style={{fontSize:"0.7rem",color:S.muted,marginBottom:"0.25rem"}}>{label}</div>
                  <input value={String(editing[key]||"")} onChange={e=>setEditing(p=>p?{...p,[key]:e.target.value}:p)} placeholder={label} style={inputStyle}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:"0.375rem"}}>
              <Btn variant="success" size="sm" onClick={()=>editing&&save(editing)}>Save changes</Btn>
              <Btn variant="ghost"   size="sm" onClick={()=>setEditing(null)}>Cancel</Btn>
            </div>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8125rem"}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${S.border}`}}>
                {["Active","ID","Name","Trigger","Action","Phase","Threshold","Notify","Fired",""].map(h=><TH key={h}>{h}</TH>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} style={{opacity:p.active?1:0.5}}>
                  <TD>
                    <button onClick={()=>toggle(p.id)} style={{width:32,height:17,borderRadius:9999,border:"none",cursor:"pointer",backgroundColor:p.active?"#34d399":"rgba(255,255,255,0.1)",position:"relative",transition:"background .2s"}}>
                      <div style={{position:"absolute",top:2,left:p.active?17:2,width:13,height:13,borderRadius:"50%",backgroundColor:"#fff",transition:"left .2s"}}/>
                    </button>
                  </TD>
                  <TD style={{fontFamily:"monospace",fontSize:"0.7rem",color:S.muted}}>{p.id}</TD>
                  <TD style={{fontWeight:600,color:S.text}}>{p.name}</TD>
                  <TD style={{color:S.soft,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.trigger}</TD>
                  <TD style={{color:S.soft,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.action}</TD>
                  <TD><Badge color={phaseColor[p.category]}>{p.category}</Badge></TD>
                  <TD style={{color:S.muted,fontSize:"0.75rem"}}>{p.threshold||"—"}</TD>
                  <TD style={{color:S.muted,fontSize:"0.75rem"}}>{p.notify||"—"}</TD>
                  <TD style={{fontWeight:700,color:p.fired>0?"#60a5fa":S.muted}}>{p.fired}</TD>
                  <TD>
                    <div style={{display:"flex",gap:"0.25rem"}}>
                      <Btn onClick={()=>setEditing({...p})} variant="ghost" size="xs">Edit</Btn>
                      <Btn onClick={()=>dlJSON(`policy-${p.id}.json`,p)} variant="ghost" size="xs"><Download style={{width:10,height:10}}/></Btn>
                      <Btn onClick={()=>del(p.id)} variant="danger" size="xs"><X style={{width:10,height:10}}/></Btn>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Integrations tab ────────────────────────────────────────────
function IntegrationsTab() {
  const { integrations: liveInts } = useDash();
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  useEffect(() => { if (liveInts.length > 0) setIntegrations(liveInts as typeof INTEGRATIONS); }, [liveInts]);
  const [syncing, setSyncing] = useState<string|null>(null);
  const [detail, setDetail] = useState<Integration|null>(null);

  const sync = (name:string) => {
    setSyncing(name);
    setTimeout(()=>{
      setIntegrations(prev=>prev.map(i=>i.name===name?{...i,lastSync:"just now",errors:0}:i));
      setSyncing(null);
    },1800);
  };

  const handleUpload = (file:File) => {
    alert(`Config import: ${file.name}\nIn production, this ingests an integration config file (connector credentials, field mappings, sync schedule) in JSON format.`);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:detail?"1fr 320px":"1fr",gap:"1.25rem"}}>
      <Card>
        <SectionHeader title="Integration health" sub={`${integrations.filter(i=>i.status==="healthy").length}/${integrations.length} healthy`}>
          <DBar
            onCSV={()=>dlCSV("integrations.csv",integrations.map(i=>({name:i.name,type:i.type,status:i.status,lastSync:i.lastSync,records:i.records??0,errors:i.errors,latency:i.latency,region:i.region||"",version:i.version||""})))}
            onJSON={()=>dlJSON("integrations.json",integrations)}
            onTXT={()=>dlTXT("integrations-report.txt",integrations.map(i=>`${i.name} (${i.type})\nStatus: ${i.status} | Last sync: ${i.lastSync} | Errors: ${i.errors} | Latency: ${i.latency}\nRegion: ${i.region||"—"} | Version: ${i.version||"—"}\n`).join("\n"))}
            onUpload={handleUpload}
            uploadLabel="Import config"
          />
        </SectionHeader>
        {/* Summary bar */}
        <div style={{padding:"0.75rem 1.25rem",borderBottom:`1px solid ${S.border}`,display:"flex",gap:"1.5rem"}}>
          {[["Healthy",integrations.filter(i=>i.status==="healthy").length,"#34d399"],["Warning",integrations.filter(i=>i.status==="warning").length,"#f59e0b"],["Total records",integrations.reduce((s,i)=>s+(i.records||0),0).toLocaleString(),"#60a5fa"],["Avg latency",`${Math.round(integrations.reduce((s,i)=>s+parseInt(i.latency),0)/integrations.length)}ms`,"#a78bfa"]].map(([l,v,c])=>(
            <div key={l as string}>
              <div style={{fontSize:"0.7rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l as string}</div>
              <div style={{fontSize:"1.25rem",fontWeight:800,color:c as string}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1px",backgroundColor:S.border}}>
          {integrations.map(int=>(
            <div key={int.name} style={{padding:"1.25rem",backgroundColor:S.bg,display:"flex",gap:"0.875rem",alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,backgroundColor:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8125rem",fontWeight:800,color:S.text,flexShrink:0}}>{int.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem"}}>
                  <span style={{fontSize:"0.9375rem",fontWeight:600,color:S.text}}>{int.name}</span>
                  <div style={{width:6,height:6,borderRadius:"50%",backgroundColor:statusColor[int.status],animation:int.status==="healthy"?"pulse2 2s infinite":"none"}}/>
                  <Badge color={statusColor[int.status]}>{int.status}</Badge>
                </div>
                <div style={{fontSize:"0.72rem",color:S.muted,marginBottom:"0.5rem"}}>{int.type}{int.region?` · ${int.region}`:""}{int.version?` · v${int.version}`:""}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.25rem",fontSize:"0.75rem",marginBottom:"0.5rem"}}>
                  {[["Last sync",int.lastSync],["Latency",int.latency],...(int.records?[["Records",int.records.toLocaleString()]]:[]),["Errors",int.errors.toString()]].map(([k,v])=>(
                    <div key={k as string}>
                      <span style={{color:S.muted}}>{k}: </span>
                      <span style={{color:(k==="Errors"&&Number(v)>0)?"#ef4444":S.soft,fontWeight:(k==="Errors"&&Number(v)>0)?700:400}}>{v as string}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"0.25rem",flexWrap:"wrap"}}>
                  <Btn onClick={()=>sync(int.name)} variant="primary" size="xs" >
                    <RefreshCw style={{width:10,height:10,animation:syncing===int.name?"spin 1s linear infinite":"none"}}/> {syncing===int.name?"Syncing…":"Sync now"}
                  </Btn>
                  <Btn onClick={()=>setDetail(detail?.name===int.name?null:int)} variant="ghost" size="xs"><Eye style={{width:10,height:10}}/> Details</Btn>
                  <Btn onClick={()=>dlJSON(`integration-${int.name.toLowerCase()}.json`,int)} variant="ghost" size="xs"><Download style={{width:10,height:10}}/></Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {detail && (
        <Card style={{alignSelf:"start"}}>
          <SectionHeader title={detail.name}>
            <Badge color={statusColor[detail.status]}>{detail.status}</Badge>
            <Btn onClick={()=>setDetail(null)} variant="ghost" size="xs"><X style={{width:11,height:11}}/></Btn>
          </SectionHeader>
          <div style={{padding:"1rem 1.25rem",display:"flex",flexDirection:"column",gap:"0.875rem"}}>
            {[["Type",detail.type],["Region",detail.region||"—"],["Version",detail.version||"—"],["Last sync",detail.lastSync],["Latency",detail.latency],["Errors (24h)",detail.errors.toString()],["Records synced",detail.records?.toLocaleString()||"N/A"]].map(([k,v])=>(
              <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"0.5rem 0",borderBottom:`1px solid ${S.border}`}}>
                <span style={{fontSize:"0.8125rem",color:S.muted}}>{k as string}</span>
                <span style={{fontSize:"0.8125rem",fontWeight:500,color:k==="Errors (24h)"&&detail.errors>0?"#ef4444":S.text}}>{v as string}</span>
              </div>
            ))}
            {detail.status==="warning" && (
              <div style={{padding:"0.75rem",backgroundColor:"rgba(245,158,11,0.1)",borderRadius:8,border:"1px solid rgba(245,158,11,0.3)"}}>
                <div style={{fontSize:"0.75rem",fontWeight:600,color:"#fbbf24",marginBottom:"0.25rem"}}>Warning — {detail.errors} errors</div>
                <div style={{fontSize:"0.72rem",color:S.muted}}>High latency detected (890ms). Check network connectivity and API rate limits. Last 3 syncs failed to retrieve full record set.</div>
              </div>
            )}
            <div style={{display:"flex",gap:"0.375rem",flexWrap:"wrap"}}>
              <Btn onClick={()=>sync(detail.name)} variant="primary" size="sm"><RefreshCw style={{width:11,height:11}}/> Force sync</Btn>
              <Btn onClick={()=>dlJSON(`config-${detail.name.toLowerCase()}.json`,detail)} variant="default" size="sm"><Download style={{width:11,height:11}}/> Export config</Btn>
            </div>
          </div>
        </Card>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── ROI tab ─────────────────────────────────────────────────────
function ROITab() {
  const [manualHours, setManualHours] = useState(120);
  const [hourlyRate,  setHourlyRate]  = useState(75);
  const [incidents,   setIncidents]   = useState(2);
  const [acv,         setAcv]         = useState(60);
  const [activeTab,   setActiveTab]   = useState<"year1"|"5yr">("year1");

  const saved     = Math.round(manualHours * 0.9);
  const qtrSave   = Math.round(saved * hourlyRate);
  const annSave   = qtrSave * 4;
  const incSave   = incidents * 1900000;
  const total     = annSave + incSave;
  const contract  = acv * 1000;
  const net       = total - contract;
  const roiPct    = Math.round((net/contract)*100);

  const yr5 = [1,2,3,4,5].map(y=>({
    year:`Year ${y}`,
    labor:Math.round(annSave*(1+y*0.05)),
    incidents:Math.round(incSave*(1+y*0.1)),
    cost:Math.round(contract*(1+y*0.08)),
    net:Math.round((annSave*(1+y*0.05)+incSave*(1+y*0.1))-contract*(1+y*0.08)),
  }));

  const rows = [
    { label:"Manual review hours saved/qtr", value:`${saved} hrs`,              detail:`${manualHours}h → ${manualHours-saved}h`, color:"#34d399" },
    { label:"Quarterly IT labor savings",    value:`$${qtrSave.toLocaleString()}`,detail:`${saved}h × $${hourlyRate}/hr`,          color:"#34d399" },
    { label:"Annual IT labor savings",       value:`$${annSave.toLocaleString()}`,detail:"4 quarters",                             color:"#34d399" },
    { label:"Incident cost avoidance",       value:`$${incSave.toLocaleString()}`,detail:`${incidents} × $4.2M avg (IBM 2025)`,   color:"#60a5fa" },
    { label:"Total 1-year benefit",          value:`$${total.toLocaleString()}`,  detail:"Labor + incidents",                     color:"#a78bfa" },
    { label:"Annual contract cost",          value:`$${contract.toLocaleString()}`,detail:`$${acv}K ACV`,                        color:"#f59e0b" },
    { label:"Net benefit year 1",            value:`$${net.toLocaleString()}`,    detail:"After subscription",                    color:"#34d399" },
    { label:"ROI",                           value:`${roiPct}%`,                  detail:"(Net / Contract) × 100",               color:"#34d399" },
  ];

  const handleImport = (file:File) => {
    alert(`Import actuals: ${file.name}\nIn production, this updates the model with real labor costs and incident data from your ITSM/finance system.`);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"1.25rem"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        <Card>
          <SectionHeader title="ROI calculator">
            <div style={{display:"flex",gap:"0.25rem"}}>
              {(["year1","5yr"] as const).map(t=>(
                <Btn key={t} onClick={()=>setActiveTab(t)} variant={activeTab===t?"primary":"ghost"} size="xs">{t==="year1"?"Year 1":"5-year"}</Btn>
              ))}
            </div>
            <DBar
              onCSV={()=>dlCSV("roi.csv",activeTab==="year1"?rows.map(r=>({metric:r.label,value:r.value,calculation:r.detail})):yr5)}
              onJSON={()=>dlJSON("roi.json",{inputs:{manualHours,hourlyRate,incidents,acvK:acv},year1:rows.map(r=>({metric:r.label,value:r.value})),fiveYear:yr5})}
              onTXT={()=>dlTXT("roi-board.txt",`UNKOV ROI ANALYSIS\n${new Date().toISOString()}\n\nINPUTS\nManual hours/qtr: ${manualHours}\nIT hourly rate: $${hourlyRate}\nIncidents prevented/yr: ${incidents}\nAnnual contract value: $${contract.toLocaleString()}\n\n${rows.map(r=>`${r.label}: ${r.value} (${r.detail})`).join("\n")}\n\n5-YEAR PROJECTION\n${yr5.map(y=>`${y.year}: Labor $${y.labor.toLocaleString()} + Incidents $${y.incidents.toLocaleString()} - Cost $${y.cost.toLocaleString()} = Net $${y.net.toLocaleString()}`).join("\n")}`)}
              onUpload={handleImport}
              uploadLabel="Import actuals"
            />
          </SectionHeader>
          <div style={{padding:"1.25rem"}}>
            {/* Sliders */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
              {[{label:"Manual review hrs/qtr",min:40,max:240,val:manualHours,set:setManualHours},{label:"IT hourly rate ($)",min:30,max:200,val:hourlyRate,set:setHourlyRate},{label:"Incidents prevented/yr",min:0,max:10,val:incidents,set:setIncidents},{label:"ACV ($K)",min:20,max:200,val:acv,set:setAcv}].map(s=>(
                <div key={s.label} style={{backgroundColor:"rgba(255,255,255,0.03)",borderRadius:9,padding:"0.75rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.25rem"}}>
                    <span style={{fontSize:"0.72rem",color:S.muted}}>{s.label}</span>
                    <span style={{fontSize:"0.875rem",fontWeight:800,color:"#60a5fa"}}>{s.val}{s.label.includes("$K")?"K":""}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step="1" value={s.val} onChange={e=>s.set(parseInt(e.target.value))} style={{width:"100%",accentColor:"#0061d4"}}/>
                </div>
              ))}
            </div>
            {/* Year 1 breakdown */}
            {activeTab==="year1" && (
              <div style={{display:"flex",flexDirection:"column",gap:"0.375rem"}}>
                {rows.map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.625rem 0.875rem",backgroundColor:i>=6?"rgba(52,211,153,0.07)":"rgba(255,255,255,0.02)",borderRadius:8,border:`1px solid ${i>=6?"rgba(52,211,153,0.2)":S.border}`}}>
                    <div>
                      <div style={{fontSize:"0.875rem",color:S.text,fontWeight:i>=6?600:400}}>{r.label}</div>
                      <div style={{fontSize:"0.7rem",color:S.muted}}>{r.detail}</div>
                    </div>
                    <span style={{fontSize:i>=6?"1.125rem":"1rem",fontWeight:700,color:r.color}}>{r.value}</span>
                  </div>
                ))}
              </div>
            )}
            {/* 5-year table */}
            {activeTab==="5yr" && (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8125rem"}}>
                  <thead><tr style={{borderBottom:`1px solid ${S.border}`}}>{["Year","Labor savings","Incident savings","Contract cost","Net benefit"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                  <tbody>
                    {yr5.map((y,i)=>(
                      <tr key={y.year}>
                        <TD style={{fontWeight:600,color:S.text}}>{y.year}</TD>
                        <TD style={{color:"#34d399"}}>${y.labor.toLocaleString()}</TD>
                        <TD style={{color:"#60a5fa"}}>${y.incidents.toLocaleString()}</TD>
                        <TD style={{color:"#f59e0b"}}>${y.cost.toLocaleString()}</TD>
                        <TD style={{fontWeight:700,color:y.net>0?"#34d399":"#ef4444"}}>${y.net.toLocaleString()}</TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
        {/* MSP multi-tenant */}
        <Card>
          <SectionHeader title="MSP — multi-tenant view" count={TENANTS.length}>
            <DBar onCSV={()=>dlCSV("tenants.csv",TENANTS.map(t=>({id:t.id,name:t.name,industry:t.industry,employees:t.employees,identities:t.identities,risk:t.risk,status:t.status,orphans:t.orphans,incidents:t.incidents,mrr:t.mrr})))} onJSON={()=>dlJSON("tenants.json",TENANTS)}/>
          </SectionHeader>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8125rem"}}>
              <thead><tr style={{borderBottom:`1px solid ${S.border}`}}>{["Tenant","Industry","Identities","Risk","Status","Orphans","AI Agents","Incidents","MRR"].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {TENANTS.map(t=>(
                  <tr key={t.id}>
                    <TD><div style={{fontWeight:600,color:S.text}}>{t.name}</div><div style={{fontSize:"0.7rem",color:S.muted}}>{t.id}</div></TD>
                    <TD style={{color:S.soft}}>{t.industry}</TD>
                    <TD style={{color:S.soft}}>{t.identities.toLocaleString()}</TD>
                    <TD>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <div style={{width:40,height:4,backgroundColor:"rgba(255,255,255,0.06)",borderRadius:9999}}>
                          <div style={{height:"100%",width:`${t.risk}%`,backgroundColor:t.risk>=70?"#ef4444":t.risk>=45?"#f59e0b":"#34d399",borderRadius:9999}}/>
                        </div>
                        <span style={{fontSize:"0.8125rem",fontWeight:700,color:t.risk>=70?"#ef4444":t.risk>=45?"#f59e0b":"#34d399"}}>{t.risk}</span>
                      </div>
                    </TD>
                    <TD><Badge color={statusColor[t.status]}>{t.status}</Badge></TD>
                    <TD style={{color:t.orphans>20?"#ef4444":t.orphans>5?"#f59e0b":"#34d399",fontWeight:600}}>{t.orphans}</TD>
                    <TD style={{color:S.soft}}>{t.ai_agents}</TD>
                    <TD style={{color:t.incidents>0?"#ef4444":"#34d399",fontWeight:600}}>{t.incidents}</TD>
                    <TD style={{color:"#34d399",fontWeight:600}}>${t.mrr.toLocaleString()}</TD>
                  </tr>
                ))}
                <tr style={{borderTop:`2px solid ${S.border}`,backgroundColor:"rgba(255,255,255,0.02)"}}>
                  <TD style={{fontWeight:700,color:S.text}} colSpan={2}>Totals</TD>
                  <TD style={{fontWeight:700,color:"#60a5fa"}}>{TENANTS.reduce((s,t)=>s+t.identities,0).toLocaleString()}</TD>
                  <TD style={{fontWeight:700,color:S.soft}}>{Math.round(TENANTS.reduce((s,t)=>s+t.risk,0)/TENANTS.length)} avg</TD>
                  <TD/>
                  <TD style={{fontWeight:700,color:"#f59e0b"}}>{TENANTS.reduce((s,t)=>s+t.orphans,0)}</TD>
                  <TD style={{fontWeight:700,color:"#a78bfa"}}>{TENANTS.reduce((s,t)=>s+t.ai_agents,0)}</TD>
                  <TD style={{fontWeight:700,color:"#ef4444"}}>{TENANTS.reduce((s,t)=>s+t.incidents,0)}</TD>
                  <TD style={{fontWeight:700,color:"#34d399"}}>${TENANTS.reduce((s,t)=>s+t.mrr,0).toLocaleString()}</TD>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {/* ROI summary sidebar */}
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        <Card style={{padding:"1.5rem",textAlign:"center"}}>
          <div style={{fontSize:"0.7rem",color:S.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.625rem"}}>Year 1 ROI</div>
          <div style={{fontSize:"3.25rem",fontWeight:800,color:"#34d399",letterSpacing:"-0.04em",marginBottom:"0.25rem"}}>{roiPct}%</div>
          <div style={{fontSize:"0.8125rem",color:S.muted,marginBottom:"1rem"}}>Return on investment</div>
          <div style={{padding:"0.875rem",backgroundColor:"rgba(52,211,153,0.08)",borderRadius:9,border:"1px solid rgba(52,211,153,0.2)",marginBottom:"1rem"}}>
            <div style={{fontSize:"1.5rem",fontWeight:800,color:"#34d399"}}>${net.toLocaleString()}</div>
            <div style={{fontSize:"0.72rem",color:S.muted,marginTop:2}}>Net benefit year 1</div>
          </div>
          <Btn onClick={()=>dlTXT("roi-board-pack.txt",`UNKOV ROI BOARD PACKAGE\n\nROI: ${roiPct}%\nNet benefit: $${net.toLocaleString()}\nContract: $${contract.toLocaleString()}\nHours saved/qtr: ${saved}\nIncidents prevented/yr: ${incidents}\n\n5-YEAR NET BENEFITS\n${yr5.map(y=>`${y.year}: $${y.net.toLocaleString()}`).join("\n")}`)} variant="success" size="sm">
            <Download style={{width:12,height:12}}/> Board pack
          </Btn>
        </Card>
        <Card>
          <SectionHeader title="Pilot proof points"/>
          <div style={{padding:"0.875rem 1.25rem"}}>
            {[["100%","Pilot retention"],["90%","Manual labor reduction"],["< 30 min","Live dashboard"],["$4.2M","Avg incident avoided"],["340ms","Decision latency"],["144:1","NHI:human ratio"]].map(([v,l])=>(
              <div key={l as string} style={{display:"flex",gap:"0.75rem",alignItems:"center",padding:"0.5rem 0",borderBottom:`1px solid ${S.border}`}}>
                <span style={{fontSize:"1rem",fontWeight:800,color:"#34d399",minWidth:72,textAlign:"right"}}>{v as string}</span>
                <span style={{fontSize:"0.8125rem",color:S.muted}}>{l as string}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tabs config ─────────────────────────────────────────────────
const TABS = [
  { id:"overview",    label:"Overview",     icon:Activity    },
  { id:"identities",  label:"Identities",   icon:Users        },
  { id:"access",      label:"Access queue", icon:Lock         },
  { id:"audit",       label:"Audit trail",  icon:FileText     },
  { id:"compliance",  label:"Compliance",   icon:Shield       },
  { id:"incidents",   label:"Incidents",    icon:AlertTriangle},
  { id:"policies",    label:"Policies",     icon:Settings     },
  { id:"integrations",label:"Integrations", icon:ExternalLink        },
  { id:"roi",         label:"ROI & MSP",    icon:TrendingDown },
];

// ─── Main export ─────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  // ── Live data from API ────────────────────────────────────────
  const { summary, identities: liveIdentities, auditLog: liveAuditLog,
          incidents: liveIncidents, integrations: liveIntegrations,
          isLive, loading } = useDashboardData();

  // Map live API data to dashboard types (fallback to static if API not configured)
  const ctxValue: DashboardCtx = {
    identities:   liveIdentities.length > 0 ? liveIdentities as typeof IDENTITIES : IDENTITIES,
    auditLog:     liveAuditLog.length   > 0 ? liveAuditLog   as typeof AUDIT_LOG  : AUDIT_LOG,
    incidents:    liveIncidents.length  > 0 ? liveIncidents  as typeof INCIDENTS  : INCIDENTS,
    integrations: liveIntegrations.length > 0 ? liveIntegrations as typeof INTEGRATIONS : INTEGRATIONS,
    summary,
    isLive,
    loading,
  };

  const views: Record<string,React.ReactNode> = {
    overview:     <OverviewTab/>,
    identities:   <IdentitiesTab/>,
    access:       <AccessTab/>,
    audit:        <AuditTab/>,
    compliance:   <ComplianceTab/>,
    incidents:    <IncidentsTab/>,
    policies:     <PoliciesTab/>,
    integrations: <IntegrationsTab/>,
    roi:          <ROITab/>,
  };

  return (
    <DashCtx.Provider value={ctxValue}>
    <div className="min-h-screen" style={{ backgroundColor:S.bg, color:S.text }}>
      {loading && isLive && (
        <div style={{ position:"fixed", top:72, right:16, zIndex:100, padding:"6px 12px",
          backgroundColor:"rgba(0,97,212,0.15)", border:"1px solid rgba(0,97,212,0.3)",
          borderRadius:8, fontSize:"0.75rem", color:"#60a5fa", display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#60a5fa", animation:"pulse2 2s infinite" }}/>
          Loading live data...
        </div>
      )}
      {isLive && !loading && (
        <div style={{ position:"fixed", top:72, right:16, zIndex:100, padding:"6px 12px",
          backgroundColor:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)",
          borderRadius:8, fontSize:"0.75rem", color:"#34d399", display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:"#34d399", animation:"pulse2 2s infinite" }}/>
          Live data
        </div>
      )}
      <Header/>
      <div style={{ paddingTop:68, minHeight:"100vh" }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.75rem 1.5rem", borderBottom:`1px solid ${S.border}`, gap:"1rem", flexWrap:"wrap" }}>
          {/* Left: title */}
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:"0.72rem", color:S.muted, textTransform:"uppercase", letterSpacing:"0.12em" }}>Identity Command Center</div>
            <h1 style={{ fontSize:"1.125rem", fontWeight:800, color:"#f1f5f9", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.company ?? "Identity Command Center"}</h1>
          </div>

          {/* Right: actions */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexShrink:0 }}>
            {/* Live status pill */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.3rem 0.75rem", backgroundColor:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:9999, fontSize:"0.75rem", color:"#34d399", whiteSpace:"nowrap" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", backgroundColor:"#34d399", animation:"pulse2 2s infinite" }}/>
              Live
            </div>
            {/* Divider */}
            <div style={{ width:1, height:20, backgroundColor:S.border }}/>
            {/* User controls */}
            {user && (
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                {user.role === "admin" && (
                  <Btn onClick={()=>navigate("/admin/upgrade")} variant="default" size="sm">Admin</Btn>
                )}
                <Btn onClick={()=>navigate("/")} variant="ghost" size="sm">← Home</Btn>
                <Btn onClick={async()=>{await logout();navigate("/login");}} variant="default" size="sm">Sign out</Btn>
              </div>
            )}
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display:"flex", padding:"0 2rem", borderBottom:`1px solid ${S.border}`, overflowX:"auto" }}>
          {TABS.map(t=>{
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ display:"flex", alignItems:"center", gap:"0.3rem", padding:"0.75rem 1rem", fontSize:"0.875rem", fontWeight:600, color:tab===t.id?"#60a5fa":S.muted, border:"none", borderBottom:`2px solid ${tab===t.id?"#60a5fa":"transparent"}`, background:"none", cursor:"pointer", whiteSpace:"nowrap", transition:"color .15s, border-color .15s" }}>
                <Icon style={{width:13,height:13}}/>{t.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding:"1.5rem 2rem" }}>
          {views[tab]}
        </div>
      </div>
      <Footer/>
      <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
    </DashCtx.Provider>
  );
}
