import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AlbumClient } from "@/components/album/AlbumClient";
import { normalizeStickerDisplay, REFEREE_DISPLAY_STICKERS } from "@/lib/sticker-display";

export const metadata = { title: "My Album — KARTAZO" };

export default async function AlbumPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) redirect("/sign-in");

  const userStickers = await db.userSticker.findMany({
    where: { userId: user.id, isCustom: false },
    include: { sticker: true },
    orderBy: [{ sticker: { team: "asc" } }, { sticker: { rarity: "asc" } }],
  });

  const customStickers = await db.userSticker.findMany({
    where: { userId: user.id, isCustom: true },
    include: { sticker: true },
    orderBy: [{ acquiredAt: "desc" }],
  });

  // All stickers in the game (for showing empty slots)
  const allStickers = await db.sticker.findMany({
    where: { isActive: true, season: { not: "KZ_USER" } },
    orderBy: [{ team: "asc" }, { rarity: "asc" }],
  });

  const normalizedUserStickers = userStickers.map((entry) => ({
    ...entry,
    sticker: normalizeStickerDisplay(entry.sticker),
  }));

  const baseStickers = allStickers.map((sticker) => normalizeStickerDisplay(sticker));
  const hasRefereesInDb = baseStickers.some((sticker) => sticker.category === "referee");
  const normalizedAllStickers = hasRefereesInDb
    ? baseStickers
    : [...baseStickers, ...REFEREE_DISPLAY_STICKERS];

  const ownedIds = new Set(normalizedUserStickers.map((us) => us.stickerId));
  const teams = [...new Set(normalizedAllStickers.map((s) => s.team))].sort();

  const stickersWithOwnership = normalizedAllStickers.map((s) => {
    const owned = normalizedUserStickers.find((us) => us.stickerId === s.id);
    return {
      ...s,
      rarity: s.rarity as string,
      owned: ownedIds.has(s.id),
      quantity: owned?.quantity ?? 0,
      isCustom: owned?.isCustom ?? false,
      customImageUrl: owned?.customImageUrl ?? null,
    };
  });

  const totalOwned = ownedIds.size;
  const totalStickers = normalizedAllStickers.length || 800;
  const customCards = customStickers.map((entry) => ({
    ...normalizeStickerDisplay(entry.sticker),
    rarity: entry.sticker.rarity as string,
    owned: true,
    quantity: entry.quantity,
    isCustom: true,
    customImageUrl: entry.customImageUrl,
  }));

  return (
    <AlbumClient
      stickers={stickersWithOwnership}
      customCards={customCards}
      teams={teams}
      totalOwned={totalOwned}
      totalStickers={totalStickers}
    />
  );
}

   
