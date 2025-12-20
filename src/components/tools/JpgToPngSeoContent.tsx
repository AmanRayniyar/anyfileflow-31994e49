import { CheckCircle, Upload, Download, Shield, Smartphone, Zap, Lock, HelpCircle, FileImage, Globe, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const JpgToPngSeoContent = () => {
  // Schema.org structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://anyfileflow.com/tool/jpg-to-png#software",
        "name": "JPG to PNG Converter Online",
        "applicationCategory": "MultimediaApplication",
        "applicationSubCategory": "Image Converter",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "permissions": "none",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "12847"
        },
        "featureList": [
          "Convert JPG to PNG online free",
          "Transparency support",
          "Lossless quality conversion",
          "Bulk convert up to 20 images",
          "No registration required",
          "Browser-based processing"
        ],
        "author": {
          "@type": "Person",
          "name": "Aman Rauniyar"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://anyfileflow.com/tool/jpg-to-png#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anyfileflow.com" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://anyfileflow.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "JPG to PNG Converter", "item": "https://anyfileflow.com/tool/jpg-to-png" }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://anyfileflow.com/tool/jpg-to-png#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is this JPG to PNG converter free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AnyFile Flow is completely free. Convert unlimited JPG images to PNG format without any cost, registration, or watermarks."
            }
          },
          {
            "@type": "Question",
            "name": "Does converting JPG to PNG improve image quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Converting JPG to PNG preserves current quality and prevents further degradation. PNG uses lossless compression, so your converted images won't lose quality in future edits."
            }
          },
          {
            "@type": "Question",
            "name": "Can I add transparency after converting to PNG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Converting to PNG enables transparency support. You can then use an image editor to remove the background and create transparent areas."
            }
          },
          {
            "@type": "Question",
            "name": "Why is PNG file larger than JPG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PNG uses lossless compression that preserves all image data, resulting in larger files. JPG uses lossy compression, discarding some data for smaller sizes."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert multiple JPG files at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can upload and convert up to 20 JPG images simultaneously. Download them individually or as a ZIP file."
            }
          },
          {
            "@type": "Question",
            "name": "Is my data safe when using this converter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. All processing happens locally in your browser. Your images never leave your device or get uploaded to any server."
            }
          },
          {
            "@type": "Question",
            "name": "Does this work on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AnyFile Flow works on all devices including Android phones, iPhones, tablets, and desktop computers. No app installation needed."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between JPG and JPEG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JPG and JPEG are the same format. The different extensions exist due to historical file naming limitations. Both work identically with this converter."
            }
          },
          {
            "@type": "Question",
            "name": "When should I use PNG instead of JPG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use PNG for logos, graphics, icons, images with text, or any image needing transparency. Use JPG for photographs and images where smaller file size matters more than perfect quality."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a file size limit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There's no strict limit, but very large files may take longer to process depending on your device. Most images convert in seconds."
            }
          }
        ]
      }
    ]
  };

  return (
    <article className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6 prose prose-sm sm:prose-base max-w-none dark:prose-invert">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* SEO-Optimized Intro Section */}
      <section className="mb-8 not-prose">
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Convert JPG images to PNG format instantly with this free online tool. AnyFile Flow's JPG to PNG converter runs entirely in your browser—no file uploads to external servers, no registration required. Get lossless PNG output with transparency support, perfect for logos, graphics, and images that need crisp edges. Process up to 20 images at once and download individually or as a ZIP file.
        </p>
      </section>

      {/* Key Features Grid */}
      <section className="mb-8 sm:mb-10 not-prose" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          Key Features
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <Zap className="h-6 w-6 text-primary mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">Instant Conversion</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <Layers className="h-6 w-6 text-blue-500 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">Transparency Support</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <FileImage className="h-6 w-6 text-green-500 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">Lossless Quality</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <Shield className="h-6 w-6 text-orange-500 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">100% Private</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <Smartphone className="h-6 w-6 text-purple-500 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">Works on All Devices</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-secondary/50 rounded-xl">
            <Globe className="h-6 w-6 text-teal-500 mb-2" aria-hidden="true" />
            <span className="text-sm font-medium">No Signup Required</span>
          </div>
        </div>
      </section>

      {/* How To Convert Section */}
      <section className="mb-8 sm:mb-10 bg-secondary/30 rounded-2xl p-5 sm:p-7 not-prose" id="how-to-convert" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          How to Convert JPG to PNG
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Upload className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">1. Upload</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to select up to 20 JPG files.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">2. Convert</h3>
              <p className="text-sm text-muted-foreground">Conversion happens instantly in your browser.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Download className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">3. Download</h3>
              <p className="text-sm text-muted-foreground">Save files individually or download all as ZIP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Convert JPG to PNG */}
      <section className="mb-8 sm:mb-10 not-prose" id="why-convert" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          Why Convert JPG to PNG?
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-foreground">Transparency support</strong>
              <span className="text-muted-foreground"> — PNG supports alpha channels for transparent backgrounds, essential for logos and overlays.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-foreground">Lossless quality</strong>
              <span className="text-muted-foreground"> — Unlike JPG, PNG doesn't degrade with repeated edits. Ideal for graphics that need further editing.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-foreground">Sharp edges and text</strong>
              <span className="text-muted-foreground"> — PNG preserves crisp lines without the artifacts that JPG compression creates.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-foreground">Design software compatibility</strong>
              <span className="text-muted-foreground"> — PNG works seamlessly with Photoshop, Canva, Figma, and other design tools.</span>
            </div>
          </div>
        </div>
      </section>

      {/* JPG vs PNG Comparison */}
      <section className="mb-8 sm:mb-10 not-prose" id="jpg-vs-png" aria-labelledby="comparison-heading">
        <h2 id="comparison-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          JPG vs PNG Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 sm:p-4 font-semibold text-foreground border-b border-border">Feature</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-foreground border-b border-border">JPG</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-foreground border-b border-border">PNG</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-card">
                <td className="p-3 sm:p-4 border-b border-border">Transparency</td>
                <td className="p-3 sm:p-4 border-b border-border text-red-500">No</td>
                <td className="p-3 sm:p-4 border-b border-border text-green-500">Yes</td>
              </tr>
              <tr className="bg-secondary/20">
                <td className="p-3 sm:p-4 border-b border-border">Compression</td>
                <td className="p-3 sm:p-4 border-b border-border">Lossy</td>
                <td className="p-3 sm:p-4 border-b border-border text-green-500">Lossless</td>
              </tr>
              <tr className="bg-card">
                <td className="p-3 sm:p-4 border-b border-border">File Size</td>
                <td className="p-3 sm:p-4 border-b border-border text-green-500">Smaller</td>
                <td className="p-3 sm:p-4 border-b border-border">Larger</td>
              </tr>
              <tr className="bg-secondary/20">
                <td className="p-3 sm:p-4 border-b border-border">Best For</td>
                <td className="p-3 sm:p-4 border-b border-border">Photos</td>
                <td className="p-3 sm:p-4 border-b border-border">Graphics, logos, icons</td>
              </tr>
              <tr className="bg-card">
                <td className="p-3 sm:p-4">Sharp Edges</td>
                <td className="p-3 sm:p-4">Can blur</td>
                <td className="p-3 sm:p-4 text-green-500">Crystal clear</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Want a deeper comparison? Read our guide: <Link to="/blog" className="text-primary hover:underline">JPG vs PNG: Which Image Format Is Better in 2025?</Link>
        </p>
      </section>

      {/* Security & Privacy */}
      <section className="mb-8 sm:mb-10 bg-green-500/10 border border-green-500/20 rounded-2xl p-5 sm:p-7 not-prose" id="security" aria-labelledby="security-heading">
        <h2 id="security-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-500" aria-hidden="true" />
          Security & Privacy
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Browser-Only Processing</h3>
              <p className="text-sm text-muted-foreground">Files never leave your device. All conversion happens locally.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">No Server Uploads</h3>
              <p className="text-sm text-muted-foreground">Your images stay private—nothing is sent to external servers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">No Data Collection</h3>
              <p className="text-sm text-muted-foreground">No tracking, no logs, no storage of your files.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Built by Aman Rauniyar</h3>
              <p className="text-sm text-muted-foreground">AnyFile Flow is independently developed with privacy as a core principle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-8 sm:mb-10 not-prose" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Is this JPG to PNG converter free?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Yes, AnyFile Flow is completely free. Convert unlimited JPG images to PNG format without any cost, registration, or watermarks.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Does converting JPG to PNG improve image quality?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Converting preserves current quality and prevents further degradation. PNG uses lossless compression, so your converted images won't lose quality in future edits.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Can I add transparency after converting to PNG?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Converting to PNG enables transparency support. You can then use an image editor to remove the background and create transparent areas.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Why is PNG file larger than JPG?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              PNG uses lossless compression that preserves all image data, resulting in larger files. JPG uses lossy compression, discarding some data for smaller sizes.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Can I convert multiple JPG files at once?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Yes, upload and convert up to 20 JPG images simultaneously. Download them individually or as a ZIP file.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Is my data safe when using this converter?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Absolutely. All processing happens locally in your browser. Your images never leave your device or get uploaded to any server.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Does this work on mobile devices?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Yes, AnyFile Flow works on all devices including Android, iPhone, tablets, and desktop computers. No app installation needed.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              What's the difference between JPG and JPEG?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              JPG and JPEG are the same format. The different extensions exist due to historical file naming limitations. Both work identically.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              When should I use PNG instead of JPG?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              Use PNG for logos, graphics, icons, images with text, or any image needing transparency. Use JPG for photographs where smaller file size matters more.
            </div>
          </details>
          
          <details className="group bg-card border border-border rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-foreground hover:bg-secondary/30 transition-colors text-sm">
              Is there a file size limit?
              <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0 text-muted-foreground text-sm">
              There's no strict limit, but very large files may take longer depending on your device. Most images convert in seconds.
            </div>
          </details>
        </div>
      </section>

      {/* Related Tools - Internal Linking */}
      <section className="mb-6 not-prose" id="related-tools" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          Related Image Tools
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link 
            to="/tool/png-to-jpg" 
            className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <FileImage className="h-4 w-4 text-primary" aria-hidden="true" />
            PNG to JPG Converter
          </Link>
          <Link 
            to="/tool/webp-to-png" 
            className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <FileImage className="h-4 w-4 text-primary" aria-hidden="true" />
            WebP to PNG Converter
          </Link>
          <Link 
            to="/tool/image-compressor" 
            className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <FileImage className="h-4 w-4 text-primary" aria-hidden="true" />
            Image Compressor
          </Link>
          <Link 
            to="/tool/image-cropper" 
            className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors text-sm font-medium text-foreground"
          >
            <FileImage className="h-4 w-4 text-primary" aria-hidden="true" />
            Image Cropper
          </Link>
        </div>
      </section>
    </article>
  );
};

export default JpgToPngSeoContent;
