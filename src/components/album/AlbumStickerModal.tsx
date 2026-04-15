"use client";

import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { ShareButton } from "@/components/shared/ShareModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles } from "@/lib/sticker-frame";
import { rarityColor } from "@/lib/utils";

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

const POSITION_LABEL: Record<string, string> = {
  GK: "PORTERO",
  CB: "DEFENSA",
  LB: "DEFENSA",
  RB: "DEFENSA",
  CM: "VOLANTE",
  CDM: "VOLANTE",
  CAM: "VOLANTE",
  LM: "VOLANTE",
  RM: "VOLANTE",
  ST: "DELANT.",
  CF: "DELANT.",
  LW: "DELANT.",
  RW: "DELANT.",
  COACH: "D.T.",
  "?": "PLY",
};

const RARITY_META: Record<string, { color: string; bg: string; tier: string }> = {
  COMMON: { color: "#9090B8", bg: "linear-gradient(160deg,#1C1C30 0%,#12121E 100%)", tier: "Bronze" },
  UNCOMMON: { color: "#4A6FFF", bg: "linear-gradient(160deg,#0E1828 0%,#07101A 100%)", tier: "Silver" },
  RARE: { color: "#00D97E", bg: "linear-gradient(160deg,#082818 0%,#040E09 100%)", tier: "Gold" },
  EPIC: { color: "#FFB800", bg: "linear-gradient(160deg,#1A1000 0%,#0A0800 100%)", tier: "Epic" },
  LEGENDARY: { color: "#E8003D", bg: "linear-gradient(160deg,#1E0008 0%,#0A0004 100%)", tier: "Elite" },
};

const RARITY_KEYS: Record<string, "rarity.common" | "rarity.uncommon" | "rarity.rare" | "rarity.epic" | "rarity.legendary"> = {
  COMMON: "rarity.common",
  UNCOMMON: "rarity.uncommon",
  RARE: "rarity.rare",
  EPIC: "rarity.epic",
  LEGENDARY: "rarity.legendary",
};

const FLAGS: Record<string, string> = {
  ARG: "🇦🇷", AUS: "🇦🇺", BEL: "🇧🇪", BRA: "🇧🇷", CAN: "🇨🇦", CHE: "🇨🇭", CMR: "🇨🇲",
  COL: "🇨🇴", CRI: "🇨🇷", DEU: "🇩🇪", DNK: "🇩🇰", ECU: "🇪🇨", EGY: "🇪🇬", ENG: "🏴",
  ESP: "🇪🇸", FRA: "🇫🇷", GHA: "🇬🇭", HRV: "🇭🇷", IRN: "🇮🇷", ITA: "🇮🇹", JPN: "🇯🇵",
  KOR: "🇰🇷", MAR: "🇲🇦", MEX: "🇲🇽", NGA: "🇳🇬", NLD: "🇳🇱", PAN: "🇵🇦", POR: "🇵🇹",
  QAT: "🇶🇦", SAU: "🇸🇦", SEN: "🇸🇳", USA: "🇺🇸", URY: "🇺🇾",
};

export function AlbumStickerModal({ sticker, onClose }: { sticker: AlbumSticker; onClose: () => void }) {
  const { t, locale } = useLanguage();
  const meta = RARITY_META[sticker.rarity] ?? RARITY_META.COMMON;
  const color = rarityColor(sticker.rarity);
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);
  const rarityKey = RARITY_KEYS[sticker.rarity] ?? "rarity.common";
  const posLabel = POSITION_LABEL[sticker.position] ?? sticker.position;
  const flagEmoji = sticker.teamFlag || FLAGS[sticker.team] || "⚽";
  const initials = sticker.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const labels = locale === "es"
    ? { position: "Posicion", card: "Carta", status: "Estado", tier: "Tier", custom: "Custom" }
    : { position: "Position", card: "Card", status: "Status", tier: "Tier", custom: "Custom" };

  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      style={{ background: "rgba(4,4,10,0.88)" }}
      onClick={onClose}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color}18 0%, transparent 65%)` }}
      />

      <motion.div
        initial={{ y: 40, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-2xl"
        style={{
          background: "linear-gradient(160deg, #0e0e1c 0%, #080810 100%)",
          border: `1px solid ${color}35`,
          boxShadow: `0 0 50px ${color}24, 0 24px 64px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-0 mt-3 h-1 w-10 rounded-full bg-white/10 sm:hidden" />

        <div className="relative overflow-hidden rounded-t-2xl">
          <div
            className="absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 100% 80% at 50% 0%, ${color}14 0%, transparent 60%)`,
                "radial-gradient(ellipse 60% 40% at 20% 100%, rgba(255,255,255,0.05) 0%, transparent 50%)",
                "linear-gradient(160deg, #0d0d1e 0%, #060609 100%)",
              ].join(", "),
            }}
          />

          <div className="relative z-10 flex flex-col gap-5 px-5 pb-5 pt-6 sm:flex-row sm:items-start sm:px-6 sm:pb-6 sm:pt-7">
            <div
              className="mx-auto shrink-0 overflow-hidden rounded-xl sm:mx-0"
              style={{
                width: 130,
                height: 182,
                background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                padding: "2.5px",
                boxShadow: `0 0 20px ${color}35, 0 8px 32px rgba(0,0,0,0.7)`,
              }}
            >
              <div
                className="flex h-full w-full flex-col overflow-hidden rounded-[9px]"
                style={{
                  background: [
                    `radial-gradient(ellipse 120% 60% at 50% 0%, ${color}22 0%, transparent 55%)`,
                    "radial-gradient(ellipse 80% 50% at 80% 100%, rgba(255,255,255,0.08) 0%, transparent 50%)",
                    meta.bg,
                  ].join(", "),
                }}
              >
                <div className="shrink-0" style={frame.flagBar} />

                <div className="flex shrink-0 items-start justify-between px-2 pb-0 pt-1.5">
                  <div>
                    <span className="block rounded px-1 py-0.5 font-black leading-none" style={{ fontSize: 8, background: `${color}30`, color }}>
                      WC26
                    </span>
                    <span className="mt-0.5 block font-black text-white/60" style={{ fontSize: 8 }}>{sticker.team}</span>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 font-black leading-none" style={{ fontSize: 7, color: `${color}CC` }}>{posLabel}</p>
                    <p className="font-condensed text-[26px] font-black leading-none text-white">{sticker.number}</p>
                  </div>
                </div>

                <div className="relative flex-1 overflow-hidden" style={frame.imagePanel}>
                  {sticker.owned ? (
                    showPhoto ? (
                      <img
                        src={photoUrl ?? ""}
                        alt={sticker.name}
                        className="h-full w-full object-cover object-top"
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div style={{ fontSize: 28 }}>{flagEmoji}</div>
                        <div
                          className="flex items-center justify-center rounded-full font-black"
                          style={{ width: 36, height: 36, fontSize: 13, background: "rgba(0,0,0,0.5)", color: "#fff", border: `2px solid ${color}60` }}
                        >
                          {initials}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div style={{ fontSize: 32, opacity: 0.18 }}>{flagEmoji}</div>
                      <Lock className="h-7 w-7" style={{ color: `${color}55` }} />
                    </div>
                  )}

                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }} />
                </div>

                <div className="shrink-0 border-t px-2 pb-2 pt-1" style={{ borderTopColor: `${color}20` }}>
                  <div className="flex items-end justify-between gap-0.5">
                    <p className="flex-1 truncate font-condensed text-[10px] font-black uppercase leading-tight text-white">
                      {sticker.name}
                    </p>
                    <span style={{ fontSize: 12 }}>{flagEmoji}</span>
                  </div>
                  <p className="mt-0.5 text-[8px] font-black leading-none" style={{ color }}>
                    {meta.tier}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{t(rarityKey)}</span>
              </div>

              <h2 className="font-condensed text-2xl font-black leading-tight text-white">{sticker.name}</h2>
              <div className="mb-4 mt-1 flex items-center gap-2">
                <span style={{ fontSize: 16 }}>{flagEmoji}</span>
                <span className="text-sm font-bold text-white/45">{sticker.team}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: labels.position, value: posLabel },
                  { label: labels.card, value: `#${sticker.number}` },
                  { label: labels.status, value: sticker.owned ? `x${sticker.quantity}` : "-" },
                  { label: labels.tier, value: meta.tier },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <p className="mb-0.5 text-[10px] text-white/35">{label}</p>
                    <p className="text-xs font-black text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                {sticker.owned ? (
                  <div
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black"
                    style={{ background: "rgba(0,217,126,0.1)", border: "1px solid rgba(0,217,126,0.25)", color: "#00D97E" }}
                  >
                    ✓ {t("album.inCollection")}
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                  >
                    <Lock className="h-3 w-3" /> {t("album.notOwned")}
                  </div>
                )}
              </div>

              {sticker.isCustom && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold" style={{ color: "#E8650A" }}>
                  <Star className="h-3 w-3" /> {labels.custom}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-4 pt-3">
          {sticker.owned && (
            <ShareButton
              data={{
                title: `${sticker.name} - ${t(rarityKey)}`,
                text: `Just collected a ${t(rarityKey)} ${sticker.name} on FANPACK 26!`,
                hashtags: ["WorldCup2026", "FANPACK26", "FanAlbum"],
              }}
              className="flex-1 justify-center rounded-xl py-2.5 text-sm font-bold"
            >
              {t("album.share")}
            </ShareButton>
          )}
          {sticker.owned && sticker.quantity > 1 && (
            <button
              className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
              style={{ background: "rgba(0,217,126,0.08)", border: "1px solid rgba(0,217,126,0.2)", color: "#00D97E" }}
            >
              {t("album.trade")}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
          >
            {t("common.close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
