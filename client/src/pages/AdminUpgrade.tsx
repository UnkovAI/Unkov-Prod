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
  ShieldCheck, ShieldAlert, Home, Lock,
  Users, RefreshCw, Plus, Trash2, Key,
  AlertTriangle, CheckCircle, UserCog, Activity,
} from "lucide-react";

const D = {
  bg: "#0a0f1e",
  panel: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text: "#e2e8f0",
  muted: "#64748b",
  soft: "#94a3b8",
};

function Card({ children, style }: any) {
  return (
    <div
      style={{
        backgroundColor: D.panel,
        border: `1px solid ${D.border}`,
        borderRadius: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Toast({ msg }: any) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "0.75rem 1rem",
      borderRadius: 8,
      marginBottom: "1rem",
      backgroundColor: msg.ok ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
      color: msg.ok ? "#34d399" : "#f87171",
    }}>
      {msg.text}
    </div>
  );
}

function RoleBadge({ role }: any) {
  const map: any = {
    admin: { color: "#f59e0b", label: "Admin" },
    paying_customer: { color: "#34d399", label: "Production" },
    pilot_customer: { color: "#60a5fa", label: "Pilot" },
  };
  const r = map[role] || { color: "#94a3b8", label: role };
  return <span style={{ color: r.color }}>{r.label}</span>;
}

/* ================= USERS ================= */

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("users").select("*");
    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card style={{ padding: 20 }}>
      {loading && "Loading..."}
      {!loading &&
        users.map((u) => (
          <div key={u.id}>
            {u.email} — <RoleBadge role={u.role} />
          </div>
        ))}
    </Card>
  );
}

/* ================= TOKENS ================= */

function TokensTab() {
  const [tokens, setTokens] = useState<any[]>([]);

  const fetchTokens = useCallback(async () => {
    const data = await getRecentInvestorTokens();
    setTokens(data || []);
  }, []);

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <Card style={{ padding: 20 }}>
      {tokens.map((t) => (
        <div key={t.id}>{t.investor_email}</div>
      ))}
    </Card>
  );
}

/* ================= MAIN ================= */

export default function AdminUpgrade() {
  const [, navigate] = useLocation();
  const { user, logout, loading } = useAuth();

  const [tab, setTab] = useState<"users" | "tokens">("users");

  /* 🔥 FIX 1: WAIT FOR AUTH TO LOAD */
  if (loading) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Loading...
      </div>
    );
  }

  /* 🔥 FIX 2: NOT LOGGED IN */
  if (!user) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        <h2>Sign in required</h2>
        <button onClick={() => navigate("/login")}>
          Sign in
        </button>
      </div>
    );
  }

  /* 🔥 FIX 3: FORCE ADMIN ONLY */
  if (user.role !== "admin") {
    return (
      <div style={{ color: "white", padding: 40 }}>
        <h2>Admin only</h2>
        <p>{user.email}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: D.text }}>
      
      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 20,
        borderBottom: `1px solid ${D.border}`,
      }}>
        <div>Admin Console</div>

        {/* 🔥 FIX 4: ALWAYS SHOW SIGN OUT */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: 20 }}>
        <button onClick={() => setTab("users")}>Users</button>
        <button onClick={() => setTab("tokens")}>Tokens</button>

        {tab === "users" && <UsersTab />}
        {tab === "tokens" && <TokensTab />}
      </div>
    </div>
  );
}