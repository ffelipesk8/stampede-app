"use client";

import { useMemo, useState } from "react";
import { useStickerImage } from "@/hooks/useStickerImage";
import { getStickerFrameStyles } from "@/lib/sticker-frame";

export function LandingStickerPreview({
  name,
  team,
  rarity,
  flag,
  color,
  img,
  cat,
}: {
  name: string;
  team: string;
  rarity: string;
  flag: string;
  color: string;
  bg1: string;
  bg2: string;
  img: string;
  cat: string;
}) {
  const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const isStaticVenue = cat === "city" || cat === "stadium";
  const staticUrl = useMemo(() => (isStaticVenue && img.startsWith("/") ? img : null), [img, isStaticVenue]);
  const [staticFailed, setStaticFailed] = useState(false);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    name,
    cat,
    isStaticVenue ? null : img || null
  );
  const frame = getStickerFrameStyles(team, color, cat);
  const imageUrl = staticUrl && !staticFailed ? staticUrl : photoUrl;
  const canShowImage = !!imageUrl && !(staticUrl && staticFailed) && (staticUrl ? true : showPhoto);

  return (
    <div
      className="flex-shrink-0 w-28 rounded-2xl overflow-hidden p-[2px] hover:scale-105 transition-all duration-200"
      style={frame.shell}
    >
      <div className="rounded-[14px] overflow-hidden bg-[#090914]">
        <div className="h-36 relative overflow-hidden" style={frame.imagePanel}>
          <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: color }} />
          {canShowImage ? (
            <img
              src={imageUrl!}
              alt={name}
              className="w-full h-full object-cover object-top"
              onLoad={() => setLoaded(true)}
              onError={() => {
                if (staticUrl) {
                  setStaticFailed(true);
                  return;
                }
                setError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className="text-3xl">{flag}</div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base"
                style={{ ...frame.ring, color: "#fff", borderWidth: 2, borderStyle: "solid" }}
              >
                {initials}
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-10" style={frame.footer}>
            <span className="text-[9px] font-black text-white tracking-widest">{team}</span>
            <span className="text-[10px]">{flag}</span>
          </div>
          {cat !== "player" && (
            <div className="absolute top-3 right-1.5 z-20 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase" style={frame.chip}>
              {cat}
            </div>
          )}
        </div>
        <div className="px-2 py-1.5 bg-[#0d0d1a]">
          <p className="text-[10px] font-bold text-white truncate leading-tight">{name}</p>
          <p className="text-[9px] font-black mt-0.5" style={{ color }}>
            {rarity}
          </p>
        </div>
      </div>
    </div>
  );
}
