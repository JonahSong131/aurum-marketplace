// ============================================================
// 岗位数据 —— 由数据同步流程生成 data/jobs.json
// 自动任务定时刷新 → 提交 → Vercel 自动重新部署。
// 公开展示数据只保留岗位本身信息，申请统一由顾问通道受理。
// ============================================================

import jobsData from "../data/jobs.json";

export interface Job {
  id: string;
  title: string;
  desc: string;
  cat: string;
  source: string;
  published: string;
  salary: string;
  remote: boolean;
  web3: boolean;
}

export interface JobsFile {
  updated: string;
  count: number;
  jobs: Job[];
}

export const JOBS: Job[] = (jobsData as JobsFile).jobs ?? [];

export const JOBS_UPDATED: string = (jobsData as JobsFile).updated ?? "";

// 顾问微信 —— 全站统一的申请入口，改号只改这里
export const WECHAT_ID = "SiwSong-CD";
export const WECHAT_NOTE = "加微信时请备注「岗位编号」，例如 J3f8a2c1，方便快速定位";

export const CATEGORIES: { key: string; label: string; desc: string }[] = [
  { key: "tech", label: "开发 / 技术", desc: "程序员、前后端、运维、AI 工程类岗位" },
  { key: "web3", label: "币圈 / Web3", desc: "交易所、链上项目、量化与风控岗位" },
  { key: "support", label: "客服 / 助理", desc: "在线客服、虚拟助理、社区管理" },
  { key: "design", label: "设计 / 视频", desc: "平面设计、视频剪辑、UI/UX 类活儿" },
  { key: "marketing", label: "运营 / 营销", desc: "社媒运营、投放、增长、带货类" },
  { key: "writing", label: "写作 / 翻译", desc: "文案、翻译、字幕、润色类" },
  { key: "data", label: "数据 / 录入", desc: "数据录入、爬虫采集、调研类" },
  { key: "misc", label: "其他零活", desc: "测试、审核、杂项任务" },
];

export function catLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? "其他";
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then) return "";
  const diff = Date.now() - then;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "刚刚";
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}
