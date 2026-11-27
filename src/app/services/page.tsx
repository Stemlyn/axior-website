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
    "Property care pricing for NRI owners in Mangaluru, by home size: Spot Audit from ₹1,299, Essential Care from ₹2,499/mo. Repairs at vendor cost plus 10%.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services & Pricing | AXIOR Mangaluru", description: "Property care pricing for NRI owners in Mangaluru, by home size: Spot Audit from ₹1,299, Essential Care from ₹2,499/mo. Repairs at vendor cost plus 10%.", url: "/services", images: "/opengraph-image.jpg" },
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
    title: "Utility and notice tracking",
    body: "MESCOM meter and breaker photos, society circulars and mail collected, and a heads-up before dues lapse.",
  },
  {
    title: "Photo report and video",
    body: "Timestamped photos with a flag on every point, a 2-minute narrated video and the full unedited recording, on WhatsApp within 24 hours.",
  },
  {
    title: "Secure key custody",
    body: "Coded tags with no address, a dual-custody safe, and video from unlocking the door to locking it again.",
  },
];

const EXCLUDED = [
  {
    title: "No do-it-yourself repairs",
    body: "Inspectors document faults; they never attempt electrical, plumbing or structural work themselves. Qualified vendors do.",
  },
  {
    title: "No 24/7 security or guarantees",
    body: "Visits are point-in-time inspections, not round-the-clock guarding, insurance or a warranty against natural damage.",
  },
  {
    title: "No custody of valuables",
    body: "Cash, gold, jewellery and other portable valuables must not be left in the property.",
  },
  {
    title: "No cash advances",
    body: "We never front money for utility bills, society dues or contractor work.",
  },
  {
    title: "No free errand-running",
    body: "Visits take 30 to 45 minutes on site. Waiting for deliveries or running errands is a separately billed add-on.",
  },
];

const REPAIR_STEPS = [
  { title: "Document", body: "The inspector photographs the fault, flags it red and describes it in your report." },
  { title: "Quote", body: "We get a quote from a vetted Mangaluru electrician, plumber or pest-control firm and send it on WhatsApp." },
  {
    title: "Approve and pay",
    body: "Work starts only after you reply “APPROVED” and transfer the vendor estimate plus the flat 10% fee.",
  },
  { title: "Supervise and verify", body: "We let the vendor in, check the work, and send before-and-after video with the original invoice." },
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
                The 10% rule: <em>vendor cost, plus ten.</em>
              </h2>
              <p className="mt-5 leading-relaxed text-muted">
                When a visit finds something broken, this is exactly what happens. You pay 100% of the vendor’s estimate
                plus a flat 10% for finding, supervising and checking the work. We take no commission from vendors.
              </p>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl bg-line text-sm">
                <div className="bg-white p-4">
                  <p className="text-muted">Vendor estimate</p>
                  <p className="mt-1 text-lg font-semibold">₹6,000</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-muted">Axior 10%</p>
                  <p className="mt-1 text-lg font-semibold">₹600</p>
                </div>
                <div className="bg-night p-4 text-white">
                  <p className="text-white/60">You pay</p>
                  <p className="mt-1 text-lg font-semibold text-gold">₹6,600</p>
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
