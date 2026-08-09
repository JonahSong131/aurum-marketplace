"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { WHATSAPP_DISPLAY, WHATSAPP_DISPLAY_2, EMAIL, waLink, waLink2 } from "@/lib/contact";

function waGeneralMessage() {
  return "Hi! I'm planning a trip to China and would like to know more about your local companion service.";
}

export default function Navbar() {
  const pathname = usePathname();
  const { t, locale } = useLang();

  const links = [
    { href: "/travel", label: t("nav.travel") },
    { href: "/companions", label: t("nav.companions") },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* 顶部联系信息栏 */}
      <div className="border-b border-white/5 bg-ink-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5 text-xs">
          <div className="hidden items-center gap-5 sm:flex">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gold-100/55 transition hover:text-gold-200"
            >
              <MessageCircle size={12} />
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
            <a
              href={waLink2()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gold-100/55 transition hover:text-gold-200"
            >
              <MessageCircle size={12} />
              <span>{WHATSAPP_DISPLAY_2}</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-1.5 text-gold-100/55 transition hover:text-gold-200"
            >
              <Mail size={12} />
              <span>{EMAIL}</span>
            </a>
          </div>
          {/* 移动端只显示 WhatsApp */}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gold-100/55 transition hover:text-gold-200 sm:hidden"
          >
            <Phone size={12} />
            <span>{WHATSAPP_DISPLAY}</span>
          </a>
          <a
            href={waLink(waGeneralMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold-grad px-3 py-1 text-[11px] font-semibold text-ink-900 shadow-glow transition hover:scale-105"
          >
            {locale === "zh" ? "立即预约" : "Book Now"}
          </a>
        </div>
      </div>

      {/* 主导航 */}
      <nav className="border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad font-serif text-lg font-bold text-ink-900 shadow-glow">
              X
            </span>
            <span className="font-serif text-xl font-bold tracking-wide text-gold-100">
              Ximi
              {locale === "zh" && <span className="ml-1 text-gold-300">私人定制游</span>}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-gold-400/15 text-gold-200"
                      : "text-gold-100/70 hover:text-gold-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* 移动端底部导航 */}
      <nav className="flex items-center gap-1 overflow-x-auto px-5 pb-2 md:hidden bg-ink-900/70">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-gold-100/70"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
