"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Gift } from "lucide-react";
import { PremiumCard } from "@/components/shared/PremiumCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Sticker {
  id: string;
  name: string;
  team: string;
  teamFlag: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
  position: string;
  number: number;
  category?: string;
  imageUrl?: string | null;
}

type Phase = "intro" | "shake" | "opening" | "reveal" | "done";

const RARITY_CONFIG = {
  COMMON: { color: "#94A3B8", label: "Common" },
  UNCOMMON: { color: "#4ADE80", label: "Uncommon" },
  RARE: { color: "#60A5FA", label: "Rare" },
  EPIC: { color: "#A78BFA", label: "Epic" },
  LEGENDARY: { color: "#FFB800", label: "Legendary" },
} as const;

const COPY = {
  en: {
    step: "Step 2 of 5",
    introTitle: "Your Welcome Pack",
    introBody: "A premium starter drop is ready. Open it to unlock your first cards and launch your collection the right way.",
    guaranteed: "Guaranteed Rare Card",
    starter: "Starter Drop",
    tapOpen: "Tap to open",
    shakeTitle: "Charge the Pack",
    shakeBody: (n: number) => `Tap ${n} ${n === 1 ? "more time" : "more times"} to break the seal`,
    opening: "Opening pack...",
    openingBody: "Syncing your first pull and preparing the reveal.",
    opened: "Pack opened",
    newCards: (n: number) => `${n} new cards`,
    reward: (rarity: string, name: string) => `You pulled a ${rarity} card: ${name}.`,
    continue: "Add to my album",
    alreadyOpened: "Your welcome pack is already unlocked. Moving you forward.",
    failed: "Failed to open pack. Please try again.",
  },
  es: {
    step: "Paso 2 de 5",
    introTitle: "Tu sobre de bienvenida",
    introBody: "Tu primer drop premium ya esta listo. Abrelo para desbloquear tus primeras cartas y arrancar tu coleccion con fuerza.",
    guaranteed: "Rare garantizada",
    starter: "Drop inicial",
    tapOpen: "Toca para abrir",
    shakeTitle: "Carga el sobre",
    shakeBody: (n: number) => `Toca ${n} ${n === 1 ? "vez mas" : "veces mas"} para romper el sello`,
    opening: "Abriendo sobre...",
    openingBody: "Sincronizando tu primera tirada y preparando el reveal.",
    opened: "Sobre abierto",
    newCards: (n: number) => `${n} cartas nuevas`,
    reward: (rarity: string, name: string) => `Te salio una ${rarity}: ${name}.`,
    continue: "Agregar a mi album",
    alreadyOpened: "Tu sobre de bienvenida ya fue desbloqueado. Te llevamos al siguiente paso.",
    failed: "No se pudo abrir el sobre. Intentalo otra vez.",
  },
  pt: {
    step: "Etapa 2 de 5",
    introTitle: "Seu pack de boas-vindas",
    introBody: "Seu primeiro drop premium esta pronto. Abra para desbloquear as primeiras cartas e comecar sua colecao com impacto.",
    guaranteed: "Rare garantida",
    starter: "Drop inicial",
    tapOpen: "Toque para abrir",
    shakeTitle: "Energize o pack",
    shakeBody: (n: number) => `Toque mais ${n} ${n === 1 ? "vez" : "vezes"} para quebrar o selo`,
    opening: "Abrindo pack...",
    openingBody: "Sincronizando sua primeira tirada e preparando a revelacao.",
    opened: "Pack aberto",
    newCards: (n: number) => `${n} novas cartas`,
    reward: (rarity: string, name: string) => `Voce tirou uma ${rarity}: ${name}.`,
    continue: "Adicionar ao album",
    alreadyOpened: "Seu pack de boas-vindas ja foi liberado. Vamos para a proxima etapa.",
    failed: "Nao foi possivel abrir o pack. Tente novamente.",
  },
  fr: {
    step: "Etape 2 sur 5",
    introTitle: "Votre pack de bienvenue",
    introBody: "Votre premier drop premium est pret. Ouvrez-le pour lancer votre collection avec vos premieres cartes.",
    guaranteed: "Rare garantie",
    starter: "Drop initial",
    tapOpen: "Touchez pour ouvrir",
    shakeTitle: "Chargez le pack",
    shakeBody: (n: number) => `Touchez encore ${n} ${n === 1 ? "fois" : "fois"} pour briser le sceau`,
    opening: "Ouverture du pack...",
    openingBody: "Preparation du reveal et synchronisation du premier tirage.",
    opened: "Pack ouvert",
    newCards: (n: number) => `${n} nouvelles cartes`,
    reward: (rarity: string, name: string) => `Vous avez obtenu une ${rarity} : ${name}.`,
    continue: "Ajouter a mon album",
    alreadyOpened: "Votre pack de bienvenue est deja debloque. Passage a l'etape suivante.",
    failed: "Impossible d'ouvrir le pack. Reessayez.",
  },
  de: {
    step: "Schritt 2 von 5",
    introTitle: "Dein Willkommenspack",
    introBody: "Dein erster Premium-Drop ist bereit. Offne ihn und starte deine Sammlung mit den ersten Karten.",
    guaranteed: "Garantierte Rare Karte",
    starter: "Starter Drop",
    tapOpen: "Tippen zum Offnen",
    shakeTitle: "Pack aufladen",
    shakeBody: (n: number) => `Noch ${n} ${n === 1 ? "Mal" : "Mal"} tippen, um das Siegel zu brechen`,
    opening: "Pack wird geoffnet...",
    openingBody: "Erster Pull wird synchronisiert und Reveal vorbereitet.",
    opened: "Pack geoffnet",
    newCards: (n: number) => `${n} neue Karten`,
    reward: (rarity: string, name: string) => `Du hast eine ${rarity} gezogen: ${name}.`,
    continue: "Zu meinem Album",
    alreadyOpened: "Dein Willkommenspack ist bereits freigeschaltet. Weiter zum nachsten Schritt.",
    failed: "Pack konnte nicht geoffnet werden. Bitte erneut versuchen.",
  },
  ar: {
    step: "الخطوة 2 من 5",
    introTitle: "حزمة الترحيب",
    introBody: "اول دروب مميز جاهز لك. افتحه لبدء مجموعتك باول مجموعة من البطاقات.",
    guaranteed: "بطاقة نادرة مضمونة",
    starter: "بداية قوية",
    tapOpen: "اضغط للفتح",
    shakeTitle: "اشحن الحزمة",
    shakeBody: (n: number) => `اضغط ${n} ${n === 1 ? "مرة اضافية" : "مرات اضافية"} لكسر الختم`,
    opening: "جار فتح الحزمة...",
    openingBody: "تجهيز السحب الاول وتحضير الكشف.",
    opened: "تم فتح الحزمة",
    newCards: (n: number) => `${n} بطاقات جديدة`,
    reward: (rarity: string, name: string) => `حصلت على ${rarity}: ${name}.`,
    continue: "اضافة الى الالبوم",
    alreadyOpened: "حزمة الترحيب مفتوحة بالفعل. سننقلك للخطوة التالية.",
    failed: "تعذر فتح الحزمة. حاول مرة اخرى.",
  },
} as const;

export default function WelcomePackPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const copy = COPY[locale] ?? COPY.en;

  const [phase, setPhase] = useState<Phase>("intro");
  const [shakeCount, setShakeCount] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (phase === "reveal" && revealedIndex < stickers.length - 1) {
      const timer = setTimeout(() => {
        setRevealedIndex((i) => i + 1);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [phase, revealedIndex, stickers.length]);

  const featuredReward = useMemo(
    () => stickers.find((s) => ["LEGENDARY", "EPIC", "RARE"].includes(s.rarity)),
    [stickers]
  );

  const advanceOnboarding = async () => {
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingStep: 3 }),
    }).catch(() => {});
    router.push("/onboarding/tutorial");
  };

  const handlePackTap = async () => {
    if (loading || redirecting) return;

    if (phase === "intro") {
      setError(null);
      setPhase("shake");
      return;
    }

    if (phase !== "shake") return;

    const next = shakeCount + 1;
    setShakeCount(next);

    if (next < 3) return;

    setPhase("opening");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/packs/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packType: "WELCOME" }),
      });
      const data = await res.json();

      if (!res.ok) {
        const apiError = String(data?.error ?? "");
        if (res.status === 409 || apiError.toLowerCase().includes("already opened")) {
          setRedirecting(true);
          setError(copy.alreadyOpened);
          await advanceOnboarding();
          return;
        }
        throw new Error(apiError || copy.failed);
      }

      setStickers(data.stickers || []);
      setTimeout(() => {
        setPhase("reveal");
        setRevealedIndex(0);
      }, 700);
    } catch (err) {
      const message = err instanceof Error ? err.message : copy.failed;
      setError(message || copy.failed);
      setPhase("shake");
      setShakeCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(13,15,30,0.98),rgba(22,8,12,0.98)_40%,rgba(29,14,0,0.96)_100%)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,0,0.14),transparent_22%),radial-gradient(circle_at_top_left,rgba(232,0,61,0.12),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)", backgroundSize: "38px 38px" }} />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${s <= 2 ? "w-9 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]" : "w-4 bg-white/20"}`}
                />
              ))}
            </div>

            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#FF8A00]">
              {copy.step}
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-[0.92] text-white sm:text-5xl">
              {phase === "shake" ? copy.shakeTitle : copy.introTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              {phase === "shake" ? copy.shakeBody(3 - shakeCount) : copy.introBody}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-4 py-2 text-sm font-bold text-[#60A5FA]">
                <Star className="h-4 w-4" />
                {copy.guaranteed}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/60">
                <Gift className="h-4 w-4" />
                {copy.starter}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={i < shakeCount ? { scale: [1, 1.15, 1] } : {}}
                  className={`h-3 w-3 rounded-full ${i < shakeCount ? "bg-[#FF7A00]" : "bg-white/18"}`}
                />
              ))}
            </div>

            {error && (
              <div className="mt-6 max-w-md rounded-2xl border border-[#FF5E00]/20 bg-[#FF5E00]/10 px-4 py-3 text-sm font-semibold text-white/85">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              {(phase === "intro" || phase === "shake") && (
                <motion.div
                  key="pack"
                  initial={{ opacity: 0, scale: 0.9, y: 18 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotate: phase === "shake" && shakeCount > 0 ? [0, -2.5, 2.5, -1.5, 0] : 0,
                  }}
                  transition={{ duration: 0.45 }}
                  onClick={handlePackTap}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle,rgba(255,94,0,0.24),transparent_60%)] blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative flex w-[220px] flex-col overflow-hidden rounded-[28px] border border-[#FF8A00]/45 bg-[linear-gradient(180deg,#2A0908_0%,#5B1700_45%,#201005_100%)] px-6 py-7 shadow-[0_25px_90px_rgba(255,94,0,0.16)]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(232,0,61,0.14)_28%,rgba(255,184,0,0.16)_55%,transparent_100%)]" />
                    <motion.div
                      animate={{ x: ["-140%", "220%"] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-18deg]"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="rounded-full border border-white/15 bg-black/25 p-4">
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-condensed text-2xl font-black uppercase text-white">KARTAZO</p>
                        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#FFB800]">
                          {copy.starter}
                        </p>
                      </div>
                      <div className="rounded-full border border-[#FF8A00]/40 bg-[#FF8A00]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FF8A00]">
                        {copy.tapOpen}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "opening" && (
                <motion.div
                  key="opening"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[360px] w-full max-w-[320px] flex-col items-center justify-center gap-5"
                >
                  <motion.div
                    animate={{ scale: [1, 1.14, 0.92, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="rounded-full border border-[#FFB800]/30 bg-[#FFB800]/10 p-6"
                  >
                    <Gift className="h-14 w-14 text-[#FFB800]" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-xl font-black text-white">{copy.opening}</p>
                    <p className="mt-2 text-sm text-white/55">{copy.openingBody}</p>
                  </div>
                </motion.div>
              )}

              {(phase === "reveal" || phase === "done") && stickers.length > 0 && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full"
                >
                  <p className="mb-2 text-center text-[11px] font-black uppercase tracking-[0.24em] text-[#FFB800]">
                    {copy.opened}
                  </p>
                  <h2 className="mb-6 text-center text-3xl font-black text-white">
                    {copy.newCards(stickers.length)}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {stickers.map((sticker, i) => (
                      <motion.div
                        key={sticker.id}
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={i <= revealedIndex ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ duration: 0.35 }}
                        className={i <= revealedIndex ? "" : "pointer-events-none"}
                      >
                        {i <= revealedIndex && (
                          <PremiumCard
                            sticker={{
                              id: sticker.id,
                              name: sticker.name,
                              playerName: sticker.name,
                              team: sticker.team,
                              teamFlag: sticker.teamFlag,
                              category: sticker.category ?? "player",
                              position: sticker.position,
                              rarity: sticker.rarity,
                              number: sticker.number,
                              imageUrl: sticker.imageUrl ?? null,
                            }}
                            owned
                            size="md"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {featuredReward && (
                    <div
                      className="mx-auto mt-6 max-w-xl rounded-[24px] border px-4 py-4 text-center"
                      style={{
                        borderColor: `${RARITY_CONFIG[featuredReward.rarity].color}55`,
                        background: `${RARITY_CONFIG[featuredReward.rarity].color}14`,
                      }}
                    >
                      <p className="text-sm font-semibold text-white/78">
                        {copy.reward(RARITY_CONFIG[featuredReward.rarity].label, featuredReward.name)}
                      </p>
                    </div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: revealedIndex >= stickers.length - 1 ? 1 : 0, y: revealedIndex >= stickers.length - 1 ? 0 : 10 }}
                    onClick={advanceOnboarding}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] px-6 py-4 text-lg font-black text-white shadow-[0_18px_40px_rgba(255,94,0,0.24)] transition-opacity hover:opacity-90"
                  >
                    {copy.continue}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
