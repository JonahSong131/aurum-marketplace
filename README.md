# AURUM · 锦市 — 全球数字产品 SaaS 市场

一个面向全球的数字产品交易市场前端：中国旅行指南、私房食谱等数字好物，支持
**Lemon Squeezy 一键跳转付款**、**8 国语言切换**、**即买即收**，首页为 Three.js 打造的 3D 华丽背景。
技术栈：Next.js 14（App Router）+ TypeScript + Tailwind CSS + React Three Fiber + Zustand。

> **收款方式：Lemon Squeezy（无需国外银行卡）**
> 网站本身不收钱——访客点击「购买」会直接跳到你自己的 Lemon Squeezy 商品页付款；
> Lemon Squeezy 负责收款、发货（把文件发到买家邮箱），并把钱打到你绑定的 **PayPal**。
> 所以你不需要 Stripe、不需要国外银行卡，也不需要自己写支付后端。

---

## 1. 本地运行

```bash
npm install
npm run dev      # http://localhost:3000
```

构建产物（静态导出）：`npm run build` → 生成 `out/` 纯静态文件，可直接托管任意静态服务器。

---

## 2. 把商品接到你的 Lemon Squeezy（最重要的一步）

1. 注册 [Lemon Squeezy](https://lemonsqueezy.com)（免费）。
2. 在 Lemon Squeezy 后台逐个**新建产品**，上传你的数字文件（PDF / 文档 / 压缩包等），
   设好价格，发布后会得到一个商品链接，形如：
   `https://lemonsqueezy.com/l/xxxxxxxx` 或 `https://你的用户名.lemonsqueezy.com/l/xxxxxxxx`
3. 打开本仓库的 `lib/products.ts`，把每个商品的
   `payUrl: "https://lemonsqueezy.com/l/REPLACE_WITH_YOUR_PAY_LINK"` 换成你真实的 Lemon Squeezy 链接。
   （共 12 个商品，搜索 `REPLACE_WITH_YOUR_PAY_LINK` 即可全部定位。）
4. 链接没换完也没关系——点击会先跳到 Lemon Squeezy 首页，不会打开死链。

> 想收款到 PayPal？在 Lemon Squeezy 后台 **Settings → Payouts** 里绑定你的 PayPal 账号，
> 卖出后 Lemon Squeezy 会按周/月把款项打到你的 PayPal。（Lemon Squeezy 目前对个人创作者主要支持
> PayPal 与境外银行电汇，具体以 Lemon Squeezy 后台为准。）

### 关于「我的图书馆 / 登录」
本站把**买家付款与收货都交给了 Lemon Squeezy**：买家在 Lemon Squeezy 付完钱，文件由 Lemon Squeezy 直接发到
买家邮箱，无需在本站注册。因此「登录 / 我的图书馆」现在是**可选功能**（前端模拟，数据存浏览器），
不影响收款。若以后想在本站也做「已购即解锁」，需要后端 + 数据库 + Lemon Squeezy Webhook 校验
（进阶，见第 4 节）。

---

## 3. 部署到 Vercel（全球上线，零后端）

> 本站是纯静态站，Vercel 上零配置即可部署。

1. 把本仓库推到 GitHub（见下方「初始化 Git」）。
2. 打开 [vercel.com](https://vercel.com) → **Add New → Project** → 导入该 GitHub 仓库。
3. Framework 选 **Next.js**（自动识别），直接点 **Deploy**。
   - 构建命令：`npm run build`（已写入 `vercel.json`）
   - 因为是静态导出（`output: "export"`），Vercel 会直接托管 `out/`。
4. 部署完成后会得到一个 `*.vercel.app` 地址，全球 HTTPS 可访问。
5. （可选）在 **Settings → Domains** 绑定你的自定义域名，如 `your-shop.com`。
6. 上线前别忘了先把 `lib/products.ts` 里的 Lemon Squeezy 链接换成你真实的链接，然后重新部署。

### 初始化 Git（首次）
```bash
git init
git add -A
git commit -m "AURUM storefront with Lemon Squeezy checkout"
# 然后在 GitHub 新建一个空仓库，把下面两行里的 URL 换成你自己的
git remote add origin https://github.com/你的用户名/你的仓库.git
git branch -M main
git push -u origin main
```
之后每次改完商品链接，执行 `git add -A && git commit -m "更新商品" && git push`，
Vercel 会自动重新部署。

---

## 4. 进阶（可选，正式规模化再做）

- **站内已购解锁 / 真实账户**：用 Lemon Squeezy 的 `Webhook`（付款成功回调）在服务端标记订单，
  把 `lib/store.ts` 的 `user` / `purchases` 接到数据库（Postgres / Supabase / Vercel Postgres），
  填入 `DATABASE_URL`。
- **真实 Google 登录**：在 `components/AuthModal.tsx` 的 `handleGoogle()` 处接入
  NextAuth / Google Identity（搜索 `TODO(接入真实 Google OAuth)`），填入
  `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`。
- 以上都需要把 `next.config.mjs` 的 `output: "export"` 去掉、改用 Vercel 的 Serverless
  Function（动态站点）。当前演示版用静态导出，最简单、最稳。

---

## 5. 目录结构

```
app/
  layout.tsx            根布局（字体 / 导航 / 页脚 / 全局弹层）
  page.tsx              首页（3D Hero + 目录 + 卖点 + 流程）
  travel/page.tsx       中国旅行指南（按城市分组）
  recipes/page.tsx      食谱（按菜系分组）
  product/[slug]/       产品详情（购买按钮 → Lemon Squeezy）
  checkout/             结算（每个商品一个「在 Lemon Squeezy 付款」按钮）+ 成功页
  library/              我的图书馆（可选 / 进阶）
components/             3D 场景 / 导航 / 购物车 / 登录 / 产品卡 / 详情 等
lib/
  types.ts              类型定义（含 payUrl）
  products.ts           数字产品数据 + 每个商品的 Lemon Squeezy 链接（改这里接 Lemon Squeezy）
  i18n.ts               8 国语言字典（en/zh/es/fr/ar/pt/ru/de）
  store.ts              全局状态（购物车 / 用户 / 持久化）
```

---

## 6. 如何新增产品 / 板块

- **新增产品**：在 `lib/products.ts` 的 `products` 数组追加一项（含 `category`、`section`、
  价格、封面渐变、`payUrl` 指向你的 Lemon Squeezy 商品）。前端会自动渲染到目录、板块页与详情页。
- **新增板块**：在 `categories` 数组追加，并把产品的 `category` 指向它；仿照
  `app/travel/page.tsx` 新建一个 `app/<板块>/page.tsx` 即可。

---

© AURUM 锦市 · 用 Next.js + Three.js 构建 · 收款由 Lemon Squeezy 提供
