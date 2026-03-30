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

// ─── Helper: DB row → User ────────────────────────────────────────
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

// ─── Helper: Auth session → minimal User (fallback) ───────────────
// Used when public.users has no profile row for this auth user.
// This makes login work even before the DB trigger / manual insert is set up.
function sessionToUser(authUser: SupabaseAuthUser): User {
  const email = authUser.email ?? "";
  const name = (authUser.user_metadata?.name as string) || email.split("@")[0] || "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  return {
    id: authUser.id,
    email,
    name,
    company: (authUser.user_metadata?.company as string) || "",
    role: (authUser.user_metadata?.role as string) === "admin" ? "admin" :
           (authUser.user_metadata?.role as string) === "paying_customer" ? "paying_customer" :
           "pilot_customer", // safe default; upgrade via admin panel
    avatarInitials: initials,
  };
}

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.error("[Unkov] Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy.");
      setLoading(false);
      return;
    }

    // 8 s hard timeout so loading never hangs if Supabase is unreachable
    const _t = setTimeout(() => setLoading(false), 8000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(_t);
      if (session?.user) await resolveUser(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setUser(null);
          window.location.href = "/reset-password";
          return;
        }
        if (event === "SIGNED_IN" && session?.user) {
          await resolveUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Resolve user: profile row first, auth session as fallback ───
  // THE KEY FIX: if loadUserProfile fails (no public.users row), we still
  // set the user from the auth session so the redirect fires after login.
  const resolveUser = async (authUser: SupabaseAuthUser) => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (data && !error) {
      setUser(dbToUser(data));
    } else {
      // No profile row found — use auth session as fallback.
      // Log a warning so the issue is visible in the console.
      console.warn(
        "[Unkov] No row in public.users for auth user", authUser.id,
        "— using auth session fallback (role: pilot_customer).",
        "Fix: add a Supabase DB trigger on auth.users INSERT, or manually insert the row."
      );
      setUser(sessionToUser(authUser));
    }
  };

  // ── Login ──────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    if (!supabase) return { ok: false, error: "Authentication service not configured. Contact support." };

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg =
        error.message.includes("Invalid login")       ? "Incorrect email or password." :
        error.message.includes("Email not confirmed")  ? "Please confirm your email before signing in." :
        error.message.includes("too many requests")    ? "Too many attempts — please wait a moment." :
        error.message;
      return { ok: false, error: msg };
    }
    // onAuthStateChange SIGNED_IN fires → resolveUser → setUser → Login useEffect redirects
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
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) await resolveUser(authUser);
    }
  };

  const dashboardPath =
    user?.role === "admin"          ? "/admin/upgrade"   :
    user?.role === "pilot_customer" ? "/demo/dashboard"  :
    "/dashboard";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, upgradeToProduction, dashboardPath, usingTestAccounts: false }}>
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
