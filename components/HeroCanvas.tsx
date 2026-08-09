"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function HeroCanvas() {
  const { t } = useLang();

  // 文字层鼠标视差
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const titleX = useTransform(sx, (v) => v * 18);
  const titleY = useTransform(sy, (v) => v * 14);
  const subX = useTransform(sx, (v) => v * 30);
  const subY = useTransform(sy, (v) => v * 22);

  const onMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mx.set(x);
    my.set(y);
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-ink-900"
      onMouseMove={onMove}
    >
      {/* 中国风景动态背景（Ken Burns 缓慢缩放+位移） */}
      <div
        className="absolute inset-0 hero-scenery-bg"
        aria-hidden="true"
      />

      {/* 3D 画布（中央晶体 + 粒子 + 光环，叠加在风景之上） */}
      <Scene />

      {/* 电影级颗粒 + 暗角叠层 */}
      <div className="hero-grain" />
      <div className="hero-vignette" />

      {/* 文案叠层 */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div variants={item} className="pointer-events-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-ink-800/50 px-4 py-1.5 text-xs tracking-[0.2em] text-gold-200 backdrop-blur">
            <Sparkles size={14} className="text-gold-400" />
            {t("home.hero.badge")}
          </span>
        </motion.div>

        <motion.div variants={item} className="mt-6">
          <span className="gold-text font-serif text-2xl font-bold tracking-[0.35em] sm:text-3xl">
            Ximi
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          style={{ x: titleX, y: titleY }}
          className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight text-gold-100 sm:text-6xl md:text-7xl"
        >
          {t("home.hero.title")}
        </motion.h1>

        <motion.p
          variants={item}
          style={{ x: subX, y: subY }}
          className="mt-5 max-w-2xl font-serif text-lg text-gold-100/80 sm:text-2xl"
        >
          {t("home.hero.sub")}
        </motion.p>

        <motion.div
          variants={item}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/companions" className="btn-gold">
            {t("home.hero.cta")}
          </Link>
          <Link href="/travel" className="btn-ghost">
            {t("home.hero.browse")}
          </Link>
        </motion.div>
      </motion.div>

      {/* 向下滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-floaty text-gold-200/70">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
