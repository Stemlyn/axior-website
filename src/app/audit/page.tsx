import type { Metadata } from "next";
import { CtaBand, PageHeader, ReportCard } from "@/components/blocks";
import { InspectionWalkthrough } from "@/components/InspectionWalkthrough";
import { SectionHead, Slot, StatusTag } from "@/components/ui";
import type { Severity } from "@/lib/site";

export const metadata: Metadata = {
  title: "The 30-Point Standard & Sample Audit",
  description:
    "What NRI owners receive after an Axior inspection in Mangaluru: 30 checks, green, amber and red flags, timestamped photos and an unedited visit video.",
  alternates: { canonical: "/audit" },
  openGraph: { title: "The 30-Point Standard & Sample Audit | AXIOR Mangaluru", description: "What NRI owners receive after an Axior inspection in Mangaluru: 30 checks, green, amber and red flags, timestamped photos and an unedited visit video.", url: "/audit", images: "/opengraph-image.jpg" },
};

const FLAGS: { status: Severity; title: string; body: string; next: string }[] = [
  {
    status: "green",
    title: "Passed",
    body: "Checked and in the condition it should be. Logged with a reading or photo so the next visit has a baseline.",
    next: "Nothing for you to do.",
  },
  {
    status: "amber",
    title: "Monitored",
    body: "An early sign, such as a faint damp ring or a slow drip. Not urgent yet, but recorded and re-measured on every visit.",
    next: "You see the trend. We tell you if it worsens.",
  },
  {
    status: "red",
    title: "Immediate action required",
    body: "Active damage or a safety risk: water coming in, live termites, a tripping circuit. Flagged to you the same day.",
    next: "We send a vendor quote. Nothing is spent until you approve.",
  },
];

export default function AuditPage() {
  return (
    <>
      <PageHeader
        photo="meter"
        position="center 40%"
        aside={<ReportCard entrance="css" />}
        title={
          <>
            What you get, <em>a flight away.</em>
          </>
        }
        intro="Every visit ends in the same report: 30 checks, four areas, a flag on each point and the photos and video to back it up. Explore a sample below."
      />

      <InspectionWalkthrough />

      <section id="flags" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHead
          title={
            <>
              Three flags, <em>one decision</em> each.
            </>
          }
          intro="The flag tells you how soon to act. Catching amber early is how a ₹500 seal stays a ₹500 seal."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FLAGS.map((f) => (
            <div key={f.status} className="flex flex-col rounded-[2rem] border border-line p-7">
              <StatusTag status={f.status} className="self-start" />
              <h3 className="display mt-6 text-3xl">{f.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{f.body}</p>
              <p className="mt-6 border-t border-line pt-4 text-sm font-semibold">{f.next}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <Slot title="Downloadable sample report (PDF)">
          A redacted PDF of a real Bejai high-rise audit, linked here as a one-click download. Remove the owner&apos;s
          name, flat number and any faces from photos before publishing. Put the file at /public/sample-audit.pdf.
        </Slot>
      </section>

      <CtaBand
        title={<>Get this report for <em>your</em> home.</>}
        body="The founding pilot audit is the full 30-point inspection, delivered exactly like the sample above."
      />
    </>
  );
}
