"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { DUR, EASE_OUT, fadeUp, maskReveal, stagger, useScrollDepth } from "@/lib/motion";
import { Camera, CheckCheck, Video } from "lucide-react";
import { formatPrice, type PhotoKey, type PriceKey, type Severity } from "@/lib/site";
import { useSite } from "@/lib/store";
import { Shot } from "./Photo";
import { StatusDot, btn, cn } from "./ui";

/** Price in the visitor's chosen currency. */
export function Price({ k }: { k: PriceKey }) {
  const { currency, property, published } = useSite();
  return <>{formatPrice(k, currency, property, published)}</>;
}

/** Live clock in Mangaluru and Dubai. Renders after mount so server and client markup match. */
export function DualClock({ className }: { className?: string }) {
  const { home } = useSite();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const fmt = (tz: string) =>
    now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }) : "--:--";
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] tabular-nums text-white/85 backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald" />
      </span>
      <span>
        {fmt("Asia/Kolkata")} <span className="text-white/50">Mangaluru</span>
      </span>
      <span className="h-3 w-px bg-white/20" aria-hidden />
      <span>
        {fmt(home.tz)} <span className="text-white/50">{home.city}</span>
      </span>
    </p>
  );
}

/** Fades content up once as it enters the viewport. Use on a few key blocks, not everything. */
export function Reveal({
  children,
  className,
  delay = 0,
  stagger: staggered = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Reveal each direct child in turn (60 ms apart) instead of the block as one. */
  stagger?: boolean;
}) {
  const view = { once: true, margin: "-10% 0px" } as const;
  if (staggered) {
    return (
      <m.div className={className} variants={stagger(0.06, delay)} initial="hidden" whileInView="show" viewport={view}>
        {Children.map(children, (child) => (child == null ? child : <m.div variants={fadeUp}>{child}</m.div>))}
      </m.div>
    );
  }
  return (
    <m.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={view}
      transition={{ duration: DUR.base, delay, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}

type ListTag = "ul" | "ol" | "div";
const LIST = { ul: m.ul, ol: m.ol, div: m.div } as const;

/** A grid or list whose items arrive one after another as it scrolls into view. Pair with StaggerItem. */
export function StaggerList({ as = "div", className, children }: { as?: ListTag; className?: string; children: ReactNode }) {
  const Tag = LIST[as];
  return (
    <Tag className={className} variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}>
      {children}
    </Tag>
  );
}

const ITEM = { li: m.li, div: m.div } as const;

/** One item of a StaggerList (renders an li or div so list semantics stay intact). */
export function StaggerItem({ as = "div", className, children }: { as?: "li" | "div"; className?: string; children: ReactNode }) {
  const Tag = ITEM[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}

/** A photo that uncovers as it enters the view, then drifts slightly slower than the page as it scrolls past. */
export function ParallaxShot({
  k,
  className,
  sizes,
  position,
}: {
  k: PhotoKey;
  className?: string;
  sizes?: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const y = useScrollDepth(ref);
  return (
    <m.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      variants={reduce ? undefined : maskReveal}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      <m.div style={{ y }} className="absolute inset-x-0 -inset-y-[8%]">
        <Shot k={k} className="h-full w-full" sizes={sizes} position={position} />
      </m.div>
    </m.div>
  );
}

/** Inline style for the CSS `rise` entrance: delay in seconds, optional travel distance. */
export function riseAt(delay: number, y?: string): CSSProperties {
  return { "--rise-delay": `${delay}s`, ...(y ? { "--rise-y": y } : {}) } as CSSProperties;
}

/** Photo-backed dark header that opens every inner page. */
export function PageHeader({
  title,
  intro,
  photo,
  position,
  aside,
  children,
}: {
  title: ReactNode;
  intro: ReactNode;
  photo: PhotoKey;
  position?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="dark relative isolate overflow-hidden bg-night text-white">
      <Shot k={photo} priority className="absolute inset-0 -z-10 opacity-70" position={position} sizes="100vw" />
      <div className="scrim-left absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-36 sm:px-6 lg:min-h-[620px] lg:grid-cols-[1.1fr_auto] lg:px-8 lg:pb-24 lg:pt-40">
        {/* CSS entrance (globals.css `rise`): the title is painted on the first frame, no JavaScript needed. */}
        <div className="max-w-2xl">
          <h1 className="rise display text-[2.9rem] sm:text-6xl lg:text-7xl" style={riseAt(0.04)}>
            {title}
          </h1>
          <p className="rise mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/75" style={riseAt(0.12)}>
            {intro}
          </p>
          {children && (
            <div className="rise mt-9" style={riseAt(0.2)}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="rise flex justify-center" style={riseAt(0.28, "32px")}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

const REPORT: { status: Severity; text: string }[] = [
  { status: "green", text: "27 of 30 points passed" },
  { status: "amber", text: "Kitchen tap slow drip, mains closed" },
  { status: "amber", text: "Humidity 78% at entry, 66% after flush" },
  { status: "red", text: "West bedroom window seal cracked" },
];

/** The WhatsApp visit report as an owner sees it. */
export function ReportCard({ className, entrance = "inView" }: { className?: string; entrance?: "css" | "inView" }) {
  const reduce = useReducedMotion();
  // In the first screen the lines use the CSS entrance (painted without JavaScript); further down
  // the page they arrive as the card scrolls into view.
  const item = (i: number) =>
    entrance === "css"
      ? { style: riseAt(0.6 + i * 0.12, "6px") }
      : reduce
        ? {}
        : {
            initial: { opacity: 0, y: 6 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { delay: 0.3 + i * 0.25, duration: 0.4 },
          };
  const rise = entrance === "css" && "rise";

  return (
    <div
      className={cn(
        "w-full max-w-[360px] rounded-[1.75rem] bg-white p-4 text-left text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-full bg-night text-[11px] font-semibold text-gold">Ax</div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Axior Property Care</p>
          <p className="text-xs text-muted">2BHK, Bejai, Flat 4B</p>
        </div>
        <span className="ml-auto rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Delivered
        </span>
      </div>
      <div className="mt-3 rounded-2xl bg-mist p-3.5 text-sm">
        <p className="font-semibold">Visit report, 14 July</p>
        <p className="mt-0.5 text-xs text-muted">In 10:31 IST, out 11:24 IST (09:01 to 09:54 in Dubai)</p>
        <ul className="mt-3 space-y-2">
          {REPORT.map((r, i) => (
            <m.li key={r.text} {...item(i)} className={cn("flex items-start gap-2.5", rise)}>
              <span className="mt-1.5">
                <StatusDot status={r.status} />
              </span>
              <span>{r.text}</span>
            </m.li>
          ))}
        </ul>
      </div>
      <m.div {...item(4)} className={cn("mt-2 grid grid-cols-3 gap-1.5", rise)}>
        {(
          [
            ["window", "Window seal", "10:42"],
            ["meter", "Moisture 17.6%", "10:47"],
            ["interior", "Living room", "10:58"],
          ] as const
        ).map(([k, c, t]) => (
          <div key={c} className="relative aspect-square overflow-hidden rounded-xl">
            <Shot k={k} className="absolute inset-0" sizes="120px" />
            <div className="scrim-bottom absolute inset-0" />
            <Camera className="absolute left-1.5 top-1.5 size-3 text-white/80" aria-hidden />
            <span className="absolute inset-x-1.5 bottom-1.5 text-[9.5px] leading-tight text-white">
              {c}
              <span className="block text-white/60">{t}</span>
            </span>
          </div>
        ))}
      </m.div>
      <m.div
        {...item(5)}
        className={cn("mt-2 flex items-center justify-between rounded-xl bg-mist px-3 py-2 text-xs text-muted", rise)}
      >
        <span className="flex items-center gap-1.5">
          <Video className="size-3.5" aria-hidden /> Narrated summary 2:04
          <span className="text-line" aria-hidden>|</span> Full visit 53 min
        </span>
        <CheckCheck className="size-4 text-sky-500" aria-label="Read" />
      </m.div>
    </div>
  );
}

/** Closing band: a photo with the booking call to action. */
export function CtaBand({ title, body, photo = "villa" }: { title: ReactNode; body: ReactNode; photo?: PhotoKey }) {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="dark relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-night text-white">
        <ParallaxShot k={photo} className="absolute inset-0 -z-10 opacity-60" sizes="100vw" />
        <div className="scrim-left absolute inset-0 -z-10" />
        <div className="flex flex-col gap-10 px-6 py-16 sm:px-12 md:flex-row md:items-end md:justify-between md:py-20">
          <div className="max-w-xl">
            <h2 className="display text-4xl sm:text-6xl">{title}</h2>
            <p className="mt-5 leading-relaxed text-white/75">{body}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/book" className={cn(btn.base, btn.gold)}>
              Book Pilot Audit (<Price k="pilot" />)
            </Link>
            <Link href="/services" className={cn(btn.base, btn.glass)}>
              Explore plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
