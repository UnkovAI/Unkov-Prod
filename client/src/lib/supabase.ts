import { createClient } from "@supabase/supabase-js";

// ─── Environment variables ────────────────────────────────────────
// Add these to your .env file (copy from .env.example):
//   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
//
// Get both values from: supabase.com → your project → Settings → API
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const SUPABASE_ANON = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error(
    "[Unkov] CRITICAL: Supabase env vars not set.\n" +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your Vercel project settings.\n" +
    "Without these, ALL authentication and protected routes will fail."
  );
}

// ─── Typed database schema ────────────────────────────────────────
// Mirrors the users table created by supabase/migrations/001_users.sql
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

// ─── Exported client ──────────────────────────────────────────────
// Safe to call even when env vars are missing — returns null client
// that triggers fallback to test accounts in AuthContext.
export const supabase = SUPABASE_URL && SUPABASE_ANON
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Bypass Web Lock API — prevents "lock stolen by another request" crash
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => fn(),
      },
    })
  : null;

export const isSupabaseConfigured = !!supabase;

// Function to generate a new token
export const createInvestorToken = async (name: string, email: string, hours: number = 24) => {
  if (!supabase) throw new Error("Supabase is not configured");
  
  const { data, error } = await supabase.rpc('create_investor_token', {
    p_name: name,
    p_email: email,
    p_hours_valid: hours
  });
  if (error) throw error;
  return data; 
};

// Function to revoke tokens
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
  return data as boolean; // returns true if valid, false if not
};

export const getRecentInvestorTokens = async () => {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from('active_investor_tokens') // Using the view we created in Migration 2
    .select('*')
    .limit(5);
  
  if (error) throw error;
  return data;
};
