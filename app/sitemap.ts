import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { companionCities } from "@/lib/companions";
import { JOBS } from "@/lib/jobs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xmstores.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${baseUrl}/travel/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/companions/`, changeFrequency: "weekly", priority: 0.6 },
    ...companionCities.map((c) => ({
      url: `${baseUrl}/companions/${c.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogSlugs = [
    "beijing-travel-guide",
    "shanghai-travel-guide",
    "chengdu-travel-guide",
    "xian-travel-guide",
    "hangzhou-travel-guide",
    "dali-travel-guide",
    "china-multi-city-itinerary",
    "guilin-travel-guide",
    "sanya-travel-guide",
    "zhangjiajie-travel-guide",
    "lijiang-travel-guide",
    "xiamen-travel-guide",
    "china-first-time-tips",
    "china-visa-guide",
    "best-time-visit-china",
    "chinese-breakfast-recipes",
    "hot-pot-at-home-guide",
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}.html`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 每个岗位一个页面：岗位标题是真实搜索词，吃长尾流量
  const jobPages: MetadataRoute.Sitemap = JOBS.map((j) => ({
    url: `${baseUrl}/jobs/${j.id}/`,
    changeFrequency: "daily" as const,
    priority: 0.8,
    lastModified: new Date(j.published),
  }));

  return [...staticPages, ...productPages, ...blogPages, ...jobPages];
}
