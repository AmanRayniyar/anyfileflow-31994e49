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
}: ToolSEOSchemasProps) => {
  const canonicalUrl = `https://anyfileflow.com/tool/${toolId}`;
  const faqs = generateFAQs(toolName, toolFrom, toolTo, toolDescription);

  // SoftwareApplication Schema (Google-compliant)
  const softwareSchema = {
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "url": canonicalUrl,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "AnyFile Flow",
      "url": "https://anyfileflow.com"
    }
  };

  // FAQ Schema (Google-compliant)
  const faqSchema = {
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

  // HowTo Schema (Google-compliant - simplified)
  const howToSchema = {
    "@type": "HowTo",
    "name": `How to Use ${toolName}`,
    "description": `Step-by-step guide to use ${toolName} - a free online tool by AnyFile Flow.`,
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload Your File",
        "text": `Select or drag and drop your ${toolFrom.toUpperCase()} file(s) to begin.`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Configure Settings",
        "text": "Adjust any available settings to customize your output."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Download Result",
        "text": `Click the process button and download your converted ${toolTo.toUpperCase()} file.`
      }
    ]
  };

  // WebPage Schema (simplified - removed invalid image references)
  const webPageSchema = {
    "@type": "WebPage",
    "name": `${toolName} - Free Online Tool | AnyFile Flow`,
    "description": toolDescription,
    "url": canonicalUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "AnyFile Flow",
      "url": "https://anyfileflow.com"
    },
    "about": {
      "@type": "Thing",
      "name": toolName
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
