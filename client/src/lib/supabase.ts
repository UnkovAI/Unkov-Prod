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
  console.warn(
    "[Unkov] Supabase env vars not set — auth will use test accounts.\n" +
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file."
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
        persistSession: true,         // stores session in localStorage
        autoRefreshToken: true,       // refreshes JWT automatically
        detectSessionInUrl: true,     // handles magic link / OAuth callbacks
      },
    })
  : null;

export const isSupabaseConfigured = !!supabase;
