"use client";

import Link from "next/link";
import { Compass, Users, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";
import { companionCities } from "@/lib/companions";
import { useLang } from "@/components/LanguageProvider";
import Reveal from "@/components/Reveal";

type Cat = {
  id: "travel" | "companions";
  href: string;
  icon: typeof Compass;
  image: string;       // 背景大图
  from: string;
  to: string;
  emoji: string;
  count: string;
};

export default function CategoryShowcase() {
  const { t } = useLang();
  const travelCount = products.filter((p) => p.category === "travel").length;
  const companionCount = companionCities.reduce(
    (n, c) => n + c.companions.length,
    0
  );

  const CATS: Cat[] = [
    {
      id: "travel",
      href: "/travel",
      icon: Compass,
      image: "/images/cities/beijing.jpg",       // 故宫/长城风景
      from: "#1b2440",
      to: "#c79a2b",
      emoji: "🏯",
      count: `${travelCount} · ${t("cat.travel")}`,
    },
    {
      id: "companions",
      href: "/companions",
      icon: Users,
      image: "/images/cities/chengdu.jpg",        // 成都烟火气（陪玩氛围）
      from: "#1d3326",
      to: "#3fd9b6",
      emoji: "🧑‍🤝‍🧑",
      count: `${companionCount} · ${t("comp.verified")}`,
    },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
          {t("home.cats.eyebrow")}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
          {t("home.cats.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gold-100/55">
          {t("home.cats.sub")}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {CATS.map((c, i) => (
          <Reveal key={c.id} dir={i === 0 ? "right" : "left"} delay={i * 0.12}>
            <Link
              href={c.href}
              className="group relative block h-[340px] overflow-hidden rounded-3xl border border-white/5 sm:h-[420px]"
            >
              {/* 真实城市风景背景图 */}
              <img
                src={c.image}
                alt={t(`cat.${c.id}`)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* 多层遮罩：底部深 + 色调叠加 */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/50 to-ink-900/20" />
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  background: `linear-gradient(135deg, ${c.from} 0%, ${c.to} 130%)`,
                }}
              />
              {/* 微妙纹理 */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-gold-100 backdrop-blur-md">
                    <c.icon size={26} />
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-gold-100/80 backdrop-blur-md">
                    {c.count}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-3xl font-bold text-gold-100 drop-shadow sm:text-4xl">
                    {t(`cat.${c.id}`)}
                  </h3>
                  <p className="mt-1 text-sm text-gold-200/80 drop-shadow">
                    {t(`cat.tagline.${c.id}`)}
                  </p>
                  <p className="mt-3 max-w-md text-sm text-gold-100/70 drop-shadow">
                    {t(`cat.${c.id}.desc`)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-grad px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-glow transition-transform duration-300 group-hover:translate-x-1">
                    {t("cat.enter")}
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
