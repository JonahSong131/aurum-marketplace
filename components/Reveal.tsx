"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "down" | "left" | "right" | "none";

const offset: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: 56, y: 0 },
  right: { x: -56, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * 滚动驱动的入场揭示：淡入 + 位移 + 模糊消散。
 * 模仿 lusion 那种"滚动逐段浮现"的高级感。
 */
export default function Reveal({
  children,
  delay = 0,
  dir = "up",
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  dir?: Dir;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const o = offset[dir];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: o.x, y: o.y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
