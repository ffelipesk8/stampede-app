"use client";

import { cn, rarityColor, rarityLabel } from "@/lib/utils";
import { Rarity } from "@prisma/client";

interface StickerCardProps {
  sticker: {
    id: string;
    name: string;
    rarity: Rarity;
    team: string;
    imageUrl: string;
    isCustom?: boolean;
    customImageUrl?: string | null;
  };
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function StickerCard({ sticker, className, onClick, selected }: StickerCardProps) {
  const imgSrc = sticker.isCustom && sticker.customImageUrl ? sticker.customImageUrl : sticker.imageUrl;
  const color = rarityColor(sticker.rarity);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-card2 rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200",
        "hover:scale-105 hover:shadow-lg",
        selected && "ring-2 ring-white scale-105",
        className
      )}
      style={{
        borderColor: color,
        boxShadow: sticker.rarity === "LEGENDARY" ? `0 0 16px ${color}50` : undefined,
      }}
    >
      {/* Sticker image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={imgSrc}
          alt={sticker.name}
          className="w-full h-full object-cover"
        />
        {/* Legendary shimmer overlay */}
        {sticker.rarity === "LEGENDARY" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent animate-pulse-slow" />
        )}
      </div>

      {/* Name + rarity */}
      <div className="px-2 py-1.5">
        <p className="text-t1 font-display font-semibold text-xs truncate">{sticker.name}</p>
        <p className="text-[10px] font-medium" style={{ color }}>
          {rarityLabel(sticker.rarity)}
        </p>
      </div>

      {/* Custom badge */}
      {sticker.isCustom && (
        <div className="absolute top-1 right-1 bg-orange text-white text-[8px] font-bold px-1 rounded">
          CUSTOM
        </div>
      )}
    </div>
  );
}
