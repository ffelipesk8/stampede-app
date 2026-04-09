import type { CSSProperties } from "react";

// ─── Colour helpers ──────────────────────────────────────────────────────────

function normalizeHex(hex: string): string {
  const c = hex.replace("#", "");
  return `#${(c.length === 3 ? c.split("").map((x) => x + x).join("") : c).padEnd(6, "0").slice(0, 6)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = normalizeHex(hex).replace("#", "");
  return { r: parseInt(n.slice(0,2),16), g: parseInt(n.slice(2,4),16), b: parseInt(n.slice(4,6),16) };
}

function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function mix(hexA: string, hexB: string, w = 0.5): string {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[
    clamp(a.r*(1-w)+b.r*w),
    clamp(a.g*(1-w)+b.g*w),
    clamp(a.b*(1-w)+b.b*w),
  ].map(v => v.toString(16).padStart(2,"0")).join("")}`;
}

// ─── Country flag palettes: [primary, secondary, tertiary?] ─────────────────
// 80 % of the frame uses primary + secondary; tertiary is used sparingly

const FLAG_PALETTES: Record<string, [string, string, string?]> = {
  ARG: ["#74ACDF", "#FFFFFF", "#74ACDF"],          // sky blue — white — sky blue (stripes)
  AUS: ["#00843D", "#FFCD00", "#003087"],           // green — gold — navy
  BEL: ["#111111", "#EF3340", "#FAE042"],           // black — red — yellow
  BRA: ["#009C3B", "#FFDF00", "#002776"],           // green — yellow — blue
  CHE: ["#D52B1E", "#FFFFFF"],                      // red — white
  COL: ["#FCD116", "#003893", "#CE1126"],           // yellow — blue — red
  CMR: ["#007A5E", "#CE1126", "#FCD116"],           // green — red — yellow
  CIV: ["#F77F00", "#FFFFFF", "#009A00"],           // orange — white — green
  CRI: ["#002B7F", "#CE1126", "#FFFFFF"],           // blue — red — white
  DEU: ["#111111", "#DD0000", "#FFCE00"],           // black — red — gold
  DNK: ["#C60C30", "#FFFFFF"],                      // red — white
  ECU: ["#FFD100", "#003087", "#CE1126"],           // yellow — blue — red
  ENG: ["#C8102E", "#FFFFFF"],                      // red — white
  ESP: ["#AA151B", "#F1BF00"],                      // red — yellow
  FRA: ["#002395", "#FFFFFF", "#ED2939"],           // blue — white — red
  GBR: ["#C8102E", "#FFFFFF", "#012169"],           // red — white — navy
  GHA: ["#006B3F", "#FCD116", "#CE1126"],           // green — gold — red
  HRV: ["#FF0000", "#FFFFFF", "#003DA5"],           // red — white — blue
  IRN: ["#239F40", "#FFFFFF", "#DA0000"],           // green — white — red
  ITA: ["#008C45", "#FFFFFF", "#CD212A"],           // green — white — red
  JPN: ["#FFFFFF", "#BC002D"],                      // white — red
  KOR: ["#FFFFFF", "#CD2E3A", "#003478"],           // white — red — blue
  MAR: ["#C1272D", "#006233"],                      // red — green
  MEX: ["#006847", "#FFFFFF", "#CE1126"],           // green — white — red
  NGA: ["#008751", "#FFFFFF"],                      // green — white
  NED: ["#FF6600", "#FFFFFF", "#21468B"],           // orange — white — blue
  NOR: ["#BA0C2F", "#FFFFFF", "#00205B"],           // red — white — blue
  PAN: ["#DA121A", "#FFFFFF", "#004B98"],           // red — white — blue
  POR: ["#006600", "#FF0000", "#FFD700"],           // green — red — gold
  QAT: ["#8D1B3D", "#FFFFFF"],                      // maroon — white
  SAU: ["#006C35", "#FFFFFF"],                      // green — white
  SEN: ["#00853F", "#FDEF42", "#E31B23"],           // green — yellow — red
  TUN: ["#E70013", "#FFFFFF"],                      // red — white
  URY: ["#FFFFFF", "#75AADB"],                      // white — blue
  USA: ["#3C3B6E", "#B22234", "#FFFFFF"],           // navy — red — white
};

// ─── Category accent colours (20 % of frame) ────────────────────────────────

const CATEGORY_ACCENTS: Record<string, string> = {
  player:  "#FFFFFF",
  crest:   "#14B8A6",
  coach:   "#F97316",
  city:    "#4CC9F0",
  stadium: "#7C3AED",
  moment:  "#F43F5E",
  special: "#A855F7",
  trophy:  "#F59E0B",
};

const DEFAULT_PALETTE: [string, string] = ["#1C1C32", "#252540"];

// ─── Public API ──────────────────────────────────────────────────────────────

export function getTeamPalette(team: string): [string, string, string?] {
  return FLAG_PALETTES[team] ?? DEFAULT_PALETTE;
}

/**
 * Returns all CSS style objects needed to render a premium sticker card.
 *
 * Frame composition:
 *   80 % → country flag colours (primary + secondary + optional tertiary)
 *   20 % → category accent colour (bottom-right corner strip)
 */
export function getStickerFrameStyles(team: string, rarityColor: string, category?: string) {
  const [p, s, t] = getTeamPalette(team);
  const accent = CATEGORY_ACCENTS[category ?? "player"] ?? rarityColor;

  // Darken flag colours slightly for background panels
  const bgA = mix(p, "#090B14", 0.22);
  const bgB = mix(s, "#05070F", 0.38);
  const bgC = t ? mix(t, "#030508", 0.3) : bgA;

  // ── Shell (outer gradient border, 80/20 split) ──────────────────────────
  //   Using conic-gradient: first 80% cycles through flag colours,
  //   last 20% shows accent (category) colour — bottom-right corner.
  const shell: CSSProperties = {
    background: [
      // Outer shell: flag stripes (80%) + accent corner (20%)
      `conic-gradient(`,
      `  from 135deg,`,
      `  ${p} 0deg,`,
      `  ${s} 108deg,`,                      // 30 % of 360 = 108
      `  ${t ?? mix(p, s, 0.5)} 216deg,`,   // 60 %
      `  ${p} 288deg,`,                      // 80 %
      `  ${accent} 288deg,`,                 // start of 20 % accent strip
      `  ${mix(accent,"#FFFFFF",0.2)} 360deg`, // end
      `)`,
    ].join(""),
    boxShadow: [
      `0 0 0 1px ${rgba(accent, 0.3)}`,
      `0 12px 28px ${rgba(accent, 0.15)}`,
    ].join(", "),
  };

  // ── Image panel background ───────────────────────────────────────────────
  const imagePanel: CSSProperties = {
    background: [
      `radial-gradient(ellipse 80% 60% at 20% 10%, ${rgba(p, 0.30)} 0%, transparent 55%)`,
      `radial-gradient(ellipse 50% 50% at 80% 90%, ${rgba(accent, 0.16)} 0%, transparent 45%)`,
      `linear-gradient(160deg, ${bgA} 0%, ${bgB} 55%, ${bgC} 100%)`,
    ].join(", "),
  };

  // ── Flag stripe bar — top of image panel ────────────────────────────────
  //   Repeats the 3 flag colours across the full width (80/20 rule inside bar)
  const flagBar: CSSProperties = {
    background: t
      ? `linear-gradient(to right, ${p} 0%, ${p} 33%, ${s} 33%, ${s} 67%, ${t} 67%, ${t} 80%, ${accent} 80%, ${accent} 100%)`
      : `linear-gradient(to right, ${p} 0%, ${p} 40%, ${s} 40%, ${s} 80%, ${accent} 80%, ${accent} 100%)`,
    height: 5,
  };

  // ── Footer strip ────────────────────────────────────────────────────────
  const footer: CSSProperties = {
    background: `linear-gradient(90deg, ${rgba(p, 0.92)} 0%, ${rgba(s, 0.85)} 70%, ${rgba(accent, 0.95)} 100%)`,
  };

  // ── Category chip ───────────────────────────────────────────────────────
  const chip: CSSProperties = {
    background: `linear-gradient(135deg, ${accent} 0%, ${mix(accent, "#FFFFFF", 0.22)} 100%)`,
    color: "#05070F",
    boxShadow: `0 0 0 1px ${rgba("#FFFFFF", 0.18)}`,
  };

  // ── Initials ring (no-photo fallback) ───────────────────────────────────
  const ring: CSSProperties = {
    borderColor: rgba(accent, 0.75),
    background:  rgba("#000000", 0.4),
  };

  return { primary: p, secondary: s, accent, shell, imagePanel, flagBar, footer, chip, ring };
}
