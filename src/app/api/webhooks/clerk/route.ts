import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateReferralCode } from "@/lib/auth";
import { redis, REDIS_KEYS } from "@/lib/redis";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return new NextResponse("No webhook secret", { status: 500 });

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, username, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;
    const uname = username ?? email.split("@")[0] + Math.floor(Math.random() * 1000);

    const user = await db.user.create({
      data: {
        clerkId: id,
        email,
        username: uname,
        avatarUrl: image_url,
        referralCode: generateReferralCode(),
      },
    });

    // Grant welcome pack entitlement (flag in Redis)
    await redis.set(`welcome_pack:${user.id}`, "pending", { ex: 60 * 60 * 24 * 7 });

    // Seed 3 default daily missions
    const dailyMissions = await db.mission.findMany({
      where: { type: "DAILY", isActive: true, isRecurring: true },
      take: 3,
      orderBy: { sortOrder: "asc" },
    });

    if (dailyMissions.length > 0) {
      await db.userMission.createMany({
        data: dailyMissions.map((m) => ({
          userId: user.id,
          missionId: m.id,
          target: (m.criteria as { count?: number }).count ?? 1,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })),
      });
    }

    console.log(`✅ User created: ${user.username} (${user.id})`);
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.user.deleteMany({ where: { clerkId: id } });
      console.log(`🗑️ User deleted: ${id}`);
    }
  }

  return NextResponse.json({ received: true });
}
