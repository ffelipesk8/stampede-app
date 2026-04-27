import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getFanTitle, xpForLevel } from "@/lib/xp";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata = {
  title: "My Profile — KARTAZO",
};

export default async function ProfilePage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      badges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      },
      _count: {
        select: {
          stickers: true,
          events: true,
          referrals: true,
        },
      },
    },
  });

  if (!user) redirect("/sign-in");

  // XP math
  const currentLevelXp = xpForLevel(user.level);
  const xpAccumulated = Array.from({ length: user.level - 1 }, (_, i) =>
    xpForLevel(i + 1)
  ).reduce((a, b) => a + b, 0);
  const xpInLevel = user.xp - xpAccumulated;
  const xpProgress = {
    current: xpInLevel,
    needed: currentLevelXp,
    pct: Math.min(Math.round((xpInLevel / currentLevelXp) * 100), 100),
  };

  // Global rank (approximate from DB)
  const higherXpCount = await db.user.count({ where: { xp: { gt: user.xp } } });
  const globalRank = higherXpCount + 1;

  // Sticker completion stats
  const totalStickers = await db.sticker.count();
  const ownedStickers = user._count.stickers;
  const completionPct = totalStickers > 0
    ? Math.round((ownedStickers / totalStickers) * 100)
    : 0;

  return (
    <ProfileClient
      user={{
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        countryCode: user.countryCode,
        favoriteTeam: user.favoriteTeam,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streakDays: user.streakDays,
        isPro: user.isPro,
        proExpiresAt: user.proExpiresAt?.toISOString() ?? null,
        referralCode: user.referralCode,
        createdAt: user.createdAt.toISOString(),
        fanTitle: getFanTitle(user.level),
        xpProgress,
        globalRank,
        stickerCount: ownedStickers,
        totalStickers,
        completionPct,
        eventCount: user._count.events,
        referralCount: user._count.referrals,
        badges: user.badges.map((ub) => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          rarity: ub.badge.rarity,
          earnedAt: ub.earnedAt.toISOString(),
        })),
      }}
    />
  );
}
