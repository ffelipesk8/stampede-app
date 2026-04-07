"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 32 World Cup 2026 teams with flag emojis and group info
const TEAMS = [
  // Group A
  { code: "USA", name: "United States", flag: "🇺🇸", confederation: "CONCACAF" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", confederation: "CONCACAF" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", confederation: "CONCACAF" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", confederation: "CONMEBOL" },
  // Group B
  { code: "ARG", name: "Argentina", flag: "🇦🇷", confederation: "CONMEBOL" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", confederation: "CONMEBOL" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", confederation: "CONMEBOL" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", confederation: "CONMEBOL" },
  // Group C
  { code: "FRA", name: "France", flag: "🇫🇷", confederation: "UEFA" },
  { code: "ENG", name: "England", flag: "󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { code: "ESP", name: "Spain", flag: "🇪🇸", confederation: "UEFA" },
  { code: "GER", name: "Germany", flag: "🇩🇪", confederation: "UEFA" },
  // Group D
  { code: "POR", name: "Portugal", flag: "🇵🇹", confederation: "UEFA" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", confederation: "UEFA" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", confederation: "UEFA" },
  { code: "ITA", name: "Italy", flag: "🇮🇹", confederation: "UEFA" },
  // Group E
  { code: "CRO", name: "Croatia", flag: "🇭🇷", confederation: "UEFA" },
  { code: "DEN", name: "Denmark", flag: "🇩🇰", confederation: "UEFA" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", confederation: "UEFA" },
  { code: "AUT", name: "Austria", flag: "🇦🇹", confederation: "UEFA" },
  // Group F
  { code: "MAR", name: "Morocco", flag: "🇲🇦", confederation: "CAF" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", confederation: "CAF" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", confederation: "CAF" },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", confederation: "CAF" },
  // Group G
  { code: "JPN", name: "Japan", flag: "🇯🇵", confederation: "AFC" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", confederation: "AFC" },
  { code: "AUS", name: "Australia", flag: "🇦🇺", confederation: "AFC" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", confederation: "AFC" },
  // Group H
  { code: "SAU", name: "Saudi Arabia", flag: "🇸🇦", confederation: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", confederation: "AFC" },
  { code: "NZL", name: "New Zealand", flag: "🇳🇿", confederation: "OFC" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", confederation: "CAF" },
];

const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: "#4A6CF7",
  CONMEBOL: "#22C55E",
  CONCACAF: "#F59E0B",
  CAF: "#EF4444",
  AFC: "#EC4899",
  OFC: "#8B5CF6",
};

export default function TeamSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confederations = ["ALL", "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC"];

  const filtered =
    filter === "ALL" ? TEAMS : TEAMS.filter((t) => t.confederation === filter);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteTeam: selected, onboardingStep: 2 }),
      });
      if (!res.ok) throw new Error("Failed to save team");
      router.push("/onboarding/pack");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const selectedTeam = TEAMS.find((t) => t.code === selected);

  return (
    <div className="w-full max-w-2xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === 1
                ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]"
                : s < 1
                ? "w-8 bg-white/30"
                : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-[#FF5E00] text-sm font-semibold uppercase tracking-widest mb-2">
          Step 1 of 5
        </p>
        <h1 className="text-4xl font-black text-white mb-3">
          Pick your team ⚽
        </h1>
        <p className="text-white/60 text-lg">
          Choose the team you&apos;ll be supporting at the 2026 World Cup
        </p>
      </motion.div>

      {/* Confederation filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {confederations.map((conf) => (
          <button
            key={conf}
            onClick={() => setFilter(conf)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === conf
                ? "bg-[#FF5E00] text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {conf}
          </button>
        ))}
      </div>

      {/* Team grid */}
      <motion.div
        layout
        className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-8 max-h-80 overflow-y-auto pr-1 scrollbar-thin"
      >
        <AnimatePresence>
          {filtered.map((team) => (
            <motion.button
              key={team.code}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(team.code)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                selected === team.code
                  ? "border-[#FF5E00] bg-[#FF5E00]/20 shadow-lg shadow-[#FF5E00]/30"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              {/* Confederation dot */}
              <div
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: CONFEDERATION_COLORS[team.confederation],
                }}
              />
              <span className="text-2xl">{team.flag}</span>
              <span className="text-[10px] font-bold text-white/80 text-center leading-tight">
                {team.code}
              </span>
              {selected === team.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF5E00] rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-[10px]">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Selected team display */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
          >
            <span className="text-4xl">{selectedTeam.flag}</span>
            <div>
              <p className="text-white font-bold text-lg">{selectedTeam.name}</p>
              <p className="text-white/40 text-sm">{selectedTeam.confederation}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[#FFB800] text-sm">Your team 🔥</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
          selected && !loading
            ? "bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 shadow-lg shadow-[#FF5E00]/30"
            : "bg-white/10 text-white/30 cursor-not-allowed"
        }`}
      >
        {loading ? "Saving…" : selected ? `Let's go, ${selectedTeam?.name}! →` : "Select your team"}
      </button>
    </div>
  );
}
