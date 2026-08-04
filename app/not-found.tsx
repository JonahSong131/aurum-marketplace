"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <p className="font-serif text-6xl font-bold gold-text">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-gold-100">
        {t("notfound.title")}
      </h1>
      <p className="mt-2 text-sm text-gold-100/55">{t("notfound.desc")}</p>
      <Link href="/" className="btn-gold mt-6">
        {t("notfound.btn")}
      </Link>
    </div>
  );
}
