"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { loc } from "@/lib/i18n";
import { waLink, waGuideMessage } from "@/lib/contact";

export default function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useLang();

  function openWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    window.open(waLink(waGuideMessage(loc(product.title, locale))), "_blank", "noopener,noreferrer");
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="card group relative block overflow-hidden p-0"
    >
      <div className="relative h-40 overflow-hidden">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={loc(product.title, locale)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-ink-900/45" />
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${product.cover.from}, ${product.cover.to})`,
            }}
          >
            <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
              {product.cover.icon}
            </span>
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/70 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gold-200 backdrop-blur">
            {t("badge.featured")}
          </span>
        )}
        {product.new && (
          <span className="absolute left-3 top-3 rounded-full bg-jade-500/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-ink-900 backdrop-blur">
            {t("badge.new")}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest text-gold-100/40">
            {loc(product.section, locale)}
          </span>
          <span className="font-serif text-lg font-bold text-gold-200">
            ${product.priceUSD.toFixed(2)}
          </span>
        </div>
        <h3 className="mt-1 font-serif text-lg font-semibold text-gold-100">
          {loc(product.title, locale)}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gold-100/55">
          {loc(product.summary, locale)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gold-100/40">
            {product.pages} {t("unit.pages")} · {product.format}
          </span>
          <button
            onClick={openWhatsApp}
            className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad text-ink-900 shadow-glow transition hover:scale-105"
            aria-label={t("detail.ctaWhatsApp")}
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
