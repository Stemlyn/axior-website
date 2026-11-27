"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { SiteProvider } from "@/lib/store";

// Animation features arrive after first paint; `strict` makes any full `motion` import throw, so
// the heavy bundle can't sneak back into the first load.
const loadFeatures = () => import("./motion-features").then((r) => r.default);

/** Client-side state shared by every page: currency, property type, area. Lives in the root layout so it survives navigation. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteProvider>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </SiteProvider>
  );
}
