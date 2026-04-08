import { EventsClient } from "@/components/events/EventsClient";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Fan Events Hub - STAMPEDE" };

export default async function EventsPage() {
  const authUser = await getAuthUser();
  const user = {
    id: authUser.id,
    favoriteTeam: authUser.favoriteTeam,
    countryCode: authUser.countryCode,
  };

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

  const myEvents = await db.fanEvent.findMany({
    where: { OR: [{ creatorId: user.id }, { attendees: { some: { userId: user.id } } }] },
    include: {
      _count: { select: { attendees: true } },
      attendees: { where: { userId: user.id }, take: 1 },
    },
    orderBy: { startsAt: "asc" },
    take: 10,
  });

  const serializedEvents = events.map((event) => ({
    ...event,
    latitude: event.latitude ? Number(event.latitude) : null,
    longitude: event.longitude ? Number(event.longitude) : null,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null,
    isAttending: event.attendees.length > 0,
    attendeeCount: event._count.attendees,
  }));

  const serializedMyEvents = myEvents.map((event) => ({
    ...event,
    latitude: event.latitude ? Number(event.latitude) : null,
    longitude: event.longitude ? Number(event.longitude) : null,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null,
    isAttending: event.attendees.length > 0,
    attendeeCount: event._count.attendees,
    isCreator: event.creatorId === user.id,
  }));

  return (
    <EventsClient
      events={serializedEvents}
      myEvents={serializedMyEvents}
      userId={user.id}
      favoriteTeam={user.favoriteTeam}
      countryCode={user.countryCode}
    />
  );
}
