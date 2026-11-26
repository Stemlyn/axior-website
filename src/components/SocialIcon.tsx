import type { SocialPlatform } from "@/lib/social";

/*
 * Simple, recognisable platform marks (lucide no longer ships brand logos).
 * Mirrored from admin/src/components/SocialIcon.tsx; keep the two in sync.
 */
export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const common = { viewBox: "0 0 24 24", className, "aria-hidden": true } as const;
  switch (platform) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h3v12H3V9Zm6 0h2.9v1.7c.4-.8 1.5-1.9 3.4-1.9 3.1 0 3.7 2 3.7 4.7V21h-3v-6.6c0-1.6 0-3.5-2.1-3.5S12 12.6 12 14.3V21H9V9Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M16.5 11.2c-.4-2.4-2-3.7-4.4-3.7-2.6 0-4.2 1.9-4.2 4.5s1.6 4.5 4.3 4.5c2 0 3.2-1 3.2-2.4 0-1.7-1.5-2.4-3.3-2.4-1.5 0-2.5.6-2.5 1.6 0 .9.8 1.5 1.9 1.5" />
          <path d="M19.5 7.5C18 4.6 15.4 3 12 3 6.8 3 3.5 6.6 3.5 12S6.8 21 12 21c3.7 0 6.6-1.9 7.6-5" />
        </svg>
      );
    case "google":
      return (
        <svg {...common} fill="currentColor">
          <path d="M21.4 10.4H12v3.3h5.4c-.5 2.4-2.6 3.9-5.4 3.9a6 6 0 1 1 0-12c1.5 0 2.8.5 3.9 1.4l2.4-2.4A9.4 9.4 0 0 0 12 2.3a9.7 9.7 0 1 0 0 19.4c5.6 0 9.6-3.9 9.6-9.5 0-.6 0-1.2-.2-1.8Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12.05 2a9.9 9.9 0 0 0-8.5 15l-1.45 5.3 5.43-1.42A9.9 9.9 0 1 0 12.05 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.22.85.86-3.14-.2-.32a8.2 8.2 0 1 1 7.04 3.94Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.14-.25 0-.38.11-.5l.37-.43c.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31c-.23.25-.86.85-.86 2.06 0 1.22.88 2.4 1 2.56.13.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.1-.23-.17-.47-.29Z" />
        </svg>
      );
  }
}
