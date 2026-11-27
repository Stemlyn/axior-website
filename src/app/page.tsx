import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { CtaBand, ParallaxShot, ReportCard, Reveal } from "@/components/blocks";
import { FAQ } from "@/components/FAQ";
import { JsonLd, faqSchema } from "@/components/JsonLdSchema";
import { Shot } from "@/components/Photo";
import { Slot, btn, cn } from "@/components/ui";
import { FAQS } from "@/lib/site";
import { LatestPosts } from "@/components/LatestPosts";

const PROOF_BAR = [
  { figure: "30", unit: "checks", text: "on every visit, in four areas" },
  { figure: "24", unit: "hours", text: "to a photo report on WhatsApp" },
  { figure: "100%", unit: "filmed", text: "entry to exit, no edits" },
  { figure: "+10%", unit: "flat", text: "on repairs, at vendor cost" },
];

const STEPS = [
  { title: "Message us on WhatsApp", body: "Property type and area. We reply with a slot that suits your time zone." },
  { title: "Hand over the keys", body: "Tagged with a code, never an address, and logged into a dual-custody safe." },
  { title: "We inspect and film", body: "Thirty checks across seepage, air, plumbing and electrical." },
  { title: "You read the report", body: "Flags, photos, readings and a 2-minute narrated video within 24 hours, plus the full recording." },
];

const CUSTODY = [
  { code: "01", title: "Coded tags, no addresses", body: "A lost key ring opens nothing." },
  { code: "02", title: "Dual-custody safe", body: "Two staff are needed to remove a key." },
  { code: "03", title: "Every movement logged", body: "Who, when, which visit. Yours on request." },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <HomeHero />

      {/* Proof bar */}
      <section className="dark border-t border-white/[0.07] bg-night text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PROOF_BAR.map((p, i) => (
            <div
              key={p.unit}
              className={cn(
                "py-8 pr-4 lg:py-10",
                i % 2 === 1 && "border-l border-white/[0.07] pl-5 lg:pl-8",
                i >= 2 && "border-t border-white/[0.07] lg:border-t-0",
                i === 2 && "lg:border-l lg:pl-8",
              )}
            >
              <p className="flex items-baseline gap-2">
                <span className="display text-4xl text-gold sm:text-5xl">{p.figure}</span>
                <span className="text-sm text-white/70">{p.unit}</span>
              </p>
              <p className="mt-2 text-sm text-white/50">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative">
          <ParallaxShot
            k="interior"
            className="aspect-[4/5] rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]"
            position="40% center"
          />
          <p className="kicker mt-4">A locked flat in the monsoon. Every surface waiting to be checked.</p>
        </Reveal>
        <div>
          <h2 className="display text-5xl sm:text-6xl">
            You live abroad. <em>We live nearby.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Axior is a Mangaluru team that looks after homes whose owners work in Dubai, Doha, Riyadh and beyond. Fixed
            schedule, the same 30 checks every time, every visit filmed, and a plain report of what we found.
          </p>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 py-5">
                <span className="display text-3xl text-gold-ink">{i + 1}</span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cost of inaction: bento */}
      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="display max-w-2xl text-5xl sm:text-6xl">
              What a locked year <em>costs</em> on the coast.
            </h2>
            <p className="max-w-sm leading-relaxed text-muted">
              Mangaluru is harder on an empty home than Bengaluru or Mumbai. These are the four things we find most.
            </p>
          </div>
          <div className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-4">
            <Reveal className="dark relative isolate overflow-hidden rounded-[1.75rem] text-white md:col-span-2 md:row-span-2">
              <Shot k="window" className="absolute inset-0 -z-10" sizes="(min-width: 768px) 50vw, 100vw" />
              <div className="scrim-bottom absolute inset-0 -z-10" />
              <div className="flex h-full min-h-[420px] flex-col justify-end p-7 sm:p-9">
                <p className="display text-7xl text-white sm:text-8xl">3,500 mm</p>
                <p className="mt-3 max-w-sm leading-relaxed text-white/80">
                  of rain a year, most of it June to September. Every cracked seal and hairline gap gets tested.
                </p>
              </div>
            </Reveal>
            <div className="dark relative isolate overflow-hidden rounded-[1.75rem] text-white md:col-span-2">
              <Shot
                k="meter"
                className="absolute inset-0 -z-10"
                position="center 60%"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="scrim-left absolute inset-0 -z-10" />
              <div className="flex h-full flex-col justify-end p-7">
                <p className="display text-6xl text-white">85%+</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                  humidity in a closed flat in monsoon. Wardrobes and mattresses grow mould within weeks.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-[1.75rem] bg-white p-7 ring-1 ring-line">
              <p className="display text-5xl">Weeks</p>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                for an unused drain trap to dry out and let sewer gas and cockroaches up.
              </p>
            </div>
            <div className="dark grain relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-navy p-7 text-white">
              <p className="display text-5xl text-gold">Silent</p>
              <p className="mt-6 text-sm leading-relaxed text-white/70">
                termite tubes climb wooden frames. Most owners notice when a door gives.
              </p>
            </div>
          </div>
          <Link
            href="/coverage"
            className="group mt-10 inline-flex min-h-11 items-center gap-2 font-semibold text-gold-ink"
          >
            Read the coastal climate guide <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <h2 className="display max-w-2xl text-5xl sm:text-6xl">
          One firm, <em>three ways</em> to help.
        </h2>
        <div className="mt-14 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Link
            href="/services"
            className="group dark relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[2rem] p-8 text-white sm:p-10"
          >
            <Shot
              k="villa"
              className="absolute inset-0 -z-10"
              imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              position="center 40%"
            />
            <div className="scrim-bottom absolute inset-0 -z-10" />
            <span className="mb-auto self-start rounded-full bg-emerald/90 px-3 py-1 text-xs font-semibold">
              Available now
            </span>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h3 className="display text-5xl">Asset Watch</h3>
                <p className="mt-3 max-w-md leading-relaxed text-white/80">
                  Scheduled inspections, 30-point audits and monsoon protection for locked flats, villas and plots.
                </p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-night transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
          </Link>
          <div className="grid gap-4">
            {[
              {
                name: "Tenancy Living",
                body: "Tenant screening, rent follow-up, and move-in and move-out audits, for owners who would rather the home were lived in.",
              },
              {
                name: "Realty Advisory",
                body: "Condition reports and on-ground support when you decide to sell, renovate or buy in Mangaluru.",
              },
            ].map((s) => (
              <div key={s.name} className="flex flex-col rounded-[2rem] bg-mist p-8">
                <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted ring-1 ring-line">
                  Coming soon
                </span>
                <h3 className="display mt-auto pt-10 text-4xl">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="dark grain relative overflow-hidden bg-night py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="display text-5xl sm:text-6xl">
              Proof, <em>every visit.</em>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              This is what lands on your phone after each inspection. Nothing to take on trust.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Every point flagged green, amber or red",
                "Timestamped photos of anything off",
                "Humidity and moisture readings",
                "Times in IST and your Gulf time",
                "A 2-minute narrated video walkthrough",
                "The full, unedited visit recording",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-white/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/audit" className={cn(btn.base, btn.gold, "mt-10")}>
              Inspect the full 30-point standard
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-md pb-40 lg:max-w-none lg:pb-24">
            <ParallaxShot k="meter" className="aspect-[4/5] w-[80%] rounded-[2rem] opacity-90" />
            <Reveal className="absolute bottom-0 right-0 w-[70%] min-w-[290px]">
              <ReportCard className="ml-auto" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key custody */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="order-2 lg:order-1">
          <h2 className="display text-5xl sm:text-6xl">
            Your keys, <em>accounted for.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            You are handing a home worth crores to people you have not met. So custody is engineered, not promised.
          </p>
          <ul className="mt-10 space-y-6">
            {CUSTODY.map((c) => (
              <li key={c.code} className="flex gap-5">
                <span className="h-fit rounded-md bg-night px-2 py-1 font-mono text-xs text-gold">AX-{c.code}</span>
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/trust" className={cn(btn.base, btn.dark, "mt-10")}>
            Read the full security protocol
          </Link>
        </div>
        <Reveal className="order-1 lg:order-2">
          <ParallaxShot k="keys" className="aspect-square rounded-[2rem]" />
        </Reveal>
      </section>

      {/* Proof slots */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Slot title="Owner feedback from the Gulf">
            Two or three short quotes from pilot clients, with first name, city abroad and area (for example “Priya,
            Dubai, 2BHK in Kadri”). Only with written permission.
          </Slot>
          <Slot title="RWA and society clearances">
            Associations that have received our introduction letter and cleared our inspectors at the gate.
          </Slot>
          <Slot title="Inspection count">
            A real running number, such as visits completed, once the pilot produces one.
          </Slot>
        </div>
      </section>

      <LatestPosts />

      <FAQ />

      <CtaBand
        photo="interior"
        title={
          <>
            See our work <em>before</em> you commit.
          </>
        }
        body="Start with a single founding pilot audit. No contract, no monthly plan until you have read the report."
      />
    </>
  );
}
