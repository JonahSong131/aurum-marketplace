import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import { loc, DEFAULT_LOCALE } from "@/lib/i18n";

// 静态导出：在构建期预渲染全部商品页（沙盒里也无需运行时 SWC worker）
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProductBySlug(params.slug);
  return { title: p ? `${loc(p.title, DEFAULT_LOCALE)} · AURUM` : "AURUM" };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
