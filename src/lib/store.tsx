"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CURRENCIES, PROPERTIES, SITE, detectLocale, type Currency, type PropertyType, type PublishedPricing } from "./site";
import type { SocialPlatform } from "./social";

/** Business details and social links published from the admin console (Settings). */
export type PublishedSite = {
  business: { name: string; legalName: string; whatsapp: string; email: string; address: string; hours: string; gstin: string; cin: string };
  socials: { id: string; platform: SocialPlatform; url: string; visible: boolean }[];
};

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  property: PropertyType;
  setProperty: (p: PropertyType) => void;
  area: string;
  setArea: (a: string) => void;
  /** The visitor's own time zone and city, for the dual clock (defaults to Dubai). */
  home: { tz: string; city: string };
  /** Prices published from the admin console, or null to use the built-in matrix. */
  published: PublishedPricing | null;
  /** Business details and social links from the admin console, or null for the built-in values. */
  siteInfo: PublishedSite | null;
};

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PREF_KEY = "axior-currency";

const SiteContext = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [home, setHome] = useState({ tz: "Asia/Dubai", city: "Dubai" });
  const [published, setPublished] = useState<PublishedPricing | null>(null);
  const [siteInfo, setSiteInfo] = useState<PublishedSite | null>(null);

  // Prices and site settings published from the admin console. With Supabase configured they come
  // from the database; otherwise from the local bridge (/api/published, demo mode on one machine).
  // Re-checked when the tab regains focus, so admin changes show up without a reload.
  // Any failure falls back silently to the built-in values.
  useEffect(() => {
    let ctrl = new AbortController();
    const apply = (pricing: unknown, site: unknown) => {
      const p = pricing as PublishedPricing | undefined;
      if (p?.matrix && p?.fx && p?.promos) setPublished(p);
      const st = site as PublishedSite | undefined;
      if (st?.business && Array.isArray(st.socials)) setSiteInfo(st);
    };
    const load = () => {
      ctrl.abort();
      ctrl = new AbortController();
      const req =
        SUPA_URL && SUPA_KEY
          ? fetch(`${SUPA_URL}/rest/v1/admin_kv?key=in.(pricing,site)&select=key,value`, {
              headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
              signal: ctrl.signal,
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((rows: { key: string; value: unknown }[] | null) =>
                apply(rows?.find((r) => r.key === "pricing")?.value, rows?.find((r) => r.key === "site")?.value),
              )
          : fetch("/api/published", { cache: "no-store", signal: ctrl.signal })
              .then((r) => (r.ok ? r.json() : null))
              .then((d: { pricing?: unknown; site?: unknown } | null) => apply(d?.pricing, d?.site));
      req.catch(() => {});
    };
    load();
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", load);
    return () => {
      ctrl.abort();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", load);
    };
  }, []);

  // After mount: use the visitor's saved choice, else detect from their time zone / language.
  // (Done after hydration so the server-rendered INR markup matches the first client render.)
  useEffect(() => {
    const t = setTimeout(() => {
      const d = detectLocale();
      setHome({ tz: d.tz, city: d.city });
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(PREF_KEY);
      } catch {}
      const valid = CURRENCIES.some((c) => c.code === saved);
      setCurrencyState(valid ? (saved as Currency) : d.currency);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(PREF_KEY, c);
    } catch {}
  }, []);
  const [property, setProperty] = useState<PropertyType>("apartment");
  const [area, setArea] = useState("Bejai");
  return (
    <SiteContext.Provider value={{ currency, setCurrency, property, setProperty, area, setArea, home, published, siteInfo }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}

export function whatsappLink(
  property: PropertyType,
  area: string,
  extra?: { building?: string; keys?: string },
  number: string = SITE.whatsapp,
) {
  const label = PROPERTIES.find((p) => p.id === property)?.label ?? "property";
  let msg = `Hi Axior team, I own a ${label} in ${area}, Mangalore and would like to book a Founding Pilot Audit.`;
  if (extra?.building) msg += ` Building: ${extra.building}.`;
  if (extra?.keys) msg += ` Keys: ${extra.keys}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

/** The WhatsApp number to use: the one saved in admin Settings, else the built-in placeholder. */
export function useWhatsappNumber() {
  const { siteInfo } = useSite();
  return siteInfo?.business.whatsapp || SITE.whatsapp;
}

/** WhatsApp URL for a plain chat, no booking text. */
export function useWhatsappChat() {
  return `https://wa.me/${useWhatsappNumber()}`;
}

/** Hook returning the WhatsApp booking URL for the visitor's current selections. */
export function useWhatsappLink() {
  const { property, area } = useSite();
  return whatsappLink(property, area, undefined, useWhatsappNumber());
}
