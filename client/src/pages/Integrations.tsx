import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import {
  CheckCircle, Clock, ArrowRight, X, ChevronRight,
  Copy, ExternalLink, AlertTriangle, Shield, Zap,
  Eye, EyeOff, Terminal, RefreshCw,
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────
const C = {
  navy: "#00297a", blue: "#0061d4", bg: "#faf9f7", white: "#ffffff",
  border: "#e5e7eb", text: "#111827", muted: "#6b7280", soft: "#374151",
  green: "#059669", amber: "#d97706", red: "#dc2626",
  lnavy: "#e8f0fe", lgreen: "#f0fdf4", lamber: "#fffbeb", lred: "#fef2f2",
  code: "#1e293b",
};

// ── Connector config ───────────────────────────────────────────────
// Each live connector has: what you need, credential fields, what it finds
const CONNECTOR_CONFIG: Record<string, {
  id: string;
  name: string;
  logoText: string;
  logoBg: string;
  logoColor: string;
  tagline: string;
  setupTime: string;
  what: string[];
  finds: { sev: "critical"|"high"|"medium"; label: string }[];
  fields: { key: string; label: string; placeholder: string; secret?: boolean; hint: string }[];
  envKeys: string[];
  commands: string[];
  docsPath: string;
}> = {
  okta: {
    id: "okta",
    name: "Okta",
    logoText: "O",
    logoBg: "#007dc1",
    logoColor: "#fff",
    tagline: "Users, groups, apps, admin roles, service account detection.",
    setupTime: "5 min",
    what: [
      "All users — human, service accounts, AI agents, bots",
      "Admin role grants (SUPER_ADMIN, ORG_ADMIN, APP_ADMIN)",
      "Group memberships and app assignments",
      "Departed employees with live accounts",
      "Dormant admin accounts (60+ days inactive)",
    ],
    finds: [
      { sev: "critical", label: "SUPER_ADMIN + payroll access (payment fraud)" },
      { sev: "critical", label: "AI agent with ORG_ADMIN (ungoverned)" },
      { sev: "critical", label: "SUPER_ADMIN + PHI access (HIPAA §164.312)" },
      { sev: "high",     label: "Departed employee — account not deprovisioned" },
      { sev: "high",     label: "Dormant admin account (60+ days)" },
      { sev: "medium",   label: "Service account without owner" },
    ],
    fields: [
      { key: "OKTA_ORG_URL",   label: "Okta Org URL",  placeholder: "https://dev-xxxxxxx.okta.com",
        hint: "Your Okta admin URL — the base domain, no trailing slash" },
      { key: "OKTA_API_TOKEN", label: "API Token", placeholder: "00x...",  secret: true,
        hint: "Okta Admin → Security → API → Tokens → Create Token (read-only, name it 'Unkov Scanner')" },
    ],
    envKeys: ["OKTA_ORG_URL", "OKTA_API_TOKEN"],
    commands: ["npm run seed:okta:full", "npm run okta:scan", "npm run db:write"],
    docsPath: "/docs#okta",
  },
  "aws-iam": {
    id: "aws-iam",
    name: "AWS IAM",
    logoText: "AWS",
    logoBg: "#ff9900",
    logoColor: "#000",
    tagline: "IAM users, roles, access keys, Lambda execution roles, AI agent roles.",
    setupTime: "5 min",
    what: [
      "All IAM users + access key ages (stale key detection)",
      "All IAM roles — Lambda, ECS, EKS, AI/ML execution roles",
      "Roles with AdministratorAccess (over-privileged AI/ML)",
      "Orphaned roles unused 90–540 days",
      "Cross-account trust relationships",
    ],
    finds: [
      { sev: "critical", label: "AI/ML role with AdministratorAccess" },
      { sev: "critical", label: "Access key 180+ days old" },
      { sev: "high",     label: "Access key 90–180 days old (rotation overdue)" },
      { sev: "high",     label: "Orphaned role 180+ days unused" },
      { sev: "medium",   label: "Role unused 90–180 days" },
    ],
    fields: [
      { key: "AWS_REGION",            label: "AWS Region",         placeholder: "us-east-1",
        hint: "The region where your IAM resources live (us-east-1 covers all IAM globally)" },
      { key: "AWS_ACCESS_KEY_ID",     label: "Access Key ID",      placeholder: "AKIA...",
        hint: "AWS Console → IAM → Users → your user → Security credentials → Create access key" },
      { key: "AWS_SECRET_ACCESS_KEY", label: "Secret Access Key",  placeholder: "...", secret: true,
        hint: "Shown once when you create the access key — attach ReadOnlyAccess policy minimum" },
    ],
    envKeys: ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
    commands: ["npm run seed:aws", "npm run aws:scan", "npm run db:write"],
    docsPath: "/docs#aws-iam",
  },
  entra: {
    id: "entra",
    name: "Microsoft Entra ID",
    logoText: "Az",
    logoBg: "#0078d4",
    logoColor: "#fff",
    tagline: "Users, service principals, managed identities — full Azure AI footprint.",
    setupTime: "10 min",
    what: [
      "All users + guest accounts",
      "Service principals and app registrations (Azure AI services)",
      "Managed identities (VMs, AKS, Functions)",
      "Admin role assignments",
      "Stale app registrations",
    ],
    finds: [
      { sev: "critical", label: "22 Azure AI service principals (ungoverned sprawl)" },
      { sev: "high",     label: "Managed identity with subscription-level permissions" },
      { sev: "high",     label: "Guest account with admin access" },
      { sev: "medium",   label: "App registration unused 95–300 days" },
    ],
    fields: [
      { key: "ENTRA_TENANT_ID",     label: "Tenant ID",     placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        hint: "Azure Portal → Entra ID → Overview → Tenant ID" },
      { key: "ENTRA_CLIENT_ID",     label: "Client ID",     placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        hint: "Azure Portal → Entra ID → App registrations → New registration → Application (client) ID" },
      { key: "ENTRA_CLIENT_SECRET", label: "Client Secret", placeholder: "...", secret: true,
        hint: "Your app → Certificates & secrets → New client secret (needs User.Read.All, Application.Read.All, Directory.Read.All)" },
    ],
    envKeys: ["ENTRA_TENANT_ID", "ENTRA_CLIENT_ID", "ENTRA_CLIENT_SECRET"],
    commands: ["npm run seed:entra", "npm run entra:scan", "npm run db:write"],
    docsPath: "/docs#entra",
  },
  github: {
    id: "github",
    name: "GitHub",
    logoText: "GH",
    logoBg: "#24292e",
    logoColor: "#fff",
    tagline: "Org members, outside collaborators, GitHub Apps (AI coding agents, CI bots).",
    setupTime: "3 min",
    what: [
      "All org members and their roles (Owner, Member)",
      "Outside collaborators — external users with direct repo access",
      "Installed GitHub Apps (Copilot, Dependabot, CI bots, AI coding agents)",
      "Stale outside collaborators (inactive 90+ days)",
    ],
    finds: [
      { sev: "high",   label: "Outside collaborator inactive 90+ days" },
      { sev: "high",   label: "Outside collaborator with push access" },
      { sev: "medium", label: "GitHub App with broad repository permissions" },
      { sev: "medium", label: "Org member inactive 60+ days" },
    ],
    fields: [
      { key: "GITHUB_TOKEN", label: "Personal Access Token", placeholder: "ghp_...", secret: true,
        hint: "github.com/settings/tokens → Generate new token (classic) — select read:org, read:user, repo" },
      { key: "GITHUB_ORG",   label: "Organization name",    placeholder: "your-org-name",
        hint: "Your GitHub organization name — the part after github.com/" },
    ],
    envKeys: ["GITHUB_TOKEN", "GITHUB_ORG"],
    commands: ["npm run seed:github", "npm run github:scan", "npm run db:write"],
    docsPath: "/docs#github",
  },
  workday: {
    id: "workday",
    name: "Workday",
    logoText: "W",
    logoBg: "#f5a623",
    logoColor: "#fff",
    tagline: "HR cross-reference — find accounts still live after employee termination.",
    setupTime: "15 min",
    what: [
      "All active employees (name, email, department, hire date)",
      "Terminated employees with termination date",
      "Cross-reference with Okta/Entra to surface ghost accounts",
      "Role changes that should trigger access reviews",
    ],
    finds: [
      { sev: "critical", label: "Terminated employee with live Okta account" },
      { sev: "high",     label: "Employee terminated 14+ days with active AWS keys" },
      { sev: "high",     label: "Department transfer — access not reviewed" },
    ],
    fields: [
      { key: "WORKDAY_TENANT",   label: "Tenant name",    placeholder: "your-tenant",
        hint: "Your Workday URL: wd2.myworkday.com/{your-tenant}/d/home.htmld" },
      { key: "WORKDAY_USERNAME", label: "ISU Username",   placeholder: "Unkov_Scanner_ISU",
        hint: "Workday Admin → Security → Integration System Users → Create ISU with Worker Data read access" },
      { key: "WORKDAY_PASSWORD", label: "ISU Password",   placeholder: "...", secret: true,
        hint: "The password for your Integration System User" },
    ],
    envKeys: ["WORKDAY_TENANT", "WORKDAY_USERNAME", "WORKDAY_PASSWORD"],
    commands: ["npm run workday:scan", "npm run db:write"],
    docsPath: "/docs#workday",
  },
};

// ── Connector card data ────────────────────────────────────────────
const INTEGRATIONS = [
  {
    cat: "Identity Providers",
    desc: "The core connectors — where human and non-human identities live.",
    items: [
      { name: "Okta",               id: "okta",      status: "live",    desc: "Users, groups, apps, admin roles, service account detection. Full lifecycle sync via SCIM + API."                         },
      { name: "Microsoft Entra ID", id: "entra",     status: "live",    desc: "Users, service principals, managed identities. Microsoft Graph API — biggest AI agent surface in Azure."                 },
      { name: "Google Workspace",   id: null,        status: "planned", desc: "Directory sync + admin SDK. Users, groups, service accounts."                                                             },
      { name: "Ping Identity",      id: null,        status: "planned", desc: "OAuth 2.0 / OIDC federation. Users and federated identities."                                                             },
      { name: "JumpCloud",          id: null,        status: "planned", desc: "SCIM 2.0 provisioning. Users, groups, device identities."                                                                 },
    ],
  },
  {
    cat: "Cloud Platforms",
    desc: "Where most non-human identities and AI agents actually live.",
    items: [
      { name: "AWS IAM",            id: "aws-iam",   status: "live",    desc: "IAM users, roles, access keys, Lambda execution roles, AI agent roles. Stale key detection."                              },
      { name: "Azure RBAC",         id: "entra",     status: "live",    desc: "Azure role assignments, PIM integration, managed identity governance. Through Entra ID connector."                        },
      { name: "Google Cloud IAM",   id: null,        status: "planned", desc: "Service account governance, workload identity federation, IAM policy drift detection."                                    },
      { name: "Kubernetes RBAC",    id: null,        status: "planned", desc: "Pod-level identity governance. ServiceAccount tokens, ClusterRoleBindings."                                               },
    ],
  },
  {
    cat: "HR Systems",
    desc: "The source of truth for detecting orphaned accounts after employee termination.",
    items: [
      { name: "Workday",            id: "workday",   status: "live",    desc: "Active + terminated workers. Cross-reference with IdP to find accounts still live after employee exit."                   },
      { name: "BambooHR",           id: null,        status: "planned", desc: "Onboarding trigger events. Auto-provision on hire, auto-deprovision on termination."                                      },
      { name: "SAP SuccessFactors", id: null,        status: "planned", desc: "Enterprise HR lifecycle. Role changes trigger access reviews."                                                             },
      { name: "ADP",                id: null,        status: "planned", desc: "Payroll-driven deprovisioning. Termination events trigger immediate access revocation."                                    },
    ],
  },
  {
    cat: "Developer Tools",
    desc: "Where developers have production access — often ungoverned.",
    items: [
      { name: "GitHub",             id: "github",    status: "live",    desc: "Org members, outside collaborators, installed GitHub Apps (AI coding agents, bots)."                                      },
      { name: "GitLab",             id: null,        status: "planned", desc: "Group members, deploy tokens, CI/CD variables with secrets access."                                                       },
      { name: "HashiCorp Vault",    id: null,        status: "planned", desc: "Secrets lifecycle governance. Dynamic credentials, lease expiry tracking."                                                 },
      { name: "GitHub Actions",     id: null,        status: "planned", desc: "Workflow permissions, OIDC tokens, environment secrets access."                                                            },
    ],
  },
  {
    cat: "AI Agent Platforms",
    desc: "Govern the AI systems accessing your data — the fastest-growing attack surface.",
    items: [
      { name: "GitHub Copilot",              id: "entra", status: "live",    desc: "Surfaced via Entra ID connector. Access scope and user assignment governance."                                       },
      { name: "OpenAI / ChatGPT Enterprise", id: null,    status: "planned", desc: "ChatGPT Enterprise plugin governance. API key lifecycle, usage scope enforcement."                                  },
      { name: "Microsoft Copilot",           id: null,    status: "planned", desc: "M365 Copilot identity scope enforcement. Limits which data agents can retrieve."                                    },
      { name: "Anthropic Claude (API)",      id: null,    status: "planned", desc: "API key governance for Claude integrations. Rotation enforcement, scope tracking."                                  },
      { name: "Salesforce Einstein",         id: null,    status: "planned", desc: "Einstein AI agent identity governance. CRM data access scope, user delegation controls."                            },
    ],
  },
  {
    cat: "SIEM & Security",
    desc: "Feed findings into the tools your security team already uses.",
    items: [
      { name: "Splunk",             id: null, status: "planned", desc: "Real-time identity event streaming. Identity Drift alerts as Splunk events."          },
      { name: "Microsoft Sentinel", id: null, status: "planned", desc: "Identity threat intel feed. Gate decisions as Sentinel incidents."                    },
      { name: "CrowdStrike Falcon", id: null, status: "planned", desc: "Endpoint + identity correlation. Agent identity enrichment."                          },
      { name: "Datadog",            id: null, status: "planned", desc: "Observability integration. Identity metrics and drift scoring dashboards."             },
    ],
  },
  {
    cat: "Privileged Access & PAM",
    desc: "Where the highest-risk identities live — admin accounts, shared credentials, break-glass access.",
    items: [
      { name: "CyberArk",              id: null, status: "planned", desc: "Privileged account governance. Vault session correlations, just-in-time access tracking."  },
      { name: "BeyondTrust",           id: null, status: "planned", desc: "Endpoint privilege management. Elevation events correlated with identity risk scores."       },
      { name: "Delinea Secret Server", id: null, status: "planned", desc: "Secret lifecycle governance. Shared credential detection, rotation enforcement."             },
      { name: "1Password Business",    id: null, status: "planned", desc: "Team vault governance. Shared item detection, access scope, stale credential flagging."     },
    ],
  },
  {
    cat: "ITSM & Ticketing",
    desc: "Close the loop — remediation actions create tickets automatically.",
    items: [
      { name: "ServiceNow",        id: null, status: "planned", desc: "Auto-create remediation tickets. Access review workflows. CMDB identity enrichment." },
      { name: "Jira Service Mgmt", id: null, status: "planned", desc: "Access workflow automation. Violation findings create Jira issues automatically."    },
      { name: "PagerDuty",         id: null, status: "planned", desc: "Critical identity violations trigger on-call alerts."                                 },
    ],
  },
  {
    cat: "Compliance & GRC",
    desc: "Turn Unkov's continuous evidence into compliance artifacts automatically.",
    items: [
      { name: "Vanta",  id: null, status: "planned", desc: "Continuous compliance sync. Unkov findings feed directly into Vanta SOC 2 / ISO 27001 controls." },
      { name: "Drata",  id: null, status: "planned", desc: "Automated evidence collection. Identity access reviews mapped to Drata control requirements."     },
      { name: "OneTrust",id: null,status: "planned", desc: "Privacy-by-design enforcement. AI agent data access correlated with OneTrust data inventory."    },
    ],
  },
];

const STATUS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  live:    { color: C.green,  bg: C.lgreen,  border: "#6ee7b7", label: "Live"    },
  planned: { color: C.muted,  bg: "#f9fafb", border: C.border,  label: "Planned" },
};

// ── Severity badge ─────────────────────────────────────────────────
function SevBadge({ sev }: { sev: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    critical: { bg: C.lred,   color: C.red   },
    high:     { bg: C.lamber, color: C.amber  },
    medium:   { bg: "#f3f4f6", color: "#374151" },
  };
  const s = map[sev] ?? map.medium!;
  return (
    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px",
      borderRadius: 9999, background: s.bg, color: s.color,
      textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
      {sev}
    </span>
  );
}

// ── Copy button ────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem",
        color: copied ? C.green : C.muted, background: "none", border: "none",
        cursor: "pointer", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
      {copied ? <CheckCircle style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Connector Modal ────────────────────────────────────────────────
function ConnectorModal({ connectorId, onClose }: { connectorId: string; onClose: () => void }) {
  const cfg = CONNECTOR_CONFIG[connectorId];
  const [step, setStep] = useState(0); // 0=overview 1=prerequisites 2=credentials 3=done
  const [values, setValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [agreed, setAgreed] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Close on backdrop click
  const onBackdrop = (e: React.MouseEvent) => { if (e.target === backdropRef.current) onClose(); };

  if (!cfg) return null;

  const allFilled = cfg.fields.every(f => (values[f.key] ?? "").trim().length > 0);
  const envBlock = cfg.fields.map(f => `${f.key}=${values[f.key] ?? ""}`).join("\n");
  const cmdBlock = cfg.commands.join("\n");

  const STEPS = ["Overview", "Prerequisites", "Add credentials", "Done"];

  return (
    <div ref={backdropRef} onClick={onBackdrop}
      style={{ position: "fixed", inset: 0, zIndex: 2000, backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>

      {/* Modal card */}
      <div style={{ backgroundColor: C.white, borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.logoBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: cfg.logoColor, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
              {cfg.logoText}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: C.text }}>{cfg.name}</div>
              <div style={{ fontSize: "0.78rem", color: C.muted }}>{cfg.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            color: C.muted, padding: 4, borderRadius: 6, flexShrink: 0 }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Step pills */}
        <div style={{ display: "flex", gap: "0.25rem", padding: "1rem 1.5rem 0", overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => i < step + 1 && setStep(i)}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.3rem 0.75rem", borderRadius: 9999, border: "none",
                fontSize: "0.75rem", fontWeight: 600, cursor: i <= step ? "pointer" : "default",
                backgroundColor: i === step ? C.navy : i < step ? C.lnavy : "#f3f4f6",
                color: i === step ? "#fff" : i < step ? C.navy : C.muted,
                transition: "all 0.15s", flexShrink: 0 }}>
              {i < step ? <CheckCircle style={{ width: 11, height: 11 }} /> : <span style={{ fontSize: "0.7rem" }}>{i + 1}</span>}
              {s}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>

          {/* ── Step 0: Overview ── */}
          {step === 0 && (
            <div>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { label: "Setup time", val: cfg.setupTime },
                  { label: "Mode",       val: "Read-only" },
                  { label: "Zero downtime", val: "✓" },
                ].map(b => (
                  <div key={b.label} style={{ padding: "0.375rem 0.875rem", background: C.lnavy,
                    border: `1px solid #bfcfee`, borderRadius: 8,
                    fontSize: "0.78rem", color: C.navy, fontWeight: 600 }}>
                    {b.label}: <span style={{ fontWeight: 400 }}>{b.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text,
                  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  What gets discovered
                </div>
                {cfg.what.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start",
                    padding: "0.375rem 0", borderBottom: i < cfg.what.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <ChevronRight style={{ width: 13, height: 13, color: C.blue, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: "0.875rem", color: C.soft }}>{w}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text,
                  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  What gets flagged
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {cfg.finds.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.5rem 0.75rem", background: "#f9fafb", borderRadius: 8,
                      border: `1px solid ${C.border}` }}>
                      <SevBadge sev={f.sev} />
                      <span style={{ fontSize: "0.8125rem", color: C.soft }}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", padding: "0.75rem 1.25rem", backgroundColor: C.navy,
                    color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                    borderRadius: 9999, border: "none", cursor: "pointer" }}>
                  Connect {cfg.name} <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
                <a href={cfg.docsPath}
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.75rem 1.125rem", color: C.blue, fontWeight: 600,
                    fontSize: "0.875rem", border: `1px solid #bfcfee`, borderRadius: 9999,
                    backgroundColor: C.lnavy, textDecoration: "none" }}>
                  <ExternalLink style={{ width: 13, height: 13 }} /> Docs
                </a>
              </div>
            </div>
          )}

          {/* ── Step 1: Prerequisites ── */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: "0.9rem", color: C.soft, marginBottom: "1.25rem", lineHeight: 1.65 }}>
                Before connecting {cfg.name}, you need read-only API credentials. Unkov never writes to your identity systems — it only reads.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {cfg.fields.map((field, i) => (
                  <div key={field.key} style={{ padding: "0.875rem 1rem", background: "#f9fafb",
                    border: `1px solid ${C.border}`, borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: C.navy,
                        color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: C.text }}>{field.label}</span>
                      {field.secret && (
                        <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 9999,
                          background: C.lamber, color: C.amber, fontWeight: 700 }}>SECRET</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: C.muted, lineHeight: 1.55, margin: 0, paddingLeft: "1.75rem" }}>
                      {field.hint}
                    </p>
                  </div>
                ))}
              </div>

              {/* Read-only reminder */}
              <div style={{ display: "flex", gap: "0.625rem", padding: "0.875rem 1rem",
                background: C.lgreen, border: `1px solid #6ee7b7`, borderRadius: 10,
                marginBottom: "1.5rem" }}>
                <Shield style={{ width: 15, height: 15, color: C.green, flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: "0.8125rem", color: "#065f46", lineHeight: 1.55 }}>
                  <strong>Read-only credentials only.</strong> Unkov never creates, modifies, or deletes anything in {cfg.name}. Minimum permissions required — never admin.
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem",
                cursor: "pointer", marginBottom: "1.5rem" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  style={{ marginTop: 3, flexShrink: 0, accentColor: C.navy }} />
                <span style={{ fontSize: "0.875rem", color: C.soft, lineHeight: 1.55 }}>
                  I have the credentials ready and understand they will be stored only in my local <code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>.env</code> file, never sent to Unkov servers.
                </span>
              </label>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(0)}
                  style={{ padding: "0.75rem 1.25rem", color: C.muted, background: "#f3f4f6",
                    border: "none", borderRadius: 9999, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
                  Back
                </button>
                <button onClick={() => agreed && setStep(2)} disabled={!agreed}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", padding: "0.75rem 1.25rem",
                    backgroundColor: agreed ? C.navy : "#d1d5db",
                    color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                    borderRadius: 9999, border: "none", cursor: agreed ? "pointer" : "default" }}>
                  I have my credentials <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Add credentials ── */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: "0.875rem", color: C.soft, marginBottom: "1.25rem", lineHeight: 1.6 }}>
                Fill in your credentials below. This generates the exact lines to paste into your engine <code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>.env</code> file — nothing is sent anywhere.
              </p>

              {/* Input fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
                {cfg.fields.map(field => (
                  <div key={field.key}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600,
                      color: C.text, marginBottom: "0.375rem" }}>
                      {field.label}
                      {field.secret && <span style={{ marginLeft: 6, fontSize: "0.65rem",
                        padding: "1px 6px", borderRadius: 9999, background: C.lamber, color: C.amber, fontWeight: 700 }}>SECRET</span>}
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={field.secret && !showSecrets[field.key] ? "password" : "text"}
                        placeholder={field.placeholder}
                        value={values[field.key] ?? ""}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                        style={{ width: "100%", padding: field.secret ? "0.6875rem 2.5rem 0.6875rem 0.875rem" : "0.6875rem 0.875rem",
                          fontSize: "0.875rem", border: `1px solid ${C.border}`, borderRadius: 8,
                          backgroundColor: "#fafafa", color: C.text, outline: "none",
                          fontFamily: "monospace", boxSizing: "border-box" }}
                        onFocus={e => (e.target.style.borderColor = C.blue)}
                        onBlur={e  => (e.target.style.borderColor = C.border)}
                      />
                      {field.secret && (
                        <button onClick={() => setShowSecrets(s => ({ ...s, [field.key]: !s[field.key] }))}
                          style={{ position: "absolute", right: "0.75rem", top: "50%",
                            transform: "translateY(-50%)", background: "none", border: "none",
                            cursor: "pointer", color: C.muted, padding: 0 }}>
                          {showSecrets[field.key] ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.3rem", margin: "0.3rem 0 0" }}>
                      {field.hint}
                    </p>
                  </div>
                ))}
              </div>

              {/* Generated .env block */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#0f172a", borderRadius: "8px 8px 0 0",
                  padding: "0.375rem 0.875rem", borderBottom: "1px solid #334155" }}>
                  <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>
                    Add to unkov-engine/.env
                  </span>
                  <CopyBtn text={envBlock} />
                </div>
                <pre style={{ background: C.code, color: "#86efac", margin: 0,
                  padding: "0.875rem 1rem", borderRadius: "0 0 8px 8px",
                  fontSize: "0.8125rem", fontFamily: "monospace", overflowX: "auto" }}>
                  {cfg.fields.map(f => (
                    <div key={f.key}>
                      <span style={{ color: "#93c5fd" }}>{f.key}</span>
                      <span style={{ color: "#e2e8f0" }}>=</span>
                      <span style={{ color: f.secret && !(values[f.key] ?? "").length ? "#475569" : "#86efac" }}>
                        {(values[f.key] ?? "").length ? (f.secret ? "•".repeat(Math.min((values[f.key]!).length, 20)) : values[f.key]) : (f.secret ? "<secret>" : f.placeholder)}
                      </span>
                      {"\n"}
                    </div>
                  ))}
                </pre>
              </div>

              {/* Run commands */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#0f172a", borderRadius: "8px 8px 0 0",
                  padding: "0.375rem 0.875rem", borderBottom: "1px solid #334155" }}>
                  <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>
                    Then run in your terminal (unkov-engine/)
                  </span>
                  <CopyBtn text={cmdBlock} />
                </div>
                <pre style={{ background: C.code, color: "#86efac", margin: 0,
                  padding: "0.875rem 1rem", borderRadius: "0 0 8px 8px",
                  fontSize: "0.8125rem", fontFamily: "monospace" }}>
                  {cfg.commands.map((cmd, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "#475569" }}>$</span>
                      <span style={{ color: "#86efac" }}>{cmd}</span>
                    </div>
                  ))}
                </pre>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(1)}
                  style={{ padding: "0.75rem 1.25rem", color: C.muted, background: "#f3f4f6",
                    border: "none", borderRadius: 9999, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
                  Back
                </button>
                <button onClick={() => setStep(3)} disabled={!allFilled}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", padding: "0.75rem 1.25rem",
                    backgroundColor: allFilled ? C.green : "#d1d5db",
                    color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                    borderRadius: 9999, border: "none", cursor: allFilled ? "pointer" : "default" }}>
                  I've added these to .env <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Done ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.lgreen,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem" }}>
                <CheckCircle style={{ width: 32, height: 32, color: C.green }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
                {cfg.name} configured
              </h3>
              <p style={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.65, marginBottom: "1.75rem", maxWidth: "360px", margin: "0 auto 1.75rem" }}>
                Run the commands in your terminal. The scanner will discover identities and load them into your dashboard.
              </p>

              {/* Command summary */}
              <div style={{ background: C.code, borderRadius: 10, padding: "1rem", marginBottom: "1.75rem", textAlign: "left" }}>
                {cfg.commands.map((cmd, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem",
                    padding: "0.3rem 0", borderBottom: i < cfg.commands.length - 1 ? "1px solid #1e3a5f" : "none" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: "0.8125rem", color: "#86efac", fontFamily: "monospace", flex: 1 }}>{cmd}</span>
                    <CopyBtn text={cmd} />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.5rem", backgroundColor: C.navy, color: "#fff",
                  fontWeight: 700, fontSize: "0.9375rem", borderRadius: 9999, textDecoration: "none" }}>
                  Open dashboard <ArrowRight style={{ width: 15, height: 15 }} />
                </a>
                <a href={cfg.docsPath} style={{ display: "flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.75rem 1.25rem", color: C.blue, fontWeight: 600,
                  fontSize: "0.875rem", border: `1px solid #bfcfee`, borderRadius: 9999,
                  backgroundColor: C.lnavy, textDecoration: "none" }}>
                  <ExternalLink style={{ width: 13, height: 13 }} /> Full docs
                </a>
                <button onClick={onClose}
                  style={{ padding: "0.75rem 1.25rem", color: C.muted, background: "#f3f4f6",
                    border: "none", borderRadius: 9999, cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function Integrations() {
  const [, navigate] = useLocation();
  const [filter, setFilter]         = useState("all");
  const [activeConnector, setActive] = useState<string | null>(null);

  // Hash-based deep link: /integrations#okta opens the modal
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && CONNECTOR_CONFIG[hash]) setActive(hash);
  }, []);

  const allItems     = INTEGRATIONS.flatMap(c => c.items);
  const liveCount    = allItems.filter(i => i.status === "live").length;
  const plannedCount = allItems.filter(i => i.status === "planned").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.text }}>
      <Header />
      <div style={{ paddingTop: 60, minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`,
          padding: "clamp(2rem,5vw,5rem) 0 clamp(1.5rem,4vw,4rem)" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "900px" }}>
            <span className="section-label" style={{ marginBottom: "1rem", display: "inline-block" }}>Integrations</span>
            <h1 style={{ fontSize: "clamp(2.25rem,5vw,3rem)", fontWeight: 600, color: C.text,
              letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "1rem" }}>
              Connect every identity source.<br />Gate every action.
            </h1>
            <p style={{ fontSize: "1.125rem", color: "#3d4759", lineHeight: 1.75,
              marginBottom: "2rem", maxWidth: "38rem" }}>
              The identity gate is only as complete as the sources it connects to. Click any live connector to set it up in minutes.
            </p>
            <div style={{ display: "flex", gap: "clamp(1.25rem,3vw,3rem)", flexWrap: "wrap" }}>
              {[
                { val: `${liveCount}`,    label: "Live connectors",      color: C.green },
                { val: `${plannedCount}`, label: "On the roadmap",        color: C.muted },
                { val: "< 5 min",         label: "Setup per connector",   color: C.navy  },
                { val: "Read-only",       label: "Observation mode first", color: C.navy  },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.625rem", fontWeight: 600, color: s.color, letterSpacing: "-0.025em" }}>{s.val}</div>
                  <div style={{ fontSize: "0.8rem", color: C.muted, marginTop: "0.125rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <section style={{ padding: "1rem 0", borderBottom: `1px solid ${C.border}`, backgroundColor: "#f6f8fa" }}>
          <div className="container mx-auto px-10">
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["all", "live", "planned"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: "0.375rem 1rem", borderRadius: "9999px", fontSize: "0.8125rem",
                    fontWeight: 600, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                    backgroundColor: filter === f ? C.navy : C.white,
                    color: filter === f ? "#fff" : "#374151",
                    borderColor: filter === f ? C.navy : C.border }}>
                  {f === "all" ? "All" : f === "live" ? `Live (${liveCount})` : `Planned (${plannedCount})`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: "clamp(1.5rem,3vw,3rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "960px" }}>
            {INTEGRATIONS.map(cat => {
              const filtered = cat.items.filter(i => filter === "all" || i.status === filter);
              if (!filtered.length) return null;
              return (
                <div key={cat.cat} style={{ marginBottom: "2.5rem" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>{cat.cat}</h2>
                    <p style={{ fontSize: "0.875rem", color: C.muted }}>{cat.desc}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
                    {filtered.map(item => {
                      const s    = STATUS[item.status]!;
                      const cfg  = item.id ? CONNECTOR_CONFIG[item.id] : null;
                      const live = item.status === "live";
                      return (
                        <div key={item.name}
                          onClick={() => live && item.id && setActive(item.id)}
                          style={{ backgroundColor: C.white, border: `1px solid ${C.border}`,
                            borderRadius: "0.875rem", padding: "1.25rem",
                            cursor: live ? "pointer" : "default",
                            transition: "box-shadow 0.15s, border-color 0.15s" }}
                          onMouseEnter={e => {
                            if (!live) return;
                            (e.currentTarget as HTMLElement).style.borderColor = "#bfcfee";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,41,122,0.08)";
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = C.border;
                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                          }}>

                          {/* Card header */}
                          <div style={{ display: "flex", alignItems: "flex-start",
                            justifyContent: "space-between", marginBottom: "0.625rem", gap: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
                              {cfg && (
                                <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.logoBg,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: cfg.logoColor, fontWeight: 800, fontSize: 10, flexShrink: 0 }}>
                                  {cfg.logoText}
                                </div>
                              )}
                              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: C.text,
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.name}
                              </span>
                            </div>
                            <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "0.15rem 0.6rem",
                              borderRadius: "9999px", backgroundColor: s.bg, color: s.color,
                              border: `1px solid ${s.border}`, flexShrink: 0 }}>
                              {s.label}
                            </span>
                          </div>

                          {/* Description */}
                          <p style={{ fontSize: "0.8125rem", color: "#4a5568", lineHeight: 1.65, marginBottom: live ? "0.875rem" : 0 }}>
                            {item.desc}
                          </p>

                          {/* CTA */}
                          {live && item.id && (
                            <div style={{ paddingTop: "0.875rem", borderTop: `1px solid #f3f4f6` }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem",
                                fontSize: "0.78rem", color: C.blue, fontWeight: 600,
                                background: C.lnavy, border: `1px solid #bfcfee`,
                                borderRadius: 6, padding: "0.3rem 0.625rem" }}>
                                <Zap style={{ width: 11, height: 11 }} /> Connect
                              </span>
                            </div>
                          )}
                          {item.status === "planned" && (
                            <div style={{ paddingTop: "0.875rem", borderTop: `1px solid #f3f4f6` }}>
                              <span style={{ fontSize: "0.75rem", color: "#9ca3af",
                                display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Clock style={{ width: 12, height: 12 }} /> Vote for this connector
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works strip */}
        <section style={{ padding: "clamp(2rem,4vw,4rem) 0", backgroundColor: "#f0ece6",
          borderTop: "1px solid #dcd6ce", borderBottom: "1px solid #dcd6ce" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "860px" }}>
            <div style={{ maxWidth: "480px", marginBottom: "2rem" }}>
              <span className="section-label">How it works</span>
              <h2 className="section-heading">Read-only first. Always.</h2>
              <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.8, marginTop: "0.75rem" }}>
                Every connector starts in Zero-Touch Observation Mode — read-only, no changes to your environment. You see your full identity footprint before Unkov takes any action.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { step: "01", title: "Click Connect",    desc: "Select a connector above and follow the 3-step setup guide." },
                { step: "02", title: "Add credentials",  desc: "Paste your read-only API token — takes under 5 minutes."      },
                { step: "03", title: "Run the scanner",  desc: "One command. Live Identity Drift dashboard in under 30 min."   },
                { step: "04", title: "Review findings",  desc: "Every critical finding surfaced before any action is taken."   },
              ].map(s => (
                <div key={s.step} style={{ backgroundColor: C.white, border: "1px solid #dcd6ce",
                  borderRadius: "0.875rem", padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 800, color: C.blue,
                    letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{s.step}</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: C.text, marginBottom: "0.375rem" }}>{s.title}</div>
                  <p style={{ fontSize: "0.8125rem", color: "#4a5568", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(2.5rem,5vw,5rem) 0" }}>
          <div className="container mx-auto px-10" style={{ maxWidth: "680px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2rem)", fontWeight: 700, color: C.text,
              letterSpacing: "-0.025em", marginBottom: "0.875rem" }}>
              Missing an integration?
            </h2>
            <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: 1.75, marginBottom: "2rem" }}>
              If you're a pilot customer, tell us which system you need first. The roadmap is shaped by real customer environments.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/early-access")}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: C.navy, color: "#fff", fontWeight: 700,
                  fontSize: "0.9375rem", padding: "0.75rem 1.75rem", borderRadius: "9999px", border: "none", cursor: "pointer" }}>
                Apply for pilot <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
              <a href="mailto:info@unkov.com"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  color: C.navy, fontWeight: 600, fontSize: "0.9375rem",
                  padding: "0.75rem 1.75rem", borderRadius: "9999px",
                  border: "1px solid #c2d4f8", backgroundColor: C.lnavy, textDecoration: "none" }}>
                Request an integration
              </a>
            </div>
          </div>
        </section>

      </div>
      <Footer />

      {/* Connector modal */}
      {activeConnector && (
        <ConnectorModal
          connectorId={activeConnector}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
