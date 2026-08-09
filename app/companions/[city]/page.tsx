import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { companionCities, getCompanionCity } from "@/lib/companions";
import CityCompanions from "@/components/CityCompanions";
import { DEFAULT_LOCALE, loc } from "@/lib/i18n";

export function generateStaticParams() {
  return companionCities.map((c) => ({ city: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { city: string };
}): Metadata {
  const c = getCompanionCity(params.city);
  if (!c) return { title: "Ximi" };
  const name = loc(c.name, DEFAULT_LOCALE);
  return {
    title: `Local Companions in ${name} · Ximi`,
    description: `${loc(c.tagline, DEFAULT_LOCALE)} — verified local companions and private-car day trips in ${name}. Book directly on WhatsApp.`,
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCompanionCity(params.city);
  if (!city) notFound();
  return <CityCompanions city={city} />;
}
