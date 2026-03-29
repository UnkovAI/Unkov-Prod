import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { supabase, createInvestorToken, revokeInvestorToken, getRecentInvestorTokens } from "../lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Clock, ShieldCheck, ShieldAlert, Home, Lock,
  Users, RefreshCw, Plus, Trash2, Key,
  AlertTriangle, CheckCircle, UserCog, Activity,
} from "lucide-react";

const D = {
  bg:     "#0a0f1e",
  panel:  "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text:   "#e2e8f0",
  muted:  "#64748b",
  soft:   "#94a3b8",
};

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ backgroundColor: D.panel, border: `1px solid ${D.border}`, borderRadius: 12, ...style }}>{children}</div>;
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

// ── Tab: Users ────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
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

  const stats = {
    total:  users.length,
    admin:  users.filter(u => u.role === "admin").length,
    paying: users.filter(u => u.role === "paying_customer").length,
    pilot:  users.filter(u => u.role === "pilot_customer").length,
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Total users", value: stats.total,  color: "#60a5fa" },
          { label: "Admin",       value: stats.admin,  color: "#f59e0b" },
          { label: "Production",  value: stats.paying, color: "#34d399" },
          { label: "Pilot",       value: stats.pilot,  color: "#a78bfa" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "0.875rem 1rem" }}>
            <div style={{ fontSize: "0.7rem", color: D.muted, marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: s.color }}>{loading ? "—" : s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
        <button onClick={fetchUsers} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <Toast msg={msg} />

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: D.muted, borderBottom: `1px solid ${D.border}` }}>
              <th style={{ padding: "0.875rem 1rem" }}>User</th>
              <th style={{ padding: "0.875rem 1rem" }}>Company</th>
              <th style={{ padding: "0.875rem 1rem" }}>Role</th>
              <th style={{ padding: "0.875rem 1rem" }}>Joined</th>
              <th style={{ padding: "0.875rem 1rem" }}>Change role</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading users…</td></tr>}
            {!loading && users.length === 0 && <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>No users found.</td></tr>}
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ fontWeight: 600, color: D.text }}>{u.name || "—"}</div>
                  <div style={{ fontSize: "0.72rem", color: D.muted, marginTop: 2 }}>{u.email}</div>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: D.soft }}>{u.company || "—"}</td>
                <td style={{ padding: "0.875rem 1rem" }}><RoleBadge role={u.role} /></td>
                <td style={{ padding: "0.875rem 1rem", color: D.muted, fontSize: "0.72rem" }}>
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  {u.pilot_start_date && <div style={{ marginTop: 2 }}>Pilot: {new Date(u.pilot_start_date).toLocaleDateString()}</div>}
                  {u.contract_date   && <div style={{ marginTop: 2, color: "#34d399" }}>Prod: {new Date(u.contract_date).toLocaleDateString()}</div>}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
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
    try {
      await revokeInvestorToken(email);
      flash(`Token revoked for ${email}`, true);
      fetchTokens();
    } catch (e: any) { flash(e.message || "Failed to revoke.", false); }
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

  const activeCount  = tokens.filter(t => t.status === "active").length;
  const usedCount    = tokens.filter(t => (t.used_count ?? 0) > 0).length;
  const expiringSoon = tokens.filter(t => {
    const ms = new Date(t.expires_at).getTime() - Date.now();
    return t.status === "active" && ms > 0 && ms < 6 * 3600000;
  }).length;

  const inp: React.CSSProperties = {
    padding: "0.5rem 0.75rem", fontSize: "0.8125rem",
    backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${D.border}`,
    borderRadius: 8, color: D.text, outline: "none",
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Active tokens",  value: activeCount,  color: "#34d399" },
          { label: "Accessed",       value: usedCount,    color: "#60a5fa" },
          { label: "Expiring < 6h",  value: expiringSoon, color: "#f59e0b" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "0.875rem 1rem" }}>
            <div style={{ fontSize: "0.7rem", color: D.muted, marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: s.color }}>{loading ? "—" : s.value}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: D.soft, marginBottom: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={13} /> Generate investor access token
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Investor name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...inp, flex: "1 1 150px" }} />
          <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ ...inp, flex: "2 1 200px" }} />
          <select value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} style={{ ...inp, flex: "none" }}>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
            <option value="168">7 days</option>
          </select>
          <button onClick={create} disabled={creating}
            style={{ padding: "0.5rem 1.25rem", backgroundColor: creating ? "#1e3a5f" : "#0061d4", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600, cursor: creating ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {creating ? "Creating…" : "Generate token"}
          </button>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.75rem", color: D.muted }}>{tokens.length} tokens total</div>
        <button onClick={fetchTokens} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <Toast msg={msg} />

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: D.muted, borderBottom: `1px solid ${D.border}` }}>
              <th style={{ padding: "0.875rem 1rem" }}>Investor</th>
              <th style={{ padding: "0.875rem 1rem" }}>Status</th>
              <th style={{ padding: "0.875rem 1rem" }}>Uses</th>
              <th style={{ padding: "0.875rem 1rem" }}>Created</th>
              <th style={{ padding: "0.875rem 1rem" }}>Expires</th>
              <th style={{ padding: "0.875rem 1rem" }}>Time left</th>
              <th style={{ padding: "0.875rem 1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>Loading tokens…</td></tr>}
            {!loading && tokens.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: D.muted }}>No tokens yet. Generate one above.</td></tr>}
            {tokens.map(t => {
              const active = t.status === "active";
              const tl = timeLeft(t.expires_at);
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ fontWeight: 600, color: D.text }}>{t.investor_name}</div>
                    <div style={{ fontSize: "0.72rem", color: D.muted, marginTop: 2 }}>{t.investor_email}</div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, backgroundColor: active ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", color: active ? "#34d399" : "#f87171" }}>
                      {active ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ color: (t.used_count ?? 0) > 0 ? "#60a5fa" : D.muted, fontWeight: (t.used_count ?? 0) > 0 ? 600 : 400 }}>{t.used_count ?? 0}</span>
                    <span style={{ color: D.muted }}> / {t.max_uses ?? "∞"}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: D.muted, fontSize: "0.72rem" }}>
                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.72rem" }}>
                    <div style={{ color: D.soft }}>{new Date(t.expires_at).toLocaleDateString()}</div>
                    <div style={{ color: D.muted, marginTop: 1 }}>{new Date(t.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: tl.color }}>{tl.label}</span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {active && (
                      <button onClick={() => revoke(t.investor_email)} disabled={revoking === t.investor_email}
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 600, padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "rgba(239,68,68,0.07)", color: "#f87171", cursor: revoking === t.investor_email ? "not-allowed" : "pointer", opacity: revoking === t.investor_email ? 0.5 : 1 }}>
                        <Trash2 size={10} /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function AdminUpgrade() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<"users" | "tokens">("users");

  // Not logged in — show sign in prompt
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: D.bg, color: D.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "rgba(0,97,212,0.12)", border: "1px solid rgba(0,97,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
          <Lock style={{ width: 24, height: 24, color: "#60a5fa" }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: D.text, marginBottom: "0.625rem" }}>Sign in required</h2>
        <p style={{ color: D.muted, maxWidth: 360, lineHeight: 1.7, marginBottom: "1.75rem", fontSize: "0.875rem" }}>
          You need to be signed in as an admin to access this page.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/login")} style={{ padding: "0.625rem 1.5rem", backgroundColor: "#0061d4", color: "#fff", border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
            Sign in
          </button>
          <button onClick={() => navigate("/")} style={{ padding: "0.625rem 1.5rem", backgroundColor: "transparent", color: D.muted, border: `1px solid ${D.border}`, borderRadius: "9999px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
            ← Home
          </button>
        </div>
      </div>
    );
  }

  // Non-admin: show clear blocked screen with SQL fix
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
        <Card style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", textAlign: "left", maxWidth: 500 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: D.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
            Run this in Supabase → SQL Editor to fix your role
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
    { id: "users"  as const, label: "Users",           icon: Users },
    { id: "tokens" as const, label: "Investor Tokens", icon: Key   },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: D.bg, color: D.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserCog size={17} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700 }}>Admin Console</div>
            <div style={{ fontSize: "0.72rem", color: D.muted }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: D.muted, background: "none", border: `1px solid ${D.border}`, borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            <Activity size={12} /> Dashboard
          </button>
          <button onClick={async () => { await logout(); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: D.muted, background: "none", border: `1px solid ${D.border}`, borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            Sign out
          </button>
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: D.muted, background: "none", border: `1px solid ${D.border}`, borderRadius: 8, padding: "0.375rem 0.875rem", cursor: "pointer" }}>
            <Home size={12} /> Home
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${D.border}`, marginBottom: "1.75rem" }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.625rem 1.125rem", fontSize: "0.875rem", fontWeight: active ? 600 : 400, color: active ? D.text : D.muted, background: "none", border: "none", borderBottom: `2px solid ${active ? "#0061d4" : "transparent"}`, cursor: "pointer", marginBottom: -1, transition: "color 0.12s" }}>
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        {tab === "users"  && <UsersTab />}
        {tab === "tokens" && <TokensTab />}
      </div>
    </div>
  );
}
