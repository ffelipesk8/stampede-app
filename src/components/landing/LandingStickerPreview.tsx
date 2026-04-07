"use client";

import { useMemo, useState } from "react";
import { useStickerImage } from "@/hooks/useStickerImage";

export function LandingStickerPreview({
  name,
  team,
  rarity,
  flag,
  color,
  bg1,
  bg2,
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
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const isStaticVenue = cat === "city" || cat === "stadium";
  const staticUrl = useMemo(() => (isStaticVenue && img.startsWith("/") ? img : null), [img, isStaticVenue]);
  const [staticFailed, setStaticFailed] = useState(false);
  const { photoUrl, showPhoto, setLoaded, setError } = useStickerImage(
    name,
    cat,
    isStaticVenue ? null : img || null
  );
  const imageUrl = staticUrl && !staticFailed ? staticUrl : photoUrl;
  const canShowImage = !!imageUrl && !(staticUrl && staticFailed) && (staticUrl ? true : showPhoto);

  return (
    <div
      className="flex-shrink-0 w-28 rounded-2xl overflow-hidden border-2 hover:scale-105 transition-all duration-200"
      style={{ borderColor: color, boxShadow: `0 0 16px ${color}40` }}
    >
      <div
        className="h-36 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${bg1} 0%, ${bg2} 100%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 z-10" style={{ background: color }} />
        {canShowImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
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
              style={{ background: "rgba(0,0,0,0.45)", color: "#fff", border: `2px solid ${color}80` }}
            >
              {initials}
            </div>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-between px-2 z-10"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <span className="text-[9px] font-black text-white tracking-widest">{team}</span>
          <span className="text-[10px]">{flag}</span>
        </div>
        {cat !== "player" && (
          <div
            className="absolute top-3 right-1.5 z-20 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase"
            style={{ background: `${color}cc`, color: "#000" }}
          >
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
  );
}
