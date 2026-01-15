import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
}

/**
 * Centralized SEO component that handles:
 * - Self-referencing canonical tags (always points to English/non-prefixed version)
 * - Proper hreflang tags for language variants
 * - Open Graph and Twitter meta tags
 * - Robots directives
 */
const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  noIndex = false,
  article,
}: SEOHeadProps) => {
  const location = useLocation();
  
  // Get the canonical path (remove language prefix if present)
  const getCanonicalPath = () => {
    const path = location.pathname;
    const langPrefixes = ['/en', '/es', '/hi', '/pt', '/ar'];
    
    for (const prefix of langPrefixes) {
      if (path === prefix) {
        return '/'; // Language home -> main home
      }
      if (path.startsWith(prefix + '/')) {
        return path.substring(prefix.length); // Remove language prefix
      }
    }
    return path;
  };

  const canonicalPath = getCanonicalPath();
  const baseUrl = "https://anyfileflow.com";
  const canonicalUrl = `${baseUrl}${canonicalPath === '/' ? '' : canonicalPath}`;
  
  // Default OG image
  const defaultOgImage = `${baseUrl}/og-default.png`;
  const finalOgImage = ogImage || defaultOgImage;

  // Supported languages for hreflang
  const languages = [
    { code: 'en', hreflang: 'en' },
    { code: 'es', hreflang: 'es' },
    { code: 'hi', hreflang: 'hi' },
    { code: 'pt', hreflang: 'pt' },
    { code: 'ar', hreflang: 'ar' },
  ];

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} 
      />
      
      {/* Canonical - ALWAYS points to the non-prefixed English version */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags - All point to the SAME canonical URL (English is default) */}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      {languages.filter(l => l.code !== 'en').map(lang => (
        <link 
          key={lang.code}
          rel="alternate" 
          hrefLang={lang.hreflang} 
          href={`${baseUrl}/${lang.code}${canonicalPath === '/' ? '' : canonicalPath}`} 
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="AnyFile Flow" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Article specific OG tags */}
      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Author */}
      <meta name="author" content="Aman Rauniyar" />
    </Helmet>
  );
};

export default SEOHead;
