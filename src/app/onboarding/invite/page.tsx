"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PERKS = [
  {
    icon: "🎁",
    title: "Free Pack",
    description: "You + your friend each get a bonus pack when they join",
  },
  {
    icon: "⚡",
    title: "100 XP",
    description: "Earn 100 XP for every friend who completes onboarding",
  },
  {
    icon: "🏅",
    title: "Recruiter Badge",
    description: "Invite 5 friends to unlock the exclusive Recruiter badge",
  },
];

export default function InvitePage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"idle" | "granted" | "denied" | "unsupported">("idle");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    // Fetch user's referral code
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.referralCode) setReferralCode(data.referralCode);
      })
      .catch(() => {});

    // Check notification support
    if (!("Notification" in window)) {
      setNotifStatus("unsupported");
    } else if (Notification.permission === "granted") {
      setNotifStatus("granted");
    } else if (Notification.permission === "denied") {
      setNotifStatus("denied");
    }
  }, []);

  const referralLink = referralCode
    ? `https://stampede.app/join?ref=${referralCode}`
    : "https://stampede.app/join";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for non-HTTPS environments
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
          title: "Join me on STAMPEDE",
          text: "I'm collecting World Cup 2026 stickers on STAMPEDE! Join me and we both get a free pack 🔥",
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
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= 5
                ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]"
                : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[#FF5E00] text-sm font-semibold uppercase tracking-widest mb-2">
          Step 5 of 5 — Almost there!
        </p>
        <h1 className="text-4xl font-black text-white mb-3">
          Invite your crew 🤝
        </h1>
        <p className="text-white/60 text-lg mb-8">
          World Cups are better with friends. Share your link and both of you get rewards.
        </p>

        {/* Perks */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-left"
            >
              <div className="text-2xl mb-2">{perk.icon}</div>
              <p className="text-white font-bold text-sm mb-1">{perk.title}</p>
              <p className="text-white/50 text-xs leading-tight">{perk.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Referral link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4"
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2 font-semibold">
            Your referral link
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[#FFB800] text-sm bg-white/5 rounded-lg px-3 py-2 font-mono truncate">
              {referralCode
                ? `stampede.app/join?ref=${referralCode}`
                : "Loading…"}
            </code>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                copied
                  ? "bg-[#4ADE80] text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </motion.div>

        {/* Share buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>📤</span> Share link
          </button>
          <button
            onClick={() => {
              const text = `Join me on STAMPEDE — the World Cup 2026 fan platform! 🔥⚽\n\n${referralLink}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/30 transition-colors flex items-center justify-center gap-2"
          >
            <span>💬</span> WhatsApp
          </button>
        </div>

        {/* Push notifications */}
        {notifStatus === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div className="text-left flex-1">
                <p className="text-white font-bold text-sm">Stay in the game</p>
                <p className="text-white/50 text-xs">
                  Get notified about new drops, trades & match alerts
                </p>
              </div>
              <button
                onClick={handleRequestNotifications}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
              >
                Enable
              </button>
            </div>
          </motion.div>
        )}

        {notifStatus === "granted" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 justify-center bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-xl p-3 mb-6"
          >
            <span className="text-[#4ADE80]">🔔</span>
            <span className="text-[#4ADE80] text-sm font-bold">Notifications enabled!</span>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleComplete}
          disabled={completing}
          className="w-full py-4 rounded-xl font-black text-xl bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#FF5E00]/30"
        >
          {completing ? "Loading…" : "Enter STAMPEDE! 🔥"}
        </motion.button>

        <button
          onClick={handleComplete}
          className="mt-3 text-white/30 text-sm hover:text-white/60 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
