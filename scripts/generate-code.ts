#!/usr/bin/env node
/**
 * Unkov — Investor Access Code Generator
 * ─────────────────────────────────────────────────────────────────
 * Reads INVESTOR_SALT from your .env file and generates
 * time-windowed access codes to send to investors.
 *
 * The salt NEVER appears in the browser bundle — only here,
 * on your machine, when you run this script.
 *
 * Setup:
 *   1. Add INVESTOR_SALT=your-secret-phrase to your .env file
 *      (no VITE_ prefix — this must stay server-side only)
 *   2. Add the same INVESTOR_SALT to Vercel Dashboard:
 *      Settings → Environment Variables → Add → Name: INVESTOR_SALT
 *   3. Run this script to get a code
 *   4. Email the code to the investor
 *
 * Usage:
 *   npx tsx scripts/generate-code.ts              → 24h code (default)
 *   npx tsx scripts/generate-code.ts 4            → 4h code
 *   npx tsx scripts/generate-code.ts 72           → 72h code
 *   npx tsx scripts/generate-code.ts --list       → all active codes
 *
 * Valid expiry options: 4, 24, 72 (hours)
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Load .env ────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");
const envExamplePath = resolve(__dirname, "..", ".env.example");

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

const env = loadEnv(envPath);
const SALT = env["INVESTOR_SALT"];

// ─── Guard: refuse to run without a real salt ─────────────────────
if (!SALT) {
  console.error(`
\x1b[31m✗ INVESTOR_SALT is not set in your .env file.\x1b[0m

To fix this:
  1. Open (or create) your .env file in the project root
  2. Add this line with your own secret phrase:

     INVESTOR_SALT=your-secret-phrase-here

  3. Run this script again

\x1b[90mTip: choose something memorable but not guessable.
     e.g. INVESTOR_SALT=unkov-seed-2026-mustafa\x1b[0m
`);
  process.exit(1);
}

// ─── Core hash function — must match InvestorGate.tsx exactly ─────
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

function generateCode(expiryHours: number): string {
  const windowIndex = Math.floor(Date.now() / (expiryHours * 3600000));
  return makeCode(windowIndex, SALT);
}

function expiresAt(expiryHours: number): Date {
  const windowStart = Math.floor(Date.now() / (expiryHours * 3600000)) * expiryHours * 3600000;
  return new Date(windowStart + expiryHours * 3600000);
}

function timeLeft(expiryHours: number): string {
  const diff = expiresAt(expiryHours).getTime() - Date.now();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function emailDraft(code: string, expiry: string): string {
  return `Subject: Unkov Investor Access — Confidential

Hi,

Please use the code below to access Unkov's confidential investor materials
including financial projections, funding terms, and the data room.

  Access Code: ${code}

This code expires in approximately ${expiry}.
Visit: https://unkov.com/investor-gate

This information is confidential and intended solely for the recipient.
Please do not forward or distribute.

Best,
The Unkov Team`.trim();
}

// ─── CLI ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const VALID_HOURS = [4, 24, 72];
const R = "\x1b[0m"; const B = "\x1b[1m";
const G = "\x1b[32m"; const C = "\x1b[36m";
const Y = "\x1b[33m"; const D = "\x1b[90m";
const BL = "\x1b[34m";

// ── --list: all active codes ──────────────────────────────────────
if (args.includes("--list")) {
  console.log(`\n${B}Unkov — All Active Investor Codes${R}`);
  console.log(`${D}Salt: ${SALT.slice(0, 4)}${"*".repeat(SALT.length - 4)} (masked)${R}\n`);
  for (const hrs of VALID_HOURS) {
    const code = generateCode(hrs);
    const left = timeLeft(hrs);
    const exp  = expiresAt(hrs);
    console.log(`${B}${G}${code}${R}  ${C}${hrs}h window${R}`);
    console.log(`${D}  Expires: ${exp.toLocaleString()} (${left} remaining)${R}\n`);
  }
  process.exit(0);
}

// ── Single code ───────────────────────────────────────────────────
const hrsArg = parseInt(args[0] ?? "24");
if (!VALID_HOURS.includes(hrsArg)) {
  console.error(`\x1b[31mError: expiry must be 4, 24, or 72 hours. Got: ${hrsArg}${R}`);
  process.exit(1);
}

const code  = generateCode(hrsArg);
const left  = timeLeft(hrsArg);
const exp   = expiresAt(hrsArg);
const draft = emailDraft(code, left);

console.log(`
${B}Unkov — Investor Access Code${R}
${"─".repeat(44)}
${B}${G}  ${code}${R}

${D}  Expiry   :${R} ${hrsArg} hours
${D}  Expires  :${R} ${exp.toLocaleString()}
${D}  Time left:${R} ${Y}${left}${R}
${D}  Salt     :${R} ${SALT.slice(0, 4)}${"*".repeat(SALT.length - 4)} (masked for security)
${"─".repeat(44)}

${B}${BL}Email draft (copy & paste):${R}

${D}${draft}${R}

${"─".repeat(44)}
${D}Tip: run with --list to see all active code windows${R}
`);
