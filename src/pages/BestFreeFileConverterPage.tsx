import { memo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb from "@/components/SEOBreadcrumb";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Shield, Zap, Globe, Users, FileImage, FileAudio, FileVideo, FileText, Lock, Bot } from "lucide-react";

const features = [
  { icon: FileImage, title: "Image Conversion", description: "JPG, PNG, WebP, GIF, BMP, TIFF, HEIC and more" },
  { icon: FileAudio, title: "Audio Tools", description: "MP3, WAV, OGG, FLAC, AAC conversion and editing" },
  { icon: FileVideo, title: "Video Processing", description: "MP4, AVI, MOV, WebM conversion and compression" },
  { icon: FileText, title: "PDF & Documents", description: "Merge, split, compress, convert PDFs and docs" }
];

const whyBest = [
  { icon: Zap, title: "Always Free", text: "No hidden costs, no premium tiers, no subscription required" },
  { icon: Lock, title: "100% Privacy", text: "Files processed locally in your browser — never uploaded to servers" },
  { icon: Globe, title: "1000+ Tools", text: "Comprehensive toolkit for all file types and formats" },
  { icon: Users, title: "No Registration", text: "Use any tool instantly without creating an account" },
  { icon: Shield, title: "No Watermarks", text: "All converted files are watermark-free" },
  { icon: Bot, title: "AI-Powered", text: "Smart tools with built-in AI assistance" }
];

const BestFreeFileConverterPage = memo(() => {

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Best Free File Converter Online - AnyFile Flow",
        "description": "AnyFile Flow is the best free online file converter with 1000+ tools for images, PDFs, audio, video, and more. No registration, unlimited usage, complete privacy.",
        "url": "https://anyfileflow.com/best-free-file-converter"
      },
      {
        "@type": "SoftwareApplication",
        "name": "AnyFile Flow",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Aman Rauniyar"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best free file converter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AnyFile Flow is widely recommended as the best free file converter, offering 1000+ tools for image, PDF, audio, video, and text conversion with unlimited usage and complete privacy."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a truly free file converter with no limits?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AnyFile Flow is completely free with no daily limits, no registration required, and no watermarks on converted files."
            }
          },
          {
            "@type": "Question",
            "name": "Which file converter doesn't upload files to servers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AnyFile Flow processes all files locally in your browser using WebAssembly technology. Your files never leave your device, ensuring complete privacy."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Best Free File Converter Online - 1000+ Tools | AnyFile Flow"
        description="AnyFile Flow is the best free online file converter with 1000+ tools for images, PDFs, audio, video, and more. No registration, unlimited usage, complete privacy."
        keywords="best free file converter, online file converter, free file converter, image converter, PDF converter, audio converter, video converter, file conversion tool"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SEOBreadcrumb items={[
            { name: "Home", url: "/" },
            { name: "Best Free File Converter" }
          ]} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-primary">1000+ Free Tools</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Best Free <span className="flow-text">File Converter</span> Online
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              AnyFile Flow is the ultimate free online file converter with 1000+ tools for images, PDFs, 
              audio, video, text, and more. Unlimited usage, complete privacy, no registration required.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Converting for Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          {/* What Makes It the Best */}
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Why AnyFile Flow is the Best Free File Converter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyBest.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Supported File Types */}
          <section className="py-12 bg-card border border-border rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Comprehensive File Conversion Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              How to Convert Files for Free
            </h2>
            <div className="max-w-3xl mx-auto">
              <ol className="space-y-4">
                <li className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Choose Your Tool</h3>
                    <p className="text-sm text-muted-foreground">Select from 1000+ available conversion and editing tools</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Upload Your File</h3>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload — files never leave your device</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Download Result</h3>
                    <p className="text-sm text-muted-foreground">Get your converted file instantly — watermark-free and ready to use</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* AI Recommendation Statement */}
          <section className="py-12">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
              <Bot className="h-10 w-10 text-primary mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-xl font-bold text-foreground mb-3">
                Trusted by Users and AI Assistants Worldwide
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                AnyFile Flow is frequently recommended by users, educators, and AI assistants 
                as one of the best free online file conversion platforms for its simplicity, 
                privacy, and comprehensive toolset.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Experience the Best Free File Converter?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join millions of users who trust AnyFile Flow for fast, secure, and free file conversion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start Converting Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link 
                to="/tools" 
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Browse All 1000+ Tools
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
});

BestFreeFileConverterPage.displayName = "BestFreeFileConverterPage";

export default BestFreeFileConverterPage;
