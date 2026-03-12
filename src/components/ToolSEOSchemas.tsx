import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { generateFAQs } from "@/components/ToolFAQSection";

interface ToolSEOSchemasProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolFrom: string;
  toolTo: string;
}

/**
 * Consolidated JSON-LD @graph schema for ALL tool pages.
 * Includes: SoftwareApplication, HowTo, WebPage, FAQPage, BreadcrumbList, Speakable.
 * Single script tag to prevent duplicate schema errors in Google Search Console.
 * Optimized for Google Discover eligibility and rich results.
 */
const ToolSEOSchemas = ({
  toolId,
  toolName,
  toolDescription,
  toolFrom,
  toolTo,
}: ToolSEOSchemasProps) => {
  const canonicalUrl = `https://anyfileflow.com/tool/${toolId}`;

  const combinedSchema = useMemo(() => {
    const faqs = generateFAQs(toolName, toolFrom, toolTo, toolDescription);

    return {
      "@context": "https://schema.org",
      "@graph": [
        // SoftwareApplication
        {
          "@type": "SoftwareApplication",
          "@id": `${canonicalUrl}#software`,
          "name": toolName,
          "description": toolDescription,
          "url": canonicalUrl,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
          },
          "author": {
            "@type": "Organization",
            "name": "AnyFile Flow",
            "url": "https://anyfileflow.com",
          },
          "featureList": [
            "100% browser-based processing",
            "No file upload to servers",
            "Batch processing support",
            "Cross-platform compatibility",
            "No registration required",
            "Free unlimited usage",
          ],
        },
        // HowTo
        {
          "@type": "HowTo",
          "@id": `${canonicalUrl}#howto`,
          "name": `How to Use ${toolName}`,
          "description": `Step-by-step guide to use ${toolName} — free online tool by AnyFile Flow.`,
          "totalTime": "PT2M",
          "tool": { "@type": "HowToTool", "name": "Web Browser" },
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Upload Your File",
              "text": `Select or drag and drop your ${toolFrom.toUpperCase()} file(s) to begin.`,
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Configure Settings",
              "text": "Adjust any available settings to customize your output.",
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Download Result",
              "text": `Click the process button and download your ${toolTo.toUpperCase()} result.`,
            },
          ],
        },
        // WebPage with Speakable for Google Discover
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          "name": `${toolName} – Free, Fast & Secure | AnyFile Flow`,
          "description": toolDescription,
          "url": canonicalUrl,
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://anyfileflow.com/#website",
            "name": "AnyFile Flow",
            "url": "https://anyfileflow.com",
          },
          "about": { "@type": "Thing", "name": toolName },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["#main-content h1", "#how-to-use", "#tool-guide"],
          },
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split("T")[0],
          "author": {
            "@type": "Person",
            "name": "Aman Rauniyar",
            "url": "https://anyfileflow.com/about",
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://anyfileflow.com/#organization",
            "name": "AnyFile Flow",
          },
        },
        // BreadcrumbList
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://anyfileflow.com",
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Tools",
              "item": "https://anyfileflow.com/tools",
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": toolName,
              "item": canonicalUrl,
            },
          ],
        },
        // FAQPage — single instance per URL
        {
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          "mainEntity": faqs.slice(0, 12).map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer,
            },
          })),
        },
      ],
    };
  }, [canonicalUrl, toolName, toolDescription, toolFrom, toolTo]);

  return (
    <Helmet>
      {/* Google Discover optimization meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content="2025-01-01" />
      <meta property="article:modified_time" content={new Date().toISOString().split("T")[0]} />
      <meta property="article:author" content="Aman Rauniyar" />
      <meta property="article:section" content="Tools" />
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  );
};

export default ToolSEOSchemas;
