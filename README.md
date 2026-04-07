# STAMPEDE — World Cup 2026 Fan Platform

> Don't just watch the World Cup. Play it.

## Stack

- **Framework:** Next.js 14 (App Router + Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS (STAMPEDE brand system)
- **Auth:** Clerk (OAuth + email, webhooks)
- **Database:** PostgreSQL + Prisma ORM
- **Cache/Realtime:** Upstash Redis
- **AI:** OpenAI GPT-4o-mini (Fan Coach IA, streaming)
- **Payments:** Stripe
- **State:** Zustand + TanStack Query

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/your-org/stampede-app
cd stampede-app
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in Clerk, database, Redis, OpenAI, Stripe keys

# 3. Set up database
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to your DB

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Sign-in / Sign-up pages
│   ├── (app)/          # Protected app shell (requires auth)
│   │   ├── dashboard/  # Home dashboard
│   │   ├── album/      # Digital sticker album
│   │   ├── packs/      # Pack store + opening
│   │   ├── events/     # Fan Events Hub
│   │   ├── marketplace/# P2P + Drops
│   │   ├── coach/      # AI Fan Coach chat
│   │   └── ranking/    # Global leaderboard
│   ├── api/            # Route handlers
│   │   ├── webhooks/   # Clerk webhook
│   │   ├── users/      # User profile
│   │   ├── album/      # Album data
│   │   ├── packs/      # Pack opening logic
│   │   ├── marketplace/# Listings CRUD
│   │   ├── coach/      # AI streaming chat
│   │   └── leaderboard/# XP rankings
│   └── page.tsx        # Landing (redirects to /dashboard if authed)
├── components/
│   ├── layout/         # AppSidebar, TopBar
│   ├── album/          # StickerCard
│   ├── packs/          # (PackOpener - add next)
│   ├── ui/             # Button + primitives
│   └── providers/      # QueryProvider
├── lib/
│   ├── db.ts           # Prisma singleton
│   ├── redis.ts        # Redis + key helpers
│   ├── auth.ts         # getAuthUser, requirePro
│   ├── xp.ts           # XP system + fan titles
│   └── utils.ts        # cn(), formatXp, rarityColor
├── hooks/
│   ├── useUser.ts      # TanStack Query hook
│   └── useAlbum.ts
├── stores/
│   └── uiStore.ts      # Zustand: XP pops, modals
└── types/
    └── index.ts        # Shared TypeScript types
```

## Environment Variables

See `.env.example` for all required variables.

## Brand

STAMPEDE uses a fire gradient palette:
- `#E8003D` Red · `#FF5E00` Orange · `#FFB800` Gold
- Background: `#07070F` · Cards: `#141425` / `#1C1C32`
- Fonts: Barlow Condensed (display) · Space Grotesk (UI) · Inter (body)
