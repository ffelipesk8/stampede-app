"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PRO_FEATURES = [
  { icon: "🤖", title: "Unlimited AI Fan Coach", desc: "Ask as many questions as you want — no daily limit" },
  { icon: "🎁", title: "2x daily packs", desc: "Get two free packs every day instead of one" },
  { icon: "⚡", title: "Priority pack drops", desc: "Early access to limited-edition drops before free users" },
  { icon: "🏆", title: "PRO badge & border", desc: "Stand out in rankings, events and the marketplace" },
  { icon: "🪙", title: "500 bonus coins / month", desc: "Monthly top-up to use in the marketplace" },
  { icon: "📊", title: "Advanced album stats", desc: "Completion rates, trade history, value estimator" },
];

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$9.99",
    period: "/month",
    note: null,
    savings: null,
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "$79.99",
    period: "/year",
    note: "~$6.67/month",
    savings: "Save 33%",
  },
] as const;

export default function UpgradePage() {
  const router = useRouter();
  const params = useSearchParams();
  const cancelled = params.get("cancelled") === "true";

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cancelled banner */}
      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">👋</span>
            <p className="text-white/70 text-sm">
              No worries — you can upgrade whenever you&apos;re ready.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-full px-4 py-2 mb-4">
          <span className="text-[#FFB800] text-sm font-bold">⚡ STAMPEDE PRO</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">
          Unlock the full{" "}
          <span className="bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] bg-clip-text text-transparent">
            STAMPEDE
          </span>{" "}
          experience
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          For serious fans. More packs, unlimited AI coach, and exclusive perks.
        </p>
      </motion.div>

      {/* Features grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
      >
        {PRO_FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <p className="text-white font-bold text-sm">{f.title}</p>
              <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Plan selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="grid grid-cols-2 gap-3 mb-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? "border-[#FF5E00] bg-[#FF5E00]/10"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {plan.savings && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E8003D] to-[#FF5E00] text-white text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                  {plan.savings}
                </div>
              )}
              <p className={`text-sm font-bold mb-1 ${selectedPlan === plan.id ? "text-[#FF5E00]" : "text-white/60"}`}>
                {plan.label}
              </p>
              <p className="text-white font-black text-2xl leading-none">
                {plan.price}
                <span className="text-white/40 text-sm font-normal">{plan.period}</span>
              </p>
              {plan.note && (
                <p className="text-white/40 text-xs mt-1">{plan.note}</p>
              )}
              {selectedPlan === plan.id && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#FF5E00] rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-[#FF5E00]/30"
        >
          {loading
            ? "Redirecting to checkout…"
            : `Start PRO — ${selectedPlan === "yearly" ? "$79.99/year" : "$9.99/month"}`}
        </button>

        <p className="text-white/30 text-xs text-center mt-3">
          Cancel anytime · Secure payment via Stripe · No hidden fees
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/10 pt-6 space-y-4"
      >
        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider">FAQ</h3>
        {[
          ["Can I cancel?", "Yes, cancel anytime from your profile. Your PRO perks stay active until the end of the billing period."],
          ["What payment methods?", "All major cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and more via Stripe."],
          ["Is there a free trial?", "The free plan lets you experience all core features. PRO is the full power upgrade."],
        ].map(([q, a]) => (
          <div key={q}>
            <p className="text-white/70 text-sm font-semibold">{q}</p>
            <p className="text-white/40 text-sm mt-0.5">{a}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
