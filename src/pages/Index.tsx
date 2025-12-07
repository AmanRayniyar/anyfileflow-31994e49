import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import BlogPreview from "@/components/BlogPreview";
import { categories } from "@/data/tools";

const Index = () => {
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[100] focus:outline-none focus:ring-2 focus:ring-ring">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" role="main">
          <Hero />

          {/* All Categories with All Tools */}
          <div className="container mx-auto px-4 py-8">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} limit={100} />
            ))}
          </div>

          {/* Blog Preview */}
          <BlogPreview />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;