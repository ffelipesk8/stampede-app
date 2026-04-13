"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: string;
  highlight?: string | null;
}

const COPY = {
  en: {
    step: "Step 3 of 5",
    title: "Album tutorial",
    progress: (current: number, total: number) => `${current} of ${total}`,
    complete: "Open my album",
    skip: "Skip tutorial",
    loading: "Loading...",
    placed: "Sticker placed!",
    rarities: [
      { label: "Common", color: "#94A3B8", example: "Group stage players" },
      { label: "Uncommon", color: "#4ADE80", example: "Squad regulars" },
      { label: "Rare", color: "#60A5FA", example: "Key players" },
      { label: "Epic", color: "#A78BFA", example: "Star players" },
      { label: "Legendary", color: "#FFB800", example: "World-class icons" },
    ],
    steps: [
      {
        id: 1,
        title: "Your album",
        description:
          "This is where all your stickers live. Each World Cup team has its own section with players and staff.",
        icon: "📖",
        action: "Got it",
        highlight: "800+ stickers to collect",
      },
      {
        id: 2,
        title: "Place a sticker",
        description:
          "When you earn a sticker, place it in your album. Tap an empty slot or drag the card directly into place.",
        icon: "✋",
        action: "Try it",
        highlight: "Tap an empty slot",
      },
      {
        id: 3,
        title: "Rarity system",
        description:
          "Stickers come in five rarities. The higher the tier, the more prestige and trading value it carries.",
        icon: "⭐",
        action: "Nice",
        highlight: null,
      },
      {
        id: 4,
        title: "Complete the album",
        description:
          "Fill every slot to unlock exclusive rewards and bragging rights. Missing stickers can be traded in the marketplace.",
        icon: "🏆",
        action: "Let's go",
        highlight: "Complete it to unlock rewards",
      },
    ] as TutorialStep[],
  },
  es: {
    step: "Paso 3 de 5",
    title: "Tutorial del album",
    progress: (current: number, total: number) => `${current} de ${total}`,
    complete: "Abrir mi album",
    skip: "Saltar tutorial",
    loading: "Cargando...",
    placed: "Estampa colocada!",
    rarities: [
      { label: "Comun", color: "#94A3B8", example: "Jugadores de fase de grupos" },
      { label: "Poco comun", color: "#4ADE80", example: "Titulares frecuentes" },
      { label: "Rara", color: "#60A5FA", example: "Jugadores clave" },
      { label: "Epica", color: "#A78BFA", example: "Figuras del equipo" },
      { label: "Legendaria", color: "#FFB800", example: "Iconos mundiales" },
    ],
    steps: [
      {
        id: 1,
        title: "Tu album",
        description:
          "Aqui viven todas tus estampas. Cada seleccion del Mundial tiene su propia seccion con jugadores y staff.",
        icon: "📖",
        action: "Entendido",
        highlight: "Mas de 800 estampas por coleccionar",
      },
      {
        id: 2,
        title: "Coloca una estampa",
        description:
          "Cuando ganes una estampa, puedes ponerla en tu album. Toca un espacio vacio o arrastra la carta directo al hueco.",
        icon: "✋",
        action: "Probar",
        highlight: "Toca un espacio vacio",
      },
      {
        id: 3,
        title: "Sistema de rareza",
        description:
          "Las estampas tienen cinco rarezas. Mientras mas alta la rareza, mas prestigio y mas valor para intercambiar.",
        icon: "⭐",
        action: "Genial",
        highlight: null,
      },
      {
        id: 4,
        title: "Completa el album",
        description:
          "Llena todos los espacios para desbloquear recompensas exclusivas. Lo que te falte lo puedes conseguir en el marketplace.",
        icon: "🏆",
        action: "Vamos",
        highlight: "Completarlo desbloquea recompensas",
      },
    ] as TutorialStep[],
  },
} as const;

export default function TutorialPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentStep = copy.steps[step];
  const isLastStep = step === copy.steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) setStep((prev) => prev + 1);
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

  return (
    <div className="w-full max-w-lg text-center">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= 3 ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#FF5E00]">{copy.step}</p>
      <h1 className="mb-2 text-4xl font-black text-white">{copy.title}</h1>
      <p className="mb-8 text-sm text-white/50">{copy.progress(step + 1, copy.steps.length)}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 text-5xl">{currentStep.icon}</div>
          <h2 className="mb-3 text-2xl font-black text-white">{currentStep.title}</h2>
          <p className="mb-4 text-base leading-relaxed text-white/60">{currentStep.description}</p>

          {currentStep.highlight && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF5E00]/30 bg-[#FF5E00]/10 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5E00]">{currentStep.highlight}</span>
            </div>
          )}

          {step === 1 && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={() => {
                    setDragging(false);
                    setPlaced(true);
                  }}
                  whileDrag={{ scale: 1.1, zIndex: 50 }}
                  className={`flex h-20 w-14 cursor-grab flex-col items-center justify-center gap-1 rounded-xl border-2 active:cursor-grabbing ${
                    placed ? "border-white/10 bg-white/5 opacity-30" : "border-[#60A5FA]/60 bg-[#60A5FA]/10"
                  }`}
                >
                  <span className="text-2xl">⚽</span>
                  <span className="text-[9px] font-bold text-[#60A5FA]">RARE</span>
                </motion.div>

                <motion.div animate={{ x: dragging ? [0, 5, -5, 0] : 0 }} className="text-2xl text-white/40">
                  →
                </motion.div>

                <motion.div
                  animate={placed ? { borderColor: "#4ADE80", backgroundColor: "rgba(74,222,128,0.1)" } : {}}
                  onClick={() => setPlaced(true)}
                  className="flex h-20 w-14 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/30 transition-colors hover:border-white/50"
                >
                  {placed ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">
                      ⚽
                    </motion.span>
                  ) : (
                    <span className="text-2xl text-white/20">+</span>
                  )}
                </motion.div>
              </div>

              {placed && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm font-bold text-[#4ADE80]">
                  {copy.placed}
                </motion.p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-2">
              {copy.rarities.map((rarity, index) => (
                <motion.div
                  key={rarity.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 rounded-lg p-2 text-left"
                  style={{ backgroundColor: `${rarity.color}10` }}
                >
                  <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: rarity.color }} />
                  <span className="w-24 text-sm font-bold" style={{ color: rarity.color }}>
                    {rarity.label}
                  </span>
                  <span className="text-xs text-white/50">{rarity.example}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mb-6 flex justify-center gap-2">
        {copy.steps.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === step ? "w-6 bg-[#FF5E00]" : index < step ? "w-3 bg-[#FF5E00]/40" : "w-3 bg-white/20"
            }`}
          />
        ))}
      </div>

      {isLastStep ? (
        <button
          onClick={handleComplete}
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] py-4 text-lg font-black text-white transition-opacity hover:opacity-90"
        >
          {saving ? copy.loading : copy.complete}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-white/10 py-4 text-lg font-black text-white transition-colors hover:bg-white/20"
        >
          {currentStep.action} →
        </button>
      )}

      <button onClick={handleComplete} className="mt-3 text-sm text-white/30 transition-colors hover:text-white/60">
        {copy.skip}
      </button>
    </div>
  );
}
