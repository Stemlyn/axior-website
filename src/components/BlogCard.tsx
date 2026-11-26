import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { postDate, type Post } from "@/lib/blog";
import { readMinutes } from "@/lib/markdown";
import { Shot } from "./Photo";
import { cn } from "./ui";

/** A post card: cover photo, category, title, summary, date and reading time. `feature` makes it wide. */
export function BlogCard({ post, feature = false }: { post: Post; feature?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white transition-shadow hover:shadow-[0_20px_50px_-24px_rgba(7,13,26,0.35)]",
        feature && "md:col-span-2 lg:grid lg:grid-cols-[1.15fr_1fr]",
      )}
    >
      <Shot
        k={post.cover}
        className={cn("aspect-[16/10]", feature && "lg:aspect-auto lg:min-h-[420px]")}
        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        sizes={feature ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
      />
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", feature && "lg:justify-center lg:p-12")}>
        <p className="text-[13px] font-semibold text-gold-ink">{post.category}</p>
        <h3 className={cn("display mt-3 text-ink", feature ? "text-4xl sm:text-5xl" : "text-[1.9rem] leading-[1.1]")}>{post.title}</h3>
        <p className={cn("mt-4 leading-relaxed text-muted", !feature && "line-clamp-3")}>{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-[13px] text-muted">
          <span>
            <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time> · {readMinutes(post.body)} min read
          </span>
          <ArrowUpRight className="size-5 text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
