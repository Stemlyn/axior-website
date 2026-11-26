"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { SiteProvider } from "@/lib/store";

/** Client-side state shared by every page: currency, property type, area. Lives in the root layout so it survives navigation. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteProvider>
  );
}
