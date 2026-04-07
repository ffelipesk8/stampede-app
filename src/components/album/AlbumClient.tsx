"use client";

import { useState, useMemo } from "react";
import { cn, rarityColor, rarityLabel } from "@/lib/utils";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import { useStickerImage } from "@/hooks/useStickerImage";
import { ShareButton } from "@/components/shared/ShareModal";

type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

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

const RARITY_OPTIONS = ["ALL", "COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

const TEAM_FLAGS: Record<string, string> = {
  ARG: "🇦🇷", BRA: "🇧🇷", FRA: "🇫🇷", ESP: "🇪🇸", DEU: "🇩🇪", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  MEX: "🇲🇽", USA: "🇺🇸", POR: "🇵🇹", NLD: "🇳🇱", BEL: "🇧🇪", ITA: "🇮🇹",
  URY: "🇺🇾", COL: "🇨🇴", MAR: "🇲🇦", JPN: "🇯🇵", KOR: "🇰🇷", SEN: "🇸🇳",
  AUS: "🇦🇺", CAN: "🇨🇦", CHE: "🇨🇭", HRV: "🇭🇷", DNK: "🇩🇰", ECU: "🇪🇨",
  QAT: "🇶🇦", SAU: "🇸🇦", IRN: "🇮🇷", NGA: "🇳🇬", EGY: "🇪🇬", GHA: "🇬🇭",
  CMR: "🇨🇲", CIV: "🇨🇮", TUN: "🇹🇳", CRI: "🇨🇷", PAN: "🇵🇦",
  stadium: "🏟️", trophy: "🏆", moment: "⚡",
};

const TEAM_COLORS: Record<string, [string, string]> = {
  ARG: ["#74ACDF", "#FFFFFF"], BRA: ["#009C3B", "#FFDF00"], FRA: ["#002395", "#ED2939"],
  ESP: ["#AA151B", "#F1BF00"], DEU: ["#000000", "#DD0000"], ENG: ["#CF081F", "#FFFFFF"],
  MEX: ["#006847", "#CE1126"], USA: ["#002868", "#BF0A30"], POR: ["#006600", "#FF0000"],
  NLD: ["#FF6600", "#003DA5"], ITA: ["#003399", "#009246"], BEL: ["#000000", "#EF3340"],
  HRV: ["#FF0000", "#FFFFFF"], URY: ["#FFFFFF", "#75AADB"], COL: ["#FCD116", "#003087"],
  CHE: ["#FF0000", "#FFFFFF"], SEN: ["#00853F", "#FDEF42"], MAR: ["#C1272D", "#006233"],
  JPN: ["#FFFFFF", "#BC002D"], KOR: ["#FFFFFF", "#CD2E3A"], AUS: ["#00843D", "#FFCD00"],
};

export function AlbumClient({ stickers, teams, totalOwned, totalStickers }: AlbumClientProps) {
  const [activeTeam, setActiveTeam] = useState("ALL");
  const [activeRarity, setActiveRarity] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showOwned, setShowOwned] = useState<"all" | "owned" | "missing">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSticker, setSelectedSticker] = useState<AlbumSticker | null>(null);

  const progressPct = totalStickers > 0 ? Math.round((totalOwned / totalStickers) * 100) : 0;

  const filtered = useMemo(() => {
    return stickers.filter((s) => {
      if (activeTeam !== "ALL" && s.team !== activeTeam) return false;
      if (activeRarity !== "ALL" && s.rarity !== activeRarity) return false;
      if (showOwned === "owned" && !s.owned) return false;
      if (showOwned === "missing" && s.owned) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stickers, activeTeam, activeRarity, showOwned, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-condensed text-4xl font-black text-t1 tracking-wide">My Album</h1>
          <p className="text-t2 text-sm mt-1">
            {totalOwned} / {totalStickers} stickers · {progressPct}% complete
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card1 border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-md transition-colors", viewMode === "grid" ? "bg-card2 text-t1" : "text-t3 hover:text-t1")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 rounded-md transition-colors", viewMode === "list" ? "bg-card2 text-t1" : "text-t3 hover:text-t1")}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="bg-card1 border border-border rounded-xl p-4">
        <div className="flex justify-between text-xs text-t3 mb-2">
          <span>Album Progress</span>
          <span className="font-bold text-gold">{progressPct}%</span>
        </div>
        <div className="h-3 bg-card2 rounded-full overflow-hidden">
          <div className="h-full xp-bar-fill rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          {["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"].map((r) => {
            const count = stickers.filter((s) => s.rarity === r && s.owned).length;
            return (
              <div key={r} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: rarityColor(r) }} />
                <span className="text-t3 text-xs">{count} {r.charAt(0) + r.slice(1).toLowerCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
          <input
            type="text"
            placeholder="Search stickers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card1 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-t1 placeholder:text-t3 focus:outline-none focus:border-orange transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-card1 border border-border rounded-lg p-1">
          {(["all", "owned", "missing"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setShowOwned(v)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize",
                showOwned === v ? "bg-card2 text-t1" : "text-t3 hover:text-t1"
              )}
            >
              {v === "all" ? "All" : v === "owned" ? "Owned" : "Missing"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rarity tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {RARITY_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRarity(r)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
              activeRarity === r ? "text-bg" : "bg-transparent text-t3 border-border hover:text-t1"
            )}
            style={activeRarity === r
              ? { background: r === "ALL" ? "#FF5E00" : rarityColor(r), borderColor: "transparent" }
              : {}}
          >
            {r === "ALL" ? "All Rarities" : rarityLabel(r)}
          </button>
        ))}
      </div>

      {/* ── Team scroll ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTeam("ALL")}
          className={cn(
            "shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap",
            activeTeam === "ALL" ? "bg-orange text-white border-orange" : "bg-card1 border-border text-t2 hover:text-t1"
          )}
        >
          🌍 All Teams
        </button>
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => setActiveTeam(team)}
            className={cn(
              "shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap",
              activeTeam === team ? "bg-orange text-white border-orange" : "bg-card1 border-border text-t2 hover:text-t1"
            )}
          >
            {TEAM_FLAGS[team] ?? "🏳️"} {team}
          </button>
        ))}
      </div>

      <p className="text-t3 text-xs">
        Showing {filtered.length} stickers
        {activeTeam !== "ALL" && ` · Team: ${activeTeam}`}
        {activeRarity !== "ALL" && ` · Rarity: ${rarityLabel(activeRarity)}`}
      </p>

      {/* ── Sticker grid ── */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filtered.map((sticker) => (
            <StickerSlot key={sticker.id} sticker={sticker} onClick={() => setSelectedSticker(sticker)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-t3">
              <p className="text-4xl mb-3">🎴</p>
              <p className="font-display font-semibold">No stickers match your filters</p>
              <p className="text-sm mt-1">Try changing the team or rarity filter</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((sticker) => (
            <StickerListRow key={sticker.id} sticker={sticker} onClick={() => setSelectedSticker(sticker)} />
          ))}
        </div>
      )}

      {selectedSticker && (
        <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
      )}
    </div>
  );
}

// ── Sticker slot (grid) ────────────────────────────────────────────────────────
function StickerSlot({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const color = rarityColor(sticker.rarity);
  const fallback = sticker.customImageUrl ?? sticker.imageUrl;
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? sticker.playerName ?? sticker.name : "",
    sticker.category,
    sticker.owned ? fallback : null
  );
  const [bg1, bg2] = TEAM_COLORS[sticker.team] ?? ["#1C1C32", "#252540"];
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 hover:scale-105",
        sticker.owned ? "hover:shadow-lg" : "opacity-40 grayscale"
      )}
      style={{
        borderColor: sticker.owned ? color : "#252540",
        boxShadow: sticker.owned && sticker.rarity === "LEGENDARY" ? `0 0 14px ${color}50` : undefined,
      }}
    >
      <div className="aspect-[3/4] relative overflow-hidden"
           style={{ background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)` }}>
        {/* Rarity top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: color }} />

        {sticker.owned ? (
          <>
            {showPhoto ? (
              <img
                src={photoUrl!}
                alt={sticker.name}
                className="w-full h-full object-cover object-top"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="text-2xl">{TEAM_FLAGS[sticker.team] ?? "⚽"}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
                     style={{ background: "rgba(0,0,0,0.45)", color: "#fff", border: `2px solid ${color}80` }}>
                  {initials}
                </div>
              </div>
            )}
            {/* Team badge */}
            <div className="absolute bottom-0 left-0 right-0 h-5 flex items-center justify-between px-1.5 z-10"
                 style={{ background: "rgba(0,0,0,0.65)" }}>
              <span className="text-[8px] font-black text-white tracking-widest">{sticker.team}</span>
              <span className="text-[9px]">{TEAM_FLAGS[sticker.team] ?? ""}</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">❓</span>
          </div>
        )}

        {sticker.quantity > 1 && (
          <div className="absolute top-1.5 right-1.5 bg-bg/80 text-[9px] font-black text-t1 rounded px-1 z-20">
            ×{sticker.quantity}
          </div>
        )}
      </div>

      <div className="px-1.5 py-1 bg-card1">
        <p className="text-[10px] font-semibold text-t1 truncate leading-tight">{sticker.name}</p>
        <p className="text-[9px]" style={{ color }}>{rarityLabel(sticker.rarity)}</p>
      </div>
    </div>
  );
}

// ── Sticker list row ───────────────────────────────────────────────────────────
function StickerListRow({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const color = rarityColor(sticker.rarity);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? sticker.playerName ?? sticker.name : "",
    sticker.category,
    sticker.owned ? (sticker.customImageUrl ?? sticker.imageUrl) : null
  );
  const [bg1, bg2] = TEAM_COLORS[sticker.team] ?? ["#1C1C32", "#252540"];
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 bg-card1 border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-t3 transition-colors",
        !sticker.owned && "opacity-50"
      )}
    >
      <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 border-2 relative"
           style={{ borderColor: color, background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)` }}>
        {sticker.owned ? (
          showPhoto ? (
            <img src={photoUrl!} alt={sticker.name} className="w-full h-full object-cover object-top"
                 onLoad={() => setLoaded(true)} onError={() => setError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-base">{TEAM_FLAGS[sticker.team] ?? "⚽"}</span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">❓</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-t1 font-semibold text-sm">{sticker.name}</p>
        <p className="text-t3 text-xs">{TEAM_FLAGS[sticker.team] ?? ""} {sticker.team} · {sticker.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold" style={{ color }}>{rarityLabel(sticker.rarity)}</p>
        {sticker.owned && <p className="text-t3 text-xs">×{sticker.quantity}</p>}
        {!sticker.owned && <p className="text-t3 text-xs">Missing</p>}
      </div>
    </div>
  );
}

// ── Sticker detail modal ───────────────────────────────────────────────────────
function StickerModal({ sticker, onClose }: { sticker: AlbumSticker; onClose: () => void }) {
  const color = rarityColor(sticker.rarity);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl
  );
  const [bg1, bg2] = TEAM_COLORS[sticker.team] ?? ["#1C1C32", "#252540"];
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card1 border-2 rounded-2xl p-6 max-w-sm w-full"
        style={{ borderColor: color, boxShadow: `0 0 40px ${color}30` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card image */}
        <div className="w-40 h-52 mx-auto rounded-xl overflow-hidden mb-4 border-2 relative"
             style={{ borderColor: color, background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)` }}>
          {/* Rarity bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: color }} />

          {sticker.owned ? (
            showPhoto ? (
              <img src={photoUrl!} alt={sticker.name}
                   className="w-full h-full object-cover object-top"
                   onLoad={() => setLoaded(true)} onError={() => setError(true)} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="text-4xl">{TEAM_FLAGS[sticker.team] ?? "⚽"}</div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl"
                     style={{ background: "rgba(0,0,0,0.4)", color: "#fff", border: `2px solid ${color}80` }}>
                  {initials}
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">❓</span>
              <span className="text-t3 text-xs">Not collected yet</span>
            </div>
          )}

          {/* Team badge bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-7 flex items-center justify-between px-2 z-10"
               style={{ background: "rgba(0,0,0,0.7)" }}>
            <span className="text-[10px] font-black text-white tracking-widest">{sticker.team}</span>
            <span className="text-sm">{TEAM_FLAGS[sticker.team] ?? ""}</span>
          </div>
        </div>

        <h2 className="font-condensed text-2xl font-black text-t1 text-center mb-0.5">{sticker.name}</h2>
        <p className="text-center text-sm font-bold mb-4" style={{ color }}>{rarityLabel(sticker.rarity)}</p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-t3">Team</span>
            <span className="text-t1">{TEAM_FLAGS[sticker.team] ?? ""} {sticker.team}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-t3">Category</span>
            <span className="text-t1 capitalize">{sticker.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-t3">In collection</span>
            <span className="text-t1">{sticker.owned ? `×${sticker.quantity}` : "Not owned"}</span>
          </div>
          {sticker.isCustom && (
            <div className="flex justify-between">
              <span className="text-t3">Type</span>
              <span className="text-orange font-bold">Custom UGC</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-2 flex-wrap">
          {sticker.owned && (
            <ShareButton
              data={{
                title: `${sticker.name} — ${rarityLabel(sticker.rarity)}`,
                text: `I just got a ${rarityLabel(sticker.rarity)} ${sticker.name} sticker on STAMPEDE! ⚽🔥 #WorldCup2026 #STAMPEDE`,
                hashtags: ["WorldCup2026", "STAMPEDE", "FanAlbum"],
              }}
              className="flex-1 justify-center py-2"
            >
              Share
            </ShareButton>
          )}
          {sticker.quantity > 1 && (
            <button className="flex-1 bg-card2 border border-border text-t1 rounded-lg py-2 text-sm font-semibold hover:border-green transition-colors">
              List on Market
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 bg-card2 border border-border text-t2 rounded-lg py-2 text-sm font-semibold hover:text-t1 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
