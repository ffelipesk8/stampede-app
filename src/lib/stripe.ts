import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY env variable");
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }

  return stripeInstance;
}

export const STRIPE_PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
    label: "PRO Monthly",
    price: 9.99,
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
    label: "PRO Yearly",
    price: 79.99,
    interval: "year" as const,
    savings: "Save 33%",
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PLANS;
