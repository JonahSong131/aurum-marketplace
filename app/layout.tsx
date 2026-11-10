import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "锦市 Jobs · 全球线上工作，每天自动上新",
  description:
    "从 Reddit、Telegram、Freelancer 等海外平台自动抓取的真实远程岗位：开发、设计、客服、运营、币圈、写作翻译、数据录入。看中岗位加微信即可对接，不用投简历。每 3 小时自动更新。",
  keywords: [
    "远程工作",
    "线上工作",
    "海外工作",
    "remote jobs",
    "online jobs",
    "work from home",
    "兼职",
    "跨境工作",
    "锦市 Jobs",
  ],
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-900 text-gold-100 antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
