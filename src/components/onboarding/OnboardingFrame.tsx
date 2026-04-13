"use client";

import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const COPY = {
  en: {
    status: "Setting up your account",
    label: "World Cup 2026 fan setup",
  },
  es: {
    status: "Configurando tu cuenta",
    label: "Configuracion fan del Mundial 2026",
  },
  pt: {
    status: "Configurando sua conta",
    label: "Configuracao fan da Copa 2026",
  },
  fr: {
    status: "Configuration du compte",
    label: "Configuration fan Coupe du Monde 2026",
  },
  de: {
    status: "Konto wird eingerichtet",
    label: "WM 2026 Fan-Einrichtung",
  },
  ar: {
    status: "جاري إعداد حسابك",
    label: "إعداد مشجع كأس العالم 2026",
  },
} as const;

export function OnboardingFrame({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#06070E]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,0,61,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,184,0,0.1),transparent_24%),linear-gradient(180deg,#090A14_0%,#05060C_100%)]" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)", backgroundSize: "42px 42px" }} />

      <header className="relative z-10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <div className="min-w-0">
            <span className="bg-gradient-to-r from-[#E8003D] via-[#FF5E00] to-[#FFB800] bg-clip-text text-2xl font-black tracking-tight text-transparent">
              STAMPEDE
            </span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              {copy.label}
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full ${i === 0 ? "w-8 bg-gradient-to-r from-[#E8003D] to-[#FF5E00]" : "w-3 bg-white/20"}`}
                />
              ))}
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">{copy.status}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-3 pb-8 pt-3 sm:items-center sm:px-4">
        {children}
      </main>
    </div>
  );
}
