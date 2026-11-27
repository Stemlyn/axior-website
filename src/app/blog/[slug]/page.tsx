import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { CtaBand } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLdSchema";
import { Shot } from "@/components/Photo";
import { getPost, getPosts, postDate } from "@/lib/blog";
import { Markdown, readMinutes } from "@/lib/markdown";
import { PHOTOS, SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} | AXIOR Mangaluru`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: PHOTOS[post.cover].src,
    },
  };
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Owner guides", item: `${SITE.url}/blog` },
            { "@type": "ListItem", position: 3, name: post.title },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: `${SITE.url}${PHOTOS[post.cover].src}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
        }}
      />
      <article>
        <header className="dark relative isolate overflow-hidden bg-night text-white">
          <Shot k={post.cover} priority className="absolute inset-0 -z-10 opacity-55" sizes="100vw" />
          <div className="scrim-bottom absolute inset-0 -z-10" />
          <div className="mx-auto flex min-h-[560px] max-w-3xl flex-col justify-end px-4 pb-14 pt-36 sm:px-6 lg:min-h-[640px] lg:pb-20">
            <Link href="/blog" className="mb-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="size-4" /> All guides
            </Link>
            <p className="mt-10 text-[13px] font-semibold text-gold">{post.category}</p>
            <h1 className="display mt-4 text-[2.6rem] sm:text-6xl">{post.title}</h1>
            <p className="mt-6 text-sm text-white/70">
              {post.author} · <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> · {readMinutes(post.body)} min read
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          <p className="display text-[1.7rem] leading-snug text-ink sm:text-3xl">{post.excerpt}</p>
          <div className="post-body mt-10 text-ink/85 [&_a]:text-gold-ink [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink">
            <Markdown source={post.body} />
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="border-t border-line bg-mist">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <h2 className="display text-4xl">More from the desk</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {more.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ArticleSkeleton() {
  return <div className="min-h-[640px] animate-pulse bg-night" aria-hidden />;
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <Suspense fallback={<ArticleSkeleton />}>
        <Article params={params} />
      </Suspense>
      <CtaBand
        photo="villa"
        title={
          <>
            Your home, <em>checked</em> every fortnight.
          </>
        }
        body="Start with one founding pilot audit: the 30-point report, photos and a narrated video on WhatsApp within 24 hours."
      />
    </>
  );
}
