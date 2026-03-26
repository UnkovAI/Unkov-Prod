# Unkov

**The identity gate between every human, AI agent, and everything they can touch.**

Pre-revenue, seed stage. Building the first inline authorization layer that governs both humans and AI agents before they act.

---

## Quick start

```bash
pnpm install
pnpm dev
```

Opens at `http://localhost:3000`. The dashboard runs entirely on built-in demo data — no credentials required.

## Environment variables

Only two variables are needed to run locally:

```bash
# Optional — only needed if you want real login
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional — only needed to connect to live scan data
VITE_API_URL=
VITE_DASHBOARD_API_KEY=
```

Copy `.env.example` to `.env` and fill in only what you need. Everything else works without it.

**Server-side secrets** (Supabase service role key, investor salt, admin API key) are set directly in Vercel Dashboard → Settings → Environment Variables. They never go in any file.

## Build and deploy

```bash
pnpm build        # outputs to dist/
```

Deploy by connecting this repo to Vercel. The `vercel.json` handles routing automatically. No configuration needed beyond the two optional env vars above.

## Project structure

```
unkov/
├── client/src/
│   ├── pages/       ← one file per route
│   ├── components/  ← shared UI
│   ├── hooks/       ← useDashboardData (live API), useAuth
│   └── contexts/    ← AuthContext
├── api/             ← Vercel serverless functions (investor gate)
├── supabase/        ← database migrations
└── vercel.json      ← routing + build config
```

## Dashboard data

The dashboard works in two modes:

| Mode | How | What you see |
|------|-----|-------------|
| Demo (default) | No setup needed | Built-in enterprise mock data — Meridian Health Systems, 1,247 identities |
| Live | Set `VITE_API_URL` to your engine API | Real scan data from your connectors |

To load the engine mock data into a local API:
```bash
cd unkov-engine
npm run mock:all     # generate scan data
npm run db:write     # write to DynamoDB
npm run api:dev      # start API on :4000
# Then set VITE_API_URL=http://localhost:4000 in .env
```

## Investor access

The `/for-investors` and `/roadmap` routes require an access code. Generate one:

```bash
pnpm investor:code       # 24h code
pnpm investor:code 72    # 72h code
```

Codes are generated client-side. No server required.

---

© 2026 Unkov. Confidential — not for distribution.
