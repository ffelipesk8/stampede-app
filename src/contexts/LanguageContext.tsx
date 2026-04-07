"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Locale, TranslationKey, t as translate, LOCALES } from "@/lib/i18n/translations";

const STORAGE_KEY = "stampede_locale";

// ── Detect browser language on first visit ────────────────────────────────────
function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("ar")) return "ar";
  return "en";
}

function loadLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && LOCALES.some((l) => l.code === stored)) return stored;
  return detectBrowserLocale();
}

// ── Context ───────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
  currentLocaleInfo: typeof LOCALES[number];
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  isRTL: false,
  currentLocaleInfo: LOCALES[0],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(loadLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, l);
    }
    // Update html dir for RTL support
    const localeInfo = LOCALES.find((x) => x.code === l);
    document.documentElement.setAttribute("dir", localeInfo?.rtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  const currentLocaleInfo = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const isRTL = currentLocaleInfo.rtl ?? false;

  // Avoid hydration mismatch — render with default "en" on server
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: "en", setLocale, t: (key) => translate("en", key), isRTL: false, currentLocaleInfo: LOCALES[0] }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL, currentLocaleInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useLanguage() {
  return useContext(LanguageContext);
}

// Re-export for convenience
export { LOCALES };
