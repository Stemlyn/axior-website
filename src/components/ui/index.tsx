import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";
import type { Severity } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Button looks. The reference uses squared-off black buttons; white for use on navy. */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98]",
  gold: "bg-gold text-night hover:bg-gold-2",
  dark: "bg-night text-white hover:bg-navy-2",
  light: "bg-white text-ink hover:bg-mist",
  glass: "border border-white/25 bg-white/5 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/10",
  ghostLight: "border border-white/25 bg-white/5 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/10",
  ghostDark: "border border-ink/15 text-ink hover:border-ink/40",
  emerald: "bg-emerald-700 text-white hover:bg-emerald-800",
};

const SEVERITY = {
  green: { label: "Passed", dot: "bg-ok", text: "text-emerald-700", bg: "bg-emerald-50" },
  amber: { label: "Monitored", dot: "bg-warn", text: "text-amber-700", bg: "bg-amber-50" },
  red: { label: "Action needed", dot: "bg-bad", text: "text-red-700", bg: "bg-red-50" },
} as const;

export function StatusTag({ status, className }: { status: Severity; className?: string }) {
  const s = SEVERITY[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
        s.bg,
        s.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {s.label}
    </span>
  );
}

export function StatusDot({ status }: { status: Severity }) {
  return <span className={cn("inline-block size-2.5 rounded-full", SEVERITY[status].dot)} aria-label={SEVERITY[status].label} />;
}

/**
 * A visible placeholder for content that needs real-world proof before launch
 * (testimonials, RWA letters, registry details). Search the codebase for <Slot to find them all.
 */
export function Slot({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-gold-ink/40 bg-mist/60 p-6", className)}>
      <p className="text-xs font-semibold text-gold-ink">To add before launch</p>
      <p className="mt-1 font-semibold">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

/** Centered serif heading with optional intro, used to open most sections. */
export function SectionHead({ title, intro, className }: { title: ReactNode; intro?: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <h2 className="display text-4xl sm:text-5xl">{title}</h2>
      {intro && <p className="mt-5 leading-relaxed text-muted sm:text-lg">{intro}</p>}
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.45 9.43m8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}
