import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CoachClient from "@/components/coach/CoachClient";

export const metadata = {
  title: "AI Fan Coach — STAMPEDE",
  description: "Your personal World Cup AI assistant",
};

export default async function CoachPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      missions: {
        where: { status: "ACTIVE" },
        take: 3,
      },
    },
  });

  if (!user) redirect("/sign-in");

  // Fetch today's message count from Redis is handled client-side via the API
  // Fetch recent conversation history
  const recentConversation = await db.coachConversation.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 50,
      },
    },
  });

  const initialMessages = recentConversation?.messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  })) ?? [];

  const userContext = {
    username: user.username,
    favoriteTeam: user.favoriteTeam,
    level: user.level,
    xp: user.xp,
    isPro: user.isPro,
    streakDays: user.streakDays,
    activeMissions: user.missions.map((m) => m.missionKey),
    conversationId: recentConversation?.id ?? null,
  };

  return (
    <CoachClient
      initialMessages={initialMessages}
      userContext={userContext}
    />
  );
}
