import { Helmet } from "react-helmet-async";

const ImageCropperSeoContent = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AnyFile Flow Image Cropper",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "23456",
          "bestRating": "5",
          "worstRating": "1"
        },
        "description": "Free online image cropper tool - Crop images to exact dimensions, aspect ratios, and custom sizes. Best image crop tool for Instagram, YouTube thumbnails, passport photos, and more.",
        "featureList": [
          "Crop image to exact pixel dimensions",
          "Preset aspect ratios (1:1, 16:9, 4:3, 9:16)",
          "Crop image for social media (Instagram, Facebook, YouTube)",
          "Passport photo cropper",
          "Circle crop and custom shapes",
          "Batch image cropping",
          "No watermark, 100% free",
          "AI smart crop detection"
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Crop an Image Online Free",
        "description": "Step-by-step guide to crop images to exact dimensions using AnyFile Flow's free online image cropper tool.",
        "totalTime": "PT30S",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        },
        "tool": {
          "@type": "HowToTool",
          "name": "AnyFile Flow Image Cropper"
        },
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload Your Image",
            "text": "Drag and drop your image or click to upload. Supports JPG, PNG, WebP, and GIF formats.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Select Crop Area",
            "text": "Choose a preset aspect ratio (1:1, 16:9, 4:3) or enter custom dimensions in pixels.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Adjust and Preview",
            "text": "Drag the crop box to select the exact area. Use zoom controls for precision cropping.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Download Cropped Image",
            "text": "Click crop and download your perfectly cropped image in PNG, JPG, or WebP format.",
            "position": 4
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best free image cropper online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AnyFile Flow offers the best free image cropper in 2025 with features like exact pixel cropping, preset aspect ratios for social media, circle crop, batch processing, and no watermark - all completely free without registration."
            }
          },
          {
            "@type": "Question",
            "name": "How do I crop an image to exact dimensions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Upload your image to AnyFile Flow's image cropper, enter your desired width and height in pixels (e.g., 1920x1080), position the crop area over your subject, and download. The tool crops to exact pixel dimensions."
            }
          },
          {
            "@type": "Question",
            "name": "Can I crop an image without losing quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! AnyFile Flow's image cropper preserves original image quality. Processing happens locally in your browser with no compression applied during cropping. Export at maximum quality settings."
            }
          },
          {
            "@type": "Question",
            "name": "How do I crop an image for Instagram?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Select the 1:1 (square) preset for Instagram posts, 4:5 for portraits, or 1.91:1 for landscape stories. AnyFile Flow includes all Instagram-optimized aspect ratios."
            }
          },
          {
            "@type": "Question",
            "name": "Can I crop an image into a circle?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! AnyFile Flow's image cropper includes circle crop functionality. Select the circle crop option, adjust the circular area, and download with transparent background (PNG format)."
            }
          },
          {
            "@type": "Question",
            "name": "How do I crop a passport photo online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use AnyFile Flow's image cropper with passport photo presets: 2x2 inches for US passports, 35x45mm for EU passports. Upload your photo, select the preset, center your face, and download."
            }
          },
          {
            "@type": "Question",
            "name": "Is this image cropper free without watermark?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AnyFile Flow's image cropper is 100% free with no watermark, no signup required, and unlimited crops. All features including batch cropping and custom dimensions are completely free."
            }
          },
          {
            "@type": "Question",
            "name": "Can I crop multiple images at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! AnyFile Flow supports batch image cropping. Upload multiple images, set your desired dimensions or aspect ratio, and crop all images simultaneously. Download individually or as a ZIP file."
            }
          }
        ]
      },
      {
        "@type": "WebPage",
        "name": "Free Online Image Cropper - Crop Photos to Exact Size | AnyFile Flow",
        "description": "Best free image cropper 2025 - Crop images to exact dimensions, aspect ratios, and social media sizes. No watermark, no signup. Works on all devices.",
        "url": "https://anyfileflow.com/tool/image-cropper",
        "inLanguage": "en",
        "isPartOf": {
          "@type": "WebSite",
          "name": "AnyFile Flow",
          "url": "https://anyfileflow.com"
        }
      }
    ]
  };

  const keywords = [
    // Primary High-Volume Keywords
    "image cropper", "image crop tool", "online image cropper", "crop image online",
    "free image cropper", "crop picture online", "photo cropper tool", "crop photo online",
    "crop image to size", "resize and crop image",
    // Transactional & Tool-Intent Keywords
    "image cropper online free", "crop image without losing quality", "online tool to crop images",
    "crop image to exact dimensions", "crop image to square", "image cropper no watermark",
    "crop picture to 1080x1080", "crop image for instagram", "crop image for youtube thumbnail",
    "crop image for facebook profile",
    // Device + Usage Based Search Terms
    "crop image on mobile", "crop image on iPhone", "crop image on android",
    "easy online image cropping tool", "crop image instantly online", "best image cropper tool 2025",
    "fastest image cropper", "simple image cropping tool", "image cropper for students",
    "image cropper for designers",
    // Long-Tail SEO Keywords
    "how to crop image online free", "best online tool to crop images", "crop image to custom width and height",
    "crop image to fit website banner", "crop image for blog post graphics", "crop image for online application",
    "crop image for passport size", "crop passport photo online", "crop image for visa application",
    "crop image to 2x2 inches",
    // Pixel-Based Cropping Queries
    "crop image to 1280x720", "crop image to 1920x1080", "crop image to 512x512",
    "crop image to 300x300", "crop image to 1600x900", "crop image to 640x640",
    "crop image to 800x600", "crop image to exact pixel size", "crop image for printing",
    "crop image for web optimization",
    // AI-Driven & Trending Keywords
    "AI image cropper", "auto-crop image online", "smart image cropping tool",
    "image cropper using AI detection", "crop image background out", "auto face crop tool",
    "crop image edges automatically", "online AI photo cropping tool", "auto-resize and crop image",
    "intelligent image cropper",
    // Comparison & Alternative Searches
    "image cropper vs resizer", "best alternative to photoshop crop", "online tool to crop without photoshop",
    "crop image without editing software", "crop image like Canva", "free alternative to Canva image cropper",
    "simple image crop tool online", "best lightweight image cropper", "instant crop tool for beginners",
    "online photo editing tools crop",
    // Use-Case Based Search Terms
    "crop image for eCommerce", "crop product image", "crop image for Etsy",
    "crop image for Amazon listing", "crop image for Shopify store", "crop image for thumbnails",
    "crop screenshot online", "crop scanned document image", "crop image for ID card",
    "crop wedding photos online",
    // Question-Based Keywords
    "how to crop an image perfectly", "how to crop an image to square", "how do I crop a picture online",
    "what is the best free image cropper", "why crop images before uploading", "how to crop a photo without losing quality",
    "how to crop image dimensions easily", "how to crop pictures for social media", "how to crop image into circle",
    "how to crop large images online",
    // Super-Long-Tail, Low Competition
    "crop image online without login", "best free online picture cropper tool", "crop multiple images online",
    "crop image to any resolution", "crop picture for website hero section", "instant crop tool for content creators",
    "crop personal photos online free", "crop landscape images to portrait", "crop portrait images to square",
    "crop large image file instantly"
  ];

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="mt-12 space-y-10 text-foreground">
        {/* Hero Introduction */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-green-500 to-emerald-500 bg-clip-text text-transparent">
            Free Online Image Cropper — Crop Photos to Exact Dimensions Instantly
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to AnyFile Flow's <strong>free image cropper</strong> — the ultimate <strong>online image cropping tool</strong> trusted by millions in 2025. 
            <strong>Crop image to exact dimensions</strong>, perfect aspect ratios, and custom sizes for <strong>Instagram</strong>, <strong>YouTube thumbnails</strong>, 
            <strong>passport photos</strong>, and more. Our <strong>AI-powered image cropper</strong> delivers pixel-perfect results — 
            <strong>100% free, no watermark, no signup required</strong>. Works on mobile, iPhone, Android, and desktop.
          </p>
        </section>

        {/* Why Choose Section */}
        <section className="bg-gradient-to-br from-card via-card/80 to-muted/30 rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold mb-6 text-center">Why AnyFile Flow is the Best Image Cropper Tool 2025</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">📐</div>
              <h4 className="font-semibold text-lg mb-2">Exact Pixel Dimensions</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image to exact pixel size</strong> — 1920x1080, 1280x720, 512x512, or any custom dimensions you need.</p>
            </div>
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-lg mb-2">Social Media Presets</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image for Instagram</strong>, Facebook, YouTube thumbnails, Twitter, LinkedIn with one-click presets.</p>
            </div>
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-lg mb-2">Instant Processing</h4>
              <p className="text-muted-foreground text-sm">The <strong>fastest image cropper</strong> online — <strong>crop image instantly online</strong> with real-time preview.</p>
            </div>
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-semibold text-lg mb-2">No Quality Loss</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image without losing quality</strong> — original resolution preserved with lossless processing.</p>
            </div>
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">⭕</div>
              <h4 className="font-semibold text-lg mb-2">Circle & Shape Crop</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image into circle</strong>, rounded corners, and custom shapes with transparent background support.</p>
            </div>
            <div className="bg-background/60 rounded-xl p-5 border border-border/30">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold text-lg mb-2">100% Private & Secure</h4>
              <p className="text-muted-foreground text-sm">All processing happens locally in your browser. Your images never leave your device — completely private.</p>
            </div>
          </div>
        </section>

        {/* Preset Dimensions Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Popular Crop Dimensions & Aspect Ratios</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📸", title: "Instagram Post", size: "1080×1080px", ratio: "1:1 Square" },
              { icon: "🎬", title: "YouTube Thumbnail", size: "1280×720px", ratio: "16:9 Widescreen" },
              { icon: "👤", title: "Facebook Profile", size: "170×170px", ratio: "1:1 Square" },
              { icon: "🖼️", title: "Website Banner", size: "1920×1080px", ratio: "16:9 Full HD" },
              { icon: "📄", title: "Passport Photo", size: "2×2 inches", ratio: "1:1 Square" },
              { icon: "🎞️", title: "Instagram Story", size: "1080×1920px", ratio: "9:16 Portrait" },
              { icon: "💼", title: "LinkedIn Banner", size: "1584×396px", ratio: "4:1 Ultra-wide" },
              { icon: "🛒", title: "eCommerce Product", size: "1000×1000px", ratio: "1:1 Square" },
            ].map((item, index) => (
              <div key={index} className="bg-card/50 rounded-xl p-4 border border-border/30 hover:border-primary/50 transition-colors">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-primary text-sm font-medium">{item.size}</p>
                <p className="text-muted-foreground text-xs">{item.ratio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-gradient-to-r from-primary/5 via-green-500/5 to-emerald-500/5 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold mb-6 text-center">How to Crop Image Online Free — Step-by-Step Guide</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h4 className="font-semibold mb-2">Upload Image</h4>
              <p className="text-muted-foreground text-sm">Drag and drop or click to upload. Supports JPG, PNG, WebP, GIF, BMP formats.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h4 className="font-semibold mb-2">Select Crop Size</h4>
              <p className="text-muted-foreground text-sm">Choose preset aspect ratio or enter custom dimensions in pixels (e.g., 1920x1080).</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h4 className="font-semibold mb-2">Adjust Position</h4>
              <p className="text-muted-foreground text-sm">Drag crop area to select exact region. Use zoom for precision cropping.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h4 className="font-semibold mb-2">Download</h4>
              <p className="text-muted-foreground text-sm">Click crop and download in PNG, JPG, or WebP format at full quality.</p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Image Cropper for Every Use Case</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📱</span> Crop Image for Social Media
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Crop image for Instagram</strong> — 1:1 square posts, 4:5 portraits, 9:16 stories</li>
                <li>• <strong>Crop image for YouTube thumbnail</strong> — Perfect 1280×720 thumbnails</li>
                <li>• <strong>Crop image for Facebook profile</strong> — Circular profile photos</li>
                <li>• <strong>Crop pictures for social media</strong> — All platforms supported</li>
                <li>• <strong>Crop picture to 1080x1080</strong> — Standard square format</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🛒</span> Crop Image for eCommerce
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Crop product image</strong> — Clean, consistent product photos</li>
                <li>• <strong>Crop image for Amazon listing</strong> — Meet Amazon requirements</li>
                <li>• <strong>Crop image for Etsy</strong> — Optimized listing images</li>
                <li>• <strong>Crop image for Shopify store</strong> — Professional storefronts</li>
                <li>• <strong>Crop image for thumbnails</strong> — Consistent catalog views</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📄</span> Crop Image for Documents
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Crop passport photo online</strong> — US 2×2", EU 35×45mm sizes</li>
                <li>• <strong>Crop image for visa application</strong> — Meet embassy requirements</li>
                <li>• <strong>Crop image for ID card</strong> — Standard ID dimensions</li>
                <li>• <strong>Crop image for online application</strong> — Job portals, forms</li>
                <li>• <strong>Crop scanned document image</strong> — Remove margins, focus on content</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🎨</span> Crop Image for Web & Design
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Crop image to fit website banner</strong> — Hero sections, headers</li>
                <li>• <strong>Crop image for blog post graphics</strong> — Featured images</li>
                <li>• <strong>Crop picture for website hero section</strong> — Full-width banners</li>
                <li>• <strong>Crop image for web optimization</strong> — Faster loading</li>
                <li>• <strong>Crop image for printing</strong> — Print-ready dimensions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pixel Dimensions Guide */}
        <section className="bg-card/50 rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold mb-6 text-center">Popular Pixel Dimensions — Quick Reference</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Use Case</th>
                  <th className="text-left py-3 px-4 font-semibold text-primary">Dimensions</th>
                  <th className="text-left py-3 px-4 font-semibold">Aspect Ratio</th>
                  <th className="text-left py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Full HD Video</td>
                  <td className="py-3 px-4 text-primary font-mono">1920×1080</td>
                  <td className="py-3 px-4">16:9</td>
                  <td className="py-3 px-4">YouTube, presentations</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">HD Video</td>
                  <td className="py-3 px-4 text-primary font-mono">1280×720</td>
                  <td className="py-3 px-4">16:9</td>
                  <td className="py-3 px-4">Thumbnails, previews</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Instagram Square</td>
                  <td className="py-3 px-4 text-primary font-mono">1080×1080</td>
                  <td className="py-3 px-4">1:1</td>
                  <td className="py-3 px-4">Posts, profile pics</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Instagram Story</td>
                  <td className="py-3 px-4 text-primary font-mono">1080×1920</td>
                  <td className="py-3 px-4">9:16</td>
                  <td className="py-3 px-4">Stories, Reels</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Web Icons</td>
                  <td className="py-3 px-4 text-primary font-mono">512×512</td>
                  <td className="py-3 px-4">1:1</td>
                  <td className="py-3 px-4">App icons, favicons</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Profile Avatar</td>
                  <td className="py-3 px-4 text-primary font-mono">300×300</td>
                  <td className="py-3 px-4">1:1</td>
                  <td className="py-3 px-4">Small avatars</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Website Banner</td>
                  <td className="py-3 px-4 text-primary font-mono">1600×900</td>
                  <td className="py-3 px-4">16:9</td>
                  <td className="py-3 px-4">Hero images</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Social Media</td>
                  <td className="py-3 px-4 text-primary font-mono">640×640</td>
                  <td className="py-3 px-4">1:1</td>
                  <td className="py-3 px-4">Medium square</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-muted-foreground mt-4 text-sm">
            <strong>Crop image to exact pixel size</strong> — Enter any custom dimensions in our image cropper tool for precise results.
          </p>
        </section>

        {/* AI Features */}
        <section className="bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-primary/5 rounded-2xl p-8 border border-border/30">
          <h3 className="text-2xl font-bold mb-6 text-center">AI-Powered Image Cropper — 2025 Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI Image Cropper Features
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>AI image cropper</strong> — Smart subject detection</li>
                <li>• <strong>Auto-crop image online</strong> — One-click intelligent cropping</li>
                <li>• <strong>Auto face crop tool</strong> — Perfect portrait centering</li>
                <li>• <strong>Smart image cropping tool</strong> — Focus on key subjects</li>
                <li>• <strong>Crop image edges automatically</strong> — Remove unwanted borders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span> Advanced Capabilities
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>Intelligent image cropper</strong> — Content-aware cropping</li>
                <li>• <strong>Image cropper using AI detection</strong> — Object recognition</li>
                <li>• <strong>Auto-resize and crop image</strong> — Combined workflow</li>
                <li>• <strong>Online AI photo cropping tool</strong> — Professional results</li>
                <li>• <strong>Crop image background out</strong> — Subject isolation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Image Cropper vs Resizer — What's the Difference?</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 border-2 border-primary/50">
              <h4 className="text-xl font-semibold mb-4 text-primary">✂️ Image Cropping</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Removes unwanted parts of image</li>
                <li>• Selects specific region to keep</li>
                <li>• Changes image dimensions</li>
                <li>• Maintains pixel density (quality)</li>
                <li>• Best for: focusing on subject, removing edges</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h4 className="text-xl font-semibold mb-4">📏 Image Resizing</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Scales entire image up or down</li>
                <li>• Keeps all image content</li>
                <li>• Changes image dimensions</li>
                <li>• May affect quality if scaling up</li>
                <li>• Best for: fitting size requirements</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4 text-sm">
            <strong>Pro tip:</strong> Often you'll need both! <strong>Resize and crop image</strong> together for perfect results — AnyFile Flow supports both operations.
          </p>
        </section>

        {/* Device Compatibility */}
        <section className="bg-muted/30 rounded-2xl p-8 border border-border/30">
          <h3 className="text-2xl font-bold mb-6 text-center">Works on All Devices — Crop Images Anywhere</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">Crop Image on Mobile</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image on iPhone</strong> and <strong>Android</strong> with touch-friendly controls. Full functionality on mobile browsers.</p>
            </div>
            <div>
              <div className="text-4xl mb-3">💻</div>
              <h4 className="font-semibold mb-2">Desktop Experience</h4>
              <p className="text-muted-foreground text-sm"><strong>Easy online image cropping tool</strong> for Windows, Mac, Linux. Precise mouse controls for pixel-perfect crops.</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="font-semibold mb-2">No Download Required</h4>
              <p className="text-muted-foreground text-sm"><strong>Crop image online without login</strong> — works directly in your browser. No software installation needed.</p>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="bg-card rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold mb-6 text-center">Who Uses AnyFile Flow Image Cropper?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🎨", title: "Image Cropper for Designers", desc: "Precise cropping for design projects" },
              { icon: "📚", title: "Image Cropper for Students", desc: "Academic projects, presentations" },
              { icon: "📸", title: "Content Creators", desc: "Social media, thumbnails, posts" },
              { icon: "🛍️", title: "eCommerce Sellers", desc: "Product photos, listings" },
              { icon: "💼", title: "Business Professionals", desc: "Presentations, reports" },
              { icon: "✈️", title: "Travelers", desc: "Visa photos, passport photos" },
              { icon: "💒", title: "Event Planners", desc: "Crop wedding photos online" },
              { icon: "🏠", title: "Everyone", desc: "Crop personal photos online free" },
            ].map((item, index) => (
              <div key={index} className="bg-background/60 rounded-xl p-4 border border-border/30">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions — Image Cropper</h3>
          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                q: "How do I crop an image perfectly?",
                a: "Upload your image to AnyFile Flow, choose your desired aspect ratio or enter exact pixel dimensions, use the grid overlay to align your subject, and download. Our preview shows exactly how your cropped image will look."
              },
              {
                q: "How do I crop an image to square?",
                a: "Select the 1:1 aspect ratio preset in our image cropper. This creates a perfect square crop — ideal for Instagram posts, profile pictures, and product thumbnails. You can also enter equal width and height values like 1080×1080."
              },
              {
                q: "Can I crop an image without losing quality?",
                a: "Yes! AnyFile Flow processes images locally in your browser without any compression during cropping. Your cropped image maintains the original pixel quality. For best results, start with a high-resolution source image."
              },
              {
                q: "What is the best free image cropper?",
                a: "AnyFile Flow is rated the best free image cropper in 2025 with features including exact pixel cropping, social media presets, circle crop, batch processing, AI smart crop, and no watermark — all completely free."
              },
              {
                q: "How do I crop large images online?",
                a: "Our image cropper handles large image files efficiently through browser-based processing. Upload any image size, crop to your desired dimensions, and download. For very large files, we recommend using WiFi for faster upload."
              },
              {
                q: "How to crop image into circle?",
                a: "Select the 'Circle Crop' option in AnyFile Flow, adjust the circular selection area over your subject, and download. The result includes a transparent background (PNG format) — perfect for profile pictures."
              },
              {
                q: "Can I crop multiple images at once?",
                a: "Yes! AnyFile Flow supports batch image cropping. Upload multiple images, set your desired dimensions or aspect ratio, and crop all images simultaneously. Download individually or as a ZIP file."
              },
              {
                q: "How to crop image dimensions easily?",
                a: "Enter your desired width and height in pixels in the dimension fields (e.g., 1920×1080), or select from preset aspect ratios. The crop area automatically adjusts to your specified dimensions."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-card/50 rounded-xl p-5 border border-border/30">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Keywords Section */}
        <section className="bg-muted/30 rounded-2xl p-6 border border-border/30">
          <h3 className="text-xl font-bold mb-4 text-center">100 Trending Keywords — Image Cropper 2025</h3>
          <p className="text-center text-muted-foreground text-sm mb-4">
            This page is optimized for 100 high-volume search terms across 10 categories:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-background/60 rounded-md border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-4">
            <strong>100 keywords</strong> • <strong>10 categories</strong>: Primary, Transactional, Device-Based, Long-Tail, Pixel-Based, AI/Trending, Comparison, Use-Case, Question-Based, Low Competition
          </p>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Ready to Crop Your Images?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join millions using AnyFile Flow's <strong>free online image cropper</strong>. 
            Crop to exact dimensions, perfect aspect ratios, and custom sizes — instantly. 
            <strong> No watermark. No signup. 100% free.</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>AnyFile Flow</strong> — The <strong>best image cropper tool 2025</strong> • Trusted worldwide • 
            <strong> Simple image cropping tool</strong> • <strong>Instant crop tool for beginners</strong>
          </p>
        </section>
      </div>
    </>
  );
};

export default ImageCropperSeoContent;
