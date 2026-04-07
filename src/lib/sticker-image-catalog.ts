import { normalizeEntityName } from "@/lib/sticker-names";
import catalogData from "@/data/sticker-image-catalog.json";

export type StickerImageStatus = "ready" | "missing" | "needs-review";

export interface StickerImageCatalogEntry {
  key: string;
  category: string;
  name: string;
  team?: string;
  imagePath: string;
  sourceUrl: string;
  sourceLabel: string;
  license: string;
  attribution: string;
  status: StickerImageStatus;
  notes?: string;
}

const ENTRIES = catalogData as StickerImageCatalogEntry[];

function makeKey(category: string, name: string) {
  return `${category.toLowerCase()}:${normalizeEntityName(name)}`;
}

const catalogMap = new Map(ENTRIES.map((entry) => [entry.key, entry]));

export function getCatalogEntry(category: string, name: string) {
  return catalogMap.get(makeKey(category, name)) ?? null;
}

export function getCatalogImagePath(category: string, name: string) {
  return getCatalogEntry(category, name)?.imagePath ?? null;
}

export function getStickerImageCatalog() {
  return [...ENTRIES];
}

export function buildCatalogKey(category: string, name: string) {
  return makeKey(category, name);
}
