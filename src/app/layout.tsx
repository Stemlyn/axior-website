import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Footer, FloatingWhatsApp } from "@/components/Footer";
import { JsonLd, organizationSchema } from "@/components/JsonLdSchema";
import AxiorNavbar from "@/components/ui/navbar";
import { Providers } from "@/components/Providers";
import { SITE } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const description =
  "Bi-weekly home-watch, 30-point audits and monsoon checks for NRI-owned flats, villas and plots in Mangaluru. Photo reports on WhatsApp within 24 hours.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AXIOR | NRI Property Care & Home Inspection in Mangaluru",
    template: "%s | AXIOR Mangaluru",
  },
  description,
  authors: [{ name: "STEMLYN", url: "https://stemlyn.rjglobalgroup.in/" }],
  creator: "STEMLYN",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    title: "AXIOR | NRI Property Care & Home Inspection in Mangaluru",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2a4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${instrument.variable}`}>
      <body>
        <JsonLd data={organizationSchema} />
        <Providers>
          <AxiorNavbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
