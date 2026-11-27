import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext setup for Cloudflare Workers. Pages read live data per request (prices, site
// settings and blog from Supabase), so no incremental cache is needed.
export default defineCloudflareConfig();
