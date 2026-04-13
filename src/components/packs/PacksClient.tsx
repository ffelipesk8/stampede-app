"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star } from "lucide-react";
import { cn, rarityColor, rarityLabel } from "@/lib/utils";
import { useStickerImage } from "@/hooks/useStickerImage";
import { ShareButton } from "@/components/shared/ShareModal";
import { PremiumCardShell, type CardRarity } from "@/components/shared/PremiumCardShell";
import { getStickerFrameStyles } from "@/lib/sticker-frame";
import { PremiumCard } from "@/components/shared/PremiumCard";

// -- Shared team data -----------------------------------------------------------
const TEAM_FLAGS: Record<string, string> = {
  ARG:"🇦🇷", BRA:"🇧🇷", FRA:"🇫🇷", ESP:"🇪🇸", DEU:"🇩🇪", ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  MEX:"🇲🇽", USA:"🇺🇸", POR:"🇵🇹", NLD:"🇳🇱", ITA:"🇮🇹", BEL:"🇧🇪",
  HRV:"🇭🇷", URY:"🇺🇾", COL:"🇨🇴", CHE:"🇨🇭", SEN:"🇸🇳", MAR:"🇲🇦",
  JPN:"🇯🇵", KOR:"🇰🇷", AUS:"🇦🇺", CMR:"🇨🇲", GHA:"🇬🇭", CIV:"🇨🇮",
  TUN:"🇹🇳", EGY:"🇪🇬", NGA:"🇳🇬", SAU:"🇸🇦", IRN:"🇮🇷", QAT:"🇶🇦",
  CAN:"🇨🇦", CRI:"🇨🇷", PAN:"🇵🇦",
};

const TEAM_COLORS: Record<string, [string, string]> = {
  ARG:["#74ACDF","#FFFFFF"], BRA:["#009C3B","#FFDF00"], FRA:["#002395","#ED2939"],
  ESP:["#AA151B","#F1BF00"], DEU:["#000000","#DD0000"], ENG:["#CF081F","#FFFFFF"],
  MEX:["#006847","#CE1126"], USA:["#002868","#BF0A30"], POR:["#006600","#FF0000"],
  NLD:["#FF6600","#003DA5"], ITA:["#003399","#009246"], BEL:["#000000","#EF3340"],
  HRV:["#FF0000","#FFFFFF"], URY:["#FFFFFF","#75AADB"], COL:["#FCD116","#003087"],
  CHE:["#FF0000","#FFFFFF"], SEN:["#00853F","#FDEF42"], MAR:["#C1272D","#006233"],
  JPN:["#FFFFFF","#BC002D"], KOR:["#FFFFFF","#CD2E3A"], AUS:["#00843D","#FFCD00"],
};

// -- Mini card shown in store grid ----------------------------------------------
function StickerCard({ sticker, delay = 0 }: {
  sticker: { id: string; name: string; rarity: string; team: string; imageUrl: string; category?: string };
  delay?: number;
}) {
  const c = rarityColor(sticker.rarity as never);
  const initials = sticker.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.name,
    sticker.category ?? "player",
    sticker.imageUrl
  );
  const frame = getStickerFrameStyles(sticker.team, c, sticker.category ?? "player");

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex-shrink-0 w-24"
      style={{ borderRadius: "0.75rem" }}
    >
      <PremiumCardShell
        rarity={sticker.rarity as CardRarity}
        glowColor={c}
        style={{ borderRadius: "0.75rem" }}
      >
        {/* -- Outer frame shell -- */}
        <div className="rounded-xl overflow-hidden p-[2.5px]" style={frame.shell}>
          <div className="rounded-[11px] overflow-hidden bg-[#090914]">
            {/* Image area */}
            <div className="h-32 relative overflow-hidden" style={frame.imagePanel}>
              <div className="absolute top-0 left-0 right-0 z-10" style={frame.flagBar} />
              {showPhoto ? (
                <img src={photoUrl!} alt={sticker.name}
                     className="w-full h-full object-cover object-top"
                     onLoad={() => setLoaded(true)}
                     onError={() => setError(true)} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <div className="text-2xl">{TEAM_FLAGS[sticker.team] ?? "⚽"}</div>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base"
                       style={{ ...frame.ring, color: "#fff" }}>
                    {initials}
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-10"
                   style={frame.footer}>
                <span className="text-[9px] font-black text-white tracking-widest">{sticker.team}</span>
                <span className="text-[9px]">{TEAM_FLAGS[sticker.team] ?? ""}</span>
              </div>
            </div>
            {/* Card footer */}
            <div className="px-1.5 py-1.5" style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)" }}>
              <p className="text-[10px] font-bold text-white truncate leading-tight">{sticker.name}</p>
              <p className="text-[9px] font-black mt-0.5" style={{ color: c }}>{rarityLabel(sticker.rarity as never)}</p>
            </div>
          </div>
        </div>
      </PremiumCardShell>
    </motion.div>
  );
}

// -- FIFA-style flip card for reveal -------------------------------------------
function FifaCard({
  sticker,
  index,
  revealed,
  onReveal,
}: {
  sticker: { id: string; name: string; rarity: string; team: string; imageUrl: string; category?: string };
  index: number;
  revealed: boolean;
  onReveal: () => void;
}) {
  const c = rarityColor(sticker.rarity as never);
  const initials = sticker.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.name,
    sticker.category ?? "player",
    sticker.imageUrl
  );
  const isLegendary = sticker.rarity === "LEGENDARY";
  const isEpic = sticker.rarity === "EPIC";
  const frame = getStickerFrameStyles(sticker.team, c, sticker.category ?? "player");

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.7, rotateZ: (index % 2 === 0 ? -8 : 8) }}
      animate={{ y: 0, opacity: 1, scale: 1, rotateZ: 0 }}
      transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 160, damping: 18 }}
      className="relative flex-shrink-0"
      style={{ perspective: "800px" }}
    >
      {/* Legendary/Epic ambient glow */}
      {(isLegendary || isEpic) && revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-2xl blur-xl pointer-events-none"
          style={{ background: c, transform: "scale(0.9) translateY(8px)" }}
        />
      )}

      {/* 3D flip container */}
      <motion.div
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.75, type: "spring", stiffness: 90, damping: 22 }}
        style={{ transformStyle: "preserve-3d", width: "108px", height: "152px" }}
        onClick={() => !revealed && onReveal()}
        className={cn("relative cursor-pointer", !revealed && "hover:scale-105")}
      >
        {/* -- CARD BACK -- */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#2a2a4a]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] flex flex-col items-center justify-center gap-2 relative overflow-hidden">
            {/* Diamond pattern */}
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
            {/* Center logo */}
            <div className="text-3xl relative z-10" style={{ filter: "drop-shadow(0 0 8px rgba(255,184,0,0.6))" }}>⚽</div>
            <div className="relative z-10 text-center">
              <p className="text-[9px] text-[#FFB800] font-black tracking-[0.2em]">STAMPEDE</p>
              <p className="text-[7px] text-[#666888] font-bold tracking-[0.15em]">WORLD CUP 2026</p>
            </div>
            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none"
            />
          </div>
          {/* Tap hint */}
          {!revealed && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute bottom-1.5 left-0 right-0 text-center text-[8px] font-black text-[#FFB800] tracking-widest"
            >
              TAP ▼
            </motion.div>
          )}
        </div>

        {/* -- CARD FRONT -- */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Premium frame shell — 2.5px gradient border */}
          <div className="w-full h-full rounded-2xl p-[2.5px]"
               style={{
                 ...frame.shell,
                 boxShadow: revealed
                   ? `0 0 24px ${c}80, 0 0 60px ${c}30, ${frame.shell.boxShadow ?? ""}`
                   : "none",
               }}>
            <div className="w-full h-full rounded-[13px] overflow-hidden bg-[#090914] flex flex-col">

              {/* Photo area — top 66% */}
              <div className="relative overflow-hidden" style={{ flex: "0 0 66%", ...frame.imagePanel }}>
                {/* Flag bar top */}
                <div className="absolute top-0 left-0 right-0 z-20" style={frame.flagBar} />

                {/* LEGENDARY / EPIC holographic shimmer */}
                {(isLegendary || isEpic) && revealed && (
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: isLegendary ? 1.8 : 3, ease: "linear" }}
                    className="absolute inset-0 w-1/2 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
                  />
                )}

                {showPhoto ? (
                  <img
                    src={photoUrl!}
                    alt={sticker.name}
                    className="w-full h-full object-cover object-top"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
                    <div className="text-2xl">{TEAM_FLAGS[sticker.team] ?? "⚽"}</div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                         style={{ ...frame.ring, color: "#fff" }}>
                      {initials}
                    </div>
                  </div>
                )}

                {/* Footer strip inside image panel */}
                <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-20"
                     style={frame.footer}>
                  <span className="text-[8px] font-black text-white tracking-widest">{sticker.team}</span>
                  <span className="text-[10px]">{TEAM_FLAGS[sticker.team] ?? ""}</span>
                </div>
              </div>

              {/* Name area — bottom 34% */}
              <div className="flex flex-col justify-center px-2 py-1.5"
                   style={{ flex: "0 0 34%", background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)" }}>
                <p className="text-[10px] font-black text-white truncate leading-tight">{sticker.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[9px] font-black" style={{ color: c }}>{rarityLabel(sticker.rarity as never)}</p>
                  {isLegendary && <span className="text-[9px]">✨</span>}
                  {isEpic && <span className="text-[9px]">💜</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rarity burst ring on reveal */}
      <AnimatePresence>
        {revealed && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: `3px solid ${c}` }}
            />
            {isLegendary && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${c}80 0%, transparent 70%)` }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -- Floating particle ----------------------------------------------------------
function Particle({ color, delay, x }: { color: string; delay: number; x: number }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{ y: -160, opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
      transition={{ delay, duration: 2 + Math.random(), repeat: Infinity, repeatDelay: Math.random() * 2 }}
      className="absolute bottom-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
      style={{ left: `${x}%`, background: color }}
    />
  );
}

// -- Types ---------------------------------------------------------------------
type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
type PackType = "FREE_DAILY" | "COMMON" | "PREMIUM" | "GOLD" | "LEGENDARY" | "TEAM_SPECIAL" | "MATCH_DAY" | "DROP_LIMITED" | "WELCOME";

interface Pack {
  id: string;
  name: string;
  description: string | null;
  type: PackType;
  rarity: Rarity;
  cardCount: number;
  priceUsd: number | null;
  xpBonus: number;
  imageUrl: string | null;
  maxSupply: number | null;
  soldCount: number;
  availableFrom: string | Date | null;
  availableUntil: string | Date | null;
  // extra Prisma fields (optional, not used in UI)
  slug?: string;
  isActive?: boolean;
  createdAt?: Date;
  guaranteedMin?: string | null;
  [key: string]: unknown;
}

interface RecentOpen {
  id: string;
  openedAt: string | Date;
  xpEarned: number;
  pack: { name: string; rarity: Rarity };
  stickersWon?: Array<{ id: string; name: string; rarity: Rarity }>;
}

interface PacksClientProps {
  packs: Pack[];
  recentOpens: RecentOpen[];
  isPro: boolean;
}

const PACK_VISUALS: Record<string, { gradient: string; glow: string; label: string; emoji: string }> = {
  COMMON:     { gradient: "from-card2 to-card1",   glow: "#9090B8", label: "COMMON",    emoji: "📦" },
  UNCOMMON:   { gradient: "from-blue/20 to-card1", glow: "#4A6FFF", label: "UNCOMMON",  emoji: "💎" },
  RARE:       { gradient: "from-green/20 to-card1",glow: "#00D97E", label: "RARE",      emoji: "🌟" },
  EPIC:       { gradient: "from-gold/20 to-card1", glow: "#A855F7", label: "EPIC",      emoji: "⚡" },
  LEGENDARY:  { gradient: "from-red/30 to-card1",  glow: "#FFB800", label: "LEGENDARY", emoji: "🔥" },
};

// -- Main component -------------------------------------------------------------
export function PacksClient({ packs, recentOpens, isPro }: PacksClientProps) {
  const [openingPack, setOpeningPack]  = useState<Pack | null>(null);
  const [openResult, setOpenResult]    = useState<{
    stickers: Array<{ id: string; name: string; rarity: Rarity; team: string; imageUrl: string; category?: string }>;
    xpEarned: number;
    newXp: number;
    levelUp: boolean;
  } | null>(null);

  // FIFA phases: idle → charging (3 taps) → explode → reveal → done
  type Phase = "idle" | "charging" | "explode" | "reveal" | "done";
  const [phase, setPhase]           = useState<Phase>("idle");
  const [tapCount, setTapCount]     = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [flashOn, setFlashOn]       = useState(false);
  // which cards have been flipped by the user
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());
  const apiPromiseRef = useRef<Promise<void> | null>(null);

  const freePack   = packs.find((p) => p.type === "FREE_DAILY");
  const storePacks = packs.filter((p) => p.type !== "FREE_DAILY");

  const startOpen = useCallback((pack: Pack) => {
    setOpeningPack(pack);
    setPhase("idle");
    setTapCount(0);
    setOpenResult(null);
    setError(null);
    setFlashOn(false);
    setRevealedSet(new Set());
    apiPromiseRef.current = null;
  }, []);

  // Single tap on the pack during charging phase
  const handlePackTap = useCallback(async () => {
    if (!openingPack || phase === "explode" || phase === "reveal" || phase === "done") return;

    const next = tapCount + 1;
    setTapCount(next);
    setPhase("charging");

    if (next >= 3) {
      // Kick off API call immediately (before animation finishes)
      // Returns the result on success, null on failure
      let apiResult: { stickers: unknown[]; xpEarned: number; newXp: number; levelUp: boolean } | null = null;
      const apiCall = (async () => {
        try {
          const res  = await fetch("/api/packs/open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packId: openingPack.id }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Failed to open pack");
          apiResult = data;
          setOpenResult(data);
        } catch (err) {
          setError((err as Error).message);
          apiResult = null;
        }
      })();
      apiPromiseRef.current = apiCall;

      // Explode animation
      setPhase("explode");
      setFlashOn(true);
      setTimeout(() => setFlashOn(false), 350);

      // Wait for both animation + API (at least 1.6s for drama)
      await new Promise<void>((resolve) => setTimeout(resolve, 1600));
      await apiCall;

      // Only advance to reveal if API succeeded — otherwise go back to idle
      // so the user sees the error and can close the modal
      if (apiResult) {
        setPhase("reveal");
      } else {
        setPhase("idle");
        setTapCount(0);
      }
      setLoading(false);
    }
  }, [openingPack, phase, tapCount]);

  // Auto-reveal all cards after a short delay
  useEffect(() => {
    if (phase !== "reveal" || !openResult) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    openResult.stickers.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealedSet((prev) => { const s = new Set(prev); s.add(i); return s; });
      }, 700 + i * 380));
    });
    return () => timers.forEach(clearTimeout);
  }, [phase, openResult]);

  const revealAll = () => {
    if (!openResult) return;
    setRevealedSet(new Set(openResult.stickers.map((_, i) => i)));
  };

  const vis = openingPack ? (PACK_VISUALS[openingPack.rarity] ?? PACK_VISUALS.COMMON) : null;

  // Particles for the pack opening scene
  const particles = vis
    ? Array.from({ length: 14 }, (_, i) => ({ id: i, x: 10 + (i * 6), delay: i * 0.18 }))
    : [];

  const allRevealed = openResult ? revealedSet.size >= openResult.stickers.length : false;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* -- Header -- */}
      <div>
        <h1 className="font-condensed text-4xl font-black text-t1 tracking-wide">Pack Store</h1>
        <p className="text-t2 text-sm mt-1">Open packs · Collect stickers · Level up</p>
      </div>

      {/* -- Free daily pack -- */}
      {freePack && (
        <div className="bg-gradient-to-r from-orange/10 to-gold/10 border border-orange/30 rounded-2xl p-5 flex items-center gap-5">
          <div className="w-16 h-20 bg-gradient-to-b from-orange/30 to-card2 rounded-xl border-2 border-orange/50 flex items-center justify-center text-3xl shrink-0">
            📦
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange font-condensed text-xl font-black tracking-wide">FREE DAILY PACK</span>
              <span className="bg-orange text-bg text-[10px] font-black px-1.5 py-0.5 rounded">FREE</span>
            </div>
            <p className="text-t2 text-sm">{freePack.cardCount} stickers · Resets every 24h</p>
            <div className="flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3 text-gold" />
              <span className="text-gold text-xs font-bold">+{freePack.xpBonus || 50} XP bonus</span>
            </div>
          </div>
          <button
            onClick={() => startOpen(freePack)}
            className="bg-orange hover:bg-orange/90 text-white font-display font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            Open Free →
          </button>
        </div>
      )}

      {/* -- Store packs grid -- */}
      <div>
        <h2 className="font-display font-bold text-t1 text-lg mb-4">Pack Store</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {storePacks.map((pack) => {
            const v = PACK_VISUALS[pack.rarity] ?? PACK_VISUALS.COMMON;
            const isLimited  = !!pack.maxSupply;
            const isSoldOut  = isLimited && pack.soldCount >= (pack.maxSupply ?? 0);
            const remaining  = isLimited ? (pack.maxSupply ?? 0) - pack.soldCount : null;

            return (
              <div
                key={pack.id}
                className={cn(
                  "bg-card1 border rounded-2xl overflow-hidden transition-all duration-200",
                  !isSoldOut && "hover:scale-105 hover:shadow-lg cursor-pointer",
                  isSoldOut && "opacity-50 cursor-not-allowed"
                )}
                style={{ borderColor: isSoldOut ? "#252540" : v.glow + "60", boxShadow: !isSoldOut ? `0 0 20px ${v.glow}18` : undefined }}
                onClick={() => !isSoldOut && startOpen(pack)}
              >
                <div className={cn("h-36 bg-gradient-to-b flex items-center justify-center relative", v.gradient)}>
                  <div className="text-5xl" style={{ filter: `drop-shadow(0 0 12px ${v.glow})` }}>{v.emoji}</div>
                  {isLimited && (
                    <div className="absolute top-2 right-2 bg-bg/80 text-xs font-bold px-2 py-1 rounded-md" style={{ color: v.glow }}>
                      {isSoldOut ? "SOLD OUT" : `${remaining} left`}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: v.glow + "60" }} />
                </div>
                <div className="p-3">
                  <p className="font-display font-bold text-t1 text-sm mb-0.5">{pack.name}</p>
                  <p className="text-t3 text-xs mb-2 line-clamp-2">{pack.description ?? `${pack.cardCount} stickers inside`}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: v.glow }}>{v.label}</span>
                    {pack.priceUsd
                      ? <span className="text-t1 font-display font-bold text-sm">${Number(pack.priceUsd).toFixed(2)}</span>
                      : <span className="text-green font-bold text-sm">FREE</span>}
                  </div>
                  {pack.xpBonus > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Zap className="w-3 h-3 text-gold" />
                      <span className="text-gold text-[10px] font-bold">+{pack.xpBonus} XP bonus</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -- Recent opens -- */}
      {recentOpens.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-t1 text-lg mb-4">Recent Opens</h2>
          <div className="space-y-2">
            {recentOpens.map((open) => (
              <div key={open.id} className="bg-card1 border border-border rounded-xl px-4 py-3 flex items-center gap-4">
                <div className="text-xl">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="text-t1 text-sm font-semibold">{open.pack.name}</p>
                  <p className="text-t3 text-xs">
                    {(open.stickersWon ?? []).length} stickers · {new Date(open.openedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-gold" />
                  <span className="text-gold text-xs font-bold">+{open.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* ---------------- FIFA 26-STYLE PACK OPENING MODAL ------------------- */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {openingPack && vis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "radial-gradient(ellipse at center, #0d0d22 0%, #050509 100%)" }}
          >
            {/* -- Full-screen white flash on explosion -- */}
            <AnimatePresence>
              {flashOn && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 z-[60] pointer-events-none bg-white"
                />
              )}
            </AnimatePresence>

            {/* -- PRE-REVEAL: charging / idle -- */}
            {(phase === "idle" || phase === "charging" || phase === "explode") && (
              <div className="flex flex-col items-center gap-6 relative">

                {/* Ambient glow behind pack */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="absolute inset-0 rounded-full blur-[80px] pointer-events-none"
                  style={{ background: vis.glow, width: "300px", height: "300px", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ width: "340px", height: "400px" }}>
                  {particles.map((p) => (
                    <Particle key={p.id} color={vis.glow} delay={p.delay} x={p.x} />
                  ))}
                </div>

                {/* Pack art */}
                <motion.div
                  animate={
                    phase === "explode"
                      ? { scale: [1, 1.4, 0], opacity: [1, 1, 0], rotate: [0, 8, -8, 0] }
                      : phase === "charging"
                      ? { rotate: [-6, 6, -6, 6, 0], scale: [1, 1 + tapCount * 0.04, 1] }
                      : { y: [0, -12, 0] }
                  }
                  transition={{
                    duration: phase === "explode" ? 0.55 : phase === "charging" ? 0.25 : 2.5,
                    repeat: (phase === "idle") ? Infinity : 0,
                    type: phase === "explode" ? "tween" : "spring",
                  }}
                  onClick={handlePackTap}
                  className="relative flex items-center justify-center rounded-3xl cursor-pointer select-none"
                  style={{
                    width: "180px",
                    height: "240px",
                    background: `linear-gradient(145deg, ${vis.glow}35 0%, #0d0d1a 60%)`,
                    border: `2px solid ${vis.glow}80`,
                    boxShadow: `0 0 60px ${vis.glow}60, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                       style={{ background: `linear-gradient(90deg, #E8003D, #FF5E00, #FFB800, #E8003D)` }} />
                  {/* Pack emoji */}
                  <div className="text-7xl z-10 relative" style={{ filter: `drop-shadow(0 0 20px ${vis.glow})` }}>
                    {vis.emoji}
                  </div>
                  {/* Pack label */}
                  <div className="absolute bottom-5 left-0 right-0 text-center">
                    <p className="font-condensed font-black text-xl tracking-widest" style={{ color: vis.glow }}>
                      {vis.label}
                    </p>
                    <p className="text-[#aaaacc] text-xs mt-0.5">{openingPack.name}</p>
                  </div>
                  {/* Energy ring on tap */}
                  <AnimatePresence>
                    {phase === "charging" && (
                      <motion.div
                        key={tapCount}
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{ border: `3px solid ${vis.glow}` }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Charge indicator dots */}
                <div className="flex gap-3 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={tapCount > i
                        ? { scale: [1, 1.4, 1], backgroundColor: vis.glow }
                        : { backgroundColor: "#2a2a4a" }}
                      transition={{ duration: 0.3 }}
                      className="w-3 h-3 rounded-full"
                      style={{ boxShadow: tapCount > i ? `0 0 10px ${vis.glow}` : "none" }}
                    />
                  ))}
                </div>

                {phase !== "explode" && (
                  <div className="text-center">
                    <motion.p
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[#aaaacc] text-sm font-bold tracking-widest"
                    >
                      {tapCount === 0 ? "TAP THE PACK" : tapCount === 1 ? "AGAIN..." : "ONE MORE!"}
                    </motion.p>
                    <p className="text-[#555577] text-xs mt-1">{3 - tapCount} tap{3 - tapCount !== 1 ? "s" : ""} to open</p>
                  </div>
                )}
                {phase === "explode" && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white font-condensed text-2xl font-black tracking-widest"
                  >
                    OPENING...
                  </motion.p>
                )}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button onClick={() => setOpeningPack(null)} className="text-[#555577] text-xs hover:text-[#aaaacc] transition-colors mt-2">
                  Cancel
                </button>
              </div>
            )}

            {/* -- REVEAL PHASE -- */}
            {(phase === "reveal" || phase === "done") && openResult && (
              <div className="w-full max-w-2xl px-4 flex flex-col items-center gap-6">

                {/* Header */}
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <h2 className="font-condensed text-5xl font-black text-white tracking-wide drop-shadow-lg">
                    {openResult.levelUp ? "🎉 LEVEL UP!" : `YOU GOT ${openResult.stickers.length}!`}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-[#FFB800]" />
                    <span className="text-[#FFB800] font-black text-lg">+{openResult.xpEarned} XP</span>
                    {openResult.levelUp && (
                      <span className="bg-[#FFB800] text-black text-xs font-black px-2 py-0.5 rounded-full ml-1">
                        NEW LEVEL
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* LEGENDARY cinematic banner */}
                <AnimatePresence>
                  {[...revealedSet].some((i) => openResult.stickers[i]?.rarity === "LEGENDARY") && (
                    <motion.div
                      key="legendary-banner"
                      initial={{ opacity: 0, scale: 0.85, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      className="flex items-center gap-2 px-5 py-2 rounded-2xl border border-red/40 bg-red/10 backdrop-blur-sm"
                    >
                      <Star className="w-4 h-4 text-red fill-red animate-pulse" />
                      <span className="font-condensed font-black text-sm tracking-widest text-red uppercase">
                        Legendary Pull!
                      </span>
                      <Star className="w-4 h-4 text-red fill-red animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cards row */}
                <div className="flex flex-wrap justify-center gap-4">
                  {openResult.stickers.map((sticker, i) => (
                    <motion.div
                      key={sticker.id}
                      initial={{ y: 80, opacity: 0, scale: 0.7, rotateZ: i % 2 === 0 ? -8 : 8 }}
                      animate={{ y: 0, opacity: 1, scale: 1, rotateZ: 0 }}
                      transition={{ delay: 0.08 + i * 0.09, type: "spring", stiffness: 170, damping: 18 }}
                    >
                      <PremiumCard
                        sticker={{
                          ...sticker,
                          position: (sticker as { position?: string }).position ?? "?",
                          number: (sticker as { number?: number }).number ?? i + 1,
                          category: sticker.category ?? "player",
                          teamFlag: null,
                        }}
                        owned={true}
                        size="md"
                        flipMode={true}
                        revealed={revealedSet.has(i)}
                        onReveal={() => setRevealedSet((prev) => { const s = new Set(prev); s.add(i); return s; })}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: allRevealed ? 1 : 0.5, y: 0 }}
                  className="flex gap-3 flex-wrap justify-center"
                >
                  {!allRevealed && (
                    <button
                      onClick={revealAll}
                      className="px-6 py-3 rounded-xl font-display font-bold text-sm border transition-all"
                      style={{ borderColor: vis.glow, color: vis.glow, background: `${vis.glow}15` }}
                    >
                      Reveal All
                    </button>
                  )}
                  {allRevealed && openResult && (() => {
                    const best = [...openResult.stickers].sort((a, b) => {
                      const order = ["LEGENDARY","EPIC","RARE","UNCOMMON","COMMON"];
                      return order.indexOf(a.rarity) - order.indexOf(b.rarity);
                    })[0];
                    return (
                      <ShareButton
                        data={{
                          title: `Pack Opened on STAMPEDE! ${openResult.stickers.length} stickers`,
                          text: `Just opened a ${openingPack?.name ?? "pack"} on STAMPEDE and pulled a ${rarityLabel(best.rarity)} ${best.name}! ⚽🔥`,
                          hashtags: ["WorldCup2026", "STAMPEDE", "PackOpening"],
                        }}
                        className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-[#1a1a2e] border-[#3a3a5c] text-white hover:border-orange hover:text-orange"
                      >
                        Share Pulls 🔗
                      </ShareButton>
                    );
                  })()}
                  <button
                    onClick={() => setOpeningPack(null)}
                    className="bg-[#1a1a2e] border border-[#3a3a5c] text-white font-display font-bold px-6 py-3 rounded-xl hover:border-[#6a6a8c] transition-colors"
                  >
                    Add to Album
                  </button>
                  <button
                    onClick={() => {
                      // Fully close the modal and reset all state
                      // so the user picks a new pack from the store grid
                      setOpeningPack(null);
                      setPhase("idle");
                      setTapCount(0);
                      setOpenResult(null);
                      setRevealedSet(new Set());
                      setError(null);
                      setFlashOn(false);
                      apiPromiseRef.current = null;
                    }}
                    className="font-display font-bold px-6 py-3 rounded-xl text-black transition-all"
                    style={{ background: `linear-gradient(135deg, ${vis.glow}, #FF5E00)` }}
                  >
                    Open Another 🔥
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}