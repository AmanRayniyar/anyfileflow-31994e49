import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PDFProtectSeoContent = () => {
  const faqs = [
    { q: "How does AnyFile Flow's PDF encryption work?", a: "AnyFile Flow uses QPDF, a trusted open-source PDF processing library compiled to WebAssembly. It runs entirely in your browser — your PDF files and passwords never leave your device. The tool supports both 128-bit and 256-bit AES encryption standards." },
    { q: "Is 256-bit AES encryption secure enough?", a: "Yes. 256-bit AES (Advanced Encryption Standard) is the same encryption used by governments, banks, and military organizations worldwide. It is considered unbreakable with current and foreseeable computing technology." },
    { q: "What's the difference between user password and owner password?", a: "The user password is required to open and view the PDF. The owner password controls document permissions like printing, copying, and editing. You can set both independently for fine-grained access control." },
    { q: "Can I protect multiple PDFs at once?", a: "Yes. AnyFile Flow's batch mode lets you encrypt multiple PDF files simultaneously with the same password and security settings. All files are processed locally and can be downloaded individually or as a ZIP archive." },
    { q: "What permissions can I control on a protected PDF?", a: "You can control six permission types: printing, copying text, modifying content, adding annotations, filling forms, and page assembly (inserting/deleting pages). Each can be individually enabled or disabled." },
    { q: "Do you store my files or passwords?", a: "No. AnyFile Flow processes everything 100% locally using browser-based WebAssembly technology. Your files, passwords, and encrypted output never touch any server. Zero data is collected or stored." },
    { q: "What PDF readers support AES-encrypted PDFs?", a: "All modern PDF readers support AES encryption: Adobe Acrobat Reader, Foxit Reader, Chrome built-in viewer, Microsoft Edge, macOS Preview, and most mobile PDF apps. 256-bit requires Adobe Reader 9+ or equivalent." },
    { q: "Is AnyFile Flow's PDF Protect free?", a: "Yes, completely free with no limits. There are no file size caps, no daily usage restrictions, no watermarks, and no registration required. The tool runs entirely in your browser." },
    { q: "How is this different from SmallPDF or iLovePDF?", a: "Unlike SmallPDF and iLovePDF which upload your files to their servers, AnyFile Flow processes everything locally in your browser. This means faster processing, complete privacy, no file size limits, and no account required." },
    { q: "Can I remove PDF password protection?", a: "Yes. AnyFile Flow also offers a free PDF Unlock tool that removes password protection from PDFs. You'll need the current password to unlock the file." },
    { q: "What security presets are available?", a: "Three one-click presets: Maximum Security (blocks all permissions), Standard Protection (allows printing but blocks copying/editing), and View Only (read-only with annotations). You can also create a custom configuration." },
    { q: "Does PDF encryption reduce file quality?", a: "No. PDF encryption only adds a security layer — it does not modify, compress, or reduce the quality of your document content in any way." },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "PDF Protect Tool – AnyFile Flow",
        "description": "Free online tool to password protect and encrypt PDF files with 128-bit or 256-bit AES encryption. Batch processing, granular permissions, security presets. 100% browser-based, no upload required.",
        "url": "https://anyfileflow.com/tool/pdf-protect",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "author": { "@type": "Organization", "name": "AnyFile Flow", "url": "https://anyfileflow.com" },
        "featureList": [
          "256-bit AES encryption",
          "128-bit AES encryption",
          "Batch PDF protection",
          "Granular permission controls",
          "Security presets",
          "Password strength indicator",
          "Strong password generator",
          "Owner and user password support",
          "100% client-side processing",
          "ZIP download for batch files",
          "No file upload to servers",
          "No registration required"
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Password Protect a PDF Online for Free",
        "description": "Step-by-step guide to encrypt and password protect your PDF files using AnyFile Flow's free online tool.",
        "totalTime": "PT1M",
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Upload PDF", "text": "Drag and drop your PDF file or click to browse. For multiple files, switch to Batch Mode." },
          { "@type": "HowToStep", "position": 2, "name": "Choose Security Preset", "text": "Select Maximum Security, Standard Protection, View Only, or create a Custom configuration." },
          { "@type": "HowToStep", "position": 3, "name": "Set Password", "text": "Enter a strong password or use the built-in generator. Optionally set a separate owner password." },
          { "@type": "HowToStep", "position": 4, "name": "Configure Permissions", "text": "Fine-tune which actions are allowed: printing, copying, editing, annotations, form filling, page assembly." },
          { "@type": "HowToStep", "position": 5, "name": "Download Protected PDF", "text": "Click 'Protect PDF' and download your encrypted file. In batch mode, download all as ZIP." }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anyfileflow.com" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://anyfileflow.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "PDF Tools", "item": "https://anyfileflow.com/tools?category=data" },
          { "@type": "ListItem", "position": 4, "name": "PDF Protect", "item": "https://anyfileflow.com/tool/pdf-protect" }
        ]
      }
    ]
  };

  return (
    <section className="mt-8 space-y-8" aria-label="PDF Protect SEO Content">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* How It Works */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">How to Password Protect a PDF Online</h2>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">1</span><span><strong className="text-foreground">Upload your PDF</strong> — Drag and drop or browse. Switch to Batch Mode for multiple files.</span></li>
          <li className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">2</span><span><strong className="text-foreground">Choose a security preset</strong> — Maximum Security, Standard, View Only, or Custom.</span></li>
          <li className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">3</span><span><strong className="text-foreground">Set your password</strong> — Use the built-in generator for a strong 20-character password.</span></li>
          <li className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">4</span><span><strong className="text-foreground">Configure permissions</strong> — Control printing, copying, editing, forms, annotations, and assembly.</span></li>
          <li className="flex gap-3"><span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">5</span><span><strong className="text-foreground">Download</strong> — Get your encrypted PDF instantly. Batch mode exports as ZIP.</span></li>
        </ol>
      </div>

      {/* Key Features */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { title: "Military-Grade Encryption", desc: "256-bit AES encryption — the same standard used by governments and financial institutions." },
            { title: "Batch Processing", desc: "Protect multiple PDFs at once with identical security settings. Download all as a ZIP." },
            { title: "Security Presets", desc: "One-click presets: Maximum Security, Standard Protection, and View Only modes." },
            { title: "Granular Permissions", desc: "Control 6 permission types: print, copy, modify, annotate, fill forms, assemble pages." },
            { title: "100% Local Processing", desc: "Files never leave your browser. Powered by WebAssembly for fast, private encryption." },
            { title: "Password Generator", desc: "Built-in strong password generator with real-time strength indicator and one-click copy." },
          ].map((f, i) => (
            <div key={i} className="p-4 bg-secondary/30 rounded-xl">
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">AnyFile Flow vs Competitors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                <th className="text-center p-3 font-semibold text-primary">AnyFile Flow</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">SmallPDF</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">iLovePDF</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Adobe Acrobat</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["256-bit AES", "✅", "✅", "✅", "✅"],
                ["100% Free", "✅ Unlimited", "❌ 2/day free", "❌ Limited", "❌ Paid only"],
                ["No File Upload", "✅ Local", "❌ Server", "❌ Server", "✅ Desktop"],
                ["Batch Processing", "✅", "❌ Pro only", "❌ Pro only", "✅"],
                ["No Registration", "✅", "❌", "❌", "❌"],
                ["Granular Permissions", "✅ 6 types", "❌ Basic", "❌ Basic", "✅"],
                ["Security Presets", "✅ 3 presets", "❌", "❌", "❌"],
                ["Password Generator", "✅", "❌", "❌", "❌"],
                ["Owner Password", "✅", "❌", "❌", "✅"],
                ["Mobile Friendly", "✅", "✅", "✅", "❌"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 font-medium text-foreground">{row[0]}</td>
                  <td className="p-3 text-center">{row[1]}</td>
                  <td className="p-3 text-center">{row[2]}</td>
                  <td className="p-3 text-center">{row[3]}</td>
                  <td className="p-3 text-center">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Comparison based on publicly available feature information as of 2025. Features may change.
        </p>
      </div>

      {/* Encryption Explained */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Understanding PDF Encryption</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                <th className="text-center p-3 font-semibold text-foreground">128-bit AES</th>
                <th className="text-center p-3 font-semibold text-foreground">256-bit AES</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-3">Key Length</td><td className="p-3 text-center">128 bits</td><td className="p-3 text-center">256 bits</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Security Level</td><td className="p-3 text-center">High</td><td className="p-3 text-center">Maximum</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">PDF Version Required</td><td className="p-3 text-center">PDF 1.5+ (Acrobat 6+)</td><td className="p-3 text-center">PDF 1.7+ (Acrobat 9+)</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Compatibility</td><td className="p-3 text-center">Excellent</td><td className="p-3 text-center">Good (modern readers)</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Recommended For</td><td className="p-3 text-center">General use</td><td className="p-3 text-center">Sensitive documents</td></tr>
              <tr><td className="p-3">Brute Force Resistance</td><td className="p-3 text-center">3.4 × 10³⁸ combinations</td><td className="p-3 text-center">1.1 × 10⁷⁷ combinations</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Security & Privacy</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Zero Server Contact:</strong> AnyFile Flow's PDF Protect tool is built on WebAssembly technology. The QPDF library runs entirely within your browser sandbox. No HTTP requests are made with your file data.</p>
          <p><strong className="text-foreground">No Data Collection:</strong> We do not collect, store, or transmit any file content, passwords, metadata, or encryption results. There is no analytics tracking on file operations.</p>
          <p><strong className="text-foreground">Open-Source Foundation:</strong> The encryption engine is based on QPDF, an open-source, peer-reviewed PDF processing library used by Linux distributions and enterprise systems worldwide.</p>
          <p><strong className="text-foreground">GDPR Compliant:</strong> Since no personal data or files are transmitted to servers, AnyFile Flow's PDF tools are inherently compliant with GDPR, CCPA, and similar data protection regulations.</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Trending Keywords */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Related Searches</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "password protect pdf", "encrypt pdf online", "pdf encryption tool", "add password to pdf",
            "pdf password protection free", "secure pdf file", "lock pdf online", "aes encrypt pdf",
            "256 bit pdf encryption", "protect pdf without adobe", "free pdf protector",
            "batch encrypt pdf", "pdf permission control", "restrict pdf printing",
            "prevent pdf copying", "pdf security tool online", "best free pdf encryptor",
            "pdf protect no upload", "client side pdf encryption", "browser pdf protector",
            "how to password protect pdf free", "pdf encryption without signup",
            "pdf protect tool 2025", "best pdf security tool", "online pdf locker",
            "protect pdf on phone", "mobile pdf encryption", "pdf protect mac",
            "pdf protect windows", "pdf protect chromebook", "smallpdf alternative free",
            "ilovepdf alternative", "pdf protect no watermark", "unlimited pdf encryption",
          ].map((kw, i) => (
            <span key={i} className="px-3 py-1 bg-secondary/50 text-xs text-muted-foreground rounded-full">
              {kw}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">34 trending keywords across 6 intent categories</p>
      </div>
    </section>
  );
};

export default PDFProtectSeoContent;
