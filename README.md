# Tanzania Business OS

A ledger-first business operating system for informal retailers in Tanzania.
**Credit & Debt Tracking** is fully functional on Supabase; Inventory, Payments &
Reconciliation, and Reports are navigable, polished screens on mock data — see
the case study at `/` for the full story.

## Stack

Next.js 16 (App Router, Turbopack) · Supabase (Postgres + Auth) · Tailwind CSS v4 · GSAP

## Getting started

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Supabase project's URL and anon key (Project
Settings → API in the Supabase dashboard). Then apply the schema:

```bash
# In the Supabase SQL editor, run:
supabase/migrations/0001_init.sql
```

That creates `shops`, `customers`, `credit_entries`, `payments`, the
`customer_balances` view, and row-level security policies scoped per shop —
plus a trigger that provisions a `shops` row the moment someone signs up.

```bash
npm run dev
```

- `/` — the landing / case study page (works with no Supabase config)
- `/login` — create a shop or sign in
- `/app/dashboard` — the app shell, once signed in

## Structure

- `app/app/credit/**` — the live Credit & Debt module
- `app/app/{inventory,payments,reports}` — stubbed modules on mock data (`lib/mock/`)
- `lib/actions/` — server actions (auth, credit ledger reads/writes)
- `lib/supabase/` — browser/server/proxy Supabase clients
- `components/landing/` — the GSAP-animated case study page
- `supabase/migrations/` — schema and RLS policies

## Scripts

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run lint    # eslint
```
