import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { awardXp } from "@/lib/xp";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buyer = await db.user.findUnique({ where: { clerkId } });
  if (!buyer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const listing = await db.marketplaceListing.findUnique({
    where: { id: params.id },
    include: { sticker: true, seller: true },
  });

  if (!listing || listing.status !== "ACTIVE") {
    return NextResponse.json({ error: "Listing not available" }, { status: 404 });
  }
  if (listing.sellerId === buyer.id) {
    return NextResponse.json({ error: "Can't buy your own listing" }, { status: 400 });
  }
  if (listing.dropEndsAt && new Date(listing.dropEndsAt) < new Date()) {
    return NextResponse.json({ error: "Drop has expired" }, { status: 400 });
  }
  if (buyer.coins < listing.priceCoins) {
    return NextResponse.json({ error: "Insufficient coins" }, { status: 400 });
  }

  // Atomic transaction
  const result = await db.$transaction(async (tx) => {
    // Deduct coins from buyer
    await tx.user.update({
      where: { id: buyer.id },
      data: { coins: { decrement: listing.priceCoins } },
    });

    // Credit coins to seller
    await tx.user.update({
      where: { id: listing.sellerId },
      data: { coins: { increment: listing.priceCoins } },
    });

    // Transfer sticker to buyer
    await tx.userSticker.upsert({
      where: { userId_stickerId: { userId: buyer.id, stickerId: listing.stickerId } },
      create: { userId: buyer.id, stickerId: listing.stickerId, quantity: listing.quantity },
      update: { quantity: { increment: listing.quantity } },
    });

    // Remove sticker from seller (or reduce quantity)
    const sellerSticker = await tx.userSticker.findUnique({
      where: { userId_stickerId: { userId: listing.sellerId, stickerId: listing.stickerId } },
    });
    if (sellerSticker) {
      if (sellerSticker.quantity <= listing.quantity) {
        await tx.userSticker.delete({
          where: { userId_stickerId: { userId: listing.sellerId, stickerId: listing.stickerId } },
        });
      } else {
        await tx.userSticker.update({
          where: { userId_stickerId: { userId: listing.sellerId, stickerId: listing.stickerId } },
          data: { quantity: { decrement: listing.quantity } },
        });
      }
    }

    // Mark listing as sold
    await tx.marketplaceListing.update({
      where: { id: listing.id },
      data: { status: "SOLD" },
    });

    return { coinsSpent: listing.priceCoins };
  });

  // Award XP outside transaction
  await awardXp(buyer.id, "TRADE_COMPLETE").catch(() => {});

  return NextResponse.json({
    success: true,
    coinsSpent: result.coinsSpent,
    stickerId: listing.stickerId,
  });
}
