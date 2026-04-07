import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const listing = await db.marketplaceListing.findUnique({
    where: { id: params.id },
  });

  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.sellerId !== user.id) {
    return NextResponse.json({ error: "Not your listing" }, { status: 403 });
  }
  if (listing.status !== "ACTIVE") {
    return NextResponse.json({ error: "Listing is not active" }, { status: 400 });
  }

  await db.$transaction(async (tx) => {
    // Return sticker to seller
    await tx.userSticker.upsert({
      where: { userId_stickerId: { userId: user.id, stickerId: listing.stickerId } },
      create: { userId: user.id, stickerId: listing.stickerId, quantity: listing.quantity },
      update: { quantity: { increment: listing.quantity } },
    });

    // Mark listing as cancelled
    await tx.marketplaceListing.update({
      where: { id: listing.id },
      data: { status: "CANCELLED" },
    });
  });

  return NextResponse.json({ success: true });
}
