"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Check, Briefcase } from "lucide-react";
import { useState } from "react";
import { WECHAT_ID } from "@/lib/jobs";

function WeChatBadge() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
    } catch {
      /* 忽略：手动选中也行 */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-gold-100/55 transition hover:text-gold-200"
      title="点击复制微信号"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span>微信: {WECHAT_ID}</span>
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "岗位大厅" },
    { href: "/#how", label: "申请流程" },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* 顶部联系信息栏 */}
      <div className="border-b border-white/5 bg-ink-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-5 text-xs">
          <div className="hidden items-center gap-5 sm:flex">
            <WeChatBadge />
            <span className="text-gold-100/35">工作日 9:00 - 22:00 在线</span>
          </div>
          {/* 移动端只显示微信 */}
          <div className="sm:hidden">
            <WeChatBadge />
          </div>
          <a
            href="/#jobs"
            className="flex items-center gap-1.5 rounded-full bg-gold-grad px-3 py-1 text-[11px] font-semibold text-ink-900 shadow-glow transition hover:scale-105"
          >
            <Briefcase size={11} />
            看岗位
          </a>
        </div>
      </div>

      {/* 主导航 */}
      <nav className="border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad font-serif text-lg font-bold text-ink-900 shadow-glow">
              锦
            </span>
            <span className="font-serif text-xl font-bold tracking-wide text-gold-100">
              锦市
              <span className="ml-1 text-sm text-gold-300">Jobs</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-gold-400/15 text-gold-200"
                      : "text-gold-100/70 hover:text-gold-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <WeChatBadge />
          </div>
        </div>
      </nav>

      {/* 移动端第二行导航 */}
      <nav className="flex items-center gap-1 overflow-x-auto bg-ink-900/70 px-5 pb-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-gold-100/70"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
