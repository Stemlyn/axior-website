import { PHOTO_MAX, PHOTO_WIDTHS } from "./photo-sizes";

/*
 * next/image loader: brand photos are served from pre-generated, cached WebP files
 * (public/photos/opt/<name>-<width>.webp, made by scripts/perf/make-photos.mjs) instead of being
 * resized on every request. Picks the smallest generated width that covers the requested one.
 * Anything else is served as-is.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = /^\/photos\/([a-z0-9-]+)\.jpg$/.exec(src);
  const max = m ? PHOTO_MAX[m[1]] : undefined;
  if (!m || !max) return src;
  const available = PHOTO_WIDTHS.filter((w) => w <= max);
  const chosen = available.find((w) => w >= width) ?? available[available.length - 1];
  return `/photos/opt/${m[1]}-${chosen}.webp`;
}
