import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Droplet, Zap, Shield, Globe, Heart, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb, { generateSimpleBreadcrumbs } from "@/components/SEOBreadcrumb";

const AboutPage = () => {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About AnyFile Flow",
    "description": "Learn about AnyFile Flow (also known as AnyFileFlow, Any File Flow). 200+ free online file conversion tools.",
    "url": "https://anyfileflow.com/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "AnyFile Flow",
      "alternateName": ["AnyFileFlow", "Any File Flow", "anyfileflow", "anyfile", "any file flow"],
      "url": "https://anyfileflow.com"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About AnyFile Flow | AnyFileFlow | Any File Flow - Our Mission"
        description="Learn about AnyFile Flow (also known as AnyFileFlow, Any File Flow). We're on a mission to make file conversion accessible, fast, and free for everyone."
        keywords="about AnyFile Flow, about AnyFileFlow, about Any File Flow, anyfileflow mission, file converter about"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(aboutSchema)}</script>
      </Helmet>

      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* SEO-Optimized Breadcrumb */}
        <SEOBreadcrumb items={generateSimpleBreadcrumbs("About")} />

        {/* Hero */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 p-4 rounded-2xl bg-primary/10 mb-6">
            <Droplet className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="flow-text">AnyFile Flow</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            <strong>AnyFile Flow</strong> — also known as <strong>AnyFileFlow</strong> or <strong>Any File Flow</strong> — is on a mission to make file conversion accessible, fast, and free for everyone.
          </p>
          <p className="text-muted-foreground">
            No complicated software, no registration, no limits – just simple, powerful tools from AnyFile Flow.
          </p>
        </header>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">AnyFile Flow Features</h2>
          
          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-archive/10 w-fit mb-4">
              <Zap className="h-6 w-6 text-tool-archive" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              AnyFile Flow tools process files instantly using cutting-edge browser technology. No waiting, no queues – just immediate results.
            </p>
          </article>

          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-audio/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-tool-audio" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">100% Secure</h3>
            <p className="text-muted-foreground">
              Your files never leave your device when using AnyFileFlow. All processing happens locally in your browser, ensuring complete privacy.
            </p>
          </article>

          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-code/10 w-fit mb-4">
              <Globe className="h-6 w-6 text-tool-code" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Always Free</h3>
            <p className="text-muted-foreground">
              Any File Flow believes essential tools should be free. No premium tiers, no hidden fees, no limits on how many files you can convert.
            </p>
          </article>

          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-image/10 w-fit mb-4">
              <Heart className="h-6 w-6 text-tool-image" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">User Focused</h3>
            <p className="text-muted-foreground">
              AnyFile Flow designed every tool with simplicity in mind. No technical knowledge required – just drag, drop, and convert.
            </p>
          </article>

          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-document/10 w-fit mb-4">
              <Users className="h-6 w-6 text-tool-document" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">200+ Tools</h3>
            <p className="text-muted-foreground">
              From image conversions to document processing, audio editing to data transformation – AnyFileFlow has got you covered.
            </p>
          </article>

          <article className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-data/10 w-fit mb-4">
              <Droplet className="h-6 w-6 text-tool-data" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Always Improving</h3>
            <p className="text-muted-foreground">
              Any File Flow continuously adds new tools and improves existing ones based on user feedback and emerging needs.
            </p>
          </article>
        </section>

        {/* Brand Link */}
        <section className="text-center mb-16">
          <p className="text-muted-foreground mb-4">
            Want to learn more about our brand identity? Whether you call us <strong>AnyFile Flow</strong>, <strong>AnyFileFlow</strong>, or <strong>Any File Flow</strong>, we're the same trusted platform.
          </p>
          <Button variant="outline" asChild>
            <Link to="/brand">Learn About Our Brand →</Link>
          </Button>
        </section>

        {/* CTA */}
        <section className="bg-secondary/30 rounded-3xl p-8 md:p-12 text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to get started with AnyFile Flow?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explore AnyFileFlow's collection of 200+ free tools and start converting your files today. No registration needed.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/tools">Browse All Tools</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;