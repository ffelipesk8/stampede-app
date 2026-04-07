import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ── Key helpers ──────────────────────────────────────
export const REDIS_KEYS = {
  session:          (userId: string) => `session:${userId}`,
  leaderboard:      "leaderboard:global",
  leaderboardCountry: (code: string) => `leaderboard:${code}`,
  albumProgress:    (userId: string) => `album:${userId}:progress`,
  rateLimit:        (userId: string, action: string) => `rl:${userId}:${action}`,
  coachDaily:       (userId: string) => `coach:${userId}:daily`,
  dropCountdown:    (packId: string) => `drop:${packId}:countdown`,
  freePack:         (userId: string) => `free_pack:${userId}:date`,
} as const;
