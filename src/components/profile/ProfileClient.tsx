"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type BadgeRarity = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "LEGENDARY";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  earnedAt: string;
}

interface XpProgress {
  current: number;
  needed: number;
  pct: number;
}

interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  countryCode: string | null;
  favoriteTeam: string | null;
  level: number;
  xp: number;
  coins: number;
  streakDays: number;
  isPro: boolean;
  proExpiresAt: string | null;
  referralCode: string;
  createdAt: string;
  fanTitle: string;
  xpProgress: XpProgress;
  globalRank: number;
  stickerCount: number;
  totalStickers: number;
  completionPct: number;
  eventCount: number;
  referralCount: number;
  badges: Badge[];
}

const BADGE_RARITY_CONFIG: Record<BadgeRarity, { color: string; bg: string }> = {
  BRONZE:    { color: "#CD7F32", bg: "rgba(205,127,50,0.15)"  },
  SILVER:    { color: "#94A3B8", bg: "rgba(148,163,184,0.15)" },
  GOLD:      { color: "#FFB800", bg: "rgba(255,184,0,0.15)"   },
  PLATINUM:  { color: "#E2E8F0", bg: "rgba(226,232,240,0.15)" },
  LEGENDARY: { color: "#A78BFA", bg: "rgba(167,139,250,0.15)" },
};

const TEAM_FLAGS: Record<string, string> = {
  USA:"🇺🇸",MEX:"🇲🇽",CAN:"🇨🇦",ARG:"🇦🇷",BRA:"🇧🇷",FRA:"🇫🇷",ENG:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ESP:"🇪🇸",GER:"🇩🇪",POR:"🇵🇹",NED:"🇳🇱",BEL:"🇧🇪",ITA:"🇮🇹",CRO:"🇭🇷",
  DEN:"🇩🇰",URU:"🇺🇾",COL:"🇨🇴",ECU:"🇪🇨",MAR:"🇲🇦",SEN:"🇸🇳",NGA:"🇳🇬",
  EGY:"🇪🇬",JPN:"🇯🇵",KOR:"🇰🇷",AUS:"🇦🇺",IRN:"🇮🇷",SAU:"🇸🇦",QAT:"🇶🇦",
  GHA:"🇬🇭",SUI:"🇨🇭",AUT:"🇦🇹",NZL:"🇳🇿",
};

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const [copied, setCopied] = useState(false);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleCopyReferral = async () => {
    await navigator.clipboard.writeText(
      `https://stampede.app/join?ref=${user.referralCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STATS = [
    { label: "Global Rank",    value: `#${user.globalRank.toLocaleString()}`, icon: "🏆", color: "#FFB800" },
    { label: "Stickers",       value: `${user.stickerCount}/${user.totalStickers}`, icon: "📎", color: "#60A5FA" },
    { label: "Streak",         value: `${user.streakDays}d`,  icon: "🔥", color: "#FF5E00" },
    { label: "Events",         value: user.eventCount,        icon: "📅", color: "#4ADE80" },
    { label: "Referrals",      value: user.referralCount,     icon: "👥", color: "#A78BFA" },
    { label: "Coins",          value: user.coins.toLocaleString(), icon: "🪙", color: "#FFB800" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-start gap-5 flex-wrap">
          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white ${
                user.isPro
                  ? "bg-gradient-to-br from-[#FFB800] to-[#FF5E00]"
                  : "bg-gradient-to-br from-[#E8003D] to-[#FF5E00]"
              }`}
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                user.username.slice(0, 2).toUpperCase()
              )}
            </div>
            {user.isPro && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFB800] to-[#FF5E00] text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                PRO
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-black text-2xl">{user.username}</h1>
              {user.favoriteTeam && (
                <span className="text-xl">{TEAM_FLAGS[user.favoriteTeam] ?? "⚽"}</span>
              )}
            </div>
            <p className="text-[#FF5E00] text-sm font-semibold mt-0.5">{user.fanTitle}</p>
            <p className="text-white/40 text-xs mt-1">Member since {memberSince}</p>

            {/* Level + XP bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-bold">Level {user.level}</span>
                <span className="text-white/40 text-xs">
                  {user.xpProgress.current.toLocaleString()} / {user.xpProgress.needed.toLocaleString()} XP
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.xpProgress.pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800]"
                />
              </div>
            </div>
          </div>

          {/* Upgrade / PRO info */}
          <div className="flex-shrink-0">
            {user.isPro ? (
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl px-3 py-2">
                  <span className="text-[#FFB800] text-sm font-black">⚡ PRO Active</span>
                </div>
                {user.proExpiresAt && (
                  <p className="text-white/30 text-xs mt-1">
                    Renews {new Date(user.proExpiresAt).toLocaleDateString()}
                  </p>
                )}
                <a
                  href="/api/stripe/portal"
                  className="text-white/30 text-xs hover:text-white/60 transition-colors mt-1 block"
                >
                  Manage subscription →
                </a>
              </div>
            ) : (
              <Link
                href="/upgrade"
                className="block bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-center"
              >
                ⚡ Upgrade to PRO
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 md:grid-cols-6 gap-3"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <p className="font-black text-lg leading-none" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Album completion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold">Album Completion</h2>
          <span className="text-white font-black text-xl">{user.completionPct}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${user.completionPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #4ADE80 0%, #22C55E ${user.completionPct}%)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-xs">
            {user.stickerCount} of {user.totalStickers} stickers collected
          </p>
          <Link
            href="/album"
            className="text-[#4ADE80] text-xs font-bold hover:opacity-80 transition-opacity"
          >
            View album →
          </Link>
        </div>
      </motion.div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Badges earned</h2>
            <span className="text-white/40 text-sm">{user.badges.length}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {user.badges.map((badge, i) => {
              const cfg = BADGE_RARITY_CONFIG[badge.rarity];
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  title={`${badge.name} — ${badge.description}`}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-help"
                  style={{ borderColor: cfg.color + "40", backgroundColor: cfg.bg }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-[10px] font-bold text-center leading-tight" style={{ color: cfg.color }}>
                    {badge.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Referral */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <h2 className="text-white font-bold mb-1">Referral link</h2>
        <p className="text-white/40 text-sm mb-4">
          Invite friends and both of you earn a free pack + 100 XP
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[#FFB800] text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-mono truncate">
            stampede.app/join?ref={user.referralCode}
          </code>
          <button
            onClick={handleCopyReferral}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              copied
                ? "bg-[#4ADE80] text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-white/30 text-xs mt-2">
          {user.referralCount} friend{user.referralCount !== 1 ? "s" : ""} joined via your link
        </p>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border border-white/5 rounded-2xl p-5"
      >
        <h3 className="text-white/30 text-xs font-bold uppercase tracking-wider mb-3">Account</h3>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-white/50 text-sm">{user.email}</p>
          <a
            href="/sign-out"
            className="text-white/30 text-sm hover:text-red-400 transition-colors font-semibold"
          >
            Sign out
          </a>
        </div>
      </motion.div>
    </div>
  );
}
