"use client";

import Link from "next/link";
import {
  Users,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";
import HeroCanvas from "@/components/HeroCanvas";
import CatalogSection from "@/components/CatalogSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import Reveal from "@/components/Reveal";
import { useLang } from "@/components/LanguageProvider";
import { waLink, waGeneralMessage } from "@/lib/contact";
import { companionCities } from "@/lib/companions";
import { products } from "@/lib/products";
import { loc } from "@/lib/i18n";

export default function HomePage() {
  const { t, locale } = useLang();

  const cityCount = companionCities.length;
  const guideCount = products.filter((p) => p.category === "travel").length;
  const companionCount = companionCities.reduce(
    (n, c) => n + c.companions.length,
    0
  );

  const stats = [
    [String(cityCount), t("home.stat.cities")],
    [String(guideCount), t("home.stat.guides")],
    [String(companionCount), t("home.stat.companions")],
    ["24/7", t("home.stat.whatsapp")],
  ];

  const features = [
    { icon: Compass, title: t("home.feat.global.title"), desc: t("home.feat.global.desc") },
    { icon: Users, title: t("home.feat.comp.title"), desc: t("home.feat.comp.desc") },
    { icon: MessageCircle, title: t("home.feat.whatsapp.title"), desc: t("home.feat.whatsapp.desc") },
    { icon: Sparkles, title: t("home.feat.custom.title"), desc: t("home.feat.custom.desc") },
  ];

  const steps = [
    { n: "01", title: t("home.stepA.title"), desc: t("home.stepA.desc") },
    { n: "02", title: t("home.stepB.title"), desc: t("home.stepB.desc") },
    { n: "03", title: t("home.stepC.title"), desc: t("home.stepC.desc") },
  ];

  return (
    <>
      <HeroCanvas />

      {/* 数据条 */}
      <div className="border-y border-white/5 bg-ink-800/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-8 text-center sm:grid-cols-4">
          {stats.map(([k, v], i) => (
            <Reveal key={v} delay={i * 0.08} dir="up">
              <div className="font-serif text-3xl font-bold gold-text">{k}</div>
              <div className="mt-1 text-xs text-gold-100/50">{v}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 分类展示区（大卡片：中国旅行指南 / 本地陪玩） */}
      <CategoryShowcase />

      {/* 目录（旅行指南网格） */}
      <CatalogSection />

      {/* 本地陪玩引流 */}
      <section className="border-y border-white/5 bg-gradient-to-br from-ink-800 to-ink-900">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 text-xs text-gold-200">
                <Users size={13} />
                {t("comp.hero.badge")}
              </span>
              <h2 className="mt-5 font-serif text-3xl font-bold text-gold-100 sm:text-5xl">
                {t("home.companion.title")}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-gold-100/60">
                {t("home.companion.sub")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/companions" className="btn-gold">
                  {t("home.companion.cta")} <ArrowRight size={16} />
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

            <Reveal dir="right" delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-gold-400/15 p-8">
                <div className="absolute inset-0 bg-radial-lux opacity-40" />
                <div className="relative space-y-4">
                  {companionCities.map((c) => (
                    <div
                      key={c.slug}
                      className="flex items-center gap-4 rounded-2xl bg-ink-900/50 p-4"
                    >
                      <span className="text-3xl">{c.emoji}</span>
                      <div className="flex-1">
                        <p className="font-serif text-lg font-semibold text-gold-100">
                          {loc(c.name, locale)}
                        </p>
                        <p className="text-xs text-gold-100/45">
                          {c.companions.length} · {t("comp.verified")}
                        </p>
                      </div>
                      <Link
                        href={`/companions/${c.slug}`}
                        className="text-sm text-gold-300 hover:underline"
                      >
                        {t("comp.seeGuides")} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 城市风景画廊 —— 6 城大图瀑布流 */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("comp.cities.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("comp.cities.title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companionCities.map((c, i) => (
            <Reveal key={c.slug} dir="up" delay={(i % 3) * 0.1}>
              <Link
                href={`/companions/${c.slug}`}
                className={`group relative block overflow-hidden rounded-2xl border border-white/5 ${
                  i === 0 ? "row-span-2 sm:col-span-1 lg:row-span-2" : ""
                } ${i === 3 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div
                  className={`${
                    i === 0 ? "aspect-[3/4] sm:aspect-auto sm:h-full" : "aspect-[16/10]"
                  } overflow-hidden`}
                >
                  <img
                    src={`/images/cities/${c.slug}.jpg`}
                    alt={loc(c.name, locale)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-2xl">{c.emoji}</span>
                  <h3 className="mt-1 font-serif text-xl font-bold text-white drop-shadow">
                    {loc(c.name, locale)}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/70 drop-shadow">
                    {c.companions.length} companions · {t("comp.verified")}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 为什么选择 */}
      <section className="border-t border-white/5 bg-ink-800/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <Reveal className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
              {t("home.why.eyebrow")}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
              {t("home.why.title")}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1} dir="up">
                <div className="card h-full p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                    <f.icon size={22} />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-gold-100">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-gold-100/55">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("home.how.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("home.how.title")}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} dir="up">
              <div className="relative card h-full p-7">
                <span className="font-serif text-5xl font-bold text-gold-400/30">
                  {s.n}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-gold-100">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gold-100/55">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 终极 CTA + 联系方式 */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <Reveal dir="up">
          <div className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-ink-700 to-ink-800 p-10 text-center shadow-glow-lg sm:p-16">
            <div className="absolute inset-0 bg-radial-lux" />
            <div className="relative">
              <Sparkles className="mx-auto text-gold-400" size={28} />
              <h2 className="mt-4 font-serif text-3xl font-bold text-gold-100 sm:text-5xl">
                {t("home.cta.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gold-100/65">
                {t("home.cta.desc")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/companions" className="btn-gold">
                  {t("home.cta.explore")} <ArrowRight size={16} />
                </Link>
                <a
                  href={waLink(waGeneralMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <MessageCircle size={16} />
                  {t("home.cta.contact")}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
