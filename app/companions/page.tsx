import type { Metadata } from "next";
import CompanionsIndex from "@/components/CompanionsIndex";

export const metadata: Metadata = {
  title: "Local Companions in China · AURUM",
  description:
    "Verified local companions and private-car day trips in Beijing, Shanghai, Chengdu, Xi'an, Hangzhou and Dali. Tell us what you like, we match you with a local friend. Book on WhatsApp.",
};

export default function CompanionsPage() {
  return <CompanionsIndex />;
}
