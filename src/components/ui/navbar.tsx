"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { ArrowUpRight, Check, ChevronDown, Coins, Menu, X } from "lucide-react";
import { CURRENCIES, PHOTOS, formatPrice, type PhotoKey, type PropertyType } from "@/lib/site";
import { useSite, useWhatsappChat } from "@/lib/store";
import { Wordmark } from "../Logo";
import { WhatsAppIcon, cn } from ".";

/*
 * Floating card navbar with mega panels (structure adapted from the "navbar2" reference).
 *
 * Behaviour:
 * - Desktop (lg+): hover with intent delay or click opens a panel; switching items swaps the panel
 *   content in place. Arrow keys move between items, ArrowDown/Enter moves into the panel,
 *   Escape closes and returns focus. Page behind dims while open.
 * - Scroll: hides when scrolling down past the hero edge, returns on scroll up; never hides while open.
 * - Mobile (<lg): the card expands into a full menu; page scroll is locked behind it.
 * - Closes on navigation (including back/forward) and on outside click.
 */

type MegaLink = { label: string; href: string; badge?: string; property?: PropertyType };
type MegaMenu = {
  label: string;
  short: string;
  href: string;
  columns: { eyebrow: string; links: MegaLink[] }[];
  footerLinks?: { label: string; href: string }[];
  image: PhotoKey;
  caption: string;
};

const MENUS: MegaMenu[] = [
  {
    label: "Services & Pricing",
    short: "Services",
    href: "/services",
    columns: [
      {
        eyebrow: "Plans",
        links: [
          { label: "Spot Audit", href: "/services#plans" },
          { label: "Essential Care", href: "/services#plans" },
          { label: "Monsoon VIP Shield", href: "/services#plans", badge: "Jun–Sep" },
        ],
      },
      {
        eyebrow: "By property",
        links: [
          { label: "1–2BHK apartment", href: "/services#plans", property: "apartment" },
          { label: "3BHK+ flat", href: "/services#plans", property: "large-flat" },
          { label: "Independent villa", href: "/services#plans", property: "villa" },
          { label: "Vacant plot", href: "/services#plans", property: "plot" },
        ],
      },
    ],
    footerLinks: [
      { label: "How repairs are paid", href: "/services#repairs" },
      { label: "Compare every inclusion", href: "/services#compare" },
    ],
    image: "interior",
    caption: "Priced for the home you actually own",
  },
  {
    label: "The 30-Point Audit",
    short: "The Audit",
    href: "/audit",
    columns: [
      {
        eyebrow: "Four areas",
        links: [
          { label: "Seepage & moisture", href: "/audit#console" },
          { label: "Air & ventilation", href: "/audit#console" },
          { label: "Plumbing & sewer gas", href: "/audit#console" },
          { label: "Electrical & pests", href: "/audit#console" },
        ],
      },
      {
        eyebrow: "Proof",
        links: [
          { label: "Sample report", href: "/audit" },
          { label: "What the flags mean", href: "/audit#flags" },
        ],
      },
    ],
    image: "meter",
    caption: "Thirty checks, every visit, on record",
  },
  {
    label: "Trust & Security",
    short: "Trust",
    href: "/trust",
    columns: [
      {
        eyebrow: "Key custody",
        links: [
          { label: "Coded key tags", href: "/trust#keys" },
          { label: "Dual-custody safe", href: "/trust#keys" },
          { label: "Key movement log", href: "/trust#keys" },
        ],
      },
      {
        eyebrow: "Every visit",
        links: [
          { label: "Entry-to-exit video", href: "/trust#video" },
          { label: "Society introduction", href: "/trust#society" },
          { label: "No-valuables agreement", href: "/trust#society" },
        ],
      },
    ],
    image: "keys",
    caption: "Your keys, accounted for",
  },
  {
    label: "Coverage Areas",
    short: "Coverage",
    href: "/coverage",
    columns: [
      {
        eyebrow: "Central",
        links: ["Bejai", "Kadri", "Falnir", "Bendoorwell"].map((a) => ({ label: a, href: "/coverage#areas" })),
      },
      {
        eyebrow: "North & coast",
        links: ["Derebail", "Mannagudda", "Kottara", "Surathkal"].map((a) => ({ label: a, href: "/coverage#areas" })),
      },
    ],
    footerLinks: [
      { label: "Coastal climate guide", href: "/coverage#climate" },
      { label: "Owner guides & blog", href: "/blog" },
    ],
    image: "villa",
    caption: "Local, street by street",
  },
];

// Shared site easing (src/lib/motion.ts).
const EASE = EASE_OUT;
const OPEN_DELAY = 90; // hover intent: ignore a cursor just passing over
const CLOSE_DELAY = 220; // grace period when the cursor leaves the card

function useClock() {
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
  return (tz: string) =>
    now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }) : "--:--";
}

/** Currency picker (the reference's language switcher). Auto-detected; a manual pick is remembered. */
function CurrencyMenu({ onOpen }: { onOpen: () => void }) {
  const { currency, setCurrency } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        onClick={() => {
          onOpen();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls="currency-menu"
        aria-label={`Prices in ${currency}. Change currency`}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
          open ? "bg-mist text-ink" : "text-muted hover:bg-mist hover:text-ink",
        )}
      >
        <Coins className="size-4" aria-hidden />
        {currency}
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            id="currency-menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="absolute right-0 top-full z-20 mt-2 w-64 origin-top-right rounded-2xl border border-line bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(7,13,26,0.25)]"
          >
            <ul>
              {CURRENCIES.map((c) => (
                <li key={c.code}>
                  <button
                    aria-pressed={c.code === currency}
                    onClick={() => {
                      setCurrency(c.code);
                      setOpen(false);
                      btnRef.current?.focus();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-mist focus-visible:bg-mist"
                  >
                    <span>
                      <span className="font-medium text-ink">{c.name}</span>{" "}
                      <span className="text-muted">({c.code})</span>
                    </span>
                    {c.code === currency && <Check className="size-4 text-ink" aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
            <p className="px-3 pb-1.5 pt-2 text-[11px] leading-snug text-muted">
              Set from your location. Billed in INR; other figures are approximate.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AxiorNavbar() {
  const whatsappChat = useWhatsappChat();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currency, setCurrency, property, setProperty, home, published } = useSite();
  const path = usePathname();
  const time = useClock();
  const reduce = useReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusPanelOnOpen = useRef(false);

  // Lowest bookable price: the founding pilot, or the Spot Audit when the pilot is switched off.
  const pilot = formatPrice(published?.promos.foundingPilot === false ? "spot" : "pilot", currency, property, published);
  const active = openIdx === null ? null : MENUS[openIdx];
  const anyOpen = openIdx !== null || mobileOpen;

  // Close on navigation, including back/forward (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpenIdx(null);
    setMobileOpen(false);
  }

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const close = useCallback(() => {
    clearTimer();
    setOpenIdx(null);
    setMobileOpen(false);
  }, []);

  // Hide on scroll down, reveal on scroll up; add depth once off the top.
  const { scrollY } = useScroll();
  // Runs every scroll frame, so React state is only touched when a value actually flips.
  const flags = useRef({ scrolled: false, hidden: false });
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextScrolled = y > 8;
    if (nextScrolled !== flags.current.scrolled) setScrolled((flags.current.scrolled = nextScrolled));
    if (anyOpen) return;
    const nextHidden = y > prev && y > 140 ? true : y < prev - 4 || y < 140 ? false : flags.current.hidden;
    if (nextHidden !== flags.current.hidden) setHidden((flags.current.hidden = nextHidden));
  });

  // Outside click and Escape.
  useEffect(() => {
    if (!anyOpen) return;
    const onDown = (e: MouseEvent) => cardRef.current && !cardRef.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const idx = openIdx;
      close();
      if (idx !== null) triggerRefs.current[idx]?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [anyOpen, openIdx, close]);

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Keyboard-opened panels receive focus on their first link.
  useEffect(() => {
    if (openIdx === null || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 60);
    return () => clearTimeout(t);
  }, [openIdx]);

  const hoverOpen = (i: number) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearTimer();
    if (openIdx === null) timer.current = setTimeout(() => setOpenIdx(i), OPEN_DELAY);
    else setOpenIdx(i);
  };
  const hoverLeave = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearTimer();
    timer.current = setTimeout(() => setOpenIdx(null), CLOSE_DELAY);
  };

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = MENUS.length;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      triggerRefs.current[next]?.focus();
      if (openIdx !== null) setOpenIdx(next);
    } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusPanelOnOpen.current = true;
      setOpenIdx(i);
      if (openIdx === i) panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  };

  const pick = (l: MegaLink) => {
    if (l.property) setProperty(l.property);
    close();
  };

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      {/* Dims the page while a panel or the mobile menu is open. */}
      <AnimatePresence>
        {anyOpen && (
          <m.div
            key="nav-scrim"
            aria-hidden
            className="fixed inset-0 z-40 bg-night/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <m.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        animate={{ y: hidden && !anyOpen ? "-120%" : "0%" }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
        onFocusCapture={() => setHidden(false)}
      >
        {/* Card widens on very large screens so the tagline fits beside the full-length links and CTA. */}
        <div className="pointer-events-auto w-full max-w-7xl min-[1680px]:max-w-[88rem]" onMouseLeave={hoverLeave} onMouseEnter={clearTimer}>
          <m.div
            ref={cardRef}
            layout={!reduce}
            transition={{ duration: 0.25, ease: EASE }}
            className={cn(
              "relative rounded-3xl border bg-white/[0.97] transition-shadow duration-300",
              scrolled || anyOpen
                ? "border-white/70 shadow-[0_1px_2px_rgba(7,13,26,0.06),0_22px_48px_-16px_rgba(7,13,26,0.45)]"
                : "border-white/50 shadow-[0_1px_2px_rgba(7,13,26,0.05),0_14px_32px_-14px_rgba(7,13,26,0.3)]",
            )}
          >
            {/* Top row */}
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-7">
              <Link href="/" className="-m-2 flex min-h-11 shrink-0 items-center gap-3 p-2 text-ink" aria-label="Axior home">
                <Wordmark className="h-[17px] w-auto sm:h-[19px]" />
                <span className="hidden border-l border-line pl-3 text-[11px] leading-tight text-muted min-[1680px]:block">
                  Asset stewardship
                  <br />
                  Mangaluru
                </span>
              </Link>

              {/* Desktop items */}
              <nav aria-label="Main" className="hidden lg:block">
                <ul className="flex items-center gap-0.5">
                  {MENUS.map((menu, i) => {
                    const isOpen = openIdx === i;
                    const current = path === menu.href;
                    return (
                      <li key={menu.href} onMouseEnter={() => hoverOpen(i)}>
                        <button
                          ref={(el) => {
                            triggerRefs.current[i] = el;
                          }}
                          onClick={() => setOpenIdx((o) => (o === i ? null : i))}
                          onKeyDown={(e) => onTriggerKey(e, i)}
                          aria-expanded={isOpen}
                          aria-controls="mega-panel"
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "relative flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[14.5px] font-medium transition-colors xl:px-3.5",
                            isOpen ? "bg-mist text-ink" : current ? "text-ink hover:bg-mist/70" : "text-muted hover:bg-mist/70 hover:text-ink",
                          )}
                        >
                          <span className="xl:hidden">{menu.short}</span>
                          <span className="hidden xl:inline">{menu.label}</span>
                          <ChevronDown
                            className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")}
                            aria-hidden
                          />
                          {current && (
                            <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-gold" aria-hidden />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Desktop actions */}
              <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
                <CurrencyMenu onOpen={() => setOpenIdx(null)} />
                <a
                  href={whatsappChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="flex h-10 items-center gap-2 rounded-full border border-line bg-mist px-3 text-sm font-semibold text-ink transition-colors hover:bg-line/60 xl:px-4"
                >
                  <WhatsAppIcon className="size-4 text-emerald-700" />
                  <span className="hidden xl:inline">WhatsApp</span>
                </a>
                <Link
                  href="/book"
                  className="flex h-10 items-center rounded-full bg-night px-4 text-sm font-semibold text-white transition-colors hover:bg-navy-2 xl:px-5"
                >
                  <span className="hidden xl:inline">Book a visit&nbsp;</span>
                  <span className="xl:hidden">Book&nbsp;</span>
                  <span className="font-normal text-gold">· from {pilot}</span>
                </Link>
              </div>

              {/* Mobile */}
              <div className="flex items-center gap-1.5 lg:hidden">
                <Link href="/book" className="hidden h-10 items-center rounded-full bg-night px-4 text-[13px] font-semibold text-white sm:flex">
                  Book&nbsp;<span className="font-normal text-gold">· from {pilot}</span>
                </Link>
                <button
                  onClick={() => {
                    setOpenIdx(null);
                    setMobileOpen((v) => !v);
                  }}
                  className="-mr-1 grid size-11 place-items-center rounded-full text-ink hover:bg-mist"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                >
                  {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
              </div>
            </div>

            {/* Desktop mega panel: the container animates height once; content swaps in place. */}
            <AnimatePresence initial={false}>
              {active && (
                <m.div
                  key="mega"
                  id="mega-panel"
                  ref={panelRef}
                  role="region"
                  aria-label={`${active.label} menu`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                  className="hidden overflow-hidden lg:block"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={active.href}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: reduce ? 0 : 0.16 }}
                      className="grid grid-cols-[1fr_1fr_auto] gap-8 border-t border-line/70 px-7 pb-7 pt-6 xl:gap-10 xl:px-8 xl:pb-8"
                    >
                      {active.columns.map((col, ci) => (
                        <div key={col.eyebrow} className="flex flex-col gap-5">
                          <span className="w-fit rounded-full border border-line px-4 py-1.5 text-xs font-medium text-muted">
                            {col.eyebrow}
                          </span>
                          <ul className="flex flex-col gap-1">
                            {col.links.map((l) => (
                              <li key={l.label}>
                                <Link
                                  href={l.href}
                                  onClick={() => pick(l)}
                                  className="display -mx-2 flex items-center gap-2 rounded-lg px-2 py-1 text-[1.5rem] leading-tight text-ink transition-colors hover:text-gold-ink focus-visible:text-gold-ink xl:text-[1.6rem]"
                                >
                                  {l.label}
                                  {l.badge && (
                                    <span className="rounded-full bg-night px-2 py-0.5 font-sans text-[11px] font-semibold text-gold">
                                      {l.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {ci === active.columns.length - 1 && (
                            <div className="mt-auto flex flex-col gap-1 pt-4">
                              {active.footerLinks?.map((f) => (
                                <Link key={f.label} href={f.href} onClick={close} className="py-0.5 text-sm text-muted hover:text-ink">
                                  {f.label}
                                </Link>
                              ))}
                              <Link
                                href={active.href}
                                onClick={close}
                                className="group mt-1 inline-flex items-center gap-1 py-0.5 text-sm font-semibold text-gold-ink"
                              >
                                Open {active.label}{" "}
                                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                              </Link>
                            </div>
                          )}
                        </div>
                      ))}

                      <Link
                        href={active.href}
                        onClick={close}
                        tabIndex={-1}
                        aria-hidden
                        className="group relative hidden h-64 w-64 flex-col justify-end overflow-hidden rounded-2xl lg:flex xl:h-72 xl:w-80"
                      >
                        <Image
                          src={PHOTOS[active.image].src}
                          alt=""
                          fill
                          sizes="320px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="relative z-10 bg-gradient-to-t from-night/85 to-transparent p-4 pt-12">
                          <p className="display text-xl text-white">{active.caption}</p>
                        </div>
                      </Link>
                    </m.div>
                  </AnimatePresence>
                </m.div>
              )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence initial={false}>
              {mobileOpen && (
                <m.nav
                  key="mobile"
                  id="mobile-menu"
                  aria-label="Main"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain border-t border-line/70 px-4 pb-5 pt-3 sm:px-6">
                    <div className="mb-2 grid grid-cols-2 rounded-2xl bg-mist text-sm tabular-nums">
                      <p className="px-4 py-2.5">
                        <span className="block text-[11px] text-muted">Mangaluru</span>
                        {time("Asia/Kolkata")}
                      </p>
                      <p className="border-l border-line px-4 py-2.5">
                        <span className="block text-[11px] text-muted">{home.city}</span>
                        {time(home.tz)}
                      </p>
                    </div>

                    <Link href="/" onClick={close} className="display block border-b border-line/70 py-3.5 text-[1.55rem]">
                      Home
                    </Link>
                    {MENUS.map((menu, i) => {
                      const isOpen = openIdx === i;
                      return (
                        <m.div
                          key={menu.href}
                          className="border-b border-line/70"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.04 * (i + 1), ease: EASE }}
                        >
                          <button
                            onClick={() => setOpenIdx((o) => (o === i ? null : i))}
                            aria-expanded={isOpen}
                            aria-controls={`m-sub-${i}`}
                            className="flex w-full items-center justify-between py-3.5 text-left"
                          >
                            <span className={cn("display text-[1.55rem]", path === menu.href && "text-gold-ink")}>{menu.label}</span>
                            <ChevronDown className={cn("size-4 text-muted transition-transform", isOpen && "rotate-180")} aria-hidden />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <m.div
                                id={`m-sub-${i}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <ul className="mb-4 ml-1 flex flex-col border-l border-line pl-4">
                                  {menu.columns.flatMap((c) =>
                                    c.links.map((l) => (
                                      <li key={l.label}>
                                        <Link href={l.href} onClick={() => pick(l)} className="block py-1.5 text-[15px] text-muted">
                                          {l.label}
                                        </Link>
                                      </li>
                                    )),
                                  )}
                                  <li>
                                    <Link href={menu.href} onClick={close} className="block py-1.5 text-[15px] font-semibold text-gold-ink">
                                      Open {menu.label}
                                    </Link>
                                  </li>
                                </ul>
                              </m.div>
                            )}
                          </AnimatePresence>
                        </m.div>
                      );
                    })}

                    <fieldset className="mt-4">
                      <legend className="text-xs text-muted">Show prices in</legend>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => setCurrency(c.code)}
                            aria-pressed={c.code === currency}
                            aria-label={c.name}
                            className={cn(
                              "h-9 rounded-full border px-3 text-[13px] font-medium transition-colors",
                              c.code === currency ? "border-night bg-night text-white" : "border-line text-muted",
                            )}
                          >
                            {c.code}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-5 flex flex-col gap-2.5">
                      <a
                        href={whatsappChat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white"
                      >
                        <WhatsAppIcon className="size-4" /> Chat with on-ground coordinator
                      </a>
                      <Link
                        href="/book"
                        onClick={close}
                        className="flex h-12 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-night"
                      >
                        Book a visit or plan (from {pilot})
                      </Link>
                    </div>
                  </div>
                </m.nav>
              )}
            </AnimatePresence>
          </m.div>
        </div>
      </m.header>
    </>
  );
}
