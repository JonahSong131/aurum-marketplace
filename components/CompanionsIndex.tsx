"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Users } from "lucide-react";
import {
  companionCities,
  serviceModes,
  trustPoints,
} from "@/lib/companions";
import { useLang } from "@/components/LanguageProvider";
import { loc } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import BookingWizard from "@/components/BookingWizard";
import { waLink, waGeneralMessage } from "@/lib/contact";

export default function CompanionsIndex() {
  const { t, locale } = useLang();

  return (
    <div>
      {/* 头部 —— 城市风景大图背景 */}
      <div className="relative overflow-hidden border-b border-white/5">
        {/* 背景图轮播：取前 3 张城市图做淡入叠层 */}
        <div className="absolute inset-0">
          {companionCities.slice(0, 3).map((c, i) => (
            <img
              key={c.slug}
              src={`/images/cities/${c.slug}.jpg`}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[8s] ease-in-out ${
                i === 0 ? "opacity-40" : "opacity-0 hover:opacity-30"
              }`}
              style={{ animationDelay: `${i * 3}s` }}
              loading="eager"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/80 via-ink-900/70 to-ink-900" />
        <div className="absolute inset-0 bg-radial-lux opacity-50" />

        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:py-32">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 text-xs text-gold-200">
              <Users size={13} />
              {t("comp.hero.badge")}
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-gold-100 sm:text-6xl">
              {t("comp.hero.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gold-100/60">
              {t("comp.hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#cities" className="btn-gold">
                {t("comp.hero.cities")}
              </Link>
              <a
                href={waLink(waGeneralMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <MessageCircle size={16} />
                {t("comp.hero.chat")}
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 城市 */}
      <section id="cities" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("comp.cities.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("comp.cities.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gold-100/55">
            {t("comp.cities.sub")}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {companionCities.map((c, i) => (
            <Reveal key={c.slug} dir="up" delay={(i % 3) * 0.1}>
              <Link
                href={`/companions/${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/8 shadow-lg shadow-black/20"
              >
                {/* 城市大图 / 暂无实拍图时回退到品牌渐变 */}
                {c.image ? (
                  <img
                    src={c.image}
                    alt={loc(c.name, locale)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-800 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 120%)`,
                    }}
                  />
                )}
                {/* 多层渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${c.from}33%, transparent 66%)`,
                  }}
                />

                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span className="rounded-xl border border-white/12 bg-black/30 px-3 py-1.5 text-sm backdrop-blur-md">
                      {c.emoji}
                    </span>
                    <span className="rounded-full border border-jade-500/30 bg-jade-500/10 px-3 py-1 text-[11px] font-semibold text-jade-300 backdrop-blur-md">
                      {c.companions.length} {t("comp.verified")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-white drop-shadow-lg">
                      {loc(c.name, locale)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/80 drop-shadow">
                      {loc(c.tagline, locale)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/25 group-hover:px-5">
                      {t("comp.seeGuides")} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 两种服务方式 */}
      <section className="border-y border-white/5 bg-ink-800/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
              {t("comp.modes.eyebrow")}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
              {t("comp.modes.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gold-100/55">
              {t("comp.modes.sub")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {serviceModes.map((m, i) => (
              <Reveal key={m.id} dir={i === 0 ? "right" : "left"} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/5 p-8 transition hover:border-gold-400/20">
                  {/* 背景装饰 */}
                  <div
                    className="absolute -right-8 -top-8 text-[120px] opacity-[0.06] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"
                  >
                    {m.emoji}
                  </div>
                  <div className="relative">
                    <span className="inline-flex items-center justify-center rounded-xl bg-gold-400/10 p-3 text-3xl">
                      {m.emoji}
                    </span>
                    <h3 className="mt-5 font-serif text-2xl font-bold text-gold-100">
                      {loc(m.title, locale)}
                    </h3>
                    <p className="mt-3 leading-relaxed text-gold-100/60">
                      {loc(m.desc, locale)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选我们 */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("comp.trust.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("comp.trust.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gold-100/55">
            {t("comp.trust.sub")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((p, i) => (
            <Reveal key={i} dir="up" delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-ink-800/50 to-transparent p-6 transition hover:border-gold-400/15">
                <span className="text-4xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 inline-block">
                  {p.emoji}
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-gold-100">
                  {loc(p.title, locale)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-100/55">
                  {loc(p.desc, locale)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 四步预约向导 */}
      <section id="book" className="border-t border-white/5 bg-ink-800/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
              {t("wiz.eyebrow")}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
              {t("wiz.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gold-100/55">
              {t("wiz.sub")}
            </p>
          </Reveal>

          <div className="mt-12">
            <BookingWizard />
          </div>
        </div>
      </section>
    </div>
  );
}
