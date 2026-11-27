"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Camera } from "lucide-react";
import { PILLARS, type Severity } from "@/lib/site";
import { Shot } from "./Photo";
import { SectionHead, StatusDot, StatusTag, cn } from "./ui";

function counts(points: { status: Severity }[]) {
  return {
    green: points.filter((p) => p.status === "green").length,
    amber: points.filter((p) => p.status === "amber").length,
    red: points.filter((p) => p.status === "red").length,
  };
}

const SHORT: Record<string, string> = {
  seepage: "1. Seepage & moisture",
  air: "2. Air & ventilation",
  plumbing: "3. Plumbing & sewer gas",
  electrical: "4. Electrical & pests",
};

export function InspectionWalkthrough() {
  const [active, setActive] = useState(PILLARS[0].id);
  const pillar = PILLARS.find((p) => p.id === active)!;
  const total = PILLARS.reduce((n, p) => n + p.points.length, 0);
  const c = counts(pillar.points);

  return (
    <section id="console" className="bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead
          title={
            <>
              The audit <em>console.</em>
            </>
          }
          intro={`All ${total} points from a real-format report on a 2BHK in Bejai. Pick an area to see each check, its flag and the photos behind it.`}
        />
        <div
          role="tablist"
          aria-label="Inspection areas"
          className="mx-auto mt-12 flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg bg-white p-1 shadow-sm"
        >
          {PILLARS.map((p) => {
            const selected = p.id === active;
            return (
              <button
                key={p.id}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={selected}
                aria-controls={`panel-${p.id}`}
                onClick={() => setActive(p.id)}
                className={cn(
                  "min-h-11 shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                  selected ? "bg-navy text-white" : "text-muted hover:text-ink",
                )}
              >
                {SHORT[p.id]}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={pillar.id}
            role="tabpanel"
            id={`panel-${pillar.id}`}
            aria-labelledby={`tab-${pillar.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-[2rem] bg-white p-5 sm:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="display text-3xl">{pillar.name}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">{pillar.why}</p>
              </div>
              <p className="flex shrink-0 items-center gap-3 text-sm text-muted">
                <span>{pillar.points.length} points</span>
                <span className="flex items-center gap-1"><StatusDot status="green" /> {c.green}</span>
                {c.amber > 0 && <span className="flex items-center gap-1"><StatusDot status="amber" /> {c.amber}</span>}
                {c.red > 0 && <span className="flex items-center gap-1"><StatusDot status="red" /> {c.red}</span>}
              </p>
            </div>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {pillar.points.map((pt) => (
                <li key={pt.label} className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-medium sm:w-64 sm:shrink-0">{pt.label}</span>
                  <span className="flex-1 text-sm text-muted">{pt.note}</span>
                  <StatusTag status={pt.status} className="self-start sm:self-auto" />
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {pillar.photos.map((ph) => (
                <figure
                  key={ph.caption}
                  className="relative isolate flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl bg-night p-3"
                >
                  <Shot k={ph.photo} className="absolute inset-0 -z-10" sizes="(min-width: 640px) 33vw, 100vw" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/30 via-transparent to-night/50" />
                  <div className="flex items-start justify-between">
                    <Camera className="size-4 text-white/90" aria-hidden />
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] tabular-nums text-ink/80 backdrop-blur">
                      14 Jul, {ph.time}
                    </span>
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 backdrop-blur">
                    <span className="text-sm font-medium leading-snug">{ph.caption}</span>
                    <StatusDot status={ph.status} />
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Illustrative photos. Your report carries the original, timestamped photos from your visit.</p>
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
