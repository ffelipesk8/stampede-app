import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redis, REDIS_KEYS } from "@/lib/redis";
import { awardXp } from "@/lib/xp";
import { Rarity } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  packId: z.string().min(1),
});

const RARITY_ORDER: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { packId } = parsed.data;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const pack = await db.pack.findUnique({
    where: { id: packId, isActive: true },
    include: { contents: { include: { sticker: true } } },
  });

  if (!pack) return NextResponse.json({ error: "Pack not found or inactive" }, { status: 404 });

  // -- Welcome pack: can only open once ------------------
  if (pack.type === "WELCOME") {
    const alreadyOpened = await db.packLog.findFirst({
      where: { userId: user.id, packId },
    });
    if (alreadyOpened) {
      return NextResponse.json({ error: "Welcome pack already opened" }, { status: 409 });
    }
  }

  // -- Free daily pack: rate limit via DB (Redis es opcional) ------------
  if (pack.type === "FREE_DAILY") {
    const today = new Date().toISOString().split("T")[0];

    // Primero intenta Redis, si falla usa DB
    let alreadyOpened = false;
    try {
      const key = REDIS_KEYS.freePack(user.id);
      const lastFree = await redis.get<string>(key);
      if (lastFree === today) alreadyOpened = true;
      else await redis.set(key, today, { ex: 86400 });
    } catch {
      // Redis no disponible — verificar via DB
      const startOfDay = new Date(today + "T00:00:00.000Z");
      const endOfDay = new Date(today + "T23:59:59.999Z");
      const existingLog = await db.packLog.findFirst({
        where: { userId: user.id, packId, openedAt: { gte: startOfDay, lte: endOfDay } },
      });
      if (existingLog) alreadyOpened = true;
    }

    if (alreadyOpened) {
      return NextResponse.json({ error: "Free pack already opened today" }, { status: 429 });
    }
  }

  // -- Draw stickers --------------------------------------
  let contents = pack.contents;

  // Si el pack no tiene contenido configurado, usa todos los stickers de la DB
  if (contents.length === 0) {
    const allStickers = await db.sticker.findMany({ take: 200 });
    contents = allStickers.map((s) => ({ sticker: s, weight: 10 })) as typeof contents;
  }

  if (contents.length === 0) {
    return NextResponse.json({ error: "No stickers available" }, { status: 500 });
  }

  const drawnStickers = drawFromPack(
    contents,
    pack.cardCount,
    pack.guaranteedMin as Rarity | null
  );

  // -- Welcome pack: guarantee team sticker --------------
  let finalStickers = drawnStickers;
  if (pack.type === "WELCOME" && user.favoriteTeam) {
    const teamSticker = contents.find(
      (c) => c.sticker.team === user.favoriteTeam && c.sticker.rarity === "RARE"
    );
    if (teamSticker) {
      finalStickers[0] = teamSticker.sticker; // Slot 0 = guaranteed team rare
    }
  }

  // -- Upsert to user_stickers ----------------------------
  await db.$transaction(
    finalStickers.map((sticker) =>
      db.userSticker.upsert({
        where: { userId_stickerId: { userId: user.id, stickerId: sticker.id } },
        update: { quantity: { increment: 1 } },
        create: { userId: user.id, stickerId: sticker.id, source: "PACK" },
      })
    )
  );

  // -- Log the pack open ----------------------------------
  await db.packLog.create({
    data: {
      userId: user.id,
      packId,
      stickersWon: finalStickers.map((s) => ({ id: s.id, rarity: s.rarity, name: s.name })),
      xpEarned: pack.xpBonus,
    },
  });

  // -- Award XP -------------------------------------------
  const xpResult = await awardXp(user.id, "PACK_OPEN");
  if (pack.xpBonus > 0) {
    await db.user.update({
      where: { id: user.id },
      data: { xp: { increment: pack.xpBonus } },
    });
  }

  // -- Invalidate album cache -----------------------------
  try { await redis.del(REDIS_KEYS.albumProgress(user.id)); } catch { /* Redis opcional */ }

  return NextResponse.json({
    stickers: finalStickers,
    xpEarned: xpResult.xpEarned + pack.xpBonus,
    newXp: xpResult.newXp,
    newLevel: xpResult.newLevel,
    levelUp: xpResult.levelUp,
  });
}

// -- Weighted random draw ------------------------------------------------------
function drawFromPack(
  contents: { sticker: { id: string; name: string; rarity: Rarity; team: string; imageUrl: string; category: string }; weight: number }[],
  count: number,
  guaranteedMin: Rarity | null
): { id: string; name: string; rarity: Rarity; team: string; imageUrl: string; category: string }[] {
  const totalWeight = contents.reduce((sum, c) => sum + c.weight, 0);
  const drawn: (typeof contents)[0]["sticker"][] = [];

  for (let i = 0; i < count; i++) {
    let pool = contents;

    // First card might need to meet guaranteed rarity
    if (i === 0 && guaranteedMin) {
      const minIdx = RARITY_ORDER.indexOf(guaranteedMin);
      pool = contents.filter((c) => RARITY_ORDER.indexOf(c.sticker.rarity) >= minIdx);
      if (pool.length === 0) pool = contents;
    }

    const poolWeight = pool.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * poolWeight;
    for (const item of pool) {
      rand -= item.weight;
      if (rand <= 0) {
        drawn.push(item.sticker);
        break;
      }
    }
  }

  return drawn;
}
