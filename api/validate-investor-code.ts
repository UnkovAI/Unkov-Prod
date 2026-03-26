import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import * as bcrypt from "bcryptjs";

// ─── Supabase service-role client ─────────────────────────────────
// Uses the SERVICE_ROLE key (not the anon key) — full DB access.
// This key must NEVER be used in the browser or set with a VITE_ prefix.
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ─── Rate limiting (in-memory, per serverless instance) ───────────
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (entry.count >= MAX_ATTEMPTS) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

// ─── Per-investor token validation ───────────────────────────────
// Looks up the token in Supabase, checks the bcrypt hash,
// enforces expiry, revocation, and max-uses limits,
// then records the use.
async function validateInvestorToken(
  input: string,
  ip: string
): Promise<{ valid: boolean; reason?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { valid: false, reason: "db_unavailable" };

  const clean = input.toUpperCase().trim();

  // Per-investor tokens start with UNK-T (vs shared codes UNK-[A-Z0-9]{6})
  if (!clean.startsWith("UNK-T")) return { valid: false, reason: "not_a_token" };

  // Fetch all non-revoked, non-expired tokens — then bcrypt-compare
  // (We can't query by token directly because it's stored as a hash)
  const { data: tokens, error } = await supabase
    .from("investor_tokens")
    .select("id, token_hash, expires_at, revoked_at, used_count, max_uses")
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString());

  if (error) {
    console.error("[Unkov] Token lookup error:", error.message);
    return { valid: false, reason: "db_error" };
  }
  if (!tokens || tokens.length === 0) return { valid: false, reason: "no_match" };

  // bcrypt compare against each active token
  // In practice you'll have <100 investors so this is fast
  for (const token of tokens) {
    const match = await bcrypt.compare(clean, token.token_hash);
    if (!match) continue;

    // Check max uses
    if (token.used_count >= token.max_uses) {
      return { valid: false, reason: "max_uses_exceeded" };
    }

    // Valid — record the use
    await supabase
      .from("investor_tokens")
      .update({
        used_count:   token.used_count + 1,
        last_used_at: new Date().toISOString(),
        last_ip:      ip,
        // Set used_at on first use only
        ...(token.used_count === 0 ? { used_at: new Date().toISOString() } : {}),
      })
      .eq("id", token.id);

    return { valid: true };
  }

  return { valid: false, reason: "no_match" };
}

// ─── Shared time-windowed code (fallback) ─────────────────────────
// Still works when Supabase isn't configured or for bulk outreach.
function makeCode(windowIndex: number, salt: string): string {
  const raw = `${windowIndex}-${salt}-unkov`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  let h = Math.abs(hash);
  for (let i = 0; i < 6; i++) {
    code += chars[h % chars.length];
    h = Math.floor(h / chars.length) + (Math.abs(hash) >> i);
  }
  return `UNK-${code}`;
}

function validateSharedCode(input: string, salt: string): boolean {
  const clean = input.toUpperCase().trim();
  if (!/^UNK-[A-Z0-9]{6}$/.test(clean)) return false;
  // Reject tokens (handled above)
  if (clean.startsWith("UNK-T")) return false;
  const windows = [4, 24, 72];
  for (const hrs of windows) {
    const current = Math.floor(Date.now() / (hrs * 3600000));
    if (makeCode(current,     salt) === clean) return true;
    if (makeCode(current - 1, salt) === clean) return true;
  }
  return false;
}

// ─── CORS ─────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://unkov.com",
  "https://www.unkov.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ─── Handler ──────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);

  // Handle preflight
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress || "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  if (!allowed) {
    return res.status(429).json({ error: "Too many attempts. Please wait 15 minutes." });
  }

  const { code } = req.body || {};
  if (!code || typeof code !== "string" || code.trim().length < 8) {
    return res.status(400).json({ error: "Missing or invalid code" });
  }

  const input = code.trim();

  // ── Path 1: per-investor token (UNK-T...) ───────────────────────
  if (input.toUpperCase().startsWith("UNK-T")) {
    const result = await validateInvestorToken(input, ip);

    if (result.valid) return res.status(200).json({ valid: true, type: "token" });

    // Give a slightly more helpful message for max-uses (without revealing internals)
    if (result.reason === "max_uses_exceeded") {
      return res.status(200).json({
        valid: false,
        error: "This access code has reached its usage limit. Please request a new one via info@unkov.com.",
      });
    }

    return res.status(200).json({ valid: false });
  }

  // ── Path 2: shared time-windowed code (legacy / bulk outreach) ──
  const salt = process.env.INVESTOR_SALT;
  if (!salt) {
    console.error("[Unkov] INVESTOR_SALT not set — shared code validation unavailable.");
    // Don't expose config errors to the browser
    return res.status(200).json({ valid: false });
  }

  const valid = validateSharedCode(input, salt);
  return res.status(200).json({ valid, ...(valid ? { type: "shared" } : {}) });
}
