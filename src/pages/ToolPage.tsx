import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import ShareButton from "@/components/ShareButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageConverter from "@/components/ImageConverter";
import TextTool from "@/components/tools/TextTool";
import HealthTool from "@/components/tools/HealthTool";
import DataTool from "@/components/tools/DataTool";
import GeneratorTool from "@/components/tools/GeneratorTool";
import AudioVideoTool from "@/components/tools/AudioVideoTool";
import TypingTestTool from "@/components/tools/TypingTestTool";
import ImageCropperTool from "@/components/tools/ImageCropperTool";
import AdvancedQRGenerator from "@/components/tools/AdvancedQRGenerator";
import PomodoroTimerTool from "@/components/tools/PomodoroTimerTool";
import PDFProtectTool from "@/components/tools/PDFProtectTool";
import PDFUnlockTool from "@/components/tools/PDFUnlockTool";
import StopwatchTool from "@/components/tools/StopwatchTool";
import CountdownTimerTool from "@/components/tools/CountdownTimerTool";
import ToolComments from "@/components/ToolComments";
import AdBanner from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { getToolById, getCategoryById, getToolsByCategory } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { cn } from "@/lib/utils";

const ToolPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getToolById(toolId) : undefined;

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16" role="main">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">The tool you're looking for doesn't exist.</p>
            <Button variant="hero" asChild>
              <Link to="/tools">Browse All Tools</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = getCategoryById(tool.category);
  const relatedTools = getToolsByCategory(tool.category)
    .filter((t) => t.id !== tool.id)
    .slice(0, 6);
  const Icon = tool.icon;

  const renderToolComponent = () => {
    // Special case for typing test tool
    if (tool.id === 'typing-test') {
      return <TypingTestTool tool={tool} />;
    }
    
    // Special case for image cropper tool
    if (tool.id === 'image-cropper') {
      return <ImageCropperTool tool={tool} />;
    }
    
    // Special case for QR generator - use advanced version
    if (tool.id === 'qr-generator') {
      return <AdvancedQRGenerator />;
    }
    
    // Special case for Pomodoro timer
    if (tool.id === 'pomodoro-timer') {
      return <PomodoroTimerTool />;
    }
    
    // Special case for PDF Protect
    if (tool.id === 'pdf-protect') {
      return <PDFProtectTool />;
    }
    
    // Special case for PDF Unlocker
    if (tool.id === 'pdf-unlocker') {
      return <PDFUnlockTool />;
    }
    
    // Special case for Stopwatch
    if (tool.id === 'stopwatch') {
      return <StopwatchTool />;
    }
    
    // Special case for Countdown Timer
    if (tool.id === 'countdown-timer') {
      return <CountdownTimerTool />;
    }
    
    switch (tool.toolType) {
      case 'image-convert':
      case 'image-edit':
        return <ImageConverter fromFormat={tool.from} toFormat={tool.to} toolName={tool.name} />;
      case 'text':
        return <TextTool tool={tool} />;
      case 'health':
        return <HealthTool tool={tool} />;
      case 'data':
        return <DataTool tool={tool} />;
      case 'generator':
        return <GeneratorTool tool={tool} />;
      case 'audio':
      case 'video':
        return <AudioVideoTool tool={tool} />;
      default:
        return <ImageConverter fromFormat={tool.from} toFormat={tool.to} toolName={tool.name} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{tool.name} - Free Online Tool | AnyFile Flow</title>
        <meta name="description" content={`${tool.description}. Free, fast, and secure. No registration required.`} />
        <meta property="og:title" content={`${tool.name} - AnyFile Flow`} />
        <meta property="og:description" content={tool.description} />
        <link rel="canonical" href={`https://anyfileflow.com/tool/${tool.id}`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-6 sm:py-8" role="main">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 flex-wrap">
            <Link to="/tools" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Tools</span>
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">/</span>
            <span className="text-sm text-muted-foreground">{category?.name}</span>
            <span className="text-muted-foreground" aria-hidden="true">/</span>
            <span className="text-sm font-medium text-foreground">{tool.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
                {/* Tool Header */}
                <header className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className={cn("p-3 sm:p-4 rounded-xl shrink-0", category?.bgClass)}>
                    <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8", category?.colorClass)} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                          {tool.name}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">{tool.description}</p>
                      </div>
                      <ShareButton 
                        title={`${tool.name} - AnyFile Flow`}
                        description={tool.description}
                        url={`https://anyfileflow.com/tool/${tool.id}`}
                      />
                    </div>
                  </div>
                </header>

                {/* Tool Component */}
                {renderToolComponent()}
              </div>

              {/* Info Section */}
              <section className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6" aria-labelledby="how-to-use">
                <h2 id="how-to-use" className="text-lg sm:text-xl font-bold text-foreground mb-4">
                  How to use {tool.name}
                </h2>
                <ol className="space-y-3 text-sm sm:text-base text-muted-foreground" role="list">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary" aria-hidden="true">1</span>
                    <span>Upload your {tool.from} file(s) by dragging and dropping or clicking to browse.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary" aria-hidden="true">2</span>
                    <span>Adjust settings if needed, then click the process button.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary" aria-hidden="true">3</span>
                    <span>Download your {tool.to} result once processing is complete.</span>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">Why use AnyFile Flow?</h3>
                  <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground" role="list">
                    <li>✓ 100% free with no hidden costs</li>
                    <li>✓ No registration or email required</li>
                    <li>✓ Files processed locally in your browser</li>
                    <li>✓ Fast and secure processing</li>
                  </ul>
                </div>
              </section>

              {/* Comments Section */}
              <ToolComments toolId={tool.id} />

              {/* Bottom Ad Banner */}
              <div className="mt-6">
                <AdBanner />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Ad Banner */}
                <AdBanner />
                
                <section className="bg-card border border-border rounded-2xl p-4 sm:p-6" aria-labelledby="related-tools">
                  <h3 id="related-tools" className="font-bold text-foreground mb-4">Related Tools</h3>
                  <div className="space-y-3">
                    {relatedTools.map((relatedTool) => (
                      <ToolCard key={relatedTool.id} tool={relatedTool} />
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ToolPage;
