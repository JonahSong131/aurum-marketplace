// 岗位详情页：每个岗位一页，吃 SEO 长尾流量（岗位标题就是搜索词）
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Home as HomeIcon, Coins, Wallet, Globe2, ShieldCheck } from "lucide-react";
import { JOBS, catLabel, timeAgo, WECHAT_ID } from "@/lib/jobs";
import WeChatCTA from "@/components/WeChatCTA";

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const job = JOBS.find((j) => j.id === params.id);
  if (!job) return { title: "岗位不存在 · 锦市 Jobs" };
  return {
    title: `${job.title} · 远程线上工作 · 锦市 Jobs`,
    description: `${job.desc.slice(0, 150) || job.title} —— ${catLabel(job.cat)}远程岗位，提交申请后由顾问一对一对接，全程不向求职者收费。`,
    keywords: [job.title, catLabel(job.cat), "远程工作", "线上工作"],
  };
}

export default function JobPage({ params }: { params: { id: string } }) {
  const job = JOBS.find((j) => j.id === params.id);
  if (!job) notFound();

  const related = JOBS.filter((j) => j.cat === job.cat && j.id !== job.id).slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-50/60 transition hover:text-gold-100">
        <ArrowLeft size={15} /> 返回岗位大厅
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-ink-50/60">
          <ShieldCheck size={10} className="text-gold-300" /> 已核验
        </span>
        <span className="text-ink-50/40">{timeAgo(job.published)}</span>
        <span className="rounded-full border border-gold-200/20 bg-gold-100/8 px-2.5 py-0.5 text-gold-200/90">
          {catLabel(job.cat)}
        </span>
        {job.remote && (
          <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
            <HomeIcon size={10} /> 远程
          </span>
        )}
        {job.web3 && (
          <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
            <Coins size={10} /> Web3
          </span>
        )}
        <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
          <Wallet size={10} /> {job.salary ? job.salary.slice(0, 30) : "薪资面议"}
        </span>
        <span className="ml-auto font-mono text-ink-50/30">#{job.id}</span>
      </div>

      <h1 className="font-serif text-2xl leading-snug text-ink-10 sm:text-4xl">{job.title}</h1>

      {job.desc && (
        <div className="glass mt-6 whitespace-pre-line rounded-2xl p-6 text-sm leading-7 text-ink-50/75">
          {job.desc}
        </div>
      )}

      {/* 申请 CTA */}
      <div className="mt-8 rounded-2xl border border-gold-200/25 bg-gold-100/5 p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-gold-100">申请这个岗位</div>
            <div className="mt-1 text-xs leading-5 text-ink-50/60">
              加顾问微信 <span className="font-mono text-gold-200">{WECHAT_ID}</span>，备注「岗位 {job.id}」，
              顾问核对在招状态后为你安排与雇主方对接。
            </div>
          </div>
          <WeChatCTA />
        </div>
        <div className="mt-4 flex items-start gap-1.5 text-[11px] leading-4 text-ink-50/40">
          <Globe2 size={12} className="mt-0.5 shrink-0 text-gold-300" />
          本机构为招聘服务方，全程不向求职者收取任何费用。
        </div>
      </div>

      {/* 相关岗位 */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl text-ink-10">同类岗位</h2>
          <div className="mt-4 grid gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/jobs/${r.id}`}
                className="glass group flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition hover:border-gold-200/35"
              >
                <span className="line-clamp-1 text-sm text-ink-10/85 transition group-hover:text-gold-100">
                  {r.title}
                </span>
                <span className="shrink-0 text-[11px] text-ink-50/35">{timeAgo(r.published)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
