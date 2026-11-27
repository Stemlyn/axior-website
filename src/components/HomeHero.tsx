"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { DualClock, Price, ReportCard } from "./blocks";
import { Shot } from "./Photo";
import { btn, cn } from "./ui";


/** The one orchestrated moment: the photo settles, the headline rises line by line, the report slides in. */
export function HomeHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 800], reduce ? [0, 0] : [0, 120]);

  // Text enters with the CSS `rise` animation (globals.css), so it paints before any JavaScript.
  const line = (i: number) => ({ className: "rise", style: { "--rise-delay": `${0.06 + i * 0.07}s` } as CSSProperties });

  return (
    <section className="dark relative isolate overflow-hidden bg-night text-white">
      <m.div
        className="absolute inset-0 -z-20"
        style={{ y: photoY }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE_OUT }}
      >
        <Shot k="villa" priority className="h-full w-full" position="center 45%" sizes="100vw" />
      </m.div>
      <div className="scrim-left absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-night/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-night via-night/60 to-transparent" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-end gap-12 px-4 pb-16 pt-32 sm:px-6 lg:min-h-[100svh] lg:grid-cols-[1.25fr_1fr] lg:px-8 lg:pb-20">
        <div>
          <div {...line(0)}>
            <DualClock />
          </div>
          <h1 className="display mt-7 text-[3rem] leading-[0.98] sm:text-7xl lg:text-[4.6rem] xl:text-[5.4rem]">
            <span {...line(1)} className="rise block">
              Your eyes, hands,
            </span>{" "}
            <span {...line(2)} className="rise block">
              and <em>peace of mind</em>
            </span>{" "}
            <span {...line(3)} className="rise block">
              in Mangaluru.
            </span>
          </h1>
          <p {...line(4)} className="rise-move mt-7 max-w-xl text-lg leading-relaxed text-white/75">
            Professional oversight for NRI-owned apartments, villas and plots in Bejai, Kadri, Falnir and across coastal
            Karnataka. Scheduled visits, a 30-point audit, and a condition report on WhatsApp within 4 hours.
          </p>
          <div {...line(5)} className="rise mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className={cn(btn.base, btn.gold, "py-3.5")}>
              Book Pilot Audit (<Price k="pilot" />)
            </Link>
            <Link href="/audit" className={cn(btn.base, btn.glass, "py-3.5")}>
              See a sample report
            </Link>
          </div>
        </div>
        <div className="rise hidden justify-end lg:flex" style={{ "--rise-delay": "0.45s", "--rise-y": "40px" } as CSSProperties}>
          <ReportCard entrance="css" />
        </div>
      </div>
    </section>
  );
}
