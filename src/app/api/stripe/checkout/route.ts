import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getStripe, STRIPE_PLANS, type StripePlan } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
});

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { plan } = parsed.data;
  const planConfig = STRIPE_PLANS[plan as StripePlan];
  if (!planConfig.priceId) {
    return NextResponse.json({ error: "Stripe plan is not configured" }, { status: 500 });
  }

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.isPro) {
    return NextResponse.json({ error: "Already subscribed to PRO" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  // Create or reuse Stripe customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id, clerkId },
    });
    customerId = customer.id;
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?pro=success`,
    cancel_url: `${appUrl}/upgrade?cancelled=true`,
    subscription_data: {
      metadata: { userId: user.id, plan },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return NextResponse.json({ url: session.url });
}
