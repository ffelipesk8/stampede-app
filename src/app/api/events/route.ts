import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

// GET /api/events?city=Dallas&match=MEX&lat=32.7&lon=-96.7
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const match = searchParams.get("match");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const events = await db.fanEvent.findMany({
    where: {
      isPublic: true,
      startsAt: { gte: new Date() },
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(match ? { matchCode: { contains: match } } : {}),
    },
    include: {
      creator: { select: { id: true, username: true, avatarUrl: true, favoriteTeam: true } },
      _count: { select: { attendees: true } },
    },
    orderBy: { startsAt: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ events, page, limit });
}

const createSchema = z.object({
  title:        z.string().min(3).max(100),
  description:  z.string().max(500).optional(),
  type:         z.enum(["MATCH_DAY", "WATCH_PARTY", "FAN_MEETUP", "TRAVEL_GROUP", "AFTER_PARTY"]),
  matchCode:    z.string().optional(),
  city:         z.string().min(2).max(80),
  country:      z.string().length(3),
  venueName:    z.string().max(100).optional(),
  venueAddress: z.string().max(200).optional(),
  startsAt:     z.string().datetime(),
  endsAt:       z.string().datetime().optional(),
  maxAttendees: z.number().int().min(2).max(10000).optional(),
  latitude:     z.number().optional(),
  longitude:    z.number().optional(),
});

// POST /api/events — create event
export async function POST(req: NextRequest) {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const event = await db.fanEvent.create({
    data: { ...parsed.data, creatorId: user.id, startsAt: new Date(parsed.data.startsAt) },
    include: {
      creator: { select: { id: true, username: true, avatarUrl: true } },
      _count: { select: { attendees: true } },
    },
  });

  return NextResponse.json(event, { status: 201 });
}
