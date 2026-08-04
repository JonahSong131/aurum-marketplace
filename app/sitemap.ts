import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { companionCities } from "@/lib/companions";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xmstores.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/travel/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/companions/`, changeFrequency: "weekly", priority: 0.9 },
    ...companionCities.map((c) => ({
      url: `${baseUrl}/companions/${c.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
