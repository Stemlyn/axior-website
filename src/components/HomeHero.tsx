"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DualClock, Price, ReportCard } from "./blocks";
import { Shot } from "./Photo";
import { btn, cn } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The one orchestrated moment: the photo settles, the headline rises line by line, the report slides in. */
export function HomeHero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 800], reduce ? [0, 0] : [0, 120]);

  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: "0.4em" },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay: 0.25 + i * 0.12, ease: EASE },
        };

  return (
    <section className="dark relative isolate overflow-hidden bg-night text-white">
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ y: photoY }}
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Shot k="villa" priority className="h-full w-full" position="center 45%" sizes="100vw" />
      </motion.div>
      <div className="scrim-left absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-night/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-night via-night/60 to-transparent" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-end gap-12 px-4 pb-16 pt-32 sm:px-6 lg:min-h-[100svh] lg:grid-cols-[1.25fr_1fr] lg:px-8 lg:pb-20">
        <div>
          <motion.div {...line(0)}>
            <DualClock />
          </motion.div>
          <h1 className="display mt-7 text-[3rem] leading-[0.98] sm:text-7xl lg:text-[4.6rem] xl:text-[5.4rem]">
            <motion.span className="block" {...line(1)}>
              Your eyes, hands,
            </motion.span>{" "}
            <motion.span className="block" {...line(2)}>
              and <em>peace of mind</em>
            </motion.span>{" "}
            <motion.span className="block" {...line(3)}>
              in Mangaluru.
            </motion.span>
          </h1>
          <motion.p {...line(4)} className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
            Professional oversight for NRI-owned apartments, villas and plots in Bejai, Kadri, Falnir and across coastal
            Karnataka. Scheduled visits, a 30-point audit, and a photo report on WhatsApp within 24 hours.
          </motion.p>
          <motion.div {...line(5)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className={cn(btn.base, btn.gold, "py-3.5")}>
              Book Pilot Audit (<Price k="pilot" />)
            </Link>
            <Link href="/audit" className={cn(btn.base, btn.glass, "py-3.5")}>
              See a sample report
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="hidden justify-end lg:flex"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
        >
          <ReportCard />
        </motion.div>
      </div>
    </section>
  );
}
