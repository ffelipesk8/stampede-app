import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PacksClient } from "@/components/packs/PacksClient";

export const metadata = { title: "Packs — KARTAZO" };

export default async function PacksPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true, isPro: true } });
  if (!user) redirect("/sign-in");

  const packs = await db.pack.findMany({
    where: { isActive: true, type: { notIn: ["WELCOME"] } },
    orderBy: [{ priceUsd: "asc" }],
  });

  // Last 5 opens for history
  const recentOpens = await db.packLog.findMany({
    where: { userId: user.id },
    include: { pack: { select: { name: true, rarity: true } } },
    orderBy: { openedAt: "desc" },
    take: 5,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PacksClient packs={packs as any} recentOpens={recentOpens as any} isPro={user.isPro} />;
}
