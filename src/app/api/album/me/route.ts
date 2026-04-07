import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redis, REDIS_KEYS } from "@/lib/redis";

const TOTAL_STICKERS = 800;

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check Redis cache (3600s TTL)
  const cached = await redis.get(REDIS_KEYS.albumProgress(user.id));
  if (cached) return NextResponse.json(cached);

  const userStickers = await db.userSticker.findMany({
    where: { userId: user.id },
    include: { sticker: true },
    orderBy: [{ sticker: { team: "asc" } }, { sticker: { name: "asc" } }],
  });

  // Group by team
  const byTeam = userStickers.reduce<Record<string, typeof userStickers>>((acc, us) => {
    const team = us.sticker.team;
    if (!acc[team]) acc[team] = [];
    acc[team].push(us);
    return acc;
  }, {});

  // Count by rarity
  const rarityCounts = userStickers.reduce<Record<string, number>>((acc, us) => {
    acc[us.sticker.rarity] = (acc[us.sticker.rarity] ?? 0) + 1;
    return acc;
  }, {});

  const totalOwned = userStickers.length;
  const progressPct = Math.round((totalOwned / TOTAL_STICKERS) * 100);

  const result = {
    totalOwned,
    totalStickers: TOTAL_STICKERS,
    progressPct,
    byTeam,
    rarityCounts,
  };

  // Cache
  await redis.set(REDIS_KEYS.albumProgress(user.id), result, { ex: 3600 });

  return NextResponse.json(result);
}
