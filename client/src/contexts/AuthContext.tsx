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
  usingTestAccounts: boolean; // always false — Supabase is always used
}

const AuthContext = createContext<AuthContextType | null>(null);

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
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.error("[Unkov] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
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

    // Listen for auth state changes
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

  // ── Login — Supabase only ──────────────────────────────────────
  const login = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: "Authentication service is not configured." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg =
        error.message.includes("Invalid login")      ? "Incorrect email or password." :
        error.message.includes("Email not confirmed") ? "Please confirm your email first." :
        error.message;
      return { ok: false, error: msg };
    }
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
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("users")
      .update({ role: "paying_customer", contract_date: now })
      .eq("id", userId);

    if (error) {
      console.error("[Unkov] Upgrade failed:", error.message);
      return;
    }
    if (user?.id === userId) await loadUserProfile(userId);
  };

  const dashboardPath =
    user?.role === "pilot_customer" ? "/demo/dashboard" : "/dashboard";

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout: () => { logout(); },
      upgradeToProduction, dashboardPath,
      usingTestAccounts: false,
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
