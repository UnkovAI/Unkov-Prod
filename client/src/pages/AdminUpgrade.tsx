import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  supabase,
  createInvestorToken,
  revokeInvestorToken,
  getRecentInvestorTokens,
} from "../lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Key, Shield, Activity, LogOut, Home,
  RefreshCw, Download, ChevronDown, ChevronUp,
  Clock, Mail, AlertCircle, CheckCircle,
  XCircle, Plus, Trash2, BarChart2,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────
const D = {
  bg:     "#080d1a",
  panel:  "rgba(255,255,255,0.035)",
  panel2: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  text:   "#e2e8f0",
  muted:  "#64748b",
  soft:   "#94a3b8",
  blue:   "#3b82f6",
  green:  "#22c55e",
  yellow: "#f59e0b",
  red:    "#ef4444",
  purple: "#a78bfa",
};

const roleMap: Record<string, { color: string; label: string }> = {
  admin:           { color: "#f59e0b", label: "Admin"      },
  paying_customer: { color: "#22c55e", label: "Production" },
  pilot_customer:  { color: "#3b82f6", label: "Pilot"      },
};

// ─── Shared primitives ────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: D.panel, border: `1px solid ${D.border}`, borderRadius: 14, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${D.border}`, flexWrap: "wrap", gap: 8 }}>
      <div>
        <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: D.text }}>{title}</span>
        {sub && <span style={{ fontSize: "0.75rem", color: D.muted, marginLeft: 8 }}>{sub}</span>}
      </div>
      {children && <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{children}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = "default", size = "sm", disabled = false }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "default" | "primary" | "danger" | "success" | "ghost";
  size?: "xs" | "sm" | "md"; disabled?: boolean;
}) {
  const variants: Record<string, { bg: string; border: string; color: string }> = {
    default: { bg: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.12)", color: "#94a3b8" },
    primary: { bg: "rgba(59,130,246,0.2)",   border: "rgba(59,130,246,0.4)",   color: "#93c5fd" },
    danger:  { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",    color: "#fca5a5" },
    success: { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",    color: "#86efac" },
    ghost:   { bg: "transparent",            border: "transparent",            color: "#64748b"  },
  };
  const v = variants[variant];
  const p = size === "xs" ? "3px 10px" : size === "sm" ? "6px 14px" : "8px 20px";
  const fs = size === "xs" ? "0.72rem" : "0.8125rem";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: p, fontSize: fs, fontWeight: 600, borderRadius: 8, border: `1px solid ${v.border}`, backgroundColor: v.bg, color: v.color, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", transition: "opacity .15s" }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.75"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = disabled ? "0.5" : "1"; }}
    >
      {children}
    </button>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, backgroundColor: color + "22", color, border: `1px solid ${color}44` }}>{children}</span>;
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div style={{ backgroundColor: D.panel, border: `1px solid ${D.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 18, height: 18, color }} />
      </div>
      <div>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.75rem", color: D.muted, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────
function OverviewTab({ users, tokens }: { users: any[]; tokens: any[] }) {
  const byRole = (role: string) => users.filter(u => u.role === role).length;
  const recentUsers = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const stats = [
    { icon: Users,        label: "Total users",       value: users.length,              color: D.blue   },
    { icon: Shield,       label: "Admin accounts",     value: byRole("admin"),           color: D.yellow },
    { icon: CheckCircle,  label: "Production users",   value: byRole("paying_customer"), color: D.green  },
    { icon: Activity,     label: "Pilot users",        value: byRole("pilot_customer"),  color: D.purple },
    { icon: Key,          label: "Investor tokens",    value: tokens.length,             color: D.blue   },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent signups */}
        <Card>
          <SectionHeader title="Recent signups" sub="Last 5 accounts" />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                {["Email", "Role", "Joined"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "0.7rem", color: D.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${D.border}` }}>
                  <td style={{ padding: "10px 20px", fontSize: "0.8125rem", color: D.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: 160 }}>{u.email}</td>
                  <td style={{ padding: "10px 20px" }}><Badge color={roleMap[u.role]?.color ?? D.muted}>{roleMap[u.role]?.label ?? u.role}</Badge></td>
                  <td style={{ padding: "10px 20px", fontSize: "0.75rem", color: D.muted, whiteSpace: "nowrap" as const }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "24px 20px", textAlign: "center" as const, color: D.muted, fontSize: "0.875rem" }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Role breakdown */}
        <Card>
          <SectionHeader title="Role distribution" />
          <div style={{ padding: 20 }}>
            {Object.entries(roleMap).map(([role, { color, label }]) => {
              const count = byRole(role);
              const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0;
              return (
                <div key={role} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.875rem", color: D.soft }}>{label}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color }}>{count} <span style={{ color: D.muted, fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                    <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 999, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Tab: Users ───────────────────────────────────────────────────
function UsersTab({ users, onRefresh, loading }: { users: any[]; onRefresh: () => void; loading: boolean }) {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState<"email" | "role" | "created_at">("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      return (roleFilter === "all" || u.role === roleFilter) &&
        (!q || u.email.toLowerCase().includes(q) || (u.name || "").toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const va = (a[sortField] ?? "") as string;
      const vb = (b[sortField] ?? "") as string;
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const upgradeRole = async (userId: string, newRole: string) => {
    if (!supabase) return;
    setUpgrading(userId);
    // Uses SECURITY DEFINER function to bypass RLS (admin-only operation)
    const { error } = await supabase.rpc("admin_set_user_role", {
      p_user_id: userId,
      p_role: newRole,
    });
    if (error) {
      console.error("Role update failed:", error);
      alert(`Role update failed: ${error.message}\n\nMake sure you have run the admin_set_user_role SQL function in Supabase.`);
    }
    await onRefresh();
    setUpgrading(null);
  };

  const SortBtn = ({ field, label }: { field: typeof sortField; label: string }) => (
    <button onClick={() => { setSortField(field); setSortAsc(sortField === field ? !sortAsc : false); }}
      style={{ background: "none", border: "none", cursor: "pointer", color: sortField === field ? D.blue : D.muted, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 3, padding: 0 }}>
      {label}
      {sortField === field ? (sortAsc ? <ChevronUp style={{ width: 10, height: 10 }} /> : <ChevronDown style={{ width: 10, height: 10 }} />) : null}
    </button>
  );

  const dlCSV = () => {
    const csv = ["email,name,role,company,created_at", ...filtered.map(u => `${u.email},${u.name || ""},${u.role},${u.company || ""},${u.created_at || ""}`)].join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "users.csv"; a.click();
  };

  return (
    <Card>
      <SectionHeader title="User management" sub={`${filtered.length} of ${users.length}`}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
          style={{ padding: "5px 12px", fontSize: "0.8125rem", backgroundColor: D.panel2, border: `1px solid ${D.border}`, borderRadius: 8, color: D.text, outline: "none", width: 180 }} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: "5px 10px", fontSize: "0.8125rem", backgroundColor: D.panel2, border: `1px solid ${D.border}`, borderRadius: 8, color: D.text, cursor: "pointer" }}>
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="paying_customer">Production</option>
          <option value="pilot_customer">Pilot</option>
        </select>
        <Btn onClick={onRefresh} variant="ghost" size="xs" disabled={loading}>
          <RefreshCw style={{ width: 11, height: 11, animation: loading ? "spin 1s linear infinite" : "none" }} />
        </Btn>
        <Btn onClick={dlCSV} variant="ghost" size="xs"><Download style={{ width: 11, height: 11 }} /> CSV</Btn>
      </SectionHeader>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${D.border}` }}>
              <th style={{ padding: "10px 20px", textAlign: "left" as const }}><SortBtn field="email" label="Email / Name" /></th>
              <th style={{ padding: "10px 20px", textAlign: "left" as const }}><SortBtn field="role" label="Role" /></th>
              <th style={{ padding: "10px 20px", textAlign: "left" as const, fontSize: "0.7rem", color: D.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Company</th>
              <th style={{ padding: "10px 20px", textAlign: "left" as const }}><SortBtn field="created_at" label="Joined" /></th>
              <th style={{ padding: "10px 20px", textAlign: "left" as const, fontSize: "0.7rem", color: D.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Change role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${D.border}` }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: D.text }}>{u.email}</div>
                  {u.name && <div style={{ fontSize: "0.72rem", color: D.muted, marginTop: 2 }}>{u.name}</div>}
                  <div style={{ fontSize: "0.62rem", color: D.muted, fontFamily: "monospace", marginTop: 2, opacity: 0.5 }}>{u.id}</div>
                </td>
                <td style={{ padding: "12px 20px" }}><Badge color={roleMap[u.role]?.color ?? D.muted}>{roleMap[u.role]?.label ?? u.role}</Badge></td>
                <td style={{ padding: "12px 20px", fontSize: "0.8125rem", color: D.soft }}>{u.company || "—"}</td>
                <td style={{ padding: "12px 20px", fontSize: "0.8125rem", color: D.muted, whiteSpace: "nowrap" as const }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                <td style={{ padding: "12px 20px" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                    {u.role !== "paying_customer" && <Btn variant="success" size="xs" disabled={upgrading === u.id} onClick={() => upgradeRole(u.id, "paying_customer")}>{upgrading === u.id ? "…" : "→ Production"}</Btn>}
                    {u.role !== "pilot_customer"  && <Btn variant="primary" size="xs" disabled={upgrading === u.id} onClick={() => upgradeRole(u.id, "pilot_customer")}>{upgrading === u.id ? "…" : "→ Pilot"}</Btn>}
                    {u.role !== "admin"           && <Btn variant="default" size="xs" disabled={upgrading === u.id} onClick={() => upgradeRole(u.id, "admin")}>{upgrading === u.id ? "…" : "→ Admin"}</Btn>}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "32px 20px", textAlign: "center" as const, color: D.muted, fontSize: "0.875rem" }}>No users match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Tab: Tokens ──────────────────────────────────────────────────
function TokensTab({ tokens, onRefresh, loading }: { tokens: any[]; onRefresh: () => void; loading: boolean }) {
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newHours, setNewHours] = useState(24);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);
  const [newTokenEmail, setNewTokenEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim() || !newEmail.trim()) { setCreateError("Name and email are required."); return; }
    setCreateError(""); setCreating(true);
    try {
      const rawToken = await createInvestorToken(newName.trim(), newEmail.trim(), newHours);
      setNewTokenValue(rawToken as string);
      setNewTokenEmail(newEmail.trim());
      setNewName(""); setNewEmail(""); setNewHours(24);
      await onRefresh();
    } catch (e: any) { setCreateError(e?.message ?? "Failed to create token."); }
    setCreating(false);
  };

  const handleRevoke = async (email: string) => {
    setRevoking(email);
    try {
      await revokeInvestorToken(email);
      await onRefresh();
    } catch (e: any) {
      console.error("Revoke error:", e);
      flash(e?.message ?? "Failed to revoke token. The revoke_investor_token function may not exist in Supabase — check SQL Editor.", false);
    }
    setRevoking(null);
  };

  const isExpired = (t: any) => t.expires_at && new Date(t.expires_at) < new Date();
  const inp: React.CSSProperties = { padding: "8px 12px", fontSize: "0.8125rem", backgroundColor: D.panel2, border: `1px solid ${D.border}`, borderRadius: 8, color: D.text, outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader title="Create investor token" sub="Grant time-limited portal access" />
        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: "0.72rem", color: D.muted, display: "block", marginBottom: 5 }}>Investor name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Jane Smith" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: D.muted, display: "block", marginBottom: 5 }}>Investor email</label>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="investor@fund.com" type="email" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: D.muted, display: "block", marginBottom: 5 }}>Hours valid</label>
              <input value={newHours} onChange={e => setNewHours(Number(e.target.value))} type="number" min={1} max={720} style={{ ...inp, width: "100%" }} />
            </div>
          </div>
          {createError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, marginBottom: 12 }}>
              <AlertCircle style={{ width: 14, height: 14, color: D.red, flexShrink: 0 }} />
              <span style={{ fontSize: "0.8125rem", color: "#fca5a5" }}>{createError}</span>
            </div>
          )}
          {newTokenValue && (
            <div style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CheckCircle style={{ width: 15, height: 15, color: D.green, flexShrink: 0 }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#86efac" }}>Token created — copy it now. It will never be shown again.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <code style={{ flex: 1, padding: "8px 12px", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 6, fontSize: "0.78rem", color: "#e2e8f0", fontFamily: "monospace", wordBreak: "break-all", letterSpacing: "0.04em" }}>
                  {newTokenValue}
                </code>
                <Btn variant="primary" size="sm" onClick={() => {
                  navigator.clipboard.writeText(newTokenValue);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}>
                  {copied ? "Copied!" : "Copy token"}
                </Btn>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.78rem", color: D.muted }}>Investor login link:</span>
                <code style={{ flex: 1, padding: "6px 10px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 6, fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace", wordBreak: "break-all" }}>
                  {`${window.location.origin}/investor-gate?email=${encodeURIComponent(newTokenEmail)}&token=${newTokenValue}`}
                </code>
                <Btn variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/investor-gate?email=${encodeURIComponent(newTokenEmail)}&token=${newTokenValue}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}>
                  {copied ? "✓" : "Copy link"}
                </Btn>
              </div>
              <div style={{ marginTop: 10, textAlign: "right" as const }}>
                <Btn variant="ghost" size="xs" onClick={() => { setNewTokenValue(null); setNewTokenEmail(""); }}>Dismiss</Btn>
              </div>
            </div>
          )}
          <Btn onClick={handleCreate} variant="primary" size="sm" disabled={creating}>
            <Plus style={{ width: 13, height: 13 }} />{creating ? "Creating…" : "Create token"}
          </Btn>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Investor tokens" sub={`${tokens.length} tokens`}>
          <Btn onClick={onRefresh} variant="ghost" size="xs" disabled={loading}>
            <RefreshCw style={{ width: 11, height: 11, animation: loading ? "spin 1s linear infinite" : "none" }} />
          </Btn>
        </SectionHeader>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${D.border}` }}>
              {["Investor", "Email", "Created", "Expires", "Status", "Token prefix", ""].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left" as const, fontSize: "0.7rem", color: D.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => {
              const expired = isExpired(t);
              return (
                <tr key={t.id ?? i} style={{ borderBottom: `1px solid ${D.border}`, opacity: expired ? 0.6 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "12px 20px", fontSize: "0.875rem", fontWeight: 600, color: D.text }}>{t.investor_name || "—"}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Mail style={{ width: 12, height: 12, color: D.muted }} />
                      <span style={{ fontSize: "0.8125rem", color: D.soft }}>{t.investor_email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "0.8125rem", color: D.muted, whiteSpace: "nowrap" as const }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock style={{ width: 11, height: 11 }} />
                      {t.created_at ? new Date(t.created_at).toLocaleString() : "—"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: "0.8125rem", color: expired ? D.red : D.muted, whiteSpace: "nowrap" as const }}>
                    {t.expires_at ? new Date(t.expires_at).toLocaleString() : "—"}
                  </td>
                  <td style={{ padding: "12px 20px" }}><Badge color={expired ? D.red : D.green}>{expired ? "Expired" : "Active"}</Badge></td>
                  <td style={{ padding: "12px 20px" }}>
                    {t.token_hash
                      ? <code style={{ fontSize: "0.72rem", color: D.muted, fontFamily: "monospace", letterSpacing: "0.04em" }}>{t.token_hash.slice(0,12)}…</code>
                      : <span style={{ fontSize: "0.72rem", color: D.muted }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <Btn variant="danger" size="xs" disabled={revoking === t.investor_email} onClick={() => handleRevoke(t.investor_email)}>
                      <Trash2 style={{ width: 11, height: 11 }} />{revoking === t.investor_email ? "Revoking…" : "Revoke"}
                    </Btn>
                  </td>
                </tr>
              );
            })}
            {tokens.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "32px 20px", textAlign: "center" as const, color: D.muted, fontSize: "0.875rem" }}>No tokens found</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Tab: Audit ───────────────────────────────────────────────────
function AuditTab({ users }: { users: any[] }) {
  const events = users.flatMap(u => {
    const evts: any[] = [];
    if (u.created_at)    evts.push({ time: u.created_at,    type: "signup",  email: u.email, detail: `Account created · role: ${u.role}` });
    if (u.contract_date) evts.push({ time: u.contract_date, type: "upgrade", email: u.email, detail: "Upgraded to paying_customer" });
    if (u.pilot_start_date) evts.push({ time: u.pilot_start_date, type: "pilot", email: u.email, detail: "Pilot access granted" });
    return evts;
  }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const cfg: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    signup:  { color: D.blue,   icon: Users,       label: "Signup"  },
    upgrade: { color: D.green,  icon: CheckCircle, label: "Upgrade" },
    pilot:   { color: D.purple, icon: Activity,    label: "Pilot"   },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <SectionHeader title="Account audit log" sub={`${events.length} events derived from user records`} />
        {events.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" as const, color: D.muted }}>
            <AlertCircle style={{ width: 20, height: 20, marginBottom: 8, opacity: 0.5 }} />
            <div style={{ fontSize: "0.875rem" }}>No audit events found.</div>
          </div>
        ) : (
          <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
            {events.map((e, i) => {
              const c = cfg[e.type] ?? { color: D.muted, icon: Activity, label: e.type };
              const Icon = c.icon;
              return (
                <div key={i} style={{ display: "flex", gap: 14, padding: "10px 14px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${D.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 14, height: 14, color: c.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: D.text }}>{e.email}</span>
                      <Badge color={c.color}>{c.label}</Badge>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: D.soft }}>{e.detail}</div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: D.muted, whiteSpace: "nowrap" as const }}>{new Date(e.time).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div style={{ padding: "14px 18px", backgroundColor: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10 }}>
        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#93c5fd", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart2 style={{ width: 14, height: 14 }} /> Enhance audit coverage
        </div>
        <div style={{ fontSize: "0.8125rem", color: D.muted, lineHeight: 1.6 }}>
          This view derives events from user table timestamps. For full event-sourced audit trails (role changes, logins, token usage), add a <code style={{ color: D.blue, fontSize: "0.75rem" }}>public.audit_log</code> table and log events via Supabase Edge Functions or DB triggers.
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview",  icon: BarChart2 },
  { id: "users",    label: "Users",     icon: Users     },
  { id: "tokens",   label: "Tokens",    icon: Key       },
  { id: "audit",    label: "Audit log", icon: Activity  },
];

export default function AdminUpgrade() {
  const [, navigate] = useLocation();
  const { user, logout, loading } = useAuth();
  const role = user?.role ?? null;

  const [tab, setTab] = useState("overview");
  const [users, setUsers]   = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!supabase) return;
    setDataLoading(true);
    try {
      // get_all_users uses SECURITY DEFINER to bypass RLS
      const { data: u, error: uErr } = await supabase.rpc("get_all_users");
      if (uErr) console.error("Users fetch error:", uErr);

      // Query investor_tokens table directly (not the active_investor_tokens view)
      // so we can see all tokens including revoked ones in the admin panel.
      // Falls back to the view if the table query is blocked by RLS.
      let tokenData: any[] = [];
      const { data: t, error: tErr } = await supabase
        .from("investor_tokens")
        .select("*")
        .order("created_at", { ascending: false });
      if (!tErr && t) {
        tokenData = t;
      } else {
        // Fallback to the view
        const { data: tv } = await supabase
          .from("active_investor_tokens")
          .select("*")
          .limit(50);
        tokenData = tv || [];
      }

      setUsers(u || []);
      setTokens(tokenData);
    } catch (e) {
      console.error("Admin data fetch error:", e);
    }
    setDataLoading(false);
  }, []);

  useEffect(() => { if (role === "admin") fetchAll(); }, [role, fetchAll]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: D.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" as const, color: D.muted }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.08)", borderTopColor: D.blue, borderRadius: "50%", animation: "spin 0.75s linear infinite", margin: "0 auto 12px" }} />
          <div style={{ fontSize: "0.875rem" }}>Checking access…</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: D.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" as const }}>
          <XCircle style={{ width: 40, height: 40, color: D.red, margin: "0 auto 16px" }} />
          <h2 style={{ color: D.text, marginBottom: 16 }}>Sign in required</h2>
          <Btn onClick={() => navigate("/login")} variant="primary">Go to login</Btn>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: D.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" as const, maxWidth: 360 }}>
          <Shield style={{ width: 40, height: 40, color: D.yellow, margin: "0 auto 16px" }} />
          <h2 style={{ color: D.text, marginBottom: 8 }}>Admin only</h2>
          <p style={{ color: D.muted, fontSize: "0.875rem", marginBottom: 4 }}>{user.email}</p>
          <p style={{ color: D.muted, fontSize: "0.8125rem", marginBottom: 20 }}>
            Role: <Badge color={roleMap[role ?? ""]?.color ?? D.muted}>{roleMap[role ?? ""]?.label ?? role ?? "unknown"}</Badge>
          </p>
          <Btn onClick={() => navigate("/dashboard")} variant="default">← Back to dashboard</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: D.bg, color: D.text }}>
      {/* Sticky top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 56, borderBottom: `1px solid ${D.border}`, backgroundColor: "rgba(8,13,26,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Shield style={{ width: 18, height: 18, color: D.yellow }} />
          <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: D.text }}>Admin Console</span>
          <Badge color={D.yellow}>admin</Badge>
          {dataLoading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: D.blue, borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn onClick={() => navigate("/")} variant="ghost" size="sm">
            <Home style={{ width: 13, height: 13 }} /> Home
          </Btn>
          <Btn onClick={() => navigate("/dashboard")} variant="ghost" size="sm">Dashboard</Btn>
          <Btn onClick={() => navigate("/demo/dashboard")} variant="ghost" size="sm">Demo</Btn>
          <Btn onClick={async () => { await logout(); navigate("/login"); }} variant="default" size="md">
            <LogOut style={{ width: 13, height: 13 }} /> Sign out
          </Btn>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 2, padding: "0 24px", borderBottom: `1px solid ${D.border}`, overflowX: "auto" as const }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 16px", fontSize: "0.875rem", fontWeight: 600, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" as const, transition: "color .15s, border-color .15s", color: tab === t.id ? D.blue : D.muted, borderBottom: `2px solid ${tab === t.id ? D.blue : "transparent"}` }}>
              <Icon style={{ width: 14, height: 14 }} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Page content */}
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab users={users} tokens={tokens} />}
        {tab === "users"    && <UsersTab users={users} onRefresh={fetchAll} loading={dataLoading} />}
        {tab === "tokens"   && <TokensTab tokens={tokens} onRefresh={fetchAll} loading={dataLoading} />}
        {tab === "audit"    && <AuditTab users={users} />}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
