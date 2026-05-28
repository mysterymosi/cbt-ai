# CBT AI

AI-powered UTME/JAMB practice for Nigerian students. Answer real past questions, get instant feedback, ask an AI tutor why an answer is correct, and track progress across subjects.

**Beta scope:** UTME only — English, Mathematics, Biology, Chemistry, Physics, Government, and Economics. Practice mode (timed exams deferred).

## Features

- **Practice sessions** — Choose subject, optional year filter, and question count; graded attempts with explanations
- **AI tutor** — Streaming chat tied to the current question and attempt (daily message limit configurable)
- **Dashboard** — Streak, accuracy, missed-question review, and follow-up recommendations
- **Session summary** — Score, weak concepts (AI-generated tags), and suggested next practice
- **Question reports** — Students flag issues; admins review and optionally forward to [ALOC](https://questions.aloc.com.ng)
- **Admin** — Report queue, local question overrides, and 7-day AI usage summary (`/admin`, admin role required)

## Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, RSC-first) |
| UI | [shadcn/ui](https://ui.shadcn.com), Tailwind CSS 4 |
| Auth & DB | [Supabase](https://supabase.com) (Postgres + RLS) |
| Questions | [ALOC Questions API](https://questions.aloc.com.ng) |
| AI | Google Gemini via [Vercel AI SDK](https://sdk.vercel.ai) |
| Analytics | [Vercel Web Analytics](https://vercel.com/docs/analytics) |

## Prerequisites

- Node.js 20+
- A Supabase project (URL, anon key, service role key)
- ALOC API access token
- Google Generative AI API key (for tutor + concept tagging)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key (question sync, admin ops) |
| `ALOC_ACCESS_TOKEN` | Yes | ALOC API bearer token |
| `ALOC_SYNC_SECRET` | No | Protects `POST /api/questions/sync` when set |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes* | Powers AI tutor and session concept tags |
| `TUTOR_DAILY_MESSAGE_LIMIT` | No | Default `30` |

\*Required for tutor and concept-tag features; the app may fail at runtime without it when those paths are hit.

### 3. Apply database migrations

Run the SQL files in `supabase/migrations/` against your Supabase project (SQL editor or Supabase CLI), in order:

1. `20260522000000_m1_foundation.sql`
2. `20260524000000_m5_quality.sql`
3. `20260524100000_report_option_issue_types.sql`

### 4. Seed questions from ALOC

```bash
npm run aloc:prefetch
```

This syncs UTME questions for all seven beta subjects into Supabase.

Alternatively, trigger a sync via HTTP:

```bash
curl -X POST http://localhost:3000/api/questions/sync \
  -H "Content-Type: application/json" \
  -H "x-sync-secret: YOUR_ALOC_SYNC_SECRET" \
  -d '{}'
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run aloc:prefetch` | Sync UTME questions from ALOC into Supabase |

## Project structure

```
src/
├── app/                    # Routes (App Router)
│   ├── (auth)/             # Login, signup, password reset, OAuth callback
│   ├── (app)/              # Authenticated app (dashboard, practice, admin, …)
│   └── api/                # Route handlers (tutor, reports, question sync)
├── components/             # Feature modules (UI + server actions + lib)
│   ├── practice/           # Sessions, attempts, feedback, summary
│   ├── tutor/              # Streaming tutor panel
│   ├── progress/           # Dashboard metrics & recommendations
│   ├── questions/          # ALOC client, sync, pool management
│   ├── reports/            # Student report dialog & ALOC forward
│   └── admin/              # Report queue, overrides, usage
├── lib/                    # Shared utilities, env, analytics, constants
└── proxy.ts                # Auth gate for app routes
supabase/migrations/        # Postgres schema + RLS
scripts/prefetch-aloc.ts    # CLI question sync
```

Architecture: Next.js monolith, React Server Components by default, small client islands for interactive UI (tutor chat, forms, analytics).

## Admin access

Set a user's `profiles.role` to `admin` in Supabase. Admins see an **Admin** link in the header and can manage reports and question overrides at `/admin`.

## Analytics events

Server- or client-tracked via Vercel Analytics:

| Event | When |
| --- | --- |
| `signup_complete` | First successful onboarding (server) |
| `first_question_answered` | User's first graded attempt (client) |
| `tutor_opened` | Tutor panel opened (client) |
| `session_complete` | Practice session marked complete in DB (server) |

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended). Set all environment variables in the project settings. Enable **Web Analytics** in the Vercel dashboard.

After deploy:

1. Apply migrations to production Supabase
2. Run question sync (`aloc:prefetch` locally against prod env, or `POST /api/questions/sync` with `ALOC_SYNC_SECRET`)

## Related docs

- [`exam_ai_tutor_prd_markdown.md`](./exam_ai_tutor_prd_markdown.md) — Product requirements
- [`exam_ai_tutor_mvp_985430ab.plan.md`](./exam_ai_tutor_mvp_985430ab.plan.md) — MVP implementation plan

## License

Private — not for public distribution.
