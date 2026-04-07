"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import { ShareButton } from "@/components/shared/ShareModal";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles } from "@/lib/sticker-frame";
import { cn, rarityColor, rarityLabel } from "@/lib/utils";

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
  ARG: "AR",
  AUS: "AU",
  BEL: "BE",
  BRA: "BR",
  CAN: "CA",
  CHE: "CH",
  CMR: "CM",
  COL: "CO",
  CRI: "CR",
  DEU: "DE",
  DNK: "DK",
  ECU: "EC",
  EGY: "EG",
  ENG: "EN",
  ESP: "ES",
  FRA: "FR",
  GHA: "GH",
  HRV: "HR",
  IRN: "IR",
  ITA: "IT",
  JPN: "JP",
  KOR: "KR",
  MAR: "MA",
  MEX: "MX",
  NGA: "NG",
  NLD: "NL",
  PAN: "PA",
  POR: "PT",
  QAT: "QA",
  SAU: "SA",
  SEN: "SN",
  USA: "US",
  URY: "UY",
  stadium: "ST",
  trophy: "TR",
  moment: "MO",
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
    return stickers.filter((sticker) => {
      if (activeTeam !== "ALL" && sticker.team !== activeTeam) return false;
      if (activeRarity !== "ALL" && sticker.rarity !== activeRarity) return false;
      if (showOwned === "owned" && !sticker.owned) return false;
      if (showOwned === "missing" && sticker.owned) return false;
      if (search && !sticker.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stickers, activeTeam, activeRarity, showOwned, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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

      <div className="bg-card1 border border-border rounded-xl p-4">
        <div className="flex justify-between text-xs text-t3 mb-2">
          <span>Album Progress</span>
          <span className="font-bold text-gold">{progressPct}%</span>
        </div>
        <div className="h-3 bg-card2 rounded-full overflow-hidden">
          <div className="h-full xp-bar-fill rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          {["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"].map((rarity) => {
            const count = stickers.filter((sticker) => sticker.rarity === rarity && sticker.owned).length;
            return (
              <div key={rarity} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: rarityColor(rarity) }} />
                <span className="text-t3 text-xs">{count} {rarityLabel(rarity)}</span>
              </div>
            );
          })}
        </div>
      </div>

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
          {(["all", "owned", "missing"] as const).map((value) => (
            <button
              key={value}
              onClick={() => setShowOwned(value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize",
                showOwned === value ? "bg-card2 text-t1" : "text-t3 hover:text-t1"
              )}
            >
              {value === "all" ? "All" : value === "owned" ? "Owned" : "Missing"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {RARITY_OPTIONS.map((rarity) => (
          <button
            key={rarity}
            onClick={() => setActiveRarity(rarity)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
              activeRarity === rarity ? "text-bg" : "bg-transparent text-t3 border-border hover:text-t1"
            )}
            style={
              activeRarity === rarity
                ? { background: rarity === "ALL" ? "#FF5E00" : rarityColor(rarity), borderColor: "transparent" }
                : {}
            }
          >
            {rarity === "ALL" ? "All Rarities" : rarityLabel(rarity)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTeam("ALL")}
          className={cn(
            "shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap",
            activeTeam === "ALL" ? "bg-orange text-white border-orange" : "bg-card1 border-border text-t2 hover:text-t1"
          )}
        >
          ALL Teams
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
            {TEAM_FLAGS[team] ?? "??"} {team}
          </button>
        ))}
      </div>

      <p className="text-t3 text-xs">
        Showing {filtered.length} stickers
        {activeTeam !== "ALL" && ` · Team: ${activeTeam}`}
        {activeRarity !== "ALL" && ` · Rarity: ${rarityLabel(activeRarity)}`}
      </p>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filtered.map((sticker) => (
            <StickerSlot key={sticker.id} sticker={sticker} onClick={() => setSelectedSticker(sticker)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-t3">
              <p className="text-4xl mb-3">No results</p>
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

function StickerSlot({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const color = rarityColor(sticker.rarity);
  const fallback = sticker.customImageUrl ?? sticker.imageUrl;
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? sticker.playerName ?? sticker.name : "",
    sticker.category,
    sticker.owned ? fallback : null
  );
  const initials = sticker.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 p-[2px] hover:scale-105",
        sticker.owned ? "hover:shadow-lg" : "opacity-40 grayscale"
      )}
      style={sticker.owned ? frame.shell : { background: "#252540" }}
    >
      <div className="rounded-[10px] overflow-hidden bg-card1">
        <div className="aspect-[3/4] relative overflow-hidden" style={frame.imagePanel}>
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
                  <div className="text-2xl">{TEAM_FLAGS[sticker.team] ?? "??"}</div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
                    style={{ ...frame.ring, color: "#fff", borderWidth: 2, borderStyle: "solid" }}
                  >
                    {initials}
                  </div>
                </div>
              )}

              <div
                className="absolute bottom-0 left-0 right-0 h-5 flex items-center justify-between px-1.5 z-10"
                style={frame.footer}
              >
                <span className="text-[8px] font-black text-white tracking-widest">{sticker.team}</span>
                <span className="text-[9px]">{TEAM_FLAGS[sticker.team] ?? ""}</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">?</span>
            </div>
          )}

          {sticker.quantity > 1 && (
            <div className="absolute top-1.5 right-1.5 bg-bg/80 text-[9px] font-black text-t1 rounded px-1 z-20">
              x{sticker.quantity}
            </div>
          )}
        </div>

        <div className="px-1.5 py-1 bg-card1">
          <p className="text-[10px] font-semibold text-t1 truncate leading-tight">{sticker.name}</p>
          <p className="text-[9px]" style={{ color }}>{rarityLabel(sticker.rarity)}</p>
        </div>
      </div>
    </div>
  );
}

function StickerListRow({ sticker, onClick }: { sticker: AlbumSticker; onClick: () => void }) {
  const color = rarityColor(sticker.rarity);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.owned ? sticker.playerName ?? sticker.name : "",
    sticker.category,
    sticker.owned ? (sticker.customImageUrl ?? sticker.imageUrl) : null
  );
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 bg-card1 border border-border rounded-xl px-4 py-3 cursor-pointer hover:border-t3 transition-colors",
        !sticker.owned && "opacity-50"
      )}
    >
      <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 p-[2px]" style={frame.shell}>
        <div className="w-full h-full rounded-[6px] overflow-hidden relative" style={frame.imagePanel}>
          {sticker.owned ? (
            showPhoto ? (
              <img
                src={photoUrl!}
                alt={sticker.name}
                className="w-full h-full object-cover object-top"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-base">{TEAM_FLAGS[sticker.team] ?? "??"}</span>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">?</div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-t1 font-semibold text-sm">{sticker.name}</p>
        <p className="text-t3 text-xs">{TEAM_FLAGS[sticker.team] ?? ""} {sticker.team} · {sticker.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold" style={{ color }}>{rarityLabel(sticker.rarity)}</p>
        {sticker.owned && <p className="text-t3 text-xs">x{sticker.quantity}</p>}
        {!sticker.owned && <p className="text-t3 text-xs">Missing</p>}
      </div>
    </div>
  );
}

function StickerModal({ sticker, onClose }: { sticker: AlbumSticker; onClose: () => void }) {
  const color = rarityColor(sticker.rarity);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl
  );
  const initials = sticker.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card1 border-2 rounded-2xl p-6 max-w-sm w-full"
        style={{ borderColor: color, boxShadow: `0 0 40px ${color}30` }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-40 h-52 mx-auto rounded-xl overflow-hidden mb-4 p-[2px]" style={frame.shell}>
          <div className="w-full h-full rounded-[10px] overflow-hidden relative" style={frame.imagePanel}>
            <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: color }} />

            {sticker.owned ? (
              showPhoto ? (
                <img
                  src={photoUrl!}
                  alt={sticker.name}
                  className="w-full h-full object-cover object-top"
                  onLoad={() => setLoaded(true)}
                  onError={() => setError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl">{TEAM_FLAGS[sticker.team] ?? "??"}</div>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl"
                    style={{ ...frame.ring, color: "#fff", borderWidth: 2, borderStyle: "solid" }}
                  >
                    {initials}
                  </div>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-5xl">?</span>
                <span className="text-t3 text-xs">Not collected yet</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-7 flex items-center justify-between px-2 z-10" style={frame.footer}>
              <span className="text-[10px] font-black text-white tracking-widest">{sticker.team}</span>
              <span className="text-sm">{TEAM_FLAGS[sticker.team] ?? ""}</span>
            </div>
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
            <span className="text-t1">{sticker.owned ? `x${sticker.quantity}` : "Not owned"}</span>
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
                title: `${sticker.name} - ${rarityLabel(sticker.rarity)}`,
                text: `I just got a ${rarityLabel(sticker.rarity)} ${sticker.name} sticker on STAMPEDE!`,
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
          <button
            onClick={onClose}
            className="flex-1 bg-card2 border border-border text-t2 rounded-lg py-2 text-sm font-semibold hover:text-t1 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
