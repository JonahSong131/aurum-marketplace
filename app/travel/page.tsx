"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import { useLang } from "@/components/LanguageProvider";
import { loc } from "@/lib/i18n";

export default function TravelPage() {
  const { t, locale } = useLang();
  const list = products.filter((p) => p.category === "travel");
  const sections = Array.from(
    new Set(list.map((p) => JSON.stringify(p.section)))
  ).map((s) => JSON.parse(s) as (typeof list)[number]["section"]);

  useEffect(() => {
    document.title = t("travel.head.title") + " · Ximi";
  }, [t]);

  return (
    <div>
      {/* 头部 */}
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#1b2440] to-ink-900">
        <div className="absolute inset-0 bg-radial-lux" />
        <div className="relative mx-auto max-w-7xl px-5 py-16">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/10 text-gold-300">
              <Compass size={24} />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-bold text-gold-100 sm:text-5xl">
                {t("travel.head.title")}
              </h1>
              <p className="mt-1 text-gold-100/60">{t("travel.head.sub")}</p>
            </div>
          </div>
          <Link href="/#catalog" className="btn-ghost mt-6 !text-sm">
            {t("travel.allBoards")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 按城市分组 */}
      <div className="mx-auto max-w-7xl px-5 py-12">
        {sections.map((sec) => {
          const key = sec.en;
          return (
            <section key={key} className="mb-12">
              <h2 className="mb-5 flex items-center gap-2 font-serif text-2xl font-semibold text-gold-100">
                <span className="h-5 w-1 rounded bg-gold-grad" />
                {loc(sec, locale)}
              </h2>
              <ProductGrid products={list.filter((p) => p.section.en === key)} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
