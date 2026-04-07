import { Rarity, PackType, ListingStatus, EventType, MissionType } from "@prisma/client";

export type { Rarity, PackType, ListingStatus, EventType, MissionType };

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  countryCode: string | null;
  favoriteTeam: string | null;
  xp: number;
  level: number;
  streakDays: number;
  isPro: boolean;
  onboardingStep: number;
  fanTitle: string;
  xpProgress: { current: number; needed: number; pct: number };
  stickerCount: number;
}

export interface StickerWithOwnership {
  id: string;
  slug: string;
  name: string;
  playerName: string | null;
  team: string;
  category: string;
  rarity: Rarity;
  imageUrl: string;
  isCustom: boolean;
  customImageUrl: string | null;
  quantity: number;
}

export interface PackOpenResult {
  stickers: Array<{
    id: string;
    name: string;
    rarity: Rarity;
    team: string;
    imageUrl: string;
  }>;
  xpEarned: number;
  newXp: number;
  newLevel: number;
  levelUp: boolean;
}

export interface CoachStreamChunk {
  delta?: string;
  conversationId?: string;
  done?: boolean;
  upsell?: boolean;
  message?: string;
}
