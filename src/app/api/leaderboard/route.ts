import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redis, REDIS_KEYS } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 100);
  const { userId: clerkId } = auth();

  // Get top users from Redis sorted set
  const key = country ? REDIS_KEYS.leaderboardCountry(country) : REDIS_KEYS.leaderboard;
  const topEntries = await redis.zrange<string[]>(key, 0, limit - 1, { rev: true, withScores: true });

  // Fetch user details for top entries
  const userIds = topEntries.filter((_, i) => i % 2 === 0);
  const scores = topEntries.filter((_, i) => i % 2 === 1).map(Number);

  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, username: true, avatarUrl: true, level: true, favoriteTeam: true, xp: true },
  });

  const ranked = userIds.map((userId, rank) => ({
    rank: rank + 1,
    ...users.find((u) => u.id === userId),
    xp: scores[rank],
  }));

  // Include requester's position if signed in
  let myPosition = null;
  if (clerkId) {
    const me = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
    if (me) {
      const myRank = await redis.zrevrank(key, me.id);
      myPosition = myRank !== null ? myRank + 1 : null;
    }
  }

  return NextResponse.json({ leaderboard: ranked, myPosition });
}
