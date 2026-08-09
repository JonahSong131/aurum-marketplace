"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Check, Users } from "lucide-react";
import type { CompanionCity } from "@/lib/companions";
import { useLang } from "@/components/LanguageProvider";
import { loc, DEFAULT_LOCALE } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import CompanionCard from "@/components/CompanionCard";
import BookingWizard from "@/components/BookingWizard";
import { waLink, waCharterMessage, waGeneralMessage } from "@/lib/contact";

export default function CityCompanions({ city }: { city: CompanionCity }) {
  const { t, locale } = useLang();
  const cityEn = loc(city.name, DEFAULT_LOCALE);

  return (
    <div>
      {/* 城市头图 —— 全宽大图 Hero */}
      <div className="relative overflow-hidden">
        {/* 城市风景大图 / 暂无实拍图时回退到品牌渐变 */}
        <div className="relative h-[50vh] min-h-[380px] max-h-[520px]">
          {city.image ? (
            <img
              src={city.image}
              alt={loc(city.name, locale)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${city.from} 0%, ${city.to} 120%)`,
              }}
            />
          )}
          {/* 多层遮罩：底部深 + 两侧暗角 */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-transparent to-ink-900/60" />
          {/* 微妙纹理叠加 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 -mt-[30vh] pb-8">
          <Link
            href="/companions"
            className="inline-flex items-center gap-1.5 text-sm text-gold-100/55 transition hover:text-gold-100"
          >
            <ArrowLeft size={15} /> {t("comp.backCities")}
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span className="text-6xl">{city.emoji}</span>
            <div>
              <h1 className="font-serif text-4xl font-bold text-gold-100 sm:text-6xl">
                {loc(city.name, locale)}
              </h1>
              <p className="mt-2 text-lg text-gold-200/75">
                {loc(city.tagline, locale)}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-gold-100/60">
            {loc(city.blurb, locale)}
          </p>

          <ul className="mt-6 space-y-2">
            {city.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-gold-100/70"
              >
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gold-400/20 text-gold-300">
                  <Check size={10} />
                </span>
                {loc(h, locale)}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#guides" className="btn-gold">
              <Users size={16} />
              {t("comp.seeGuides")}
            </Link>
            <Link href="#charter" className="btn-ghost">
              🚗 {t("comp.charter.link")}
            </Link>
          </div>
        </div>
      </div>

      {/* 地陪阵容 */}
      <section id="guides" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("comp.lineup.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("comp.lineup.title", { city: loc(city.name, locale) })}
          </h2>
          <p className="mt-3 max-w-2xl text-gold-100/55">
            {t("comp.lineup.sub")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {city.companions.map((c, i) => (
            <Reveal key={c.id} dir="up" delay={(i % 3) * 0.08}>
              <CompanionCard companion={c} cityName={cityEn} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 rounded-2xl border border-gold-400/15 bg-gold-400/5 p-5 text-sm text-gold-100/60">
          {t("comp.lineup.note")}
        </p>
      </section>

      {/* 包车游 */}
      <section id="charter" className="border-y border-white/5 bg-ink-800/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
              {t("comp.charter.eyebrow")}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
              {t("comp.charter.title", { city: loc(city.name, locale) })}
            </h2>
            <p className="mt-3 max-w-2xl text-gold-100/55">
              {t("comp.charter.sub")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {city.charter.map((car, i) => (
              <Reveal key={car.id} dir="up" delay={i * 0.08}>
                <div className="card flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{car.emoji}</span>
                    <span className="rounded-full border border-gold-400/20 px-2.5 py-1 text-[11px] text-gold-200/80">
                      {t("comp.charter.seats", { n: car.seats })}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-gold-100">
                    {loc(car.type, locale)}
                  </h3>
                  <p className="mt-1 text-xs text-gold-100/40">{car.model}</p>
                  <p className="mt-3 flex-1 text-sm text-gold-100/55">
                    {loc(car.note, locale)}
                  </p>

                  <div className="mt-5 flex items-end justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gold-100/35">
                        {t("comp.charter.perDay")}
                      </p>
                      <p className="mt-0.5 font-serif text-xl font-bold text-gold-200">
                        ${car.perDayUSD}
                      </p>
                    </div>
                    <a
                      href={waLink(
                        waCharterMessage(loc(car.type, DEFAULT_LOCALE), cityEn)
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/35 px-4 py-2 text-sm text-gold-100 transition hover:bg-gold-400/10"
                    >
                      <MessageCircle size={15} />
                      {t("comp.charter.ask")}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-xs text-gold-100/40">
            {t("comp.charter.note")}
          </p>
        </div>
      </section>

      {/* 预约向导（默认锁定本城） */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("wiz.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("wiz.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gold-100/55">{t("wiz.sub")}</p>
        </Reveal>
        <div className="mt-12">
          <BookingWizard defaultCity={city.slug} />
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-ink-700 to-ink-800 p-10 text-center sm:p-14">
          <div className="absolute inset-0 bg-radial-lux" />
          <div className="relative">
            <h2 className="font-serif text-2xl font-bold text-gold-100 sm:text-4xl">
              {t("comp.cta.title", { city: loc(city.name, locale) })}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-gold-100/60">
              {t("comp.cta.sub")}
            </p>
            <a
              href={waLink(waGeneralMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-7"
            >
              <MessageCircle size={16} />
              {t("comp.cta.btn")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
