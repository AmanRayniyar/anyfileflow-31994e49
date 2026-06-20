// Runs before `vite dev` and `vite build`; writes public/sitemap.xml
// by merging the dynamic edge function (DB tools) with our static tools
// from src/data/tools.ts (so finance + curated tools are always indexed).

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DYNAMIC_SITEMAP_URL =
  "https://cmcvkmttlrjahpxsotyr.supabase.co/functions/v1/sitemap";
const SITE_URL = "https://anyfileflow.lovable.app";
const OUT_PATH = resolve("public/sitemap.xml");

const FALLBACK = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc></url>
</urlset>`;

async function getStaticToolUrls(): Promise<string[]> {
  try {
    // Dynamic import the data module so it works under tsx.
    const mod = await import("../src/data/tools");
    const tools = (mod as { tools: { id: string }[] }).tools ?? [];
    return tools.map((t) => `${SITE_URL}/tool/${t.id}`);
  } catch (e) {
    console.warn("Static tool import failed:", e);
    return [];
  }
}

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

function buildSitemap(locs: string[]): string {
  const today = new Date().toISOString().split("T")[0];
  const urls = locs
    .map(
      (loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const set = new Set<string>();
  set.add(`${SITE_URL}/`);
  set.add(`${SITE_URL}/tools`);
  set.add(`${SITE_URL}/blog`);
  set.add(`${SITE_URL}/about`);
  set.add(`${SITE_URL}/contact`);

  try {
    const res = await fetch(DYNAMIC_SITEMAP_URL);
    if (res.ok) {
      const xml = await res.text();
      extractLocs(xml).forEach((u) => set.add(u));
    }
  } catch (e) {
    console.warn("Dynamic sitemap fetch failed:", e);
  }

  const staticUrls = await getStaticToolUrls();
  staticUrls.forEach((u) => set.add(u));

  if (set.size <= 1) {
    writeFileSync(OUT_PATH, FALLBACK);
    return;
  }

  const xml = buildSitemap(Array.from(set));
  writeFileSync(OUT_PATH, xml);
  console.log(`sitemap.xml written (${set.size} URLs, ${staticUrls.length} from static catalog)`);
}

main();
