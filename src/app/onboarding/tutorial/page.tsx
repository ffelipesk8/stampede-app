"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: string;
  highlight?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "Your Album",
    description:
      "This is where all your stickers live. Each of the 32 World Cup teams has a dedicated section with all players and staff.",
    icon: "📖",
    action: "Got it!",
    highlight: "800+ stickers to collect",
  },
  {
    id: 2,
    title: "Place a Sticker",
    description:
      'When you earn a sticker, you can place it in your album. Tap an empty slot to place a sticker, or drag it directly to the slot.',
    icon: "✋",
    action: "Try it!",
    highlight: "Tap an empty slot",
  },
  {
    id: 3,
    title: "Rarity System",
    description:
      "Stickers come in 5 rarities. Commons are easy to get; Legendaries are special editions. Rarer stickers have higher trade value!",
    icon: "⭐",
    action: "Nice!",
    highlight: null,
  },
  {
    id: 4,
    title: "Complete the Album",
    description:
      "Fill all slots to unlock exclusive rewards and bragging rights. Missing stickers? Trade with other fans on the Marketplace.",
    icon: "🏆",
    action: "Let's go!",
    highlight: "Complete = exclusive rewards",
  },
];

const RARITY_DEMO = [
  { label: "Common", color: "#94A3B8", example: "Group stage players" },
  { label: "Uncommon", color: "#4ADE80", example: "Squad regulars" },
  { label: "Rare", color: "#60A5FA", example: "Key players" },
  { label: "Epic", color: "#A78BFA", example: "Star players" },
  { label: "Legendary", color: "#FFB800", example: "World-class icons" },
];

// Simulated sticker for drag demo
const DEMO_STICKER = { id: "demo", flag: "⚽", name: "Your Sticker", rarity: "RARE" };

export default function TutorialPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentStep = TUTORIAL_STEPS[step];

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingStep: 4 }),
      });
    } catch {}
    router.push("/onboarding/invite");
  };

  const isLastStep = step === TUTORIAL_STEPS.length - 1;

  return (
    <div className="w-full max-w-lg text-center">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= 3
                ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]"
                : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <p className="text-[#FF5E00] text-sm font-semibold uppercase tracking-widest mb-2">
        Step 3 of 5
      </p>
      <h1 className="text-4xl font-black text-white mb-2">
        Album Tutorial 📖
      </h1>
      <p className="text-white/50 mb-8 text-sm">
        {step + 1} of {TUTORIAL_STEPS.length}
      </p>

      {/* Tutorial card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="text-5xl mb-4">{currentStep.icon}</div>
          <h2 className="text-2xl font-black text-white mb-3">
            {currentStep.title}
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-4">
            {currentStep.description}
          </p>

          {currentStep.highlight && (
            <div className="inline-flex items-center gap-2 bg-[#FF5E00]/10 border border-[#FF5E00]/30 rounded-full px-4 py-2 mb-4">
              <span className="text-[#FF5E00] text-xs font-bold uppercase tracking-wider">
                {currentStep.highlight}
              </span>
            </div>
          )}

          {/* Special content for step 2 (drag demo) */}
          {step === 1 && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-8">
                {/* Drag source */}
                <motion.div
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={() => {
                    setDragging(false);
                    setPlaced(true);
                  }}
                  whileDrag={{ scale: 1.1, zIndex: 50 }}
                  className={`w-14 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing ${
                    placed
                      ? "border-white/10 bg-white/5 opacity-30"
                      : "border-[#60A5FA]/60 bg-[#60A5FA]/10"
                  }`}
                >
                  <span className="text-2xl">⚽</span>
                  <span className="text-[9px] font-bold text-[#60A5FA]">RARE</span>
                </motion.div>

                <motion.div
                  animate={{ x: dragging ? [0, 5, -5, 0] : 0 }}
                  className="text-white/40 text-2xl"
                >
                  →
                </motion.div>

                {/* Drop target */}
                <motion.div
                  animate={placed ? { borderColor: "#4ADE80", backgroundColor: "rgba(74,222,128,0.1)" } : {}}
                  onClick={() => setPlaced(true)}
                  className="w-14 h-20 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors"
                >
                  {placed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      ⚽
                    </motion.span>
                  ) : (
                    <span className="text-white/20 text-2xl">+</span>
                  )}
                </motion.div>
              </div>
              {placed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#4ADE80] text-sm font-bold mt-3"
                >
                  ✓ Sticker placed!
                </motion.p>
              )}
            </div>
          )}

          {/* Special content for step 3 (rarity demo) */}
          {step === 2 && (
            <div className="mt-4 space-y-2">
              {RARITY_DEMO.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-left rounded-lg p-2"
                  style={{ backgroundColor: r.color + "10" }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  <span
                    className="text-sm font-bold w-24"
                    style={{ color: r.color }}
                  >
                    {r.label}
                  </span>
                  <span className="text-white/50 text-xs">{r.example}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-6">
        {TUTORIAL_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step
                ? "w-6 bg-[#FF5E00]"
                : i < step
                ? "w-3 bg-[#FF5E00]/40"
                : "w-3 bg-white/20"
            }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <button
          onClick={handleComplete}
          disabled={saving}
          className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 transition-opacity"
        >
          {saving ? "Loading…" : "Open my album! 🚀"}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-black text-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          {currentStep.action} →
        </button>
      )}

      {/* Skip */}
      <button
        onClick={handleComplete}
        className="mt-3 text-white/30 text-sm hover:text-white/60 transition-colors"
      >
        Skip tutorial
      </button>
    </div>
  );
}
