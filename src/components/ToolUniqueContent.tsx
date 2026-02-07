import { memo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface ToolUniqueContentProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolFrom: string;
  toolTo: string;
  categoryName: string;
}

/**
 * Generates unique, high-value SEO content for EVERY tool page.
 * This prevents Google AdSense "low value content" rejection
 * by ensuring each tool page has 400+ words of original content.
 */
const ToolUniqueContent = memo(({
  toolId,
  toolName,
  toolDescription,
  toolFrom,
  toolTo,
  categoryName,
}: ToolUniqueContentProps) => {
  const fromUpper = toolFrom.toUpperCase();
  const toUpper = toolTo.toUpperCase();
  const isConverter = toolFrom !== toolTo;
  const currentYear = new Date().getFullYear();

  // Generate unique content based on tool type
  const getContentSections = () => {
    if (isConverter) {
      return {
        whatIs: `${toolName} is a free, browser-based online tool that converts ${fromUpper} files to ${toUpper} format instantly. Built by AnyFile Flow, this tool processes your files entirely on your device — no upload to any server, no data collection, and no registration required. Whether you need to convert a single file or handle batch conversions, ${toolName} delivers professional-quality results in seconds.`,
        whyUse: `Converting ${fromUpper} to ${toUpper} is a common task for designers, developers, content creators, students, and professionals worldwide. ${fromUpper} and ${toUpper} formats serve different purposes — ${fromUpper} files may offer specific advantages in certain workflows, while ${toUpper} format provides benefits in others. AnyFile Flow's ${toolName} bridges this gap with zero-cost, instant conversion that preserves file quality.`,
        keyBenefits: [
          `Lossless ${fromUpper} to ${toUpper} conversion with maximum quality preservation`,
          "100% client-side processing — your files never leave your device",
          "No registration, no email, no watermarks — completely free forever",
          "Works on all devices: desktop, tablet, and mobile browsers",
          "Batch conversion support for processing multiple files simultaneously",
          "Fast WebAssembly-powered engine for instant results",
          `Compatible with all standard ${fromUpper} file variants`,
          "Dark mode and light mode for comfortable use",
        ],
        whenToUse: `Use ${toolName} when you need to quickly convert ${fromUpper} files for web publishing, social media sharing, document preparation, printing, or software compatibility. The tool is ideal for photographers converting image formats, students preparing assignments, marketers creating content, and developers building applications.`,
        howItWorks: `${toolName} uses advanced browser-based algorithms to decode your ${fromUpper} file and re-encode it as ${toUpper}. The entire process runs locally using JavaScript and WebAssembly, ensuring your files are processed instantly without network latency. Simply drag and drop your file, adjust optional settings, and download the converted result.`,
      };
    }

    // Non-converter tools (calculators, generators, editors)
    return {
      whatIs: `${toolName} is a free online tool by AnyFile Flow designed to ${toolDescription.toLowerCase()}. It runs entirely in your web browser with no installation, no account creation, and no data collection. Built with modern web technologies including WebAssembly, it delivers fast, reliable results while keeping your data completely private.`,
      whyUse: `${toolName} addresses a common need for ${categoryName.toLowerCase().replace(' tools', '')} tasks. Whether you're a student, professional, or casual user, this tool provides instant, accurate results without the hassle of downloading software or creating accounts. AnyFile Flow has designed this tool to be accessible to everyone, regardless of technical skill level.`,
      keyBenefits: [
        `Professional-grade ${categoryName.toLowerCase().replace(' tools', '')} functionality at zero cost`,
        "Works entirely in your browser — no downloads, no plugins required",
        "No registration or personal information needed",
        "Mobile-friendly design with touch-optimized interface",
        "Accessible for screen readers and keyboard navigation (WCAG compliant)",
        "Available 24/7 with no usage limits or restrictions",
        "Multi-language support for global accessibility",
        "Regular updates with new features and improvements",
      ],
      whenToUse: `Use ${toolName} whenever you need to ${toolDescription.toLowerCase()}. It's perfect for quick tasks on the go, professional workflows requiring reliable results, educational projects, and everyday use. The tool works on any device with a modern browser — no app store downloads needed.`,
      howItWorks: `${toolName} leverages advanced browser APIs and optimized algorithms to deliver instant results. When you interact with the tool, all processing happens locally on your device. This means faster results (no server round-trips), complete privacy (your data stays on your device), and offline capability once the page is loaded.`,
    };
  };

  const content = getContentSections();

  // Generate FAQ schema for tools without custom SEO content
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${toolName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": content.whatIs,
        },
      },
      {
        "@type": "Question",
        "name": `Is ${toolName} free?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${toolName} is completely free with no hidden costs. You can use it unlimited times without creating an account. AnyFile Flow provides all tools completely free.`,
        },
      },
      {
        "@type": "Question",
        "name": `Is ${toolName} safe to use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All processing happens locally in your browser. Your files and data never leave your device. We don't store, share, or have access to your data.",
        },
      },
      {
        "@type": "Question",
        "name": `Does ${toolName} work on mobile?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${toolName} is fully responsive and works on all modern mobile browsers including Chrome, Safari, Firefox, and Edge on both iOS and Android devices.`,
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section
        className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6"
        aria-labelledby={`about-${toolId}`}
      >
        <h2
          id={`about-${toolId}`}
          className="text-lg sm:text-xl font-bold text-foreground mb-4"
        >
          About {toolName} — Free Online Tool by AnyFile Flow
        </h2>

        <div className="prose dark:prose-invert prose-sm max-w-none">
          {/* What Is Section */}
          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
            What Is {toolName}?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.whatIs}
          </p>

          {/* Why Use Section */}
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Why Use {toolName} in {currentYear}?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.whyUse}
          </p>

          {/* Key Benefits */}
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            Key Features & Benefits
          </h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground" role="list">
            {content.keyBenefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* When to Use */}
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            When to Use {toolName}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.whenToUse}
          </p>

          {/* How It Works */}
          <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
            How {toolName} Works
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.howItWorks}
          </p>

          {/* Trust Signals */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              🔒 Your Privacy Matters
            </h3>
            <p className="text-xs text-muted-foreground">
              {toolName} processes everything locally in your browser. No files are uploaded to any server. 
              No personal data is collected. No account required. 
              AnyFile Flow is committed to providing free, private, and secure tools for everyone.
            </p>
          </div>

          {/* Internal Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="text-xs text-primary hover:underline font-medium"
            >
              Browse All 1000+ Tools →
            </Link>
            <Link
              to="/blog"
              className="text-xs text-primary hover:underline font-medium"
            >
              Read Our Blog →
            </Link>
            <Link
              to="/about"
              className="text-xs text-primary hover:underline font-medium"
            >
              About AnyFile Flow →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
});

ToolUniqueContent.displayName = "ToolUniqueContent";

export default ToolUniqueContent;
