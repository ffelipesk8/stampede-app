import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

type ClerkSeedData = {
  clerkId: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
};

async function createUniqueUsername(baseValue: string) {
  const base =
    baseValue
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 18) || "fan";

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const suffix = attempt === 0 ? "" : Math.floor(100 + Math.random() * 900).toString();
    const candidate = `${base}${suffix}`.slice(0, 24);
    const existing = await db.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
  }

  return `${base}${Date.now().toString().slice(-6)}`.slice(0, 24);
}

export async function upsertUserFromClerkData(data: ClerkSeedData) {
  const normalizedEmail = data.email.trim().toLowerCase();

  let user = await db.user.findUnique({ where: { clerkId: data.clerkId } });
  if (user) {
    return user;
  }

  const existingByEmail = normalizedEmail
    ? await db.user.findUnique({ where: { email: normalizedEmail } })
    : null;

  if (existingByEmail) {
    return db.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId: data.clerkId,
        avatarUrl: data.avatarUrl ?? existingByEmail.avatarUrl,
        email: normalizedEmail || existingByEmail.email,
      },
    });
  }

  const username = await createUniqueUsername(
    data.username?.trim() || normalizedEmail.split("@")[0] || `fan${data.clerkId.slice(-6)}`
  );

  return db.user.create({
    data: {
      clerkId: data.clerkId,
      email: normalizedEmail,
      username,
      avatarUrl: data.avatarUrl ?? "",
      referralCode: generateReferralCode(),
    },
  });
}

/**
 * Get the current authenticated user from DB.
 * Creates the user record if it doesn't exist (post Clerk webhook race condition).
 */
export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return getOrCreateUserByClerkId(userId);
}

export async function getOrCreateUserByClerkId(clerkId: string) {
  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // Fallback: create from Clerk data (webhook may not have fired yet)
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    return upsertUserFromClerkData({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      username: clerkUser.username,
      avatarUrl: clerkUser.imageUrl,
    });
  }

  return user;
}

/**
 * Require PRO subscription. Redirects to upgrade page if not PRO.
 */
export async function requirePro() {
  const user = await getAuthUser();
  if (!user.isPro) redirect("/upgrade");
  return user;
}

/**
 * Generate a short unique referral code from user's cuid.
 */
export function generateReferralCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
