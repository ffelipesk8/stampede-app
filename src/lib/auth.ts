import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user from DB.
 * Creates the user record if it doesn't exist (post Clerk webhook race condition).
 */
export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Fallback: create from Clerk data (webhook may not have fired yet)
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const username =
      clerkUser.username ??
      clerkUser.emailAddresses[0].emailAddress.split("@")[0] +
        Math.floor(Math.random() * 1000);

    return db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        username,
        avatarUrl: clerkUser.imageUrl,
        referralCode: generateReferralCode(),
      },
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
