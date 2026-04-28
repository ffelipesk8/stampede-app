import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { redis, REDIS_KEYS } from "@/lib/redis";

const createCustomCardSchema = z.object({
  title: z.string().trim().min(2).max(60),
  playerName: z.string().trim().min(2).max(60),
  team: z.string().trim().min(2).max(8),
  teamFlag: z.string().trim().min(1).max(8).optional(),
  imageUrl: z.string().trim().url().max(600),
  caption: z.string().trim().max(180).optional().or(z.literal("")),
});

function isUnsafeImageHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, username: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = createCustomCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, playerName, team, teamFlag, imageUrl, caption } = parsed.data;

  let parsedImageUrl: URL;
  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  if (!["https:", "http:"].includes(parsedImageUrl.protocol)) {
    return NextResponse.json({ error: "Only HTTP and HTTPS URLs are supported" }, { status: 400 });
  }

  if (isUnsafeImageHost(parsedImageUrl.hostname)) {
    return NextResponse.json({ error: "Private or local image URLs are not allowed" }, { status: 400 });
  }

  const existingCustomCount = await db.userSticker.count({
    where: { userId: user.id, isCustom: true },
  });

  if (existingCustomCount >= 24) {
    return NextResponse.json({ error: "Custom card limit reached" }, { status: 400 });
  }

  const maxCustomSticker = await db.sticker.findFirst({
    where: { season: "KZ_USER" },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  const customNumber = Math.max(5001, (maxCustomSticker?.number ?? 5000) + 1);
  const normalizedTeam = team.toUpperCase();
  const safeTitle = title.replace(/\s+/g, " ").trim();
  const safePlayerName = playerName.replace(/\s+/g, " ").trim();
  const slugBase = `${user.username}-${safePlayerName}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const sticker = await db.sticker.create({
    data: {
      number: customNumber,
      slug: `${slugBase}-${Math.random().toString(36).slice(2, 7)}`,
      name: safeTitle,
      playerName: safePlayerName,
      team: normalizedTeam,
      teamFlag: teamFlag?.trim() || normalizedTeam,
      position: "FAN",
      category: "moment",
      rarity: "EPIC",
      imageUrl,
      description: caption?.trim() || `Fan photo created by ${user.username}`,
      season: "KZ_USER",
      xpValue: 0,
      mintedCount: 1,
      isActive: true,
    },
  });

  const userSticker = await db.userSticker.create({
    data: {
      userId: user.id,
      stickerId: sticker.id,
      quantity: 1,
      isCustom: true,
      customImageUrl: imageUrl,
      source: "CUSTOM_UPLOAD",
    },
  });

  try {
    await redis.del(REDIS_KEYS.albumProgress(user.id));
  } catch {
    // Cache may be unavailable locally; card creation should still succeed.
  }

  return NextResponse.json(
    {
      card: {
        id: sticker.id,
        number: sticker.number,
        name: sticker.name,
        playerName: sticker.playerName,
        team: sticker.team,
        teamFlag: sticker.teamFlag,
        category: sticker.category,
        position: sticker.position,
        rarity: sticker.rarity,
        imageUrl: sticker.imageUrl,
        owned: true,
        quantity: userSticker.quantity,
        isCustom: userSticker.isCustom,
        customImageUrl: userSticker.customImageUrl,
      },
    },
    { status: 201 },
  );
}
