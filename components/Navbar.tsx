"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { t, locale } = useLang();

  const links = [
    { href: "/travel", label: t("nav.travel") },
    { href: "/companions", label: t("nav.companions") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad font-serif text-lg font-bold text-ink-900 shadow-glow">
            A
          </span>
          <span className="font-serif text-xl font-bold tracking-wide text-gold-100">
            AURUM
            {locale === "zh" && <span className="ml-1 text-gold-300">锦市</span>}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto px-5 pb-2 md:hidden">
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
