import { Helmet } from "react-helmet-async";
import { generateFAQs } from "./ToolFAQSection";

interface ToolSEOSchemasProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolFrom: string;
  toolTo: string;
  categoryName: string;
}

const ToolSEOSchemas = ({ 
  toolId, 
  toolName, 
  toolDescription, 
  toolFrom, 
  toolTo,
  categoryName 
}: ToolSEOSchemasProps) => {
  const canonicalUrl = `https://anyfileflow.com/tool/${toolId}`;
  const faqs = generateFAQs(toolName, toolFrom, toolTo, toolDescription);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://anyfileflow.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://anyfileflow.com/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `https://anyfileflow.com/tools?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": toolName,
        "item": canonicalUrl
      }
    ]
  };

  // SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "url": canonicalUrl,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any (Web Browser)",
    "browserRequirements": "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
    "softwareVersion": "2.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "AnyFile Flow",
      "url": "https://anyfileflow.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AnyFile Flow",
      "url": "https://anyfileflow.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://anyfileflow.com/logo.png"
      }
    },
    "featureList": [
      "Free online tool",
      "No registration required",
      "Browser-based processing",
      "Mobile friendly",
      "Batch processing support",
      "High quality output",
      "AI assistance available"
    ],
    "screenshot": `https://anyfileflow.com/screenshots/${toolId}.png`
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // HowTo Schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use ${toolName}`,
    "description": `Step-by-step guide to ${toolDescription.toLowerCase()} using AnyFile Flow's free online tool.`,
    "image": `https://anyfileflow.com/screenshots/${toolId}.png`,
    "totalTime": "PT1M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Web Browser (Chrome, Firefox, Safari, Edge)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload Your File",
        "text": `Upload your ${toolFrom.toUpperCase()} file(s) by dragging and dropping or clicking to browse. You can upload multiple files for batch processing.`,
        "url": `${canonicalUrl}#step1`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Adjust Settings",
        "text": "Customize any available settings according to your preferences. Most tools work great with default settings.",
        "url": `${canonicalUrl}#step2`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Process and Download",
        "text": `Click the process button to convert your file. Once complete, download your ${toolTo.toUpperCase()} result instantly.`,
        "url": `${canonicalUrl}#step3`
      }
    ]
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${toolName} - Free Online Tool | AnyFile Flow`,
    "description": toolDescription,
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "AnyFile Flow",
      "alternateName": ["AnyFileFlow", "Any File Flow"],
      "url": "https://anyfileflow.com"
    },
    "about": {
      "@type": "Thing",
      "name": toolName
    },
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": "#main-content"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "#how-to-use", "#faq-section"]
    },
    "breadcrumb": breadcrumbSchema,
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": `https://anyfileflow.com/screenshots/${toolId}.png`
    }
  };

  // Combine all schemas into a single graph (breadcrumb handled by SEOBreadcrumb component)
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { ...softwareSchema, "@context": undefined },
      { ...faqSchema, "@context": undefined },
      { ...howToSchema, "@context": undefined },
      { ...webPageSchema, "@context": undefined }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  );
};

export default ToolSEOSchemas;
