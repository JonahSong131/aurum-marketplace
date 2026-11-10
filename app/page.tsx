"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Globe2,
  RefreshCw,
  Search,
  Copy,
  Check,
  Wallet,
  Coins,
  Home as HomeIcon,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { JOBS, JOBS_UPDATED, CATEGORIES, catLabel, timeAgo, WECHAT_ID, WECHAT_NOTE } from "@/lib/jobs";

const PAGE_SIZE = 48;

function CopyWeChat({ jobId, big = false }: { jobId?: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = WECHAT_ID;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <button
      onClick={copy}
      className={
        big
          ? "btn-gold px-9 py-4 text-base"
          : "inline-flex items-center gap-2 rounded-full border border-gold-200/25 bg-gold-100/10 px-4 py-2 text-xs font-medium text-gold-100 transition hover:border-gold-200/50 hover:bg-gold-100/20"
      }
    >
      {copied ? <Check size={big ? 18 : 14} /> : <Copy size={big ? 18 : 14} />}
      {copied ? "已复制微信号，去微信添加我" : big ? `申请岗位 · 加微信 ${WECHAT_ID}` : `加微信 ${WECHAT_ID}`}
    </button>
  );
}

export default function HomePage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return JOBS.filter((j) => {
      if (cat !== "all" && j.cat !== cat) return false;
      if (kw && !(j.title + " " + j.desc).toLowerCase().includes(kw)) return false;
      return true;
    });
  }, [cat, q]);

  const shown = filtered.slice(0, limit);
  const fresh24 = JOBS.filter(
    (j) => Date.now() - new Date(j.published).getTime() < 86400000
  ).length;

  const catCount = (key: string) => JOBS.filter((j) => j.cat === key).length;

  return (
    <main className="min-h-screen">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden pt-20 pb-14 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(221,199,140,0.12),transparent)]" />
        <div className="mx-auto max-w-7xl px-5">
          <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold-200/70">
            <Globe2 size={14} /> Global Remote Jobs · 自动更新
          </p>
          <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
            全球<span className="gold-text">线上工作</span>，每天自动上新
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-50/70 sm:text-base">
            我们持续从 Reddit、Telegram、Freelancer 等海外平台自动抓取真实在招的远程岗位，
            人工过滤后发布。看中哪个岗位，加微信即可对接 —— 不用投简历、不用英文求职信。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CopyWeChat big />
            <div className="text-xs leading-5 text-ink-50/50">
              微信号 <span className="font-mono text-gold-200">{WECHAT_ID}</span>
              <br />
              {WECHAT_NOTE}
            </div>
          </div>

          {/* 数据条 */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Briefcase, num: String(JOBS.length), label: "在招岗位" },
              { icon: TrendingUp, num: String(fresh24), label: "近 24 小时新增" },
              { icon: Globe2, num: "8+", label: "海外信息源" },
              { icon: RefreshCw, num: "3h", label: "自动更新频率" },
            ].map(({ icon: Icon, num, label }) => (
              <div key={label} className="glass rounded-2xl p-4">
                <Icon size={18} className="mb-2 text-gold-300" />
                <div className="font-serif text-2xl text-gold-100">{mounted ? num : "—"}</div>
                <div className="mt-0.5 text-xs text-ink-50/55">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 筛选 ================= */}
      <section className="sticky top-[133px] z-30 border-y border-white/5 bg-ink-900/80 backdrop-blur-md md:top-[100px]">
        <div className="mx-auto max-w-7xl px-5 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => { setCat("all"); setLimit(PAGE_SIZE); }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  cat === "all"
                    ? "bg-gradient-to-r from-gold-300 to-gold-500 text-ink-900"
                    : "border border-white/10 text-ink-50/60 hover:border-gold-200/30 hover:text-gold-100"
                }`}
              >
                全部 {JOBS.length}
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => { setCat(c.key); setLimit(PAGE_SIZE); }}
                  title={c.desc}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    cat === c.key
                      ? "bg-gradient-to-r from-gold-300 to-gold-500 text-ink-900"
                      : "border border-white/10 text-ink-50/60 hover:border-gold-200/30 hover:text-gold-100"
                  }`}
                >
                  {c.label} {catCount(c.key)}
                </button>
              ))}
            </div>
            <div className="relative shrink-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-50/40" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setLimit(PAGE_SIZE); }}
                placeholder="搜岗位关键词，如 translation / 客服 / video…"
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-xs text-ink-50 placeholder:text-ink-50/35 focus:border-gold-200/40 focus:outline-none lg:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 岗位列表 ================= */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex items-center justify-between text-xs text-ink-50/45">
          <span>
            {filtered.length} 个岗位
            {cat !== "all" && ` · ${catLabel(cat)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <RefreshCw size={12} />
            数据更新于 {timeAgo(JOBS_UPDATED)}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((j) => (
            <article key={j.id} className="glass group flex flex-col rounded-2xl p-5 transition hover:border-gold-200/35">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-ink-50/60">{j.source}</span>
                <span className="text-ink-50/40">{timeAgo(j.published)}</span>
                <span className="ml-auto font-mono text-ink-50/30">#{j.id}</span>
              </div>

              <h2 className="font-serif text-lg leading-snug text-ink-10 transition group-hover:text-gold-100">
                <Link href={`/jobs/${j.id}`}>{j.title}</Link>
              </h2>

              {j.desc && (
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-ink-50/55">{j.desc}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-full border border-gold-200/20 bg-gold-100/8 px-2.5 py-0.5 text-gold-200/90">
                  {catLabel(j.cat)}
                </span>
                {j.remote && (
                  <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
                    <HomeIcon size={10} /> 远程
                  </span>
                )}
                {j.web3 && (
                  <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
                    <Coins size={10} /> Web3
                  </span>
                )}
                {j.salary && (
                  <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-ink-50/60">
                    <Wallet size={10} /> {j.salary.slice(0, 26)}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                <span className="text-[11px] leading-4 text-ink-50/40">
                  联系方式已隐藏
                  <br />
                  加微信对接此岗位
                </span>
                <CopyWeChat jobId={j.id} />
              </div>
            </article>
          ))}
        </div>

        {limit < filtered.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setLimit(limit + PAGE_SIZE)}
              className="btn-gold px-8 py-3 text-sm"
            >
              加载更多（还有 {filtered.length - limit} 个）
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-sm text-ink-50/55">
            没有匹配的岗位，换个关键词试试。数据每 3 小时自动更新。
          </div>
        )}
      </section>

      {/* ================= 怎么对接 ================= */}
      <section className="border-t border-white/5 bg-ink-950/40">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <h2 className="font-serif text-2xl text-ink-10 sm:text-3xl">
            看中岗位，<span className="gold-text">三步对接</span>
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "复制微信号", desc: `点击任意岗位上的按钮，微信号 ${WECHAT_ID} 自动复制。` },
              { n: "02", title: "加微信备注岗位编号", desc: "备注格式：岗位 #编号（卡片右上角）。我们会先核对岗位在招状态。" },
              { n: "03", title: "直接对接雇主方", desc: "我们提供该岗位的对接人与说明，不用投简历、不用注册平台账号。" },
            ].map((s) => (
              <div key={s.n} className="glass rounded-2xl p-6">
                <div className="font-serif text-3xl text-gold-300/70">{s.n}</div>
                <div className="mt-2 text-sm font-semibold text-ink-10">{s.title}</div>
                <div className="mt-1.5 text-xs leading-5 text-ink-50/55">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-ink-50/45">
            <ShieldCheck size={14} className="text-gold-300" />
            所有岗位均来自公开平台的在招信息，已自动过滤广告与不实帖。
          </div>
        </div>
      </section>

      {/* 手机底部常驻 CTA */}
      <div className="sticky bottom-0 z-30 border-t border-gold-200/15 bg-ink-900/90 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <div className="text-xs leading-4 text-ink-50/60">
            微信号
            <span className="ml-1 font-mono text-sm text-gold-200">{WECHAT_ID}</span>
          </div>
          <CopyWeChat />
        </div>
      </div>
    </main>
  );
}
