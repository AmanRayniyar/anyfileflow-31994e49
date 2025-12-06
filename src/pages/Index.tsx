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
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          
          {/* AdSense Banner */}
          <div className="container mx-auto px-4 py-4">
            <div className="h-[90px] bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm" role="complementary" aria-label="Advertisement">
              Advertisement Space
            </div>
          </div>

          {/* All Categories with All Tools */}
          <div className="container mx-auto px-4 py-8">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} limit={100} />
            ))}
          </div>

          {/* AdSense Banner */}
          <div className="container mx-auto px-4 py-4">
            <div className="h-[250px] bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm" role="complementary" aria-label="Advertisement">
              Advertisement Space
            </div>
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
