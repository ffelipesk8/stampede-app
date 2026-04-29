"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPlanCurrencyEquivalents, PRO_PLANS, type ProPlan } from "@/lib/pro-pricing";

export default function UpgradePage() {
  const { locale } = useLanguage();
  const params = useSearchParams();
  const cancelled = params.get("cancelled") === "true";
  const [selectedPlan, setSelectedPlan] = useState<ProPlan>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = locale === "es"
    ? {
        proLabel: "KARTAZO PRO",
        headlinePrefix: "Desbloquea la experiencia completa de",
        subhead:
          "Paga con Wompi en COP y mira equivalencias aproximadas para comparar desde cualquier pais.",
        cancelled: "No pasa nada. Puedes hacerte PRO cuando quieras.",
        features: [
          { icon: "AI", title: "Coach IA ilimitado", desc: "Pregunta todo lo que quieras sin limite diario." },
          { icon: "2X", title: "Dos sobres diarios", desc: "Recibe dos sobres gratis al dia en vez de uno." },
          { icon: "VIP", title: "Drops prioritarios", desc: "Acceso temprano a lanzamientos limitados y especiales." },
          { icon: "PRO", title: "Insignia PRO", desc: "Destaca en ranking, eventos y mercado con un look premium." },
          { icon: "500", title: "500 monedas bonus", desc: "Recarga mensual para usar dentro del mercado." },
          { icon: "ST", title: "Estadisticas avanzadas", desc: "Desbloquea analitica mas profunda de progreso y coleccion." },
        ],
        plans: [
          { id: "monthly" as ProPlan, label: "Mensual", period: "/mes", note: null, savings: null },
          { id: "yearly" as ProPlan, label: "Anual", period: "/ano", note: "~ COP 20.825/mes", savings: "Ahorra 33%" },
        ],
        approx: "Equivalentes aprox",
        genericError: "Algo salio mal.",
        networkError: "Error de red. Intentalo de nuevo.",
        redirecting: "Redirigiendo a Wompi...",
        payMonthly: "Pagar con Wompi - COP 29.900/mes",
        payYearly: "Pagar con Wompi - COP 249.900/ano",
        secure: "Pago seguro con Wompi. El cobro es en COP y la conversion es solo referencia.",
        faqTitle: "Preguntas frecuentes",
        faq: [
          ["Puedo cancelar?", "Si. Tus beneficios PRO siguen activos hasta el final del periodo pagado."],
          ["Que medios de pago hay?", "Wompi soporta tarjetas, PSE y otros medios locales segun tu configuracion."],
          ["Hay prueba gratis?", "El plan gratis incluye la experiencia base. PRO desbloquea el modo fan completo."],
        ],
      }
    : {
        proLabel: "KARTAZO PRO",
        headlinePrefix: "Unlock the full experience of",
        subhead:
          "Pay with Wompi in COP and view approximate equivalents so fans in any country can compare easily.",
        cancelled: "No worries. You can upgrade whenever you are ready.",
        features: [
          { icon: "AI", title: "Unlimited AI Fan Coach", desc: "Ask as many questions as you want with no daily limit." },
          { icon: "2X", title: "Two daily packs", desc: "Get two free packs every day instead of one." },
          { icon: "VIP", title: "Priority drops", desc: "Get early access to limited sticker drops and special releases." },
          { icon: "PRO", title: "PRO badge", desc: "Stand out across ranking, events and the marketplace." },
          { icon: "500", title: "500 bonus coins", desc: "Monthly top-up to spend in the marketplace." },
          { icon: "ST", title: "Advanced stats", desc: "Unlock deeper collection and progression analytics." },
        ],
        plans: [
          { id: "monthly" as ProPlan, label: "Monthly", period: "/month", note: null, savings: null },
          { id: "yearly" as ProPlan, label: "Yearly", period: "/year", note: "~ COP 20.825/month", savings: "Save 33%" },
        ],
        approx: "Approx equivalents",
        genericError: "Something went wrong.",
        networkError: "Network error. Please try again.",
        redirecting: "Redirecting to Wompi...",
        payMonthly: "Pay with Wompi - COP 29.900/month",
        payYearly: "Pay with Wompi - COP 249.900/year",
        secure: "Secure payment via Wompi. Charged in COP. Approximate FX is shown for reference only.",
        faqTitle: "FAQ",
        faq: [
          ["Can I cancel?", "Yes. Your PRO perks remain active until the end of the paid period."],
          ["What payment methods?", "Wompi supports cards, PSE and other local methods depending on your configuration."],
          ["Is there a free trial?", "The free plan includes the core experience. PRO unlocks the full fan mode."],
        ],
      };

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/wompi/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? copy.genericError);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError(copy.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">UP</span>
            <p className="text-white/70 text-sm">{copy.cancelled}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-full px-4 py-2 mb-4">
          <span className="text-[#FFB800] text-sm font-bold">{copy.proLabel}</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">
          {copy.headlinePrefix}{" "}
          <span className="bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] bg-clip-text text-transparent">
            KARTAZO
          </span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">{copy.subhead}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
      >
        {copy.features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <span className="text-sm font-black text-[#FFB800] flex-shrink-0 min-w-10 text-center">{feature.icon}</span>
            <div>
              <p className="text-white font-bold text-sm">{feature.title}</p>
              <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {copy.plans.map((plan) => {
            const equivalents = getPlanCurrencyEquivalents(plan.id);
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-xl border-2 text-left transition-all ${
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
                  COP {PRO_PLANS[plan.id].displayCOP}
                  <span className="text-white/40 text-sm font-normal">{plan.period}</span>
                </p>
                {plan.note && <p className="text-white/40 text-xs mt-1">{plan.note}</p>}

                <div className="mt-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/35">{copy.approx}</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-white/55">
                    {Object.entries(equivalents).map(([currency, value]) => (
                      <span key={currency}>
                        {currency}: {value}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#FF5E00] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">OK</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-xl font-black text-lg bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-[#FF5E00]/30"
        >
          {loading
            ? copy.redirecting
            : selectedPlan === "yearly"
              ? copy.payYearly
              : copy.payMonthly}
        </button>

        <p className="text-white/30 text-xs text-center mt-3">{copy.secure}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/10 pt-6 space-y-4"
      >
        <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider">{copy.faqTitle}</h3>
        {copy.faq.map(([question, answer]) => (
          <div key={question}>
            <p className="text-white/70 text-sm font-semibold">{question}</p>
            <p className="text-white/40 text-sm mt-0.5">{answer}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
