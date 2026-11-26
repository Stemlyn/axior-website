import { Fragment, type ReactNode } from "react";

/*
 * A deliberately small Markdown renderer for blog posts. It builds React elements directly (no
 * innerHTML), so nothing in a post can inject scripts or markup. Supported:
 *   ## Heading, ### Subheading, paragraphs, - or * bullet lists, 1. numbered lists, > quotes,
 *   **bold**, *italic*, `code`, [link text](https://… | /path | mailto:…)
 * Mirrored from admin/src/lib/markdown.tsx; keep the two in sync.
 */

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/))/i;

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  // Order matters: links, then bold, italic, code.
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) {
      const href = m[2];
      if (SAFE_HREF.test(href)) {
        const external = /^https?:\/\//i.test(href);
        out.push(
          <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {inline(m[1], k)}
          </a>,
        );
      } else {
        out.push(m[1]); // unsafe link scheme: keep the text, drop the link
      }
    } else if (m[3] !== undefined) out.push(<strong key={k}>{inline(m[3], k)}</strong>);
    else if (m[4] !== undefined) out.push(<em key={k}>{inline(m[4], k)}</em>);
    else if (m[5] !== undefined) out.push(<code key={k}>{m[5]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let b = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const k = `b${b++}`;
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push(h[1].length === 2 ? <h2 key={k}>{inline(h[2], k)}</h2> : <h3 key={k}>{inline(h[2], k)}</h3>);
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={k}>{inline(q.join(" "), k)}</blockquote>);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      blocks.push(
        <ul key={k}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+[.)]\s+/, ""));
      blocks.push(
        <ol key={k}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `${k}-${j}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>|[-*]\s|\d+[.)]\s)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(<p key={k}>{inline(para.join(" "), k)}</p>);
  }
  return <Fragment>{blocks}</Fragment>;
}

/** Minutes to read at ~200 words a minute (minimum 1). */
export function readMinutes(source: string) {
  return Math.max(1, Math.round(source.split(/\s+/).filter(Boolean).length / 200));
}

/** URL-safe slug from a title. */
export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
