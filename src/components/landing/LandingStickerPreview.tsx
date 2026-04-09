"use client";

import { useMemo, useState } from "react";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles } from "@/lib/sticker-frame";
import { PremiumCardShell, type CardRarity } from "@/components/shared/PremiumCardShell";

const RARITY_LABEL: Record<string, string> = {
  COMMON: "Common", UNCOMMON: "Uncommon", RARE: "Rare", EPIC: "Epic", LEGENDARY: "Legendary",
};

export function LandingStickerPreview({
  name, team, rarity, flag, color, img, cat,
}: {
  name: string; team: string; rarity: string; flag: string;
  color: string; bg1: string; bg2: string; img: string; cat: string;
}) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const isVenue = cat === "city" || cat === "stadium";
  const staticUrl = useMemo(() => (isVenue && img.startsWith("/") ? img : null), [img, isVenue]);
  const [staticFailed, setStaticFailed] = useState(false);

  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    name, cat, isVenue ? null : img || null,
  );

  const frame = getStickerFrameStyles(team, color, cat);
  const imageUrl = staticUrl && !staticFailed ? staticUrl : photoUrl;
  const canShow  = !!imageUrl && !(staticUrl && staticFailed) && (staticUrl ? true : showPhoto);

  return (
    <PremiumCardShell
      rarity={rarity as CardRarity}
      glowColor={color}
      className="flex-shrink-0 w-28"
      style={{ borderRadius: "1rem" } as React.CSSProperties}
    >
      {/* -- Outer frame shell ------------------------------------------------ */}
      <div className="rounded-2xl overflow-hidden p-[2.5px]" style={frame.shell}>
        <div className="rounded-[13px] overflow-hidden bg-[#090914]">

          {/* -- Image area -------------------------------------------------- */}
          <div className="h-36 relative overflow-hidden" style={frame.imagePanel}>

            {/* Flag stripe bar — top */}
            <div className="absolute top-0 left-0 right-0 z-10" style={frame.flagBar} />

            {canShow ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl!}
                alt={name}
                className="w-full h-full object-cover object-top"
                onLoad={() => setLoaded(true)}
                onError={() => {
                  if (staticUrl) { setStaticFailed(true); return; }
                  setError(true);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl drop-shadow-lg">{flag}</span>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2"
                  style={{ ...frame.ring, color: "#fff" }}
                >
                  {initials}
                </div>
              </div>
            )}

            {/* Footer strip */}
            <div
              className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-10"
              style={frame.footer}
            >
              <span className="text-[9px] font-black text-white tracking-widest">{team}</span>
              <span className="text-[10px] drop-shadow">{flag}</span>
            </div>

            {/* Category chip */}
            {cat !== "player" && (
              <div
                className="absolute top-[7px] right-1.5 z-20 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase"
                style={frame.chip}
              >
                {cat}
              </div>
            )}
          </div>

          {/* -- Card footer ------------------------------------------------- */}
          <div className="px-2 py-1.5" style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)" }}>
            <p className="text-[10px] font-bold text-white truncate leading-tight">{name}</p>
            <p className="text-[9px] font-black mt-0.5" style={{ color }}>
              {RARITY_LABEL[rarity] ?? rarity}
            </p>
          </div>
        </div>
      </div>
    </PremiumCardShell>
  );
}
