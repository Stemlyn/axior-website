export const SOCIAL_PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "x", "threads", "google", "whatsapp"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

/*
 * Social platforms: display names, the domains a link must point to, and how a bare handle is
 * turned into a full URL. Mirrored from admin/src/lib/social.ts; keep the two in sync.
 */

export const SOCIAL_META: Record<SocialPlatform, { label: string; hosts: string[]; fromHandle?: (h: string) => string; example: string }> = {
  instagram: { label: "Instagram", hosts: ["instagram.com"], fromHandle: (h) => `https://instagram.com/${h}`, example: "@axior.mangaluru" },
  facebook: { label: "Facebook", hosts: ["facebook.com", "fb.com"], fromHandle: (h) => `https://facebook.com/${h}`, example: "facebook.com/axior" },
  linkedin: { label: "LinkedIn", hosts: ["linkedin.com"], fromHandle: (h) => `https://linkedin.com/company/${h}`, example: "linkedin.com/company/axior" },
  youtube: { label: "YouTube", hosts: ["youtube.com", "youtu.be"], fromHandle: (h) => `https://youtube.com/@${h}`, example: "@axior" },
  x: { label: "X (Twitter)", hosts: ["x.com", "twitter.com"], fromHandle: (h) => `https://x.com/${h}`, example: "@axior" },
  threads: { label: "Threads", hosts: ["threads.net", "threads.com"], fromHandle: (h) => `https://threads.net/@${h}`, example: "@axior.mangaluru" },
  google: { label: "Google Business Profile", hosts: ["g.page", "google.com", "maps.app.goo.gl", "business.google.com", "goo.gl"], example: "https://g.page/r/…" },
  whatsapp: { label: "WhatsApp Channel", hosts: ["whatsapp.com", "wa.me"], example: "https://whatsapp.com/channel/…" },
};

/**
 * Turns what was typed into a full https URL: accepts a handle ("@name"), a URL without a scheme,
 * or a full URL. Returns null if it cannot be understood.
 */
export function normalizeSocialUrl(platform: SocialPlatform, input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const meta = SOCIAL_META[platform];
  // "@name" or a bare word with no dot is a handle; anything else is treated as a URL.
  const isHandle = raw.startsWith("@") || /^[\w-]+$/.test(raw);
  if (isHandle) {
    const handle = raw.replace(/^@/, "");
    return meta.fromHandle && /^[\w.-]+$/.test(handle) ? meta.fromHandle(handle) : null;
  }
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    url.protocol = "https:";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Error message if the URL is not a valid link for this platform, otherwise null. */
export function socialUrlError(platform: SocialPlatform, url: string): string | null {
  if (!url.trim()) return "Enter a link or handle.";
  const full = normalizeSocialUrl(platform, url);
  if (!full) return "That doesn't look like a link.";
  const host = new URL(full).hostname.replace(/^www\./, "").replace(/^m\./, "");
  const ok = SOCIAL_META[platform].hosts.some((h) => host === h || host.endsWith("." + h));
  return ok ? null : `This isn't a ${SOCIAL_META[platform].label} link. It should be on ${SOCIAL_META[platform].hosts[0]}.`;
}
