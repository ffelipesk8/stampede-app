import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

type ClerkSeedData = {
  clerkId: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
};

const LOGIN_STREAK_TIME_ZONE = "America/Bogota";

const DAILY_REWARD_TIERS = [
  { minDays: 1, cards: 3 },
  { minDays: 2, cards: 4 },
  { minDays: 3, cards: 6 },
  { minDays: 4, cards: 8 },
  { minDays: 5, cards: 10 },
  { minDays: 7, cards: 12 },
  { minDays: 10, cards: 14 },
  { minDays: 14, cards: 16 },
  { minDays: 21, cards: 18 },
  { minDays: 30, cards: 20 },
] as const;

function getDayKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LOGIN_STREAK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

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

export function getDailyRewardCardCount(streakDays: number) {
  const safeStreak = Math.max(1, streakDays);
  let cardCount: number = DAILY_REWARD_TIERS[0].cards;

  for (const tier of DAILY_REWARD_TIERS) {
    if (safeStreak >= tier.minDays) {
      cardCount = tier.cards;
    } else {
      break;
    }
  }

  return cardCount;
}

export function getNextDailyRewardTier(streakDays: number) {
  const safeStreak = Math.max(1, streakDays);
  return DAILY_REWARD_TIERS.find((tier) => tier.minDays > safeStreak) ?? null;
}

export function getDailyRewardDayKey(date: Date = new Date()) {
  return getDayKey(date);
}

export async function syncUserDailyStreak(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, streakDays: true, lastActiveAt: true },
  });

  if (!user) return null;

  const now = new Date();
  const todayKey = getDayKey(now);
  const lastActiveKey = getDayKey(user.lastActiveAt);

  if (todayKey === lastActiveKey) {
    if (user.streakDays <= 0) {
      return db.user.update({
        where: { id: user.id },
        data: { streakDays: 1 },
        select: { id: true, streakDays: true, lastActiveAt: true },
      });
    }

    return user;
  }

  const yesterdayKey = getDayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const nextStreakDays = lastActiveKey === yesterdayKey ? Math.max(1, user.streakDays) + 1 : 1;

  return db.user.update({
    where: { id: user.id },
    data: {
      streakDays: nextStreakDays,
      lastActiveAt: now,
    },
    select: { id: true, streakDays: true, lastActiveAt: true },
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
