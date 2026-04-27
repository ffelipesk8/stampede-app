"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

interface Sticker {
  id: string;
  name: string;
  team: string;
  rarity: Rarity;
  number: number;
}

interface Seller {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface Listing {
  id: string;
  priceCoins: number;
  quantity: number;
  isDrop?: boolean;
  dropEndsAt?: string | null;
  sticker: Sticker;
  seller: Seller;
  createdAt: string;
}

interface MyListing {
  id: string;
  priceCoins: number;
  quantity: number;
  sticker: Sticker;
  createdAt: string;
}

interface MarketplaceClientProps {
  initialListings: Listing[];
  drops: Listing[];
  myListings: MyListing[];
  userCoins: number;
  userId: string;
  canSell: boolean;
  daysUntilSell: number;
}

const RARITY_CONFIG: Record<Rarity, { color: string; label: string; bg: string }> = {
  COMMON:    { color: "#94A3B8", label: "Common",    bg: "rgba(148,163,184,0.1)" },
  UNCOMMON:  { color: "#4ADE80", label: "Uncommon",  bg: "rgba(74,222,128,0.1)"  },
  RARE:      { color: "#60A5FA", label: "Rare",      bg: "rgba(96,165,250,0.1)"  },
  EPIC:      { color: "#A78BFA", label: "Epic",      bg: "rgba(167,139,250,0.12)"},
  LEGENDARY: { color: "#FFB800", label: "Legendary", bg: "rgba(255,184,0,0.12)"  },
};

const TEAM_FLAGS: Record<string, string> = {
  USA:"🇺🇸",MEX:"🇲🇽",CAN:"🇨🇦",ARG:"🇦🇷",BRA:"🇧🇷",FRA:"🇫🇷",ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ESP:"🇪🇸",GER:"🇩🇪",POR:"🇵🇹",NED:"🇳🇱",BEL:"🇧🇪",ITA:"🇮🇹",CRO:"🇭🇷",
  DEN:"🇩🇰",URU:"🇺🇾",COL:"🇨🇴",ECU:"🇪🇨",MAR:"🇲🇦",SEN:"🇸🇳",NGA:"🇳🇬",
  EGY:"🇪🇬",JPN:"🇯🇵",KOR:"🇰🇷",AUS:"🇦🇺",IRN:"🇮🇷",SAU:"🇸🇦",QAT:"🇶🇦",
  GHA:"🇬🇭",SUI:"🇨🇭",AUT:"🇦🇹",NZL:"🇳🇿",
};

type Tab = "browse" | "drops" | "my-listings";
type RarityFilter = "ALL" | Rarity;

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [, forceUpdate] = useState(0);
  const end = new Date(endsAt).getTime();
  const diff = Math.max(0, end - Date.now());
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  // Refresh every second
  useState(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 1000);
    return () => clearInterval(id);
  });

  if (diff === 0) return <span className="text-red-400 text-xs font-bold">EXPIRED</span>;

  return (
    <span className="font-mono text-xs font-bold text-[#FFB800]">
      {hours > 0 ? `${hours}h ` : ""}{mins}m {secs}s
    </span>
  );
}

function ListingCard({
  listing,
  userId,
  userCoins,
  onBuy,
  isLoading,
}: {
  listing: Listing;
  userId: string;
  userCoins: number;
  onBuy: (id: string) => void;
  isLoading: boolean;
}) {
  const rarity = RARITY_CONFIG[listing.sticker.rarity];
  const isOwn = listing.seller.id === userId;
  const canAfford = userCoins >= listing.priceCoins;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border overflow-hidden flex flex-col"
      style={{ borderColor: rarity.color + "30", background: rarity.bg }}
    >
      {/* Drop badge */}
      {listing.isDrop && listing.dropEndsAt && (
        <div className="bg-gradient-to-r from-[#E8003D] to-[#FF5E00] px-3 py-1.5 flex items-center justify-between">
          <span className="text-white text-[10px] font-black uppercase tracking-wider">
            🔥 DROP
          </span>
          <CountdownTimer endsAt={listing.dropEndsAt} />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Sticker info */}
        <div className="flex items-start gap-2">
          <span className="text-2xl flex-shrink-0">
            {TEAM_FLAGS[listing.sticker.team] ?? "⚽"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{listing.sticker.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded"
                style={{ color: rarity.color, backgroundColor: rarity.color + "20" }}
              >
                {rarity.label}
              </span>
              <span className="text-white/30 text-[10px]">#{listing.sticker.number}</span>
            </div>
          </div>
        </div>

        {/* Quantity */}
        {listing.quantity > 1 && (
          <div className="bg-white/5 rounded-lg px-2 py-1 text-center">
            <span className="text-white/50 text-xs">× {listing.quantity} available</span>
          </div>
        )}

        {/* Seller */}
        <div className="flex items-center gap-1.5 mt-auto">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/50">
            {listing.seller.username.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-white/40 text-xs truncate">
            {isOwn ? "You" : listing.seller.username}
          </span>
        </div>
      </div>

      {/* Price + Buy */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-white font-black text-lg leading-none">
            {listing.priceCoins.toLocaleString()}
          </p>
          <p className="text-white/40 text-[10px]">coins</p>
        </div>
        {isOwn ? (
          <span className="text-xs text-white/30 border border-white/10 rounded-lg px-3 py-1.5">
            Your listing
          </span>
        ) : (
          <button
            onClick={() => onBuy(listing.id)}
            disabled={!canAfford || isLoading}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              canAfford && !isLoading
                ? "bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white hover:opacity-90 shadow shadow-[#FF5E00]/20"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            {isLoading ? "…" : canAfford ? "Buy" : "Low coins"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function MarketplaceClient({
  initialListings,
  drops,
  myListings,
  userCoins,
  userId,
  canSell,
  daysUntilSell,
}: MarketplaceClientProps) {
  const [tab, setTab] = useState<Tab>("browse");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("ALL");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [coins, setCoins] = useState(userCoins);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [ownListings, setOwnListings] = useState<MyListing[]>(myListings);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = useCallback(async (listingId: string) => {
    setBuyingId(listingId);
    try {
      const res = await fetch(`/api/marketplace/${listingId}/buy`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error ?? "Purchase failed");
        return;
      }
      setCoins((c) => c - (data.coinsSpent ?? 0));
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast("success", `🎉 Sticker added to your collection!`);
    } catch {
      showToast("error", "Network error. Try again.");
    } finally {
      setBuyingId(null);
    }
  }, []);

  const handleCancel = useCallback(async (listingId: string) => {
    setCancellingId(listingId);
    try {
      const res = await fetch(`/api/marketplace/${listingId}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        showToast("error", "Could not cancel listing.");
        return;
      }
      setOwnListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast("success", "Listing cancelled. Sticker returned.");
    } catch {
      showToast("error", "Network error. Try again.");
    } finally {
      setCancellingId(null);
    }
  }, []);

  const rarities: RarityFilter[] = ["ALL", "LEGENDARY", "EPIC", "RARE", "UNCOMMON", "COMMON"];

  const filteredListings = listings.filter((l) => {
    const matchRarity = rarityFilter === "ALL" || l.sticker.rarity === rarityFilter;
    const matchSearch =
      !search ||
      l.sticker.name.toLowerCase().includes(search.toLowerCase()) ||
      l.sticker.team.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.username.toLowerCase().includes(search.toLowerCase());
    return matchRarity && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-white">Marketplace 🏪</h1>
          <p className="text-white/40 text-sm mt-1">
            Trade stickers with fans worldwide
          </p>
        </div>
        {/* Coins balance */}
        <div className="flex items-center gap-2 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl px-4 py-2">
          <span className="text-[#FFB800] text-lg">🪙</span>
          <div>
            <p className="text-[#FFB800] font-black text-lg leading-none">
              {coins.toLocaleString()}
            </p>
            <p className="text-[#FFB800]/60 text-[10px]">your coins</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
        {([
          { key: "browse", label: "Browse All", count: listings.length },
          { key: "drops", label: "🔥 Drops", count: drops.length },
          { key: "my-listings", label: "My Listings", count: ownListings.length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === key
                ? "bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  tab === key
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Browse tab */}
      {tab === "browse" && (
        <div>
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search sticker, team, or seller…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF5E00]/50 transition-colors"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {rarities.map((r) => {
                const cfg = r !== "ALL" ? RARITY_CONFIG[r] : null;
                return (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      rarityFilter === r
                        ? "border-current"
                        : "border-white/10 text-white/40 hover:text-white/70"
                    }`}
                    style={
                      rarityFilter === r && cfg
                        ? { color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.color + "60" }
                        : rarityFilter === r
                        ? { color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }
                        : {}
                    }
                  >
                    {r === "ALL" ? "All" : cfg?.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🏪</div>
              <h3 className="text-white font-black text-xl mb-2">No listings found</h3>
              <p className="text-white/40 text-sm">
                {search
                  ? `No results for "${search}"`
                  : "Be the first to list a sticker!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  userId={userId}
                  userCoins={coins}
                  onBuy={handleBuy}
                  isLoading={buyingId === listing.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drops tab */}
      {tab === "drops" && (
        <div>
          {drops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="text-white font-black text-xl mb-2">No drops active</h3>
              <p className="text-white/40 text-sm max-w-xs">
                Limited drops appear here. Follow KARTAZO on socials to get notified!
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-[#E8003D]/10 to-[#FF5E00]/10 border border-[#FF5E00]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-white font-bold text-sm">Limited-time drops</p>
                  <p className="text-white/50 text-xs">
                    These exclusive stickers expire soon. Don&apos;t miss them!
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {drops.map((d) => (
                  <ListingCard
                    key={d.id}
                    listing={d}
                    userId={userId}
                    userCoins={coins}
                    onBuy={handleBuy}
                    isLoading={buyingId === d.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* My Listings tab */}
      {tab === "my-listings" && (
        <div>
          {!canSell && (
            <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-white font-bold text-sm">Selling unlocks in {daysUntilSell} days</p>
                <p className="text-white/50 text-xs">
                  Accounts need to be 7 days old to list stickers (anti-fraud protection).
                </p>
              </div>
            </div>
          )}

          {ownListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-white font-black text-xl mb-2">No active listings</h3>
              <p className="text-white/40 text-sm mb-6">
                {canSell
                  ? "Go to your album, tap a sticker, and hit \"List on Market\""
                  : `You can start listing in ${daysUntilSell} days`}
              </p>
              {canSell && (
                <a
                  href="/album"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Go to Album →
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {ownListings.map((listing) => {
                const rarity = RARITY_CONFIG[listing.sticker.rarity];
                return (
                  <div
                    key={listing.id}
                    className="flex items-center gap-3 rounded-xl p-4 border"
                    style={{ borderColor: rarity.color + "30", background: rarity.bg }}
                  >
                    <span className="text-2xl">
                      {TEAM_FLAGS[listing.sticker.team] ?? "⚽"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">
                        {listing.sticker.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded"
                          style={{
                            color: rarity.color,
                            backgroundColor: rarity.color + "20",
                          }}
                        >
                          {rarity.label}
                        </span>
                        {listing.quantity > 1 && (
                          <span className="text-white/30 text-[10px]">×{listing.quantity}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#FFB800] font-black">
                        🪙 {listing.priceCoins.toLocaleString()}
                      </p>
                      <p className="text-white/30 text-xs">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancel(listing.id)}
                      disabled={cancellingId === listing.id}
                      className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-white/50 border border-white/10 hover:border-red-500/40 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      {cancellingId === listing.id ? "…" : "Cancel"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-lg ${
              toast.type === "success"
                ? "bg-[#4ADE80] text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
