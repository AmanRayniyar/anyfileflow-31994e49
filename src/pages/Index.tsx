import { Helmet } from "react-helmet-async";
import { memo, Suspense, lazy, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { categories, ToolCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

// Lazy load all non-critical components
const CategorySection = lazy(() => import("@/components/CategorySection"));
const SearchBar = lazy(() => import("@/components/SearchBar"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const BannerAd = lazy(() => import("@/components/BannerAd"));

// Optimized skeleton
const BlogPreviewSkeleton = memo(() => <section className="py-12 bg-secondary/30" aria-busy="true" aria-label="Loading blog">
    <div className="container mx-auto px-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <article key={i} className="bg-card rounded-xl p-6 space-y-4">
            <div className="h-40 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </article>)}
      </div>
    </div>
  </section>);
BlogPreviewSkeleton.displayName = "BlogPreviewSkeleton";
const Index = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("image");

  // Get the selected category info
  const selectedCategoryInfo = useMemo(() => categories.find(cat => cat.id === selectedCategory), [selectedCategory]);

  // Brand schema for homepage
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AnyFile Flow - Free Online File Conversion Tools",
    "description": "Welcome to AnyFile Flow — also called AnyFileFlow or Any File Flow. 200+ free online tools for file conversion.",
    "url": "https://anyfileflow.com/",
    "mainEntity": {
      "@type": "Brand",
      "name": "AnyFile Flow",
      "alternateName": ["AnyFileFlow", "Any File Flow", "anyfileflow", "anyfile", "any file flow"],
      "description": "AnyFile Flow is a free online file conversion platform with 200+ tools."
    }
  };
  return <>
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
        <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" role="main" aria-label="Main content">
          <Hero />
          
          {/* Advanced Search Bar Section */}
          <section className="container mx-auto px-4 py-8" aria-label="Search tools">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">Find Your Tool Instantly</h2>
                <p className="text-sm text-muted-foreground">Search 200+ free tools by name or function</p>
              </div>
              <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-xl" />}>
                <SearchBar large />
              </Suspense>
            </div>
          </section>
          
          {/* Brand Welcome Section */}
          <section className="container mx-auto px-4 py-6 text-center" aria-label="Brand introduction">
            <p className="text-muted-foreground/70 max-w-3xl mx-auto">
            <strong className="text-muted-foreground">Welcome to AnyFile Flow</strong> — also called <strong className="text-muted-foreground">AnyFileFlow</strong> or <strong className="text-muted-foreground">Any File Flow</strong>. 
              Whether you know us as <em>anyfileflow</em> or <em>any file flow</em>, you've found the right place for all your file conversion needs. 
              AnyFile Flow offers 200+ free tools trusted by users worldwide.
            </p>
          </section>

          {/* Category Filter Buttons */}
          <section className="container mx-auto px-4 py-4" aria-label="Category filter">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={cn("inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200", "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", isSelected ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent")} aria-pressed={isSelected} aria-label={`Filter by ${category.name}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  </button>;
            })}
            </div>
          </section>

          {/* Selected Category Tools */}
          <section className="container mx-auto px-4 py-8" aria-label="File conversion tools">
            <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i=><div key={i} className="h-32 bg-muted animate-pulse rounded-xl"/>)}</div>}>
              {selectedCategoryInfo && <CategorySection key={selectedCategoryInfo.id} category={selectedCategoryInfo} />}
            </Suspense>
          </section>
          
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreview />
          </Suspense>
          
          <Suspense fallback={null}>
            <BannerAd />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>;
});
Index.displayName = "Index";
export default Index;