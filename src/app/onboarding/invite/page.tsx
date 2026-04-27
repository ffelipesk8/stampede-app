"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const COPY = {
  en: {
    step: "Step 5 of 5 · Almost there",
    title: "Invite your crew",
    subtitle: "World Cups are better with friends. Share your link and both of you get rewards.",
    linkLabel: "Your referral link",
    loadingLink: "Loading...",
    copy: "Copy",
    copied: "Copied!",
    share: "Share link",
    whatsapp: "WhatsApp",
    notificationsTitle: "Stay in the game",
    notificationsBody: "Get notified about new drops, trades and match alerts.",
    enable: "Enable",
    enabled: "Notifications enabled!",
    enter: "Enter KARTAZO",
    skip: "Skip for now",
    loading: "Loading...",
    shareTitle: "Join me on KARTAZO",
    shareText: "I'm collecting World Cup 2026 stickers on KARTAZO. Join me and we both get a free pack.",
    whatsappText: (link: string) =>
      `Join me on KARTAZO - the World Cup 2026 fan platform.\n\n${link}`,
    perks: [
      {
        icon: "🎁",
        title: "Free Pack",
        description: "You and your friend each get a bonus pack when they join.",
      },
      {
        icon: "⚡",
        title: "100 XP",
        description: "Earn 100 XP for every friend who completes onboarding.",
      },
      {
        icon: "🏆",
        title: "Recruiter Badge",
        description: "Invite 5 friends to unlock the exclusive Recruiter badge.",
      },
    ],
  },
  es: {
    step: "Paso 5 de 5 · Casi listo",
    title: "Invita a tu crew",
    subtitle: "Los Mundiales se viven mejor con amigos. Comparte tu link y los dos reciben recompensas.",
    linkLabel: "Tu link de invitacion",
    loadingLink: "Cargando...",
    copy: "Copiar",
    copied: "Copiado!",
    share: "Compartir link",
    whatsapp: "WhatsApp",
    notificationsTitle: "Sigue en el juego",
    notificationsBody: "Recibe avisos de nuevos drops, trades y alertas de partidos.",
    enable: "Activar",
    enabled: "Notificaciones activadas!",
    enter: "Entrar a KARTAZO",
    skip: "Ahora no",
    loading: "Cargando...",
    shareTitle: "Unete a KARTAZO",
    shareText: "Estoy coleccionando estampas del Mundial 2026 en KARTAZO. Unete y los dos recibimos un sobre gratis.",
    whatsappText: (link: string) =>
      `Unete a KARTAZO, la plataforma fan del Mundial 2026.\n\n${link}`,
    perks: [
      {
        icon: "🎁",
        title: "Sobre gratis",
        description: "Tu y tu amigo reciben un sobre bonus cuando se una.",
      },
      {
        icon: "⚡",
        title: "100 XP",
        description: "Gana 100 XP por cada amigo que complete el onboarding.",
      },
      {
        icon: "🏆",
        title: "Badge Recruiter",
        description: "Invita a 5 amigos para desbloquear la insignia exclusiva.",
      },
    ],
  },
} as const;

export default function InvitePage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;

  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied" | "unsupported">("idle");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.referralCode) setReferralCode(data.referralCode);
      })
      .catch(() => {});

    if (!("Notification" in window)) {
      setNotifStatus("unsupported");
    } else if (Notification.permission === "granted") {
      setNotifStatus("granted");
    } else if (Notification.permission === "denied") {
      setNotifStatus("denied");
    }
  }, []);

  const referralLink = referralCode
    ? `https://kartazo.app/join?ref=${referralCode}`
    : "https://kartazo.app/join";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: copy.shareTitle,
          text: copy.shareText,
          url: referralLink,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleRequestNotifications = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifStatus(permission === "granted" ? "granted" : "denied");
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingStep: 5 }),
      });
    } catch {}
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-lg text-center">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= 5 ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#FF5E00]">{copy.step}</p>
        <h1 className="mb-3 text-4xl font-black text-white">{copy.title}</h1>
        <p className="mb-8 text-lg text-white/60">{copy.subtitle}</p>

        <div className="mb-8 grid grid-cols-3 gap-3">
          {copy.perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-left"
            >
              <div className="mb-2 text-2xl">{perk.icon}</div>
              <p className="mb-1 text-sm font-bold text-white">{perk.title}</p>
              <p className="text-xs leading-tight text-white/50">{perk.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">{copy.linkLabel}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-white/5 px-3 py-2 font-mono text-sm text-[#FFB800]">
              {referralCode ? `kartazo.app/join?ref=${referralCode}` : copy.loadingLink}
            </code>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                copied ? "bg-[#4ADE80] text-black" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </motion.div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8003D] to-[#FF5E00] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <span>📤</span>
            {copy.share}
          </button>
          <button
            onClick={() => {
              const text = copy.whatsappText(referralLink);
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/20 py-3 text-sm font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/30"
          >
            <span>💬</span>
            {copy.whatsapp}
          </button>
        </div>

        {notifStatus === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-white">{copy.notificationsTitle}</p>
                <p className="text-xs text-white/50">{copy.notificationsBody}</p>
              </div>
              <button
                onClick={handleRequestNotifications}
                className="flex-shrink-0 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20"
              >
                {copy.enable}
              </button>
            </div>
          </motion.div>
        )}

        {notifStatus === "granted" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-[#4ADE80]/30 bg-[#4ADE80]/10 p-3"
          >
            <span className="text-[#4ADE80]">🔔</span>
            <span className="text-sm font-bold text-[#4ADE80]">{copy.enabled}</span>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleComplete}
          disabled={completing}
          className="w-full rounded-xl bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] py-4 text-xl font-black text-white shadow-lg shadow-[#FF5E00]/30 transition-opacity hover:opacity-90"
        >
          {completing ? copy.loading : copy.enter}
        </motion.button>

        <button onClick={handleComplete} className="mt-3 text-sm text-white/30 transition-colors hover:text-white/60">
          {copy.skip}
        </button>
      </motion.div>
    </div>
  );
}
