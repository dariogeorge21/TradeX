Here is a tailored `CLAUDE.md` configured for **AI Market Insight (TradeX)**. It establishes clear architecture patterns, development rules, project setup steps, and environment guidelines designed to keep AI coding assistants aligned with your tech stack.

---

### `CLAUDE.md`

```markdown
# CLAUDE.md — AI Market Insight (TradeX)

This file provides architectural conventions, code guidelines, and development commands for LLMs working on the **TradeX / AI Market Insight** codebase.

---

## 🚀 Project Overview

**TradeX** is an AI-powered stock analysis and market intelligence platform built to simplify market research. It avoids overwhelming users with dense charts by utilizing AI to present natural-language stock insights, market sentiment, risk assessments, and interactive Q&A.

* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons
* **Backend & API**: Next.js Server Actions / API Routes, Supabase Client (`@supabase/ssr`)
* **Database & Auth**: Supabase PostgreSQL, Supabase Auth (Google OAuth)
* **AI Provider**: OpenAI API / Google Gemini API / GROQ API (Streaming enabled)

---

## 🛠️ Commands & Workflow

```bash
# Package Installation
npm install

# Development
npm run dev           # Starts local dev server at http://localhost:3000

# Building & Linting
npm run build         # Production build
npm run lint          # Run ESLint check
npm run type-check    # Run TypeScript validation (tsc --noEmit)

# Supabase Local (Optional / CLI workflow)
npx supabase start
npx supabase gen types typescript --local > types/supabase.ts

```

---

## 📐 Project Architecture & Structure

```text
├── app/
│   ├── (auth)/             # Auth routes (login, callback)
│   ├── (dashboard)/        # Authenticated application layout & pages
│   │   ├── dashboard/      # Main market summary, top gainers, market sentiment
│   │   ├── stock/[symbol]/ # Stock analysis & AI risk assessment page
│   │   ├── chat/           # Interactive AI Market Chat interface
│   │   ├── watchlist/      # Saved user stocks
│   │   └── trends/         # Sector performance & financial news breakdown
│   ├── api/                # API Routes (AI Streaming, Third-party financial webhooks)
│   ├── layout.tsx          # Root layout (Theme provider, Auth provider)
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Atomic shadcn/ui components (button, card, badge, etc.)
│   ├── dashboard/          # Top Gainers/Losers, Market Sentiment Card, AI Daily Summary
│   ├── stock/              # Stock info card, Risk Badge, AI Analysis block
│   ├── chat/               # Chat bubble, streaming message container, search input
│   └── common/             # Header, Navbar, Sidebar, User Avatar
├── lib/
│   ├── supabase/           # Supabase client configurations (server.ts, client.ts, middleware.ts)
│   ├── ai/                 # LLM prompts, provider configurations (Gemini/OpenAI/Groq wrappers)
│   ├── stock-api/          # Financial market data fetchers (Alpha Vantage, Yahoo Finance, or similar)
│   └── utils.ts            # Tailwind `cn()` helper and general utility functions
├── types/                  # Global TypeScript definitions (Stock, AI Analysis, Risk, Database)
└── middleware.ts           # Route protection & Supabase Session refresh

```

---

## 🎨 UI/UX Guidelines & Themes

* **Theme**: Modern, clean, and **Dark-mode dominant** (utilize `next-themes`).
* **Design Language**: Minimalist layout prioritizing high readability over dense technical charts.
* **Component Usage**: Always leverage `@/components/ui` (shadcn/ui) built on top of Radix UI.
* **Risk Levels Styling**:
* `Low Risk`: Soft Green/Emerald badge (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)
* `Medium Risk`: Amber/Yellow badge (`bg-amber-500/10 text-amber-400 border-amber-500/20`)
* `High Risk`: Rose/Red badge (`bg-rose-500/10 text-rose-400 border-rose-500/20`)


* **Interactivity**: Use Framer Motion for subtle transitions on stock cards and streaming AI text output.

---

## 🔒 Database & Authentication Architecture

### Supabase Integration

* Use `@supabase/ssr` for server components, Server Actions, and Route Handlers.
* **Database Schema Tables**:
* `profiles`: `id` (FK -> `auth.users`), `email`, `full_name`, `avatar_url`, `created_at`
* `watchlists`: `id`, `user_id` (FK -> `profiles.id`), `symbol`, `company_name`, `added_at`
* `chat_history`: `id`, `user_id` (FK -> `profiles.id`), `role`, `content`, `created_at`


* Row Level Security (**RLS**) must be enabled on all tables so users can only access their own watchlists and chat records.

---

## ⚡ Key Code & Writing Standards

1. **Strict TypeScript**:
* No `any`. Explicitly define response interfaces for financial API data and AI summary structures.
* Store generated Supabase types in `types/supabase.ts`.


2. **Next.js App Router Best Practices**:
* Default to **Server Components** (`RSC`) for rendering static data, stock headers, and initial database queries.
* Mark components as `'use client'` strictly when using dynamic state, client hooks, or interactivity.


3. **AI Generation & Streaming Rules**:
* Use AI SDK (`ai` package) or direct streaming outputs for the AI Assistant and detailed stock analyses.
* Provide fallback state or skeleton loaders (`shadcn/ui` Skeleton) while AI analysis or stock data is fetching.
* Ensure AI prompt templates enforce plain language explanations (e.g., *"Explain stock performance without jargon in under 3 bullet points"*).


4. **Imports Order**:
* 1. React / Next.js core modules


* 2. Third-party packages (Lucide icons, UI primitives, Framer Motion)


* 3. Internal components (`@/components/...`)


* 4. Utilities, types, API helpers (`@/lib/...`, `@/types/...`)





---

## 🔑 Environment Variables Setup (`.env.local`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# LLM Providers (Configure at least one)
GROQ_API_KEY=your_groq_api_key

```

```

```