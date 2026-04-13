# CLAUDE HANDOFF

This file is for AI collaborators, not end users.

## Project

- Name: STAMPEDE
- Stack: Next.js 14, TypeScript, Tailwind, Clerk, Prisma, Neon/Postgres, Upstash Redis, OpenAI
- Repo path:
  - `C:\Users\User\Documents\Claude\Projects\World Cup Fan Album\stampede-app`
- Production hosting:
  - Vercel

## Current Product Direction

The app has been heavily redesigned toward a premium console-game aesthetic:
- PS5 / AAA-inspired shell
- stronger cinematic heroes
- premium glass/glow panels
- bigger collectible card presentation
- cleaner navigation and mobile responsiveness

The user cares a lot about:
- professional visual quality
- premium game feel
- strong responsive behavior on Android/mobile
- fixing broken flows immediately
- direct execution, not long explanations

The user writes in Spanish and prefers momentum.

## Critical Warning: Working Directory Corruption

IMPORTANT: In this repository, some files can become silently corrupted in the working directory — same byte count as git HEAD but different (truncated) content. Git status shows them as unmodified, but the actual bytes differ.

If you see TypeScript errors about unclosed JSX tags or unterminated strings in files that look correct at a glance, do this:

```bash
# Force-restore each affected file from git HEAD
git show HEAD:"<file>" > "<file>"
```

This is faster than trying to diagnose and manually patch. Run `npx tsc --noEmit` to detect these, then restore each broken file from HEAD.

## What Was Completed Recently (commit 8481eff)

### File corruption fix

All corrupted/truncated files were restored from git HEAD:
- AppSidebar, TopBar, AlbumClient, CoachClient, EventsClient
- RankingClient, PacksClient, MarketplaceClient, ProfileClient
- LanguageContext, translations, sticker-frame, onboarding pages
- upgrade page, API routes (marketplace, packs/open, sticker-image)
- layout.tsx, album/page.tsx, marketplace/page.tsx, onboarding/layout.tsx

TypeScript build is now clean (`npx tsc --noEmit` passes with no errors).

### PS5-quality dashboard (commit 8481eff)

`src/app/(app)/dashboard/page.tsx` was fully rewritten with AAA game UI:
- Cinematic hero: multi-layer radial gradients + subtle 48px grid overlay + bloom orbs
- Fan title badge (Crown icon + level) above welcome heading
- Stats row: 4 glassmorphic cards with gradient text, per-stat glow, icon with bloom
- Missions panel: circular ring progress chart + per-mission bar + XP reward badge
- Quick actions: 6 dramatic gradient cards with shimmer sweep on hover + badge overlays (NEW DROP, LIVE, AI)
- `PaymentStatusBanner` wired correctly with `initialIsPro`, `payment`, `plan`
- Mission title uses `um.mission.title` (matches Prisma schema)
- Action hrefs cast as `Route` type

### Premium app shell (layout.tsx)

`src/app/(app)/layout.tsx` was completed:
- Global bg: radial gradients (blue/red/green corners) + 48px grid overlay
- AppSidebar + TopBar correctly wired with user + xpProgress props
- AppSceneTransition wraps children for page-to-page animation
- Proper padding: `px-4 py-5 md:px-6 md:py-6 lg:px-8`

### Coaches and referees

New display helper (tracked in git as untracked → now committed):
- `src/lib/sticker-display.ts`

Integrated in:
- `src/app/(app)/album/page.tsx`
- `src/app/(app)/marketplace/page.tsx`
- `src/app/api/marketplace/route.ts`
- `src/app/api/packs/open/route.ts`

### AppSceneTransition

- `src/components/shared/AppSceneTransition.tsx` — framer-motion page transitions, now tracked in git.

## Important Blocker Still Present

Local Prisma reseeding to Neon is still blocked on this Windows machine by TLS / security package issues.

Observed error:
- `No hay credenciales disponibles en el paquete de seguridad`

Conclusion: do not waste time re-debugging this unless the task is specifically to solve local Neon TLS.

## Current State of the UI

### Good state

- Dashboard: PS5-quality cinematic layout with glassmorphic stat cards, mission progress ring, dramatic action cards
- Shell (layout.tsx): premium sidebar + top bar + ambient bg + page transitions
- Album, packs, marketplace, ranking, events, profile and onboarding already look premium
- Card sizing in album and packs is large and collectible
- Panini WC2026 card style: position label, flag bar, holographic foil shimmer

### Still improvable (no blockers, cosmetic)

- Some copy in MarketplaceClient / PacksClient / AlbumClient could be more premium-sounding (less web-ish fallback labels)
- Card metadata could be further simplified: prioritize name, rarity, team, role
- Mobile bottom nav could be smoother on some Android viewports

## Best Next Steps For Claude

Recommended order:

1. Verify the build still passes: `npm run build`
2. If user asks for more visual polish:
   - Dashboard hero: consider adding a featured sticker card or player portrait
   - Stat cards: animated counter on mount (framer-motion)
   - Action cards: consider adding a "recently opened" or "hot drop" indicator
3. Card language unification:
   - Album, packs, marketplace should all use the same card component
   - Consider extracting a shared `<PremiumCard>` that all three use
4. Mobile improvements:
   - Test on 375px viewport (iPhone SE)
   - Ensure bottom nav doesn't overlap content
5. If user asks for new features:
   - Pack opening animation improvements
   - Social features (friend activity feed on dashboard)
   - Card trading UI in marketplace

## Files Most Relevant Right Now

- `src/app/(app)/dashboard/page.tsx` — PS5 dashboard (just rewritten)
- `src/app/(app)/layout.tsx` — app shell
- `src/lib/sticker-display.ts` — coach/referee normalization
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/TopBar.tsx`
- `src/components/shared/AppSceneTransition.tsx`
- `src/app/(app)/album/page.tsx`
- `src/app/(app)/marketplace/page.tsx`
- `src/app/api/marketplace/route.ts`
- `src/app/api/packs/open/route.ts`
- `src/app/api/sticker-image/route.ts`
