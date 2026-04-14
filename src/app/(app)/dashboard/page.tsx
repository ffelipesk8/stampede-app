import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PaymentStatusBanner } from "@/components/upgrade/PaymentStatusBanner";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { db } from "@/lib/db";
import { getFanTitle } from "@/lib/xp";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { payment?: string; plan?: string };
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      missions: {
        where: { status: "ACTIVE" },
        include: { mission: true },
        take: 3,
        orderBy: { expiresAt: "asc" },
      },
      _count: { select: { stickers: true, badges: true } },
    },
  });

  if (!user) redirect("/sign-in");

  const recentActivity = await db.userSticker.findMany({
    where: {
      sticker: { rarity: { in: ["EPIC", "LEGENDARY"] } },
    },
    include: {
      user: { select: { username: true } },
      sticker: { select: { name: true, rarity: true } },
    },
    orderBy: { acquiredAt: "desc" },
    take: 8,
  });

  const fanTitle = getFanTitle(user.level);
  const missionCompletion = user.missions.length
    ? Math.round(
        user.missions.reduce((acc, mission) => {
          if (mission.target <= 0) return acc;
          return acc + Math.min(100, Math.round((mission.progress / mission.target) * 100));
        }, 0) / user.missions.length
      )
    : 0;

  return (
    <>
      {searchParams?.payment && (
        <PaymentStatusBanner
          initialIsPro={user.isPro ?? false}
          payment={searchParams.payment}
          plan={searchParams.plan}
        />
      )}

      <DashboardClient
        username={user.username}
        level={user.level}
        xp={user.xp}
        fanTitle={fanTitle}
        stickerCount={user._count.stickers}
        streakDays={user.streakDays}
        missionCompletion={missionCompletion}
        missions={user.missions.map((mission) => ({
          id: mission.id,
          progress: mission.progress,
          target: mission.target,
          title: mission.mission.title,
          description: mission.mission.description,
          xpReward: mission.mission.xpReward,
        }))}
        activity={recentActivity.map((item) => ({
          id: item.id,
          username: item.user.username,
          stickerName: item.sticker.name,
          rarity: item.sticker.rarity as "EPIC" | "LEGENDARY",
          acquiredAt: item.acquiredAt.toISOString(),
        }))}
      />
    </>
  );
}
