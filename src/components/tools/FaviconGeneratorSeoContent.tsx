const FaviconGeneratorSeoContent = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://anyfileflow.com/tool/favicon-generator#software",
        "name": "Free Favicon Generator Online",
        "applicationCategory": "DesignApplication",
        "applicationSubCategory": "Icon Generator",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript and HTML5 Canvas",
        "permissions": "none",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "Generate favicon from text, emoji, or image",
          "Export as PNG, ICO, and SVG formats",
          "Multiple sizes: 16x16 to 512x512",
          "Gradient backgrounds and custom shapes",
          "100% browser-based, no upload required",
          "No registration or signup needed"
        ],
        "author": {
          "@type": "Person",
          "name": "Aman Rauniyar"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://anyfileflow.com/tool/favicon-generator#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anyfileflow.com" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://anyfileflow.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "Favicon Generator", "item": "https://anyfileflow.com/tool/favicon-generator" }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://anyfileflow.com/tool/favicon-generator#howto",
        "name": "How to Create a Favicon Online for Free",
        "description": "Generate a professional favicon for your website in seconds using AnyFile Flow's free favicon generator. No design skills required.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Choose Input Mode",
            "text": "Select Text, Emoji, or Image Upload mode depending on what you want your favicon to look like."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Customize Design",
            "text": "Pick a background gradient, shape (square, rounded, circle), adjust corner radius, border, and shadow settings."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Preview All Sizes",
            "text": "See real-time previews of your favicon in all standard sizes from 16x16 to 512x512 pixels."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Download & Install",
            "text": "Export your favicon as PNG, ICO, or SVG. Copy the HTML snippet and paste it into your website's head tag."
          }
        ],
        "totalTime": "PT1M"
      },
      {
        "@type": "FAQPage",
        "@id": "https://anyfileflow.com/tool/favicon-generator#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a favicon and why do I need one?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A favicon is the small icon displayed in browser tabs, bookmarks, and search results. It helps users identify your website quickly and builds brand recognition. Search engines also use favicons in mobile search results."
            }
          },
          {
            "@type": "Question",
            "name": "What size should a favicon be?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The standard favicon size is 32x32 pixels for browser tabs, but modern websites should include multiple sizes: 16x16 for small tabs, 32x32 for standard display, 180x180 for Apple Touch icons, and 512x512 for PWA manifests. AnyFile Flow generates all sizes automatically."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between ICO, PNG, and SVG favicons?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ICO is the traditional format supported by all browsers including older IE versions. PNG favicons offer better quality and are widely supported in modern browsers. SVG favicons scale perfectly to any size and support dark mode adaptation, but have limited browser support."
            }
          },
          {
            "@type": "Question",
            "name": "Is this favicon generator really free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AnyFile Flow's favicon generator is completely free with no limits, no watermarks, and no registration required. All processing happens in your browser — your data never leaves your device."
            }
          },
          {
            "@type": "Question",
            "name": "How do I add a favicon to my website?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "After generating your favicon, copy the HTML code snippet provided and paste it into the <head> section of your HTML. For WordPress, upload the favicon through Appearance > Customize > Site Identity."
            }
          },
          {
            "@type": "Question",
            "name": "Can I create a favicon from text or an emoji?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. AnyFile Flow supports three input modes: type 1–3 characters of text, select an emoji, or upload an existing image. Each mode lets you customize colors, backgrounds, shapes, and effects."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool work on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The favicon generator is fully responsive and works on smartphones and tablets. You can create and download favicons directly from your mobile browser."
            }
          },
          {
            "@type": "Question",
            "name": "What is an Apple Touch Icon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An Apple Touch Icon is a 180x180 pixel image used when someone adds your website to their iPhone or iPad home screen. AnyFile Flow generates this size automatically alongside standard favicon sizes."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use a transparent background for my favicon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. When using text or emoji mode, you can choose backgrounds with transparency. PNG and ICO formats support transparent backgrounds, making your favicon blend seamlessly with any browser tab color."
            }
          },
          {
            "@type": "Question",
            "name": "How do I make my favicon show up in Google search results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Google automatically displays favicons in mobile search results. Ensure your favicon is at least 48x48 pixels, is a multiple of 48 (e.g., 48x48, 96x96, 144x144), and is linked correctly with a <link rel='icon'> tag in your HTML head. AnyFile Flow generates the correct HTML snippet for you."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="mt-8 space-y-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main SEO Content */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="favicon-guide">
        <h2 id="favicon-guide" className="text-2xl font-bold text-foreground mb-4">
          Free Favicon Generator — Create Professional Website Icons Instantly
        </h2>
        <p className="text-muted-foreground mb-4">
          A favicon is one of the most overlooked yet essential elements of web design. It appears in browser tabs, bookmark lists, history panels, and Google mobile search results. AnyFile Flow's free favicon generator lets you create pixel-perfect icons from text, emoji, or image uploads — entirely in your browser with zero data upload.
        </p>
        <p className="text-muted-foreground mb-6">
          Whether you are building a personal blog, launching a SaaS product, or managing a client's WordPress site, a professional favicon immediately signals credibility. Our tool generates all required sizes (16×16 through 512×512) and exports to PNG, ICO, and SVG formats so your icon looks sharp everywhere — from tiny browser tabs to high-resolution PWA splash screens.
        </p>

        {/* Key Features */}
        <h3 className="text-xl font-semibold text-foreground mb-3">Key Features</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-6">
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Text, emoji, and image input modes</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> 20+ gradient background presets</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Square, rounded, and circle shapes</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Adjustable corner radius and border</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Drop shadow and depth effects</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Real-time multi-size preview</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Export PNG, ICO, and SVG</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Copy-paste HTML link snippet</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> Batch download all sizes at once</li>
          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span> 100% private — nothing uploaded</li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="how-favicon-works">
        <h2 id="how-favicon-works" className="text-xl font-bold text-foreground mb-4">
          How to Create a Favicon in 4 Steps
        </h2>
        <ol className="space-y-4 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</span>
            <div><strong className="text-foreground">Choose your input.</strong> Type up to 3 characters, pick an emoji, or upload an existing logo or image file.</div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</span>
            <div><strong className="text-foreground">Customize the design.</strong> Select a gradient background, icon shape, corner radius, border width, and shadow intensity.</div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</span>
            <div><strong className="text-foreground">Preview all sizes.</strong> Instantly see how your favicon looks at 16×16, 32×32, 48×48, 64×64, 128×128, 180×180, 192×192, and 512×512.</div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">4</span>
            <div><strong className="text-foreground">Download and install.</strong> Export your favicon in PNG, ICO, or SVG format. Copy the ready-made HTML code and paste it into your site.</div>
          </li>
        </ol>
      </section>

      {/* Favicon Sizes Explained */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="favicon-sizes">
        <h2 id="favicon-sizes" className="text-xl font-bold text-foreground mb-4">
          Favicon Sizes Explained — Which Sizes Do You Need?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold text-foreground">Size</th>
                <th className="py-2 pr-4 font-semibold text-foreground">Purpose</th>
                <th className="py-2 font-semibold text-foreground">Where Used</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="py-2 pr-4">16×16</td><td className="py-2 pr-4">Browser tab icon</td><td className="py-2">All browsers</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">32×32</td><td className="py-2 pr-4">Standard favicon</td><td className="py-2">Taskbar, bookmarks</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">48×48</td><td className="py-2 pr-4">Google search results</td><td className="py-2">Mobile SERP</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">64×64</td><td className="py-2 pr-4">High-DPI tabs</td><td className="py-2">Retina displays</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">128×128</td><td className="py-2 pr-4">Chrome Web Store</td><td className="py-2">Extensions, PWA</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">180×180</td><td className="py-2 pr-4">Apple Touch Icon</td><td className="py-2">iOS home screen</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4">192×192</td><td className="py-2 pr-4">Android home screen</td><td className="py-2">manifest.json</td></tr>
              <tr><td className="py-2 pr-4">512×512</td><td className="py-2 pr-4">PWA splash screen</td><td className="py-2">manifest.json</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Format Comparison */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="format-comparison">
        <h2 id="format-comparison" className="text-xl font-bold text-foreground mb-4">
          ICO vs PNG vs SVG — Which Favicon Format Should You Use?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold text-foreground">Feature</th>
                <th className="py-2 pr-4 font-semibold text-foreground">ICO</th>
                <th className="py-2 pr-4 font-semibold text-foreground">PNG</th>
                <th className="py-2 font-semibold text-foreground">SVG</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium text-foreground">Browser support</td><td className="py-2 pr-4">All (including IE)</td><td className="py-2 pr-4">All modern</td><td className="py-2">Chrome, Firefox, Edge</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium text-foreground">Scalability</td><td className="py-2 pr-4">Fixed sizes</td><td className="py-2 pr-4">Fixed sizes</td><td className="py-2">Infinite</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium text-foreground">Transparency</td><td className="py-2 pr-4">Yes</td><td className="py-2 pr-4">Yes</td><td className="py-2">Yes</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 pr-4 font-medium text-foreground">Dark mode</td><td className="py-2 pr-4">No</td><td className="py-2 pr-4">No</td><td className="py-2">Yes (CSS media)</td></tr>
              <tr><td className="py-2 pr-4 font-medium text-foreground">Best for</td><td className="py-2 pr-4">Legacy support</td><td className="py-2 pr-4">General use</td><td className="py-2">Modern, adaptive</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm mt-4">
          <strong className="text-foreground">Recommendation:</strong> Use PNG as your primary favicon for maximum compatibility. Add an ICO fallback for older browsers, and consider SVG if you want dark mode adaptation.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="favicon-faq">
        <h2 id="favicon-faq" className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: "What is a favicon and why do I need one?", a: "A favicon is the small icon displayed in browser tabs, bookmarks, and search results. It helps users identify your website quickly and builds brand recognition. Search engines also use favicons in mobile search results, making them important for SEO." },
            { q: "What size should a favicon be?", a: "The standard favicon size is 32×32 pixels for browser tabs. Modern websites should include multiple sizes: 16×16 for small tabs, 32×32 for standard display, 180×180 for Apple Touch icons, and 512×512 for PWA manifests. This tool generates all sizes automatically." },
            { q: "What is the difference between ICO, PNG, and SVG favicons?", a: "ICO is the traditional format supported by all browsers including older IE versions. PNG favicons offer better quality and are widely supported in modern browsers. SVG favicons scale perfectly to any size and support dark mode, but have limited browser support." },
            { q: "Is this favicon generator really free?", a: "Yes, completely free with no limits, no watermarks, and no registration. All processing happens in your browser — your files never leave your device." },
            { q: "How do I add a favicon to my website?", a: "After generating your favicon, copy the HTML code snippet provided and paste it into the <head> section of your HTML. For WordPress, go to Appearance → Customize → Site Identity and upload your favicon." },
            { q: "Can I create a favicon from text or an emoji?", a: "Yes. AnyFile Flow supports three input modes: type 1–3 characters of text, select an emoji, or upload an existing image. Each mode includes full design customization." },
            { q: "Does this tool work on mobile?", a: "Yes. The favicon generator is fully responsive and works on all smartphones and tablets." },
            { q: "What is an Apple Touch Icon?", a: "An Apple Touch Icon is a 180×180 pixel image used when someone adds your website to their iPhone or iPad home screen. This tool generates it automatically." },
            { q: "How do I make my favicon appear in Google search results?", a: "Ensure your favicon is at least 48×48 pixels, is a multiple of 48 (e.g., 48, 96, 144), and is linked with a <link rel='icon'> tag. This tool generates the correct HTML for you." },
            { q: "Can I use a transparent background?", a: "Yes. PNG and ICO formats support transparent backgrounds, letting your favicon blend seamlessly with any browser tab or bookmark bar." }
          ].map((item, i) => (
            <details key={i} className="group border border-border rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer text-foreground font-medium text-sm hover:text-primary transition-colors">
                {item.q}
                <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Trending Keywords */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8" aria-labelledby="trending-keywords">
        <h2 id="trending-keywords" className="text-xl font-bold text-foreground mb-4">
          Trending Favicon Generator Search Terms
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "favicon generator", "free favicon generator", "favicon generator online",
            "favicon maker", "create favicon", "favicon creator",
            "favicon from text", "emoji favicon", "favicon from image",
            "favicon ico generator", "favicon png generator", "svg favicon generator",
            "favicon 32x32", "favicon 16x16", "apple touch icon generator",
            "pwa icon generator", "website icon generator", "tab icon maker",
            "favicon generator no signup", "browser icon creator",
            "how to create favicon", "favicon for wordpress", "favicon for shopify",
            "favicon for react", "favicon for next.js", "manifest icon generator",
            "favicon best size", "favicon transparent background",
            "favicon generator 2025", "best free favicon tool",
            "favicon from logo", "round favicon generator", "gradient favicon maker",
            "favicon download png", "favicon download ico",
            "android chrome icon generator", "ms tile icon generator",
            "favicon generator with preview", "multi size favicon generator",
            "favicon generator all sizes", "custom favicon online free"
          ].map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          40+ trending keywords across 2025 search intent categories.
        </p>
      </section>
    </div>
  );
};

export default FaviconGeneratorSeoContent;
