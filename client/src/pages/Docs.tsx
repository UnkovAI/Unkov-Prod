import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookOpen, ChevronRight, ChevronDown, Search, Copy, CheckCircle,
  ExternalLink, Terminal, Shield, AlertTriangle, Clock, Zap, Key,
  GitBranch, Users, Bot, Globe, Database, Code2, FileText, Lock,
  Settings, Activity, Building2, Layers
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}
interface DocConnector {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  tagline: string;
  sections: DocSection[];
}

// ── Design tokens ─────────────────────────────────────────────────
const S = {
  bg:     "#faf9f7",
  white:  "#ffffff",
  border: "#e5e7eb",
  navy:   "#00297a",
  blue:   "#0061d4",
  text:   "#111827",
  muted:  "#6b7280",
  soft:   "#374151",
  green:  "#059669",
  amber:  "#d97706",
  red:    "#dc2626",
  lgreen: "#f0fdf4",
  lamber: "#fffbeb",
  lred:   "#fef2f2",
  lnavy:  "#e8f0fe",
  code:   "#1e293b",
};

// ── Code block ────────────────────────────────────────────────────
function Code({ children, lang = "bash" }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", margin: "1rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "#0f172a", borderRadius: "8px 8px 0 0",
        padding: "0.375rem 0.875rem", borderBottom: "1px solid #334155" }}>
        <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{lang}</span>
        <button onClick={() => { navigator.clipboard?.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem",
            color: copied ? S.green : "#64748b", background: "none", border: "none",
            cursor: "pointer", padding: "2px 6px", borderRadius: 4 }}>
          {copied ? <CheckCircle style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ backgroundColor: S.code, color: "#86efac", padding: "1rem 1.125rem",
        borderRadius: "0 0 8px 8px", fontSize: "0.8125rem", lineHeight: 1.7,
        overflow: "auto", margin: 0, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
        whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ── Callout ───────────────────────────────────────────────────────
function Note({ type = "info", children }: { type?: "info" | "warning" | "tip" | "danger"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: S.lnavy, border: S.blue,  icon: <BookOpen  style={{ width: 15, height: 15, color: S.blue,  flexShrink: 0 }} />, label: "Note" },
    tip:     { bg: S.lgreen,border: S.green, icon: <Zap       style={{ width: 15, height: 15, color: S.green, flexShrink: 0 }} />, label: "Tip"  },
    warning: { bg: S.lamber,border: S.amber, icon: <AlertTriangle style={{ width: 15, height: 15, color: S.amber, flexShrink: 0 }} />, label: "Warning" },
    danger:  { bg: S.lred,  border: S.red,   icon: <Shield    style={{ width: 15, height: 15, color: S.red,   flexShrink: 0 }} />, label: "Important" },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.border}`,
      borderRadius: 8, padding: "0.875rem 1rem", margin: "1rem 0",
      display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
      <div style={{ paddingTop: 2 }}>{s.icon}</div>
      <div style={{ fontSize: "0.875rem", color: S.soft, lineHeight: 1.65 }}>
        <strong style={{ color: S.text, display: "block", marginBottom: 2, fontSize: "0.8125rem" }}>{s.label}</strong>
        {children}
      </div>
    </div>
  );
}

// ── Step list ─────────────────────────────────────────────────────
function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
      {items.map((step, i) => (
        <li key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
            background: S.navy, color: S.white, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, marginTop: 2 }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: S.text, marginBottom: "0.375rem", fontSize: "0.9375rem" }}>{step.title}</div>
            <div style={{ color: S.soft, fontSize: "0.875rem", lineHeight: 1.7 }}>{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Permission table ──────────────────────────────────────────────
function Perms({ rows }: { rows: [string, string, string][] }) {
  return (
    <div style={{ overflowX: "auto", margin: "1rem 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
        <thead>
          <tr style={{ backgroundColor: S.lnavy }}>
            {["Permission / Scope", "Required?", "Purpose"].map(h => (
              <th key={h} style={{ padding: "0.5rem 0.875rem", textAlign: "left",
                fontWeight: 600, color: S.navy, borderBottom: `1px solid ${S.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([perm, req, purpose], i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? S.white : S.bg }}>
              <td style={{ padding: "0.5rem 0.875rem", borderBottom: `1px solid ${S.border}`,
                fontFamily: "monospace", fontSize: "0.8rem", color: S.blue }}>{perm}</td>
              <td style={{ padding: "0.5rem 0.875rem", borderBottom: `1px solid ${S.border}` }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px",
                  borderRadius: 9999, background: req === "Required" ? S.lred : S.lgreen,
                  color: req === "Required" ? S.red : S.green }}>{req}</span>
              </td>
              <td style={{ padding: "0.5rem 0.875rem", borderBottom: `1px solid ${S.border}`,
                color: S.soft }}>{purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONNECTOR DOC CONTENT
// ═══════════════════════════════════════════════════════════════════

const CONNECTORS: DocConnector[] = [
  // ── OKTA ────────────────────────────────────────────────────────
  {
    id: "okta",
    name: "Okta",
    icon: <div style={{ width: 32, height: 32, borderRadius: 8, background: "#007dc1",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontWeight:800,fontSize:14 }}>O</div>,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Users, groups, apps, admin roles, service account detection — full lifecycle sync.",
    sections: [
      {
        id: "okta-overview",
        title: "Overview",
        content: (
          <div>
            <p>The Okta connector discovers every identity in your Okta org — human users, service accounts, AI agents (detected by naming pattern), bots, and API tokens. It maps group memberships, app assignments, and admin role grants, then scores every identity for risk using Unkov's rule engine.</p>
            <Note type="tip">The Okta connector requires only a read-only API token. It makes no changes to your Okta org. Zero risk, zero downtime.</Note>
            <h4 style={{ color: S.navy, marginTop: "1.25rem", marginBottom: "0.5rem" }}>What it discovers</h4>
            <ul style={{ color: S.soft, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>All active and deprovisioned users (ghost account detection)</li>
              <li>Group memberships and admin role assignments</li>
              <li>App assignments and SSO access scopes</li>
              <li>Service accounts (detected by login pattern: <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>svc-</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>bot-</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>ai-</code>, etc.)</li>
              <li>AI agents (detected by name: <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>agent-</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>copilot-</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>gpt-</code>)</li>
              <li>Toxic privilege combinations (e.g. SUPER_ADMIN + payroll access)</li>
              <li>Drifted identities (no login beyond configurable threshold)</li>
            </ul>
          </div>
        ),
      },
      {
        id: "okta-setup",
        title: "Setup (5 minutes)",
        content: (
          <Steps items={[
            {
              title: "Generate a read-only API token",
              body: <>In Okta Admin → <strong>Security → API → Tokens</strong> → Create Token. Name it <em>Unkov Scanner</em>. Copy the token — it shows only once.<br/>
                <Note type="warning">Use a service account user (not your personal admin account) for better audit trail separation.</Note>
              </>
            },
            {
              title: "Add credentials to .env",
              body: <Code lang="bash">{`OKTA_ORG_URL=https://your-org.okta.com
OKTA_API_TOKEN=00xyz...`}</Code>
            },
            {
              title: "Run the scan",
              body: <Code lang="bash">{`npm run okta:scan
# Or dry run first to preview without writing output:
npm run okta:scan:dry`}</Code>
            },
            {
              title: "(Optional) Seed your dev org with test data",
              body: <>For demo purposes, seed your Okta developer org with realistic test identities including toxic combos, ghost accounts, and ungoverned AI agents:
                <Code lang="bash">{`npm run seed:okta`}</Code>
              </>
            },
          ]} />
        ),
      },
      {
        id: "okta-permissions",
        title: "Required permissions",
        content: (
          <div>
            <p style={{color:S.soft,marginBottom:"0.75rem"}}>The API token must be created by a user with the following privileges:</p>
            <Perms rows={[
              ["okta.users.read",          "Required",  "List all users and their profiles"],
              ["okta.groups.read",         "Required",  "List groups and memberships"],
              ["okta.apps.read",           "Required",  "List app assignments and scopes"],
              ["okta.roles.read",          "Required",  "Detect admin role grants (SUPER_ADMIN, ORG_ADMIN, etc.)"],
              ["okta.logs.read",           "Optional",  "Last login enrichment for drift detection"],
              ["okta.users.manage",        "Never",     "Unkov does not write to Okta in read-only mode"],
            ]} />
            <Note type="info">Unkov only ever reads. The <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>okta.users.manage</code> scope is explicitly <strong>not</strong> required and should not be granted.</Note>
          </div>
        ),
      },
      {
        id: "okta-findings",
        title: "What gets flagged",
        content: (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
              {[
                { sev:"Critical", label:"SUPER_ADMIN + payroll access", desc:"Payment fraud risk — can create and approve transactions without oversight." },
                { sev:"Critical", label:"ORG_ADMIN + PHI app access", desc:"HIPAA §164.312 violation — unlimited patient data exposure." },
                { sev:"Critical", label:"AI agent with admin role", desc:"Ungoverned autonomous agent with administrator privileges." },
                { sev:"High",     label:"Departed employee still active", desc:"Account live 14+ days after HR termination (Workday cross-reference)." },
                { sev:"High",     label:"Dormant admin account", desc:"Admin role with no activity in 60+ days." },
                { sev:"Medium",   label:"Service account without owner", desc:"Non-human identity with no owner email assigned." },
              ].map(f => (
                <div key={f.label} style={{ border:`1px solid ${S.border}`, borderRadius:8, padding:"0.875rem" }}>
                  <span style={{ fontSize:"0.7rem",fontWeight:700,padding:"2px 8px",borderRadius:9999,
                    background: f.sev==="Critical"?"#fef2f2":f.sev==="High"?"#fffbeb":"#f3f4f6",
                    color: f.sev==="Critical"?S.red:f.sev==="High"?S.amber:"#374151" }}>{f.sev}</span>
                  <div style={{fontWeight:600,color:S.text,marginTop:"0.5rem",fontSize:"0.875rem"}}>{f.label}</div>
                  <div style={{color:S.muted,fontSize:"0.8125rem",marginTop:"0.25rem"}}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "okta-troubleshoot",
        title: "Troubleshooting",
        content: (
          <div style={{fontSize:"0.875rem"}}>
            {[
              { err:"Invalid token", fix:"Regenerate the token in Okta Admin → Security → API → Tokens. Tokens expire if you navigate away before copying." },
              { err:"Rate limit (429)", fix:"The scanner respects Okta's rate limit headers and retries automatically. For large orgs (5000+ users) the first scan may take 10–15 minutes." },
              { err:"Missing roles in output", fix:"Ensure the token user has okta.roles.read. Without it, admin role grants are not visible — service accounts may appear under-classified." },
            ].map(({err,fix}) => (
              <div key={err} style={{borderBottom:`1px solid ${S.border}`,paddingBottom:"0.75rem",marginBottom:"0.75rem"}}>
                <code style={{background:"#f1f5f9",padding:"2px 8px",borderRadius:4,fontSize:"0.8rem",color:S.red}}>{err}</code>
                <p style={{color:S.soft,marginTop:"0.375rem",marginBottom:0}}>{fix}</p>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ── AWS IAM ──────────────────────────────────────────────────────
  {
    id: "aws-iam",
    name: "AWS IAM",
    icon: <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ff9900",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#000",fontWeight:800,fontSize:11 }}>AWS</div>,
    badge: "Live",
    badgeColor: S.green,
    tagline: "IAM users, roles, access keys, Lambda execution roles, AI agent roles, stale credential detection.",
    sections: [
      {
        id: "aws-overview",
        title: "Overview",
        content: (
          <div>
            <p>The AWS IAM connector is where the NHI-to-human ratio explodes. A typical enterprise with 500 employees has 200–400 IAM users and 2,000–5,000 IAM roles — most created automatically by Lambda, ECS, EKS, and AI/ML services like Bedrock and SageMaker.</p>
            <Note type="tip">The connector uses the AWS SDK with your existing credentials — no new IAM user needed if you already have AWS access configured via <code style={{fontSize:"0.8rem",background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>aws configure</code>.</Note>
            <h4 style={{color:S.navy,marginTop:"1.25rem",marginBottom:"0.5rem"}}>What it discovers</h4>
            <ul style={{color:S.soft,lineHeight:2,paddingLeft:"1.25rem"}}>
              <li>All IAM users + their access keys (with key age — stale key detection)</li>
              <li>All IAM roles — Lambda, ECS, EKS, AI/ML execution roles</li>
              <li>Service-linked roles (auto-created by AWS services)</li>
              <li>Roles with AdministratorAccess (overprivileged AI/ML roles)</li>
              <li>Orphaned roles unused for 90+ days</li>
              <li>Cross-account trust relationships</li>
            </ul>
          </div>
        ),
      },
      {
        id: "aws-setup",
        title: "Setup (5 minutes)",
        content: (
          <Steps items={[
            {
              title: "Create a read-only IAM user or use existing credentials",
              body: <>In AWS Console → IAM → Users → Create user. Attach <strong>ReadOnlyAccess</strong> managed policy (or the minimal policy below). Generate access keys under Security credentials.</>
            },
            {
              title: "Add credentials to .env",
              body: <Code lang="bash">{`AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...`}</Code>
            },
            {
              title: "Run the scan",
              body: <Code lang="bash">{`npm run aws:scan
npm run aws:scan:dry   # preview only`}</Code>
            },
          ]} />
        ),
      },
      {
        id: "aws-permissions",
        title: "Minimum IAM policy",
        content: (
          <div>
            <p style={{color:S.soft,marginBottom:"0.75rem"}}>If you don't want to use ReadOnlyAccess, this is the minimum set:</p>
            <Code lang="json">{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "iam:ListUsers",
      "iam:ListRoles",
      "iam:ListAccessKeys",
      "iam:ListAttachedUserPolicies",
      "iam:ListAttachedRolePolicies",
      "iam:GetAccountAuthorizationDetails",
      "iam:GetRole",
      "sts:GetCallerIdentity"
    ],
    "Resource": "*"
  }]
}`}</Code>
            <Note type="info">Never grant <code style={{fontSize:"0.8rem",background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>iam:CreateUser</code>, <code style={{fontSize:"0.8rem",background:"#f1f5f9",padding:"1px 5px",borderRadius:4}}>iam:DeleteRole</code>, or any write action. Unkov is read-only.</Note>
          </div>
        ),
      },
      {
        id: "aws-findings",
        title: "What gets flagged",
        content: (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
            {[
              { sev:"Critical", label:"AI role with AdministratorAccess", desc:"Bedrock, SageMaker, or Comprehend role with full admin — massively over-privileged." },
              { sev:"Critical", label:"Access key 180+ days old", desc:"Long-lived credential exceeds 90-day rotation policy. Active attack surface." },
              { sev:"High",     label:"Access key 90–180 days old", desc:"Rotation overdue. Flag for immediate rotation." },
              { sev:"High",     label:"Orphaned role 180+ days unused", desc:"Role created for a decommissioned service. Dead access surface." },
              { sev:"Medium",   label:"Role unused 90–180 days", desc:"Likely stale — confirm with service owner before purging." },
            ].map(f => (
              <div key={f.label} style={{border:`1px solid ${S.border}`,borderRadius:8,padding:"0.875rem"}}>
                <span style={{fontSize:"0.7rem",fontWeight:700,padding:"2px 8px",borderRadius:9999,
                  background:f.sev==="Critical"?"#fef2f2":f.sev==="High"?"#fffbeb":"#f3f4f6",
                  color:f.sev==="Critical"?S.red:f.sev==="High"?S.amber:"#374151"}}>{f.sev}</span>
                <div style={{fontWeight:600,color:S.text,marginTop:"0.5rem",fontSize:"0.875rem"}}>{f.label}</div>
                <div style={{color:S.muted,fontSize:"0.8125rem",marginTop:"0.25rem"}}>{f.desc}</div>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ── ENTRA ID ─────────────────────────────────────────────────────
  {
    id: "entra",
    name: "Microsoft Entra ID",
    icon: <div style={{width:32,height:32,borderRadius:8,background:"#0078d4",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontWeight:800,fontSize:12}}>Az</div>,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Users, service principals, managed identities — Microsoft Graph API, full Azure AI footprint.",
    sections: [
      {
        id: "entra-overview",
        title: "Overview",
        content: (
          <div>
            <p>Entra ID (formerly Azure AD) is where enterprise AI sprawl is most visible. Every Azure AI service — OpenAI, Cognitive Services, Health Bot, Copilot Studio — registers as a service principal. Most enterprises have 50–200 of these with no governance policy.</p>
            <Note type="tip">This connector uses Microsoft Graph API application permissions — no user login required. It runs as a background service with a client credential.</Note>
          </div>
        ),
      },
      {
        id: "entra-setup",
        title: "Setup (10 minutes)",
        content: (
          <Steps items={[
            {
              title: "Register an app in Azure Portal",
              body: <>Go to <strong>Azure Portal → Entra ID → App registrations → New registration</strong>. Name it <em>Unkov Scanner</em>. Note the Application (client) ID and Directory (tenant) ID.</>
            },
            {
              title: "Generate a client secret",
              body: <>Under your new app → <strong>Certificates & secrets → New client secret</strong>. Copy the value immediately.</>
            },
            {
              title: "Grant API permissions",
              body: <><strong>API permissions → Add permission → Microsoft Graph → Application permissions</strong>. Add all four from the table below. Click <strong>Grant admin consent</strong>.</>
            },
            {
              title: "Add credentials to .env",
              body: <Code lang="bash">{`ENTRA_TENANT_ID=your-tenant-id
ENTRA_CLIENT_ID=your-app-client-id
ENTRA_CLIENT_SECRET=your-client-secret`}</Code>
            },
            { title: "Run the scan", body: <Code lang="bash">{`npm run entra:scan`}</Code> },
          ]} />
        ),
      },
      {
        id: "entra-permissions",
        title: "Required API permissions",
        content: (
          <Perms rows={[
            ["User.Read.All",            "Required", "List all users and their properties"],
            ["Application.Read.All",     "Required", "List service principals and app registrations (AI services)"],
            ["Directory.Read.All",       "Required", "List groups, roles, and managed identities"],
            ["AuditLog.Read.All",        "Optional", "Last sign-in enrichment for drift detection"],
          ]} />
        ),
      },
    ],
  },

  // ── WORKDAY ──────────────────────────────────────────────────────
  {
    id: "workday",
    name: "Workday",
    icon: <div style={{width:32,height:32,borderRadius:8,background:"#f5a623",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontWeight:800,fontSize:12}}>W</div>,
    badge: "Live",
    badgeColor: S.green,
    tagline: "HR cross-reference — find accounts still live after employee termination.",
    sections: [
      {
        id: "workday-overview",
        title: "Overview",
        content: (
          <div>
            <p>Workday is the source of truth for employee lifecycle. Unkov uses it as a cross-reference source — comparing terminated employees in Workday against active accounts in Okta and Entra ID to surface ghost accounts.</p>
            <Note type="warning">This connector reads HR data. Ensure your Workday integration service account has appropriate privacy controls per your organization's data handling policy.</Note>
            <h4 style={{color:S.navy,marginTop:"1.25rem",marginBottom:"0.5rem"}}>What it discovers</h4>
            <ul style={{color:S.soft,lineHeight:2,paddingLeft:"1.25rem"}}>
              <li>All active employees (name, email, department, hire date)</li>
              <li>Terminated employees (name, email, termination date)</li>
              <li>Cross-reference with Okta/Entra to find live accounts post-termination</li>
              <li>Role changes (manager changes, department transfers) that should trigger access reviews</li>
            </ul>
          </div>
        ),
      },
      {
        id: "workday-setup",
        title: "Setup (15 minutes)",
        content: (
          <Steps items={[
            {
              title: "Create an Integration System User (ISU) in Workday",
              body: <>Workday Admin → <strong>Security → Integration System Users → Create Integration System User</strong>. Give it a descriptive name like <em>Unkov_Scanner_ISU</em>. Assign to a security group with Worker Data Report access.</>
            },
            {
              title: "Grant required domain permissions",
              body: <>The ISU needs access to: <strong>Worker Data: All Positions</strong> (view), <strong>Worker Data: Current Staffing Information</strong> (view). Do not grant any write permissions.</>
            },
            {
              title: "Find your Workday tenant name",
              body: <>Your tenant name is in your Workday URL: <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>https://wd2.myworkday.com/<strong>your-tenant</strong>/d/home.htmld</code></>
            },
            {
              title: "Add credentials to .env",
              body: <Code lang="bash">{`WORKDAY_TENANT=your-tenant
WORKDAY_USERNAME=Unkov_Scanner_ISU
WORKDAY_PASSWORD=your-isu-password
WORKDAY_API_VERSION=v40.0`}</Code>
            },
            { title: "Run the scan", body: <Code lang="bash">{`npm run workday:scan`}</Code> },
          ]} />
        ),
      },
    ],
  },

  // ── GITHUB ───────────────────────────────────────────────────────
  {
    id: "github",
    name: "GitHub",
    icon: <div style={{width:32,height:32,borderRadius:8,background:"#24292e",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontWeight:800,fontSize:12}}>GH</div>,
    badge: "Live",
    badgeColor: S.green,
    tagline: "Org members, outside collaborators, GitHub Apps (AI coding agents, CI bots).",
    sections: [
      {
        id: "github-overview",
        title: "Overview",
        content: (
          <div>
            <p>GitHub is where the AI coding agent explosion is most visible. Every developer who installs GitHub Copilot, Cursor, Codeium, or Tabnine creates a GitHub App installation with write access to your repositories. Unkov surfaces all of these alongside human members and outside collaborators.</p>
            <h4 style={{color:S.navy,marginTop:"1.25rem",marginBottom:"0.5rem"}}>What it discovers</h4>
            <ul style={{color:S.soft,lineHeight:2,paddingLeft:"1.25rem"}}>
              <li>All org members and their roles (Owner, Member)</li>
              <li>Outside collaborators — external users with direct repo access</li>
              <li>Installed GitHub Apps (Copilot, Dependabot, CI bots, AI coding agents)</li>
              <li>Stale outside collaborators (inactive 90+ days)</li>
              <li>Apps with excessive permissions relative to their stated purpose</li>
            </ul>
          </div>
        ),
      },
      {
        id: "github-setup",
        title: "Setup (3 minutes)",
        content: (
          <Steps items={[
            {
              title: "Generate a Personal Access Token (classic)",
              body: <>GitHub → Settings → Developer settings → <strong>Personal access tokens → Tokens (classic) → Generate new token</strong>. Select: <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>read:org</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>read:user</code>, <code style={{background:"#f1f5f9",padding:"1px 6px",borderRadius:4,fontSize:"0.8rem"}}>repo</code> (read-only). Set expiration to 90 days and rotate.</>
            },
            {
              title: "Add credentials to .env",
              body: <Code lang="bash">{`GITHUB_TOKEN=ghp_...
GITHUB_ORG=your-github-org`}</Code>
            },
            { title: "Run the scan", body: <Code lang="bash">{`npm run github:scan`}</Code> },
          ]} />
        ),
      },
      {
        id: "github-permissions",
        title: "Required token scopes",
        content: (
          <Perms rows={[
            ["read:org",  "Required", "List org members, teams, and outside collaborators"],
            ["read:user", "Required", "Read user profiles for last-activity enrichment"],
            ["repo",      "Optional", "List installed GitHub Apps per repository"],
          ]} />
        ),
      },
    ],
  },
  {
    id: "ai-agents",
    name: "AI Agent Platforms",
    icon: <Bot style={{ width: 16, height: 16 }} />,
    badge: "Planned",
    badgeColor: S.muted,
    tagline: "Govern every AI agent that touches your data — across all platforms.",
    sections: [
      {
        id: "ai-overview",
        title: "Overview",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>AI agents are now the fastest-growing non-human identity class in the enterprise. They query databases, call APIs, read documents, and trigger workflows continuously — often with broad access that was never designed for autonomous systems.</p>
            <p style={{ marginBottom: "0.75rem" }}>Unkov's AI Agent Platform connectors surface every AI system as a first-class identity: tracked, scored, and subject to the same authorization policy as any human employee or service account.</p>
            <Note type="warning">AI agent connectors are on the roadmap. Current coverage is via the Entra ID connector (GitHub Copilot, Azure AI managed identities) and the AWS IAM connector (Bedrock agent roles, Lambda execution roles).</Note>
          </div>
        ),
      },
      {
        id: "ai-coverage",
        title: "Current coverage via existing connectors",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem", fontSize: "0.875rem", color: S.soft }}>These AI agents are already detected today through live connectors:</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                  {["AI System", "Detected via", "What's captured"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["GitHub Copilot", "Entra ID connector", "App registration, user assignment scope, OAuth grants"],
                  ["Azure OpenAI (managed identity)", "Entra ID connector", "Managed identity, resource access scope, role assignments"],
                  ["AWS Bedrock agents", "AWS IAM connector", "Lambda execution roles, Bedrock service policy, access keys"],
                  ["AWS Lambda (function identity)", "AWS IAM connector", "Execution role, inline policies, cross-account access"],
                  ["GitHub Apps / bots", "GitHub connector", "App installation, repository scope, permissions granted"],
                ].map(([agent, via, what]) => (
                  <tr key={agent} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600, color: S.text }}>{agent}</td>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.blue, fontFamily: "monospace", fontSize: "0.8rem" }}>{via}</td>
                    <td style={{ padding: "0.625rem 0.75rem", color: S.soft }}>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
    ],
  },
  {
    id: "compliance",
    name: "Compliance & GRC",
    icon: <FileText style={{ width: 16, height: 16 }} />,
    badge: "Planned",
    badgeColor: S.muted,
    tagline: "Continuous compliance evidence — collected automatically as a byproduct of governance.",
    sections: [
      {
        id: "compliance-overview",
        title: "Overview",
        content: (
          <div>
            <p style={{ marginBottom: "0.75rem" }}>Every gate decision Unkov makes is a compliance artifact. Instead of running point-in-time audits, Unkov accumulates an immutable, timestamped record of every identity action — continuously.</p>
            <p style={{ marginBottom: "0.75rem" }}>Compliance connectors push this evidence directly into your GRC platform, mapping findings to specific controls so you are always audit-ready.</p>
            <Note type="tip">HIPAA and PCI DSS evidence collection is available today through the audit log and identity lineage features. GRC platform connectors (Vanta, Drata) are on the roadmap for Q3 2026.</Note>
          </div>
        ),
      },
      {
        id: "compliance-frameworks",
        title: "Supported frameworks",
        content: (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${S.border}` }}>
                {["Framework", "Relevant Unkov controls", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: S.muted, fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["HIPAA (AI access)", "Patient data lineage, agent identity audit trail, access authorization", "Live"],
                ["PCI DSS v4 (AI scope)", "Cardholder data access governance, non-human identity controls", "Live"],
                ["SOC 2 Type II", "Continuous access control evidence, logical access reviews", "Live (manual export)"],
                ["ISO 27001", "Identity governance controls, access lifecycle documentation", "Planned — Vanta/Drata sync"],
                ["NIST AI RMF", "AI agent identity governance, accountability, explainability", "Planned"],
                ["EU AI Act", "High-risk AI system governance, human oversight documentation", "Planned"],
              ].map(([fw, controls, status]) => (
                <tr key={fw} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "0.625rem 0.75rem", fontWeight: 600, color: S.text }}>{fw}</td>
                  <td style={{ padding: "0.625rem 0.75rem", color: S.soft, fontSize: "0.8rem" }}>{controls}</td>
                  <td style={{ padding: "0.625rem 0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: status === "Live" ? S.green : S.amber, background: status === "Live" ? S.lgreen : S.lamber, padding: "2px 8px", borderRadius: 9999 }}>{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN DOCS PAGE
// ═══════════════════════════════════════════════════════════════════

export default function Docs() {
  const [location] = useLocation();
  const [activeConnector, setActiveConnector] = useState("okta");
  const [activeSection, setActiveSection]     = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["okta-overview"]));
  const [search, setSearch] = useState("");

  // Parse URL hash for deep linking from integrations page
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const connector = CONNECTORS.find(c => c.id === hash);
      if (connector) {
        setActiveConnector(connector.id);
        setActiveSection(connector.sections[0]?.id ?? null);
        setExpandedSections(new Set([connector.sections[0]?.id ?? ""]));
      }
    }
  }, [location]);

  const current = CONNECTORS.find(c => c.id === activeConnector) ?? CONNECTORS[0]!;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setActiveSection(id);
  };

  const filteredConnectors = search
    ? CONNECTORS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.tagline.toLowerCase().includes(search.toLowerCase()))
    : CONNECTORS;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: S.bg }}>
      <Header />
      <div style={{ paddingTop: 60 }}>

        {/* Page header */}
        <div style={{ backgroundColor: S.navy, padding: "2.5rem 0 2rem" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: 1200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem",
              color: "#93c5fd", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
              <BookOpen style={{ width: 14, height: 14 }} />
              <span>Documentation</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 700,
              color: "#ffffff", marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>
              Connector Documentation
            </h1>
            <p style={{ color: "#93c5fd", maxWidth: "42rem", lineHeight: 1.7 }}>
              Step-by-step setup guides for every Unkov connector. Each connector requires only read-only credentials — Unkov never writes to your identity systems.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="container mx-auto px-10" style={{ maxWidth: 1200, display: "flex",
          gap: "2rem", padding: "2rem 2.5rem", alignItems: "flex-start" }}>

          {/* Left sidebar */}
          <aside style={{ width: 240, flexShrink: 0, position: "sticky", top: 88 }}>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
              <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                width: 14, height: 14, color: S.muted }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search connectors…"
                style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8,
                  paddingBottom: 8, border: `1px solid ${S.border}`, borderRadius: 8,
                  fontSize: "0.875rem", backgroundColor: S.white, color: S.text, outline: "none" }}
              />
            </div>

            <nav>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: S.muted,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                Connectors
              </div>
              {filteredConnectors.map(connector => (
                <button
                  key={connector.id}
                  onClick={() => { setActiveConnector(connector.id); setActiveSection(null); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
                    padding: "0.625rem 0.75rem", borderRadius: 8, border: "none",
                    cursor: "pointer", textAlign: "left", marginBottom: 2,
                    backgroundColor: activeConnector === connector.id ? S.lnavy : "transparent",
                    color: activeConnector === connector.id ? S.navy : S.soft,
                    fontWeight: activeConnector === connector.id ? 600 : 400,
                    fontSize: "0.875rem", transition: "all 0.1s" }}>
                  {connector.icon}
                  <div style={{ flex: 1 }}>
                    <div>{connector.name}</div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "1px 6px",
                      borderRadius: 9999, backgroundColor: "#f0fdf4", color: connector.badgeColor }}>
                      {connector.badge}
                    </span>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />
                </button>
              ))}

              <div style={{ marginTop: "1.5rem", padding: "0.875rem", backgroundColor: S.lnavy,
                borderRadius: 8, border: `1px solid ${S.border}` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: S.navy, marginBottom: 4 }}>
                  Need help?
                </div>
                <p style={{ fontSize: "0.75rem", color: S.muted, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                  Our team responds to connector questions within one business day.
                </p>
                <a href="/contact" style={{ fontSize: "0.75rem", color: S.blue, fontWeight: 600,
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Contact support <ExternalLink style={{ width: 10, height: 10 }} />
                </a>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>

            {/* Connector header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem",
              marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${S.border}` }}>
              {current.icon}
              <div>
                <h2 style={{ fontSize: "1.625rem", fontWeight: 700, color: S.text, marginBottom: "0.375rem" }}>
                  {current.name}
                </h2>
                <p style={{ color: S.muted, fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "36rem" }}>
                  {current.tagline}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px",
                    borderRadius: 9999, backgroundColor: S.lgreen, color: S.green }}>
                    ✓ {current.badge}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px",
                    borderRadius: 9999, backgroundColor: "#f0f9ff", color: "#0369a1" }}>
                    Read-only
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px",
                    borderRadius: 9999, backgroundColor: S.lnavy, color: S.navy }}>
                    Zero downtime
                  </span>
                </div>
              </div>
            </div>

            {/* Sections */}
            {current.sections.map(section => (
              <div key={section.id} style={{ marginBottom: "0.5rem",
                border: `1px solid ${S.border}`, borderRadius: 10, overflow: "hidden" }}>
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "0.875rem 1.125rem",
                    backgroundColor: expandedSections.has(section.id) ? S.lnavy : S.white,
                    border: "none", cursor: "pointer", textAlign: "left",
                    color: S.text, fontWeight: 600, fontSize: "0.9375rem",
                    transition: "background 0.1s" }}>
                  <span>{section.title}</span>
                  {expandedSections.has(section.id)
                    ? <ChevronDown style={{ width: 16, height: 16, color: S.muted }} />
                    : <ChevronRight style={{ width: 16, height: 16, color: S.muted }} />}
                </button>
                {expandedSections.has(section.id) && (
                  <div style={{ padding: "1.125rem 1.25rem", borderTop: `1px solid ${S.border}`,
                    backgroundColor: S.white, lineHeight: 1.7, color: S.soft, fontSize: "0.9rem" }}>
                    {section.content}
                  </div>
                )}
              </div>
            ))}

            {/* Back to integrations */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${S.border}` }}>
              <a href="/integrations" style={{ display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: "0.875rem", color: S.blue, fontWeight: 600, textDecoration: "none" }}>
                ← Back to all integrations
              </a>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
