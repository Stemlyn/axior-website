"use client";

import { CURRENCIES, type Currency } from "@/lib/site";
import { useSite } from "@/lib/store";
import { cn } from "./ui";

export { NAV } from "@/lib/nav";

/**
 * Segmented switch for in-page pricing: INR, the visitor's local currency, and USD.
 * The full list of currencies lives in the navbar's currency menu.
 */
export function CurrencyToggle({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { currency, setCurrency } = useSite();
  const local: Currency = currency === "INR" || currency === "USD" ? "AED" : currency;
  const options = CURRENCIES.filter((c) => c.code === "INR" || c.code === local || c.code === "USD");
  return (
    <div
      role="radiogroup"
      aria-label="Show prices in"
      className={cn(
        "flex rounded-full p-0.5 text-[11px] font-semibold tracking-[0.04em]",
        tone === "dark" ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-mist ring-1 ring-line",
        className,
      )}
    >
      {options.map((c) => {
        const on = currency === c.code;
        return (
          <button
            key={c.code}
            role="radio"
            aria-checked={on}
            onClick={() => setCurrency(c.code)}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors duration-200",
              on ? "bg-night text-white" : tone === "dark" ? "text-white/60 hover:text-white" : "text-muted hover:text-ink",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
