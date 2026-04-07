import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXp(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`;
  return xp.toString();
}

export function rarityColor(rarity: string): string {
  const map: Record<string, string> = {
    COMMON:    "#9090B8",
    UNCOMMON:  "#4A6FFF",
    RARE:      "#00D97E",
    EPIC:      "#FFB800",
    LEGENDARY: "#E8003D",
  };
  return map[rarity] ?? "#9090B8";
}

export function rarityLabel(rarity: string): string {
  return rarity.charAt(0) + rarity.slice(1).toLowerCase();
}
