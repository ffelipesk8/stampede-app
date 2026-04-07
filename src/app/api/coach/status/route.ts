import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

const FREE_DAILY_LIMIT = 5;

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.isPro) {
    return NextResponse.json({ count: 0, limit: null, isPro: true });
  }

  const today = new Date().toISOString().slice(0, 10);
  const key = `coach:${user.id}:daily:${today}`;
  const count = parseInt((await redis.get<string>(key)) ?? "0", 10);

  return NextResponse.json({
    count,
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(FREE_DAILY_LIMIT - count, 0),
    isPro: false,
  });
}
