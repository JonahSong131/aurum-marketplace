import type { Metadata } from "next";
import Link from "next/link";
import { JOBS, JOBS_UPDATED, catLabel, WECHAT_ID } from "@/lib/jobs";

// 面向中国求职者的免费引流落地页 —— 域名归属主站 xmstores.com/remote-jobs/
// 岗位数据直接读主站 jobs.json（每 3 小时自动更新），不再依赖第三方抓取脚本。
// 所有按钮/岗位链接都指向主站本身，微信仍是唯一对外联系出口。

export const metadata: Metadata = {
  metadataBase: new URL("https://xmstores.com"),
  title: "全球远程工作资源站 · 今日真实岗位与免费求职指南 | 锦市 Jobs",
  description:
    "免费全球远程工作资源站：今日真实在招岗位、新手入门指南、防骗清单与申请步骤。岗位由锦市 Jobs 每天人工核验，不向求职者收费。",
  keywords: [
    "远程工作",
    "全球线上工作",
    "remote jobs",
    "work from home",
    "海外兼职",
    "跨境远程招聘",
    "无经验远程岗位",
  ],
  alternates: { canonical: "/remote-jobs/" },
  openGraph: {
    type: "website",
    siteName: "锦市 Jobs",
    title: "全球远程工作资源站 · 锦市 Jobs",
    description: "今日真实在招岗位、新手入门指南、防骗清单，免费开放。",
    url: "https://xmstores.com/remote-jobs/",
    locale: "zh_CN",
  },
  robots: { index: true, follow: true },
};

const BLOCK_WORDS = (
  "Reddit 评论,每条 Reddit,刷评论,刷量,点赞,刷单,成人,18+,adult,NSFW,裸"
).split(",");

function isBlocked(title: string): boolean {
  const low = title.toLowerCase();
  return BLOCK_WORDS.some((w) => w && low.includes(w.toLowerCase()));
}

const FAQS = [
  {
    q: "找全球远程工作需要付费吗？",
    a: "不需要。锦市 Jobs 全程不向求职者收费；任何要求先交押金、培训费或工牌费的岗位都是骗局。",
  },
  {
    q: "没有经验能申请海外远程岗位吗？",
    a: "能。在线客服、虚拟助理、内容审核与数据标注主要看沟通能力与可靠性，不卡学历和经验。",
  },
  {
    q: "英语不好能做跨境远程工作吗？",
    a: "多数全球岗位只要求书面英语过关；还有一部分岗位专门招中文母语者，例如中文客服与本地化运营。",
  },
  {
    q: "岗位信息多久更新一次？",
    a: "主站 xmstores.com 每天上新人工核验的岗位，首页按发布时间倒序排列，建议当天申请。",
  },
];

export default function RemoteJobsPage() {
  const sample = JOBS.filter(
    (j) =>
      !j.title?.includes("[已删除]") &&
      !j.desc?.includes("[已删除]") &&
      j.title &&
      !isBlocked(j.title)
  ).slice(0, 10);

  const updatedLabel = JOBS_UPDATED
    ? new Date(JOBS_UPDATED).toLocaleDateString("zh-CN")
    : "";

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "全球远程工作资源站 · 锦市 Jobs",
    url: "https://xmstores.com/remote-jobs/",
    description: "免费全球远程工作资源站：每日核验岗位、新手指南、防骗清单",
    publisher: { "@type": "Organization", name: "锦市 Jobs", url: "https://xmstores.com" },
    inLanguage: "zh-CN",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-radial-lux" />
        <div className="relative mx-auto max-w-4xl px-5">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-200/70">
            Global Remote Jobs · 免费开放
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            全球<span className="gold-text">远程工作</span>资源站
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-50/75 sm:text-base">
            今日真实在招岗位、新手入门指南、防骗清单，全部免费。跨境找远程工作，难点从来不是能力，是{" "}
            <strong className="text-gold-100">信息</strong>
            ——大平台上多数岗位只招本地居民，帖子早招满，还混着让你先交钱的骗局。这里只留有用的部分。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/#jobs" className="btn-gold">
              看今天新上的全球远程岗位 →
            </Link>
            <span className="text-xs text-ink-50/55">
              微信号 <span className="font-mono text-gold-200">{WECHAT_ID}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 今日岗位样例 */}
      <section className="mx-auto max-w-4xl px-5 pb-4">
        <h2 className="font-serif text-2xl text-gold-100 sm:text-3xl">
          今日岗位样例
          {updatedLabel && (
            <span className="ml-3 align-middle text-xs font-normal text-ink-50/50">
              {updatedLabel} 更新 · 以主站实时状态为准
            </span>
          )}
        </h2>
        <div className="mt-5 space-y-2">
          {sample.map((j) => (
            <Link
              key={j.id}
              href={`/jobs/${j.id}/`}
              className="glass flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-3 transition hover:border-gold-200/50"
            >
              <span className="min-w-[220px] flex-1 text-sm font-medium text-ink-10 hover:text-gold-200">
                {j.title.length > 56 ? j.title.slice(0, 54) + "…" : j.title}
              </span>
              <span className="rounded-full bg-gold-100/10 px-3 py-1 text-xs text-gold-200/90">
                {catLabel(j.cat)}
              </span>
              <span className="text-xs text-ink-50/60">{j.salary || "薪资面议"}</span>
            </Link>
          ))}
        </div>
        <p className="note mt-4 text-xs text-ink-50/45">
          岗位会随时招满，以上仅为示例。完整且最新的列表请到{" "}
          <Link href="/#jobs" className="text-gold-300 hover:underline">
            主站实时岗位
          </Link>{" "}
          查看。
        </p>
      </section>

      {/* 免费求职指南 */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        <h2 className="font-serif text-2xl text-gold-100 sm:text-3xl">免费求职指南</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link href="/blog/global-remote-work-guide.html" className="card block p-5">
            <h3 className="font-semibold text-gold-100">全球远程工作怎么找（中文）</h3>
            <p className="mt-2 text-sm text-ink-50/65">
              跨境远程求职入门：新手最容易上岗的岗位、地区限制怎么看、申请信怎么写、时差怎么处理。
            </p>
          </Link>
          <Link href="/blog/remote-jobs-no-experience.html" className="card block p-5">
            <h3 className="font-semibold text-gold-100">无经验也能拿到的远程工作（EN）</h3>
            <p className="mt-2 text-sm text-ink-50/65">
              入门岗位类型、真实渠道、防骗清单、5 步申请法。英文，约 7 分钟读完。
            </p>
          </Link>
        </div>
      </section>

      {/* 防骗清单 */}
      <section className="mx-auto max-w-4xl px-5 pb-6">
        <h2 className="font-serif text-2xl text-gold-100 sm:text-3xl">防骗清单</h2>
        <ul className="mt-5 grid gap-3 text-sm text-ink-50/75 sm:grid-cols-2">
          <li className="card px-4 py-3">不向求职者收任何费用，先交押金/培训费/工牌费的都是骗局。</li>
          <li className="card px-4 py-3">看岗位是否写明地区限制——只招本地居民的别白投。</li>
          <li className="card px-4 py-3">警惕"轻松高薪、日结上千"，超出市场价的通常是引流或刷单。</li>
          <li className="card px-4 py-3">提交申请后由顾问一对一对接，全程只走微信 {WECHAT_ID}。</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        <h2 className="font-serif text-2xl text-gold-100 sm:text-3xl">常见问题</h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="card p-5">
              <h3 className="font-semibold text-gold-100">{f.q}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-50/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="glass rounded-2xl p-8 text-center sm:p-12">
          <h2 className="font-serif text-2xl text-gold-100 sm:text-3xl">从今天的岗位开始</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-50/70">
            不用注册、不用写英文求职信。看中哪个岗位，提交申请后顾问一对一对接，全程不向求职者收费。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/#jobs" className="btn-gold">
              浏览今日岗位 →
            </Link>
            <Link href="/" className="btn-ghost">
              前往 锦市 Jobs 首页
            </Link>
          </div>
          <p className="mt-5 text-xs text-ink-50/45">
            加微信 <span className="font-mono text-gold-200">{WECHAT_ID}</span> 时请备注「岗位编号」，方便快速定位
          </p>
        </div>
      </section>
    </main>
  );
}
