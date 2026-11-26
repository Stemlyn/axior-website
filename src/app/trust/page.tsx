import type { Metadata } from "next";
import { Building2, FileSignature, KeySquare, Lock, ScrollText, Video } from "lucide-react";
import { CtaBand, PageHeader } from "@/components/blocks";
import { FAQ } from "@/components/FAQ";
import { JsonLd, faqSchema } from "@/components/JsonLdSchema";
import { SectionHead, Slot } from "@/components/ui";
import { FAQS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trust, Keys & Legal Custody",
  description:
    "How Axior protects your keys and home in Mangaluru: coded key tags with no address, a dual-custody safe, a key movement log and unbroken entry-to-exit video.",
  alternates: { canonical: "/trust" },
  openGraph: { title: "Trust, Keys & Legal Custody | AXIOR Mangaluru", description: "How Axior protects your keys and home in Mangaluru: coded key tags with no address, a dual-custody safe, a key movement log and unbroken entry-to-exit video.", url: "/trust", images: "/opengraph-image.jpg" },
};

const KEY_LAYERS = [
  {
    icon: KeySquare,
    title: "Serial-coded tags",
    body: "Each key ring gets an alphanumeric code such as AX-B-0417. No name, address or building is ever written on the tag. The code-to-home list is kept separately, so a lost ring opens nothing.",
  },
  {
    icon: Lock,
    title: "Dual-custody lockbox",
    body: "Keys live in a locked key safe that takes two staff members to open. One holds the safe, the other holds the key log, so no single person can take a key unrecorded.",
  },
  {
    icon: ScrollText,
    title: "Key movement log",
    body: "Every time a key leaves the safe we record who took it, when, and which visit it was for, then when it came back. You can ask for your home’s log at any time.",
  },
];

const FAQ_TRUST = [
  FAQS[0],
  {
    q: "What if something goes missing from my home?",
    a: "Every visit is filmed without a break from unlocking the door to locking it, and the full recording is sent to you. If you notice anything missing, the videos show exactly who entered, when, and what they did. We also ask every owner to remove cash, jewellery and documents before handover.",
  },
];

export default function TrustPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ_TRUST)} />
      <PageHeader
        photo="keys"
        title={
          <>
            Your keys, <em>accounted for.</em>
          </>
        }
        intro="You are trusting strangers with a home worth crores. These are the written rules every Axior inspector works by, on every visit, with no exceptions."
      />

      <section id="keys" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHead
          title={
            <>
              Three layers of <em>key custody.</em>
            </>
          }
          intro="Each layer covers a different failure: a lost key, a dishonest person, a forgotten handover."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {KEY_LAYERS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="rounded-[2rem] border border-line p-7">
              <div className="flex items-center justify-between">
                <Icon className="size-7 text-gold-ink" strokeWidth={1.4} aria-hidden />
                <span className="display text-4xl text-line">{i + 1}</span>
              </div>
              <h3 className="display mt-6 text-3xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="video" className="px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 dark grain relative rounded-[2rem] bg-night px-6 py-14 text-white sm:px-12 lg:grid-cols-2 lg:py-16">
          <div>
            <Video className="size-8 text-white/70" strokeWidth={1.4} aria-hidden />
            <h2 className="display mt-6 text-4xl sm:text-5xl">
              Unbroken video, <em>door to door.</em>
            </h2>
          </div>
          <div className="space-y-4 leading-relaxed text-white/75">
            <p>
              The inspector starts recording before the main door is unlocked and stops only after it is locked again.
              No pauses and no edits. The full file is linked in your visit report.
            </p>
            <p>
              If a recording has a gap, for any reason, the visit is marked incomplete and repeated at our cost. You
              never have to take our word for what happened inside.
            </p>
          </div>
        </div>
      </section>

      <section id="society" className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="rounded-[2rem] bg-mist p-7 sm:p-9">
          <Building2 className="size-7 text-gold-ink" strokeWidth={1.4} aria-hidden />
          <h2 className="display mt-6 text-3xl sm:text-4xl">
            Introduced to your <em>society</em>, formally.
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Before the first visit we send your apartment association a signed letter naming Axior as your authorised
            caretaker, with the inspector’s name and photo ID. Security staff know who we are, and you can revoke the
            authority with one message.
          </p>
        </div>
        <div className="rounded-[2rem] bg-mist p-7 sm:p-9">
          <FileSignature className="size-7 text-gold-ink" strokeWidth={1.4} aria-hidden />
          <h2 className="display mt-6 text-3xl sm:text-4xl">
            The <em>no-valuables</em> agreement.
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Our written agreement draws a clear line: we inspect and report on the property, we do not take custody of
            its contents. You remove cash, jewellery and documents before handover. Clear boundaries protect you and our
            inspectors alike.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 md:grid-cols-2">
        <Slot title="Sample service agreement">
          A downloadable PDF of the owner agreement, including the no-valuables clause and how authority is revoked.
          Have it reviewed by a lawyer before publishing.
        </Slot>
        <Slot title="Inspector verification">
          How inspectors are vetted (police verification, ID checks, training) and whether visits are insured. Only list
          what is actually in place.
        </Slot>
      </section>

      <FAQ items={FAQ_TRUST} title={<>Questions about <em>access.</em></>} />
      <CtaBand
        title={<>Meet the protocol <em>in person.</em></>}
        body="Your pilot audit follows every rule on this page. Watch the full video before you decide anything else."
      />
    </>
  );
}
