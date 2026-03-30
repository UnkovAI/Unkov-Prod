import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error(
    "[Unkov] CRITICAL: Supabase env vars not set.\n" +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your Vercel project settings.\n" +
    "Without these, ALL authentication and protected routes will fail."
  );
}

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  role: "pilot_customer" | "paying_customer" | "admin";
  avatar_initials: string | null;
  pilot_start_date: string | null;
  contract_date: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, "id" | "created_at">;
        Update: Partial<Omit<DbUser, "id" | "created_at">>;
      };
    };
  };
}

export const supabase = SUPABASE_URL && SUPABASE_ANON
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => fn(),
      },
    })
  : null;

export const isSupabaseConfigured = !!supabase;

export const createInvestorToken = async (name: string, email: string, hours: number = 24) => {
  if (!supabase) throw new Error("Supabase is not configured");

  const hoursInt  = Math.round(hours);
  const expiresAt = new Date(Date.now() + hoursInt * 60 * 60 * 1000).toISOString();

  const rawBytes  = crypto.getRandomValues(new Uint8Array(32));
  const rawToken  = Array.from(rawBytes).map(b => b.toString(16).padStart(2, "0")).join("");

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawToken));
  const tokenHash  = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

  const { error } = await supabase
    .from("investor_tokens")
    .insert({
      investor_name:  name.trim(),
      investor_email: email.trim().toLowerCase(),
      token_hash:     tokenHash,
      expires_at:     expiresAt,
    });

  if (error) {
    console.error("[Unkov] createInvestorToken:", error);
    throw new Error(error.message || "Failed to create token");
  }

  return rawToken;
};

export const revokeInvestorToken = async (email: string) => {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.rpc('revoke_investor_token', {
    p_email: email
  });
  if (error) throw error;
  return data;
};

export const validateInvestorToken = async (email: string, token: string) => {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.rpc('validate_investor_token', {
    p_email: email,
    p_token: token
  });
  if (error) throw error;
  return data as boolean;
};

// Fetches ALL investor tokens (active + expired) — no limit of 5, no view filter.
// Falls back to the active_investor_tokens view if the raw table isn't accessible.
export const getRecentInvestorTokens = async () => {
  if (!supabase) throw new Error("Supabase not configured");

  // Try the raw table first — shows all tokens including expired ones
  const { data, error } = await supabase
    .from('investor_tokens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // If raw table doesn't exist (42P01 = undefined_table), fall back to the view
  if (error?.code === '42P01') {
    const { data: viewData, error: viewError } = await supabase
      .from('active_investor_tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (viewError) throw viewError;
    return viewData;
  }

  if (error) throw error;
  return data;
};
