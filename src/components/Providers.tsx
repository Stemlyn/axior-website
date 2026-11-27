"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { SiteProvider } from "@/lib/store";

const FALLBACK_AFTER_MS = 4000;
let featuresLoaded = false;

/** Unhide anything still waiting for a scroll reveal (see `.motion-fallback` in globals.css). */
function showEverything() {
  if (typeof document !== "undefined") document.documentElement.classList.add("motion-fallback");
}

// Animation features arrive after first paint; `strict` makes any full `motion` import throw, so
// the heavy bundle can't sneak back into the first load. If the download fails, or is still not
// here after a few seconds, content is shown without its reveal rather than staying hidden.
const loadFeatures = () => {
  const timer = setTimeout(() => !featuresLoaded && showEverything(), FALLBACK_AFTER_MS);
  return import("./motion-features")
    .then((r) => {
      featuresLoaded = true;
      clearTimeout(timer);
      return r.default;
    })
    .catch(() => {
      clearTimeout(timer);
      showEverything();
      return new Promise<never>(() => {}); // stay on the static fallback; no unhandled rejection
    });
};

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
