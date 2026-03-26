import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// ─── This endpoint is protected by ADMIN_API_KEY ──────────────────
// Only the generate-token.ts CLI script calls this.
// The browser never touches this endpoint.
// Set ADMIN_API_KEY in Vercel env vars — any strong random string.

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Generate a cryptographically random token
// Format: UNK-T followed by 32 URL-safe chars
// The UNK-T prefix distinguishes it from shared codes (UNK-[A-Z0-9]{6})
function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(32);
  let token = "UNK-T";
  for (const byte of bytes) {
    token += chars[byte % chars.length];
    if (token.length === 5 + 32) break;
  }
  return token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verify admin API key — must match ADMIN_API_KEY env var exactly
  const apiKey = req.headers["x-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    console.error("[Unkov] ADMIN_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error" });
  }
  if (!apiKey || apiKey !== adminKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate request body
  const { investor_name, investor_email, firm, notes, expires_hours, max_uses } = req.body || {};

  if (!investor_name || !investor_email) {
    return res.status(400).json({ error: "investor_name and investor_email are required" });
  }
  if (!investor_email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // Generate and hash the token
  const plaintext  = generateToken();
  const bcryptHash = await bcrypt.hash(plaintext, 12); // cost 12 — slow enough to resist cracking

  // Expiry — default 72 hours, max 30 days
  const expiryHours = Math.min(Math.max(parseInt(expires_hours ?? "72"), 1), 720);
  const expiresAt   = new Date(Date.now() + expiryHours * 3600000).toISOString();

  // Max uses — default 10, min 1, max 100
  const tokenMaxUses = Math.min(Math.max(parseInt(max_uses ?? "10"), 1), 100);

  // Insert into DB — only the hash is stored, never the plaintext
  const { data, error } = await supabase
    .from("investor_tokens")
    .insert({
      investor_name,
      investor_email: investor_email.toLowerCase().trim(),
      firm:        firm        || null,
      notes:       notes       || null,
      token_hash:  bcryptHash,
      expires_at:  expiresAt,
      max_uses:    tokenMaxUses,
      created_by:  "mustafa@unkov.com",
    })
    .select("id, investor_name, investor_email, firm, expires_at, max_uses")
    .single();

  if (error) {
    console.error("[Unkov] Token insert error:", error.message);
    return res.status(500).json({ error: "Failed to create token" });
  }

  // Return the plaintext ONCE — it is never stored and cannot be recovered
  return res.status(201).json({
    token:          plaintext,         // show to user now — never again
    token_id:       data.id,
    investor_name:  data.investor_name,
    investor_email: data.investor_email,
    firm:           data.firm,
    expires_at:     data.expires_at,
    max_uses:       data.max_uses,
    warning:        "Save this token now. It cannot be retrieved after this response.",
  });
}
