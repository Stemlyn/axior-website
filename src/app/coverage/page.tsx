import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { CtaBand, PageHeader } from "@/components/blocks";
import { FAQ } from "@/components/FAQ";
import { JsonLd, faqSchema } from "@/components/JsonLdSchema";
import { SectionHead, Slot } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mangaluru Coverage & Coastal Climate Guide",
  description:
    "Axior covers Bejai, Kadri, Falnir, Bendoorwell, Derebail, Surathkal and the rest of Mangaluru, and explains why coastal rain and salt air harm empty homes.",
  alternates: { canonical: "/coverage" },
  openGraph: { title: "Mangaluru Coverage & Coastal Climate Guide | AXIOR Mangaluru", description: "Axior covers Bejai, Kadri, Falnir, Bendoorwell, Derebail, Surathkal and the rest of Mangaluru, and explains why coastal rain and salt air harm empty homes.", url: "/coverage", images: "/opengraph-image.jpg" },
};

// TODO: have someone on the ground check these one-line descriptions before launch.
const AREAS = [
  { name: "Bejai", kind: "Central, high-rise apartments", watch: "Top-floor ceiling seepage, lift-lobby access, balcony drains" },
  { name: "Kadri", kind: "Hillside, flats and older houses", watch: "Runoff against compound walls, roof tiles, garden overgrowth" },
  { name: "Falnir", kind: "Central, dense apartment blocks", watch: "Shared-wall damp, dry bathroom traps, window seals" },
  { name: "Bendoorwell", kind: "Central, apartments", watch: "Terrace and balcony outlets, wardrobe mould, AC drain lines" },
  { name: "Derebail", kind: "Newer high-rise developments", watch: "Snagging in new buildings, wind-driven rain on upper floors" },
  { name: "Mannagudda", kind: "Residential, houses and flats", watch: "Roofs and gutters, termites in wooden frames, sump tanks" },
  { name: "Kottara", kind: "Near the highway, apartments and plots", watch: "Plot boundaries and dumping, dust ingress, window seals" },
  { name: "Surathkal", kind: "Coastal, near the beach", watch: "Salt corrosion on grills and fittings, rusting AC units, plots" },
];

const CLIMATE = [
  { city: "Mangaluru", rain: "About 3,500 mm", months: "June to September, heavy", air: "Salt-laden sea air", width: "100%" },
  { city: "Mumbai", rain: "About 2,200 mm", months: "June to September", air: "Coastal", width: "63%" },
  { city: "Bengaluru", rain: "About 1,000 mm", months: "Spread out, milder", air: "Inland, dry", width: "28%" },
];

const COVERAGE_FAQ = [
  {
    q: "Do you cover areas that are not listed?",
    a: "Yes, across Mangaluru city and nearby areas such as Ullal, Thokkottu and Mulki, subject to a visit slot. The listed neighbourhoods are where we visit most often. Send your area and building name on WhatsApp and we will confirm coverage and the earliest audit date within a day.",
  },
];

export default function CoveragePage() {
  return (
    <>
      <JsonLd data={faqSchema(COVERAGE_FAQ)} />
      <PageHeader
        photo="villa"
        position="center 35%"
        title={
          <>
            Local, <em>street by street.</em>
          </>
        }
        intro="Our inspectors live in Mangaluru. We know which buildings flood at the lift pit, which roads close in July, and why a Surathkal flat needs different care from one in Kadri."
      />

      <section id="areas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHead
          title={
            <>
              Where we <em>work.</em>
            </>
          }
          intro="What each area is like, and what we pay most attention to there."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a) => (
            <li key={a.name} className="flex flex-col rounded-[1.5rem] border border-line p-6">
              <MapPin className="size-5 text-gold-ink" strokeWidth={1.6} aria-hidden />
              <h3 className="display mt-4 text-3xl">{a.name}</h3>
              <p className="mt-1 text-sm text-muted">{a.kind}</p>
              <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed">
                <span className="font-semibold">We watch: </span>
                {a.watch.charAt(0).toLowerCase() + a.watch.slice(1)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-muted">
          Also Kodialbail, Hampankatta, Kankanady, Urwa and the rest of the city.
        </p>
      </section>

      <section id="climate" className="bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHead
            title={
              <>
                Why the coast is <em>harder</em> on empty homes.
              </>
            }
            intro="Approximate annual rainfall, long-term averages."
          />
          <div className="mt-12 space-y-6">
            {CLIMATE.map((c) => (
              <div key={c.city} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-6">
                <p className="display text-2xl">{c.city}</p>
                <div>
                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-navy" style={{ width: c.width }} />
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {c.rain}. {c.months}. {c.air}.
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Rain finds every gap",
                b: "Three times Bengaluru’s rainfall, most of it in four months. Wind drives it sideways into window frames and through hairline cracks in exposed walls and terraces.",
              },
              {
                t: "Humidity never leaves",
                b: "Even outside the monsoon, coastal humidity stays high. A sealed flat with no airflow is the ideal place for mould on wood, fabric and leather.",
              },
              {
                t: "Salt eats metal",
                b: "Close to the sea, salt in the air corrodes grills, hinges, AC condensers and electrical contacts far faster than inland. Early rust is cheap to treat; late rust means replacement.",
              },
            ].map((x) => (
              <div key={x.t}>
                <h3 className="display text-3xl">{x.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
        <Slot title="Apartment societies where Axior operates">
          A list of residential complexes where we currently look after homes and have introduced ourselves to the
          association. Add a building only once there is an active client there and the association has received our
          letter.
        </Slot>
      </section>

      <FAQ items={COVERAGE_FAQ} title={<>Is my area <em>covered?</em></>} />
      <CtaBand
        title={<>Tell us <em>where</em> your home is.</>}
        body="Pick your area and building on the booking page and we’ll confirm the earliest audit slot."
      />
    </>
  );
}
