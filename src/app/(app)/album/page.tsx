import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AlbumClient } from "@/components/album/AlbumClient";
import { normalizeStickerDisplay, REFEREE_DISPLAY_STICKERS } from "@/lib/sticker-display";

export const metadata = { title: "My Album — STAMPEDE" };

export default async function AlbumPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) redirect("/sign-in");

  const userStickers = await db.userSticker.findMany({
    where: { userId: user.id },
    include: { sticker: true },
    orderBy: [{ sticker: { team: "asc" } }, { sticker: { rarity: "asc" } }],
  });

  // All stickers in the game (for showing empty slots)
  const allStickers = await db.sticker.findMany({
    where: { isActive: true },
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

  return (
    <AlbumClient
      stickers={stickersWithOwnership}
      teams={teams}
      totalOwned={totalOwned}
      totalStickers={totalStickers}
    />
  );
}

   