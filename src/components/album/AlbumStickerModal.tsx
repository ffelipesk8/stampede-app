"use client";

import { Lock, Star, X } from "lucide-react";
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
  GK: "GK",
  CB: "DEF",
  LB: "DEF",
  RB: "DEF",
  CM: "MID",
  CDM: "MID",
  CAM: "MID",
  LM: "MID",
  RM: "MID",
  ST: "ATT",
  CF: "ATT",
  LW: "ATT",
  RW: "ATT",
  COACH: "DT",
  REF: "REF",
  "?": "PLY",
};

const RARITY_KEYS: Record<string, "rarity.common" | "rarity.uncommon" | "rarity.rare" | "rarity.epic" | "rarity.legendary"> = {
  COMMON: "rarity.common",
  UNCOMMON: "rarity.uncommon",
  RARE: "rarity.rare",
  EPIC: "rarity.epic",
  LEGENDARY: "rarity.legendary",
};

const FLAGS: Record<string, string> = {
  ARG: "ARG",
  AUS: "AUS",
  BEL: "BEL",
  BRA: "BRA",
  CAN: "CAN",
  CHE: "CHE",
  CMR: "CMR",
  COL: "COL",
  CRI: "CRI",
  DEU: "DEU",
  DNK: "DNK",
  ECU: "ECU",
  EGY: "EGY",
  ENG: "ENG",
  ESP: "ESP",
  FRA: "FRA",
  GHA: "GHA",
  HRV: "HRV",
  IRN: "IRN",
  ITA: "ITA",
  JPN: "JPN",
  KOR: "KOR",
  MAR: "MAR",
  MEX: "MEX",
  NGA: "NGA",
  NLD: "NLD",
  PAN: "PAN",
  POR: "POR",
  QAT: "QAT",
  SAU: "SAU",
  SEN: "SEN",
  USA: "USA",
  URY: "URY",
};

export function AlbumStickerModal({ sticker, onClose }: { sticker: AlbumSticker; onClose: () => void }) {
  const { t, locale } = useLanguage();
  const color = rarityColor(sticker.rarity);
  const frame = getStickerFrameStyles(sticker.team, color, sticker.category);
  const rarityKey = RARITY_KEYS[sticker.rarity] ?? "rarity.common";
  const posLabel = POSITION_LABEL[sticker.position] ?? sticker.position;
  const badge = sticker.teamFlag || FLAGS[sticker.team] || sticker.team || "WC";
  const initials = (sticker.name || "WC")
    .split(" ")
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const labels = locale === "es"
    ? { status: "Estado", card: "Carta", position: "Posicion", collection: "Coleccion", quantity: "Copias" }
    : { status: "Status", card: "Card", position: "Position", collection: "Collection", quantity: "Copies" };

  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    sticker.playerName ?? sticker.name,
    sticker.category,
    sticker.customImageUrl ?? sticker.imageUrl,
  );

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0A0B14] shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.28em]" style={{ color }}>
              {t(rarityKey)}
            </p>
            <h2 className="truncate font-condensed text-2xl font-black text-white sm:text-3xl">
              {sticker.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="border-b border-white/8 p-5 lg:border-b-0 lg:border-r">
            <div
              className="mx-auto overflow-hidden rounded-[26px] border p-[3px]"
              style={{
                borderColor: `${color}55`,
                background: frame.shell.background,
                boxShadow: `0 0 0 1px ${color}22, 0 18px 50px rgba(0,0,0,0.45)`,
                maxWidth: 260,
              }}
            >
              <div className="overflow-hidden rounded-[22px] bg-[#0E1020]">
                <div className="h-2.5" style={frame.flagBar} />

                <div className="flex items-start justify-between px-4 pb-2 pt-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">WC26</p>
                    <p className="mt-1 text-xs font-bold text-white/65">{badge}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color }}>
                      {posLabel}
                    </p>
                    <p className="font-condensed text-4xl font-black leading-none text-white">
                      {sticker.number}
                    </p>
                  </div>
                </div>

                <div className="relative mx-3 mb-3 h-[250px] overflow-hidden rounded-[18px]" style={frame.imagePanel}>
                  {sticker.owned && showPhoto ? (
                    <img
                      src={photoUrl ?? ""}
                      alt={sticker.name}
                      className="h-full w-full object-cover object-top"
                      onLoad={() => setLoaded(true)}
                      onError={() => setError(true)}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 bg-black/15 px-4 text-center">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border text-lg font-black text-white"
                        style={{ borderColor: `${color}66`, background: "rgba(0,0,0,0.35)" }}
                      >
                        {sticker.owned ? initials : <Lock className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{badge}</p>
                        <p className="mt-1 text-xs text-white/55">
                          {sticker.owned ? (sticker.playerName ?? sticker.name) : t("album.notOwned")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="border-t border-white/8 px-4 py-3">
                  <p className="truncate font-condensed text-xl font-black uppercase text-white">
                    {sticker.name}
                  </p>
                  <p className="mt-1 text-sm font-bold" style={{ color }}>
                    {sticker.team}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label={labels.card} value={`#${sticker.number}`} />
              <InfoBox label={labels.position} value={posLabel} />
              <InfoBox label={labels.status} value={sticker.owned ? t("album.inCollection") : t("album.notOwned")} />
              <InfoBox label={labels.quantity} value={sticker.owned ? `x${sticker.quantity}` : "-"} />
            </div>

            <div className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/40">
                {labels.collection}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {sticker.owned
                  ? locale === "es"
                    ? "La carta ya esta en tu album y puedes compartirla o usar duplicados para intercambio."
                    : "This sticker is already in your album and duplicate copies can be used for trading."
                  : locale === "es"
                    ? "Aun no tienes esta carta. Sigue abriendo sobres y revisa el marketplace para completarla."
                    : "You do not own this sticker yet. Keep opening packs or check the marketplace to complete it."}
              </p>

              {sticker.isCustom && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1.5 text-xs font-black text-orange">
                  <Star className="h-3.5 w-3.5" />
                  CUSTOM
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {sticker.owned && (
                <ShareButton
                  data={{
                    title: `${sticker.name} - ${t(rarityKey)}`,
                    text: `Just collected ${sticker.name} on STAMPEDE`,
                    hashtags: ["WorldCup2026", "Stampede", "FanAlbum"],
                  }}
                  className="flex-1 justify-center rounded-2xl border-white/10 bg-white/[0.04] py-3 text-sm font-black text-white hover:border-orange hover:text-orange"
                >
                  {t("album.share")}
                </ShareButton>
              )}

              {sticker.owned && sticker.quantity > 1 && (
                <button
                  className="flex-1 rounded-2xl border border-[#00D97E]/25 bg-[#00D97E]/10 py-3 text-sm font-black text-[#00D97E]"
                  type="button"
                >
                  {t("album.trade")}
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-black text-white/72 transition hover:bg-white/[0.08] hover:text-white"
                type="button"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] px-4 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/35">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
