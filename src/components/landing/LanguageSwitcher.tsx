"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGES, type LangCode } from "@/i18n/landing";

interface Props {
  current: LangCode;
  onChange: (lang: LangCode) => void;
}

export function LanguageSwitcher({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
        style={{ color: "#aaaacc", border: "1px solid rgba(255,255,255,0.08)" }}
        aria-label="Select language"
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="hidden sm:block">{currentLang.name}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-[200] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(12,12,24,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            minWidth: 220,
          }}
        >
          <div className="p-2">
            <p className="text-[10px] font-black tracking-widest uppercase px-3 py-2"
               style={{ color: "#555577" }}>
              🌐 Language / Idioma
            </p>
            <div className="grid grid-cols-2 gap-1">
              {LANGUAGES.map((lang) => {
                const isActive = lang.code === current;
                return (
                  <button
                    key={lang.code}
                    onClick={() => { onChange(lang.code); setOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-white/10"
                    style={{
                      background: isActive ? "rgba(255,94,0,0.15)" : "transparent",
                      border: isActive ? "1px solid rgba(255,94,0,0.3)" : "1px solid transparent",
                    }}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate"
                         style={{ color: isActive ? "#FF5E00" : "#ccccee" }}>
                        {lang.name}
                      </p>
                      {lang.recommended && (
                        <p className="text-[9px] font-black uppercase tracking-wider"
                           style={{ color: "#FFB800" }}>
                          ★ Recommended
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[#FF5E00] text-xs font-black">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
