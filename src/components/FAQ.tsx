import { Plus } from "lucide-react";
import { FAQS } from "@/lib/site";

export function FAQ({ items = FAQS, title }: { items?: { q: string; a: string }[]; title?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
      <h2 className="display text-center text-4xl sm:text-5xl">
        {title ?? (
          <>
            Questions owners ask <em>before</em> handing over keys.
          </>
        )}
      </h2>
      <div className="mt-12 space-y-3">
        {items.map((f) => (
          <details key={f.q} className="group rounded-2xl bg-mist px-6 py-5 open:bg-white open:shadow-[0_0_0_1px_var(--color-line)]">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus className="mt-1 size-5 shrink-0 text-muted transition-transform group-open:rotate-45" aria-hidden />
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
