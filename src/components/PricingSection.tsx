"use client";

import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { DUR, EASE_OUT } from "@/lib/motion";
import { Check, CloudRain, Minus, Repeat } from "lucide-react";
import { PROPERTIES, TIERS, formatPrice } from "@/lib/site";
import { useSite } from "@/lib/store";
import { CurrencyToggle } from "./Navbar";
import { SectionHead, btn, cn } from "./ui";

/** Property selector, recommendation and the three-tier grid. */
export function PricingSection() {
  const { currency, property, setProperty, published } = useSite();
  const reduce = useReducedMotion();
  const prop = PROPERTIES.find((p) => p.id === property)!;
  // Promotions switched off in the admin console hide the pilot banner or the credit line.
  const pilotOn = published?.promos.foundingPilot ?? true;
  const creditOn = published?.promos.pilotCredit ?? true;
  const recommended = TIERS.find((t) => t.key === prop.recommended)!;
  // Plots need fewer visits than homes: one a month on Essential Care, two on Monsoon VIP Shield.
  const cadence = (k: (typeof TIERS)[number]["key"]) =>
    property === "plot" && k === "essential"
      ? "1 visit a month"
      : property === "plot" && k === "vip"
        ? "2 visits a month"
        : TIERS.find((t) => t.key === k)!.cadence;
  const focus = prop.focus.map((f, i) => (i ? f[0].toLowerCase() + f.slice(1) : f)).join(", ");

  return (
    <section id="plans" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHead
        title={
          <>
            Pick your property. <em>We’ll suggest the plan.</em>
          </>
        }
        intro="A 2BHK is not priced or visited like a villa. Billed in rupees; dirham and dollar figures are approximate."
      />

      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4">
        <div role="tablist" aria-label="Property type" className="flex flex-wrap justify-center gap-2">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={property === p.id}
              onClick={() => setProperty(p.id)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                property === p.id ? "border-night bg-night text-white" : "border-line bg-white text-muted hover:text-ink",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <CurrencyToggle tone="light" className="text-xs [&_button]:px-4 [&_button]:py-1.5 max-sm:[&_button]:min-h-11" />
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-6 rounded-[2rem] bg-mist p-6 sm:p-8 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Recommended for a {prop.short}</p>
          <p className="display mt-1 text-3xl">{recommended.name}</p>
        </div>
        <div className="flex gap-3">
          <Repeat className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden />
          <div>
            <p className="font-semibold">{prop.frequency}</p>
            <p className="text-sm text-muted">{prop.monsoon}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <CloudRain className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden />
          <div>
            <p className="font-semibold">What we watch most closely</p>
            <p className="text-sm text-muted">{focus}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => {
          const isRec = t.key === prop.recommended;
          return (
            <article
              key={t.key}
              className={cn(
                "relative flex flex-col rounded-[2rem] border bg-white p-7 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none",
                isRec ? "border-night shadow-[0_30px_60px_-30px_rgba(7,13,26,0.5)]" : "border-line",
              )}
            >
              {isRec && (
                <m.span
                  layoutId={reduce ? undefined : "best-fit"}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  className="absolute -top-3 left-7 rounded-full bg-night px-3 py-1 text-xs font-semibold text-gold"
                >
                  Best fit for your {prop.short}
                </m.span>
              )}
              <h3 className="display text-3xl">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{cadence(t.key)}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="relative inline-flex overflow-hidden text-4xl font-semibold tracking-[-0.03em] tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.span
                      key={`${property}-${currency}-${t.key}`}
                      initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    >
                      {formatPrice(t.key, currency, property, published)}
                    </m.span>
                  </AnimatePresence>
                </span>
                <span className="text-muted">{t.per}</span>
              </p>
              <p className="mt-4 leading-relaxed text-muted">{t.summary}</p>
              <ul className="mb-8 mt-6 space-y-3 border-t border-line pt-6">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2.5} aria-hidden />
                    {inc}
                  </li>
                ))}
              </ul>
              <Link
                href={`/book?plan=${t.key}`}
                className={cn(btn.base, isRec ? btn.dark : btn.ghostDark, "mt-auto w-full justify-center")}
                aria-label={`Choose ${t.name} for your ${prop.short}`}
              >
                Choose {t.name}
              </Link>
            </article>
          );
        })}
      </div>

      {pilotOn && (
        <div className="dark grain relative mt-8 flex flex-col gap-5 overflow-hidden rounded-[2rem] bg-night p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="display text-3xl">
              Founding pilot audit, <em>{formatPrice("pilot", currency, property, published)}</em>
            </p>
            <p className="mt-2 text-white/80">
              Your first full 30-point Spot Audit, usually {formatPrice("spot", currency, property, published)}.
              {creditOn && " Credited in full to your first month if you continue."}
            </p>
          </div>
          <Link href="/book?plan=pilot" className={cn(btn.base, btn.gold, "shrink-0")}>
            Book the pilot audit
          </Link>
        </div>
      )}
    </section>
  );
}

type Cell = boolean | string;
const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  { label: "Visits (flats and villas)", cells: ["One", "2 a month", "4 a month"] },
  { label: "Visits (vacant plots)", cells: ["One", "1 a month", "2 a month"] },
  { label: "30-point inspection, every visit", cells: [true, true, true] },
  { label: "WhatsApp photo report within 24 hours", cells: [true, true, true] },
  { label: "2-minute narrated video walkthrough", cells: [true, true, true] },
  { label: "Full, unedited entry-to-exit recording", cells: [true, true, true] },
  { label: "Air and moisture flush, 20–45 minutes", cells: [true, true, true] },
  { label: "Drain flush and P-trap refill", cells: [true, true, true] },
  { label: "Moisture-meter readings", cells: [true, true, true] },
  { label: "Bills, flyers and door notices handled", cells: [false, true, true] },
  { label: "MESCOM meter and breaker photos", cells: [true, true, true] },
  { label: "Society circulars and mail collected", cells: [false, true, true] },
  { label: "Check within 24 hours of a heavy-rain alert", cells: [false, false, true] },
  { label: "Response to an issue you report", cells: ["—", "Within 48 hours", "Within 24 hours"] },
  { label: "Priority dispatch of approved vendors", cells: [false, false, true] },
];

/** Line-by-line comparison of what each plan includes. */
export function ComparisonTable() {
  return (
    <section id="compare" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
      <SectionHead
        title={
          <>
            Every inclusion, <em>line by line.</em>
          </>
        }
      />
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15">
              <th scope="col" className="py-4 pr-4 font-normal text-muted">
                Included
              </th>
              {TIERS.map((t) => (
                <th key={t.key} scope="col" className="display px-3 py-4 text-center text-xl font-normal">
                  {t.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-line">
                <th scope="row" className="py-3.5 pr-4 font-medium">
                  {r.label}
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} className="px-3 py-3.5 text-center">
                    {c === true ? (
                      <Check className="mx-auto size-4 text-ok" strokeWidth={2.5} aria-label="Included" />
                    ) : c === false ? (
                      <Minus className="mx-auto size-4 text-line" aria-label="Not included" />
                    ) : (
                      <span className="text-muted">{c}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
