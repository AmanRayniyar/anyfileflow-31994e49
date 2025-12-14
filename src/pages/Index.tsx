import { Helmet } from "react-helmet-async";
import { memo, Suspense, lazy, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import SearchBar from "@/components/SearchBar";
import { categories, ToolCategory, tools } from "@/data/tools";
import { cn } from "@/lib/utils";

// Lazy load below-fold components
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const WhyAnyFileFlow = lazy(() => import("@/components/home/WhyAnyFileFlow"));
const QuickActionsCTA = lazy(() => import("@/components/home/QuickActionsCTA"));
const ComparisonSection = lazy(() => import("@/components/home/ComparisonSection"));
const TrendingTools = lazy(() => import("@/components/home/TrendingTools"));
const MostPopularToday = lazy(() => import("@/components/home/MostPopularToday"));
const RecentlyUsedTools = lazy(() => import("@/components/home/RecentlyUsedTools"));
const RecentlyAddedTools = lazy(() => import("@/components/home/RecentlyAddedTools"));
const AIToolRecommender = lazy(() => import("@/components/home/AIToolRecommender"));
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const HomeFAQ = lazy(() => import("@/components/home/HomeFAQ"));
const GlobalUsersCounter = lazy(() => import("@/components/home/GlobalUsersCounter"));

// Optimized skeleton
const SectionSkeleton = memo(({ height = "h-48" }: { height?: string }) => (
  <section className={`${height} bg-secondary/30 animate-pulse`} aria-busy="true" />
));
SectionSkeleton.displayName = "SectionSkeleton";

const BlogPreviewSkeleton = memo(() => (
  <section className="py-12 bg-secondary/30" aria-busy="true" aria-label="Loading blog">
    <div className="container mx-auto px-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <article key={i} className="bg-card rounded-xl p-6 space-y-4">
            <div className="h-40 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </article>
        ))}
      </div>
    </div>
  </section>
));
BlogPreviewSkeleton.displayName = "BlogPreviewSkeleton";

const Index = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("image");

  // Get the selected category info
  const selectedCategoryInfo = useMemo(() => categories.find(cat => cat.id === selectedCategory), [selectedCategory]);

  // Rich schema markup
  const schemas = {
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AnyFile Flow",
      "alternateName": ["AnyFileFlow", "Any File Flow"],
      "url": "https://anyfileflow.com/",
      "description": "200+ free online tools for file conversion, editing, and more",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://anyfileflow.com/tools?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AnyFile Flow",
      "url": "https://anyfileflow.com/",
      "logo": "https://anyfileflow.com/logo.png",
      "sameAs": [
        "https://www.facebook.com/aman.rauniyar.980",
        "https://github.com/AmanRayniyar",
        "https://www.instagram.com/amanrauniyar2064/"
      ]
    },
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AnyFile Flow",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "15420",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    itemList: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Popular File Conversion Tools",
      "itemListElement": tools.filter(t => t.popular).slice(0, 10).map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "description": tool.description,
          "url": `https://anyfileflow.com/tool/${tool.id}`,
          "applicationCategory": "UtilitiesApplication"
        }
      }))
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is AnyFile Flow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AnyFile Flow is a free online platform with 200+ tools for file conversion, image editing, PDF manipulation, audio/video processing, and more. All tools work directly in your browser with no registration required."
          }
        },
        {
          "@type": "Question",
          "name": "Is AnyFile Flow free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, AnyFile Flow is completely free to use. There are no hidden costs, no registration required, and no limits on the number of conversions you can perform."
          }
        },
        {
          "@type": "Question",
          "name": "Are my files secure on AnyFile Flow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. All file processing happens directly in your browser. Your files never leave your device and are never uploaded to any server, ensuring complete privacy and security."
          }
        }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>AnyFile Flow | AnyFileFlow | Any File Flow - 200+ Free Online File Conversion Tools</title>
        <meta name="description" content="Welcome to AnyFile Flow — also called AnyFileFlow or Any File Flow. 200+ free online tools for image, document, audio, video conversion. Fast, secure, no registration required." />
        <meta name="keywords" content="AnyFile Flow, AnyFileFlow, Any File Flow, anyfileflow, anyfile, any file flow, file converter, image converter, pdf tools, audio converter, video editor, online tools, free tools, jpg to png, webp converter" />
        <link rel="canonical" href="https://anyfileflow.com/" />
        <meta property="og:title" content="AnyFile Flow | AnyFileFlow | Any File Flow - 200+ Free Online Tools" />
        <meta property="og:description" content="Welcome to AnyFile Flow (AnyFileFlow / Any File Flow). Convert, edit, and transform your files with 200+ free online tools. No limits, no registration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anyfileflow.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AnyFile Flow | AnyFileFlow - 200+ Free Online Tools" />
        <meta name="twitter:description" content="Welcome to AnyFile Flow — also called AnyFileFlow or Any File Flow. Convert, edit, and transform files with 200+ free online tools." />
        <script type="application/ld+json">{JSON.stringify(schemas.website)}</script>
        <script type="application/ld+json">{JSON.stringify(schemas.organization)}</script>
        <script type="application/ld+json">{JSON.stringify(schemas.softwareApp)}</script>
        <script type="application/ld+json">{JSON.stringify(schemas.itemList)}</script>
        <script type="application/ld+json">{JSON.stringify(schemas.faq)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" role="main" aria-label="Main content">
          {/* Global Users Counter - Top of page */}
          <Suspense fallback={<SectionSkeleton height="h-16" />}>
            <GlobalUsersCounter />
          </Suspense>
          
          <Hero />
          
          {/* Trust Badges - Right under hero */}
          <Suspense fallback={<SectionSkeleton height="h-16" />}>
            <TrustBadges />
          </Suspense>
          
          {/* Why AnyFile Flow - Above the fold */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <WhyAnyFileFlow />
          </Suspense>
          
          {/* Quick Actions CTA Grid */}
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <QuickActionsCTA />
          </Suspense>

          {/* Advanced Search Bar Section */}
          <section className="container mx-auto px-4 py-8" aria-label="Search tools">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">Find Your Tool Instantly</h2>
                <p className="text-sm text-muted-foreground">Search 200+ free tools by name or function</p>
              </div>
              <SearchBar large />
            </div>
          </section>
          
          {/* Recently Used Tools */}
          <Suspense fallback={null}>
            <RecentlyUsedTools />
          </Suspense>
          
          {/* AI Tool Recommender */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <AIToolRecommender />
          </Suspense>
          
          {/* Trending Tools */}
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <TrendingTools />
          </Suspense>
          
          {/* Most Popular Today */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <MostPopularToday />
          </Suspense>

          {/* Category Filter Buttons */}
          <section className="container mx-auto px-4 py-4" aria-label="Category filter">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-foreground mb-1">Browse by Category</h2>
              <p className="text-sm text-muted-foreground">Select a category to explore tools</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                      "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]",
                      isSelected 
                        ? "bg-primary text-primary-foreground border-primary shadow-md" 
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent"
                    )}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${category.name}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected Category Tools */}
          <section className="container mx-auto px-4 py-8" aria-label="File conversion tools">
            {selectedCategoryInfo && (
              <CategorySection key={selectedCategoryInfo.id} category={selectedCategoryInfo} />
            )}
          </section>
          
          {/* Recently Added Tools */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <RecentlyAddedTools />
          </Suspense>
          
          {/* Comparison Section */}
          <Suspense fallback={<SectionSkeleton height="h-96" />}>
            <ComparisonSection />
          </Suspense>
          
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreview />
          </Suspense>
          
          {/* FAQ Section */}
          <Suspense fallback={<SectionSkeleton height="h-96" />}>
            <HomeFAQ />
          </Suspense>
          
        </main>
        <Footer />
      </div>
    </>
  );
});

Index.displayName = "Index";

export default Index;
