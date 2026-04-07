import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const { userId: clerkId } = auth();
  if (!clerkId) return NextResponse.redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || !user.stripeCustomerId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  });

  return NextResponse.redirect(session.url);
}
