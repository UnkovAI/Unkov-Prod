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
  Home,
  Users,
  Key,
} from "lucide-react";

const D = {
  bg: "#0a0f1e",
  panel: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  text: "#e2e8f0",
};

/* ================= UI ================= */

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

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Card style={{ padding: 20 }}>
      {loading && "Loading users..."}
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
  const [loading, setLoading] = useState(true);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentInvestorTokens();
      setTokens(data || []);
    } catch {
      setTokens([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return (
    <Card style={{ padding: 20 }}>
      {loading && "Loading tokens..."}
      {!loading &&
        tokens.map((t) => (
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

  // 🔥 NEW: role from DB
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  /* ✅ FETCH ROLE FROM DB */
  useEffect(() => {
    const fetchRole = async () => {
      if (!user || !supabase) return;

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data) setRole(data.role);
      else setRole(null);

      setRoleLoading(false);
    };

    fetchRole();
  }, [user]);

  /* 🔥 AUTH LOADING */
  if (loading || roleLoading) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        Loading...
      </div>
    );
  }

  /* 🔥 NOT LOGGED IN */
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

  /* 🔥 ADMIN CHECK (FIXED) */
  if (role !== "admin") {
    return (
      <div style={{ color: "white", padding: 40 }}>
        <h2>Admin only</h2>
        <p>{user.email}</p>
        <p style={{ opacity: 0.6 }}>Role: {role || "unknown"}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: D.text }}>
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 20,
          borderBottom: `1px solid ${D.border}`,
        }}
      >
        <div>Admin Console</div>

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
        <button onClick={() => setTab("users")}>
          <Users size={14} /> Users
        </button>

        <button onClick={() => setTab("tokens")}>
          <Key size={14} /> Tokens
        </button>

        <div style={{ marginTop: 20 }}>
          {tab === "users" && <UsersTab />}
          {tab === "tokens" && <TokensTab />}
        </div>
      </div>
    </div>
  );
}