/** Display helpers for blog posts. No server imports, so client components can use them too. */

/** "2 June 2026", in India time so every visitor sees the date the post went out in Mangaluru. */
export function postDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}
