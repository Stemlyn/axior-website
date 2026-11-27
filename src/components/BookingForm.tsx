"use client";

import { useState } from "react";
import { BadgeCheck, CalendarClock, Check, FileText, Repeat, Video } from "lucide-react";
import { AREAS, PROPERTIES, formatPrice, planInfo, type PriceKey } from "@/lib/site";
import { useSite, useWhatsappChat, useWhatsappNumber, whatsappLink } from "@/lib/store";
import { WhatsAppIcon, btn, cn } from "./ui";

const KEY_OPTIONS = [
  { id: "relative", label: "With a relative or friend in Mangaluru", short: "with a relative in Mangaluru" },
  { id: "security", label: "With the society office or security", short: "with society security" },
  { id: "lockbox", label: "In a digital lockbox at the property", short: "in a digital lockbox" },
];

const STEPS = ["Property", "Plan", "Location", "Keys"];

/**
 * The whole /book experience: a summary of the chosen plan on the left, four steps on the right
 * (property, plan, location, keys), ending in a pre-filled WhatsApp message.
 * `initialPlan` comes from ?plan= (the plan buttons on /services link here with it).
 */
export function BookingFlow({ initialPlan }: { initialPlan?: PriceKey }) {
  const { property, setProperty, area, setArea, currency, published } = useSite();
  const whatsappChat = useWhatsappChat();
  const waNumber = useWhatsappNumber();

  // Promotions switched off in the admin console remove the pilot option or the credit line.
  const pilotOn = published?.promos.foundingPilot ?? true;
  const creditOn = published?.promos.pilotCredit ?? true;
  const prop = PROPERTIES.find((p) => p.id === property)!;
  const options: PriceKey[] = pilotOn ? ["pilot", "spot", "essential", "vip"] : ["spot", "essential", "vip"];

  const [pick, setPick] = useState<PriceKey | null>(initialPlan ?? null);
  // No choice yet (or the pilot was switched off): default to the pilot, else the best fit.
  const plan: PriceKey = pick && options.includes(pick) ? pick : pilotOn ? "pilot" : prop.recommended;
  const info = planInfo(plan, property);
  const price = (k: PriceKey) => formatPrice(k, currency, property, published);
  const priceLabel = `${price(plan)}${info.per}`;

  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState("");
  const [keys, setKeys] = useState<string | null>(null);

  const keyShort = KEY_OPTIONS.find((k) => k.id === keys)?.short;
  const planText = plan === "pilot" ? `a Founding Pilot Audit (${price("pilot")})` : `${info.name} (${priceLabel}, ${info.cadence.toLowerCase()})`;
  const link = whatsappLink(property, area, { building: building.trim() || undefined, keys: keyShort, plan: planText }, waNumber);
  const canNext = step === 0 || step === 1 || (step === 2 && area) || (step === 3 && keys);

  const option = (selected: boolean) =>
    cn(
      "flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors",
      selected ? "border-night bg-mist font-semibold" : "border-line hover:border-ink/30",
    );

  const promises =
    plan === "pilot"
      ? [
          { icon: FileText, title: "Full 30-point audit", body: "The same inspection and report our monthly clients get." },
          { icon: CalendarClock, title: "No contract", body: "One visit. Decide about a monthly plan after reading the report." },
          ...(creditOn ? [{ icon: BadgeCheck, title: "Fee credited", body: "100% of the pilot fee goes toward your first month if you continue." }] : []),
        ]
      : [
          { icon: Repeat, title: info.cadence, body: info.summary },
          { icon: Video, title: "Report within 24 hours", body: "Photos, a 2-minute narrated video and the full visit recording, on WhatsApp." },
          ...(pilotOn
            ? [{ icon: BadgeCheck, title: "Not sure yet?", body: `Start with the ${price("pilot")} founding pilot audit and decide after the report.` }]
            : []),
        ];

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-32 sm:px-6 md:pb-20 md:pt-36 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <h1 className="display text-5xl sm:text-6xl">
          {plan === "pilot" ? (
            <>
              Book your <em>founding pilot</em> audit.
            </>
          ) : (
            <>
              Book <em>{info.name}.</em>
            </>
          )}
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-muted sm:text-lg">
          Four quick questions. We open WhatsApp with your answers filled in, and a coordinator replies with a visit slot that
          suits your time zone.
        </p>
        <div className="dark grain relative mt-8 overflow-hidden rounded-[1.5rem] bg-night p-6 text-white" aria-live="polite">
          <p className="text-sm text-white/70">
            {info.name} · {prop.short}
          </p>
          <p className="display mt-1 text-5xl">
            {price(plan)}
            {info.per && <span className="font-sans text-xl text-white/60">{info.per}</span>}
          </p>
          <p className="mt-2 text-sm text-white/70">
            {plan === "pilot" ? `Usually ${price("spot")} for a Spot Audit.` : `${info.cadence}. Billed in rupees.`}
          </p>
        </div>
        <ul className="mt-8 space-y-5">
          {promises.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.6} aria-hidden />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-9">
        <ol className="flex gap-2" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className="min-h-11 w-full text-left disabled:cursor-default"
              >
                <span className={cn("block h-1 rounded-full", i <= step ? "bg-gold" : "bg-line")} />
                <span className={cn("mt-2 block whitespace-nowrap text-[13px] sm:text-sm", i === step ? "font-semibold text-ink" : "text-muted")}>
                  <span className="max-sm:sr-only">{i + 1}. </span>
                  {s}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 min-h-[320px]">
          {step === 0 && (
            <fieldset>
              <legend className="display text-3xl">What kind of property is it?</legend>
              <div className="mt-6 grid gap-3">
                {PROPERTIES.map((p) => (
                  <button key={p.id} type="button" onClick={() => setProperty(p.id)} className={option(property === p.id)} aria-pressed={property === p.id}>
                    {p.label}
                    {property === p.id && <Check className="size-5 text-navy" aria-hidden />}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="display text-3xl">Which service do you need?</legend>
              <p className="mt-2 text-sm text-muted">Prices for your {prop.short}, billed in rupees.</p>
              <div className="mt-6 grid gap-3">
                {options.map((k) => {
                  const o = planInfo(k, property);
                  const selected = plan === k;
                  const best = k === prop.recommended;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPick(k)}
                      aria-pressed={selected}
                      className={cn(
                        "relative flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-colors",
                        selected ? "border-night bg-mist" : "border-line hover:border-ink/30",
                      )}
                    >
                      <span
                        className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full border", selected ? "border-night bg-night" : "border-line")}
                        aria-hidden
                      >
                        {selected && <Check className="size-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{o.name}</span>
                          {best && <span className="rounded-full bg-night px-2 py-0.5 text-[11px] font-semibold text-gold">Best fit for your {prop.short}</span>}
                          {k === "pilot" && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-gold-ink">Try us first</span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{o.cadence}</span>
                      </span>
                      <span className="shrink-0 text-right font-semibold tabular-nums">
                        {price(k)}
                        <span className="text-sm font-normal text-muted">{o.per}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <a href="/services#compare" className="mt-4 inline-block text-sm font-semibold text-gold-ink hover:underline">
                Compare what each plan includes
              </a>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="display text-3xl">Where is it?</legend>
              <label className="mt-6 block text-sm font-medium">
                Neighbourhood
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base focus:border-navy focus:outline-none"
                >
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="mt-5 block text-sm font-medium">
                Building or society name <span className="font-normal text-muted">(optional)</span>
                <input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. the name on the gate"
                  className="mt-1.5 w-full rounded-xl border border-line px-4 py-3.5 text-base focus:border-navy focus:outline-none"
                />
              </label>
              <p className="mt-3 text-sm text-muted">No flat number or street address needed here. We ask for that privately.</p>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend className="display text-3xl">Where are the keys now?</legend>
              <div className="mt-6 grid gap-3">
                {KEY_OPTIONS.map((k) => (
                  <button key={k.id} type="button" onClick={() => setKeys(k.id)} className={option(keys === k.id)} aria-pressed={keys === k.id}>
                    {k.label}
                    {keys === k.id && <Check className="size-5 text-navy" aria-hidden />}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className={cn(btn.base, btn.ghostDark)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className={cn(btn.base, btn.dark, "disabled:opacity-40")}>
              Continue
            </button>
          ) : (
            <a
              href={keys ? link : undefined}
              aria-disabled={!keys}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(btn.base, btn.dark, !keys && "pointer-events-none opacity-40")}
            >
              <WhatsAppIcon className="size-4" /> Book {plan === "pilot" ? "pilot audit" : info.name} on WhatsApp ({priceLabel})
            </a>
          )}
        </div>

        <p className="mt-6 text-sm text-muted">
          Prefer to talk first?{" "}
          <a href={whatsappChat} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-ink hover:underline">
            Chat with a coordinator on WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
