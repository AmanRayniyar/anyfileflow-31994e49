import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import ShareButton from "@/components/ShareButton";
import ToolAIHelp from "@/components/ToolAIHelp";
import ToolSEOSchemas from "@/components/ToolSEOSchemas";
import ToolRating from "@/components/ToolRating";
import { addRecentlyUsed } from "@/components/home/RecentlyUsedTools";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getToolById, getCategoryById, getToolsByCategory } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { cn } from "@/lib/utils";

// Lazy load tool components for faster initial load
const ImageConverter = lazy(() => import("@/components/ImageConverter"));
const TextTool = lazy(() => import("@/components/tools/TextTool"));
const HealthTool = lazy(() => import("@/components/tools/HealthTool"));
const DataTool = lazy(() => import("@/components/tools/DataTool"));
const GeneratorTool = lazy(() => import("@/components/tools/GeneratorTool"));
const AudioVideoTool = lazy(() => import("@/components/tools/AudioVideoTool"));
const TypingTestTool = lazy(() => import("@/components/tools/TypingTestTool"));
const ImageCropperTool = lazy(() => import("@/components/tools/ImageCropperTool"));
const AdvancedQRGenerator = lazy(() => import("@/components/tools/AdvancedQRGenerator"));
const PomodoroTimerTool = lazy(() => import("@/components/tools/PomodoroTimerTool"));
const PDFProtectTool = lazy(() => import("@/components/tools/PDFProtectTool"));
const PDFUnlockTool = lazy(() => import("@/components/tools/PDFUnlockTool"));
const StopwatchTool = lazy(() => import("@/components/tools/StopwatchTool"));
const CountdownTimerTool = lazy(() => import("@/components/tools/CountdownTimerTool"));
const ImageCompressorTool = lazy(() => import("@/components/tools/ImageCompressorTool"));
const MemeGeneratorTool = lazy(() => import("@/components/tools/MemeGeneratorTool"));
const QRScannerTool = lazy(() => import("@/components/tools/QRScannerTool"));
const WatermarkImageTool = lazy(() => import("@/components/tools/WatermarkImageTool"));
const FrequencyDetectorTool = lazy(() => import("@/components/tools/FrequencyDetectorTool"));
const PDFMetadataEditorTool = lazy(() => import("@/components/tools/PDFMetadataEditorTool"));
const AudioCutterTool = lazy(() => import("@/components/tools/AudioCutterTool"));
const AudioJoinerTool = lazy(() => import("@/components/tools/AudioJoinerTool"));
const PregnancyDueDateTool = lazy(() => import("@/components/tools/PregnancyDueDateTool"));
const AudioPitchChangerTool = lazy(() => import("@/components/tools/AudioPitchChangerTool"));
const ToolComments = lazy(() => import("@/components/ToolComments"));
const ToolFAQSection = lazy(() => import("@/components/ToolFAQSection"));

const PngToJpgSeoContent = lazy(() => import("@/components/tools/PngToJpgSeoContent"));
const JpgToPngSeoContent = lazy(() => import("@/components/tools/JpgToPngSeoContent"));
const TypingTestSeoContent = lazy(() => import("@/components/tools/TypingTestSeoContent"));
const QRCodeGeneratorSeoContent = lazy(() => import("@/components/tools/QRCodeGeneratorSeoContent"));
const ImageCropperSeoContent = lazy(() => import("@/components/tools/ImageCropperSeoContent"));
const BmiCalculatorSeoContent = lazy(() => import("@/components/tools/BmiCalculatorSeoContent"));
const WatermarkImageSeoContent = lazy(() => import("@/components/tools/WatermarkImageSeoContent"));
const FrequencyDetectorSeoContent = lazy(() => import("@/components/tools/FrequencyDetectorSeoContent"));
const AudioCutterSeoContent = lazy(() => import("@/components/tools/AudioCutterSeoContent"));
const AudioJoinerSeoContent = lazy(() => import("@/components/tools/AudioJoinerSeoContent"));
const PregnancyDueDateSeoContent = lazy(() => import("@/components/tools/PregnancyDueDateSeoContent"));
const AudioPitchChangerSeoContent = lazy(() => import("@/components/tools/AudioPitchChangerSeoContent"));

// Tool loading skeleton
const ToolLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-muted rounded-xl" />
    <div className="h-8 bg-muted rounded w-1/2" />
    <div className="h-24 bg-muted rounded-xl" />
  </div>
);

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getToolById(toolId) : undefined;

  // Scroll to top on mount and track recently used
  useEffect(() => {
    window.scrollTo(0, 0);
    if (toolId) {
      addRecentlyUsed(toolId);
    }
  }, [toolId]);

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
    
    // Special case for Image Compressor
    if (tool.id === 'image-compressor') {
      return <ImageCompressorTool />;
    }
    
    // Special case for Meme Generator
    if (tool.id === 'meme-generator') {
      return <MemeGeneratorTool />;
    }
    
    // Special case for QR Scanner
    if (tool.id === 'qr-scanner') {
      return <QRScannerTool />;
    }
    
    // Special case for Watermark Image
    if (tool.id === 'watermark-image') {
      return <WatermarkImageTool />;
    }
    
    // Special case for Frequency Detector
    if (tool.id === 'frequency-detector') {
      return <FrequencyDetectorTool />;
    }
    
    // Special case for PDF Metadata Editor
    if (tool.id === 'pdf-metadata') {
      return <PDFMetadataEditorTool />;
    }
    
    // Special case for Audio Cutter
    if (tool.id === 'audio-cutter') {
      return <AudioCutterTool />;
    }
    
    // Special case for Audio Joiner
    if (tool.id === 'audio-joiner') {
      return <AudioJoinerTool />;
    }
    
    // Special case for Pregnancy Due Date
    if (tool.id === 'pregnancy-due') {
      return <PregnancyDueDateTool />;
    }
    
    // Special case for Audio Pitch Changer
    if (tool.id === 'pitch-changer') {
      return <AudioPitchChangerTool />;
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

  // SEO-optimized meta for specific tools
  const getPageTitle = () => {
    if (tool.id === 'jpg-to-png') {
      return 'JPG to PNG Converter Online – Free & Lossless | AnyFile Flow';
    }
    return `${tool.name} - Free Online Tool | AnyFile Flow`;
  };

  const getPageDescription = () => {
    if (tool.id === 'jpg-to-png') {
      return 'Free JPG to PNG converter online. Convert JPEG images to PNG format with transparency support and lossless quality. No signup, browser-based, up to 20 images at once.';
    }
    return `${tool.description}. Free ${tool.name} by AnyFile Flow. Fast, secure, no registration required. Process files instantly in your browser.`;
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={`${tool.name}, ${tool.from} to ${tool.to}, ${tool.from} converter, ${tool.to} converter, free ${tool.name.toLowerCase()}, online ${tool.name.toLowerCase()}, AnyFile Flow, free online tool, browser-based tool`} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Aman Rauniyar" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="3 days" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://anyfileflow.com/tool/${tool.id}`} />
        <meta property="og:site_name" content="AnyFile Flow" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={`https://anyfileflow.com/og-${tool.id}.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${tool.name} - Free Online Tool`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <link rel="canonical" href={`https://anyfileflow.com/tool/${tool.id}`} />
        
        {/* Hreflang tags for international SEO */}
        <link rel="alternate" hrefLang="en-US" href={`https://anyfileflow.com/tool/${tool.id}`} />
        <link rel="alternate" hrefLang="en-GB" href={`https://anyfileflow.com/tool/${tool.id}`} />
        <link rel="alternate" hrefLang="en-IN" href={`https://anyfileflow.com/tool/${tool.id}`} />
        <link rel="alternate" hrefLang="en-AU" href={`https://anyfileflow.com/tool/${tool.id}`} />
        <link rel="alternate" hrefLang="en-NP" href={`https://anyfileflow.com/tool/${tool.id}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://anyfileflow.com/tool/${tool.id}`} />
      </Helmet>
      
      {/* SEO Schemas for ALL tools */}
      <ToolSEOSchemas 
        toolId={tool.id}
        toolName={tool.name}
        toolDescription={tool.description}
        toolFrom={tool.from}
        toolTo={tool.to}
        categoryName={category?.name || 'Tools'}
      />
      
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
                          {tool.id === 'jpg-to-png' 
                            ? 'JPG to PNG Converter Online – Free & Lossless' 
                            : tool.name}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">{tool.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ShareButton 
                          title={`${tool.name} - AnyFile Flow`}
                          description={tool.description}
                          url={`https://anyfileflow.lovable.app/tool/${tool.id}`}
                        />
                      </div>
                    </div>
                  </div>
                </header>

                {/* Tool Component */}
                <Suspense fallback={<ToolLoader />}>
                  {renderToolComponent()}
                </Suspense>
              </div>

              {/* Rating & Views Section */}
              <div className="mt-6">
                <ToolRating toolId={tool.id} toolName={tool.name} />
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

              {/* AI Help Section - Available on ALL tools */}
              <div className="mt-6">
                <ToolAIHelp toolName={tool.name} toolDescription={tool.description} />
              </div>

              {/* FAQ Section - Available on ALL tools */}
              <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                <ToolFAQSection 
                  toolName={tool.name}
                  toolFrom={tool.from}
                  toolTo={tool.to}
                  toolDescription={tool.description}
                />
              </Suspense>

              {/* Comments Section */}
              <Suspense fallback={<div className="h-32 bg-muted rounded-xl animate-pulse mt-6" />}>
                <ToolComments toolId={tool.id} />
              </Suspense>

              {/* SEO Content for PNG to JPG Tool */}
              {tool.id === 'png-to-jpg' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <PngToJpgSeoContent />
                </Suspense>
              )}

              {/* SEO Content for JPG to PNG Tool */}
              {tool.id === 'jpg-to-png' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <JpgToPngSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Typing Test Tool */}
              {tool.id === 'typing-test' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <TypingTestSeoContent />
                </Suspense>
              )}

              {/* SEO Content for QR Code Generator Tool */}
              {tool.id === 'qr-generator' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <QRCodeGeneratorSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Image Cropper Tool */}
              {tool.id === 'image-cropper' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <ImageCropperSeoContent />
                </Suspense>
              )}

              {/* SEO Content for BMI Calculator Tool */}
              {tool.id === 'bmi-calculator' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <BmiCalculatorSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Watermark Image Tool */}
              {tool.id === 'watermark-image' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <WatermarkImageSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Frequency Detector Tool */}
              {tool.id === 'frequency-detector' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <FrequencyDetectorSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Audio Cutter Tool */}
              {tool.id === 'audio-cutter' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <AudioCutterSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Audio Joiner Tool */}
              {tool.id === 'audio-joiner' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <AudioJoinerSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Pregnancy Due Date Tool */}
              {tool.id === 'pregnancy-due' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <PregnancyDueDateSeoContent />
                </Suspense>
              )}

              {/* SEO Content for Audio Pitch Changer Tool */}
              {tool.id === 'pitch-changer' && (
                <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse mt-6" />}>
                  <AudioPitchChangerSeoContent />
                </Suspense>
              )}

              <section className="bg-secondary/30 rounded-2xl p-4 sm:p-6 mt-6" aria-labelledby="brand-section">
                <h3 id="brand-section" className="font-semibold text-foreground mb-3">
                  More from AnyFile Flow
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This tool is part of <strong>AnyFile Flow</strong> — also known as <strong>AnyFileFlow</strong> or <strong>Any File Flow</strong>. 
                  We offer 200+ free online tools to help you convert, edit, and transform your files.
                </p>
                <nav className="flex flex-wrap gap-2" aria-label="Brand navigation">
                  <Link to="/brand" className="text-xs text-primary hover:underline">
                    Learn about AnyFile Flow →
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/tools" className="text-xs text-primary hover:underline">
                    Browse AnyFileFlow Tools →
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/about" className="text-xs text-primary hover:underline">
                    About Any File Flow →
                  </Link>
                </nav>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">

                {/* Related Tools */}
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
