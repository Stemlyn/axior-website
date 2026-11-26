// Single source of truth for brand facts, prices and copy used across the site
// and in the JSON-LD schema. Edit here, not in components.

export const SITE = {
  name: "AXIOR",
  legalName: "Axior Asset Care & Property Oversight",
  tagline: "Asset Care & Property Oversight",
  url: "https://axior.in", // TODO: replace with the live domain
  // TODO: replace with the real WhatsApp Business number (country code + number, digits only)
  whatsapp: "91XXXXXXXXXX",
  email: "care@axior.in", // TODO: replace
  city: "Mangaluru",
  region: "Karnataka",
  country: "IN",
  geo: { lat: 12.8698, lng: 74.8431 },
} as const;

export type Currency = "INR" | "AED" | "SAR" | "QAR" | "KWD" | "OMR" | "BHD" | "USD" | "GBP";

export const CURRENCIES: { code: Currency; label: string; name: string; place: string }[] = [
  { code: "INR", label: "INR", name: "Indian rupee", place: "India" },
  { code: "AED", label: "AED", name: "UAE dirham", place: "UAE" },
  { code: "SAR", label: "SAR", name: "Saudi riyal", place: "Saudi Arabia" },
  { code: "QAR", label: "QAR", name: "Qatari riyal", place: "Qatar" },
  { code: "KWD", label: "KWD", name: "Kuwaiti dinar", place: "Kuwait" },
  { code: "OMR", label: "OMR", name: "Omani rial", place: "Oman" },
  { code: "BHD", label: "BHD", name: "Bahraini dinar", place: "Bahrain" },
  { code: "USD", label: "USD", name: "US dollar", place: "Elsewhere" },
  { code: "GBP", label: "GBP", name: "British pound", place: "United Kingdom" },
];

export type PropertyType = "apartment" | "large-flat" | "villa" | "plot";

// Size-calibrated price matrix (the "locked pricing matrix"). Billing is in INR.
// AED and USD are the fixed reference figures from the rate card; the other Gulf and UK figures
// are derived from INR at roughly: SAR ₹22.9, QAR ₹23.3, KWD ₹274, OMR ₹218, BHD ₹223, GBP ₹107.
export type PriceKey = "pilot" | "spot" | "essential" | "vip";
type Ref = { INR: number; AED: number; USD: number };
const MATRIX: Record<PropertyType, Record<PriceKey, Ref>> = {
  apartment: {
    pilot: { INR: 799, AED: 35, USD: 10 },
    spot: { INR: 1299, AED: 58, USD: 16 },
    essential: { INR: 2499, AED: 110, USD: 30 },
    vip: { INR: 4499, AED: 200, USD: 54 },
  },
  "large-flat": {
    pilot: { INR: 799, AED: 35, USD: 10 },
    spot: { INR: 1699, AED: 75, USD: 20 },
    essential: { INR: 3199, AED: 140, USD: 38 },
    vip: { INR: 5799, AED: 255, USD: 69 },
  },
  villa: {
    pilot: { INR: 999, AED: 44, USD: 12 },
    spot: { INR: 2299, AED: 102, USD: 28 },
    essential: { INR: 4299, AED: 190, USD: 52 },
    vip: { INR: 7499, AED: 330, USD: 89 },
  },
  plot: {
    pilot: { INR: 799, AED: 35, USD: 10 },
    spot: { INR: 1299, AED: 58, USD: 16 },
    essential: { INR: 1499, AED: 66, USD: 18 },
    vip: { INR: 2499, AED: 110, USD: 30 },
  },
};

const PER_INR: Record<"SAR" | "QAR" | "KWD" | "OMR" | "BHD" | "GBP", { rate: number; step: number }> = {
  SAR: { rate: 22.9, step: 1 },
  QAR: { rate: 23.3, step: 1 },
  KWD: { rate: 274, step: 0.1 },
  OMR: { rate: 218, step: 0.1 },
  BHD: { rate: 223, step: 0.1 },
  GBP: { rate: 107, step: 0.5 },
};

/**
 * Prices published from the admin console (Supabase `admin_kv.pricing`). When present they replace
 * the built-in matrix: INR comes from `matrix`, every other currency from INR x `fx` multiplier.
 */
export type PublishedPricing = {
  matrix: Record<PropertyType, Record<PriceKey, number>>;
  fx: Record<Exclude<Currency, "INR">, number>;
  promos: { foundingPilot: boolean; pilotCredit: boolean };
};

const STEP: Record<Exclude<Currency, "INR">, number> = { AED: 1, USD: 1, SAR: 1, QAR: 1, KWD: 0.1, OMR: 0.1, BHD: 0.1, GBP: 0.5 };

export function priceValue(
  key: PriceKey,
  currency: Currency,
  property: PropertyType = "apartment",
  published?: PublishedPricing | null,
): number {
  if (published) {
    // With the founding pilot offer switched off, the first audit costs the normal Spot Audit price.
    const k = key === "pilot" && !published.promos.foundingPilot ? "spot" : key;
    const inr = published.matrix[property][k];
    if (currency === "INR") return inr;
    const step = STEP[currency];
    return Math.round((inr * published.fx[currency]) / step) * step;
  }
  const ref = MATRIX[property][key];
  if (currency === "INR" || currency === "AED" || currency === "USD") return ref[currency];
  const { rate, step } = PER_INR[currency];
  return Math.round(ref.INR / rate / step) * step;
}

/** INR prices for one property type (used by the schema and the comparison copy). */
export function inrPrices(property: PropertyType = "apartment") {
  return Object.fromEntries(Object.entries(MATRIX[property]).map(([k, v]) => [k, v.INR])) as Record<PriceKey, number>;
}
export const PRICE_RANGE_INR = { min: 799, max: 7499 };

const SYMBOL: Partial<Record<Currency, string>> = { INR: "₹", USD: "$", GBP: "£" };
const DECIMAL = new Set<Currency>(["KWD", "OMR", "BHD", "GBP"]);

export function formatPrice(
  key: PriceKey,
  currency: Currency,
  property: PropertyType = "apartment",
  published?: PublishedPricing | null,
) {
  const value = priceValue(key, currency, property, published);
  const num = value.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
    minimumFractionDigits: DECIMAL.has(currency) && !Number.isInteger(value) ? 1 : 0,
    maximumFractionDigits: 1,
  });
  const sym = SYMBOL[currency];
  return sym ? `${sym}${num}` : `${currency} ${num}`;
}

/** Visitor's likely currency and home city, from the browser's time zone (then language region). */
export function detectLocale(): { currency: Currency; tz: string; city: string } {
  const fallback = { currency: "USD" as Currency, tz: "Asia/Dubai", city: "Dubai" };
  if (typeof Intl === "undefined") return fallback;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const byZone: Record<string, [Currency, string]> = {
    "Asia/Kolkata": ["INR", "India"],
    "Asia/Calcutta": ["INR", "India"],
    "Asia/Dubai": ["AED", "Dubai"],
    "Asia/Riyadh": ["SAR", "Riyadh"],
    "Asia/Qatar": ["QAR", "Doha"],
    "Asia/Kuwait": ["KWD", "Kuwait"],
    "Asia/Muscat": ["OMR", "Muscat"],
    "Asia/Bahrain": ["BHD", "Bahrain"],
    "Europe/London": ["GBP", "London"],
  };
  if (byZone[tz]) {
    const [currency, city] = byZone[tz];
    // An India-based visitor still sees a Gulf clock, since that is where most owners live.
    return currency === "INR" ? { ...fallback, currency } : { currency, tz, city };
  }
  const region = (typeof navigator !== "undefined" ? navigator.language : "").split("-")[1]?.toUpperCase();
  const byRegion: Record<string, Currency> = {
    IN: "INR", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", OM: "OMR", BH: "BHD", GB: "GBP",
  };
  if (region && byRegion[region]) return { ...fallback, currency: byRegion[region] };
  const city = tz.split("/").pop()?.replace(/_/g, " ") || fallback.city;
  return { currency: "USD", tz: tz || fallback.tz, city };
}

export const PROPERTIES: {
  id: PropertyType;
  label: string;
  short: string;
  recommended: PriceKey;
  frequency: string;
  monsoon: string;
  focus: string[];
}[] = [
  {
    id: "apartment",
    label: "1BHK / 2BHK apartment",
    short: "1–2BHK apartment",
    recommended: "essential",
    frequency: "2 visits a month",
    monsoon: "Weekly from June to September if the flat is on a top floor",
    focus: ["Dry P-traps and sewer smell", "Window silicone seals", "Wardrobe fungus"],
  },
  {
    id: "large-flat",
    label: "3BHK+ flat / penthouse",
    short: "3BHK+ flat",
    recommended: "essential",
    frequency: "2 visits a month",
    monsoon: "Weekly from June to September (move to Monsoon VIP Shield)",
    focus: ["Terrace and balcony outlets", "Split AC drain lines", "Ceiling dampness by room"],
  },
  {
    id: "villa",
    label: "Independent villa",
    short: "villa",
    recommended: "vip",
    frequency: "Weekly, all year",
    monsoon: "Weekly plus a check within 24 hours of a heavy-rain alert",
    focus: ["Roof tiles and gutters", "Sump and overhead tank", "Compound wall and gate"],
  },
  {
    id: "plot",
    label: "Vacant plot",
    short: "plot",
    recommended: "essential",
    frequency: "1 visit a month (2 on Monsoon VIP Shield)",
    monsoon: "Extra visit after heavy rain to check water-logging",
    focus: ["Boundary stones and fencing", "Encroachment and dumping", "Overgrowth and water-logging"],
  },
];

export const AREAS = [
  "Bejai",
  "Kadri",
  "Falnir",
  "Bendoorwell",
  "Kodialbail",
  "Hampankatta",
  "Kankanady",
  "Urwa",
  "Derebail",
  "Surathkal",
  "Elsewhere in Mangaluru",
];

export const TIERS: {
  key: PriceKey;
  name: string;
  cadence: string;
  per: string;
  summary: string;
  includes: string[];
}[] = [
  {
    key: "spot",
    name: "Spot Audit",
    cadence: "One visit",
    per: "",
    summary: "A full 30-point inspection before you renew a lease, sell, or fly home.",
    includes: [
      "30-point inspection across all four pillars",
      "Timestamped photo report on WhatsApp within 24 hours",
      "2-minute narrated video plus the full visit recording",
      "Green, amber and red flag for every point",
      "Repair estimates for anything flagged red",
    ],
  },
  {
    key: "essential",
    name: "Essential Care",
    cadence: "2 visits a month",
    per: "/mo",
    summary: "Bi-weekly home-watch for locked flats and plots, all year.",
    includes: [
      "Everything in Spot Audit, every visit",
      "Drain flush and P-trap refill to stop sewer gas",
      "Cross-ventilation and humidity reading",
      "Narrated summary and full entry-to-exit recording, every visit",
      "Bills, flyers and door notices cleared",
    ],
  },
  {
    key: "vip",
    name: "Monsoon VIP Shield",
    cadence: "Weekly, 4 visits a month",
    per: "/mo",
    summary: "For villas and top-floor flats through the Mangaluru monsoon.",
    includes: [
      "Everything in Essential Care",
      "Weekly visits from June to September",
      "Check within 24 hours of a heavy-rain alert",
      "Moisture-meter readings on walls and ceilings",
      "Priority dispatch of your approved vendors",
    ],
  },
];

export type Severity = "green" | "amber" | "red";

export const PILLARS: {
  id: string;
  name: string;
  why: string;
  points: { label: string; status: Severity; note: string }[];
  photos: { photo: PhotoKey; caption: string; status: Severity; time: string }[];
}[] = [
  {
    id: "seepage",
    name: "Monsoon & structural seepage",
    why: "Mangaluru gets over 3,500 mm of rain a year. A small damp patch in July is a replastering job by October.",
    points: [
      { label: "Ceiling dampness, every room", status: "amber", note: "Faint ring above master bath, 14% moisture" },
      { label: "Window silicone seals", status: "red", note: "Seal cracked on west bedroom window, water tracking inside" },
      { label: "External wall hairline cracks", status: "green", note: "No change since last visit" },
      { label: "Balcony and terrace outlets", status: "green", note: "Clear, water drains in under 10 seconds" },
      { label: "Skirting and lower-wall damp", status: "green", note: "Dry" },
      { label: "Paint blistering and efflorescence", status: "amber", note: "Salt bloom near kitchen window, monitoring" },
      { label: "Door frames swelling", status: "green", note: "All doors close and lock freely" },
      { label: "Overhead tank and roof slab", status: "green", note: "No pooling on slab" },
    ],
    photos: [
      { photo: "window", caption: "West bedroom window seal", status: "red", time: "10:42 IST" },
      { photo: "meter", caption: "Master bath ceiling", status: "amber", time: "10:47 IST" },
      { photo: "villa", caption: "Balcony outlet flow test", status: "green", time: "10:55 IST" },
    ],
  },
  {
    id: "air",
    name: "Air quality & humidity flush",
    why: "A closed flat in monsoon sits above 85% humidity. Leather, wood and mattresses grow mould within weeks.",
    points: [
      { label: "Air and moisture flush, 45 minutes", status: "green", note: "All windows and balcony doors opened, fans run" },
      { label: "Indoor humidity reading", status: "amber", note: "78% at entry, 66% after flush" },
      { label: "Wardrobe and loft fungus", status: "amber", note: "Spotting inside guest-room wardrobe door" },
      { label: "Mattress and upholstery check", status: "green", note: "Dry, no odour" },
      { label: "Kitchen cabinets and chimney", status: "green", note: "Clean, no residue" },
      { label: "Musty or sewer odour", status: "green", note: "None detected" },
      { label: "Silica and moisture absorbers", status: "green", note: "Replaced in 3 wardrobes" },
    ],
    photos: [
      { photo: "meter", caption: "Hygrometer at entry", status: "amber", time: "10:31 IST" },
      { photo: "interior", caption: "Guest wardrobe door", status: "amber", time: "10:38 IST" },
      { photo: "window", caption: "Hygrometer after flush", status: "green", time: "11:16 IST" },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing & drain seal cycle",
    why: "Unused drains dry out, the water seal in the P-trap disappears and sewer gas, cockroaches and smell come up.",
    points: [
      { label: "P-trap refill, all drains", status: "green", note: "6 floor traps and 4 basins refilled" },
      { label: "Toilet flush test", status: "green", note: "Both cisterns refill and stop cleanly" },
      { label: "Taps and angle valves for drips", status: "amber", note: "Slow drip at kitchen tap, mains closed" },
      { label: "Geyser and inlet valve", status: "green", note: "Isolated at breaker, no leak" },
      { label: "Under-sink leaks", status: "green", note: "Dry" },
      { label: "Main water valve", status: "green", note: "Closed on exit" },
      { label: "Washing machine inlet and outlet", status: "green", note: "Hoses dry, inlet closed" },
      { label: "Sump or tank level (villas)", status: "green", note: "Not applicable" },
    ],
    photos: [
      { photo: "interior", caption: "Bathroom floor trap refill", status: "green", time: "10:58 IST" },
      { photo: "window", caption: "Kitchen tap drip", status: "amber", time: "11:03 IST" },
      { photo: "keys", caption: "Main valve closed", status: "green", time: "11:21 IST" },
    ],
  },
  {
    id: "electrical",
    name: "Electrical, safety & pest check",
    why: "Damp plus idle wiring means tripped breakers, a dead fridge, and termites that are only noticed when a door frame gives.",
    points: [
      { label: "MCB board and breaker trips", status: "green", note: "ELCB trip test passed" },
      { label: "Fridge and essential circuits", status: "green", note: "Fridge running, 4°C" },
      { label: "Termite mud tubes", status: "red", note: "Fresh tubes on wardrobe base, pest control needed" },
      { label: "Rodent and cockroach signs", status: "green", note: "None" },
      { label: "Door locks and grills", status: "green", note: "Secure" },
      { label: "Meter reading logged", status: "green", note: "EB meter 18,442 units" },
      { label: "Lights and fans spot test", status: "green", note: "All working" },
    ],
    photos: [
      { photo: "interior", caption: "Wardrobe base, termite tubes", status: "red", time: "11:09 IST" },
      { photo: "meter", caption: "MCB distribution board", status: "green", time: "11:12 IST" },
      { photo: "meter", caption: "MESCOM meter reading", status: "green", time: "11:24 IST" },
    ],
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Who holds my keys, and how are they kept safe?",
    a: "Your keys get a serial-numbered tag with no name or address on it. The tag-to-property list is kept separately from the keys, which stay in a locked key safe. Every time a key leaves the safe it is logged, and each visit is filmed from the moment we unlock until we lock up.",
  },
  {
    q: "How are repairs billed if something is flagged red?",
    a: "Nothing is fixed without your written approval. We photograph the fault and send a vetted local vendor's quote on WhatsApp. Work starts once you reply APPROVED and transfer the estimate plus a flat 10% coordination fee. We supervise the job and send before-and-after video with the vendor's original invoice.",
  },
  {
    q: "Is Axior better suited to a flat or a villa?",
    a: "Both. A 1BHK or 2BHK flat usually needs Essential Care, two visits a month. A 3BHK or penthouse adds terrace drains and more rooms to ventilate. A villa has a roof, sump, garden and compound wall, so we recommend weekly Monsoon VIP Shield visits, at least from June to September.",
  },
  {
    q: "What happens if you find seepage during the monsoon?",
    a: "You get a red flag on WhatsApp the same day, with photos and a moisture reading. We take immediate steps that need no spending, like moving furniture and cutting power to a wet circuit, then send a vendor quote for the repair so you can decide while you are still in Dubai or Doha.",
  },
  {
    q: "What do I receive after each visit?",
    a: "A WhatsApp report within 24 hours: all 30 points marked green, amber or red, timestamped photos of anything flagged, humidity and meter readings, a 2-minute narrated video walkthrough, and a link to the full unedited recording of the visit. Times are shown in IST and your Gulf time zone.",
  },
];

// Brand photography (AI-generated, illustrative; not real client homes). Files live in /public/photos.
export const PHOTOS = {
  villa: { src: "/photos/villa.jpg", alt: "A tiled-roof villa in coastal Karnataka after monsoon rain", w: 1600, h: 2000 },
  interior: { src: "/photos/interior.jpg", alt: "A locked apartment with furniture under dust sheets while rain falls outside", w: 2000, h: 1131 },
  meter: { src: "/photos/meter.jpg", alt: "An inspector measuring wall moisture beside a window", w: 1600, h: 2000 },
  keys: { src: "/photos/keys.jpg", alt: "House keys with coded brass tags inside a steel key safe", w: 2000, h: 2000 },
  window: { src: "/photos/window.jpg", alt: "Monsoon rain on a window frame with a cracked silicone seal", w: 1600, h: 2000 },
} as const;
export type PhotoKey = keyof typeof PHOTOS;
