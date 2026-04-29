"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFanTitle } from "@/lib/xp";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  favoriteTeam: string | null;
  countryCode: string | null;
  stickerCount: number;
  isMe: boolean;
}

interface RecentMember {
  id: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  stickerCount: number;
  streakDays: number;
  favoriteTeam: string | null;
  createdAt: string;
  isMe: boolean;
}

interface CurrentUser {
  id: string;
  username: string;
  level: number;
  xp: number;
  myRank: number | null;
}

interface RankingClientProps {
  initialLeaderboard: LeaderboardEntry[];
  currentUser: CurrentUser;
  recentMembers: RecentMember[];
}

const TEAM_FLAGS: Record<string, string> = {
  USA: "🇺🇸", MEX: "🇲🇽", CAN: "🇨🇦", ARG: "🇦🇷", BRA: "🇧🇷",
  FRA: "🇫🇷", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ESP: "🇪🇸", GER: "🇩🇪", POR: "🇵🇹",
  NED: "🇳🇱", BEL: "🇧🇪", ITA: "🇮🇹", CRO: "🇭🇷", DEN: "🇩🇰",
  URU: "🇺🇾", COL: "🇨🇴", ECU: "🇪🇨", MAR: "🇲🇦", SEN: "🇸🇳",
  NGA: "🇳🇬", EGY: "🇪🇬", JPN: "🇯🇵", KOR: "🇰🇷", AUS: "🇦🇺",
  IRN: "🇮🇷", SAU: "🇸🇦", QAT: "🇶🇦", GHA: "🇬🇭", SUI: "🇨🇭",
  AUT: "🇦🇹", NZL: "🇳🇿",
};

const RANK_BADGES: Record<number, { emoji: string; color: string; label: string }> = {
  1: { emoji: "🥇", color: "#FFB800", label: "Gold" },
  2: { emoji: "🥈", color: "#94A3B8", label: "Silver" },
  3: { emoji: "🥉", color: "#CD7F32", label: "Bronze" },
};

type Tab = "global" | "country" | "newMembers";

// Time-ago helper
function timeAgo(dateStr: string): { value: number; unit: "days" | "hours" | "minutes" | "now" } {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days  >= 1) return { value: days,  unit: "days"    };
  if (hours >= 1) return { value: hours, unit: "hours"   };
  if (mins  >= 1) return { value: mins,  unit: "minutes" };
  return              { value: 0,     unit: "now"      };
}

export default function RankingClient({
  initialLeaderboard,
  currentUser,
  recentMembers,
}: RankingClientProps) {
  const { locale, t } = useLanguage();
  const [tab, setTab] = useState<Tab>("global");
  const [search, setSearch] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const copy = locale === "es"
    ? {
        search: "Buscar fan o equipo...",
        countrySoon: "Muy pronto podras competir contra fans de tu pais.",
        communityEarly: "La comunidad apenas esta arrancando. Llegaste temprano.",
        founderIntro: "Los primeros 1000 fans reciben el ",
        you: "TU",
        stickers: "estampas",
        noFans: (value: string) => `No encontramos fans para "${value}"`,
      }
    : {
        search: "Search fan or team...",
        countrySoon: "Coming soon — compete against fans from your country!",
        communityEarly: "Be an early adopter — the community is just getting started!",
        founderIntro: "First 1000 fans get the ",
        you: "YOU",
        stickers: "stickers",
        noFans: (value: string) => `No fans found for "${value}"`,
      };

  const filtered = initialLeaderboard.filter(
    (u) =>
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.favoriteTeam?.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = initialLeaderboard.slice(0, 3);
  const rest = filtered.slice(tab === "global" ? 3 : 0);

  const scrollToMe = () => {
    setSearch("");
    setHighlightedId(currentUser.id);
    setTimeout(() => {
      const el = document.getElementById(`row-${currentUser.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightedId(null), 2000);
    }, 100);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white">{t("ranking.title")} 🏆</h1>
            <p className="text-white/40 text-sm">{t("ranking.subtitle")}</p>
          </div>
          {currentUser.myRank && (
            <button
              onClick={scrollToMe}
              className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors"
            >
              <span className="text-[#FFB800] text-xs font-bold uppercase tracking-wider">
                {t("ranking.yourRank")}
              </span>
              <span className="text-white font-black text-xl">
                #{currentUser.myRank}
              </span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4">
          {(["global", "country", "newMembers"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                tab === tabKey
                  ? "bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tabKey === "country"    ? t("ranking.country")
               : tabKey === "newMembers" ? t("ranking.newMembers")
               : t("ranking.global")}
              {tabKey === "newMembers" && recentMembers.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00D97E] text-[9px] font-black text-white flex items-center justify-center">
                  {recentMembers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input
            type="text"
            placeholder={copy.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF5E00]/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Podium (Top 3) — only when not searching and on global tab */}
        {!search && tab === "global" && top3.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-center gap-3 mb-8 pt-4"
          >
            {/* 2nd place */}
            <PodiumCard entry={top3[1]} position={2} currentUserId={currentUser.id} />
            {/* 1st place */}
            <PodiumCard entry={top3[0]} position={1} currentUserId={currentUser.id} />
            {/* 3rd place */}
            <PodiumCard entry={top3[2]} position={3} currentUserId={currentUser.id} />
          </motion.div>
        )}

        {/* Country tab placeholder */}
        {tab === "country" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-white font-black text-xl mb-2">{t("ranking.country")}</h3>
            <p className="text-white/40 text-sm max-w-xs">
              {copy.countrySoon}
            </p>
          </div>
        )}

        {/* ---- NEW MEMBERS TAB ---- */}
        {tab === "newMembers" && (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h2 className="text-white font-black text-lg">{t("ranking.recentlyJoined")} 🌱</h2>
                <p className="text-white/40 text-xs">{t("ranking.welcomeNew")}</p>
              </div>
            </div>

            {recentMembers.length === 0 ? (
              <div className="text-center py-12 text-white/30">{t("common.loading")}</div>
            ) : (
              recentMembers.map((member, i) => {
                const ago    = timeAgo(member.createdAt);
                const isVeryNew = ago.unit === "now" || (ago.unit === "hours" && ago.value < 2);
                const agoStr = ago.unit === "now"      ? t("ranking.joinedJustNow")
                             : ago.unit === "minutes"  ? t("ranking.joinedMinutesAgo", { n: ago.value })
                             : ago.unit === "hours"    ? t("ranking.joinedHoursAgo",   { n: ago.value })
                             :                           t("ranking.joinedDaysAgo",    { n: ago.value });

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`relative rounded-2xl p-4 border transition-all ${
                      member.isMe
                        ? "border-[#FF5E00]/60 bg-[#FF5E00]/10"
                        : isVeryNew
                          ? "border-[#00D97E]/40 bg-[#00D97E]/5"
                          : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    {/* Very new pulse */}
                    {isVeryNew && (
                      <div className="absolute top-3 right-3">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D97E] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D97E]" />
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 shrink-0 overflow-hidden ${
                          member.isMe
                            ? "border-[#FF5E00] bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-white"
                            : "border-white/20 bg-white/10 text-white"
                        }`}
                      >
                        {member.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.avatarUrl} alt={member.username} className="w-full h-full object-cover" />
                        ) : (
                          member.username.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-black text-sm truncate ${member.isMe ? "text-[#FF5E00]" : "text-white"}`}>
                            {member.username}
                          </span>
                          {/* Welcome badge */}
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                            style={{ background: "#00D97E20", color: "#00D97E", border: "1px solid #00D97E40" }}>
                            👋 {t("ranking.justJoined")}
                          </span>
                          {/* Streak badge */}
                          {member.streakDays >= 3 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                              style={{ background: "#FFB80020", color: "#FFB800", border: "1px solid #FFB80040" }}>
                              🔥 {member.streakDays}d {t("ranking.streak")}
                            </span>
                          )}
                          {/* Team flag */}
                          {member.favoriteTeam && (
                            <span className="text-sm">{TEAM_FLAGS[member.favoriteTeam] ?? ""}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-white/40 text-xs">Lv.{member.level}</span>
                          <span className="text-white/40 text-xs">{member.xp.toLocaleString()} XP</span>
                          <span className="text-white/40 text-xs">{member.stickerCount} {t("ranking.stickers")}</span>
                        </div>
                      </div>

                      {/* Joined time */}
                      <div className="text-right shrink-0">
                        <p className="text-white/30 text-xs">{agoStr}</p>
                        <div className="mt-1 flex items-center justify-end gap-1">
                          {/* XP progress mini bar */}
                          <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, (member.xp % 1000) / 10)}%`,
                                background: "linear-gradient(90deg, #E8003D, #FF5E00)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            {/* Gamification nudge footer */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-white/60 text-xs">
                🏆 {copy.communityEarly}
              </p>
              <p className="text-white/30 text-[10px] mt-1">
                {copy.founderIntro}<span className="text-[#FFB800] font-black">Founder Badge</span>
              </p>
            </div>
          </div>
        )}

        {/* Regular list */}
        {tab === "global" && (
          <div className="space-y-2">
            {(search ? filtered : rest).map((entry) => (
              <motion.div
                key={entry.id}
                id={`row-${entry.id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  backgroundColor:
                    highlightedId === entry.id
                      ? "rgba(255,94,0,0.15)"
                      : "transparent",
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors ${
                  entry.isMe
                    ? "border-[#FF5E00]/40 bg-[#FF5E00]/10"
                    : "border-white/5 hover:border-white/15 hover:bg-white/3"
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {RANK_BADGES[entry.rank] ? (
                    <span className="text-lg">{RANK_BADGES[entry.rank].emoji}</span>
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        entry.isMe ? "text-[#FF5E00]" : "text-white/40"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm ${
                    entry.isMe
                      ? "bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {entry.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    entry.username.slice(0, 2).toUpperCase()
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-bold text-sm truncate ${
                        entry.isMe ? "text-[#FF5E00]" : "text-white"
                      }`}
                    >
                      {entry.username}
                    </span>
                    {entry.isMe && (
                      <span className="text-[10px] bg-[#FF5E00]/20 text-[#FF5E00] rounded-full px-1.5 py-0.5 font-bold flex-shrink-0">
                        {copy.you}
                      </span>
                    )}
                    {entry.favoriteTeam && (
                      <span className="flex-shrink-0 text-sm">
                        {TEAM_FLAGS[entry.favoriteTeam] ?? "⚽"}
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate">
                    {getFanTitle(entry.level)} · Lv.{entry.level} · {entry.stickerCount} {copy.stickers}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm">
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-white/30 text-xs">XP</p>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && search && (
              <div className="text-center py-12">
                <p className="text-white/30 text-sm">{copy.noFans(search)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* My position sticky bar (if outside top 100) */}
      {currentUser.myRank && currentUser.myRank > 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 px-6 py-3 border-t border-white/10 bg-[#07070F]"
        >
          <div className="flex items-center gap-3 bg-[#FF5E00]/10 border border-[#FF5E00]/30 rounded-xl px-4 py-3">
            <span className="text-[#FF5E00] font-black text-lg">#{currentUser.myRank}</span>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{currentUser.username}</p>
              <p className="text-white/40 text-xs">{currentUser.xp.toLocaleString()} XP · Lv.{currentUser.level}</p>
            </div>
            <button
              onClick={() => setSearch(currentUser.username)}
              className="text-[#FF5E00] text-xs font-bold hover:opacity-80"
            >
              {t("ranking.findMe")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PodiumCard({
  entry,
  position,
  currentUserId,
}: {
  entry: LeaderboardEntry;
  position: number;
  currentUserId: string;
}) {
  const badge = RANK_BADGES[position];
  const heights = { 1: "h-28", 2: "h-20", 3: "h-16" };
  const isMe = entry.id === currentUserId;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base border-2 ${
          isMe
            ? "border-[#FF5E00] bg-gradient-to-br from-[#E8003D] to-[#FF5E00] text-white"
            : position === 1
            ? "border-[#FFB800] bg-[#FFB800]/20 text-[#FFB800]"
            : "border-white/20 bg-white/10 text-white"
        }`}
        style={{ order: position === 1 ? -1 : 0 }}
      >
        {entry.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.avatarUrl}
            alt={entry.username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          entry.username.slice(0, 2).toUpperCase()
        )}
      </div>

      <div className="text-center">
        <p
          className={`font-bold text-xs truncate max-w-20 ${
            isMe ? "text-[#FF5E00]" : "text-white"
          }`}
        >
          {entry.username}
        </p>
        <p className="text-white/40 text-[10px]">{entry.xp.toLocaleString()} XP</p>
      </div>

      {/* Podium block */}
      <div
        className={`w-20 ${heights[position as keyof typeof heights]} rounded-t-xl flex items-center justify-center text-2xl`}
        style={{
          background:
            position === 1
              ? "linear-gradient(to top, rgba(255,184,0,0.3), rgba(255,184,0,0.1))"
              : position === 2
              ? "linear-gradient(to top, rgba(148,163,184,0.3), rgba(148,163,184,0.1))"
              : "linear-gradient(to top, rgba(205,127,50,0.3), rgba(205,127,50,0.1))",
          borderTop: `2px solid ${badge.color}40`,
        }}
      >
        <span>{badge.emoji}</span>
      </div>
    </div>
  );
}
