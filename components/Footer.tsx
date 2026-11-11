"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { WECHAT_ID, CATEGORIES } from "@/lib/jobs";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-grad font-serif text-lg font-bold text-ink-900">
                锦
              </span>
              <span className="font-serif text-xl font-bold text-gold-100">
                锦市<span className="ml-1 text-sm text-gold-300">Jobs</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gold-100/50">
              全球线上工作岗位，每天上新。提交申请后由顾问一对一对接，全程不向求职者收取任何费用。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">岗位分类</h4>
            <ul className="mt-3 space-y-2 text-sm text-gold-100/55">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.key}>
                  <Link href="/" className="hover:text-gold-100">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">快速入口</h4>
            <ul className="mt-3 space-y-2 text-sm text-gold-100/55">
              <li>
                <Link href="/#jobs" className="hover:text-gold-100">
                  全部岗位
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-gold-100">
                  申请流程
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold-200">联系顾问</h4>
            <ul className="mt-3 space-y-2 text-sm text-gold-100/55">
              <li className="flex items-center gap-2">
                <MessageSquare size={13} className="text-gold-300" />
                微信：<span className="font-mono text-gold-200">{WECHAT_ID}</span>
              </li>
              <li className="text-xs text-gold-100/40">工作日 9:00 - 22:00 在线</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-gold-100/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} 锦市 Jobs · 全球远程招聘服务</span>
          <span>全程不向求职者收费，遇到任何收费请立即举报。</span>
        </div>
      </div>
    </footer>
  );
}
