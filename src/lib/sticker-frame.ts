import type { CSSProperties } from "react";

const DEFAULT_PRIMARY = "#1C1C32";
const DEFAULT_SECONDARY = "#252540";

const TEAM_PALETTES: Record<string, [string, string]> = {
  ARG: ["#74ACDF", "#FFFFFF"],
  AUS: ["#00843D", "#FFCD00"],
  BEL: ["#111111", "#EF3340"],
  BRA: ["#009C3B", "#FFDF00"],
  CHE: ["#D52B1E", "#FFFFFF"],
  COL: ["#FCD116", "#003893"],
  CMR: ["#007A5E", "#CE1126"],
  DEU: ["#111111", "#DD0000"],
  ENG: ["#C8102E", "#FFFFFF"],
  ESP: ["#AA151B", "#F1BF00"],
  FRA: ["#002395", "#ED2939"],
  ITA: ["#008C45", "#CD212A"],
  JPN: ["#FFFFFF", "#BC002D"],
  KOR: ["#FFFFFF", "#CD2E3A"],
  MAR: ["#C1272D", "#006233"],
  MEX: ["#006847", "#CE1126"],
  NED: ["#FF6600", "#21468B"],
  NOR: ["#BA0C2F", "#00205B"],
  POR: ["#006600", "#FF0000"],
  USA: ["#3C3B6E", "#B22234"],
  URY: ["#FFFFFF", "#75AADB"],
};

const CATEGORY_ACCENTS: Record<string, string> = {
  city: "#4CC9F0",
  stadium: "#7C3AED",
  coach: "#F97316",
  crest: "#14B8A6",
  moment: "#F43F5E",
  special: "#A855F7",
  trophy: "#F59E0B",
};

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

function normalizeHex(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return `#${clean.split("").map((c) => c + c).join("")}`;
  }
  return `#${clean.padEnd(6, "0").slice(0, 6)}`;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mix(hexA: string, hexB: string, weight = 0.5) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = clamp(Math.round(a.r * (1 - weight) + b.r * weight));
  const g = clamp(Math.round(a.g * (1 - weight) + b.g * weight));
  const bValue = clamp(Math.round(a.b * (1 - weight) + b.b * weight));
  return `#${[r, g, bValue].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export function getTeamPalette(team: string) {
  return TEAM_PALETTES[team] ?? [DEFAULT_PRIMARY, DEFAULT_SECONDARY];
}

export function getStickerFrameStyles(team: string, rarityColor: string, category?: string) {
  const [primary, secondary] = getTeamPalette(team);
  const accent = CATEGORY_ACCENTS[category ?? ""] ?? rarityColor;
  const innerStart = mix(primary, "#0B1020", 0.2);
  const innerEnd = mix(secondary, "#05070F", 0.38);
  const accentDeep = mix(accent, "#12071C", 0.36);

  return {
    primary,
    secondary,
    accent,
    shell: {
      background: `linear-gradient(135deg, ${primary} 0%, ${primary} 46%, ${secondary} 46%, ${secondary} 80%, ${accent} 80%, ${accent} 100%)`,
      boxShadow: `0 0 0 1px ${rgba(accent, 0.35)}, 0 16px 30px ${rgba(accent, 0.18)}`,
    } satisfies CSSProperties,
    imagePanel: {
      background: [
        `radial-gradient(circle at top left, ${rgba(primary, 0.28)} 0%, transparent 36%)`,
        `radial-gradient(circle at top right, ${rgba(accent, 0.18)} 0%, transparent 28%)`,
        `linear-gradient(160deg, ${innerStart} 0%, ${innerEnd} 72%, ${accentDeep} 100%)`,
      ].join(", "),
    } satisfies CSSProperties,
    footer: {
      background: `linear-gradient(90deg, ${rgba(primary, 0.92)} 0%, ${rgba(secondary, 0.86)} 78%, ${rgba(accent, 0.92)} 100%)`,
    } satisfies CSSProperties,
    chip: {
      background: `linear-gradient(135deg, ${accent} 0%, ${mix(accent, "#FFFFFF", 0.18)} 100%)`,
      color: "#05070F",
      boxShadow: `0 0 0 1px ${rgba("#FFFFFF", 0.16)}`,
    } satisfies CSSProperties,
    ring: {
      borderColor: rgba(accent, 0.72),
      background: rgba("#000000", 0.38),
    } satisfies CSSProperties,
  };
}
