"use client";

import { type RefObject } from "react";
import { useReducedMotion, useScroll, useTransform, type MotionValue, type Transition, type Variants } from "framer-motion";

/*
 * One motion vocabulary for the whole site. Components import these instead of inventing their own
 * timings, so everything moves with the same character: quick, soft, never in the way.
 * Animate transform, opacity and clip-path only (compositor-friendly).
 */

export const DUR = { fast: 0.2, base: 0.45, slow: 0.7 } as const;

/** Entrances: fast start, long gentle settle. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Interactive feedback (hover, press, selection): critically damped, no overshoot. */
export const SPRING: Transition = { type: "spring", stiffness: 260, damping: 30 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: SPRING },
};

/** Photos uncover from the bottom edge, like a print being pulled from a sleeve. */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(18% 0% 0% 0%)", opacity: 0.6 },
  show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: DUR.slow, ease: EASE_OUT } },
};

/** Parent variant that reveals its children one after another. */
export function stagger(step = 0.07, delay = 0): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } };
}

/** Vertical drift for parallax as `ref` crosses the viewport. Static under reduced motion. */
export function useScrollDepth(ref: RefObject<HTMLElement | null>, range: [string, string] = ["-6%", "6%"]): MotionValue<string> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : range);
}
