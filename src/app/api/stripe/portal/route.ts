import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.kartazo.com";
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || !user.stripeCustomerId) {
    return NextResponse.redirect(
      `${appUrl}/upgrade`
    );
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/profile`,
  });

  return NextResponse.redirect(session.url);
}
