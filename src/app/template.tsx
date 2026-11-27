"use client";

import { useEffect, type ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

// True until the first page has mounted. The first page (server HTML, hard reload) must never start
// hidden, so only later client-side navigations get the entrance below.
let firstLoad = true;

/** Short fade-up between pages (≤ 300 ms, no exit animation, so the next page is never held back). */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const animateIn = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: reduce ? 0 : 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
