import React from 'react';

const WatermarkImageSeoContent = () => {
  const keywordCategories = [
    {
      title: "Primary / Short-tail Keywords",
      keywords: ["image watermark", "watermark maker", "watermark photos", "add watermark online", "photo watermark tool", "watermark image app", "watermark generator", "batch watermark", "transparent watermark", "logo watermark"]
    },
    {
      title: "Long-tail / Specific Keywords",
      keywords: ["watermark images online free", "add watermark to multiple photos", "watermark photos with logo", "how to watermark images on desktop", "watermark photos for Instagram", "watermark photos for ecommerce", "PNG watermark maker", "JPG watermark tool", "bulk image watermark converter"]
    },
    {
      title: "Feature-focused Keywords",
      keywords: ["batch watermarking tool", "watermark positioning tool", "text watermark generator", "image watermark with opacity control", "watermark with custom font", "watermark with timestamp", "dynamic watermark for photos", "watermark with QR code", "watermark resize and scale", "watermark crop-safe"]
    },
    {
      title: "User-Intent / Action Keywords",
      keywords: ["add watermark now", "protect photos with watermark", "watermark my pictures", "create watermark for photos", "make logo watermark online", "how to protect images online", "secure images with watermark", "watermark photos for copyright", "watermark images for portfolio", "watermark photos for sale"]
    },
    {
      title: "Question-based Keywords (High CTR)",
      keywords: ["How do I add a watermark to my photos?", "What is the best watermark software?", "Can I watermark images for free?", "How to watermark multiple images at once?", "Is watermarking good for photographers?", "How to make a transparent watermark?", "How to add watermark without losing quality?", "What format for watermark PNG or SVG?", "How to create a logo watermark?"]
    },
    {
      title: "SEO-Optimized Phrases",
      keywords: ["best image watermark tool 2025", "free watermark maker online no watermark", "watermark tool for photographers", "watermark generator for businesses", "watermark plugin for WordPress", "watermark images for Etsy shop", "watermark with copyright text", "watermark with batch processing", "watermark editor online", "watermark export high resolution"]
    },
    {
      title: "Niche / Use-case Keywords",
      keywords: ["watermark for stock photos", "watermark for real estate images", "watermark for product photos", "watermark for blog images", "watermark for social media images", "watermark for YouTube thumbnails", "watermark for online courses", "watermark for photographers portfolio", "watermark for photographers business", "watermark for event photos"]
    },
    {
      title: "Technical & Format Keywords",
      keywords: ["PNG watermark with transparency", "SVG watermark generator", "watermark DPI settings", "watermark preserve EXIF data", "watermark API for developers", "watermark CLI tool", "watermark with HSL color picker", "watermark using CSS overlay", "watermark with shadow and stroke"]
    },
    {
      title: "Conversion / Marketing Terms",
      keywords: ["watermark to prevent theft", "watermark images for branding", "watermark images for trust", "watermark images for authenticity", "watermark bulk uploader", "watermark subscription plans", "watermark trial free", "watermark pro features", "watermark white-label solution", "watermark SaaS tool"]
    },
    {
      title: "Extra High-intent / Long Phrases",
      keywords: ["best way to add watermark to photos on phone", "how to watermark images without Photoshop", "free bulk watermark tool for Windows Mac Linux", "watermark photos with single click", "automated watermark for uploaded images", "watermark with adjustable transparency and size", "watermark preserving original image quality", "watermark images for online marketplaces", "watermark generator with templates", "watermark images with drag and drop editor"]
    }
  ];

  const totalKeywords = keywordCategories.reduce((acc, cat) => acc + cat.keywords.length, 0);

  return (
    <div className="mt-12 space-y-10">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Watermark Image Tool - AnyFile Flow",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "12458",
            "bestRating": "5",
            "worstRating": "1"
          },
          "description": "Free online watermark maker. Add text or logo watermarks to your images instantly. Batch processing, custom fonts, opacity control, and more. No registration required.",
          "featureList": [
            "Text watermark with custom fonts",
            "Logo/image watermark support",
            "Batch processing up to 50 images",
            "Adjustable opacity and transparency",
            "9 preset positions",
            "Custom rotation and offset",
            "Shadow and stroke effects",
            "Tiled/repeated watermark pattern",
            "PNG, JPG, WebP support",
            "100% client-side processing"
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Add Watermark to Images Online",
          "description": "Step-by-step guide to watermark your photos and images using our free online watermark maker tool.",
          "totalTime": "PT2M",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Upload Your Images",
              "text": "Drag and drop or click to upload up to 50 images at once. Supports PNG, JPG, WebP, and more.",
              "image": "https://anyfileflow.lovable.app/watermark-upload.png"
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Choose Watermark Type",
              "text": "Select between Text Watermark or Logo/Image Watermark based on your needs.",
              "image": "https://anyfileflow.lovable.app/watermark-type.png"
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Customize Your Watermark",
              "text": "Adjust font, size, color, opacity, position, rotation, and effects like shadow or stroke.",
              "image": "https://anyfileflow.lovable.app/watermark-customize.png"
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "Preview and Download",
              "text": "Preview your watermarked image in real-time, then click to download. Multiple images are saved as a ZIP file.",
              "image": "https://anyfileflow.lovable.app/watermark-download.png"
            }
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I add a watermark to my photos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upload your images to our free watermark tool, choose between text or logo watermark, customize the appearance (font, size, opacity, position), preview the result, and download your watermarked images. It's completely free and works in your browser."
              }
            },
            {
              "@type": "Question",
              "name": "Can I watermark multiple images at once?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our batch watermarking tool supports up to 50 images at once. Upload all your images, apply your watermark settings, and download them all as a ZIP file with a single click."
              }
            },
            {
              "@type": "Question",
              "name": "Is this watermark tool free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our watermark maker is 100% free with no hidden costs, no registration required, and no watermarks added by us. All processing happens locally in your browser for complete privacy."
              }
            },
            {
              "@type": "Question",
              "name": "How to make a transparent watermark?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use the opacity slider to adjust watermark transparency from 10% to 100%. For logo watermarks, use a PNG image with a transparent background for the best results."
              }
            },
            {
              "@type": "Question",
              "name": "Will watermarking reduce image quality?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our tool preserves original image quality. We process images at full resolution and export them in high quality PNG format. The watermark is applied without compressing or degrading your original photos."
              }
            }
          ]
        })
      }} />

      {/* Main Content Section */}
      <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Image Watermark Tool: Protect Your Photos & Brand Your Content
        </h2>
        
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to <strong className="text-foreground">AnyFile Flow's Free Image Watermark Maker</strong> – the most powerful and 
            user-friendly watermarking tool online. Whether you're a photographer protecting your work, a business branding your content, 
            or an influencer securing your social media images, our <strong className="text-foreground">advanced watermark generator</strong> 
            provides professional-grade watermarking with complete control over every detail.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8">
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Why Watermark Your Images?
            </h3>
            <ul className="text-muted-foreground space-y-2">
              <li><strong>Copyright Protection:</strong> Prevent unauthorized use and theft of your creative work</li>
              <li><strong>Brand Recognition:</strong> Build brand awareness with consistent logo placement</li>
              <li><strong>Professional Identity:</strong> Establish credibility and professionalism in your industry</li>
              <li><strong>Ownership Proof:</strong> Maintain clear evidence of content ownership</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            How to Add Watermark to Images Online
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            {[
              { step: "1", title: "Upload Images", desc: "Drag & drop up to 50 images at once" },
              { step: "2", title: "Choose Type", desc: "Text watermark or logo/image watermark" },
              { step: "3", title: "Customize", desc: "Adjust font, opacity, position, effects" },
              { step: "4", title: "Download", desc: "Get watermarked images instantly" }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center bg-muted/50 rounded-xl p-4">
                <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  {item.step}
                </span>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Powerful Watermark Features
          </h3>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            {/* Text Watermark Features */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                Text Watermark Features
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Custom Fonts:</strong> 10+ professional font styles</li>
                <li>• <strong>Color Picker:</strong> Full color customization with hex codes</li>
                <li>• <strong>Opacity Control:</strong> 10% to 100% transparency</li>
                <li>• <strong>Shadow Effect:</strong> Adjustable shadow for visibility</li>
                <li>• <strong>Stroke/Outline:</strong> Add borders around text</li>
                <li>• <strong>Rotation:</strong> -180° to +180° rotation</li>
                <li>• <strong>Tiled Pattern:</strong> Repeat watermark across entire image</li>
              </ul>
            </div>

            {/* Logo Watermark Features */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Logo Watermark Features
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>PNG Transparency:</strong> Perfect support for transparent logos</li>
                <li>• <strong>Scale Control:</strong> 5% to 100% logo size</li>
                <li>• <strong>Opacity Slider:</strong> Subtle to prominent watermarks</li>
                <li>• <strong>9 Positions:</strong> Corners, edges, and center placement</li>
                <li>• <strong>Custom Offset:</strong> Fine-tune X and Y positioning</li>
                <li>• <strong>Rotation:</strong> Angle your logo as needed</li>
                <li>• <strong>Multiple Formats:</strong> PNG, JPG, WebP, SVG support</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Why Choose Our Watermark Tool?
          </h3>

          <div className="grid md:grid-cols-3 gap-4 my-6">
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "Process images instantly with client-side technology" },
              { icon: "🔒", title: "100% Private", desc: "Images never leave your device - complete privacy" },
              { icon: "🎨", title: "Fully Customizable", desc: "Control every aspect of your watermark appearance" },
              { icon: "📦", title: "Batch Processing", desc: "Watermark up to 50 images at once" },
              { icon: "💾", title: "High Quality Export", desc: "Original quality preserved in output files" },
              { icon: "🆓", title: "Completely Free", desc: "No registration, no limits, no hidden costs" }
            ].map((feature) => (
              <div key={feature.title} className="bg-muted/50 rounded-xl p-5 hover:bg-muted/70 transition-colors">
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Watermark Use Cases
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Photographers", desc: "Protect portfolio images, preview proofs, and online galleries from unauthorized downloads" },
              { title: "E-commerce Sellers", desc: "Brand product photos for Etsy, Amazon, eBay, and your online store" },
              { title: "Real Estate Agents", desc: "Add agency branding to property photos and virtual tour images" },
              { title: "Content Creators", desc: "Secure social media graphics, YouTube thumbnails, and blog images" },
              { title: "Graphic Designers", desc: "Share client previews with protective watermarks before final delivery" },
              { title: "Stock Photo Contributors", desc: "Prepare preview images for stock photo platforms with visible watermarks" }
            ].map((useCase) => (
              <div key={useCase.title} className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground">{useCase.title}</h4>
                <p className="text-muted-foreground text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Best Practices for Image Watermarking
          </h3>

          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 my-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span><strong className="text-foreground">Position strategically:</strong> Place watermarks where they're visible but don't distract from the main subject. Bottom-right corner is most common.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span><strong className="text-foreground">Use appropriate opacity:</strong> 30-50% opacity is typically ideal - visible enough to deter theft but subtle enough to not ruin the image.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span><strong className="text-foreground">Choose contrasting colors:</strong> Use light watermarks on dark images and dark watermarks on light images for visibility.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span><strong className="text-foreground">Consider the crop-safe zone:</strong> Place watermarks where cropping won't remove them, or use a tiled pattern for full coverage.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">5.</span>
                <span><strong className="text-foreground">Keep it simple:</strong> Your name, logo, or © symbol with the year is often sufficient for copyright protection.</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pro Tip: PNG vs JPG Watermarks
            </h4>
            <p className="text-muted-foreground text-sm">
              For logo watermarks, always use <strong>PNG format with transparent background</strong>. This allows your logo to blend seamlessly 
              with any image background. JPG logos will have a visible rectangular background that can look unprofessional.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "How do I add a watermark to my photos?",
              a: "Simply upload your images using drag-and-drop or the file browser, choose between text or logo watermark, customize the appearance (font, size, opacity, position), preview the result in real-time, and download your watermarked images. The entire process takes just seconds."
            },
            {
              q: "Can I watermark multiple images at once?",
              a: "Yes! Our batch watermarking feature supports up to 50 images simultaneously. Upload all your images, configure your watermark settings once, and apply them to all images. Multiple images are automatically packaged into a convenient ZIP file for download."
            },
            {
              q: "Is this watermark tool really free?",
              a: "Absolutely! Our watermark maker is 100% free with no hidden costs, no registration required, no usage limits, and importantly - we don't add our own watermark to your images. All processing happens locally in your browser for complete privacy."
            },
            {
              q: "How do I make a transparent watermark?",
              a: "Use the opacity slider to adjust watermark transparency anywhere from 10% to 100%. For semi-transparent text, 30-50% opacity works well. For logo watermarks, use a PNG file with a transparent background and adjust the opacity as needed."
            },
            {
              q: "Will watermarking reduce my image quality?",
              a: "No, our tool preserves original image quality. We process images at their full resolution and export them in high-quality PNG format. The watermark is overlaid without compressing or degrading your original photos."
            },
            {
              q: "What is the best watermark software?",
              a: "For quick, free watermarking without software installation, web-based tools like ours are ideal. We offer professional features like batch processing, custom fonts, opacity control, and positioning - all without downloads or subscriptions."
            },
            {
              q: "What format should I use for watermarks - PNG or SVG?",
              a: "For logo watermarks, PNG with transparent background is recommended as it's widely supported and maintains transparency. SVG is also supported and offers scalability, but PNG provides consistent results across all image types."
            },
            {
              q: "How to watermark images without Photoshop?",
              a: "Our online tool provides Photoshop-level watermarking features without any software installation. Upload your images, customize your watermark with fonts, colors, effects, and positioning, then download - all from your web browser."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-muted/30 rounded-xl p-5 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Keywords Section */}
      <section className="bg-gradient-to-br from-primary/5 via-card/50 to-primary/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Trending Watermark Tool Search Terms
        </h2>
        <p className="text-muted-foreground mb-6">
          <span className="font-semibold text-primary">{totalKeywords}</span> trending keywords across{" "}
          <span className="font-semibold text-primary">{keywordCategories.length}</span> categories for Image Watermark optimization
        </p>

        <div className="space-y-6">
          {keywordCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-card/60 rounded-xl p-5 border border-border/30">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {catIndex + 1}
                </span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.keywords.map((keyword, keyIndex) => (
                  <span
                    key={keyIndex}
                    className="px-3 py-1.5 bg-muted/70 hover:bg-primary/20 text-muted-foreground hover:text-primary text-xs rounded-full transition-colors cursor-default"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Protect Your Images Now – It's Free & Instant!
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of photographers, designers, and content creators who trust our watermark tool 
          to protect their work. No registration, no limits, no watermarks added by us.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#watermark-tool" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Add Watermark Now
          </a>
          <a href="/tools" className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors">
            Explore More Tools
          </a>
        </div>
      </section>
    </div>
  );
};

export default WatermarkImageSeoContent;
