import type { CSSProperties } from "react";

function normalizeHex(hex: string): string {
  const c = hex.replace("#", "");
  return `#${(c.length === 3 ? c.split("").map((x) => x + x).join("") : c).padEnd(6, "0").slice(0, 6)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = normalizeHex(hex).replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function mix(hexA: string, hexB: string, w = 0.5): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[
    clamp(a.r * (1 - w) + b.r * w),
    clamp(a.g * (1 - w) + b.g * w),
    clamp(a.b * (1 - w) + b.b * w),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

const FLAG_PALETTES: Record<string, [string, string, string?]> = {
  ALG: ["#006233", "#FFFFFF", "#D21034"],
  ARG: ["#74ACDF", "#FFFFFF", "#74ACDF"],
  AUS: ["#00843D", "#FFCD00", "#003087"],
  AUT: ["#ED2939", "#FFFFFF"],
  BEL: ["#111111", "#EF3340", "#FAE042"],
  BIH: ["#002F6C", "#FCD116"],
  BRA: ["#009C3B", "#FFDF00", "#002776"],
  CAN: ["#D52B1E", "#FFFFFF"],
  CHE: ["#D52B1E", "#FFFFFF"],
  CIV: ["#F77F00", "#FFFFFF", "#009A00"],
  COD: ["#00A3E0", "#F7D117", "#EF3340"],
  COL: ["#FCD116", "#003893", "#CE1126"],
  CMR: ["#007A5E", "#CE1126", "#FCD116"],
  CPV: ["#003893", "#FFFFFF", "#CF2027"],
  CRI: ["#002B7F", "#CE1126", "#FFFFFF"],
  CRO: ["#FF0000", "#FFFFFF", "#003DA5"],
  CUW: ["#002B7F", "#F9E300"],
  CZE: ["#11457E", "#FFFFFF", "#D7141A"],
  DEU: ["#111111", "#DD0000", "#FFCE00"],
  DEN: ["#C60C30", "#FFFFFF"],
  DNK: ["#C60C30", "#FFFFFF"],
  ECU: ["#FFD100", "#003087", "#CE1126"],
  EGY: ["#CE1126", "#FFFFFF", "#111111"],
  ENG: ["#C8102E", "#FFFFFF"],
  ESP: ["#AA151B", "#F1BF00"],
  FRA: ["#002395", "#FFFFFF", "#ED2939"],
  GBR: ["#C8102E", "#FFFFFF", "#012169"],
  GER: ["#111111", "#DD0000", "#FFCE00"],
  GHA: ["#006B3F", "#FCD116", "#CE1126"],
  HRV: ["#FF0000", "#FFFFFF", "#003DA5"],
  HTI: ["#00209F", "#D21034"],
  IRN: ["#239F40", "#FFFFFF", "#DA0000"],
  IRQ: ["#CE1126", "#FFFFFF", "#111111"],
  ITA: ["#008C45", "#FFFFFF", "#CD212A"],
  JOR: ["#007A3D", "#FFFFFF", "#CE1126"],
  JPN: ["#FFFFFF", "#BC002D"],
  KOR: ["#FFFFFF", "#CD2E3A", "#003478"],
  MAR: ["#C1272D", "#006233"],
  MEX: ["#006847", "#FFFFFF", "#CE1126"],
  NED: ["#FF6600", "#FFFFFF", "#21468B"],
  NGA: ["#008751", "#FFFFFF"],
  NOR: ["#BA0C2F", "#FFFFFF", "#00205B"],
  NZL: ["#00247D", "#FFFFFF", "#CC142B"],
  PAN: ["#DA121A", "#FFFFFF", "#004B98"],
  PAR: ["#D52B1E", "#FFFFFF", "#0038A8"],
  POR: ["#006600", "#FF0000", "#FFD700"],
  QAT: ["#8D1B3D", "#FFFFFF"],
  SAU: ["#006C35", "#FFFFFF"],
  SCO: ["#0065BD", "#FFFFFF"],
  SEN: ["#00853F", "#FDEF42", "#E31B23"],
  SUI: ["#D52B1E", "#FFFFFF"],
  SWE: ["#006AA7", "#FECC00"],
  TUN: ["#E70013", "#FFFFFF"],
  TUR: ["#E30A17", "#FFFFFF"],
  URU: ["#FFFFFF", "#75AADB"],
  URY: ["#FFFFFF", "#75AADB"],
  USA: ["#3C3B6E", "#B22234", "#FFFFFF"],
  UZB: ["#0099B5", "#FFFFFF", "#1EB53A"],
  ZAF: ["#007749", "#FFB612", "#DE3831"],
};

const CATEGORY_ACCENTS: Record<string, string> = {
  player: "#FFFFFF",
  crest: "#14B8A6",
  coach: "#F97316",
  city: "#4CC9F0",
  stadium: "#7C3AED",
  moment: "#F43F5E",
  special: "#A855F7",
  trophy: "#F59E0B",
  referee: "#38BDF8",
};

const DEFAULT_PALETTE: [string, string] = ["#1C1C32", "#252540"];

export function getTeamPalette(team: string): [string, string, string?] {
  return FLAG_PALETTES[team] ?? DEFAULT_PALETTE;
}

export function getStickerFrameStyles(team: string, rarityColor: string, category?: string) {
  const [p, s, t] = getTeamPalette(team);
  const accent = CATEGORY_ACCENTS[category ?? "player"] ?? rarityColor;

  const bgA = mix(p, "#090B14", 0.22);
  const bgB = mix(s, "#05070F", 0.38);
  const bgC = t ? mix(t, "#030508", 0.3) : bgA;

  const foilMid = mix(p, s, 0.5);
  const foilHigh = mix(foilMid, "#FFFFFF", 0.35);
  const foilAccent = mix(accent, "#FFFFFF", 0.15);

  const shell: CSSProperties = {
    background: [
      "conic-gradient(",
      "from 120deg at 40% 45%,",
      `${p} 0deg,`,
      `${foilHigh} 45deg,`,
      `${s} 90deg,`,
      `${foilMid} 135deg,`,
      `${t ?? mix(p, s, 0.5)} 180deg,`,
      `${foilHigh} 210deg,`,
      `${p} 250deg,`,
      `${accent} 280deg,`,
      `${foilAccent} 320deg,`,
      `${p} 360deg`,
      ")",
    ].join(" "),
    boxShadow: [
      `0 0 0 1px ${rgba(accent, 0.35)}`,
      `0 0 10px 2px ${rgba(foilHigh, 0.18)}`,
      `0 14px 32px ${rgba(accent, 0.2)}`,
    ].join(", "),
  };

  const imagePanel: CSSProperties = {
    background: [
      `radial-gradient(ellipse 80% 60% at 20% 10%, ${rgba(p, 0.3)} 0%, transparent 55%)`,
      `radial-gradient(ellipse 50% 50% at 80% 90%, ${rgba(accent, 0.16)} 0%, transparent 45%)`,
      `linear-gradient(160deg, ${bgA} 0%, ${bgB} 55%, ${bgC} 100%)`,
    ].join(", "),
  };

  const flagBar: CSSProperties = {
    background: t
      ? `linear-gradient(to right, ${p} 0%, ${p} 33%, ${s} 33%, ${s} 67%, ${t} 67%, ${t} 80%, ${accent} 80%, ${accent} 100%)`
      : `linear-gradient(to right, ${p} 0%, ${p} 40%, ${s} 40%, ${s} 80%, ${accent} 80%, ${accent} 100%)`,
    height: 5,
  };

  const footer: CSSProperties = {
    background: `linear-gradient(90deg, ${rgba(p, 0.92)} 0%, ${rgba(s, 0.85)} 70%, ${rgba(accent, 0.95)} 100%)`,
  };

  const chip: CSSProperties = {
    background: `linear-gradient(135deg, ${accent} 0%, ${mix(accent, "#FFFFFF", 0.22)} 100%)`,
    color: "#05070F",
    boxShadow: `0 0 0 1px ${rgba("#FFFFFF", 0.18)}`,
  };

  const ring: CSSProperties = {
    borderColor: rgba(accent, 0.75),
    background: rgba("#000000", 0.4),
  };

  return { primary: p, secondary: s, accent, shell, imagePanel, flagBar, footer, chip, ring };
}
