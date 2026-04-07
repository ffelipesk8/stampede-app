import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis environment variables");
  }

  if (!redisInstance) {
    redisInstance = new Redis({ url, token });
  }

  return redisInstance;
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    return Reflect.get(getRedis(), prop, receiver);
  },
});

export const REDIS_KEYS = {
  session: (userId: string) => `session:${userId}`,
  leaderboard: "leaderboard:global",
  leaderboardCountry: (code: string) => `leaderboard:${code}`,
  albumProgress: (userId: string) => `album:${userId}:progress`,
  rateLimit: (userId: string, action: string) => `rl:${userId}:${action}`,
  coachDaily: (userId: string) => `coach:${userId}:daily`,
  dropCountdown: (packId: string) => `drop:${packId}:countdown`,
  freePack: (userId: string) => `free_pack:${userId}:date`,
} as const;
