"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const TEAMS = [
  { code: "USA", name: "United States", flag: "🇺🇸", confederation: "CONCACAF" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", confederation: "CONCACAF" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", confederation: "CONCACAF" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", confederation: "CONMEBOL" },
  { code: "ARG", name: "Argentina", flag: "🇦🇷", confederation: "CONMEBOL" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", confederation: "CONMEBOL" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", confederation: "CONMEBOL" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", confederation: "CONMEBOL" },
  { code: "FRA", name: "France", flag: "🇫🇷", confederation: "UEFA" },
  { code: "ENG", name: "England", flag: "🏴", confederation: "UEFA" },
  { code: "ESP", name: "Spain", flag: "🇪🇸", confederation: "UEFA" },
  { code: "GER", name: "Germany", flag: "🇩🇪", confederation: "UEFA" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", confederation: "UEFA" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", confederation: "UEFA" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", confederation: "UEFA" },
  { code: "ITA", name: "Italy", flag: "🇮🇹", confederation: "UEFA" },
  { code: "CRO", name: "Croatia", flag: "🇭🇷", confederation: "UEFA" },
  { code: "DEN", name: "Denmark", flag: "🇩🇰", confederation: "UEFA" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", confederation: "UEFA" },
  { code: "AUT", name: "Austria", flag: "🇦🇹", confederation: "UEFA" },
  { code: "MAR", name: "Morocco", flag: "🇲🇦", confederation: "CAF" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", confederation: "CAF" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", confederation: "CAF" },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", confederation: "CAF" },
  { code: "JPN", name: "Japan", flag: "🇯🇵", confederation: "AFC" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", confederation: "AFC" },
  { code: "AUS", name: "Australia", flag: "🇦🇺", confederation: "AFC" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", confederation: "AFC" },
  { code: "SAU", name: "Saudi Arabia", flag: "🇸🇦", confederation: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", confederation: "AFC" },
  { code: "NZL", name: "New Zealand", flag: "🇳🇿", confederation: "OFC" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", confederation: "CAF" },
] as const;

const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: "#4A6CF7",
  CONMEBOL: "#22C55E",
  CONCACAF: "#F59E0B",
  CAF: "#EF4444",
  AFC: "#EC4899",
  OFC: "#8B5CF6",
};

const COPY = {
  en: {
    step: "Step 1 of 5",
    title: "Pick your team",
    subtitle: "Choose the national team you will support during the World Cup 2026 journey.",
    all: "ALL",
    saveError: "Something went wrong. Try again.",
    yourTeam: "Your team",
    saving: "Saving...",
    letsGo: (name: string) => `Let's go, ${name}! ->`,
    select: "Select your team",
  },
  es: {
    step: "Paso 1 de 5",
    title: "Elige tu seleccion",
    subtitle: "Escoge la seleccion que vas a apoyar en todo tu camino hacia el Mundial 2026.",
    all: "TODAS",
    saveError: "Algo salio mal. Intentalo otra vez.",
    yourTeam: "Tu equipo",
    saving: "Guardando...",
    letsGo: (name: string) => `Vamos con ${name}! ->`,
    select: "Selecciona tu equipo",
  },
} as const;

export default function TeamSelectionPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confederations = ["ALL", "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC"];
  const filtered = filter === "ALL" ? TEAMS : TEAMS.filter((t) => t.confederation === filter);
  const selectedTeam = TEAMS.find((t) => t.code === selected);

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
      if (!res.ok) throw new Error("Failed");
      router.push("/onboarding/pack");
    } catch {
      setError(copy.saveError);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`h-1.5 rounded-full ${s === 1 ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]" : "w-4 bg-white/20"}`} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#FF5E00]">{copy.step}</p>
        <h1 className="mb-3 text-4xl font-black text-white">{copy.title}</h1>
        <p className="text-lg text-white/60">{copy.subtitle}</p>
      </motion.div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {confederations.map((conf) => (
          <button
            key={conf}
            onClick={() => setFilter(conf)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              filter === conf ? "bg-[#FF5E00] text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {conf === "ALL" ? copy.all : conf}
          </button>
        ))}
      </div>

      <motion.div layout className="mb-8 grid max-h-80 grid-cols-4 gap-3 overflow-y-auto pr-1 scrollbar-thin sm:grid-cols-6">
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
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                selected === team.code
                  ? "border-[#FF5E00] bg-[#FF5E00]/20 shadow-lg shadow-[#FF5E00]/30"
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
            >
              <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CONFEDERATION_COLORS[team.confederation] }} />
              <span className="text-2xl">{team.flag}</span>
              <span className="text-center text-[10px] font-bold leading-tight text-white/80">{team.code}</span>
              {selected === team.code && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5E00]">
                  <span className="text-[10px] text-white">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <span className="text-4xl">{selectedTeam.flag}</span>
            <div>
              <p className="text-lg font-bold text-white">{selectedTeam.name}</p>
              <p className="text-sm text-white/40">{selectedTeam.confederation}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="text-sm text-[#FFB800]">{copy.yourTeam}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className={`w-full rounded-xl py-4 text-lg font-black transition-all ${
          selected && !loading
            ? "bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white shadow-lg shadow-[#FF5E00]/30 hover:opacity-90"
            : "cursor-not-allowed bg-white/10 text-white/30"
        }`}
      >
        {loading ? copy.saving : selectedTeam ? copy.letsGo(selectedTeam.name) : copy.select}
      </button>
    </div>
  );
}
