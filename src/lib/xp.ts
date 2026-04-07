import { db } from "./db";
import { redis, REDIS_KEYS } from "./redis";

// XP required per level (exponential curve)
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.4, level - 1));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let totalXp = 0;
  while (totalXp + xpForLevel(level) <= xp) {
    totalXp += xpForLevel(level);
    level++;
  }
  return Math.min(level, 100);
}

export const XP_ACTIONS = {
  PACK_OPEN:       50,
  STICKER_PLACE:   10,
  MISSION_DAILY:   80,
  MISSION_WEEKLY:  200,
  FIRST_LOGIN:     25,
  STREAK_BONUS:    15,
  TRADE_COMPLETE:  20,
  EVENT_JOIN:      30,
  COACH_CHAT:      5,    // max 25/day
  INVITE_FRIEND:   100,
  ALBUM_5PCT:      200,
  ALBUM_25PCT:     500,
  ALBUM_50PCT:     1000,
  ALBUM_75PCT:     2000,
  ALBUM_100PCT:    5000,
} as const;

export type XpAction = keyof typeof XP_ACTIONS;

/**
 * Award XP to a user and update their level.
 * Returns { newXp, newLevel, levelUp }
 */
export async function awardXp(userId: string, action: XpAction) {
  const amount = XP_ACTIONS[action];
  
  const user = await db.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
    select: { xp: true, level: true },
  });

  const newLevel = levelFromXp(user.xp);
  const levelUp = newLevel > user.level;

  if (levelUp) {
    await db.user.update({
      where: { id: userId },
      data: { level: newLevel },
    });
  }

  // Update leaderboard sorted set
  await redis.zadd(REDIS_KEYS.leaderboard, { score: user.xp, member: userId });

  return { newXp: user.xp, newLevel, levelUp, xpEarned: amount };
}

export const FAN_TITLES: Record<number, string> = {
  1:  "Rookie Fan",
  5:  "Match Watcher",
  10: "Rising Star",
  15: "Sticker Hunter",
  20: "Fan Zone Regular",
  30: "Hooligan (Friendly)",
  40: "Stadium Veteran",
  50: "Ultras Member",
  60: "Legend of the Terraces",
  75: "World Cup Icon",
  90: "GOAT Fan",
  100: "STAMPEDE Legend",
};

export function getFanTitle(level: number): string {
  const thresholds = Object.keys(FAN_TITLES).map(Number).sort((a, b) => b - a);
  for (const t of thresholds) {
    if (level >= t) return FAN_TITLES[t];
  }
  return "Rookie Fan";
}
