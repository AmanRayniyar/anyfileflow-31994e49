import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb from "@/components/SEOBreadcrumb";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Shield, Zap, Globe, Users } from "lucide-react";

const comparisons = [
  { feature: "Price", anyfile: "Always Free", competitor: "Freemium" },
  { feature: "Registration Required", anyfile: "No", competitor: "Yes (for some features)" },
  { feature: "Daily Task Limit", anyfile: "Unlimited", competitor: "Limited free tier" },
  { feature: "File Storage", anyfile: "Never stored", competitor: "Cloud storage" },
  { feature: "Processing Location", anyfile: "Browser (local)", competitor: "External servers" },
  { feature: "Number of Tools", anyfile: "1000+ tools", competitor: "25+ PDF tools" },
  { feature: "Non-PDF Tools", anyfile: "Images, audio, video, text", competitor: "PDF only" },
  { feature: "Watermarks", anyfile: "Never", competitor: "Free tier may have" },
  { feature: "Mobile Friendly", anyfile: "Fully responsive", competitor: "App required" }
];

const ILovePDFAlternativePage = memo(() => {

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Best iLovePDF Alternative - AnyFile Flow",
    "description": "Looking for a free iLovePDF alternative? AnyFile Flow offers 1000+ tools with unlimited usage, no registration, and complete privacy.",
    "url": "https://anyfileflow.com/ilovepdf-alternative",
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
        title="Best iLovePDF Alternative - Free Online PDF & File Tools | AnyFile Flow"
        description="Looking for a free iLovePDF alternative? AnyFile Flow offers 1000+ tools with unlimited usage, no registration, and complete privacy. More than just PDF tools."
        keywords="iLovePDF alternative, free PDF tools, PDF converter, file converter, SmallPDF alternative, online PDF editor, PDF compressor free"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SEOBreadcrumb items={[
            { name: "Home", url: "/" },
            { name: "iLovePDF Alternative" }
          ]} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Best Free <span className="flow-text">iLovePDF Alternative</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Looking for an iLovePDF alternative? AnyFile Flow offers all PDF tools plus 
              1000+ additional converters — completely free with no limits.
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
              Why Users Seek iLovePDF Alternatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">PDF-Only Focus</h3>
                <p className="text-sm text-muted-foreground">Limited to PDF tools, no image/audio/video</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Server Processing</h3>
                <p className="text-sm text-muted-foreground">Files uploaded to external servers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Usage Limits</h3>
                <p className="text-sm text-muted-foreground">Free tier has daily restrictions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Best tools require subscription</p>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              AnyFile Flow vs iLovePDF Comparison
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border font-semibold">
                <div>Feature</div>
                <div className="text-center text-primary">AnyFile Flow</div>
                <div className="text-center text-muted-foreground">iLovePDF</div>
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
              Why Choose AnyFile Flow Over iLovePDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1000+ Tools</h3>
                <p className="text-sm text-muted-foreground">Not just PDFs — images, audio, video, text & more</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Zero Server Upload</h3>
                <p className="text-sm text-muted-foreground">Files processed entirely in your browser</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Always Free</h3>
                <p className="text-sm text-muted-foreground">No hidden costs, no premium tiers needed</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Account Needed</h3>
                <p className="text-sm text-muted-foreground">Start using immediately without signup</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to Try the Best iLovePDF Alternative?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Experience the freedom of unlimited file conversion with complete privacy. 
                No registration, no limits, just powerful tools that work.
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

ILovePDFAlternativePage.displayName = "ILovePDFAlternativePage";

export default ILovePDFAlternativePage;
