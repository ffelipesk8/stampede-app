import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AlbumClient } from "@/components/album/AlbumClient";

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

  const ownedIds = new Set(userStickers.map((us) => us.stickerId));
  const teams = [...new Set(allStickers.map((s) => s.team))].sort();

  const stickersWithOwnership = allStickers.map((s) => {
    const owned = userStickers.find((us) => us.stickerId === s.id);
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
  const totalStickers = allStickers.length || 800;

  return (
    <AlbumClient
      stickers={stickersWithOwnership}
      teams={teams}
      totalOwned={totalOwned}
      totalStickers={totalStickers}
    />
  );
}
