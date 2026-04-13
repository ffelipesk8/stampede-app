"use client";

/**
 * PremiumCard
 * ──────────────────────────────────────────────────────────────────────────
 * The single unified sticker card for the whole app.
 *
 * Modes:
 *   • `owned` true  → Panini WC2026 full card (photo, flag bar, holographic foil, position/number)
 *   • `owned` false → Locked mystery card (greyed out, lock icon)
 *   • `flipMode`    → Pack reveal: card starts face-down, flips on tap
 *
 * Size presets: "sm" (album grid) | "md" (pack reveal) | "lg" (spotlight / marketplace)
 */

import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles, getTeamPalette } from "@/lib/sticker-frame";
import { rarityColor, rarityLabel } from "@/lib/utils";
import { PremiumCardShell, type CardRarity } from "@/components/shared/PremiumCardShell";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PremiumCardSticker {
  id: string;
  name: string;
  playerName?: string | null;
  team: string;
  teamFlag?: string | null;
  category: string;
  position: string;
  rarity: string;
  number: number;
  imageUrl?: string | null;
  customImageUrl?: string | null;
  quantity?: number;
}

export interface PremiumCardProps {
  sticker: PremiumCardSticker;
  owned?: boolean;
  size?: "sm" | "md" | "lg";
  /** Pack reveal mode: card starts face-down and flips to reveal */
  flipMode?: boolean;
  /** Whether the card has been revealed (only relevant when flipMode=true) */
  revealed?: boolean;
  /** Called when an unrevealed card is tapped */
  onReveal?: () => void;
  /** Called on general click (album modal, marketplace detail…) */
  onClick?: () => void;
  className?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const RARITY_META: Record<string, { label: string; color: string; bg: string; tier: string }> = {
  COMMON:    { label: "Common",    color: "#9090B8", bg: "linear-gradient(160deg,#1C1C30 0%,#12121E 100%)", tier: "Bronze"    },
  UNCOMMON:  { label: "Uncommon",  color: "#4A6FFF", bg: "linear-gradient(160deg,#0E1828 0%,#07101A 100%)", tier: "Silver"    },
  RARE:      { label: "Rare",      color: "#00D97E", bg: "linear-gradient(160deg,#082818 0%,#040E09 100%)", tier: "Gold"      },
  EPIC:      { label: "Epic",      color: "#FFB800", bg: "linear-gradient(160deg,#1A1000 0%,#0A0800 100%)", tier: "Rare"      },
  LEGENDARY: { label: "Legendary", color: "#E8003D", bg: "linear-gradient(160deg,#1E0008 0%,#0A0004 100%)", tier: "TOTW"      },
};

const POSITION_LABEL: Record<string, string> = {
  GK: "PORTERO", CB: "DEFENSA", LB: "DEFENSA", RB: "DEFENSA",
  CM: "VOLANTE", CDM: "VOLANTE", CAM: "VOLANTE", LM: "VOLANTE", RM: "VOLANTE",
  ST: "DELANT.", CF: "DELANT.", LW: "DELANT.", RW: "DELANT.",
  COACH: "D.T.", "?": "PLY",
};

const FLAG: Record<string, string> = {
  ARG:"🇦🇷", AUS:"🇦🇺", BEL:"🇧🇪", BRA:"🇧🇷", CAN:"🇨🇦", CHE:"🇨🇭",
  CMR:"🇨🇲", COL:"🇨🇴", CRI:"🇨🇷", DEU:"🇩🇪", DNK:"🇩🇰", ECU:"🇪🇨",
  ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", ESP:"🇪🇸", FRA:"🇫🇷", GHA:"🇬🇭", HRV:"🇭🇷",
  IRN:"🇮🇷", ITA:"🇮🇹", JPN:"🇯🇵", KOR:"🇰🇷", MAR:"🇲🇦", MEX:"🇲🇽",
  NGA:"🇳🇬", NLD:"🇳🇱", PAN:"🇵🇦", POR:"🇵🇹", QAT:"🇶🇦", SAU:"🇸🇦",
  SEN:"🇸🇳", USA:"🇺🇸", URY:"🇺🇾",
};

// Size presets: [cardWidth px (optional)] — layout adjusts via container queries
const SIZE_DIMENSIONS: Record<string, string> = {
  sm: "108px",
  md: "136px",
  lg: "172px",
};
const SIZE_ASPECT = "3/4.2";

// ── Card Back (pack unrevealed face) ─────────────────────────────────────────

function CardBack({ size }: { size: "sm" | "md" | "lg" }) {
  const large = size === "lg";
  return (
    <div
      className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden border-2 border-[#2a2a4a]"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)" }}
    >
      {/* Diamond / hatch pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />
      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ["-100%", "220%"] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
        className="absolute inset-y-0 w-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }}
      />
      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div style={{ fontSize: large ? 36 : 24, filter: "drop-shadow(0 0 8px rgba(255,184,0,0.55))" }}>⚽</div>
        <p className="font-condensed font-black tracking-[0.2em] text-[#FFB800]" style={{ fontSize: large ? 11 : 8 }}>
          STAMPEDE
        </p>
        <p className="font-bold tracking-[0.14em] text-[#555880]" style={{ fontSize: large ? 8 : 6 }}>
          WORLD CUP 2026
        </p>
      </div>
      {/* TAP hint */}
      <motion.p
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="absolute bottom-2 text-center font-black text-[#FFB800] tracking-widest"
        style={{ fontSize: large ? 9 : 7 }}
      >
        TAP ▼
      </motion.p>
    </div>
  );
}

// ── Missing / locked card ────────────────────────────────────────────────────

function LockedCard({ sticker }: { sticker: PremiumCardSticker }) {
  const posLabel  = POSITION_LABEL[sticker.position] ?? sticker.position;
  const flagEmoji = sticker.teamFlag || FLAG[sticker.team] || "⚽";
  const meta      = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  // Subtle team-tinted hue for the mystery effect
  const hint = meta.color;

  return (
    <div
      className="w-full h-full rounded-xl flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0c0c1a 0%, #080810 100%)",
        border: `1px solid ${hint}18`,
        boxShadow: `inset 0 0 32px ${hint}08`,
      }}
    >
      {/* Deep rarity-tinted ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${hint}12 0%, transparent 65%)`,
        }}
      />

      {/* Subtle diamond hatch */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
          backgroundSize: "10px 10px",
        }}
      />

      {/* Slow shimmer sweep to show it's "alive" */}
      <motion.div
        animate={{ x: ["-120%", "240%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        className="absolute inset-y-0 w-1/3 pointer-events-none z-10"
        style={{ background: `linear-gradient(to right, transparent, ${hint}08, transparent)` }}
      />

      {/* Top row: team + position/number */}
      <div className="flex items-start justify-between px-2 pt-2 pb-0.5 shrink-0 relative z-10">
        <div>
          <span className="text-[7px] font-black tracking-widest leading-none"
                style={{ color: `${hint}55` }}>
            {sticker.team}
          </span>
          <br />
          <span className="text-[6px] text-white/10 font-bold">· 2026</span>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-bold leading-none mb-0.5" style={{ color: "rgba(255,255,255,0.1)" }}>
            {posLabel}
          </p>
          <p className="font-condensed text-xl font-black leading-none" style={{ color: `${hint}20` }}>
            {sticker.number}
          </p>
        </div>
      </div>

      {/* Centre mystery area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 relative z-10">
        {/* Large faded flag — team hint */}
        <div style={{ fontSize: 32, opacity: 0.1, filter: "grayscale(0.8)" }}>
          {flagEmoji}
        </div>
        {/* Lock circle */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 30, height: 30,
            background: `rgba(255,255,255,0.03)`,
            border: `1.5px solid ${hint}20`,
            boxShadow: `0 0 12px ${hint}15`,
          }}
        >
          <Lock style={{ width: 13, height: 13, color: `${hint}55` }} />
        </div>
      </div>

      {/* Bottom name strip */}
      <div
        className="px-2 pb-2 pt-1.5 shrink-0 flex items-center justify-between relative z-10"
        style={{ borderTop: `1px solid ${hint}12` }}
      >
        <p
          className="text-[8px] font-black truncate flex-1 leading-tight uppercase"
          style={{ color: "rgba(255,255,255,0.16)" }}
        >
          {sticker.name}
        </p>
        <span className="text-sm ml-1 shrink-0" style={{ opacity: 0.1 }}>{flagEmoji}</span>
      </div>
    </div>
  );
}

// ── Owned / collected card ────────────────────────────────────────────────────

function OwnedCard({ sticker, size }: { sticker: PremiumCardSticker; size: "sm" | "md" | "lg" }) {
  const meta     = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color    = rarityColor(sticker.rarity);
  const frame    = getStickerFrameStyles(sticker.team, color, sticker.category);
  const posLabel = POSITION_LABEL[sticker.position] ?? sticker.position;
  const flagEmoji = sticker.teamFlag || FLAG[sticker.team] || "⚽";
  const initials  = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl ?? null,
  );

  const [p, s] = getTeamPalette(sticker.team);
  const isLg = size === "lg";

  return (
    <div className="w-full h-full rounded-xl p-[2.5px]" style={frame.shell}>
      <div
        className="w-full h-full rounded-[9px] flex flex-col overflow-hidden relative"
        style={{
          background: [
            `radial-gradient(ellipse 120% 60% at 50% 0%, ${p}55 0%, transparent 55%)`,
            `radial-gradient(ellipse 80% 50% at 80% 100%, ${s}35 0%, transparent 50%)`,
            meta.bg,
          ].join(", "),
        }}
      >
        {/* Flag bar */}
        <div className="w-full shrink-0 z-20" style={{ ...frame.flagBar }} />

        {/* Top row: WC26 badge left + position/number right */}
        <div className="flex items-start justify-between px-2 pt-1.5 pb-0.5 z-10 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span
              className="font-black px-1 py-0.5 rounded leading-none"
              style={{
                fontSize: isLg ? "8px" : "7px",
                background: `${color}30`, color,
                border: `0.5px solid ${color}50`,
              }}
            >
              WC26
            </span>
            <p className="font-black text-white/70 tracking-wider" style={{ fontSize: isLg ? "9px" : "8px" }}>
              {sticker.team}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p
              className="font-black uppercase tracking-widest leading-none mb-0.5"
              style={{ fontSize: isLg ? "8px" : "7px", color: `${color}CC` }}
            >
              {posLabel}
            </p>
            <p
              className="font-condensed font-black leading-none"
              style={{
                fontSize: isLg ? "28px" : "22px",
                color: "#fff",
                textShadow: `0 0 8px ${color}80`,
              }}
            >
              {sticker.number}
            </p>
          </div>
        </div>

        {/* Photo area */}
        <div className="flex-1 relative overflow-hidden">
          {showPhoto ? (
            <img
              src={photoUrl!} alt={sticker.name}
              className="w-full h-full object-cover object-top"
              onLoad={() => setLoaded(true)} onError={() => setError(true)}
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
              style={frame.imagePanel}
            >
              <div style={{ fontSize: isLg ? 28 : 22 }}>{flagEmoji}</div>
              <div
                className="rounded-full flex items-center justify-center font-black"
                style={{
                  width: isLg ? 36 : 28, height: isLg ? 36 : 28,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  fontSize: isLg ? 13 : 10,
                  border: `2px solid ${color}70`,
                }}
              >
                {initials}
              </div>
            </div>
          )}
          {/* Gradient fade to name strip */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
            style={{ background: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)` }}
          />
        </div>

        {/* Name strip */}
        <div
          className="shrink-0 px-2 pb-2 pt-1"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.75) 100%)`,
            borderTop: `1.5px solid ${color}25`,
          }}
        >
          <div className="flex items-end justify-between gap-1">
            <p
              className="font-condensed font-black text-white leading-tight truncate uppercase"
              style={{ fontSize: isLg ? "13px" : "10px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
            >
              {sticker.name}
            </p>
            <span className="shrink-0 leading-none mb-0.5" style={{ fontSize: isLg ? 16 : 12 }}>{flagEmoji}</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-black leading-none" style={{ fontSize: isLg ? "9px" : "7px", color }}>
              {meta.tier}
            </span>
            {(sticker.quantity ?? 0) > 1 && (
              <span
                className="font-black px-1 py-0.5 rounded"
                style={{ fontSize: "7px", background: `${color}25`, color }}
              >
                x{sticker.quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pack reveal burst effects ─────────────────────────────────────────────────

function RevealBurst({ color, rarity }: { color: string; rarity: string }) {
  const isLegendary = rarity === "LEGENDARY";
  const isEpic      = rarity === "EPIC";
  return (
    <AnimatePresence>
      {/* Expanding ring */}
      <motion.div
        key="ring"
        initial={{ scale: 0.8, opacity: 1 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `3px solid ${color}` }}
      />
      {/* Epic+ radial burst */}
      {isEpic && (
        <motion.div
          key="burst"
          initial={{ scale: 0.5, opacity: 0.9 }}
          animate={{ scale: 3.8, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}70 0%, transparent 70%)` }}
        />
      )}
      {/* Legendary second ring */}
      {isLegendary && (
        <motion.div
          key="ring2"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color}55 0%, transparent 65%)` }}
        />
      )}
    </AnimatePresence>
  );
}

// ── PremiumCard ───────────────────────────────────────────────────────────────

export function PremiumCard({
  sticker,
  owned = true,
  size = "sm",
  flipMode = false,
  revealed,
  onReveal,
  onClick,
  className = "",
}: PremiumCardProps) {
  const color = rarityColor(sticker.rarity);
  const w     = SIZE_DIMENSIONS[size];
  const isRevealed = !flipMode || revealed;
  const hasRevealBurst = flipMode && revealed;

  // In flip mode: outer wrapper handles the 3D flip animation
  if (flipMode) {
    return (
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.75, rotateZ: 0 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className={`relative flex-shrink-0 ${className}`}
        style={{ width: w, aspectRatio: SIZE_ASPECT, perspective: "900px" }}
      >
        {/* Ambient glow for EPIC/LEGENDARY after reveal */}
        {(sticker.rarity === "LEGENDARY" || sticker.rarity === "EPIC") && isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute inset-0 rounded-2xl blur-xl pointer-events-none -z-10"
            style={{ background: color, transform: "scale(0.88) translateY(10px)" }}
          />
        )}

        {/* 3D flip container */}
        <motion.div
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.72, type: "spring", stiffness: 90, damping: 22 }}
          style={{
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            cursor: isRevealed ? "default" : "pointer",
          }}
          onClick={() => !isRevealed && onReveal?.()}
        >
          {/* BACK face */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardBack size={size} />
          </div>

          {/* FRONT face */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <PremiumCardShell
              rarity={sticker.rarity as CardRarity}
              glowColor={color}
              className="rounded-xl w-full h-full"
            >
              <OwnedCard sticker={sticker} size={size} />
            </PremiumCardShell>
          </div>
        </motion.div>

        {/* Burst effects on reveal */}
        {hasRevealBurst && <RevealBurst color={color} rarity={sticker.rarity} />}
      </motion.div>
    );
  }

  // Non-flip mode (album, marketplace)
  if (!owned) {
    return (
      <div
        className={`cursor-pointer rounded-xl overflow-hidden ${className}`}
        style={{ width: w, aspectRatio: SIZE_ASPECT }}
        onClick={onClick}
      >
        <LockedCard sticker={sticker} />
      </div>
    );
  }

  return (
    <PremiumCardShell
      rarity={sticker.rarity as CardRarity}
      glowColor={color}
      className={`cursor-pointer rounded-xl overflow-hidden ${className}`}
      onClick={onClick}
      style={{ width: w, aspectRatio: SIZE_ASPECT }}
    >
      <OwnedCard sticker={sticker} size={size} />
    </PremiumCardShell>
  );
}
