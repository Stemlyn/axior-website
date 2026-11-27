import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogCard } from "@/components/BlogCard";
import { CtaBand } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLdSchema";
import { getPosts } from "@/lib/blog";
import { SITE } from "@/lib/site";

const description =
  "Field notes for NRI owners from the Axior desk in Mangaluru: monsoon checklists, what an audit covers, and how to keep a locked home in good shape.";

export const metadata: Metadata = {
  title: "Owner Guides & Field Notes",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Owner Guides & Field Notes | AXIOR Mangaluru", description, url: "/blog", images: "/opengraph-image.jpg" },
};

async function Posts() {
  const posts = await getPosts();
  if (!posts.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-line px-6 py-20 text-center">
        <p className="display text-3xl">The first guide is on its way.</p>
        <p className="mt-3 text-muted">Our first monsoon notes from Mangaluru are being written now.</p>
      </div>
    );
  }
  const [first, ...rest] = posts;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "AXIOR Owner Guides",
          url: `${SITE.url}/blog`,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE.url}/blog/${p.slug}`,
            datePublished: p.publishedAt,
          })),
        }}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BlogCard post={first} feature />
        {rest.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}

function PostsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
      <div className="h-[420px] animate-pulse rounded-[1.75rem] bg-mist md:col-span-2" />
      <div className="h-[420px] animate-pulse rounded-[1.75rem] bg-mist" />
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <section className="dark grain relative isolate overflow-hidden bg-night text-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20 lg:pt-44">
          <p className="text-[13px] font-semibold text-gold">From the Axior desk</p>
          <h1 className="display mt-4 max-w-3xl text-[2.9rem] sm:text-6xl lg:text-7xl">
            Notes for owners <em>far from home.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/75">{description}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts />
        </Suspense>
      </section>
      <CtaBand
        photo="meter"
        title={
          <>
            Rather we <em>check</em> for you?
          </>
        }
        body="Book one founding pilot audit and get the full 30-point dossier, photos and video within 4 hours."
      />
    </>
  );
}
