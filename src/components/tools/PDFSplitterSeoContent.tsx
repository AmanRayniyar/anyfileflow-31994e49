import { Helmet } from "react-helmet-async";

const PDFSplitterSeoContent = () => {
  const canonicalUrl = "https://anyfileflow.com/tool/pdf-splitter";

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "PDF Splitter – Free Online PDF Page Splitter",
        description:
          "Split PDF files by page range, every N pages, extract specific pages, or split by file size. 100% free, browser-based, no upload required.",
        url: canonicalUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        author: {
          "@type": "Organization",
          name: "AnyFile Flow",
          url: "https://anyfileflow.com",
        },
      },
      {
        "@type": "HowTo",
        name: "How to Split a PDF Online for Free",
        description:
          "Step-by-step guide to splitting PDF files into smaller parts using AnyFile Flow's free PDF Splitter tool.",
        totalTime: "PT1M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Upload Your PDF",
            text: "Drag and drop your PDF file or click to browse. The file loads instantly in your browser.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Choose Split Method",
            text: "Select a split mode: page ranges, every N pages, extract specific pages, or split by file size.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Configure Settings",
            text: "Set page ranges, select individual pages, or define the max file size per output PDF.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Download Results",
            text: "Click Split PDF and download individual files or all results as a single ZIP archive.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this PDF splitter really free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, AnyFile Flow's PDF Splitter is 100% free with no hidden costs, no watermarks, and no signup required. Use it unlimited times.",
            },
          },
          {
            "@type": "Question",
            name: "Are my PDF files uploaded to a server?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. All processing happens locally in your browser using WebAssembly. Your files never leave your device, ensuring complete privacy.",
            },
          },
          {
            "@type": "Question",
            name: "What split modes are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Four modes: (1) Page Ranges – define custom from-to ranges, (2) Every N Pages – split at regular intervals, (3) Extract Pages – pick individual pages, (4) By File Size – split so each part stays under a size limit.",
            },
          },
          {
            "@type": "Question",
            name: "Can I split a password-protected PDF?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The tool attempts to load encrypted PDFs. If the PDF requires a user password to open, you'll need to unlock it first using our free PDF Unlock tool.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a page or file size limit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "There's no hard limit since processing is browser-based. Files up to 100+ pages work smoothly on most devices. Very large files may take longer depending on your device's memory.",
            },
          },
          {
            "@type": "Question",
            name: "Can I split a PDF on my phone?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The PDF Splitter is fully responsive and works on iOS, Android, and any mobile browser without installing an app.",
            },
          },
          {
            "@type": "Question",
            name: "How do I split a PDF by file size?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Select the 'By File Size' mode, set your max size (1–50 MB), and click Split. The tool automatically distributes pages so each output file stays under your limit – perfect for email attachments.",
            },
          },
          {
            "@type": "Question",
            name: "Can I download all split parts at once?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. After splitting, click 'Download All as ZIP' to get every part in a single archive.",
            },
          },
          {
            "@type": "Question",
            name: "Does splitting reduce PDF quality?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The tool copies pages exactly as they are – fonts, images, vectors, and annotations are preserved without re-compression or quality loss.",
            },
          },
          {
            "@type": "Question",
            name: "What browsers are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "All modern browsers: Chrome, Firefox, Safari, Edge, Opera, and Brave on desktop and mobile.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://anyfileflow.com" },
          { "@type": "ListItem", position: 2, name: "Tools", item: "https://anyfileflow.com/tools" },
          { "@type": "ListItem", position: 3, name: "PDF Splitter", item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(combinedSchema)}</script>
      </Helmet>

      <section className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6 space-y-8" aria-labelledby="pdf-splitter-seo">
        {/* Main heading */}
        <div>
          <h2 id="pdf-splitter-seo" className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            PDF Splitter Online – Free, Private & Unlimited
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            AnyFile Flow's <strong>PDF Splitter</strong> lets you break any PDF into smaller files directly in your browser. 
            Whether you need to extract a single page, split by custom ranges, divide at regular intervals, or keep each part 
            under a file-size limit, this tool handles it all — <strong>free, private, and with zero quality loss</strong>.
          </p>
        </div>

        {/* How It Works */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">How to Split a PDF in 4 Steps</h3>
          <ol className="space-y-3 text-sm text-muted-foreground" role="list">
            {[
              { step: "Upload", desc: "Drag-and-drop your PDF or click to browse. It loads instantly — nothing is uploaded to a server." },
              { step: "Choose Mode", desc: "Pick Page Ranges, Every N Pages, Extract Pages, or By File Size." },
              { step: "Configure", desc: "Define ranges (e.g. 1-3, 5, 7-10), select pages visually, or set a max MB per part." },
              { step: "Download", desc: "Get each part individually or grab everything in a single ZIP." },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{i + 1}</span>
                <span><strong className="text-foreground">{item.step}:</strong> {item.desc}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Split Modes Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Split Modes at a Glance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-3 font-semibold text-foreground">Mode</th>
                  <th className="text-left p-3 font-semibold text-foreground">Best For</th>
                  <th className="text-left p-3 font-semibold text-foreground">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="p-3 text-foreground font-medium">Page Ranges</td><td className="p-3 text-muted-foreground">Extracting chapters or sections</td><td className="p-3 text-muted-foreground">One PDF per range</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Every N Pages</td><td className="p-3 text-muted-foreground">Uniform splits (e.g. 10-page batches)</td><td className="p-3 text-muted-foreground">Equal-size parts</td></tr>
                <tr><td className="p-3 text-foreground font-medium">Extract Pages</td><td className="p-3 text-muted-foreground">Cherry-picking specific pages</td><td className="p-3 text-muted-foreground">Single PDF with selected pages</td></tr>
                <tr><td className="p-3 text-foreground font-medium">By File Size</td><td className="p-3 text-muted-foreground">Email attachments, upload limits</td><td className="p-3 text-muted-foreground">Parts under your size cap</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: "100% Browser-Based", desc: "Files stay on your device. No server uploads, no cloud storage, no privacy concerns." },
              { title: "Quick Range Input", desc: "Type '1-3, 5, 7-10' and instantly create multiple ranges — faster than any drag-and-drop UI." },
              { title: "Visual Page Selector", desc: "Click individual page numbers, or use Select All / Odd / Even shortcuts for fast extraction." },
              { title: "Size-Based Splitting", desc: "Set a max MB per output file — ideal when you need to email PDFs under 10 MB or 25 MB." },
              { title: "ZIP Download", desc: "Download all split parts in one click as a ZIP archive." },
              { title: "Zero Quality Loss", desc: "Pages are copied byte-for-byte. Fonts, images, and annotations remain untouched." },
              { title: "Works on Mobile", desc: "Fully responsive design works on phones and tablets — no app install needed." },
              { title: "No Watermarks", desc: "Output PDFs are clean — no AnyFile Flow branding or watermarks added." },
            ].map((f) => (
              <div key={f.title} className="p-3 bg-secondary/20 rounded-lg">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Common Use Cases</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground" role="list">
            {[
              "Extract a single chapter from an eBook",
              "Split invoices received in a combined PDF",
              "Send large reports under email attachment limits",
              "Separate scanned documents page-by-page",
              "Pull out specific pages for a presentation",
              "Archive sections of legal contracts individually",
              "Create handout PDFs from lecture slides",
              "Divide a portfolio into individual project sheets",
            ].map((uc) => (
              <li key={uc} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy & Security */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h3 className="text-base font-semibold text-foreground mb-2">Privacy & Security</h3>
          <p className="text-sm text-muted-foreground">
            Every byte of your PDF is processed <strong>locally in your browser</strong> using WebAssembly-powered libraries. 
            No file ever leaves your device — no server upload, no temporary storage, no analytics on your content. 
            When you close the tab, all data is gone. This makes AnyFile Flow one of the most privacy-respecting PDF tools available.
          </p>
        </div>

        {/* Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">AnyFile Flow vs. Other PDF Splitters</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                  <th className="text-left p-3 font-semibold text-foreground">AnyFile Flow</th>
                  <th className="text-left p-3 font-semibold text-foreground">SmallPDF</th>
                  <th className="text-left p-3 font-semibold text-foreground">iLovePDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="p-3 text-foreground">Price</td><td className="p-3 text-primary font-medium">Free</td><td className="p-3 text-muted-foreground">Freemium</td><td className="p-3 text-muted-foreground">Freemium</td></tr>
                <tr><td className="p-3 text-foreground">Server Upload</td><td className="p-3 text-primary font-medium">None</td><td className="p-3 text-muted-foreground">Yes</td><td className="p-3 text-muted-foreground">Yes</td></tr>
                <tr><td className="p-3 text-foreground">Split by Size</td><td className="p-3 text-primary font-medium">✓</td><td className="p-3 text-muted-foreground">✗</td><td className="p-3 text-muted-foreground">✗</td></tr>
                <tr><td className="p-3 text-foreground">Quick Range Input</td><td className="p-3 text-primary font-medium">✓</td><td className="p-3 text-muted-foreground">✗</td><td className="p-3 text-muted-foreground">✗</td></tr>
                <tr><td className="p-3 text-foreground">ZIP Download</td><td className="p-3 text-primary font-medium">✓</td><td className="p-3 text-muted-foreground">✓</td><td className="p-3 text-muted-foreground">✓</td></tr>
                <tr><td className="p-3 text-foreground">Watermarks</td><td className="p-3 text-primary font-medium">None</td><td className="p-3 text-muted-foreground">Free tier</td><td className="p-3 text-muted-foreground">None</td></tr>
                <tr><td className="p-3 text-foreground">Signup Required</td><td className="p-3 text-primary font-medium">No</td><td className="p-3 text-muted-foreground">Optional</td><td className="p-3 text-muted-foreground">Optional</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trending Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Trending Searches</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "split pdf online free", "pdf splitter", "split pdf pages", "extract pages from pdf",
              "divide pdf", "separate pdf pages", "pdf page extractor", "split pdf by page range",
              "split pdf by size", "break pdf into parts", "pdf cutter online", "split pdf no signup",
              "free pdf splitter no watermark", "split pdf on phone", "split pdf without upload",
              "browser pdf splitter", "client-side pdf split", "pdf splitter privacy",
              "split pdf for email", "extract single page from pdf", "pdf chapter extractor",
              "split scanned pdf", "pdf page separator", "split pdf into individual pages",
              "offline pdf splitter", "split large pdf", "pdf splitter tool 2025",
              "best free pdf splitter", "anyfileflow pdf splitter", "split pdf mac",
              "split pdf windows", "split pdf chromebook", "pdf splitter mobile",
              "split pdf without software", "secure pdf splitter", "private pdf splitter",
              "split pdf no limit", "unlimited pdf splitter", "fast pdf splitter",
              "pdf splitter alternative", "smallpdf alternative free",
            ].map((kw) => (
              <span key={kw} className="px-2 py-1 bg-secondary/40 text-xs text-muted-foreground rounded-md">
                {kw}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">40+ trending keywords • 6 categories</p>
        </div>
      </section>
    </>
  );
};

export default PDFSplitterSeoContent;
