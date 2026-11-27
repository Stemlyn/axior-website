import type { Metadata } from "next";
import { Check, Scale, X } from "lucide-react";
import { CtaBand, PageHeader, StaggerItem, StaggerList } from "@/components/blocks";
import { FAQ } from "@/components/FAQ";
import { JsonLd, faqSchema } from "@/components/JsonLdSchema";
import { ComparisonTable, PricingSection } from "@/components/PricingSection";
import { SectionHead } from "@/components/ui";
import { FAQS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Property care pricing for NRI owners in Mangaluru, by home size: Spot Audit from ₹1,299, Essential Care from ₹2,499/mo. Repairs paid upfront at vendor cost.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services & Pricing | AXIOR Mangaluru", description: "Property care pricing for NRI owners in Mangaluru, by home size: Spot Audit from ₹1,299, Essential Care from ₹2,499/mo. Repairs paid upfront at vendor cost.", url: "/services", images: "/opengraph-image.jpg" },
};

const INCLUDED = [
  {
    title: "30-point visual and structural inspection",
    body: "Room by room: active seepage, efflorescence, window seal leaks, ceiling damp, lock integrity and termite trails.",
  },
  {
    title: "Air and moisture flush",
    body: "Windows and balcony doors opened for 20 to 45 minutes to clear stagnant coastal air and trapped humidity.",
  },
  {
    title: "Plumbing seal cycle",
    body: "Every tap and shower run and every toilet flushed to refill dry traps, stop sewer gas and spot slow drips.",
  },
  {
    title: "Electrical, meter and pest check",
    body: "MESCOM meter photo, main breaker board, inverter battery level, and a scan for termite mud trails and rodent entry points.",
  },
  {
    title: "Condition dossier and video",
    body: "Within 4 hours: a sealed PDF dossier, timestamped in IST and Gulf time, room by room in green, amber or red, plus a 2-minute narrated video and the full recording.",
  },
  {
    title: "Secure key custody",
    body: "Serialised tags with no address in a dual-custody lockbox, and video from unlocking the door to locking it again.",
  },
];

const EXCLUDED = [
  {
    title: "No in-house repairs",
    body: "Inspectors document and photograph faults; they never do plumbing, electrical or structural work themselves. Vetted vendors do.",
  },
  {
    title: "No 24/7 security or structural warranty",
    body: "Visits are scheduled point-in-time audits. We are not a security force, an alarm centre or a home insurer.",
  },
  {
    title: "No storage of valuables",
    body: "Under our No-Valuables Agreement, cash, jewellery, gold and other high-value portable items must not be left in the home.",
  },
  {
    title: "No cash advances",
    body: "We never front money for property tax, MESCOM bills, society dues or contractor charges.",
  },
  {
    title: "No free errand-running",
    body: "Visits are capped at 30 to 45 minutes on site. Waiting for deliveries or running errands is a concierge add-on at ₹299 to ₹499 an hour.",
  },
];

const REPAIR_STEPS = [
  { title: "Document", body: "Close-up photos and unbroken video of the fault, tagged red (urgent) or amber (monitor), with no guesswork." },
  { title: "Quote", body: "An itemised estimate from a vetted Mangaluru electrician, plumber or pest-control partner, sent on WhatsApp." },
  {
    title: "Approve and pay upfront",
    body: "Work starts only after you reply “APPROVED” and transfer 100% of the vendor estimate by UPI or bank transfer.",
  },
  { title: "Supervise and verify", body: "We supervise the vendor on site, check the work, and send before-and-after video with the original invoice." },
];

const SERVICE_FAQS = [
  FAQS[1],
  FAQS[2],
  {
    q: "Do I have to sign a long contract?",
    a: "No. Start with the founding pilot audit and read the report. If you then choose Essential Care or Monsoon VIP Shield, the pilot fee is credited in full to your first month. Monthly plans can be stopped with one month's notice on WhatsApp, and we return your keys the same week.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqSchema(SERVICE_FAQS)} />
      <PageHeader
        photo="interior"
        title={
          <>
            Priced for the home <em>you actually own.</em>
          </>
        }
        intro="Three plans priced by the size of your home, with every inclusion and exclusion listed, and repair billing you can audit line by line."
      />
      <PricingSection />

      <section id="scope" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
        <SectionHead
          title={
            <>
              What we do, and <em>what we don’t.</em>
            </>
          }
          intro="A clear line between oversight, which your plan covers, and vendor work, which you approve and pay for separately."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] bg-mist p-7 sm:p-9">
            <h3 className="display text-3xl">Included in every visit</h3>
            <ul className="mt-6 space-y-5">
              {INCLUDED.map((i) => (
                <li key={i.title} className="flex gap-4">
                  <Check className="mt-1 size-5 shrink-0 text-ok" strokeWidth={2.5} aria-hidden />
                  <div>
                    <p className="font-semibold">{i.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{i.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="dark grain relative overflow-hidden rounded-[2rem] bg-night p-7 text-white sm:p-9">
            <h3 className="display text-3xl">What we don’t do</h3>
            <ul className="mt-6 space-y-5">
              {EXCLUDED.map((i) => (
                <li key={i.title} className="flex gap-4">
                  <X className="mt-1 size-5 shrink-0 text-gold" strokeWidth={2.5} aria-hidden />
                  <div>
                    <p className="font-semibold">{i.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{i.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="repairs" className="bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <Scale className="size-10 text-gold-ink" strokeWidth={1.3} aria-hidden />
              <h2 className="display mt-6 text-4xl sm:text-5xl">
                Repairs paid upfront, <em>never from our pocket.</em>
              </h2>
              <p className="mt-5 leading-relaxed text-muted">
                When a visit finds something broken, this is exactly what happens. You approve the quote and transfer 100%
                of the vendor’s estimate before work starts. Supervising the vendor’s visit is a flat standby fee; one
                standby visit a month is included with Monsoon VIP Shield.
              </p>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl bg-line text-sm">
                <div className="bg-white p-4">
                  <p className="text-muted">Vendor estimate</p>
                  <p className="mt-1 text-lg font-semibold">₹6,000</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-muted">Paid upfront</p>
                  <p className="mt-1 text-lg font-semibold">100%</p>
                </div>
                <div className="bg-night p-4 text-white">
                  <p className="text-white/60">Our cash float</p>
                  <p className="mt-1 text-lg font-semibold text-gold">₹0</p>
                </div>
              </div>
            </div>
            <StaggerList as="ol" className="grid gap-4 sm:grid-cols-2">
              {REPAIR_STEPS.map((step, i) => (
                <StaggerItem as="li" key={step.title} className="rounded-[1.5rem] bg-white p-6 ring-1 ring-line">
                  <span className="display text-4xl text-gold-ink">{i + 1}</span>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </StaggerItem>
              ))}
            </StaggerList>
          </div>
        </div>
      </section>

      <ComparisonTable />
      <FAQ items={SERVICE_FAQS} title={<>Questions about <em>billing.</em></>} />
      <CtaBand
        title={<>Start with <em>one</em> audit.</>}
        body="Book the founding pilot audit, read the report, then decide whether a monthly plan is worth it."
      />
    </>
  );
}
