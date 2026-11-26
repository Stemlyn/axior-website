import type { Metadata } from "next";
import { BadgeCheck, CalendarClock, FileText } from "lucide-react";
import { Price } from "@/components/blocks";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Founding Pilot Audit",
  description:
    "Book Axior's ₹799 founding pilot audit for your Mangaluru flat, villa or plot. Three quick questions, confirmed on WhatsApp, credited to your first month.",
  alternates: { canonical: "/book" },
  openGraph: { title: "Book a Founding Pilot Audit | AXIOR Mangaluru", description: "Book Axior's ₹799 founding pilot audit for your Mangaluru flat, villa or plot. Three quick questions, confirmed on WhatsApp, credited to your first month.", url: "/book", images: "/opengraph-image.jpg" },
};

const PROMISES = [
  { icon: FileText, title: "Full 30-point audit", body: "The same inspection and report our monthly clients get." },
  { icon: CalendarClock, title: "No contract", body: "One visit. Decide about a monthly plan after reading the report." },
  { icon: BadgeCheck, title: "Fee credited", body: "100% of the pilot fee goes toward your first month if you continue." },
];

export default function BookPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-32 sm:px-6 md:pb-20 md:pt-36 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <h1 className="display text-5xl sm:text-6xl">
          Book your <em>founding pilot</em> audit.
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-muted sm:text-lg">
          Three quick questions. We open WhatsApp with your answers filled in, and a coordinator replies with a visit
          slot that suits your time zone.
        </p>
        <div className="dark grain relative mt-8 overflow-hidden rounded-[1.5rem] bg-night p-6 text-white">
          <p className="text-sm text-white/70">Founding pilot price</p>
          <p className="display mt-1 text-5xl">
            <Price k="pilot" />
          </p>
          <p className="mt-2 text-sm text-white/70">
            Usually <Price k="spot" /> for a Spot Audit.
          </p>
        </div>
        <ul className="mt-8 space-y-5">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.6} aria-hidden />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <BookingForm />
    </section>
  );
}
