#!/usr/bin/env node
/**
 * Unkov — Per-Investor Token Generator
 * ─────────────────────────────────────────────────────────────────
 * Creates a unique, single-use-limited token for a specific investor.
 * Unlike the shared time-windowed codes, each token:
 *   - Is tied to one investor by name and email
 *   - Can be individually revoked without affecting others
 *   - Tracks how many times it's been used (and from which IPs)
 *   - Cannot be forwarded without detection (max_uses limit)
 *   - Has its own expiry date
 *
 * Requires:
 *   - ADMIN_API_KEY set in .env (and in Vercel env vars)
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in .env
 *   - Your site deployed to Vercel (the API must be live)
 *     OR use --local flag to call localhost:3000
 *
 * Usage:
 *   npx tsx scripts/generate-token.ts \
 *     --name "Sarah Johnson" \
 *     --email "sarah@sequoia.com" \
 *     --firm "Sequoia Capital" \
 *     --hours 72 \
 *     --uses 5 \
 *     --notes "Met at YC W26 demo day"
 *
 *   npx tsx scripts/generate-token.ts --list    (show all active tokens)
 *   npx tsx scripts/generate-token.ts --revoke sarah@sequoia.com
 *
 * Options:
 *   --name    Investor full name (required)
 *   --email   Investor email (required)
 *   --firm    VC firm name (optional)
 *   --hours   Expiry in hours (default: 72, max: 720)
 *   --uses    Max uses before token is exhausted (default: 10, min: 1)
 *   --notes   Internal notes about this investor (optional)
 *   --local   Call localhost instead of production
 *   --list    Show all currently active tokens
 *   --revoke  Revoke all tokens for an email address
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// ─── Load .env ────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, "..", ".env");

function loadEnv(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  return readFileSync(path, "utf-8")
    .split("\n")
    .filter(line => line.includes("=") && !line.startsWith("#"))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split("=");
      acc[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
      return acc;
    }, {} as Record<string, string>);
}

const env      = loadEnv(envPath);
const API_KEY  = env["ADMIN_API_KEY"];
const SB_URL   = env["SUPABASE_URL"];
const SB_KEY   = env["SUPABASE_SERVICE_ROLE_KEY"];

// ─── Terminal colours ─────────────────────────────────────────────
const R = "\x1b[0m"; const B = "\x1b[1m"; const D = "\x1b[90m";
const G = "\x1b[32m"; const Y = "\x1b[33m"; const RD = "\x1b[31m";
const C = "\x1b[36m"; const BL = "\x1b[34m";

// ─── Guard ────────────────────────────────────────────────────────
if (!API_KEY) {
  console.error(`
${RD}✗ ADMIN_API_KEY is not set in your .env file.${R}

Add this to .env:
  ADMIN_API_KEY=your-strong-random-key

And set the same value in Vercel Dashboard:
  Settings → Environment Variables → ADMIN_API_KEY

Generate a strong key with:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
`);
  process.exit(1);
}

// ─── Parse args ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const get  = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
};
const has  = (flag: string) => args.includes(flag);

const useLocal = has("--local");
const baseUrl  = useLocal
  ? "http://localhost:3000"
  : "https://unkov.com";

// ─── Supabase client (for --list and --revoke) ────────────────────
function getSupabase() {
  if (!SB_URL || !SB_KEY) {
    console.error(`${RD}✗ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env${R}`);
    process.exit(1);
  }
  return createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
}

// ─── --list ───────────────────────────────────────────────────────
if (has("--list")) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("active_investor_tokens")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(`${RD}✗ ${error.message}${R}`); process.exit(1); }
  if (!data || data.length === 0) {
    console.log(`\n${D}No active investor tokens found.${R}\n`);
    process.exit(0);
  }

  console.log(`\n${B}Unkov — Investor Token Registry${R}\n`);
  for (const t of data) {
    const statusColor = t.status === "active" ? G : t.status === "expired" ? D : RD;
    console.log(`${B}${t.investor_name}${R}  ${D}<${t.investor_email}>${R}${t.firm ? `  ${C}${t.firm}${R}` : ""}`);
    console.log(`  Status : ${statusColor}${t.status}${R}`);
    console.log(`  Expires: ${D}${new Date(t.expires_at).toLocaleString()}${R}`);
    console.log(`  Uses   : ${Y}${t.used_count}/${t.max_uses}${R}`);
    if (t.last_used_at) console.log(`  Last used: ${D}${new Date(t.last_used_at).toLocaleString()} from ${t.last_ip}${R}`);
    if (t.notes) console.log(`  Notes  : ${D}${t.notes}${R}`);
    console.log();
  }
  process.exit(0);
}

// ─── --revoke ─────────────────────────────────────────────────────
if (has("--revoke")) {
  const email = get("--revoke");
  if (!email) { console.error(`${RD}✗ Provide an email: --revoke investor@vc.com${R}`); process.exit(1); }

  const sb = getSupabase();
  const { data, error } = await sb.rpc("revoke_investor_token", { p_email: email });

  if (error) { console.error(`${RD}✗ ${error.message}${R}`); process.exit(1); }
  console.log(`\n${G}✓ Revoked ${data} token(s) for ${email}${R}\n`);
  process.exit(0);
}

// ─── Generate token ───────────────────────────────────────────────
const name  = get("--name");
const email = get("--email");
const firm  = get("--firm");
const notes = get("--notes");
const hours = parseInt(get("--hours") ?? "72");
const uses  = parseInt(get("--uses")  ?? "10");

if (!name || !email) {
  console.error(`
${RD}✗ --name and --email are required.${R}

Example:
  npx tsx scripts/generate-token.ts \\
    --name "Sarah Johnson" \\
    --email "sarah@sequoia.com" \\
    --firm "Sequoia Capital" \\
    --hours 72 \\
    --uses 5
`);
  process.exit(1);
}

console.log(`\n${D}Generating token for ${name} <${email}>...${R}`);

const res = await fetch(`${baseUrl}/api/create-investor-token`, {
  method:  "POST",
  headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
  body:    JSON.stringify({ investor_name: name, investor_email: email, firm, notes, expires_hours: hours, max_uses: uses }),
});

if (!res.ok) {
  const err = await res.json().catch(() => ({ error: res.statusText }));
  console.error(`${RD}✗ API error ${res.status}: ${err.error || res.statusText}${R}`);
  if (res.status === 401) console.error(`${D}Check ADMIN_API_KEY matches in .env and Vercel env vars.${R}`);
  if (res.status === 500) console.error(`${D}Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel env vars.${R}`);
  process.exit(1);
}

const data = await res.json();
const expiresAt = new Date(data.expires_at);
const hoursLeft = Math.round((expiresAt.getTime() - Date.now()) / 3600000);

// ─── Output ───────────────────────────────────────────────────────
console.log(`
${B}Unkov — Investor Access Token${R}
${"─".repeat(52)}
${B}${G}  ${data.token}${R}

${D}  Investor : ${R}${data.investor_name} <${data.investor_email}>${data.firm ? `  (${data.firm})` : ""}
${D}  Token ID : ${R}${D}${data.token_id}${R}
${D}  Expires  : ${R}${expiresAt.toLocaleString()} ${Y}(${hoursLeft}h from now)${R}
${D}  Max uses : ${R}${data.max_uses} ${D}(revoke forwarded codes instantly)${R}
${"─".repeat(52)}

${B}${BL}Email draft (copy & paste):${R}

${D}Subject: Unkov Investor Access — Confidential

Hi ${data.investor_name.split(" ")[0]},

Please use the code below to access Unkov's confidential investor
materials, including financial projections, funding terms, and the
data room.

  Access Code: ${data.token}

Visit: https://unkov.com/investor-gate
This code expires: ${expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

This information is confidential and intended solely for you.
Please do not forward or distribute.

Best,
Mustafa
Unkov · info@unkov.com${R}

${"─".repeat(52)}
${D}Token stored securely. This plaintext will not be shown again.${R}
${D}To revoke: npx tsx scripts/generate-token.ts --revoke ${email}${R}
${D}To list all: npx tsx scripts/generate-token.ts --list${R}
`);
