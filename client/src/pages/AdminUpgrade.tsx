import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { supabase, createInvestorToken, revokeInvestorToken, getRecentInvestorTokens, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, Lock, Users, RefreshCw, Plus, Trash2, Key,
  AlertTriangle, CheckCircle, UserCog, Activity, ShieldCheck,
  ShieldAlert, Clock, Eye, Database, Wifi, WifiOff, ArrowRight,
  Download, LogOut, TrendingUp, Filter,
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────
const D = {
  bg:     "#0a0f1e",
  panel:  "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text:   "#e2e8f0",
  muted:  "#64748b",
  soft:   "#94a3b8",
};

// ── Shared components ─────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ backgroundColor: D.panel, border: `1px solid ${D.border}`, borderRadius: 12, ...style }}>{children}</div>;
}

function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1rem", borderBottom: `1px solid ${D.border}` }}>
      <div>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: D.text }}>{title}</span>
        {sub && <span style={{ fontSize: "0.72rem", color: D.muted, marginLeft: 8 }}>{sub}</span>}
      </div>
      {action}
    </div>
  );
}

function Toast({ msg }: { msg: { text: string; ok: boolean } | null }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1rem", backgroundColor: msg.ok ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${msg.ok ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`, color: msg.ok ? "#34d399" : "#f87171", fontSize: "0.8125rem" }}>
      {msg.ok ? <CheckCircle size={14} /> : <AlertTriangle size={14} />} {msg.text}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    admin:           { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Admin"      },
    paying_customer: { color: "#34d399", bg: "rgba(52,211,153,0.12)",  label: "Production" },
    pilot_customer:  { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  label: "Pilot"      },
  };
  const s = map[role] ?? { color: D.soft, bg: "rgba(255,255,255,0.06)", label: role };
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 9px", borderRadius: 999, backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
}

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <Card style={{ padding: "1rem" }}>
      <div style={{ fontSize: "0.7rem", color: D.muted, marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: D.muted, marginTop: "0.25rem" }}>{sub}</div>}
    </Card>
  );
}

function RefreshBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}>
      <RefreshCw size={12} /> Refresh
    </button>
  );
}

function ts(iso: string | null | undefined, fallback = "—") {
  if (!iso) return fallback;
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Tab: Overview ─────────────────────────────────────────────────
function OverviewTab({ users }: { users: any[] }) {
  const [authEvents, setAuthEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    // Pull recent role changes from users table (updated_at vs created_at delta)
    const { data } = await supabase
      .from("users")
      .select("id, email, name, role, created_at, contract_date, pilot_start_date")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setAuthEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const now = Date.now();
  const last7 = users.filter(u => u.created_at && now - new Date(u.created_at).getTime() < 7 * 86400000).length;
  const production = users.filter(u => u.role === "paying_customer").length;
  const pilot = users.filter(u => u.role === "pilot_customer").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "0.75rem" }}>
        <StatCard label="Total users"       value={users.length} color="#60a5fa" />
        <StatCard label="New last 7 days"   value={last7}        color="#a78bfa" sub="signups" />
        <StatCard label="Production"        value={production}   color="#34d399" sub="paying customers" />
        <StatCard label="Pilot"             value={pilot}        color="#f59e0b" sub="in trial" />
        <StatCard label="Admins"            value={users.filter(u => u.role === "admin").length} color="#f87171" />
      </div>

      {/* Recent signups */}
      <Card>
        <SectionHead title="Recent account activity" sub={`${authEvents.length} users`} action={<RefreshBtn onClick={fetchEvents} />} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: D.muted, borderBottom: `1px solid ${D.border}` }}>
                {["User", "Role", "Joined", "Pilot start", "Production date", "Status"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading…</td></tr>}
              {!loading && authEvents.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontWeight: 600, color: D.text }}>{u.name || "—"}</div>
                    <div style={{ fontSize: "0.7rem", color: D.muted }}>{u.email}</div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: "0.75rem 1rem", color: D.muted, fontSize: "0.72rem" }}>{ts(u.created_at)}</td>
                  <td style={{ padding: "0.75rem 1rem", color: D.muted, fontSize: "0.72rem" }}>{ts(u.pilot_start_date)}</td>
                  <td style={{ padding: "0.75rem 1rem", color: u.contract_date ? "#34d399" : D.muted, fontSize: "0.72rem" }}>{ts(u.contract_date)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {u.contract_date
                      ? <span style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700 }}>● Production</span>
                      : u.pilot_start_date
                        ? <span style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: 700 }}>● Pilot active</span>
                        : <span style={{ fontSize: "0.7rem", color: D.muted }}>● Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Users ────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter]     = useState<"all" | "pilot_customer" | "paying_customer" | "admin">("all");
  const [search, setSearch]     = useState("");
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null);

  const flash = (text: string, ok: boolean) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 3500); };

  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (!error && data) setUsers(data);
    else if (error) flash(`Failed to load users: ${error.message}`, false);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const setRole = async (userId: string, newRole: string, email: string) => {
    if (!supabase) return;
    setUpdating(userId);
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);
    if (error) flash(`Failed: ${error.message}`, false);
    else { flash(`${email} → ${newRole.replace("_", " ")}`, true); fetchUsers(); }
    setUpdating(null);
  };

  const startPilot = async (userId: string, email: string) => {
    if (!supabase) return;
    setUpdating(userId);
    const { error } = await supabase.from("users").update({ pilot_start_date: new Date().toISOString() }).eq("id", userId);
    if (error) flash(`Failed: ${error.message}`, false);
    else { flash(`Pilot started for ${email}`, true); fetchUsers(); }
    setUpdating(null);
  };

  const visible = users
    .filter(u => filter === "all" || u.role === filter)
    .filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase()) || u.company?.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const rows = visible.map(u => ({ email: u.email, name: u.name, company: u.company, role: u.role, joined: u.created_at, pilot_start: u.pilot_start_date, production: u.contract_date }));
    const csv = [Object.keys(rows[0]).join(","), ...rows.map(r => Object.values(r).map(v => `"${v ?? ""}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "unkov-users.csv"; a.click();
  };

  const stats = { total: users.length, admin: users.filter(u => u.role === "admin").length, paying: users.filter(u => u.role === "paying_customer").length, pilot: users.filter(u => u.role === "pilot_customer").length };

  const inp: React.CSSProperties = { padding: "0.4rem 0.75rem", fontSize: "0.8125rem", backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${D.border}`, borderRadius: 8, color: D.text, outline: "none" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Total", value: stats.total,  color: "#60a5fa" },
          { label: "Admin", value: stats.admin,  color: "#f59e0b" },
          { label: "Production", value: stats.paying, color: "#34d399" },
          { label: "Pilot", value: stats.pilot,  color: "#a78bfa" },
        ].map(s => <StatCard key={s.label} label={s.label} value={loading ? "—" : s.value} color={s.color} />)}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Search name, email, company…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: "1 1 200px" }} />
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "pilot_customer", "paying_customer", "admin"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, borderRadius: 7, border: `1px solid ${filter === f ? "#0061d4" : D.border}`, backgroundColor: filter === f ? "rgba(0,97,212,0.15)" : "transparent", color: filter === f ? "#60a5fa" : D.muted, cursor: "pointer" }}>
              {f === "all" ? "All" : f === "pilot_customer" ? "Pilot" : f === "paying_customer" ? "Production" : "Admin"}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.35rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#60a5fa", border: `1px solid ${D.border}`, borderRadius: 7, background: "none", cursor: "pointer" }}>
          <Download size={12} /> Export CSV
        </button>
        <RefreshBtn onClick={fetchUsers} />
      </div>

      <Toast msg={msg} />

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: D.muted, borderBottom: `1px solid ${D.border}` }}>
                {["User", "Company", "Role", "Joined", "Pilot start", "Production", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1rem", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading users…</td></tr>}
              {!loading && visible.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>No users match.</td></tr>}
              {visible.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ fontWeight: 600, color: D.text }}>{u.name || "—"}</div>
                    <div style={{ fontSize: "0.7rem", color: D.muted, marginTop: 2 }}>{u.email}</div>
                    <div style={{ fontSize: "0.65rem", color: D.muted, marginTop: 1, fontFamily: "monospace" }}>{u.id?.slice(0, 8)}…</div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: D.soft }}>{u.company || "—"}</td>
                  <td style={{ padding: "0.875rem 1rem" }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: "0.875rem 1rem", color: D.muted, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{ts(u.created_at)}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                    {u.pilot_start_date
                      ? <span style={{ color: "#f59e0b" }}>{ts(u.pilot_start_date)}</span>
                      : <button onClick={() => startPilot(u.id, u.email)} disabled={updating === u.id}
                          style={{ fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(245,158,11,0.3)", backgroundColor: "rgba(245,158,11,0.07)", color: "#f59e0b", cursor: "pointer" }}>
                          Start pilot
                        </button>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                    {u.contract_date ? <span style={{ color: "#34d399" }}>{ts(u.contract_date)}</span> : <span style={{ color: D.muted }}>—</span>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(["pilot_customer", "paying_customer", "admin"] as const).filter(r => r !== u.role).map(r => (
                        <button key={r} disabled={updating === u.id} onClick={() => setRole(u.id, r, u.email)}
                          style={{ fontSize: "0.68rem", fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: `1px solid ${D.border}`, backgroundColor: "rgba(255,255,255,0.04)", color: D.soft, cursor: updating === u.id ? "not-allowed" : "pointer", opacity: updating === u.id ? 0.5 : 1, whiteSpace: "nowrap" }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.09)")}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}>
                          → {r === "pilot_customer" ? "Pilot" : r === "paying_customer" ? "Production" : "Admin"}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Audit Log ────────────────────────────────────────────────
function AuditTab() {
  const [logs, setLogs]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [msg, setMsg]         = useState<{ text: string; ok: boolean } | null>(null);

  const flash = (text: string, ok: boolean) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 3500); };

  const fetchLogs = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    // Combine: user role changes (from users table), investor token events
    const [usersRes, tokensRes] = await Promise.all([
      supabase.from("users").select("id, email, name, role, created_at, contract_date, pilot_start_date").order("created_at", { ascending: false }).limit(50),
      supabase.from("active_investor_tokens" as any).select("*").limit(50).catch(() => ({ data: [], error: null })),
    ]);

    const events: any[] = [];

    (usersRes.data || []).forEach(u => {
      events.push({ id: `signup-${u.id}`, time: u.created_at, type: "SIGNUP", actor: u.email, detail: `Account created — role: ${u.role}`, color: "#60a5fa" });
      if (u.pilot_start_date) events.push({ id: `pilot-${u.id}`, time: u.pilot_start_date, type: "PILOT_START", actor: u.email, detail: "Pilot access granted", color: "#f59e0b" });
      if (u.contract_date)    events.push({ id: `prod-${u.id}`,  time: u.contract_date,    type: "UPGRADED",   actor: u.email, detail: "Upgraded to production", color: "#34d399" });
    });

    ((tokensRes as any).data || []).forEach((t: any) => {
      events.push({ id: `token-${t.id}`, time: t.created_at, type: "TOKEN_CREATED", actor: t.investor_email || "—", detail: `Investor token created — ${t.status}`, color: "#a78bfa" });
    });

    events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setLogs(events);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const typeColors: Record<string, string> = {
    SIGNUP: "#60a5fa", PILOT_START: "#f59e0b", UPGRADED: "#34d399",
    TOKEN_CREATED: "#a78bfa", ROLE_CHANGE: "#f87171",
  };

  const types = ["all", ...Array.from(new Set(logs.map(l => l.type)))];
  const visible = filter === "all" ? logs : logs.filter(l => l.type === filter);

  const exportLog = () => {
    const csv = ["time,type,actor,detail", ...visible.map(l => `"${l.time}","${l.type}","${l.actor}","${l.detail}"`)].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "unkov-audit-log.csv"; a.click();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.72rem", fontWeight: 600, borderRadius: 7, border: `1px solid ${filter === t ? "#0061d4" : D.border}`, backgroundColor: filter === t ? "rgba(0,97,212,0.15)" : "transparent", color: filter === t ? "#60a5fa" : D.muted, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t === "all" ? "All events" : t.replace("_", " ")}
            </button>
          ))}
        </div>
        <button onClick={exportLog} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.3rem 0.75rem", fontSize: "0.72rem", fontWeight: 600, color: "#60a5fa", border: `1px solid ${D.border}`, borderRadius: 7, background: "none", cursor: "pointer", marginLeft: "auto" }}>
          <Download size={12} /> Export CSV
        </button>
        <RefreshBtn onClick={fetchLogs} />
      </div>

      <Toast msg={msg} />

      <Card>
        <SectionHead title="Audit log" sub={`${visible.length} events`} />
        <div>
          {loading && <div style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading events…</div>}
          {!loading && visible.length === 0 && <div style={{ padding: "2rem", textAlign: "center", color: D.muted }}>No events found.</div>}
          {visible.map((log, i) => (
            <div key={log.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "0.875rem 1rem", borderBottom: i < visible.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none" }}>
              {/* Timeline dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: typeColors[log.type] || D.muted }} />
                {i < visible.length - 1 && <div style={{ width: 1, height: "calc(100% + 0.875rem)", backgroundColor: "rgba(255,255,255,0.05)", marginTop: 4 }} />}
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "1px 8px", borderRadius: 999, backgroundColor: `${typeColors[log.type]}18`, color: typeColors[log.type] || D.muted }}>
                    {log.type.replace("_", " ")}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: D.muted }}>{ts(log.time)}</span>
                </div>
                <div style={{ fontSize: "0.8125rem", color: D.text, fontWeight: 500 }}>{log.actor}</div>
                <div style={{ fontSize: "0.75rem", color: D.soft, marginTop: 1 }}>{log.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Tab: System ───────────────────────────────────────────────────
function SystemTab() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");
  const [dbUsers, setDbUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) { setStatus("error"); setLoading(false); return; }
      try {
        const { count, error } = await supabase.from("users").select("*", { count: "exact", head: true });
        if (error) throw error;
        setDbUsers(count ?? 0);
        setStatus("ok");
      } catch { setStatus("error"); }
      setLoading(false);
    })();
  }, []);

  const checks = [
    { label: "Supabase configured",       ok: isSupabaseConfigured,  detail: isSupabaseConfigured ? "VITE_SUPABASE_URL + KEY present" : "Missing env vars — redeploy after adding" },
    { label: "Database connection",       ok: status === "ok",       detail: status === "checking" ? "Checking…" : status === "ok" ? "Connected to public.users" : "Cannot reach database" },
    { label: "Users table accessible",   ok: dbUsers !== null,       detail: dbUsers !== null ? `${dbUsers} user rows found` : "Table query failed" },
    { label: "Investor tokens view",      ok: isSupabaseConfigured,  detail: "active_investor_tokens view" },
  ];

  const envVars = [
    { key: "VITE_SUPABASE_URL",            present: !!import.meta.env.VITE_SUPABASE_URL },
    { key: "VITE_SUPABASE_PUBLISHABLE_KEY",present: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    { key: "VITE_API_URL",                 present: !!import.meta.env.VITE_API_URL },
    { key: "VITE_DASHBOARD_API_KEY",       present: !!import.meta.env.VITE_DASHBOARD_API_KEY },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Health checks */}
      <Card>
        <SectionHead title="System health" sub={loading ? "Checking…" : status === "ok" ? "All systems operational" : "Issues detected"} />
        <div>
          {checks.map((c, i) => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.875rem 1rem", borderBottom: i < checks.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none" }}>
              {c.ok
                ? <CheckCircle size={15} color="#34d399" style={{ flexShrink: 0 }} />
                : <AlertTriangle size={15} color="#f87171" style={{ flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: D.text }}>{c.label}</div>
                <div style={{ fontSize: "0.72rem", color: D.muted, marginTop: 1 }}>{c.detail}</div>
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: c.ok ? "#34d399" : "#f87171" }}>
                {c.ok ? "OK" : "FAIL"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Env vars */}
      <Card>
        <SectionHead title="Environment variables" sub="Vercel deployment" />
        <div>
          {envVars.map((v, i) => (
            <div key={v.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.875rem 1rem", borderBottom: i < envVars.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none" }}>
              {v.present
                ? <CheckCircle size={14} color="#34d399" style={{ flexShrink: 0 }} />
                : <AlertTriangle size={14} color="#f87171" style={{ flexShrink: 0 }} />}
              <code style={{ flex: 1, fontSize: "0.8rem", color: v.present ? D.soft : "#f87171", fontFamily: "monospace" }}>{v.key}</code>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: v.present ? "#34d399" : "#f87171" }}>
                {v.present ? "SET" : "MISSING"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick SQL */}
      <Card style={{ padding: "1.25rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: D.soft, marginBottom: "0.875rem" }}>Useful SQL — run in Supabase SQL Editor</div>
        {[
          { label: "Grant admin to a user", sql: `UPDATE public.users SET role = 'admin'\nWHERE email = 'user@example.com';` },
          { label: "List all users + roles", sql: `SELECT email, name, role, created_at\nFROM public.users ORDER BY created_at DESC;` },
          { label: "Create missing profile row", sql: `INSERT INTO public.users (id, email, name, role)\nSELECT id, email, 'Name', 'pilot_customer'\nFROM auth.users WHERE email = 'user@example.com'\nON CONFLICT (id) DO NOTHING;` },
        ].map(q => (
          <div key={q.label} style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.72rem", color: D.muted, marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{q.label}</div>
            <pre style={{ margin: 0, padding: "0.75rem 1rem", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: "0.78rem", color: "#60a5fa", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{q.sql}</pre>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Tab: Investor Tokens ──────────────────────────────────────────
function TokensTab() {
  const [tokens, setTokens]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]   = useState({ name: "", email: "", hours: "48" });
  const [msg, setMsg]     = useState<{ text: string; ok: boolean } | null>(null);

  const flash = (text: string, ok: boolean) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 4000); };

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try { setTokens((await getRecentInvestorTokens()) || []); }
    catch (e: any) { flash(e.message || "Failed to load tokens.", false); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  const create = async () => {
    if (!form.name.trim() || !form.email.trim()) { flash("Name and email are required.", false); return; }
    setCreating(true);
    try {
      await createInvestorToken(form.name.trim(), form.email.trim(), parseInt(form.hours) || 48);
      flash(`Token created for ${form.email}`, true);
      setForm({ name: "", email: "", hours: "48" });
      fetchTokens();
    } catch (e: any) { flash(e.message || "Failed to create token.", false); }
    setCreating(false);
  };

  const revoke = async (email: string) => {
    setRevoking(email);
    try { await revokeInvestorToken(email); flash(`Token revoked for ${email}`, true); fetchTokens(); }
    catch (e: any) { flash(e.message || "Failed to revoke.", false); }
    setRevoking(null);
  };

  const timeLeft = (expiresAt: string) => {
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return { label: "Expired", color: "#f87171" };
    const h = Math.floor(ms / 3600000);
    if (h < 6)  return { label: `${h}h left`, color: "#f87171" };
    if (h < 24) return { label: `${h}h left`, color: "#f59e0b" };
    return { label: `${Math.floor(h / 24)}d left`, color: "#34d399" };
  };

  const inp: React.CSSProperties = { padding: "0.5rem 0.75rem", fontSize: "0.8125rem", backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${D.border}`, borderRadius: 8, color: D.text, outline: "none" };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <StatCard label="Active tokens"  value={loading ? "—" : tokens.filter(t => t.status === "active").length} color="#34d399" />
        <StatCard label="Accessed"       value={loading ? "—" : tokens.filter(t => (t.used_count ?? 0) > 0).length} color="#60a5fa" />
        <StatCard label="Expiring < 6h"  value={loading ? "—" : tokens.filter(t => { const ms = new Date(t.expires_at).getTime() - Date.now(); return t.status === "active" && ms > 0 && ms < 6 * 3600000; }).length} color="#f59e0b" />
      </div>

      <Card style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: D.soft, marginBottom: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={13} /> Generate investor access token
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Investor name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...inp, flex: "1 1 150px" }} />
          <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ ...inp, flex: "2 1 200px" }} />
          <select value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} style={inp}>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
            <option value="168">7 days</option>
          </select>
          <button onClick={create} disabled={creating}
            style={{ padding: "0.5rem 1.25rem", backgroundColor: creating ? "#1e3a5f" : "#0061d4", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600, cursor: creating ? "not-allowed" : "pointer" }}>
            {creating ? "Creating…" : "Generate"}
          </button>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.75rem", color: D.muted }}>{tokens.length} tokens total</div>
        <RefreshBtn onClick={fetchTokens} />
      </div>

      <Toast msg={msg} />

      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ textAlign: "left", color: D.muted, borderBottom: `1px solid ${D.border}` }}>
                {["Investor", "Status", "Uses", "Created", "Expires", "Time left", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1rem", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading…</td></tr>}
              {!loading && tokens.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>No tokens. Generate one above.</td></tr>}
              {tokens.map(t => {
                const active = t.status === "active";
                const tl = timeLeft(t.expires_at);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ fontWeight: 600, color: D.text }}>{t.investor_name}</div>
                      <div style={{ fontSize: "0.7rem", color: D.muted, marginTop: 2 }}>{t.investor_email}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, backgroundColor: active ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", color: active ? "#34d399" : "#f87171" }}>
                        {active ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                        {t.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ color: (t.used_count ?? 0) > 0 ? "#60a5fa" : D.muted, fontWeight: (t.used_count ?? 0) > 0 ? 600 : 400 }}>{t.used_count ?? 0}</span>
                      <span style={{ color: D.muted }}> / {t.max_uses ?? "∞"}</span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem", color: D.muted, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{ts(t.created_at)}</td>
                    <td style={{ padding: "0.875rem 1rem", fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                      <div style={{ color: D.soft }}>{new Date(t.expires_at).toLocaleDateString()}</div>
                      <div style={{ color: D.muted }}>{new Date(t.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: tl.color }}>{tl.label}</span>
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      {active && (
                        <button onClick={() => revoke(t.investor_email)} disabled={revoking === t.investor_email}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer", opacity: revoking === t.investor_email ? 0.5 : 1 }}>
                          <Trash2 size={10} /> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function AdminUpgrade() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<"overview" | "users" | "audit" | "tokens" | "system">("overview");
  const [users, setUsers] = useState<any[]>([]);

  // Pre-fetch users for overview tab
  useEffect(() => {
    if (!supabase || !user || user.role !== "admin") return;
    supabase.from("users").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setUsers(data); });
  }, [user]);

  // Non-admin: show blocked screen with SQL fix instructions
  if (user && user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: D.bg, color: D.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
          <Lock style={{ width: 24, height: 24, color: "#f87171" }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f87171", marginBottom: "0.625rem" }}>Admin access required</h2>
        <p style={{ color: D.muted, maxWidth: 400, lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          Signed in as <strong style={{ color: D.soft }}>{user.email}</strong> with role{" "}
          <code style={{ backgroundColor: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>{user.role}</code>.
        </p>
        <Card style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", textAlign: "left", maxWidth: 520 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: D.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
            Run in Supabase → SQL Editor to grant admin
          </div>
          <pre style={{ fontSize: "0.78rem", color: "#60a5fa", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{`INSERT INTO public.users (id, email, name, role)\nSELECT id, email, 'Admin', 'admin'\nFROM auth.users WHERE email = '${user.email}'\nON CONFLICT (id) DO UPDATE SET role = 'admin';`}</pre>
        </Card>
        <button onClick={() => navigate("/")} style={{ padding: "0.625rem 1.5rem", backgroundColor: "#0061d4", color: "#fff", border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
          ← Back to home
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: "Overview",         icon: TrendingUp  },
    { id: "users"    as const, label: "Users",            icon: Users       },
    { id: "audit"    as const, label: "Audit log",        icon: Clock       },
    { id: "tokens"   as const, label: "Investor tokens",  icon: Key         },
    { id: "system"   as const, label: "System",           icon: Database    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: D.bg, color: D.text }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: "0.875rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <UserCog size={17} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700 }}>Admin Console</div>
            <div style={{ fontSize: "0.72rem", color: D.muted }}>{user?.email} · {users.length} users</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: D.muted, background: "none", border: `1px solid ${D.border}`, borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            <Activity size={12} /> Dashboard
          </button>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: D.muted, background: "none", border: `1px solid ${D.border}`, borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            <Home size={12} /> Home
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#f87171", background: "none", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 3rem" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${D.border}`, marginBottom: "1.75rem" }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.75rem 1.125rem", fontSize: "0.875rem", fontWeight: active ? 600 : 400, color: active ? D.text : D.muted, background: "none", border: "none", borderBottom: `2px solid ${active ? "#0061d4" : "transparent"}`, cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap", transition: "color 0.12s" }}>
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {tab === "overview" && <OverviewTab users={users} />}
        {tab === "users"    && <UsersTab />}
        {tab === "audit"    && <AuditTab />}
        {tab === "tokens"   && <TokensTab />}
        {tab === "system"   && <SystemTab />}
      </div>
    </div>
  );
}
