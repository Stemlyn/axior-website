import Image from "next/image";
import { PHOTO_BLUR } from "@/lib/photo-blur";
import { PHOTOS, type PhotoKey } from "@/lib/site";
import { cn } from "./ui";

/**
 * A brand photograph filling its (positioned, sized) parent.
 * `caption` adds a small credit-style line; the photos are illustrative, which the footer states.
 */
export function Shot({
  k,
  className,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  position = "center",
  imgClassName,
}: {
  k: PhotoKey;
  className?: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
  imgClassName?: string;
}) {
  const p = PHOTOS[k];
  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      <Image
        src={p.src}
        alt={p.alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder={PHOTO_BLUR[k] ? "blur" : "empty"}
        blurDataURL={PHOTO_BLUR[k]}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition: position }}
      />
    </div>
  );
}
