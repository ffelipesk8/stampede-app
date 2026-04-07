# STAMPEDE Image Catalog

This project now has a basic image-catalog workflow for stickers.

## Goal

Keep sticker images stable by preferring local assets and tracking source/licensing metadata instead of resolving everything live at render time.

## Current pieces

- `src/lib/sticker-image-catalog.ts`
  Uses:
  - `src/data/sticker-image-catalog.json`
  Holds curated image entries with:
  - category
  - name
  - local image path
  - source URL
  - source label
  - license
  - attribution
  - status

- `scripts/audit-sticker-images.ts`
 - `scripts/audit-sticker-images.mjs`
  Reads stickers from Prisma and writes a report to:
  - `public/data/sticker-image-audit.json`

## Recommended workflow

1. Add curated entries to `src/lib/sticker-image-catalog.ts`
2. Download approved local assets into `public/images/stickers/...`
3. Run:

```bash
npm run audit:images
```

4. Review:
   - how many stickers are covered locally
   - which stickers still depend on remote URLs
   - which stickers are missing

## Status meanings

- `ready`: local asset exists and is approved for use
- `needs-review`: candidate exists but still needs visual or license review
- `missing`: no approved source assigned yet

## Next expansion

The next useful step is to expand the catalog by category:

1. cities
2. stadiums
3. coaches
4. crests
5. players
6. moments / special
