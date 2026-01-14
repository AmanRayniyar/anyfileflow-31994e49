import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://anyfileflow.lovable.app";
const TODAY = new Date().toISOString().split("T")[0];

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/tools", priority: "0.9", changefreq: "daily" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/brand", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.3", changefreq: "yearly" },
];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all enabled tools with pagination
    const allTools: { id: string; updated_at: string }[] = [];
    let from = 0;
    const pageSize = 1000;

    while (true) {
      const { data: tools, error: toolsError } = await supabase
        .from("tools")
        .select("id, updated_at")
        .eq("enabled", true)
        .order("id")
        .range(from, from + pageSize - 1);

      if (toolsError) {
        console.error("Error fetching tools:", toolsError);
        throw toolsError;
      }

      allTools.push(...(tools || []));
      
      if (!tools || tools.length < pageSize) break;
      from += pageSize;
    }

    console.log(`Fetched ${allTools.length} tools`);

    // Fetch all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (blogError) {
      console.error("Error fetching blog posts:", blogError);
      throw blogError;
    }

    console.log(`Fetched ${blogPosts?.length || 0} blog posts`);

    // Build the sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add all tools
    for (const tool of allTools) {
      const lastmod = tool.updated_at 
        ? tool.updated_at.split("T")[0] 
        : TODAY;
      
      xml += `  <url>
    <loc>${SITE_URL}/tool/${tool.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Add blog posts
    for (const post of blogPosts || []) {
      const lastmod = post.updated_at 
        ? post.updated_at.split("T")[0] 
        : TODAY;
      
      xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    console.log(`Generated sitemap with ${staticPages.length + allTools.length + (blogPosts?.length || 0)} URLs`);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
