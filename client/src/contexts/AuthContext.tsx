import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured, type DbUser } from "@/lib/supabase";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";

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
  usingTestAccounts: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helper: DbUser row → User ────────────────────────────────────
function dbToUser(db: DbUser): User {
  const initials =
    db.avatar_initials ||
    (db.name
      ? db.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "??");
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

// ─── Helper: Supabase auth session → minimal User fallback ────────
// Used when public.users profile row doesn't exist yet (e.g. no DB trigger set up).
// The user is authenticated in Supabase Auth but has no profile row — we give them
// pilot_customer access so they can reach the dashboard without a silent redirect loop.
function authSessionToUser(authUser: SupabaseAuthUser): User {
  const email = authUser.email || "";
  const name = authUser.user_metadata?.name || email.split("@")[0] || "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  return {
    id: authUser.id,
    email,
    name,
    company: authUser.user_metadata?.company || "",
    role: "pilot_customer",   // safe default — they can be upgraded via admin
    avatarInitials: initials,
  };
}

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.error("[Unkov] Supabase not configured");
      setLoading(false);
      return;
    }

    // Load existing session on mount — 8s hard timeout so loading never hangs
    const sessionTimeout = setTimeout(() => setLoading(false), 8000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(sessionTimeout);
      if (session?.user) {
        await resolveUser(session.user);
      }
      setLoading(false);
    });

    // React to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await resolveUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Resolve user: try profile row, fall back to auth session ────
  // This is the key fix: if public.users has no row for this auth user
  // (e.g. the DB trigger isn't set up), we still log them in with a
  // minimal profile instead of silently failing and leaving them stuck.
  const resolveUser = async (authUser: SupabaseAuthUser) => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (data && !error) {
      // Profile row found — use it (has role, company, etc.)
      setUser(dbToUser(data));
    } else {
      // No profile row — log a warning and use auth session as fallback
      // so the user isn't stuck on the login page after a successful sign-in.
      console.warn(
        "[Unkov] No profile row found in public.users for", authUser.id,
        "— using auth session fallback. Set up the DB trigger or insert a row manually."
      );
      setUser(authSessionToUser(authUser));
    }
  };

  // ── Login ──────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    if (!supabase) {
      return { ok: false, error: "Authentication service is not configured. Contact support." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Map Supabase errors to human-readable messages
      const msg =
        error.message.includes("Invalid login")      ? "Incorrect email or password." :
        error.message.includes("Email not confirmed") ? "Please confirm your email before signing in." :
        error.message.includes("too many requests")   ? "Too many attempts. Please wait a moment and try again." :
        error.message;
      return { ok: false, error: msg };
    }

    // onAuthStateChange SIGNED_IN will fire and call resolveUser automatically
    return { ok: true };
  };

  // ── Logout ─────────────────────────────────────────────────────
  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  // ── Upgrade pilot → production ─────────────────────────────────
  const upgradeToProduction = async (userId: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("users")
      .update({ role: "paying_customer", contract_date: new Date().toISOString() })
      .eq("id", userId);
    if (!error && user?.id === userId) {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (authUser) await resolveUser(authUser);
    }
  };

  const dashboardPath =
    user?.role === "pilot_customer" ? "/demo/dashboard" : "/dashboard";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, upgradeToProduction, dashboardPath, usingTestAccounts: false }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
