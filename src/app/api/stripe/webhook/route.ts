import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Stripe requires the raw body for signature verification
export const runtime = "nodejs";

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const rawBody = await getRawBody(req);
  const sig = headers().get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {

      // -- Subscription created or renewed -----------------
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const isActive = sub.status === "active" || sub.status === "trialing";
        const periodEnd = new Date(sub.current_period_end * 1000);

        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            isPro: isActive,
            proExpiresAt: isActive ? periodEnd : null,
            stripeSubId: sub.id,
          },
        });
        break;
      }

      // -- Subscription cancelled / past due ----------------
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { isPro: false, proExpiresAt: null, stripeSubId: null },
        });
        break;
      }

      // -- Checkout completed (one-time confirmation) -------
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          const customerId = session.customer as string;
          // isPro is set by subscription.created event above;
          // grant 500 bonus coins on first PRO activation
          await db.user.updateMany({
            where: { stripeCustomerId: customerId, isPro: true },
            data: { coins: { increment: 500 } },
          });
        }
        break;
      }

      // -- Invoice payment failed ---------------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        // Grace period: don't remove PRO immediately, Stripe will retry
        console.warn(`Payment failed for customer ${customerId}`);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
