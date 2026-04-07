// ════════════════════════════════════════════════════
// STAMPEDE — Wompi Payment Integration
// Colombian payment gateway for World Cup 2026
// ════════════════════════════════════════════════════

import crypto from "crypto";
import { PRO_PLANS, type ProPlan } from "@/lib/pro-pricing";

export const WOMPI_SANDBOX_URL  = "https://sandbox.wompi.co/v1";
export const WOMPI_PROD_URL     = "https://production.wompi.co/v1";
export const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/";

export function getWompiBaseUrl() {
  return process.env.NODE_ENV === "production" ? WOMPI_PROD_URL : WOMPI_SANDBOX_URL;
}

// ── Plans (in COP cents) ─────────────────────────────
// 29,900 COP/month | 249,900 COP/year
export const WOMPI_PLANS = PRO_PLANS;
export type WompiPlan = ProPlan;

// ── Reference encoding ───────────────────────────────
// Format: STAMP-{plan}-{userId}-{timestamp}
// cuid() IDs are lowercase alphanumeric — safe to use - as separator

export function buildReference(userId: string, plan: WompiPlan): string {
  const ts = Date.now();
  return `STAMP-${plan}-${userId}-${ts}`;
}

export function parseReference(ref: string): { plan: WompiPlan | null; userId: string | null } {
  // Expects: STAMP-{monthly|yearly}-{cuid}-{ts}
  const match = ref.match(/^STAMP-(monthly|yearly)-([a-z0-9]+)-\d+$/);
  if (!match) return { plan: null, userId: null };
  return { plan: match[1] as WompiPlan, userId: match[2] };
}

// ── Integrity signature ──────────────────────────────
// SHA256( reference + amountCents + currency + integritySecret )

export function buildIntegritySignature(
  reference: string,
  amountCents: number,
  currency: string,
  secret: string
): string {
  const raw = `${reference}${amountCents}${currency}${secret}`;
  return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
}

// ── Checkout URL builder ─────────────────────────────

export function buildCheckoutUrl(params: {
  publicKey: string;
  integritySecret: string;
  reference: string;
  amountCents: number;
  currency?: string;
  redirectUrl: string;
  customerEmail?: string;
}): string {
  const { publicKey, integritySecret, reference, amountCents,
          currency = "COP", redirectUrl, customerEmail } = params;

  const sig = buildIntegritySignature(reference, amountCents, currency, integritySecret);

  const url = new URL(WOMPI_CHECKOUT_URL);
  url.searchParams.set("public-key",           publicKey);
  url.searchParams.set("currency",             currency);
  url.searchParams.set("amount-in-cents",      amountCents.toString());
  url.searchParams.set("reference",            reference);
  url.searchParams.set("redirect-url",         redirectUrl);
  url.searchParams.set("signature:integrity",  sig);
  if (customerEmail) {
    url.searchParams.set("customer-data:email", customerEmail);
  }

  return url.toString();
}

// ── Webhook signature verification ───────────────────
// Wompi signs the event JSON with HMAC-SHA256 using the events secret

function getValueByPath(source: unknown, dottedPath: string) {
  return dottedPath.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

export function verifyWompiEvent(
  event: WompiTransactionEvent,
  signature: string,
  eventsSecret: string
): boolean {
  try {
    const concatenated = (event.signature?.properties ?? [])
      .map((property) => String(getValueByPath(event.data, property) ?? ""))
      .join("");
    const payload = `${concatenated}${event.timestamp}${eventsSecret}`;
    const expected = crypto.createHash("sha256").update(payload, "utf8").digest("hex");
    return expected.toLowerCase() === signature.toLowerCase();
  } catch {
    return false;
  }
}

// ── Wompi event types ────────────────────────────────

export interface WompiTransactionEvent {
  event:      "transaction.updated";
  data: {
    transaction: {
      id:              string;
      reference:       string;
      status:          "APPROVED" | "DECLINED" | "ERROR" | "VOIDED" | "PENDING";
      amount_in_cents: number;
      currency:        string;
      customer_email:  string;
      payment_method_type: string;
    };
  };
  sent_at:     string;
  timestamp:   number;
  signature: { properties: string[]; checksum: string };
}
