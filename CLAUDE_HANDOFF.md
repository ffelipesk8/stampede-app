# CLAUDE HANDOFF

This file is for AI collaborators, not end users.

## Project

- Name: STAMPEDE
- Stack: Next.js 14, TypeScript, Tailwind, Clerk, Prisma, Neon/Postgres, Upstash Redis, OpenAI
- Repo path:
  - `C:\Users\User\Documents\Claude\Projects\World Cup Fan Album\stampede-app`
- Production hosting:
  - Vercel

## Current Status

The app is deployed and loading.

Major work already completed:
- GitHub repo created and connected to Vercel
- Neon database connected and seeded
- Core env vars set in Vercel
- Production build issues fixed
- Landing runtime crash fixed
- Sticker image flicker for landing city/stadium cards fixed by moving them to stable local assets
- Better free city/stadium photos added for the landing
- Initial image catalog system created for scaling sticker-image coverage

Latest important commits:
- `a75acdc` feat: upgrade free landing city and stadium photos
- `36edaa9` feat: add sticker image catalog and audit workflow

## Important Reality

Do not assume older Vercel deployment URLs reflect current code.
Always verify the latest deployment commit in Vercel before diagnosing production behavior.

The user was often checking older deployment URLs and seeing stale behavior.

## Image System State

### What was wrong before

The app originally depended too much on fragile remote URLs and live resolution at render time.
This caused:
- missing images
- flicker/titileo
- remote 404/timeout behavior
- repeated regressions when hooks retried failing URLs

### What was fixed

Landing `city` and `stadium` cards now use local assets.

Relevant files:
- `src/components/landing/LandingStickerPreview.tsx`
- `src/hooks/useStickerImage.ts`
- `src/app/api/sticker-image/route.ts`
- `src/app/page.tsx`

Local landing assets currently in use:
- `public/images/stickers/cities/new-york-city.jpg`
- `public/images/stickers/cities/mexico-city.jpg`
- `public/images/stickers/stadiums/metlife-stadium.jpg`
- `public/images/stickers/stadiums/azteca-stadium.jpg`

Old SVG placeholders also still exist:
- `public/images/stickers/stadiums/metlife-stadium.svg`
- `public/images/stickers/stadiums/azteca-stadium.svg`

The JPGs are the current preferred visuals for the landing.

### Catalog system added

Files:
- `src/data/sticker-image-catalog.json`
- `src/lib/sticker-image-catalog.ts`
- `scripts/audit-sticker-images.mjs`
- `public/data/sticker-image-audit.json`
- `IMAGE_CATALOG.md`

Purpose:
- maintain a curated local image inventory
- track image source and attribution
- scale beyond manual landing fixes
- support eventual coverage of all 800+ stickers

## Current Audit Limitation

`npm run audit:images` works structurally, but DB-backed auditing is currently blocked on this machine by a Neon/Prisma TLS issue on Windows.

Observed error:
- Prisma TLS connection error
- `No hay credenciales disponibles en el paquete de seguridad`

The script still generates a report file and confirms catalog/local-file presence, but not full DB coverage yet.

Do not waste time re-debugging this unless the task is specifically to fix the local Neon TLS issue.

## Sticker Data Reality

Seed currently creates mostly:
- `crest`
- `coach`
- `player`

Landing demo additionally showcases:
- `city`
- `stadium`

So the landing contains curated demo visuals that are ahead of the actual seeded album model.

If full album expansion is requested, the likely next serious step is:
- add more non-player sticker categories into the data model/seed
- or maintain them as curated special content outside current seed assumptions

## Deployment / Build Notes

Previously fixed issues included:
- server component event handler bug on landing
- typedRoutes dashboard build error
- lazy init for Stripe/Redis/OpenAI-related code
- Prisma generate on install
- accidental stray `git` file removed

If new production issues appear, first check:
1. latest deployed commit in Vercel
2. env vars in Vercel
3. whether the user is looking at a stale deployment URL

## User Preference Notes

- User writes in Spanish
- User wants direct execution, not too much theory
- User is building toward launch/live deploy
- User does not want paid image providers
- User prefers free sources like Wikimedia and similar
- User is open to curated local assets
- User values momentum and gets frustrated by repeated regressions

## Recommended Next Steps

Best next sequence:

1. Expand `src/data/sticker-image-catalog.json` for more `city` and `stadium` entries
2. Add/download stable local assets for those entries
3. Keep using local paths for curated categories instead of runtime remote lookup
4. Then move to `coach`
5. Then review `crest`
6. Then decide whether to build a broader player curation workflow or continue mixed strategy

## Do Not Regress

Avoid these mistakes:
- do not reintroduce remote-first resolution for landing cities/stadiums
- do not remove local asset priority for those categories
- do not diagnose production using stale Vercel URLs
- do not assume all categories already exist in seeded album content
- do not replace stable local assets with placeholders unless explicitly requested

## Quick Commands

From repo root:

```powershell
git status --short
npm run build
npm run audit:images
```

## If Continuing Image Work

Preferred pattern:
- add local asset under `public/images/stickers/...`
- add catalog entry in `src/data/sticker-image-catalog.json`
- point route/component to local path
- build
- deploy

That is the safest path for this project right now.
