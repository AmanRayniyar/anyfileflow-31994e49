import { Helmet } from "react-helmet-async";
import { memo, Suspense, lazy } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { categories } from "@/data/tools";

// Lazy load below-fold components
const BlogPreview = lazy(() => import("@/components/BlogPreview"));

// Skeleton for lazy components
const BlogPreviewSkeleton = () => (
  <div className="py-12 bg-secondary/30" aria-busy="true" aria-label="Loading blog preview">
    <div className="container mx-auto px-4">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl p-6 space-y-4">
            <div className="h-40 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Index = memo(() => {
  return (
    <>
      <Helmet>
        <title>AnyFile Flow - 200+ Free Online File Conversion Tools</title>
        <meta name="description" content="AnyFile Flow offers 200+ free online tools for file conversion, image editing, audio processing, video editing, and more. Fast, secure, and easy to use." />
        <meta name="keywords" content="file converter, image converter, pdf tools, audio converter, video editor, online tools, free tools" />
        <link rel="canonical" href="https://anyfileflow.com" />
        <meta property="og:title" content="AnyFile Flow - 200+ Free Online File Conversion Tools" />
        <meta property="og:description" content="Convert, edit, and transform your files with our 200+ free online tools. No upload limits, no registration required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anyfileflow.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AnyFile Flow - 200+ Free Online Tools" />
        <meta name="twitter:description" content="Convert, edit, and transform your files with our 200+ free online tools." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" role="main" aria-label="Main content">
          <Hero />

          {/* All Categories with All Tools */}
          <section className="container mx-auto px-4 py-8" aria-label="File conversion tools by category">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} limit={100} />
            ))}
          </section>

          {/* Blog Preview - lazy loaded */}
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