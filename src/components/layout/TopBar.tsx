"use client";

import { UserButton } from "@clerk/nextjs";
import { Zap, Bell, Globe, Check } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLanguage, LOCALES } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface TopBarProps {
  xp: number;
  coins?: number;
  notificationCount?: number;
}

export function TopBar({ xp, coins = 0, notificationCount = 0 }: TopBarProps) {
  const { locale, setLocale, currentLocaleInfo, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-14 bg-card1 border-b border-border flex items-center px-6 gap-3 shrink-0">
      <div className="flex-1" />

      {/* Coins chip */}
      <Link
        href="/marketplace"
        className="flex items-center gap-1.5 bg-card2 border border-border rounded-full px-3 py-1 hover:border-[#FFB800]/40 transition-colors"
      >
        <span className="text-sm">🪙</span>
        <span className="text-[#FFB800] font-display font-bold text-xs">
          {coins.toLocaleString()}
        </span>
      </Link>

      {/* XP chip */}
      <div className="flex items-center gap-1.5 bg-card2 border border-border rounded-full px-3 py-1">
        <Zap className="w-3.5 h-3.5 text-gold" />
        <span className="text-gold font-display font-bold text-xs">
          {xp.toLocaleString()} XP
        </span>
      </div>

      {/* -- Language Switcher --------------------------------------------------- */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger button — always visible, prominent */}
        <button
          onClick={() => setLangOpen((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 h-9 px-3 rounded-xl border-2 font-black text-xs tracking-wide transition-all duration-200",
            langOpen
              ? "bg-orange/20 border-orange text-orange"
              : "bg-card2 border-border text-t1 hover:border-orange/60 hover:bg-orange/10"
          )}
          title={t("common.language")}
        >
          <span className="text-base leading-none">{currentLocaleInfo.flag}</span>
          <span className="uppercase hidden sm:inline">{currentLocaleInfo.code}</span>
          <Globe className="w-3.5 h-3.5 text-current opacity-70" />
        </button>

        {/* Dropdown panel */}
        {langOpen && (
          <div
            className="absolute right-0 top-12 z-[200] w-60 bg-card1 border border-border rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,94,0,0.15)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-to-r from-orange/5 to-transparent">
              <Globe className="w-4 h-4 text-orange" />
              <p className="text-t1 text-sm font-black tracking-wide">{t("common.language")}</p>
            </div>

            {/* Options */}
            <div className="py-1">
              {LOCALES.map((loc) => {
                const isActive = loc.code === locale;
                return (
                  <button
                    key={loc.code}
                    onClick={() => { setLocale(loc.code); setLangOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150",
                      isActive
                        ? "bg-orange/12 border-l-2 border-orange"
                        : "border-l-2 border-transparent hover:bg-card2 hover:border-orange/30"
                    )}
                  >
                    <span className="text-2xl leading-none w-8 text-center flex-shrink-0">
                      {loc.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-bold leading-tight", isActive ? "text-orange" : "text-t1")}>
                        {loc.nativeLabel}
                      </p>
                      <p className="text-[11px] text-t3 leading-tight mt-0.5">{loc.label}</p>
                    </div>
                    {isActive
                      ? <Check className="w-4 h-4 text-orange flex-shrink-0" />
                      : <span className="text-[10px] font-black text-t3 uppercase">{loc.code}</span>
                    }
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border bg-card2/40 flex items-center gap-1.5">
              <span className="text-sm">⚽</span>
              <p className="text-t3 text-[10px] font-medium">World Cup 2026 · 6 languages</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-card2 transition-colors">
        <Bell className="w-4 h-4 text-t2" />
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full" />
        )}
      </button>

      {/* Clerk user button */}
      <UserButton
        afterSignOutUrl="/"
        appearance={{ variables: { colorPrimary: "#E8003D" } }}
      />
    </header>
  );
}
