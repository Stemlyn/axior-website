import Link from "next/link";
import { Shot } from "@/components/Photo";
import { NAV } from "@/lib/nav";
import { btn, cn } from "@/components/ui";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night text-white">
      <Shot k="keys" className="absolute inset-0 -z-10 opacity-40" sizes="100vw" />
      <div className="scrim-left absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8">
        <p className="text-sm text-white/60">Error 404</p>
        <h1 className="display mt-4 max-w-2xl text-5xl sm:text-7xl">
          This door is <em>locked.</em>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
          The page you were looking for has moved or never existed. These will get you where you meant to go.
        </p>
        <ul className="mt-10 flex flex-wrap gap-3">
          <li>
            <Link href="/" className={cn(btn.base, btn.gold)}>
              Back to home
            </Link>
          </li>
          {NAV.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn(btn.base, btn.glass)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
