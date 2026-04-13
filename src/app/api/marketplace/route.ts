import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { normalizeStickerDisplay } from "@/lib/sticker-display";
import { z } from "zod";

// GET /api/marketplace?stickerId=&team=&drop=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stickerId = searchParams.get("stickerId");
  const team = searchParams.get("team");
  const dropOnly = searchParams.get("drop") === "true";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const listings = await db.marketplaceListing.findMany({
    where: {
      status: "ACTIVE",
      ...(stickerId ? { stickerId } : {}),
      ...(dropOnly ? { isDrop: true } : {}),
      ...(team ? { sticker: { team } } : {}),
    },
    include: {
      sticker: { select: { id: true, name: true, team: true, rarity: true, imageUrl: true, category: true } },
      seller: { select: { id: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  return NextResponse.json({
    listings: listings.map((listing) => ({
      ...listing,
      sticker: normalizeStickerDisplay(listing.sticker),
    })),
    page,
    limit,
  });
}

const createSchema = z.object({
  stickerId:  z.string().min(1),
  priceCoins: z.number().int().min(1).max(10000),
  quantity:   z.number().int().min(1).default(1),
});

// POST /api/marketplace — create listing
export async function POST(req: NextRequest) {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { stickerId, priceCoins, quantity } = parsed.data;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Verify user owns enough of this sticker
  const owned = await db.userSticker.findUnique({
    where: { userId_stickerId: { userId: user.id, stickerId } },
  });

  if (!owned || owned.quantity < quantity) {
    return NextResponse.json({ error: "Insufficient sticker quantity" }, { status: 400 });
  }

  // 7-day new account hold
  const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  if (accountAgeMs < sevenDays) {
    return NextResponse.json({ error: "Account must be 7 days old to sell" }, { status: 403 });
  }

  const listing = await db.marketplaceListing.create({
    data: {
      sellerId: user.id,
      stickerId,
      priceCoins,
      quantity,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    include: { sticker: true },
  });

  return NextResponse.json(listing, { status: 201 });
}
