import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Zap, Globe, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BrandPage = () => {
  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "AnyFile Flow",
    "alternateName": ["AnyFileFlow", "Any File Flow", "anyfileflow", "anyfile", "any file flow"],
    "url": "https://anyfileflow.com",
    "logo": "https://anyfileflow.com/favicon.ico",
    "description": "AnyFile Flow (also known as AnyFileFlow, Any File Flow, anyfileflow) is a free online file conversion platform with 200+ tools for images, documents, audio, and video.",
    "founder": {
      "@type": "Person",
      "name": "Aman Rauniyar"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About AnyFile Flow Brand | AnyFileFlow | Any File Flow - Our Identity</title>
        <meta name="description" content="Learn about AnyFile Flow brand identity. Whether you call us AnyFileFlow, Any File Flow, anyfileflow, or any file flow — we're the same trusted platform with 200+ free tools." />
        <meta name="keywords" content="AnyFile Flow, AnyFileFlow, Any File Flow, anyfileflow, anyfile, any file flow, brand, about, file converter brand" />
        <link rel="canonical" href="https://anyfileflow.com/brand" />
        <meta property="og:title" content="About AnyFile Flow Brand | AnyFileFlow | Any File Flow" />
        <meta property="og:description" content="Learn about AnyFile Flow brand. Also known as AnyFileFlow, Any File Flow, anyfileflow. 200+ free file conversion tools." />
        <meta property="og:url" content="https://anyfileflow.com/brand" />
        <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">About Our Brand</span>
        </nav>

        {/* Hero */}
        <header className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="flow-text">AnyFile Flow</span> Brand
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            <strong>AnyFile Flow</strong> — also known as <strong>AnyFileFlow</strong>, <strong>Any File Flow</strong>, and <strong>anyfileflow</strong>
          </p>
          <p className="text-muted-foreground">
            No matter how you spell it or search for it, you'll find the same powerful suite of 200+ free online file conversion tools.
          </p>
        </header>

        {/* Brand Names Section */}
        <section className="mb-16" aria-labelledby="brand-names-heading">
          <h2 id="brand-names-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Our Brand Names Explained
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">AnyFile Flow</h3>
              </div>
              <p className="text-muted-foreground">
                This is our <strong>official brand name</strong>. AnyFile Flow represents our mission to make any file conversion flow smoothly and effortlessly.
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Official Name</span>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">AnyFileFlow</h3>
              </div>
              <p className="text-muted-foreground">
                The <strong>single-word version</strong> of our brand. Many users type AnyFileFlow when searching quickly, and we welcome them just the same.
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Alternate Spelling</span>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">Any File Flow</h3>
              </div>
              <p className="text-muted-foreground">
                The <strong>full spaced name</strong>. Some users prefer typing "Any File Flow" with spaces between each word. That's perfectly fine!
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Spaced Version</span>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">anyfileflow</h3>
              </div>
              <p className="text-muted-foreground">
                The <strong>lowercase version</strong>. Whether you type anyfileflow in all lowercase or use caps, you'll still find our platform.
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Lowercase</span>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">any file flow</h3>
              </div>
              <p className="text-muted-foreground">
                <strong>Lowercase spaced</strong> variation. Users searching for "any file flow" will discover our comprehensive toolset.
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Lowercase Spaced</span>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground">anyfile</h3>
              </div>
              <p className="text-muted-foreground">
                The <strong>shortened version</strong>. Some users remember us simply as "anyfile" — and that works too!
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Short Form</span>
            </article>
          </div>
        </section>

        {/* Why AnyFile Flow Section */}
        <section className="mb-16" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Why Choose AnyFile Flow?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <article className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                AnyFile Flow processes your files instantly using advanced browser technology. No waiting, no queues.
              </p>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">100% Secure</h3>
              <p className="text-muted-foreground">
                Your files never leave your device when using AnyFile Flow. All processing happens locally in your browser.
              </p>
            </article>

            <article className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Always Free</h3>
              <p className="text-muted-foreground">
                AnyFile Flow believes essential tools should be free. No premium tiers, no hidden fees, no limits.
              </p>
            </article>
          </div>
        </section>

        {/* Brand Story */}
        <section className="mb-16 max-w-3xl mx-auto" aria-labelledby="story-heading">
          <h2 id="story-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            The AnyFile Flow Story
          </h2>
          <div className="bg-card border border-border rounded-2xl p-8">
            <p className="text-muted-foreground mb-4">
              <strong>AnyFile Flow</strong> was founded by <strong>Aman Rauniyar</strong> with a simple mission: make file conversion accessible to everyone. 
              Whether you're a student, professional, or casual user, AnyFileFlow (or Any File Flow, as some call it) provides the tools you need without complicated software or expensive subscriptions.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, <strong>AnyFile Flow</strong> offers 200+ free online tools covering image conversion, document processing, audio editing, video transformation, and much more. 
              Our platform is used by millions of users worldwide who trust anyfileflow for their daily file conversion needs.
            </p>
            <p className="text-muted-foreground">
              No matter if you found us by searching for "AnyFile Flow," "AnyFileFlow," "Any File Flow," or even just "anyfile" — we're glad you're here. 
              Welcome to the AnyFile Flow family!
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/30 rounded-3xl p-8 md:p-12 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Start Using AnyFile Flow Today
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Experience why millions trust AnyFile Flow (AnyFileFlow / Any File Flow) for their file conversion needs. 200+ free tools, no registration required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/tools">Browse All Tools</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrandPage;