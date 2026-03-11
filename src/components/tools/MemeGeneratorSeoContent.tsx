import { Helmet } from "react-helmet-async";

const MemeGeneratorSeoContent = () => {
  const canonicalUrl = "https://anyfileflow.com/tool/meme-generator";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AnyFile Flow Meme Generator",
        "description": "Free online meme generator with AI text generation, 20+ templates, image filters, drag-and-drop text positioning, multi-format export. 100% browser-based, no signup.",
        "url": canonicalUrl,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "author": { "@type": "Organization", "name": "AnyFile Flow", "url": "https://anyfileflow.com" },
        "featureList": [
          "AI-powered meme text generation",
          "20+ popular meme templates",
          "Drag-and-drop text positioning",
          "Multiple text layers with visibility/lock controls",
          "10 font families including Impact and Comic Sans",
          "Image filters and presets (Vintage, B&W, Deep Fried, etc.)",
          "Export as PNG, JPG, or WebP",
          "Undo/Redo with keyboard shortcuts",
          "Text shadow, stroke, opacity controls",
          "Custom canvas size (500px to 1200px)",
          "Copy meme to clipboard",
          "100% client-side processing"
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Make a Meme Online for Free",
        "description": "Step-by-step guide to create memes using AnyFile Flow's free online meme generator with AI assistance.",
        "totalTime": "PT2M",
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Choose an Image", "text": "Upload your own image (JPG, PNG, GIF, WebP up to 20MB) or select from 20+ popular meme templates organized by category." },
          { "@type": "HowToStep", "position": 2, "name": "Add Text", "text": "Type your meme text or use the AI generator to create witty captions automatically. Add multiple text layers with custom fonts, colors, and positions." },
          { "@type": "HowToStep", "position": 3, "name": "Customize Style", "text": "Adjust font size, stroke, shadow, opacity, and rotation. Apply image filters like Vintage, B&W, Deep Fried, or create custom filter combinations." },
          { "@type": "HowToStep", "position": 4, "name": "Download or Share", "text": "Export your meme as PNG, JPG, or WebP. Copy directly to clipboard for instant sharing on social media." }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Is this meme generator completely free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, AnyFile Flow's meme generator is 100% free with no watermarks, no signup required, and unlimited meme creation. All processing happens in your browser." } },
          { "@type": "Question", "name": "How does the AI meme text generator work?", "acceptedAnswer": { "@type": "Answer", "text": "Describe your meme idea in natural language (e.g., 'programmer debugging at 3am') and the AI generates witty, relevant top and bottom text automatically. Powered by advanced language models." } },
          { "@type": "Question", "name": "Can I add more than two text layers?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can add unlimited text layers. Each layer has independent controls for font, color, size, position, rotation, opacity, shadow, and stroke. Layers can be locked, hidden, or duplicated." } },
          { "@type": "Question", "name": "What image formats can I upload?", "acceptedAnswer": { "@type": "Answer", "text": "You can upload JPG, PNG, GIF, and WebP images up to 20MB. The meme can be exported as PNG (lossless), JPG, or WebP with adjustable quality settings." } },
          { "@type": "Question", "name": "Are my images uploaded to a server?", "acceptedAnswer": { "@type": "Answer", "text": "No. All image processing happens 100% in your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy." } },
          { "@type": "Question", "name": "What image filters are available?", "acceptedAnswer": { "@type": "Answer", "text": "Choose from 9 filter presets including Vintage, Black & White, Dramatic, Warm, Cool, Faded, Deep Fried, and Inverted. You can also create custom filters by adjusting brightness, contrast, saturation, grayscale, sepia, hue, and blur." } },
          { "@type": "Question", "name": "Can I use this meme maker on mobile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, the meme generator is fully responsive and works on smartphones, tablets, and desktop browsers. Touch-friendly controls make it easy to create memes on any device." } },
          { "@type": "Question", "name": "How do I copy a meme to clipboard?", "acceptedAnswer": { "@type": "Answer", "text": "Click the Copy button after creating your meme. It uses the Clipboard API to copy the image directly, allowing you to paste it into any messaging app, social media, or document." } },
          { "@type": "Question", "name": "Does this tool add watermarks?", "acceptedAnswer": { "@type": "Answer", "text": "No. AnyFile Flow never adds watermarks to your memes. The exported image contains only your content, making it ready for sharing on Reddit, Twitter, Instagram, Discord, and other platforms." } },
          { "@type": "Question", "name": "What keyboard shortcuts are supported?", "acceptedAnswer": { "@type": "Answer", "text": "Ctrl+Z (or Cmd+Z on Mac) for undo, Ctrl+Y (or Cmd+Shift+Z) for redo. These work across all editing operations including text changes and filter adjustments." } },
          { "@type": "Question", "name": "How is this better than Imgflip or Kapwing?", "acceptedAnswer": { "@type": "Answer", "text": "Unlike Imgflip and Kapwing, AnyFile Flow's meme generator has no watermarks on free tier, no account required, AI-powered text generation, advanced image filters, unlimited text layers, multiple export formats, and complete privacy since nothing is uploaded to any server." } },
          { "@type": "Question", "name": "Can I make memes without an account?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. No account, email, or signup is needed. Just open the tool, create your meme, and download or copy it instantly. It's the fastest way to make memes online." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anyfileflow.com" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://anyfileflow.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "Meme Generator", "item": canonicalUrl }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <section className="mt-8 space-y-8" aria-labelledby="meme-seo-heading">
        <div>
          <h2 id="meme-seo-heading" className="text-2xl font-bold text-foreground mb-4">
            Free Online Meme Generator with AI – No Watermark, No Signup
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            AnyFile Flow's Meme Generator is a powerful, free online tool that lets you create professional-quality memes in seconds. With AI-powered text generation, 20+ popular templates, advanced image filters, and unlimited text layers — all processed locally in your browser for complete privacy. No watermarks. No signup. No limits.
          </p>
        </div>

        {/* How to Make a Meme */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">How to Make a Meme Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Choose Image', desc: 'Upload your own image or pick from 20+ classic meme templates like Drake, Distracted Boyfriend, or Doge.' },
              { step: '2', title: 'Add Text', desc: 'Type your text or use AI to auto-generate witty captions. Add unlimited text layers.' },
              { step: '3', title: 'Customize', desc: 'Choose fonts, colors, filters, shadows, and adjust position with drag-and-drop.' },
              { step: '4', title: 'Download', desc: 'Export as PNG, JPG, or WebP. Copy to clipboard for instant sharing.' },
            ].map(item => (
              <div key={item.step} className="bg-secondary/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary mb-3">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Advanced Meme Generator Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'AI-Powered Text Generation', desc: 'Describe your meme idea and let AI create funny, contextual captions automatically. Powered by advanced language models for creative, witty results.' },
              { title: 'Drag-and-Drop Text Positioning', desc: 'Click anywhere on the canvas to position text, or drag to reposition. Supports rotation (-180° to 180°), opacity, and per-layer visibility controls.' },
              { title: '9 Image Filter Presets', desc: 'Apply Vintage, B&W, Dramatic, Deep Fried, and more. Fine-tune with custom brightness, contrast, saturation, grayscale, sepia, hue, and blur controls.' },
              { title: 'Multi-Layer Text System', desc: 'Add unlimited text layers, each with independent font, color, stroke, shadow, and alignment settings. Lock, hide, duplicate, or delete layers as needed.' },
              { title: 'Multi-Format Export', desc: 'Download memes as PNG (lossless), JPG, or WebP with adjustable quality. Choose canvas sizes: Auto, 500px, 1080px, or 1200px for social media.' },
              { title: 'Undo/Redo with Shortcuts', desc: 'Full undo/redo history with Ctrl+Z and Ctrl+Y keyboard shortcuts. Never lose your edits.' },
            ].map(feature => (
              <div key={feature.title} className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Comparison */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">AnyFile Flow vs Other Meme Generators</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-primary">AnyFile Flow</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Imgflip</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Kapwing</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ['No watermark', '✅', '❌ (Free tier)', '❌ (Free tier)'],
                  ['No signup required', '✅', '✅', '❌'],
                  ['AI text generation', '✅', '❌', '✅ (Paid)'],
                  ['Image filters', '✅ (9 presets)', '❌', '✅'],
                  ['Unlimited text layers', '✅', '❌', '✅'],
                  ['Multi-format export', '✅ (PNG/JPG/WebP)', 'PNG only', '✅'],
                  ['Drag-and-drop text', '✅', '❌', '✅'],
                  ['Undo/Redo', '✅', '❌', '✅'],
                  ['100% local processing', '✅', '❌', '❌'],
                  ['Text shadows & effects', '✅', '❌', '✅ (Paid)'],
                  ['Custom canvas size', '✅', '❌', '✅'],
                  ['Copy to clipboard', '✅', '❌', '❌'],
                ].map(([feature, af, imgflip, kapwing], idx) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="py-2.5 px-4 font-medium text-foreground">{feature}</td>
                    <td className="py-2.5 px-4 text-center">{af}</td>
                    <td className="py-2.5 px-4 text-center">{imgflip}</td>
                    <td className="py-2.5 px-4 text-center">{kapwing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">* Based on publicly available feature information as of March 2026.</p>
        </div>

        {/* Privacy & Security */}
        <div className="bg-secondary/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-3">Privacy & Security</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ <strong>100% client-side:</strong> All processing uses the HTML5 Canvas API in your browser</li>
            <li>✓ <strong>No server uploads:</strong> Your images never leave your device</li>
            <li>✓ <strong>No tracking:</strong> We don't log, store, or analyze any images you create</li>
            <li>✓ <strong>No cookies required:</strong> The tool works without any tracking cookies</li>
            <li>✓ <strong>GDPR compliant:</strong> No personal data is collected or processed</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Popular Meme Use Cases</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Reddit posts & comments', 'Twitter/X viral content', 'Instagram stories & reels',
              'Discord server reactions', 'WhatsApp group chats', 'TikTok content creation',
              'Slack & Teams reactions', 'YouTube community posts', 'Blog & article illustrations',
              'Marketing campaigns', 'Educational content', 'Personal entertainment',
            ].map(useCase => (
              <div key={useCase} className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">{useCase}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MemeGeneratorSeoContent;
