"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, LayoutList, Lock, ChevronDown, ChevronUp, Star } from "lucide-react";
import { ShareButton } from "@/components/shared/ShareModal";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles } from "@/lib/sticker-frame";
import { cn, rarityColor, rarityLabel } from "@/lib/utils";
import { PremiumCardShell, type CardRarity } from "@/components/shared/PremiumCardShell";
import { useLanguage } from "@/contexts/LanguageContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlbumSticker {
  id: string;
  name: string;
  playerName: string | null;
  team: string;
  category: string;
  rarity: string;
  imageUrl: string;
  owned: boolean;
  quantity: number;
  isCustom: boolean;
  customImageUrl: string | null;
}

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
    <div className="max-w-7xl mx-auto space-y-5 pb-10">

      {/* ---- HEADER ---- */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0d22 0%, #1a0a2e 45%, #0a1a0d 100%)",
          border: "1px solid rgba(232,101,10,0.2)",
        }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 opacity-15 pointer-events-none"
             style={{ background: "radial-gradient(circle, #E8650A 0%, transparent 70%)" }} />

        <div className="relative z-10 flex items-center gap-6 flex-wrap">
          {/* Progress ring */}
          <div className="relative shrink-0">
            <ProgressRing pct={pct} size={96} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-condensed text-2xl font-black text-white">{pct}%</span>
              <span className="text-[9px] text-[#8888AA] font-bold uppercase tracking-wider">done</span>
            </div>
          </div>

          {/* Title & counts */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-[#E8650A] uppercase tracking-[0.2em]">FANPACK 26</span>
            </div>
            <h1 className="font-condensed text-4xl font-black text-white tracking-tight">{t("album.title")}</h1>
            <p className="text-[#8888AA] text-sm mt-0.5">
              <span className="text-white font-bold">{totalOwned}</span>
              <span> / {totalStickers} {t("album.stickers")}</span>
            </p>

            {/* Per-rarity pills */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {rarityStats.map(({ rarity, owned, total }) => {
                const meta = RARITY_META[rarity];
                return (
                  <button
                    key={rarity}
                    onClick={() => setActiveRarity(activeRarity === rarity ? "ALL" : rarity)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      borderColor: activeRarity === rarity ? meta.color : "rgba(255,255,255,0.08)",
                      background: activeRarity === rarity ? meta.pill : "rgba(255,255,255,0.04)",
                      color: meta.color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
                    {meta.label} {owned}/{total}
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP / share actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="text-right">
              <p className="text-xs text-[#8888AA]">{t("album.xpBonus")}</p>
              <p className="font-condensed font-black text-[#E8650A] text-lg">+{pct * 10} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- FILTERS ---- */}
      <div className="space-y-3">
        {/* Search + view toggles */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
            <input
              type="text"
              placeholder={t("album.searchStickers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card1 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange"
            />
          </div>

          {/* Owned/Missing/All */}
          <div className="flex items-center bg-card1 border border-border rounded-xl p-1 gap-0.5 shrink-0">
            {(["all","owned","missing"] as const).map((v) => (
              <button key={v} onClick={() => setShowOwned(v)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize",
                  showOwned === v ? "bg-card2 text-t1" : "text-t3 hover:text-t1")}>
                {v === "all" ? t("common.all") : v === "owned" ? t("common.owned") : t("common.missing")}
              </button>
            ))}
          </div>

          {/* Grid/List */}
          <div className="flex items-center bg-card1 border border-border rounded-xl p-1 gap-0.5 shrink-0">
            <button onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-colors", viewMode==="grid" ? "bg-card2 text-t1" : "text-t3 hover:text-t1")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg transition-colors", viewMode==="list" ? "bg-card2 text-t1" : "text-t3 hover:text-t1")}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Group by team toggle */}
          <button
            onClick={() => setGroupByTeam((v) => !v)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all",
              groupByTeam
                ? "border-[#E8650A] text-[#E8650A] bg-[#E8650A12]"
                : "border-border text-t3 bg-card1 hover:text-t1"
            )}
          >
            🏳️ {t("album.groupByTeam")}
          </button>
        </div>

        {/* Rarity filter row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveRarity("ALL")}
            className={cn("shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
              activeRarity === "ALL" ? "text-white border-transparent" : "bg-card1 border-border text-t3 hover:text-t1")}
            style={activeRarity === "ALL" ? { background: "#E8650A" } : {}}
          >
            {t("album.allRarities")}
          </button>
          {RARITY_ORDER.map((r) => {
            const meta = RARITY_META[r];
            const active = activeRarity === r;
            return (
              <button key={r} onClick={() => setActiveRarity(active ? "ALL" : r)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={{
                  borderColor: active ? meta.color : "rgba(255,255,255,0.08)",
                  background: active ? meta.color : "transparent",
                  color: active ? "#fff" : meta.color,
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {meta.label}
                <span className="opacity-60 text-[10px]">{meta.tier}</span>
              </button>
            );
          })}
        </div>

        {/* Team filter row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button onClick={() => setActiveTeam("ALL")}
            className={cn("shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap",
              activeTeam === "ALL" ? "text-white border-transparent" : "bg-card1 border-border text-t2 hover:text-t1")}
            style={activeTeam === "ALL" ? { background: "#E8650A" } : {}}>
            {t("album.allTeams")}
          </button>
          {teams.map((team) => (
            <button key={team} onClick={() => setActiveTeam(activeTeam === team ? "ALL" : team)}
              className={cn("shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap",
                activeTeam === team ? "text-white border-transparent" : "bg-card1 border-border text-t2 hover:text-t1")}
              style={activeTeam === team ? { background: "#E8650A" } : {}}>
              <span>{FLAG[team] ?? "🏳️"}</span>
              <span>{team}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Result count ---- */}
      <p className="text-t3 text-xs px-0.5">
        {t("album.showingStickers", { n: filtered.length })}
        {activeTeam !== "ALL" && <> · <span className="text-[#E8650A]">{FLAG[activeTeam]} {activeTeam}</span></>}
        {activeRarity !== "ALL" && <> · <span style={{ color: RARITY_META[activeRarity]?.color }}>{RARITY_META[activeRarity]?.label}</span></>}
      </p>

      {/* ---- GRID VIEW ---- */}
      {viewMode === "grid" && (
        teamGroups
          ? teamGroups.map(([team, teamStickers]) => (
              <TeamSection key={team} team={team} stickers={teamStickers}
                onSelect={setSelectedSticker} />
            ))
          : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {filtered.length === 0
                ? <EmptyState className="col-span-full" />
                : filtered.map((s) => (
                    <FifaCard key={s.id} sticker={s} onClick={() => setSelectedSticker(s)} />
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
      {selectedSticker && (
        <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
      )}
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
  const [collapsed, setCollapsed] = useState(false);
  const owned = stickers.filter((s) => s.owned).length;

  return (
    <div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center gap-3 mb-3 group"
      >
        <span className="text-xl">{FLAG[team] ?? "🏳️"}</span>
        <span className="font-condensed font-black text-t1 text-lg tracking-wide">{team}</span>
        <span className="text-t3 text-xs">{owned}/{stickers.length} collected</span>
        <div className="flex-1 h-px bg-border ml-1" />
        <div className="w-1 h-8 rounded-full mx-1" style={{ background: owned === stickers.length ? "#00D97E" : "#E8650A30" }} />
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-t3 group-hover:text-t1" />
          : <ChevronUp className="w-4 h-4 text-t3 group-hover:text-t1" />}
      </button>

      {!collapsed && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 mb-6">
          {stickers.map((s) => (
            <FifaCard key={s.id} sticker={s} onClick={() => onSelect(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FIFA 26-style card
// ---------------------------------------------------------------------------

function FifaCard({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const meta   = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color  = rarityColor(sticker.rarity);
  const frame  = getStickerFrameStyles(sticker.team, color, sticker.category);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? (sticker.playerName ?? sticker.name) : "",
    sticker.category,
    sticker.owned ? (sticker.customImageUrl ?? sticker.imageUrl) : null,
  );
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const catBadge = CAT_BADGE[sticker.category] ?? "PLY";

  if (!sticker.owned) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer group rounded-xl overflow-hidden"
        style={{ aspectRatio: "3/4.2" }}
      >
        <div
          className="w-full h-full rounded-xl flex flex-col relative overflow-hidden border border-white/5"
          style={{ background: "linear-gradient(160deg, #111120 0%, #080810 100%)" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-1.5 pt-1.5 pb-1 z-10 shrink-0">
            <span className="text-[8px] font-black text-white/20 tracking-widest">{catBadge}</span>
            <span className="text-[8px] font-black text-white/20">{sticker.team}</span>
          </div>

          {/* Center: lock */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <Lock className="w-5 h-5 text-white/15" />
            <span className="text-[9px] font-black text-white/15 tracking-widest">?</span>
          </div>

          {/* Bottom strip */}
          <div className="px-1.5 pb-1.5 pt-1 border-t border-white/5 shrink-0">
            <p className="text-[9px] font-black text-white/20 truncate">{sticker.name}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PremiumCardShell
      rarity={sticker.rarity as CardRarity}
      glowColor={color}
      className="cursor-pointer rounded-xl"
      onClick={onClick}
      style={{ aspectRatio: "3/4.2" }}
    >
      {/* Outer gradient border */}
      <div className="w-full h-full rounded-xl p-[2px]" style={frame.shell}>
        <div
          className="w-full h-full rounded-[10px] flex flex-col overflow-hidden relative"
          style={{ background: meta.bg }}
        >
          {/* Top badges row */}
          <div className="flex items-center justify-between px-1.5 pt-1.5 pb-0.5 z-10 shrink-0">
            <span
              className="text-[8px] font-black tracking-widest px-1 py-0.5 rounded"
              style={{ background: `${color}25`, color }}
            >
              {catBadge}
            </span>
            <span className="text-[8px] font-black text-white/60">{sticker.team}</span>
          </div>

          {/* Flag bar */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] z-20" style={frame.flagBar} />

          {/* Photo area */}
          <div className="flex-1 relative overflow-hidden">
            {showPhoto ? (
              <img
                src={photoUrl!} alt={sticker.name}
                className="w-full h-full object-cover object-top"
                onLoad={() => setLoaded(true)} onError={() => setError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="text-xl">{FLAG[sticker.team] ?? "⚽"}</div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px]"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: `1.5px solid ${color}60` }}
                >
                  {initials}
                </div>
              </div>
            )}

            {/* Gradient overlay at bottom of photo */}
            <div
              className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${meta.bg.match(/#[0-9a-f]{6}/gi)?.[1] ?? "#080810"} 0%, transparent 100%)` }}
            />
          </div>

          {/* Bottom info strip */}
          <div
            className="px-1.5 pb-1.5 pt-1 shrink-0 border-t"
            style={{ borderColor: `${color}20` }}
          >
            <p className="text-[10px] font-black text-white truncate leading-tight">{sticker.name}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[9px] font-bold" style={{ color }}>{meta.tier}</p>
              {sticker.quantity > 1 && (
                <span
                  className="text-[8px] font-black px-1 py-0.5 rounded"
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
          {meta.label}
        </span>
        {sticker.owned
          ? sticker.quantity > 1 && <span className="text-[10px] text-t3 font-semibold">x{sticker.quantity}</span>
          : <span className="text-[10px] text-t3 flex items-center gap-0.5"><Lock className="w-3 h-3" /> Missing</span>
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
  const meta    = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color   = rarityColor(sticker.rarity);
  const frame   = getStickerFrameStyles(sticker.team, color, sticker.category);
  const catBadge = CAT_BADGE[sticker.category] ?? "PLY";
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl,
  );
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 bg-bg/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-card1 rounded-t-3xl sm:rounded-2xl overflow-hidden border"
        style={{ borderColor: `${color}40` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle (mobile) */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 sm:hidden" />

        {/* Card preview header */}
        <div
          className="relative px-6 pt-6 pb-4 flex items-start gap-5"
          style={{ background: `linear-gradient(135deg, ${meta.bg.match(/#[0-9a-f]{6}/gi)?.[0] ?? "#1a1a2e"} 0%, #080810 100%)` }}
        >
          {/* Big card preview */}
          <PremiumCardShell
            rarity={sticker.rarity as CardRarity}
            glowColor={color}
            className="rounded-xl shrink-0"
            style={{ width: 110, height: 154 }}
          >
            <div className="w-full h-full rounded-xl p-[2px]" style={frame.shell}>
              <div className="w-full h-full rounded-[10px] overflow-hidden relative flex flex-col"
                   style={{ background: meta.bg }}>
                {/* Badges */}
                <div className="flex items-center justify-between px-1.5 pt-1.5 pb-0.5 shrink-0 z-10">
                  <span className="text-[8px] font-black px-1 py-0.5 rounded"
                    style={{ background: `${color}25`, color }}>{catBadge}</span>
                  <span className="text-[8px] font-black text-white/60">{sticker.team}</span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={frame.flagBar} />

                {/* Photo */}
                <div className="flex-1 relative overflow-hidden">
                  {sticker.owned ? (
                    showPhoto
                      ? <img src={photoUrl!} alt={sticker.name} className="w-full h-full object-cover object-top"
                             onLoad={() => setLoaded(true)} onError={() => setError(true)} />
                      : <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <div className="text-2xl">{FLAG[sticker.team] ?? "⚽"}</div>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                               style={{ background: "rgba(0,0,0,0.5)", color: "#fff", border: `2px solid ${color}60` }}>
                            {initials}
                          </div>
                        </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <Lock className="w-6 h-6 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Name strip */}
                <div className="px-1.5 pb-1.5 pt-1 shrink-0 border-t" style={{ borderColor: `${color}20` }}>
                  <p className="text-[9px] font-black text-white truncate">{sticker.name}</p>
                  <p className="text-[8px] font-bold" style={{ color }}>{meta.tier}</p>
                </div>
              </div>
            </div>
          </PremiumCardShell>

          {/* Info next to card */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color }}>{meta.label}</p>
            <h2 className="font-condensed text-2xl font-black text-white leading-tight mb-1">{sticker.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{FLAG[sticker.team] ?? "⚽"}</span>
              <span className="text-sm font-bold text-[#8888AA]">{sticker.team}</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Category", value: sticker.category },
                { label: t("common.owned"),   value: sticker.owned ? t("album.inCollection") : t("album.notOwned") },
                { label: "Quantity", value: sticker.owned ? `x${sticker.quantity}` : "—" },
                { label: "Tier",     value: meta.tier },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 rounded-lg px-2.5 py-2">
                  <p className="text-[10px] text-[#8888AA] mb-0.5">{label}</p>
                  <p className="text-xs font-bold text-white capitalize">{value}</p>
                </div>
              ))}
            </div>

            {sticker.isCustom && (
              <div className="mt-2 flex items-center gap-1.5 text-[#E8650A] text-xs font-bold">
                <Star className="w-3 h-3" /> Custom card
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 p-4">
          {sticker.owned && (
            <ShareButton
              data={{
                title: `${sticker.name} — ${meta.label}`,
                text: `Just collected a ${meta.label} ${sticker.name} on FANPACK 26! ⚽`,
                hashtags: ["WorldCup2026", "FANPACK26", "FanAlbum"],
              }}
              className="flex-1 justify-center py-2.5 rounded-xl text-sm font-bold"
            >
              {t("album.share")}
            </ShareButton>
          )}
          {sticker.owned && sticker.quantity > 1 && (
            <button className="flex-1 bg-card2 border border-border text-t1 rounded-xl py-2.5 text-sm font-bold hover:border-[#00D97E] hover:text-[#00D97E] transition-colors">
              {t("album.trade")}
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 bg-card2 border border-border text-t2 rounded-xl py-2.5 text-sm font-bold hover:text-t1 transition-colors">
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
