import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getFanTitle, levelFromXp, xpForLevel } from "@/lib/xp";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      badges: { include: { badge: true }, take: 6, orderBy: { earnedAt: "desc" } },
      _count: { select: { stickers: true, events: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const currentLevelXp = xpForLevel(user.level);
  const prevLevelXp = user.level > 1 ? xpForLevel(user.level - 1) : 0;
  const xpInLevel = user.xp - (user.level > 1 ? Array.from({ length: user.level - 1 }, (_, i) => xpForLevel(i + 1)).reduce((a, b) => a + b, 0) : 0);

  return NextResponse.json({
    ...user,
    fanTitle: getFanTitle(user.level),
    xpProgress: { current: xpInLevel, needed: currentLevelXp, pct: Math.round((xpInLevel / currentLevelXp) * 100) },
    stickerCount: user._count.stickers,
    eventCount: user._count.events,
  });
}

export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowedStr = ["username", "favoriteTeam", "countryCode", "avatarUrl"];
  const allowedInt = ["onboardingStep"];
  const data: Record<string, string | number> = {};
  for (const key of allowedStr) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  for (const key of allowedInt) {
    if (body[key] !== undefined) data[key] = Number(body[key]);
  }

  const user = await db.user.update({
    where: { clerkId: userId },
    data,
  });

  return NextResponse.json(user);
}
