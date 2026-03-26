import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured, type DbUser } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────
export type UserRole = "pilot_customer" | "paying_customer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  pilotStartDate?: string;
  contractDate?: string;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  upgradeToProduction: (userId: string) => Promise<void>;
  dashboardPath: string;
  usingTestAccounts: boolean; // so UI can show a "test mode" badge
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Test accounts (fallback when Supabase is not configured) ─────
// ONLY used in local development when VITE_SUPABASE_URL is not set.
// Credentials are loaded from environment variables — never hardcoded.
// Set in your local .env file:
//   VITE_DEV_PILOT_EMAIL=pilot@yourcompany.com
//   VITE_DEV_PILOT_PASS=your-local-dev-password
//   VITE_DEV_ADMIN_EMAIL=you@unkov.com
//   VITE_DEV_ADMIN_PASS=your-local-dev-password
const buildTestUsers = (): Record<string, { password: string; user: User }> => {
  const pilotEmail = import.meta.env.VITE_DEV_PILOT_EMAIL as string;
  const pilotPass  = import.meta.env.VITE_DEV_PILOT_PASS  as string;
  const adminEmail = import.meta.env.VITE_DEV_ADMIN_EMAIL as string;
  const adminPass  = import.meta.env.VITE_DEV_ADMIN_PASS  as string;

  if (!pilotEmail || !pilotPass || !adminEmail || !adminPass) return {};

  return {
    [pilotEmail]: {
      password: pilotPass,
      user: {
        id: "dev_pilot",
        email: pilotEmail,
        name: "Dev Pilot",
        company: "Dev Environment",
        role: "pilot_customer",
        pilotStartDate: new Date(Date.now() - 14 * 86400000).toISOString(),
        avatarInitials: "DP",
      },
    },
    [adminEmail]: {
      password: adminPass,
      user: {
        id: "dev_admin",
        email: adminEmail,
        name: "Dev Admin",
        company: "Unkov",
        role: "admin",
        avatarInitials: "DA",
      },
    },
  };
};
const TEST_USERS = buildTestUsers();

// ─── Helper: DbUser → User ────────────────────────────────────────
function dbToUser(db: DbUser): User {
  const initials = db.avatar_initials ||
    (db.name ? db.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "??");
  return {
    id: db.id,
    email: db.email,
    name: db.name || db.email,
    company: db.company || "",
    role: db.role,
    pilotStartDate: db.pilot_start_date || undefined,
    contractDate: db.contract_date || undefined,
    avatarInitials: initials,
  };
}

// ─── Provider ─────────────────────────────────────────────────────
const SESSION_KEY = "unkov_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Supabase session listener ──────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback: rehydrate from localStorage (test mode)
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
      setLoading(false);
      return;
    }

    // On mount: check existing Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load the user's profile row from the public.users table
  const loadUserProfile = async (authId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authId)
      .single();

    if (error) {
      console.error("[Unkov] Failed to load user profile:", error.message);
      return;
    }
    if (data) setUser(dbToUser(data));
  };

  // ── Login ──────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {

    // ── Supabase path ──────────────────────────────────────────
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Map Supabase error messages to friendly ones
        const msg =
          error.message.includes("Invalid login") ? "Incorrect email or password." :
          error.message.includes("Email not confirmed") ? "Please confirm your email first." :
          error.message;
        return { ok: false, error: msg };
      }
      // onAuthStateChange will call loadUserProfile automatically
      return { ok: true };
    }

    // ── Test account fallback ──────────────────────────────────
    await new Promise(r => setTimeout(r, 600));
    const record = TEST_USERS[email.toLowerCase().trim()];
    if (!record) return { ok: false, error: "No account found with that email." };
    if (record.password !== password) return { ok: false, error: "Incorrect password." };
    setUser(record.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(record.user));
    return { ok: true };
  };

  // ── Logout ─────────────────────────────────────────────────────
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // ── Upgrade pilot → production ─────────────────────────────────
  const upgradeToProduction = async (userId: string) => {
    const now = new Date().toISOString();

    // ── Supabase path ──────────────────────────────────────────
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("users")
        .update({ role: "paying_customer", contract_date: now })
        .eq("id", userId);

      if (error) {
        console.error("[Unkov] Upgrade failed:", error.message);
        return;
      }
      // If the admin is upgrading themselves (unlikely but possible), refresh
      if (user?.id === userId) await loadUserProfile(userId);
      return;
    }

    // ── Test account fallback ──────────────────────────────────
    if (user?.id === userId || user?.role === "admin") {
      const upgraded: User = {
        ...(user as User),
        role: "paying_customer",
        contractDate: now,
      };
      setUser(upgraded);
      localStorage.setItem(SESSION_KEY, JSON.stringify(upgraded));
    }
  };

  const dashboardPath =
    user?.role === "pilot_customer" ? "/demo/dashboard" : "/dashboard";

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout: () => { logout(); },
      upgradeToProduction, dashboardPath,
      usingTestAccounts: !isSupabaseConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
