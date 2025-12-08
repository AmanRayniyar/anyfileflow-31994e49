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

  return (
    <>
      <Helmet>
        <title>AnyFile Flow - 200+ Free Online File Conversion Tools | Fast & Secure</title>
        <meta name="description" content="Convert any file format free with AnyFile Flow. 200+ tools for image, document, audio, video conversion. Fast, secure, no registration required." />
        <meta name="keywords" content="file converter, image converter, pdf tools, audio converter, video editor, online tools, free tools, jpg to png, webp converter" />
        <link rel="canonical" href="https://anyfileflow.com/" />
        <meta property="og:title" content="AnyFile Flow - 200+ Free Online File Conversion Tools" />
        <meta property="og:description" content="Convert, edit, and transform your files with 200+ free online tools. No limits, no registration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anyfileflow.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AnyFile Flow - 200+ Free Online Tools" />
        <meta name="twitter:description" content="Convert, edit, and transform files with 200+ free online tools." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" role="main" aria-label="Main content">
          <Hero />
          <section className="container mx-auto px-4 py-8" aria-label="File conversion tools by category">
            {categoryList.map((category) => (
              <CategorySection key={category.id} category={category} limit={100} />
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