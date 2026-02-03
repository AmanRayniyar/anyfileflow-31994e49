import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb from "@/components/SEOBreadcrumb";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Shield, Zap, Globe, Users } from "lucide-react";

const comparisons = [
  { feature: "Price", anyfile: "Always Free", competitor: "Freemium (Limited)" },
  { feature: "Registration Required", anyfile: "No", competitor: "Yes (for full access)" },
  { feature: "Daily Conversion Limit", anyfile: "Unlimited", competitor: "2-3 free/day" },
  { feature: "File Storage", anyfile: "Never stored", competitor: "Temporary server storage" },
  { feature: "Processing Location", anyfile: "Local (in browser)", competitor: "Cloud servers" },
  { feature: "Number of Tools", anyfile: "1000+ tools", competitor: "20-30 tools" },
  { feature: "Watermarks", anyfile: "Never", competitor: "Sometimes (free tier)" },
  { feature: "Mobile Support", anyfile: "Fully optimized", competitor: "Limited" },
  { feature: "AI Features", anyfile: "Built-in", competitor: "Premium only" }
];

const SmallPDFAlternativePage = memo(() => {

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Best SmallPDF Alternative - AnyFile Flow",
    "description": "Looking for a free SmallPDF alternative? AnyFile Flow offers 1000+ tools with unlimited usage, no registration, and complete privacy.",
    "url": "https://anyfileflow.com/smallpdf-alternative",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "AnyFile Flow",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Best SmallPDF Alternative - Free Online PDF & File Tools | AnyFile Flow"
        description="Looking for a free SmallPDF alternative? AnyFile Flow offers 1000+ tools with unlimited usage, no registration, and complete privacy. Convert PDF, images, audio, video and more."
        keywords="SmallPDF alternative, free PDF tools, PDF converter, file converter, iLovePDF alternative, online PDF editor, free PDF compressor"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SEOBreadcrumb items={[
            { name: "Home", url: "/" },
            { name: "SmallPDF Alternative" }
          ]} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Best Free <span className="flow-text">SmallPDF Alternative</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Looking for a SmallPDF alternative? AnyFile Flow offers everything SmallPDF does — 
              and more — completely free with unlimited usage and no registration required.
            </p>
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Explore 1000+ Free Tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          {/* Why Users Seek Alternatives */}
          <section className="py-12 bg-card border border-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Why Users Seek SmallPDF Alternatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Limited Free Usage</h3>
                <p className="text-sm text-muted-foreground">Only 2 free tasks per day, then paywall</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Account Required</h3>
                <p className="text-sm text-muted-foreground">Need to sign up for full access</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Server Upload</h3>
                <p className="text-sm text-muted-foreground">Files uploaded to external servers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Expensive Plans</h3>
                <p className="text-sm text-muted-foreground">Premium features behind paywall</p>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              AnyFile Flow vs SmallPDF Comparison
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border font-semibold">
                <div>Feature</div>
                <div className="text-center text-primary">AnyFile Flow</div>
                <div className="text-center text-muted-foreground">SmallPDF</div>
              </div>
              {comparisons.map((row, index) => (
                <div 
                  key={row.feature} 
                  className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                >
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm">{row.anyfile}</span>
                  </div>
                  <div className="text-center text-muted-foreground text-sm">{row.competitor}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Comparison based on publicly available features. Updated January 2025.
            </p>
          </section>

          {/* Why Choose AnyFile Flow */}
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Why Choose AnyFile Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Always Free</h3>
                <p className="text-sm text-muted-foreground">No hidden costs, no premium tiers, no limits</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">Files processed locally, never uploaded to servers</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1000+ Tools</h3>
                <p className="text-sm text-muted-foreground">PDF, images, audio, video, text, and more</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Registration</h3>
                <p className="text-sm text-muted-foreground">Use any tool instantly without signing up</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Switch to AnyFile Flow?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join millions of users who have discovered the best free alternative to SmallPDF. 
                No registration, no limits, no compromise on privacy.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start Converting for Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
});

SmallPDFAlternativePage.displayName = "SmallPDFAlternativePage";

export default SmallPDFAlternativePage;
