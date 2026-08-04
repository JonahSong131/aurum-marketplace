// 全局类型定义 —— AURUM · 锦市
import type { Localized } from "./i18n";

export type Category = "travel";

export interface Deliverable {
  // text: 购买后直接展示内文；download: 购买后生成文件可下载
  type: "text" | "download";
  // 购买后展示的示例内容（节选）
  content?: string;
  // 可下载文件名
  fileName?: string;
  // 生成下载文件的纯文本 / markdown 内容
  fileContent?: string;
}

export interface Product {
  id: string;
  slug: string;
  // 付款链接（Lemon Squeezy 等）：点击「购买」直接跳转过去付款（无需本站收款）
  title: Localized;
  subtitle: Localized;
  category: Category;
  section: Localized; // 板块内分组，如「北京」「川菜」
  priceUSD: number;
  cover: { from: string; to: string; icon: string };
  // 高清封面图（放到 public/images/products/<slug>.png），有则优先用图片，渐变作兜底
  image?: string;
  summary: Localized;
  description: Localized;
  preview: Localized[]; // 购买前可见的亮点列表
  deliverable: Deliverable;
  pages: number;
  format: string;
  language: string;
  tags: string[];
  featured?: boolean;
  new?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "demo";
}

export interface Purchase {
  productId: string;
  orderId: string;
  purchasedAt: string; // ISO 时间
  amountUSD: number;
  method: "card" | "googlepay";
}

export interface CartItem {
  productId: string;
  qty: number;
}
