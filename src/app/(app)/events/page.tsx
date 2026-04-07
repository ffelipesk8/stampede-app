import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EventsClient } from "@/components/events/EventsClient";

export const metadata = { title: "Fan Events Hub — STAMPEDE" };

export default async function EventsPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true, favoriteTeam: true, countryCode: true },
  });
  if (!user) redirect("/sign-in");

  // Featured events (upcoming, sorted by attendees)
  const events = await db.fanEvent.findMany({
    where: { isPublic: true, startsAt: { gte: new Date() } },
    include: {
      creator: { select: { id: true, username: true, avatarUrl: true, favoriteTeam: true } },
      attendees: { where: { userId: user.id }, take: 1 },
      _count: { select: { attendees: true } },
    },
    orderBy: { startsAt: "asc" },
    take: 50,
  });

  // My events
  const myEvents = await db.fanEvent.findMany({
    where: { OR: [{ creatorId: user.id }, { attendees: { some: { userId: user.id } } }] },
    include: {
      _count: { select: { attendees: true } },
      attendees: { where: { userId: user.id }, take: 1 },
    },
    orderBy: { startsAt: "asc" },
    take: 10,
  });

  const serializedEvents = events.map((e) => ({
    ...e,
    latitude: e.latitude ? Number(e.latitude) : null,
    longitude: e.longitude ? Number(e.longitude) : null,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt?.toISOString() ?? null,
    isAttending: e.attendees.length > 0,
    attendeeCount: e._count.attendees,
  }));

  const serializedMyEvents = myEvents.map((e) => ({
    ...e,
    latitude: e.latitude ? Number(e.latitude) : null,
    longitude: e.longitude ? Number(e.longitude) : null,
    startsAt: e.startsAt.toISOString(),
    endsAt: e.endsAt?.toISOString() ?? null,
    isAttending: e.attendees.length > 0,
    attendeeCount: e._count.attendees,
    isCreator: e.creatorId === user.id,
  }));

  return (
    <EventsClient
      events={serializedEvents}
      myEvents={serializedMyEvents}
      userId={user.id}
      favoriteTeam={user.favoriteTeam}
    />
  );
}
