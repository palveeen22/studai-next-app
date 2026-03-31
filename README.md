# StudAI — AI-Powered Study Assistant

A full-stack web application that helps students manage tasks, generate AI summaries & quizzes, chat with an AI tutor, run daily quiz streak challenges, and track study progress.

## Features

- **Task & Subject Management** — Organize tasks by color-coded subjects with deadlines, completion tracking, and progress bars.
- **AI Summary** — Paste study material and get concise bullet-point summaries powered by Google Gemini.
- **AI Quiz** — Generate multiple-choice quizzes from any text with adjustable difficulty and question count.
- **AI Tutor Chat** — Streaming chat with an AI study buddy that explains concepts with analogies and examples.
- **Daily Quiz Challenges** — Duolingo-style learning paths with streak tracking, day nodes, and progressive difficulty.
- **Pomodoro Timer** — Focus sessions with animated SVG progress ring, break management, and session counting.
- **Dashboard** — Greeting, streak badge, task progress, AI usage counter, and quick action grid.
- **Free/Premium Tiers** — Free users get 3 summaries + 3 quizzes per day; premium gets unlimited access.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui (New York) |
| Animations | Framer Motion |
| State | Redux Toolkit (auth, subscription, daily-quiz) |
| Server State | TanStack Query v5 |
| Backend | Next.js Route Handlers + Supabase |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | Supabase Auth (email/password) via @supabase/ssr |
| AI | Google Gemini 2.5 Flash |
| Architecture | Feature-Sliced Design (FSD) |

## Architecture — Feature-Sliced Design

All source code lives under `src/` with strict import layers:

```
app → pages → widgets → features → entities → shared
```

- **shared/** — Utils, types, constants, Supabase clients, Redux store, TanStack Query provider, UI primitives
- **entities/** — Domain models (user, task, subject, quiz, summary) with pure presentational components
- **features/** — Business logic per feature: RTK slices, TanStack Query hooks, form components
- **widgets/** — Composite UI blocks: sidebar, topbar, dashboard cards, chat window
- **app/** — Next.js App Router pages and API route handlers

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase project (supabase.com)
- A Google AI API key (ai.google.dev)

### 1. Clone and install

```bash
git clone <repo-url>
cd studai
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Set up Supabase

1. Go to your Supabase dashboard → SQL Editor
2. Run the contents of `supabase/schema.sql`
3. Enable Email Auth in Authentication → Providers

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Testing

Tests use Jest and cover RTK slices, utility functions, entity helpers, constants, and API endpoint contracts.

```bash
npx jest
```

Test files:

1. `__tests__/shared/utils.test.ts` — formatDate, getInitials, isOverdue, getGreeting, getStreakEmoji
2. `__tests__/shared/constants.test.ts` — FREE_TIER_LIMITS, POMODORO, DAILY_QUIZ, COLORS validation
3. `__tests__/shared/endpoints.test.ts` — API endpoint path generation
4. `__tests__/features/auth-slice.test.ts` — auth reducer: setUser, clearUser, setError
5. `__tests__/features/subscription-slice.test.ts` — subscription reducer: usage increments
6. `__tests__/features/daily-quiz-slice.test.ts` — daily quiz: streak updates, caching, archiving
7. `__tests__/features/ai-gate.test.ts` — free tier gating logic
8. `__tests__/features/pomodoro.test.ts` — timer phase transitions and session cycling
9. `__tests__/entities/mapScore.test.ts` — quiz score rating and emoji mapping
10. `__tests__/entities/subject.test.ts` — subject progress calculation

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Register
│   ├── (app)/              # Dashboard, Tasks, AI Tools, Tutor, Quiz, Pomodoro, Profile
│   └── api/                # Route handlers (tasks, subjects, ai/*, dashboard, subscription, daily-quiz)
├── features/               # Feature slices
│   ├── auth/               # RTK slice + login/register forms
│   ├── tasks/              # TRQ hooks + TaskList, TaskForm, TaskItem
│   ├── subjects/           # TRQ hooks + SubjectGrid, SubjectCard
│   ├── ai-summary/         # TRQ mutation + SummaryInputPanel, SummaryResultCard
│   ├── ai-quiz/            # TRQ mutation + QuizInputPanel, QuizPlayView
│   ├── tutor/              # Streaming hook + ChatInput, MessageBubble
│   ├── daily-quiz/         # RTK slice + DuolingoPath, QuizTaskCard
│   ├── pomodoro/           # Timer hook + PomodoroTimer (SVG ring)
│   ├── subscription/       # RTK slice + useAIGate + PaywallModal
│   └── profile/            # TRQ hook + ProfileView
├── entities/               # Domain models
│   ├── user/               # UserAvatar, UserRow, getInitials
│   ├── task/               # TaskStatusBadge, TaskCheckbox (animated)
│   ├── subject/            # SubjectPill, getSubjectProgress
│   ├── summary/            # SummaryBullets
│   ├── quiz/               # QuizOption, QuizScoreCard, QuizProgress
│   └── daily-quiz/         # QuizDayNode, QuizStreakBadge, mapScore
├── widgets/                # Composite UI
│   ├── sidebar/            # Desktop sidebar navigation
│   ├── topbar/             # Mobile topbar + Sheet drawer
│   └── dashboard/          # StudyStreakCard, TaskProgressCard, AIUsageCard, QuickActionsGrid
└── shared/                 # Infrastructure
    ├── api/                # fetch client, endpoints, Gemini wrappers
    ├── supabase/           # browser client, server client, middleware
    ├── store/              # Redux configureStore + StoreProvider
    ├── query/              # QueryClientProvider
    ├── types/              # All TypeScript interfaces
    ├── constants/          # Colors, limits, pomodoro config, nav items
    ├── hooks/              # useDebounce, useMediaQuery
    ├── lib/                # cn(), formatDate(), getInitials(), isOverdue()
    └── ui/                 # Button, Card, Input, Badge, Dialog, Sheet, Tabs, EmptyState, ProgressBar
```

## License

MIT
# Studai-next-app
