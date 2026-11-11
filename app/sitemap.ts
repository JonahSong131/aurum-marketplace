import type { MetadataRoute } from "next";
import { JOBS } from "@/lib/jobs";

// 站点定位：全球线上工作招聘服务。
// 旧的旅行/地陪/商品/博客页面不再进 sitemap（页面文件保留但不对外推广）。
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xmstores.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "hourly", priority: 1.0 },
  ];

  // 每个岗位一个页面：岗位标题是真实搜索词，吃长尾流量
  const jobPages: MetadataRoute.Sitemap = JOBS.map((j) => ({
    url: `${baseUrl}/jobs/${j.id}/`,
    changeFrequency: "daily" as const,
    priority: 0.8,
    lastModified: new Date(j.published),
  }));

  return [...staticPages, ...jobPages];
}
