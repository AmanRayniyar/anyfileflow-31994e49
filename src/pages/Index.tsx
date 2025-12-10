import { Helmet } from "react-helmet-async";
import { memo, Suspense, lazy, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { categories } from "@/data/tools";

// Lazy load below-fold components
const BlogPreview = lazy(() => import("@/components/BlogPreview"));

// Optimized skeleton
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
  // Memoize categories to prevent re-renders
  const categoryList = useMemo(() => categories, []);

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
        <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" role="main" aria-label="Main content">
          <Hero />
          
          {/* Brand Welcome Section */}
          <section className="container mx-auto px-4 py-6 text-center" aria-label="Brand introduction">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              <strong>Welcome to AnyFile Flow</strong> — also called <strong>AnyFileFlow</strong> or <strong>Any File Flow</strong>. 
              Whether you know us as <em>anyfileflow</em> or <em>any file flow</em>, you've found the right place for all your file conversion needs. 
              AnyFile Flow offers 200+ free tools trusted by users worldwide.
            </p>
          </section>

          <section className="container mx-auto px-4 py-8" aria-label="File conversion tools by category">
          {categoryList.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </section>
          <Suspense fallback={<BlogPreviewSkeleton />}>
            <BlogPreview />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
});

Index.displayName = "Index";

export default Index;