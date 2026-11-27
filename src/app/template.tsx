"use client";

import { useEffect, type ReactNode } from "react";

// True until the first page has mounted. The first page (server HTML, hard reload) must never start
// hidden, so only later client-side navigations get the entrance below.
let firstLoad = true;

/**
 * Short fade-up between pages (CSS `page-enter` in globals.css, 0.28 s, no exit animation). Plain
 * CSS so a slow or failed motion-code download can never leave a page blank.
 */
export default function Template({ children }: { children: ReactNode }) {
  const animateIn = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  return <div className={animateIn ? "page-enter" : undefined}>{children}</div>;
}
