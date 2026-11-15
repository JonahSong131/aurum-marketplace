import type { MetadataRoute } from "next";
import { JOBS } from "@/lib/jobs";

// 站点定位：全球线上工作招聘服务。
// 旧的旅行/地陪/商品/博客页面不再进 sitemap（页面文件保留但不对外推广）。
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xmstores.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "hourly", priority: 1.0 },
    // 求职指南：吃「远程工作怎么找」这类长尾搜索词，同时给首页导内链
    { url: `${baseUrl}/blog/global-remote-work-guide.html`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog/remote-jobs-no-experience.html`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // 已删除 / 已下架的岗位不要留在 sitemap 里，避免搜索引擎抓到空页拉低整站质量
  const liveJobs = JOBS.filter(
    (j) => !j.desc?.includes("[已删除]") && !j.title?.includes("[已删除]")
  );

  // 每个岗位一个页面：岗位标题是真实搜索词，吃长尾流量
  const jobPages: MetadataRoute.Sitemap = liveJobs.map((j) => ({
    url: `${baseUrl}/jobs/${j.id}/`,
    changeFrequency: "daily" as const,
    priority: 0.8,
    lastModified: new Date(j.published),
  }));

  return [...staticPages, ...jobPages];
}
