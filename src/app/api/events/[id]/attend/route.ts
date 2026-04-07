import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { awardXp } from "@/lib/xp";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const event = await db.fanEvent.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const existing = await db.eventAttendee.findUnique({
    where: { eventId_userId: { eventId: params.id, userId: user.id } },
  });

  if (existing) {
    // Leave
    await db.eventAttendee.delete({ where: { eventId_userId: { eventId: params.id, userId: user.id } } });
    return NextResponse.json({ attending: false });
  }

  // Check capacity
  if (event.maxAttendees) {
    const count = await db.eventAttendee.count({ where: { eventId: params.id } });
    if (count >= event.maxAttendees) return NextResponse.json({ error: "Event is full" }, { status: 409 });
  }

  await db.eventAttendee.create({ data: { eventId: params.id, userId: user.id } });
  await awardXp(user.id, "EVENT_JOIN");

  return NextResponse.json({ attending: true });
}
