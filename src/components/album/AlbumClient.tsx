"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, LayoutList, Lock, ChevronDown, ChevronUp, Star } from "lucide-react";
import { AlbumStickerModal } from "@/components/album/AlbumStickerModal";
import { ShareButton } from "@/components/shared/ShareModal";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles, getTeamPalette } from "@/lib/sticker-frame";
import { cn, rarityColor, rarityLabel } from "@/lib/utils";
import { PremiumCardShell, type CardRarity } from "@/components/shared/PremiumCardShell";
import { useLanguage } from "@/contexts/LanguageContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlbumSticker {
  id: string;
  number: number;
  name: string;
  playerName: string | null;
  team: string;
  teamFlag: string;
  category: string;
  position: string;
  rarity: string;
  imageUrl: string;
  owned: boolean;
  quantity: number;
  isCustom: boolean;
  customImageUrl: string | null;
}

// Position display names (Panini-style label)
const POSITION_LABEL: Record<string, string> = {
  GK: "PORTERO",  CB: "DEFENSA",  LB: "DEFENSA",  RB: "DEFENSA",
  CM: "VOLANTE",  CDM:"VOLANTE",  CAM:"VOLANTE",   LM: "VOLANTE",  RM: "VOLANTE",
  ST: "DELANT.",  CF: "DELANT.",  LW: "DELANT.",   RW: "DELANT.",
  COACH: "D.T.",  "?": "PLY",
};

interface AlbumClientProps {
  stickers: AlbumSticker[];
  teams: string[];
  totalOwned: number;
  totalStickers: number;
}

// ---------------------------------------------------------------------------
// Rarity system (FIFA-inspired card gradient per tier)
// ---------------------------------------------------------------------------

const RARITY_ORDER = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"] as const;

const RARITY_META: Record<string, {
  label: string; color: string; bg: string;
  pill: string; shine: string; tier: string;
}> = {
  COMMON:    { label: "Common",    color: "#9090B8", bg: "linear-gradient(160deg,#1C1C30 0%,#12121E 100%)", pill: "#9090B818", shine: "#9090B828", tier: "Bronze" },
  UNCOMMON:  { label: "Uncommon",  color: "#4A6FFF", bg: "linear-gradient(160deg,#0E1828 0%,#07101A 100%)", pill: "#4A6FFF18", shine: "#4A6FFF28", tier: "Silver" },
  RARE:      { label: "Rare",      color: "#00D97E", bg: "linear-gradient(160deg,#082818 0%,#040E09 100%)", pill: "#00D97E18", shine: "#00D97E28", tier: "Gold" },
  EPIC:      { label: "Epic",      color: "#FFB800", bg: "linear-gradient(160deg,#1A1000 0%,#0A0800 100%)", pill: "#FFB80018", shine: "#FFB80028", tier: "Rare" },
  LEGENDARY: { label: "Legendary", color: "#E8003D", bg: "linear-gradient(160deg,#1E0008 0%,#0A0004 100%)", pill: "#E8003D18", shine: "#E8003D28", tier: "TOTW" },
};

// ---------------------------------------------------------------------------
// Flag emojis & category badges
// ---------------------------------------------------------------------------

const FLAG: Record<string, string> = {
  ARG:"🇦🇷", AUS:"🇦🇺", BEL:"🇧🇪", BRA:"🇧🇷", CAN:"🇨🇦", CHE:"🇨🇭",
  CMR:"🇨🇲", COL:"🇨🇴", CRI:"🇨🇷", DEU:"🇩🇪", DNK:"🇩🇰", ECU:"🇪🇨",
  EGY:"🇪🇬", ENG:"🏴", ESP:"🇪🇸", FRA:"🇫🇷", GHA:"🇬🇭", HRV:"🇭🇷",
  IRN:"🇮🇷", ITA:"🇮🇹", JPN:"🇯🇵", KOR:"🇰🇷", MAR:"🇲🇦", MEX:"🇲🇽",
  NGA:"🇳🇬", NLD:"🇳🇱", PAN:"🇵🇦", POR:"🇵🇹", QAT:"🇶🇦", SAU:"🇸🇦",
  SEN:"🇸🇳", USA:"🇺🇸", URY:"🇺🇾",
};

const CAT_BADGE: Record<string, string> = {
  player: "PLY", coach: "COA", crest: "CRS",
  city: "CTY", stadium: "STD", trophy: "TRO", moment: "MOM",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ProgressRing({ pct, size = 96 }: { pct: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke="url(#pgGrad)" strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <defs>
        <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8650A" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const RARITY_KEYS: Record<string, "rarity.common"|"rarity.uncommon"|"rarity.rare"|"rarity.epic"|"rarity.legendary"> = {
  COMMON: "rarity.common",
  UNCOMMON: "rarity.uncommon",
  RARE: "rarity.rare",
  EPIC: "rarity.epic",
  LEGENDARY: "rarity.legendary",
};

export function AlbumClient({ stickers, teams, totalOwned, totalStickers }: AlbumClientProps) {
  const { t } = useLanguage();
  const [activeTeam,    setActiveTeam]    = useState("ALL");
  const [activeRarity,  setActiveRarity]  = useState("ALL");
  const [search,        setSearch]        = useState("");
  const [showOwned,     setShowOwned]     = useState<"all"|"owned"|"missing">("all");
  const [viewMode,      setViewMode]      = useState<"grid"|"list">("grid");
  const [groupByTeam,   setGroupByTeam]   = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<AlbumSticker | null>(null);

  const pct = totalStickers > 0 ? Math.round((totalOwned / totalStickers) * 100) : 0;

  const filtered = useMemo(() => stickers.filter((s) => {
    if (activeTeam !== "ALL" && s.team !== activeTeam) return false;
    if (activeRarity !== "ALL" && s.rarity !== activeRarity) return false;
    if (showOwned === "owned" && !s.owned) return false;
    if (showOwned === "missing" && s.owned) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [stickers, activeTeam, activeRarity, showOwned, search]);

  const rarityStats = useMemo(() =>
    RARITY_ORDER.map((r) => ({
      rarity: r,
      owned: stickers.filter((s) => s.rarity === r && s.owned).length,
      total: stickers.filter((s) => s.rarity === r).length,
    })), [stickers]);

  // Group by team
  const teamGroups = useMemo(() => {
    if (!groupByTeam) return null;
    const groups: Record<string, AlbumSticker[]> = {};
    for (const s of filtered) {
      if (!groups[s.team]) groups[s.team] = [];
      groups[s.team].push(s);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupByTeam]);

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16 relative">

      {/* ====== CINEMATIC HEADER ====== */}
      <div
        className="rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #07070f 0%, #0e0520 40%, #050d0a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: 220,
        }}
      >
        {/* ── Layer 1: stadium floodlight orbs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-20"
               style={{ background: "radial-gradient(circle, #E8650A 0%, transparent 60%)" }} />
          <div className="absolute -bottom-20 right-0 w-80 h-80 rounded-full opacity-12"
               style={{ background: "radial-gradient(circle, #FF5E00 0%, transparent 55%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 opacity-8"
               style={{ background: "radial-gradient(ellipse, #4A6FFF 0%, transparent 65%)" }} />
        </div>

        {/* ── Layer 2: subtle hex / grid overlay ── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{
               backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
               backgroundSize: "40px 40px",
             }} />

        {/* ── Layer 3: animated shimmer across full header ── */}
        <motion.div
          animate={{ x: ["-60%", "120%"] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-0 w-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.025), transparent)" }}
        />

        {/* ── Faded watermark ball ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[140px] leading-none pointer-events-none select-none opacity-[0.04]">
          ⚽
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 p-7 flex items-center gap-8 flex-wrap">

          {/* Big progress ring */}
          <div className="relative shrink-0">
            <ProgressRing pct={pct} size={120} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-condensed text-3xl font-black text-white leading-none">{pct}%</span>
              <span className="text-[9px] text-[#E8650A] font-black uppercase tracking-[0.18em] mt-0.5">
                {t("album.complete")}
              </span>
            </div>
            {/* Glow behind the ring */}
            <div className="absolute inset-0 rounded-full -z-10 blur-xl opacity-30"
                 style={{ background: "#E8650A" }} />
          </div>

          {/* Title & counters */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(232,101,10,0.15)", color: "#E8650A", border: "1px solid rgba(232,101,10,0.3)" }}
              >
                FANPACK 26
              </span>
            </div>
            <h1 className="font-condensed text-5xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              {t("album.title")}
            </h1>

            {/* Big collector count */}
            <p className="mt-2 text-sm" style={{ color: "#8888AA" }}>
              <span className="text-white font-bold text-base">{totalOwned}</span>
              <span className="mx-1 text-white/20">/</span>
              <span>{totalStickers} {t("album.stickers")}</span>
            </p>

            {/* Rarity breakdown pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {rarityStats.map(({ rarity, owned, total }) => {
                const meta = RARITY_META[rarity];
                const pctR = total > 0 ? Math.round((owned / total) * 100) : 0;
                return (
                  <button
                    key={rarity}
                    onClick={() => setActiveRarity(activeRarity === rarity ? "ALL" : rarity)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      border: `1px solid ${activeRarity === rarity ? meta.color : meta.color + "28"}`,
                      background: activeRarity === rarity ? `${meta.color}20` : "rgba(255,255,255,0.03)",
                      color: meta.color,
                      boxShadow: activeRarity === rarity ? `0 0 12px ${meta.color}30` : "none",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                    <span>{t(RARITY_KEYS[rarity] ?? "rarity.common")}</span>
                    <span className="opacity-60">{owned}/{total}</span>
                    {pctR === 100 && <span className="text-[9px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP Bonus card */}
          <div
            className="shrink-0 flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-2xl"
            style={{
              background: "rgba(232,101,10,0.08)",
              border: "1px solid rgba(232,101,10,0.2)",
            }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8888AA]">{t("album.xpBonus")}</span>
            <span className="font-condensed font-black text-2xl text-[#E8650A]">+{pct * 10}</span>
            <span className="text-[10px] font-bold text-[#E8650A]">XP</span>
          </div>
        </div>
      </div>

      {/* ====== FILTERS (glassmorphism panel) ====== */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Row 1: Search + view controls */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
            <input
              type="text"
              placeholder={t("album.searchStickers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(232,101,10,0.6)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Owned/Missing/All toggle */}
          <div
            className="flex items-center rounded-xl p-1 gap-0.5 shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {(["all","owned","missing"] as const).map((v) => (
              <button key={v} onClick={() => setShowOwned(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: showOwned === v ? "rgba(232,101,10,0.2)" : "transparent",
                  color: showOwned === v ? "#E8650A" : "rgba(255,255,255,0.4)",
                  border: showOwned === v ? "1px solid rgba(232,101,10,0.3)" : "1px solid transparent",
                }}
              >
                {v === "all" ? t("common.all") : v === "owned" ? t("common.owned") : t("common.missing")}
              </button>
            ))}
          </div>

          {/* Grid/List */}
          <div
            className="flex items-center rounded-xl p-1 gap-0.5 shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button onClick={() => setViewMode("grid")}
              className="p-2 rounded-lg transition-all"
              style={{
                background: viewMode === "grid" ? "rgba(232,101,10,0.2)" : "transparent",
                color: viewMode === "grid" ? "#E8650A" : "rgba(255,255,255,0.35)",
              }}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className="p-2 rounded-lg transition-all"
              style={{
                background: viewMode === "list" ? "rgba(232,101,10,0.2)" : "transparent",
                color: viewMode === "list" ? "#E8650A" : "rgba(255,255,255,0.35)",
              }}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Group by team */}
          <button
            onClick={() => setGroupByTeam((v) => !v)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: groupByTeam ? "rgba(232,101,10,0.15)" : "rgba(255,255,255,0.04)",
              border: groupByTeam ? "1px solid rgba(232,101,10,0.4)" : "1px solid rgba(255,255,255,0.07)",
              color: groupByTeam ? "#E8650A" : "rgba(255,255,255,0.4)",
            }}
          >
            🏳️ {t("album.groupByTeam")}
          </button>
        </div>

        {/* Row 2: Rarity filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
          <button
            onClick={() => setActiveRarity("ALL")}
            className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              background: activeRarity === "ALL" ? "linear-gradient(90deg,#E8650A,#FF5E00)" : "rgba(255,255,255,0.05)",
              color: activeRarity === "ALL" ? "#fff" : "rgba(255,255,255,0.4)",
              border: "1px solid transparent",
              boxShadow: activeRarity === "ALL" ? "0 0 14px rgba(232,101,10,0.4)" : "none",
            }}
          >
            {t("album.allRarities")}
          </button>
          {RARITY_ORDER.map((r) => {
            const meta = RARITY_META[r];
            const active = activeRarity === r;
            return (
              <button key={r} onClick={() => setActiveRarity(active ? "ALL" : r)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: active ? `${meta.color}22` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? meta.color + "80" : "rgba(255,255,255,0.07)"}`,
                  color: active ? meta.color : meta.color + "88",
                  boxShadow: active ? `0 0 12px ${meta.color}30` : "none",
                }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                {t(RARITY_KEYS[r] ?? "rarity.common")}
                {active && <span className="opacity-50 text-[9px]">{meta.tier}</span>}
              </button>
            );
          })}
        </div>

        {/* Row 3: Team filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          <button onClick={() => setActiveTeam("ALL")}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap"
            style={{
              background: activeTeam === "ALL" ? "linear-gradient(90deg,#E8650A,#FF5E00)" : "rgba(255,255,255,0.04)",
              color: activeTeam === "ALL" ? "#fff" : "rgba(255,255,255,0.35)",
              border: "1px solid transparent",
              boxShadow: activeTeam === "ALL" ? "0 0 10px rgba(232,101,10,0.35)" : "none",
            }}>
            {t("album.allTeams")}
          </button>
          {teams.map((team) => (
            <button key={team} onClick={() => setActiveTeam(activeTeam === team ? "ALL" : team)}
              className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap"
              style={{
                background: activeTeam === team ? "rgba(232,101,10,0.18)" : "rgba(255,255,255,0.04)",
                border: activeTeam === team ? "1px solid rgba(232,101,10,0.45)" : "1px solid rgba(255,255,255,0.07)",
                color: activeTeam === team ? "#E8650A" : "rgba(255,255,255,0.35)",
              }}>
              <span>{FLAG[team] ?? "🏳️"}</span>
              <span>{team}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Result count ---- */}
      <p className="text-xs px-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
        {t("album.showingStickers", { n: filtered.length })}
        {activeTeam !== "ALL" && <> · <span style={{ color: "#E8650A" }}>{FLAG[activeTeam]} {activeTeam}</span></>}
        {activeRarity !== "ALL" && <> · <span style={{ color: RARITY_META[activeRarity]?.color }}>{t(RARITY_KEYS[activeRarity] ?? "rarity.common")}</span></>}
      </p>

      {/* ---- GRID VIEW ---- */}
      {viewMode === "grid" && (
        teamGroups
          ? teamGroups.map(([team, teamStickers]) => (
              <TeamSection key={team} team={team} stickers={teamStickers}
                onSelect={setSelectedSticker} />
            ))
          : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.length === 0
                ? <EmptyState className="col-span-full" />
                : filtered.map((s) => (
                    <FifaCard
                      key={s.id}
                      sticker={s}
                      onClick={() => setSelectedSticker(s)}
                    />
                  ))}
            </div>
          )
      )}

      {/* ---- LIST VIEW ---- */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {filtered.length === 0
            ? <EmptyState />
            : filtered.map((s) => (
                <ListRow key={s.id} sticker={s} onClick={() => setSelectedSticker(s)} />
              ))}
        </div>
      )}

      {/* ---- Detail Modal ---- */}
      <AnimatePresence>
        {selectedSticker && (
          <AlbumStickerModal
            key={selectedSticker.id}
            sticker={selectedSticker}
            onClose={() => setSelectedSticker(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Team section group
// ---------------------------------------------------------------------------

function TeamSection({ team, stickers, onSelect }: {
  team: string;
  stickers: AlbumSticker[];
  onSelect: (s: AlbumSticker) => void;
}) {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const owned = stickers.filter((s) => s.owned).length;
  const pctTeam = stickers.length > 0 ? Math.round((owned / stickers.length) * 100) : 0;
  const complete = owned === stickers.length;
  const [teamPrimary, teamSecondary] = getTeamPalette(team);

  return (
    <div
      className="rounded-2xl mb-5"
      style={{
        background: "linear-gradient(180deg, #0d0d1e 0%, #070710 100%)",
        border: "1px solid rgba(255,255,255,0.055)",
        boxShadow: "0 6px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        /* overflow:clip clips to border-radius WITHOUT creating a new stacking
           context — essential to avoid flattening PremiumCardShell's preserve-3d */
        overflow: "clip",
      }}
    >
      {/* Team colour accent bar — use borderRadius on this to match parent corners */}
      <div
        style={{
          height: 3,
          borderRadius: "12px 12px 0 0",
          background: `linear-gradient(90deg, ${teamPrimary}ee 0%, ${teamSecondary}88 50%, transparent 100%)`,
        }}
      />

      {/* Section header */}
      <div className="px-5 pt-4 pb-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center gap-3 group"
        >
          <span className="text-2xl leading-none">{FLAG[team] ?? "🏳️"}</span>
          <span className="font-condensed font-black text-white text-xl tracking-wide group-hover:text-[#E8650A] transition-colors">
            {team}
          </span>
          {/* Progress bar */}
          <div
            className="flex-1 relative h-1.5 rounded-full overflow-hidden mx-2"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${pctTeam}%`,
                background: complete
                  ? "linear-gradient(90deg,#00D97E,#00FF94)"
                  : "linear-gradient(90deg,#E8650A,#FF5E00)",
                boxShadow: complete ? "0 0 8px #00D97E80" : "0 0 6px #E8650A60",
              }}
            />
          </div>
          {/* Count badge */}
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: complete ? "rgba(0,217,126,0.12)" : "rgba(232,101,10,0.10)",
              color: complete ? "#00D97E" : "#E8650A",
              border: `1px solid ${complete ? "rgba(0,217,126,0.25)" : "rgba(232,101,10,0.2)"}`,
            }}
          >
            {owned}/{stickers.length}
          </span>
          {collapsed
            ? <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.28)" }} />
            : <ChevronUp   className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.28)" }} />}
        </button>
      </div>

      {/* Album page grid */}
      {!collapsed && (
        <div
          className="px-4 pb-5 pt-1"
          style={{
            background: `radial-gradient(ellipse 90% 40% at 50% -10%, ${teamPrimary}10 0%, transparent 60%)`,
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stickers.map((s) => (
              <FifaCard key={s.id} sticker={s} onClick={() => onSelect(s)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FIFA 26-style card
// ---------------------------------------------------------------------------

function FifaCard({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const meta     = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color    = rarityColor(sticker.rarity);
  const frame    = getStickerFrameStyles(sticker.team, color, sticker.category);
  const posLabel = POSITION_LABEL[sticker.position] ?? sticker.position;
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? (sticker.playerName ?? sticker.name) : "",
    sticker.category,
    sticker.owned ? (sticker.customImageUrl ?? sticker.imageUrl) : null,
  );
  const initials  = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const flagEmoji = sticker.teamFlag || FLAG[sticker.team] || "⚽";

  // ---- MISSING / LOCKED card — Panini die-cut slot -------------------------
  if (!sticker.owned) {
    const [slotPrimary] = getTeamPalette(sticker.team);
    return (
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        onClick={onClick}
        className="cursor-pointer"
        style={{ aspectRatio: "3/4.2" }}
      >
        <div
          className="w-full h-full rounded-xl flex flex-col relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0e0e1d 0%, #070710 100%)",
            border: `1.5px dashed ${slotPrimary}38`,
            boxShadow: `inset 0 2px 8px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.02)`,
          }}
        >
          {/* Ambient team colour glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 90% 55% at 50% 25%, ${slotPrimary}10 0%, transparent 65%)`,
            }}
          />

          {/* Top row: WC26 badge + sticker number */}
          <div className="flex items-start justify-between px-2 pt-2 pb-0.5 z-10 shrink-0">
            <span
              className="text-[6px] font-black px-1 py-0.5 rounded leading-none"
              style={{
                background: "rgba(255,255,255,0.035)",
                color: "rgba(255,255,255,0.16)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                letterSpacing: "0.06em",
              }}
            >
              WC26
            </span>
            <p
              className="font-condensed font-black leading-none"
              style={{
                fontSize: "clamp(13px,3.2cqw,20px)",
                color: `${slotPrimary}45`,
                textShadow: `0 0 14px ${slotPrimary}25`,
              }}
            >
              {sticker.number}
            </p>
          </div>

          {/* Center: ghost flag + lock */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 relative z-10">
            <span
              className="select-none pointer-events-none"
              style={{ fontSize: "clamp(24px,6cqw,40px)", opacity: 0.07, filter: "grayscale(1)" }}
            >
              {flagEmoji}
            </span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: `1.5px solid ${slotPrimary}2e`,
                boxShadow: `0 0 12px ${slotPrimary}12`,
              }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: `${slotPrimary}55` }} />
            </div>
          </div>

          {/* Bottom name strip */}
          <div
            className="px-2 pb-1.5 pt-1 z-10 shrink-0 text-center"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.035)",
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.38))",
            }}
          >
            <p
              className="font-condensed font-black truncate uppercase leading-tight"
              style={{
                fontSize: "clamp(7px,1.9cqw,10px)",
                color: "rgba(255,255,255,0.17)",
                letterSpacing: "0.06em",
              }}
            >
              {sticker.name}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ---- OWNED / COLLECTED card -----------------------------------------------
  // Build the Panini-style holographic background using team primary color
  const holo1 = frame.primary;
  const holo2 = frame.secondary;

  return (
    <PremiumCardShell
      rarity={sticker.rarity as CardRarity}
      glowColor={color}
      className="cursor-pointer rounded-xl"
      onClick={onClick}
      style={{ aspectRatio: "3/4.2" }}
    >
      {/* Outer border shell (team flag gradient) */}
      <div className="w-full h-full rounded-xl p-[2.5px]" style={frame.shell}>
        <div
          className="w-full h-full rounded-[9px] flex flex-col overflow-hidden relative"
          style={{
            background: [
              /* Panini-style: translucent holographic overlay on team-colored bg */
              `radial-gradient(ellipse 120% 60% at 50% 0%, ${holo1}55 0%, transparent 55%)`,
              `radial-gradient(ellipse 80% 50% at 80% 100%, ${holo2}35 0%, transparent 50%)`,
              meta.bg,
            ].join(", "),
          }}
        >
          {/* === FLAG BAR (top, like Panini) === */}
          <div className="w-full h-[5px] shrink-0 z-20" style={frame.flagBar} />

          {/* === TOP ROW: left info + right position/number === */}
          <div className="flex items-start justify-between px-2 pt-1.5 pb-0.5 z-10 shrink-0">

            {/* Left: ✓ + team code */}
            <div className="flex flex-col gap-0.5">
              {/* FIFA-style checkmark + year */}
              <div className="flex items-center gap-1">
                <span
                  className="text-[7px] font-black px-1 py-0.5 rounded leading-none"
                  style={{ background: `${color}30`, color, border: `0.5px solid ${color}50` }}
                >
                  WC26
                </span>
              </div>
              <p className="text-[8px] font-black text-white/70 tracking-wider">{sticker.team}</p>
            </div>

            {/* Right: position label + big number (Panini style) */}
            <div className="text-right flex flex-col items-end">
              <p
                className="text-[7px] font-black uppercase tracking-widest leading-none mb-0.5"
                style={{ color: `${color}CC` }}
              >
                {posLabel}
              </p>
              <p
                className="font-condensed text-2xl font-black leading-none"
                style={{ color: "#fff", textShadow: `0 0 8px ${color}80` }}
              >
                {sticker.number}
              </p>
            </div>
          </div>

          {/* === PHOTO AREA === */}
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
                <div className="text-2xl">{flagEmoji}</div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px]"
                  style={{ background: "rgba(0,0,0,0.55)", color: "#fff", border: `2px solid ${color}70` }}
                >
                  {initials}
                </div>
              </div>
            )}

            {/* Bottom gradient fade into name strip */}
            <div
              className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${meta.bg.match(/#[0-9a-f]{6}/gi)?.[1] ?? "#080810"} 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* === BOTTOM NAME STRIP (Panini style) === */}
          <div
            className="shrink-0 px-2 pb-2 pt-1"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.75) 100%)`,
              borderTop: `1.5px solid ${color}25`,
            }}
          >
            {/* Player name big + flag right (like the card) */}
            <div className="flex items-end justify-between gap-1">
              <p
                className="font-condensed font-black text-white leading-tight truncate uppercase"
                style={{ fontSize: "clamp(9px, 2.8cqw, 13px)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                {sticker.name}
              </p>
              <span className="text-sm shrink-0 leading-none mb-0.5">{flagEmoji}</span>
            </div>

            {/* Tier badge + duplicate count */}
            <div className="flex items-center justify-between mt-0.5">
              <span
                className="text-[8px] font-black leading-none"
                style={{ color }}
              >
                {meta.tier}
              </span>
              {sticker.quantity > 1 && (
                <span
                  className="text-[7px] font-black px-1 py-0.5 rounded"
                  style={{ background: `${color}25`, color }}
                >
                  x{sticker.quantity}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PremiumCardShell>
  );
}

// ---------------------------------------------------------------------------
// List row
// ---------------------------------------------------------------------------

function ListRow({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const { t } = useLanguage();
  const meta  = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color = rarityColor(sticker.rarity);
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? (sticker.playerName ?? sticker.name) : "",
    sticker.category,
    sticker.owned ? (sticker.customImageUrl ?? sticker.imageUrl) : null,
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all border group",
        sticker.owned
          ? "bg-card1 border-border hover:border-t3"
          : "bg-card1/50 border-border/40 opacity-50 hover:opacity-70"
      )}
    >
      {/* Mini card */}
      <div className="w-9 h-[52px] rounded-lg overflow-hidden shrink-0 p-[1.5px]"
           style={sticker.owned ? frame.shell : { background: "#222230" }}>
        <div className="w-full h-full rounded-[7px] overflow-hidden relative"
             style={sticker.owned ? frame.imagePanel : { background: "#111120" }}>
          {sticker.owned && showPhoto
            ? <img src={photoUrl!} alt={sticker.name} className="w-full h-full object-cover object-top"
                   onLoad={() => setLoaded(true)} onError={() => setError(true)} />
            : <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm">{sticker.owned ? (FLAG[sticker.team] ?? "⚽") : "?"}</span>
              </div>
          }
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-t1 font-bold text-sm truncate group-hover:text-[#E8650A] transition-colors">
          {sticker.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-t3 text-xs">{FLAG[sticker.team] ?? ""} {sticker.team}</span>
          <span className="text-t3 text-[10px]">·</span>
          <span className="text-t3 text-xs capitalize">{sticker.category}</span>
        </div>
      </div>

      {/* Rarity + qty */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1">
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: meta.pill, color: meta.color, border: `1px solid ${meta.color}30` }}
        >
          {t(RARITY_KEYS[sticker.rarity] ?? "rarity.common")}
        </span>
        {sticker.owned
          ? sticker.quantity > 1 && <span className="text-[10px] text-t3 font-semibold">x{sticker.quantity}</span>
          : <span className="text-[10px] text-t3 flex items-center gap-0.5"><Lock className="w-3 h-3" /> {t("common.missing")}</span>
        }
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={cn("text-center py-16 bg-card1 border border-dashed border-border rounded-2xl", className)}>
      <p className="text-5xl mb-3">🔍</p>
      <p className="font-display font-bold text-t1">{t("album.noMatch")}</p>
      <p className="text-t3 text-sm mt-1">{t("album.noMatchHint")}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticker Modal (FIFA-style)
// ---------------------------------------------------------------------------

function StickerModal({ sticker, onClose }: { sticker: AlbumSticker; onClose: () => void }) {
  const { t } = useLanguage();
  const meta      = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color     = rarityColor(sticker.rarity);
  const frame     = getStickerFrameStyles(sticker.team, color, sticker.category);
  const posLabel  = POSITION_LABEL[sticker.position] ?? sticker.position;
  const flagEmoji = sticker.teamFlag || FLAG[sticker.team] || "⚽";
  const initials  = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl,
  );

  const rarityKey = RARITY_KEYS[sticker.rarity] ?? "rarity.common";

  return (
    /* Backdrop — visible immediately, no opacity animation to avoid "black screen" */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(4,4,10,0.88)" }}
      onClick={onClose}
    >
      {/* Rarity ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color}20 0%, transparent 65%)` }}
      />

      {/* Card panel — only position+scale animate, opacity stays at 1 so it's always visible */}
      <motion.div
        initial={{ y: 48, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 48, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl relative z-10"
        style={{
          background: "linear-gradient(160deg, #0e0e1c 0%, #080810 100%)",
          border: `1px solid ${color}35`,
          boxShadow: `0 0 60px ${color}28, 0 24px 64px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div
          className="w-10 h-1 rounded-full mx-auto mt-3 mb-0 sm:hidden"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />

        {/* ── TOP SECTION: cinematic card display ── */}
        <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
          {/* Background: rarity-tinted multi-layer */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 100% 80% at 50% 0%, ${color}22 0%, transparent 60%)`,
                `radial-gradient(ellipse 60% 40% at 20% 100%, ${frame.primary}18 0%, transparent 50%)`,
                "linear-gradient(160deg, #0d0d1e 0%, #060609 100%)",
              ].join(", "),
            }}
          />
          {/* Diagonal shimmer */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="absolute inset-y-0 w-1/2 pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${color}08, transparent)` }}
          />

          <div className="relative z-10 px-6 pt-7 pb-6 flex gap-6 items-start">

            {/* ── CARD: direct render, NO PremiumCardShell wrapper ── */}
            <div
              className="shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 130,
                height: 182,
                /* Panini iridescent outer shell */
                ...frame.shell,
                borderRadius: "12px",
                padding: "2.5px",
                boxShadow: `0 0 24px ${color}50, 0 8px 32px rgba(0,0,0,0.7), ${frame.shell.boxShadow ?? ""}`,
              }}
            >
              <div
                className="w-full h-full rounded-[9px] flex flex-col overflow-hidden"
                style={{
                  background: [
                    `radial-gradient(ellipse 120% 60% at 50% 0%, ${frame.primary}55 0%, transparent 55%)`,
                    `radial-gradient(ellipse 80% 50% at 80% 100%, ${frame.secondary}30 0%, transparent 50%)`,
                    meta.bg,
                  ].join(", "),
                }}
              >
                {/* Flag bar */}
                <div className="shrink-0" style={frame.flagBar} />

                {/* Top row */}
                <div className="flex items-start justify-between px-2 pt-1.5 pb-0 shrink-0">
                  <div>
                    <span
                      className="font-black px-1 py-0.5 rounded leading-none block"
                      style={{ fontSize: 8, background: `${color}30`, color }}
                    >WC26</span>
                    <span className="font-black text-white/60 mt-0.5 block" style={{ fontSize: 8 }}>{sticker.team}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-black leading-none mb-0.5" style={{ fontSize: 7, color: `${color}CC` }}>{posLabel}</p>
                    <p className="font-condensed font-black leading-none text-white" style={{ fontSize: 26 }}>{sticker.number}</p>
                  </div>
                </div>

                {/* Photo */}
                <div className="flex-1 relative overflow-hidden" style={frame.imagePanel}>
                  {sticker.owned ? (
                    showPhoto
                      ? <img src={photoUrl!} alt={sticker.name}
                             className="w-full h-full object-cover object-top"
                             onLoad={() => setLoaded(true)} onError={() => setError(true)} />
                      : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <div style={{ fontSize: 28 }}>{flagEmoji}</div>
                          <div
                            className="rounded-full flex items-center justify-center font-black"
                            style={{ width: 36, height: 36, fontSize: 13, background: "rgba(0,0,0,0.5)", color: "#fff", border: `2px solid ${color}60` }}
                          >{initials}</div>
                        </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div style={{ fontSize: 32, opacity: 0.15 }}>{flagEmoji}</div>
                      <Lock className="w-7 h-7" style={{ color: `${color}50` }} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                       style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }} />
                </div>

                {/* Name strip */}
                <div className="px-2 pb-2 pt-1 shrink-0" style={{ borderTop: `1.5px solid ${color}20` }}>
                  <div className="flex items-end justify-between gap-0.5">
                    <p className="font-condensed font-black text-white truncate uppercase leading-tight flex-1" style={{ fontSize: 10 }}>
                      {sticker.name}
                    </p>
                    <span style={{ fontSize: 12 }}>{flagEmoji}</span>
                  </div>
                  <p className="font-black leading-none mt-0.5" style={{ fontSize: 8, color }}>{meta.tier}</p>
                </div>
              </div>
            </div>

            {/* ── INFO PANEL ── */}
            <div className="flex-1 min-w-0 pt-1">
              {/* Rarity badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{t(rarityKey)}</span>
              </div>

              <h2 className="font-condensed text-2xl font-black text-white leading-tight">
                {sticker.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <span style={{ fontSize: 16 }}>{flagEmoji}</span>
                <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>{sticker.team}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Posición", value: posLabel },
                  { label: "# Carta",  value: `#${sticker.number}` },
                  { label: "Estado",   value: sticker.owned ? `x${sticker.quantity}` : "—" },
                  { label: "Tier",     value: meta.tier },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
                    <p className="text-xs font-black text-white">{value}</p>
                  </div>
                ))}
              </div>

              {/* Owned / Missing badge */}
              <div className="mt-3">
                {sticker.owned ? (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black"
                    style={{ background: "rgba(0,217,126,0.1)", border: "1px solid rgba(0,217,126,0.25)", color: "#00D97E" }}
                  >
                    ✓ {t("album.inCollection")}
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                  >
                    <Lock className="w-3 h-3" /> {t("album.notOwned")}
                  </div>
                )}
              </div>

              {sticker.isCustom && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold" style={{ color: "#E8650A" }}>
                  <Star className="w-3 h-3" /> Custom
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex gap-2 p-4 pt-3">
          {sticker.owned && (
            <ShareButton
              data={{
                title: `${sticker.name} — ${t(rarityKey)}`,
                text: `Just collected a ${t(rarityKey)} ${sticker.name} on FANPACK 26! ⚽`,
                hashtags: ["WorldCup2026", "FANPACK26", "FanAlbum"],
              }}
              className="flex-1 justify-center py-2.5 rounded-xl text-sm font-bold"
            >
              {t("album.share")}
            </ShareButton>
          )}
          {sticker.owned && sticker.quantity > 1 && (
            <button
              className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
              style={{
                background: "rgba(0,217,126,0.08)",
                border: "1px solid rgba(0,217,126,0.2)",
                color: "#00D97E",
              }}
            >
              {t("album.trade")}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {t("common.close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
