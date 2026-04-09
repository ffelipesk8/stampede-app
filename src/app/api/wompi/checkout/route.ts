import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { buildCheckoutUrl, buildReference, WOMPI_PLANS, type WompiPlan } from "@/lib/wompi";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["monthly", "yearly"]),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const { plan } = parsed.data;

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.isPro) return NextResponse.json({ error: "Already PRO" }, { status: 400 });

  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!publicKey || !integritySecret) {
    return NextResponse.json({ error: "Wompi is not configured" }, { status: 500 });
  }

  const planConfig = WOMPI_PLANS[plan as WompiPlan];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const reference = buildReference(user.id, plan as WompiPlan);

  const checkoutUrl = buildCheckoutUrl({
    publicKey,
    integritySecret,
    reference,
    amountCents: planConfig.amountCentsCOP,
    currency: "COP",
    redirectUrl: `${appUrl}/dashboard?payment=processing&plan=${plan}`,
    customerEmail: user.email,
  });

  return NextResponse.json({ url: checkoutUr