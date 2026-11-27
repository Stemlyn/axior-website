import type { Metadata } from "next";
import { BookingFlow } from "@/components/BookingForm";
import { isPlanKey } from "@/lib/site";

const description =
  "Book a Spot Audit, Essential Care or Monsoon VIP Shield for your Mangaluru flat, villa or plot, or start with the ₹799 founding pilot audit. Confirmed on WhatsApp.";

export const metadata: Metadata = {
  title: "Book an Audit or Care Plan",
  description,
  alternates: { canonical: "/book" },
  openGraph: { title: "Book an Audit or Care Plan | AXIOR Mangaluru", description, url: "/book", images: "/opengraph-image.jpg" },
};

/** `?plan=spot|essential|vip|pilot` preselects a plan (the plan buttons on /services link here). */
export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { plan } = await searchParams;
  return <BookingFlow initialPlan={isPlanKey(plan) ? plan : undefined} />;
}
