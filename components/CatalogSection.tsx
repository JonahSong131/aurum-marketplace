"use client";

import { useState } from "react";
import { products, categories } from "@/lib/products";
import ProductGrid from "./ProductGrid";
import { useLang } from "@/components/LanguageProvider";

export default function CatalogSection() {
  const { t } = useLang();
  const [tab, setTab] = useState("all");
  const list =
    tab === "all" ? products : products.filter((p) => p.category === tab);

  const tabs = [
    { id: "all", label: t("tab.all") },
    ...categories.map((c) => ({ id: c.id, label: t(`cat.${c.id}`) })),
  ];

  return (
    <section id="catalog" className="relative mx-auto max-w-7xl px-5 py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
            {t("catalog.eyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {t("catalog.title")}
          </h2>
          <p className="mt-2 text-gold-100/55">{t("catalog.sub")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t2) => (
            <button
              key={t2.id}
              onClick={() => setTab(t2.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                tab === t2.id
                  ? "bg-gold-grad font-semibold text-ink-900 shadow-glow"
                  : "border border-gold-400/30 text-gold-100/70 hover:bg-gold-400/10"
              }`}
            >
              {t2.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <ProductGrid products={list} />
      </div>
    </section>
  );
}
