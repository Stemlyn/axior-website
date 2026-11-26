import { AREAS, PRICE_RANGE_INR, SITE, TIERS, inrPrices } from "@/lib/site";

const BASE = inrPrices("apartment");

/** Renders one JSON-LD block. Content is our own static data; `<` is escaped per the Next.js JSON-LD guide. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const areaServed = AREAS.filter((a) => !a.startsWith("Elsewhere")).map((a) => ({
  "@type": "Place",
  name: `${a}, Mangaluru, Karnataka`,
}));

/** Site-wide: Organization plus the ProfessionalService/LocalBusiness it operates. Rendered in the root layout. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.url,
      email: SITE.email,
      slogan: "Your Eyes, Hands, and Peace of Mind in Mangaluru",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${SITE.whatsapp}`,
        availableLanguage: ["English", "Kannada", "Konkani", "Tulu", "Hindi"],
      },
    },
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": `${SITE.url}/#service`,
      name: `${SITE.name} ${SITE.tagline}`,
      description:
        "Property inspection and home-watch service for NRI owners of locked apartments, villas and vacant plots in Mangaluru. 30-point audits, bi-weekly visits, monsoon seepage checks and WhatsApp photo reports.",
      url: SITE.url,
      parentOrganization: { "@id": `${SITE.url}/#org` },
      priceRange: `₹${PRICE_RANGE_INR.min}–₹${PRICE_RANGE_INR.max.toLocaleString("en-IN")}`,
      currenciesAccepted: "INR",
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.city,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      areaServed,
      audience: {
        "@type": "Audience",
        audienceType: "Non-resident Indian property owners in the UAE, Qatar, Saudi Arabia and other GCC countries",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Property care plans",
        itemListElement: TIERS.map((t) => ({
          "@type": "Offer",
          name: t.name,
          price: BASE[t.key],
          description: `${t.summary} From ₹${BASE[t.key].toLocaleString("en-IN")} for a 1–2BHK apartment; larger homes and villas cost more.`,
          priceCurrency: "INR",
          url: `${SITE.url}/services`,
        })),
      },
    },
  ],
};

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
