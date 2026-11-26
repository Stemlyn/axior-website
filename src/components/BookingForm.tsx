"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AREAS, PROPERTIES, formatPrice } from "@/lib/site";
import { useSite, useWhatsappChat, useWhatsappNumber, whatsappLink } from "@/lib/store";
import { WhatsAppIcon, btn, cn } from "./ui";

const KEY_OPTIONS = [
  { id: "relative", label: "With a relative or friend in Mangaluru", short: "with a relative in Mangaluru" },
  { id: "security", label: "With the society office or security", short: "with society security" },
  { id: "lockbox", label: "In a digital lockbox at the property", short: "in a digital lockbox" },
];

const STEPS = ["Property", "Location", "Keys"];

export function BookingForm() {
  const { property, setProperty, area, setArea, currency, published } = useSite();
  const whatsappChat = useWhatsappChat();
  const waNumber = useWhatsappNumber();
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState("");
  const [keys, setKeys] = useState<string | null>(null);

  const keyShort = KEY_OPTIONS.find((k) => k.id === keys)?.short;
  const link = whatsappLink(property, area, { building: building.trim() || undefined, keys: keyShort }, waNumber);
  const canNext = step === 0 || (step === 1 && area) || (step === 2 && keys);

  const option = (selected: boolean) =>
    cn(
      "flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors",
      selected ? "border-night bg-mist font-semibold" : "border-line hover:border-ink/30",
    );

  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-9">
      <ol className="flex gap-2" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="w-full text-left disabled:cursor-default"
            >
              <span className={cn("block h-1 rounded-full", i <= step ? "bg-gold" : "bg-line")} />
              <span className={cn("mt-2 block text-sm", i === step ? "font-semibold text-ink" : "text-muted")}>
                {i + 1}. {s}
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

        {step === 2 && (
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
        {step < 2 ? (
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
            <WhatsAppIcon className="size-4" /> Send booking on WhatsApp ({formatPrice("pilot", currency, property, published)})
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
  );
}
