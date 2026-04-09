import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redis, REDIS_KEYS } from "@/lib/redis";
import OpenAI from "openai";
import { z } from "zod";

let openai: OpenAI | null = null;

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY env variable");
  }

  if (!openai) {
    openai = new OpenAI({ apiKey });
  }

  return openai;
}

const schema = z.object({
  message:          z.string().min(1).max(500),
  conversationId:   z.string().optional(),
});

const FREE_MSG_LIMIT = 5;

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid body", { status: 400 });

  const { message, conversationId } = parsed.data;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return new Response("User not found", { status: 404 });

  // -- Rate limit for free users --------------------------
  if (!user.isPro) {
    const key = REDIS_KEYS.coachDaily(user.id);
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 86400);
    if (count > FREE_MSG_LIMIT) {
      return Response.json(
        {
          upsell: true,
          message: `You've used your ${FREE_MSG_LIMIT} free COACH messages today 🔥 Go PRO for unlimited access + 2 extra packs per week!`,
        },
        { status: 429 }
      );
    }
  }

  // -- Get or create conversation -------------------------
  let convo = conversationId
    ? await db.coachConversation.findUnique({ where: { id: conversationId, userId: user.id } })
    : null;

  if (!convo) {
    convo = await db.coachConversation.create({ data: { userId: user.id } });
  }

  // -- Fetch last 6 messages for context -----------------
  const history = await db.coachMessage.findMany({
    where: { conversationId: convo.id },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  // -- Fetch user context for system prompt --------------
  const [missions, stickersCount] = await Promise.all([
    db.userMission.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      include: { mission: true },
      take: 3,
    }),
    db.userSticker.count({ where: { userId: user.id } }),
  ]);

  const systemPrompt = buildCoachPrompt(user, stickersCount, missions);

  // -- Call OpenAI with streaming -------------------------
  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    temperature: 0.7,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ],
  });

  // -- Save user message ----------------------------------
  await db.coachMessage.create({
    data: {
      conversationId: convo.id,
      role: "user",
      content: message,
    },
  });

  // -- Return SSE stream ----------------------------------
  let fullResponse = "";

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send conversation ID first
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ conversationId: convo!.id })}\n\n`)
      );

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          fullResponse += delta;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
        }
      }

      // Save assistant response
      await db.coachMessage.create({
        data: {
          conversationId: convo!.id,
          role: "assistant",
          content: fullResponse,
        },
      });

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function buildCoachPrompt(
  user: { username: string; favoriteTeam: string | null; level: number; xp: number; streakDays: number; isPro: boolean },
  stickerCount: number,
  missions: { mission: { title: string; xpReward: number } }[]
): string {
  const missionList = missions.map((m) => `"${m.mission.title}" (+${m.mission.xpReward} XP)`).join(", ");

  return `You are COACH, the AI assistant for STAMPEDE — the World Cup 2026 fan platform.

YOUR ROLE:
- Be a knowledgeable, enthusiastic World Cup companion for ${user.username}
- Detect and respond in the user's language naturally
- Help them collect stickers, find fan events, understand the tournament, and level up
- Keep responses concise: 2-4 sentences max. Never start with "I".

USER CONTEXT:
- Username: ${user.username}
- Favorite team: ${user.favoriteTeam ?? "not set yet"}
- Level: ${user.level} | XP: ${user.xp}
- Stickers owned: ${stickerCount} / 800 (${Math.round((stickerCount / 800) * 100)}% complete)
- Active missions: ${missionList || "none active"}
- Streak: ${user.streakDays} days
- PRO user: ${user.isPro}

WORLD CUP 2026 FACTS:
- 48 teams, 104 matches, 16 host cities across USA, Mexico, Canada
- Kickoff: June 11, 2026. Final: July 19, 2026
- Groups stage, Round of 32, QF, SF, Final format

CAPABILITIES: Answer WC questions, give album/pack advice, explain mechanics, suggest events, give fan predictions (clearly framed as opinion), remind about missions.

RESTRICTIONS: No betting advice, no political content, no competitor mentions, no off-topic requests. Stay football/STAMPEDE focused.

STYLE: Conversational, energetic. Max 2 emoji per response. Use "👉 [action]" for app suggestions.`;
}
