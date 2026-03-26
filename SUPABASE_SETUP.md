# Supabase Auth Setup Guide

Connect Unkov to a real database in ~15 minutes.
After this, real customers log in with their own credentials.

---

## Step 1 — Create a Supabase project (2 min)

1. Go to supabase.com and sign in
2. Click **New project**, name it `unkov-production`
3. Choose a strong database password — save it somewhere safe
4. Select region closest to your customers (US East for BFSI/Healthcare)
5. Click **Create new project** — takes ~1 minute to provision

---

## Step 2 — Get your API keys (1 min)

In your Supabase project → **Settings → API**:

- Copy the **Project URL** → `VITE_SUPABASE_URL`
- Copy the **Publishable (anon/public) key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

> **Never use the service_role key in the browser or .env file.**
> The service_role key has full DB admin access — it goes in Vercel
> dashboard only (used by server-side API routes, not the React app).

---

## Step 3 — Add keys to your .env file (1 min)

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4 — Run ALL THREE migrations in order (5 min)

In Supabase → **SQL Editor → New query**, run each file in sequence.
**Do not skip any — they depend on each other.**

### Migration 1: `supabase/migrations/001_users.sql`

Creates the `public.users` table, row-level security, auto-profile trigger,
and the `upgrade_to_production()` helper function.

Paste the full file contents → click **Run**.

---

### Migration 2: `supabase/migrations/002_investor_tokens.sql`

Creates the `public.investor_tokens` table for investor portal access control.
Required even if you're not using the investor portal yet — other pages may
reference this table.

Paste the full file contents → click **Run**.

---

### Migration 3: `supabase/migrations/002_client_signup.sql`

Creates the `public.profiles` table and a signup trigger.

> ⚠️ **Important:** This migration creates `public.profiles`, but the app's
> `AuthContext` queries `public.users` (created in migration 1). After running
> this migration, create a compatibility view so both names work:
>
> ```sql
> -- Run this immediately after 002_client_signup.sql:
> CREATE OR REPLACE VIEW public.profiles_view AS SELECT * FROM public.users;
> ```
>
> The `public.users` table from migration 1 is the canonical table.
> The `profiles` table from migration 3 is a duplicate — the view above
> prevents any future code that references `profiles` from breaking.

---

## Step 5 — Create your first users (3 min)

In Supabase → **Authentication → Users → Add user → Create new user**

Create these (use your real pilot client details for the pilot user):

| Email | Password | Role |
|---|---|---|
| `pilot@clientcompany.com` | strong temp password | pilot_customer |
| `you@unkov.com` | strong password | admin |

After creating each user, copy their **UUID** from the Users table.

Then in **SQL Editor**, run:

```sql
INSERT INTO public.users (id, email, name, company, role, avatar_initials)
VALUES
  ('<pilot-uuid>', 'pilot@clientcompany.com', 'Client Name', 'Client Company Name', 'pilot_customer', 'CN'),
  ('<admin-uuid>', 'you@unkov.com',            'Your Name',   'Unkov',               'admin',          'YN')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name;
```

---

## Step 6 — ⚠️ Critical: align company name with UNKOV_CUSTOMER_ID

The dashboard hook derives the DynamoDB partition key from the user's
`company` field in Supabase:

```ts
user.company.toLowerCase().replace(/\s+/g, '-')
```

**This must exactly match your `UNKOV_CUSTOMER_ID` in the engine.**

| Supabase `company` | Resulting DynamoDB key | UNKOV_CUSTOMER_ID must be |
|---|---|---|
| `Meridian Health Systems` | `meridian-health-systems` | `meridian-health-systems` |
| `Acme Financial Corp` | `acme-financial-corp` | `acme-financial-corp` |
| `dev-local` | `dev-local` | `dev-local` |

If these don't match, the dashboard will load but show no data — it
queries DynamoDB with the wrong partition key.

---

## Step 7 — Install and run (2 min)

```bash
npm install
npm run dev   # site at localhost:5173
```

Go to `/login` — the "Test accounts" panel should be gone, replaced by
a real login form. Sign in with your pilot user credentials.

---

## Step 8 — Add to Vercel environment variables

In your Vercel project → **Settings → Environment Variables**, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_API_URL=<your api gateway url from aws-setup-output.json>
VITE_DASHBOARD_API_KEY=<your DASHBOARD_API_KEY from bootstrap>
```

> The service_role key (if needed for server-side Vercel API routes) goes
> here too as `SUPABASE_SERVICE_ROLE_KEY` — never in the .env file.

---

## Step 9 — Add a real pilot client

When you sign a real customer:

1. Supabase → **Authentication → Users → Add user**
2. Enter their email, set a temporary password
3. Copy their UUID
4. SQL Editor → run:

```sql
INSERT INTO public.users (id, email, name, company, role, avatar_initials)
VALUES (
  '<their-uuid>',
  'their@email.com',
  'Their Name',
  'Their Company Name',   -- ← must slugify to match UNKOV_CUSTOMER_ID
  'pilot_customer',
  'TN'
);
```

5. Send them `unkov.com/login` and their temporary password
6. They log in → land on `/demo/dashboard` automatically

---

## Step 10 — Upgrade a client to production

**Via the admin console:**
1. Log in as your admin user
2. Go to `/admin/upgrade`
3. Click "Upgrade to production" on the client row

**Via SQL directly:**
```sql
SELECT upgrade_to_production('<client-uuid>');
```

Their next login goes to `/dashboard` — all tabs unlocked.

---

## Troubleshooting

**Dashboard loads but shows no data (green Live badge missing)**
→ Company name in Supabase doesn't match UNKOV_CUSTOMER_ID — see Step 6.

**"No account found" after migration**
→ Run the INSERT seed SQL with the correct UUIDs from auth.users.

**Login succeeds but user lands on wrong dashboard**
→ Check the `role` column:
```sql
SELECT email, role, company FROM public.users;
```

**"Failed to load user profile" in browser console**
→ The trigger didn't fire. Run the INSERT manually (Step 5).

**Row level security blocking the admin console**
→ Confirm the admin user's role is exactly `admin` (lowercase).
