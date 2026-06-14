// Runs before `vite dev` and `vite build`; writes public/sitemap.xml
// by fetching the dynamic edge function and rewriting it as a same-host
// sitemap so Google Search Console accepts it.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DYNAMIC_SITEMAP_URL =
  "https://cmcvkmttlrjahpxsotyr.supabase.co/functions/v1/sitemap";
const OUT_PATH = resolve("public/sitemap.xml");

const FALLBACK = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://anyfileflow.lovable.app/</loc></url>
</urlset>`;

async function main() {
  try {
    const res = await fetch(DYNAMIC_SITEMAP_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    if (!xml.includes("<urlset")) throw new Error("Unexpected sitemap shape");
    writeFileSync(OUT_PATH, xml);
    const count = (xml.match(/<loc>/g) || []).length;
    console.log(`sitemap.xml written (${count} URLs)`);
  } catch (err) {
    console.warn("Sitemap generation failed, keeping existing file:", err);
    // Only write fallback if file is missing
    try {
      const { existsSync } = await import("node:fs");
      if (!existsSync(OUT_PATH)) writeFileSync(OUT_PATH, FALLBACK);
    } catch {}
  }
}

main();
