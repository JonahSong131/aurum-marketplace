"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  LOCALES,
  DEFAULT_LOCALE,
  translate,
  type Locale,
  type LocaleMeta,
} from "@/lib/i18n";

interface LangContextValue {
  locale: Locale;
  meta: LocaleMeta;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "ximi-locale";

function metaOf(locale: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 先以默认语言渲染（与服务端一致），挂载后再从本地存储恢复，避免水合不匹配
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some((l) => l.code === saved)) {
        setLocaleState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const m = metaOf(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = m.dir;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  );

  return (
    <LangContext.Provider value={{ locale, meta: metaOf(locale), setLocale, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // 兜底：未包裹时退化为英文，保证不崩溃
    return {
      locale: DEFAULT_LOCALE,
      meta: metaOf(DEFAULT_LOCALE),
      setLocale: () => {},
      t: (key: string, vars?: Record<string, string | number>) =>
        translate(DEFAULT_LOCALE, key, vars),
    };
  }
  return ctx;
}

// 便捷导出
export { LOCALES };
