import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  parseReference,
  verifyWompiEvent,
  WOMPI_PLANS,
  type WompiPlan,
  type WompiTransactionEvent,
} from "@/lib/wompi";

export const runtime = "nodejs";

async function getRawBody(req: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export async function POST(req: NextRequest) {
  const rawBody = await getRawBody(req);

  let event: WompiTransactionEvent;
  try {
    event = JSON.parse(rawBody) as WompiTransactionEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (eventsSecret) {
    const signature =
      req.headers.get("x-event-checksum") ??
      req.headers.get("wompi-signature") ??
      event.signature?.checksum ??
      "";

    if (!verifyWompiEvent(event, signature, eventsSecret)) {
      console.error("Wompi webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  if (event.event !== "transaction.updated") {
    return NextResponse.json({ ok: true });
  }

  const tx = event.data.transaction;
  if (tx.status !== "APPROVED") {
    return NextResponse.json({ ok: true });
  }

  const { plan, userId } = parseReference(tx.reference);
  if (!plan || !userId) {
    console.error("Wompi webhook: cannot parse reference", tx.reference);
    return NextResponse.json({ ok: true });
  }

  const planConfig = WOMPI_PLANS[plan as WompiPlan];
  const existing = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      stripeSubId: true,
      proExpiresAt: true,
    },
  });

  if (!existing) {
    console.error("Wompi webhook: user not found", userId);
    return NextResponse.json({ ok: true });
  }

  const wompiTransactionId = `wompi_${tx.id}`;
  if (existing.stripeSubId === wompiTransactionId) {
    return NextResponse.json({ ok: true });
  }

  const now = new Date();
  const baseDate = existing.proExpiresAt && existing.proExpiresAt > now ? existing.proExpiresAt : now;
  const proExpiresAt = new Date(baseDate.getTime() + planConfig.daysValid * 24 * 60 * 60 * 1000);

  await db.user.update({
    where: { id: userId },
    data: {
      isPro: true,
      proExpiresAt,
      stripeSubId: wompiTransactionId,
      coins: { increment: 500 },
    },
  });

  console.log(`Wompi: activated PRO for user ${userId}, plan=${plan}, expires=${proExpiresAt.toISOString()}`);
  return NextResponse.json({ ok: true });
}
