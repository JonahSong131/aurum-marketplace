"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { loc, DEFAULT_LOCALE } from "@/lib/i18n";
import { waLink, waGuideMessage } from "@/lib/contact";

export default function ProductDetail({ product }: { product: Product }) {
  const { t, locale } = useLang();

  function getOnWhatsApp() {
    window.open(
      waLink(waGuideMessage(loc(product.title, DEFAULT_LOCALE))),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/#catalog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gold-100/55 hover:text-gold-100"
      >
        <ArrowLeft size={16} /> {t("detail.back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-3xl sm:h-96">
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={loc(product.title, locale)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-ink-900/30" />
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${product.cover.from}, ${product.cover.to})`,
              }}
            >
              <span className="text-8xl drop-shadow-2xl">{product.cover.icon}</span>
            </div>
          )}
          <span className="absolute left-5 top-5 rounded-full bg-ink-900/60 px-3 py-1 text-xs tracking-widest text-gold-200 backdrop-blur">
            {loc(product.section, locale)}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400">
            {t("detail.cat.travel")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-gold-100 sm:text-4xl">
            {loc(product.title, locale)}
          </h1>
          <p className="mt-2 text-lg text-gold-100/65">
            {loc(product.subtitle, locale)}
          </p>

          <div className="mt-4 flex items-center gap-3 text-sm text-gold-100/50">
            <span>
              {product.pages} {t("unit.pages")}
            </span>
            <span>·</span>
            <span>{product.format}</span>
            <span>·</span>
            <span>{product.language}</span>
          </div>

          <p className="mt-5 leading-relaxed text-gold-100/70">
            {loc(product.description, locale)}
          </p>

          <ul className="mt-5 space-y-2">
            {product.preview.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gold-100/70"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                {loc(p, locale)}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex items-end gap-3">
            <span className="font-serif text-4xl font-bold gold-text">
              ${product.priceUSD.toFixed(2)}
            </span>
            <span className="pb-1 text-sm text-gold-100/40">
              {t("detail.priceNote")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={getOnWhatsApp} className="btn-gold">
              <MessageCircle size={16} /> {t("detail.ctaWhatsApp")}
            </button>
          </div>

          <p className="mt-4 text-xs text-gold-100/40">{t("detail.whatsappNote")}</p>
        </div>
      </div>
    </div>
  );
}
