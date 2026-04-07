"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Sticker {
  id: string;
  name: string;
  team: string;
  teamFlag: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
  position: string;
  number: number;
}

const RARITY_CONFIG = {
  COMMON: { color: "#94A3B8", label: "Common", glow: "rgba(148,163,184,0.4)" },
  UNCOMMON: { color: "#4ADE80", label: "Uncommon", glow: "rgba(74,222,128,0.4)" },
  RARE: { color: "#60A5FA", label: "Rare", glow: "rgba(96,165,250,0.5)" },
  EPIC: { color: "#A78BFA", label: "Epic", glow: "rgba(167,139,250,0.6)" },
  LEGENDARY: { color: "#FFB800", label: "Legendary", glow: "rgba(255,184,0,0.7)" },
};

type Phase = "intro" | "shake" | "opening" | "reveal" | "done";

export default function WelcomePackPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [shakeCount, setShakeCount] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePackTap = async () => {
    if (phase === "intro") {
      setPhase("shake");
      return;
    }

    if (phase === "shake") {
      const next = shakeCount + 1;
      setShakeCount(next);

      if (next >= 3) {
        setPhase("opening");
        setLoading(true);
        try {
          const res = await fetch("/api/packs/open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packType: "WELCOME" }),
          });
          if (!res.ok) throw new Error("Pack opening failed");
          const data = await res.json();
          setStickers(data.stickers || []);
          setTimeout(() => {
            setPhase("reveal");
            setRevealedIndex(0);
          }, 800);
        } catch {
          setError("Failed to open pack. Please try again.");
          setPhase("shake");
          setShakeCount(0);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (phase === "reveal" && revealedIndex < stickers.length - 1) {
      const timer = setTimeout(() => {
        setRevealedIndex((i) => i + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, revealedIndex, stickers.length]);

  const handleContinue = async () => {
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingStep: 3 }),
      });
    } catch {}
    router.push("/onboarding/tutorial");
  };

  const rarity = stickers.find((s) => ["RARE", "EPIC", "LEGENDARY"].includes(s.rarity));

  return (
    <div className="w-full max-w-lg text-center">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= 2
                ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]"
                : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Intro phase */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="text-[#FF5E00] text-sm font-semibold uppercase tracking-widest mb-2">
              Step 2 of 5
            </p>
            <h1 className="text-4xl font-black text-white mb-3">
              Your Welcome Pack 🎁
            </h1>
            <p className="text-white/60 text-lg mb-10">
              You&apos;ve got a guaranteed <span className="text-[#60A5FA] font-bold">Rare sticker</span> waiting inside.
              Tap to get it!
            </p>

            {/* Pack card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePackTap}
              className="cursor-pointer mx-auto w-48 h-72 rounded-2xl relative overflow-hidden shadow-2xl shadow-[#FF5E00]/30 border border-[#FF5E00]/40"
              style={{
                background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0%, rgba(232,0,61,0.15) 30%, rgba(255,94,0,0.25) 50%, rgba(255,184,0,0.15) 70%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="text-6xl">⚽</span>
                <p className="text-white font-black text-lg tracking-tight">STAMPEDE</p>
                <p className="text-[#FFB800] text-xs font-semibold uppercase tracking-widest">
                  Welcome Pack
                </p>
                <div className="mt-4 px-4 py-2 rounded-full border border-[#FF5E00]/60 bg-[#FF5E00]/10">
                  <p className="text-[#FF5E00] text-xs font-bold">TAP TO OPEN</p>
                </div>
              </div>
              {/* Shimmer */}
              <motion.div
                animate={{ x: [-200, 250] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Shake phase */}
        {phase === "shake" && (
          <motion.div
            key="shake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[#FF5E00] text-sm font-semibold uppercase tracking-widest mb-2">
              Step 2 of 5
            </p>
            <h1 className="text-4xl font-black text-white mb-3">
              Shake it! 🔥
            </h1>
            <p className="text-white/60 text-lg mb-8">
              Tap the pack {3 - shakeCount} more {3 - shakeCount === 1 ? "time" : "times"} to open
            </p>

            {/* Shake indicator dots */}
            <div className="flex gap-3 justify-center mb-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={i < shakeCount ? { scale: [1, 1.4, 1] } : {}}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < shakeCount ? "bg-[#FF5E00]" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <motion.div
              animate={
                shakeCount > 0
                  ? {
                      rotate: [-3, 3, -3, 3, 0],
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              key={shakeCount}
              onClick={handlePackTap}
              className="cursor-pointer mx-auto w-48 h-72 rounded-2xl relative overflow-hidden shadow-2xl border border-[#FF5E00]/60"
              style={{
                background: "linear-gradient(135deg, #1a0a00 0%, #2d1200 50%, #1a0a00 100%)",
                boxShadow: `0 0 ${shakeCount * 15}px rgba(255,94,0,${shakeCount * 0.2})`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, transparent 0%, rgba(232,0,61,${0.1 + shakeCount * 0.1}) 30%, rgba(255,94,0,${0.2 + shakeCount * 0.1}) 50%, rgba(255,184,0,${0.1 + shakeCount * 0.1}) 70%, transparent 100%)`,
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <motion.span
                  animate={{ rotate: shakeCount > 0 ? [0, -10, 10, 0] : 0 }}
                  key={`ball-${shakeCount}`}
                  className="text-6xl"
                >
                  ⚽
                </motion.span>
                <p className="text-white font-black text-lg">STAMPEDE</p>
                <p className="text-[#FFB800] text-xs font-semibold uppercase tracking-widest">
                  Welcome Pack
                </p>
              </div>
            </motion.div>

            {error && (
              <p className="text-red-400 text-sm mt-4">{error}</p>
            )}
          </motion.div>
        )}

        {/* Opening animation */}
        {phase === "opening" && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 0], rotate: [0, 10, -10, 180] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-8xl"
            >
              🎁
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-1">
                {["🔥", "⚡", "💥", "✨", "🌟"].map((emoji, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -30 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Reveal phase */}
        {(phase === "reveal" || phase === "done") && stickers.length > 0 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[#FFB800] text-sm font-bold uppercase tracking-widest mb-2">
              🎉 Pack Opened!
            </p>
            <h2 className="text-3xl font-black text-white mb-8">
              {stickers.length} new stickers!
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {stickers.map((sticker, i) => {
                const config = RARITY_CONFIG[sticker.rarity];
                return (
                  <AnimatePresence key={sticker.id}>
                    {i <= revealedIndex && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative rounded-xl p-3 flex flex-col items-center gap-1.5 border"
                        style={{
                          background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                          borderColor: config.color + "60",
                          boxShadow: i <= revealedIndex ? `0 0 12px ${config.glow}` : "none",
                        }}
                      >
                        <span className="text-2xl">{sticker.teamFlag}</span>
                        <div
                          className="w-full rounded-md py-1 px-2 text-center"
                          style={{ backgroundColor: config.color + "20" }}
                        >
                          <p
                            className="text-[10px] font-black uppercase tracking-wider"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </p>
                        </div>
                        <p className="text-white text-xs font-bold text-center leading-tight line-clamp-2">
                          {sticker.name}
                        </p>
                        <p className="text-white/40 text-[10px]">{sticker.position}</p>
                        <p className="text-white/20 text-[10px]">#{sticker.number}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>

            {rarity && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mb-6 p-3 rounded-xl border"
                style={{
                  borderColor: RARITY_CONFIG[rarity.rarity].color + "60",
                  backgroundColor: RARITY_CONFIG[rarity.rarity].color + "10",
                }}
              >
                <p className="text-white/60 text-sm">
                  ✨ You got a <span style={{ color: RARITY_CONFIG[rarity.rarity].color }} className="font-bold">{RARITY_CONFIG[rarity.rarity].label}</span> — {rarity.name}!
                </p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: revealedIndex >= stickers.length - 1 ? 1 : 0 }}
              onClick={handleContinue}
              className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 transition-opacity"
            >
              Add to my album →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
