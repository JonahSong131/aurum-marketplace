"use client";

import { MessageCircle, Languages, Clock } from "lucide-react";
import type { Companion } from "@/lib/companions";
import { useLang } from "@/components/LanguageProvider";
import { loc } from "@/lib/i18n";
import { waLink, waCompanionMessage } from "@/lib/contact";

export default function CompanionCard({
  companion,
  cityName,
}: {
  companion: Companion;
  cityName: string;
}) {
  const { t, locale } = useLang();
  const c = companion;

  return (
    <div className="card group flex h-full flex-col overflow-hidden p-0">
      {/* 头像/照片区 —— 加高 */}
      <div className="relative h-56 overflow-hidden sm:h-64">
        {c.photo ? (
          <img
            src={c.photo}
            alt={c.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-800">
            <div className="absolute inset-0 bg-radial-lux opacity-60" />
            <span className="absolute inset-0 grid place-items-center text-7xl transition-transform duration-500 group-hover:scale-110">
              {c.emoji}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-jade-500/40 bg-ink-900/70 px-2.5 py-1 text-[10px] font-semibold text-jade-300 backdrop-blur">
          ✓ {t("comp.verified")}
        </span>
        <div className="absolute bottom-3 left-4">
          <h3 className="font-serif text-xl font-bold text-gold-100">
            {c.name}
            {c.cnName && (
              <span className="ml-2 text-sm font-normal text-gold-200/70">
                {c.cnName}
              </span>
            )}
          </h3>
          <p className="text-xs text-gold-100/55">
            {c.age ? `${c.age} · ` : ""}
            {t("comp.yearsGuiding", { n: c.years })}
          </p>
        </div>
      </div>

      {/* 信息区 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          {c.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-gold-400/20 bg-gold-400/5 px-2.5 py-1 text-[11px] text-gold-200/80"
            >
              {loc(tag, locale)}
            </span>
          ))}
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-gold-100/60">
          {loc(c.intro, locale)}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-gold-100/45">
          <span className="inline-flex items-center gap-1.5">
            <Languages size={13} /> {c.languages.join(" · ")}
          </span>
        </div>

        {/* 价格 + CTA */}
        <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gold-100/35">
              <Clock size={11} className="mr-1 inline" />
              {t("comp.halfDay")} / {t("comp.fullDay")}
            </p>
            <p className="mt-0.5 font-serif text-lg font-bold text-gold-200">
              ${c.halfDayUSD}{" "}
              <span className="text-gold-100/30">/</span> ${c.fullDayUSD}
            </p>
          </div>
          <a
            href={waLink(waCompanionMessage(c.name, cityName))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gold-grad px-4 py-2 text-sm font-semibold text-ink-900 shadow-glow transition hover:scale-[1.03]"
          >
            <MessageCircle size={15} />
            {t("comp.book")}
          </a>
        </div>
      </div>
    </div>
  );
}
