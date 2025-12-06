import { Link } from "react-router-dom";
import { ArrowLeft, Droplet, Zap, Shield, Globe, Heart, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">About</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 p-4 rounded-2xl bg-primary/10 mb-6">
            <Droplet className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="flow-text">AnyFile Flow</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We're on a mission to make file conversion accessible, fast, and free for everyone.
            No complicated software, no registration, no limits – just simple, powerful tools.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-archive/10 w-fit mb-4">
              <Zap className="h-6 w-6 text-tool-archive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Our tools process files instantly using cutting-edge browser technology.
              No waiting, no queues – just immediate results.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-audio/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-tool-audio" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">100% Secure</h3>
            <p className="text-muted-foreground">
              Your files never leave your device. All processing happens locally in your
              browser, ensuring complete privacy.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-code/10 w-fit mb-4">
              <Globe className="h-6 w-6 text-tool-code" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Always Free</h3>
            <p className="text-muted-foreground">
              We believe essential tools should be free. No premium tiers, no hidden fees,
              no limits on how many files you can convert.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-image/10 w-fit mb-4">
              <Heart className="h-6 w-6 text-tool-image" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">User Focused</h3>
            <p className="text-muted-foreground">
              We designed every tool with simplicity in mind. No technical knowledge
              required – just drag, drop, and convert.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-document/10 w-fit mb-4">
              <Users className="h-6 w-6 text-tool-document" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">100+ Tools</h3>
            <p className="text-muted-foreground">
              From image conversions to document processing, audio editing to data
              transformation – we've got you covered.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="p-3 rounded-xl bg-tool-data/10 w-fit mb-4">
              <Droplet className="h-6 w-6 text-tool-data" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Always Improving</h3>
            <p className="text-muted-foreground">
              We continuously add new tools and improve existing ones based on user
              feedback and emerging needs.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explore our collection of 100+ free tools and start converting your files today.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/tools">Browse All Tools</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;