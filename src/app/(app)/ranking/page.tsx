import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import RankingClient from "@/components/ranking/RankingClient";

export const metadata = {
  title: "Global Ranking — KARTAZO",
  description: "See where you stand among World Cup fans worldwide",
};

export default async function RankingPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      level: true,
      xp: true,
      favoriteTeam: true,
      countryCode: true,
    },
  });

  if (!user) redirect("/sign-in");

  // Fetch top 100 + 10 most recent members in parallel
  const [topUsers, recentUsers] = await Promise.all([
    db.user.findMany({
      orderBy: { xp: "desc" },
      take: 100,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        level: true,
        xp: true,
        favoriteTeam: true,
        countryCode: true,
        _count: { select: { stickers: true } },
      },
    }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        level: true,
        xp: true,
        streakDays: true,
        favoriteTeam: true,
        createdAt: true,
        _count: { select: { stickers: true } },
      },
    }),
  ]);

  const userIds = [...new Set([...topUsers, ...recentUsers].map((entry) => entry.id))];
  const officialStickerCounts = userIds.length
    ? await db.userSticker.groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
          isCustom: false,
        },
        _sum: {
          quantity: true,
        },
      })
    : [];

  const stickerCountMap = new Map(
    officialStickerCounts.map((entry) => [entry.userId, entry._sum.quantity ?? 0]),
  );

  const enriched = topUsers.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    level: u.level,
    xp: u.xp,
    favoriteTeam: u.favoriteTeam,
    countryCode: u.countryCode,
    stickerCount: stickerCountMap.get(u.id) ?? 0,
    isMe: u.id === user.id,
  }));

  const recentMembers = recentUsers.map((u) => ({
    id: u.id,
    username: u.username,
    avatarUrl: u.avatarUrl,
    level: u.level,
    xp: u.xp,
    streakDays: u.streakDays,
    favoriteTeam: u.favoriteTeam,
    stickerCount: stickerCountMap.get(u.id) ?? 0,
    createdAt: u.createdAt.toISOString(),
    isMe: u.id === user.id,
  }));

  const myRank = enriched.find((u) => u.isMe)?.rank ?? null;

  return (
    <RankingClient
      initialLeaderboard={enriched}
      currentUser={{ ...user, myRank }}
      recentMembers={recentMembers}
    />
  );
}
