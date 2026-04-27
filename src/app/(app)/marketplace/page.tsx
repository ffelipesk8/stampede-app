import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import MarketplaceClient from "@/components/marketplace/MarketplaceClient";
import { normalizeStickerDisplay } from "@/lib/sticker-display";

export const metadata = {
  title: "Marketplace — KARTAZO",
  description: "Buy, sell and trade World Cup stickers",
};

export default async function MarketplacePage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, coins: true, createdAt: true },
  });

  if (!user) redirect("/sign-in");

  // SSR: first 20 active listings
  const listings = await db.marketplaceListing.findMany({
    where: { status: "ACTIVE", expiresAt: { gt: new Date() } },
    include: {
      sticker: {
        select: { id: true, name: true, team: true, rarity: true, number: true, category: true },
      },
      seller: { select: { id: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Active drops (limited-time listings)
  const drops = await db.marketplaceListing.findMany({
    where: {
      status: "ACTIVE",
      isDrop: true,
      dropEndsAt: { gt: new Date() },
    },
    include: {
      sticker: {
        select: { id: true, name: true, team: true, rarity: true, number: true, category: true },
      },
      seller: { select: { id: true, username: true, avatarUrl: true } },
    },
    orderBy: { dropEndsAt: "asc" },
    take: 6,
  });

  // User's own listings
  const myListings = await db.marketplaceListing.findMany({
    where: { sellerId: user.id, status: "ACTIVE" },
    include: {
      sticker: {
        select: { id: true, name: true, team: true, rarity: true, number: true, category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Account age check (7-day restriction)
  const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
  const canSell = accountAgeMs >= 7 * 24 * 60 * 60 * 1000;
  const daysUntilSell = canSell
    ? 0
    : Math.ceil((7 * 24 * 60 * 60 * 1000 - accountAgeMs) / (24 * 60 * 60 * 1000));

  return (
    <MarketplaceClient
      initialListings={listings.map((l) => ({
        id: l.id,
        priceCoins: l.priceCoins,
        quantity: l.quantity,
        isDrop: l.isDrop,
        dropEndsAt: l.dropEndsAt?.toISOString() ?? null,
        sticker: normalizeStickerDisplay(l.sticker),
        seller: l.seller,
        createdAt: l.createdAt.toISOString(),
      }))}
      drops={drops.map((d) => ({
        id: d.id,
        priceCoins: d.priceCoins,
        quantity: d.quantity,
        isDrop: d.isDrop,
        dropEndsAt: d.dropEndsAt?.toISOString() ?? null,
        sticker: normalizeStickerDisplay(d.sticker),
        seller: d.seller,
        createdAt: d.createdAt.toISOString(),
      }))}
      myListings={myListings.map((l) => ({
        id: l.id,
        priceCoins: l.priceCoins,
        quantity: l.quantity,
        sticker: normalizeStickerDisplay(l.sticker),
        createdAt: l.createdAt.toISOString(),
      }))}
      userCoins={user.coins ?? 0}
      userId={user.id}
      canSell={canSell}
      daysUntilSell={daysUntilSell}
    />
  );
}
