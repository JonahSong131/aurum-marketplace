"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLang, LOCALES } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("lang.label")}
        className="flex h-10 items-center gap-1.5 rounded-full border border-gold-400/30 px-3 text-sm text-gold-100 transition hover:bg-gold-400/10"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <ChevronDown size={13} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-gold-400/15 bg-ink-800/95 py-1 shadow-glow-lg backdrop-blur-xl">
          <p className="px-4 py-2 text-[11px] uppercase tracking-widest text-gold-100/40">
            {t("lang.label")}
          </p>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-gold-400/10 ${
                l.code === locale ? "text-gold-200" : "text-gold-100/75"
              }`}
            >
              <span className="text-lg leading-none">{l.flag}</span>
              <span className="flex-1">{l.native}</span>
              {l.code === locale && <Check size={15} className="text-gold-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
