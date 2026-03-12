import { memo, useMemo } from "react";

interface ToolUniqueContentProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolFrom: string;
  toolTo: string;
  toolCategory: string;
}

/**
 * Universal auto-generated SEO content for ALL tools.
 * Produces 400+ words of unique, factual content per tool page.
 * Covers: procedural guide, benefits, technical details, use cases, and trust signals.
 * Designed for Google Discover eligibility and E-E-A-T compliance.
 */
const ToolUniqueContent = memo(({
  toolId,
  toolName,
  toolDescription,
  toolFrom,
  toolTo,
  toolCategory,
}: ToolUniqueContentProps) => {
  const content = useMemo(() => {
    const fromUpper = toolFrom.toUpperCase();
    const toUpper = toolTo.toUpperCase();
    const isConverter = toolCategory === "image" || toolId.includes("-to-");
    const isPDF = toolCategory === "pdf" || toolId.includes("pdf");
    const isAudio = toolCategory === "audio" || toolId.includes("audio");
    const isVideo = toolCategory === "video" || toolId.includes("video");
    const isText = toolCategory === "text";
    const isHealth = toolCategory === "health";
    const isGenerator = toolCategory === "generator";

    const categoryLabel = isConverter ? "File Conversion" : isPDF ? "PDF Processing" : isAudio ? "Audio Editing" : isVideo ? "Video Editing" : isText ? "Text Processing" : isHealth ? "Health & Wellness" : isGenerator ? "Generator" : "Utility";

    const useCases = isConverter
      ? [
          `Convert ${fromUpper} files to ${toUpper} for social media, web publishing, or archiving.`,
          `Batch convert multiple ${fromUpper} files to ${toUpper} in seconds.`,
          `Optimize file size while maintaining visual quality during ${fromUpper} to ${toUpper} conversion.`,
          `Prepare files for print, email attachments, or platform-specific format requirements.`,
        ]
      : isPDF
      ? [
          "Process PDF documents for business, legal, or educational workflows.",
          "Manage PDF files without installing desktop software like Adobe Acrobat.",
          "Handle sensitive documents securely with local browser-based processing.",
          "Prepare PDFs for sharing, archiving, or regulatory compliance.",
        ]
      : isAudio
      ? [
          "Edit audio for podcasts, music production, or voiceover projects.",
          "Process audio files for social media content creation.",
          "Prepare audio for presentations, e-learning, or streaming platforms.",
          "Handle audio editing tasks without installing professional DAW software.",
        ]
      : isVideo
      ? [
          "Create video content for social media, marketing, or personal projects.",
          "Edit video clips directly in your browser without heavy software.",
          "Prepare video for different platforms with optimized settings.",
          "Process video files quickly for time-sensitive content delivery.",
        ]
      : [
          `Use ${toolName} for personal, professional, or educational projects.`,
          `Access ${toolName} from any device without downloading software.`,
          `Complete tasks quickly with our optimized browser-based processing.`,
          `Handle sensitive data securely with 100% local processing.`,
        ];

    const technicalDetails = isConverter
      ? `${toolName} uses WebAssembly-powered algorithms to convert ${fromUpper} to ${toUpper} directly in your browser. The conversion engine preserves metadata, color profiles, and quality settings. Batch processing is supported for converting multiple files simultaneously, with results downloadable individually or as a ZIP archive.`
      : isPDF
      ? `${toolName} leverages advanced PDF processing libraries running entirely in your browser via WebAssembly. This means your documents never leave your device — no server uploads, no cloud storage, no data retention. The tool handles standard and complex PDF structures with high fidelity.`
      : `${toolName} uses modern web APIs and efficient client-side algorithms to deliver fast, reliable results. All processing occurs locally in your browser, ensuring your data remains private and secure. The tool is optimized for both desktop and mobile performance.`;

    return { categoryLabel, useCases, technicalDetails, isConverter, fromUpper, toUpper };
  }, [toolId, toolName, toolDescription, toolFrom, toolTo, toolCategory]);

  return (
    <section
      className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6 prose prose-sm dark:prose-invert max-w-none"
      aria-labelledby="tool-guide"
    >
      <h2 id="tool-guide" className="text-lg sm:text-xl font-bold text-foreground mb-4">
        {toolName} – Complete Guide &amp; Features
      </h2>

      <p className="text-muted-foreground">
        <strong>{toolName}</strong> by AnyFile Flow is a free, browser-based {content.categoryLabel.toLowerCase()} tool that {toolDescription.toLowerCase()}.
        Designed for speed, privacy, and ease of use, it works on any device — desktop, tablet, or smartphone — without registration or software installation.
      </p>

      <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Key Features</h3>
      <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
        <li><strong>100% Browser-Based:</strong> No file uploads to external servers. Your data stays on your device.</li>
        <li><strong>Unlimited & Free:</strong> No usage limits, no watermarks, no premium tiers, no account required.</li>
        <li><strong>Cross-Platform:</strong> Works on Chrome, Firefox, Safari, Edge on Windows, macOS, Linux, iOS, and Android.</li>
        <li><strong>Batch Processing:</strong> Handle multiple files at once for faster workflows.</li>
        <li><strong>High Quality Output:</strong> Optimized algorithms ensure the best possible result quality.</li>
        {content.isConverter && (
          <li><strong>Format Preservation:</strong> Maintains metadata, color profiles, and resolution during {content.fromUpper} to {content.toUpper} conversion.</li>
        )}
      </ul>

      <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Common Use Cases</h3>
      <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
        {content.useCases.map((useCase, i) => (
          <li key={i}>{useCase}</li>
        ))}
      </ul>

      <h3 className="text-base font-semibold text-foreground mt-6 mb-2">How It Works</h3>
      <p className="text-sm text-muted-foreground">{content.technicalDetails}</p>

      <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Privacy &amp; Security</h3>
      <p className="text-sm text-muted-foreground">
        AnyFile Flow takes your privacy seriously. {toolName} processes everything locally using your browser's built-in capabilities.
        No files are transmitted over the internet. No data is stored on our servers. When you close the tab, all temporary data is automatically cleared.
        This makes it ideal for handling sensitive, confidential, or proprietary files.
      </p>

      <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Why AnyFile Flow?</h3>
      <p className="text-sm text-muted-foreground">
        With over 1000 free online tools, AnyFile Flow (also known as AnyFileFlow or Any File Flow) is one of the most comprehensive
        file processing platforms available. Founded by Aman Rauniyar, AnyFile Flow is built on the principles of accessibility,
        privacy, and quality — providing professional-grade tools to everyone, for free. Every tool is designed to deliver
        fast results with zero compromise on security.
      </p>

      <div className="mt-4 p-4 bg-secondary/40 rounded-xl not-prose">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Bookmark this page or share it with colleagues. {toolName} is always free and available 24/7 at AnyFile Flow.
        </p>
      </div>
    </section>
  );
});

ToolUniqueContent.displayName = "ToolUniqueContent";

export default ToolUniqueContent;
