"use client";

import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";
import { WHATSAPP_DISPLAY, EMAIL, waLink } from "@/lib/contact";

export default function Footer() {
  const { t, locale } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad font-serif text-lg font-bold text-ink-900">
              X
            </span>
            <span className="font-serif text-xl font-bold text-gold-100">
              Ximi{locale === "zh" && <span className="ml-1 text-gold-300">私人定制游</span>}
            </span>
          </div>
            <p className="mt-3 max-w-xs text-sm text-gold-100/50">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">{t("footer.boards")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gold-100/55">
              <li>
                <Link href="/travel" className="hover:text-gold-100">
                  {t("nav.travel")}
                </Link>
              </li>
              <li>
                <Link href="/companions" className="hover:text-gold-100">
                  {t("nav.companions")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">{t("footer.support")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gold-100/55">
              <li>
                <Link href="/#catalog" className="hover:text-gold-100">
                  {t("footer.all")}
                </Link>
              </li>
              <li>
                <span className="cursor-default">{t("footer.help")}</span>
              </li>
              <li>
                <span className="cursor-default">{t("footer.seller")}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">{t("footer.contact")}</h4>
            <ul className="mt-3 space-y-3 text-sm text-gold-100/60">
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition hover:text-gold-100"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-400/30 text-gold-200 transition group-hover:bg-gold-400/10">
                    <MessageCircle size={16} />
                  </span>
                  <span>
                    WhatsApp
                    <span className="block text-xs text-gold-100/45">{WHATSAPP_DISPLAY}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-3 transition hover:text-gold-100"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-400/30 text-gold-200 transition group-hover:bg-gold-400/10">
                    <Mail size={16} />
                  </span>
                  <span>
                    Email
                    <span className="block text-xs text-gold-100/45">{EMAIL}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-gold-100/40 sm:flex-row">
          <p>{t("footer.copyright", { year })}</p>
          <p>{t("footer.built")}</p>
        </div>
      </div>
    </footer>
  );
}
