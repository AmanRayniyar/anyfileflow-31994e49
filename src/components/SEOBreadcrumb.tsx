import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url?: string; // If undefined, it's the current page (not clickable)
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * SEO-Optimized Breadcrumb Navigation Component for AnyFileFlow
 * 
 * Features:
 * - Semantic HTML (nav, ol, li)
 * - JSON-LD BreadcrumbList schema for Google Rich Results
 * - ARIA labels for accessibility
 * - Mobile-friendly responsive design
 * - CSS-based separators
 * - Last item is not clickable (current page)
 * 
 * Usage:
 * <SEOBreadcrumb 
 *   items={[
 *     { name: "Home", url: "/" },
 *     { name: "Tools", url: "/tools" },
 *     { name: "Image Tools", url: "/tools?category=image" },
 *     { name: "Image Compressor" } // No URL = current page
 *   ]} 
 * />
 */
const SEOBreadcrumb = ({ items, className = "" }: SEOBreadcrumbProps) => {
  const baseUrl = "https://anyfileflow.com";
  
  // Generate JSON-LD schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${baseUrl}${item.url}` : `${baseUrl}${window.location.pathname}`
    }))
  };

  return (
    <>
      {/* JSON-LD Schema for Google Rich Results */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Visual Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb navigation" 
        className={`seo-breadcrumb ${className}`}
      >
        <ol 
          className="seo-breadcrumb__list"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            
            return (
              <li 
                key={index}
                className="seo-breadcrumb__item"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {isLast ? (
                  // Current page - not clickable
                  <span 
                    className="seo-breadcrumb__current"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  // Clickable breadcrumb link
                  <Link 
                    to={item.url || "/"}
                    className="seo-breadcrumb__link"
                    itemProp="item"
                  >
                    {isFirst && (
                      <Home 
                        className="seo-breadcrumb__home-icon" 
                        aria-hidden="true" 
                      />
                    )}
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Scoped CSS - Minimal impact on other components */}
      <style>{`
        .seo-breadcrumb {
          width: 100%;
          margin-bottom: 1rem;
        }
        
        .seo-breadcrumb__list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0;
          padding: 0;
          margin: 0;
          list-style: none;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .seo-breadcrumb__item {
          display: inline-flex;
          align-items: center;
        }
        
        /* CSS Separator using ::before */
        .seo-breadcrumb__item:not(:first-child)::before {
          content: "›";
          margin: 0 0.5rem;
          color: hsl(var(--muted-foreground));
          font-weight: 400;
          font-size: 1rem;
          opacity: 0.7;
        }
        
        .seo-breadcrumb__link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          transition: color 0.15s ease-in-out;
          white-space: nowrap;
        }
        
        .seo-breadcrumb__link:hover,
        .seo-breadcrumb__link:focus {
          color: hsl(var(--foreground));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .seo-breadcrumb__link:focus {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
          border-radius: 2px;
        }
        
        .seo-breadcrumb__home-icon {
          width: 0.875rem;
          height: 0.875rem;
          flex-shrink: 0;
        }
        
        .seo-breadcrumb__current {
          color: hsl(var(--foreground));
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        
        /* Mobile Responsive */
        @media (max-width: 640px) {
          .seo-breadcrumb__list {
            font-size: 0.8125rem;
          }
          
          .seo-breadcrumb__item:not(:first-child)::before {
            margin: 0 0.375rem;
          }
          
          .seo-breadcrumb__current {
            max-width: 150px;
          }
          
          /* Hide middle items on very small screens */
          .seo-breadcrumb__item:nth-child(n+2):nth-last-child(n+3) {
            display: none;
          }
          
          /* Show ellipsis indicator */
          .seo-breadcrumb__list:has(.seo-breadcrumb__item:nth-child(4)) .seo-breadcrumb__item:nth-child(2)::after {
            content: "...";
            margin-left: 0.25rem;
          }
        }
        
        /* Ensure proper print styling */
        @media print {
          .seo-breadcrumb__link {
            color: #000;
          }
          
          .seo-breadcrumb__item:not(:first-child)::before {
            color: #666;
          }
        }
      `}</style>
    </>
  );
};

export default SEOBreadcrumb;

/**
 * Helper function to generate tool page breadcrumb items
 */
export const generateToolBreadcrumbs = (
  categoryName: string,
  toolName: string,
  categorySlug?: string
): BreadcrumbItem[] => [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: categoryName, url: `/tools?category=${categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-')}` },
  { name: toolName } // Current page - no URL
];

/**
 * Helper function to generate simple page breadcrumbs
 */
export const generateSimpleBreadcrumbs = (pageName: string): BreadcrumbItem[] => [
  { name: "Home", url: "/" },
  { name: pageName } // Current page - no URL
];

/**
 * Helper function to generate blog post breadcrumbs
 */
export const generateBlogBreadcrumbs = (postTitle?: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" }
  ];
  
  if (postTitle) {
    items.push({ name: postTitle });
  }
  
  return items;
};
