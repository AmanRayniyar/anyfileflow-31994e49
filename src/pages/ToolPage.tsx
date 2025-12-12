import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import ShareButton from "@/components/ShareButton";

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
const ToolComments = lazy(() => import("@/components/ToolComments"));
const SidebarAd = lazy(() => import("@/components/SidebarAd"));
const PngToJpgSeoContent = lazy(() => import("@/components/tools/PngToJpgSeoContent"));
const JpgToPngSeoContent = lazy(() => import("@/components/tools/JpgToPngSeoContent"));
const TypingTestSeoContent = lazy(() => import("@/components/tools/TypingTestSeoContent"));
const QRCodeGeneratorSeoContent = lazy(() => import("@/components/tools/QRCodeGeneratorSeoContent"));
const ImageCropperSeoContent = lazy(() => import("@/components/tools/ImageCropperSeoContent"));
const BmiCalculatorSeoContent = lazy(() => import("@/components/tools/BmiCalculatorSeoContent"));
const WatermarkImageSeoContent = lazy(() => import("@/components/tools/WatermarkImageSeoContent"));
const FrequencyDetectorSeoContent = lazy(() => import("@/components/tools/FrequencyDetectorSeoContent"));

// Tool loading skeleton
const ToolLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-muted rounded-xl" />
    <div className="h-8 bg-muted rounded w-1/2" />
    <div className="h-24 bg-muted rounded-xl" />
  </div>
);

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
        <title>{tool.id === 'png-to-jpg' 
          ? 'PNG to JPG Converter – Free, Fast & High-Quality Image Conversion | AnyFile Flow' 
          : tool.id === 'jpg-to-png'
          ? 'JPG to PNG Converter – Free, Lossless Quality with Transparency | AnyFile Flow'
          : tool.id === 'typing-test'
          ? 'Typing Speed Test – Free Online WPM Test & Accuracy Checker | AnyFile Flow'
          : tool.id === 'bmi-calculator'
          ? 'BMI Calculator – Free Body Mass Index Calculator Online 2025 | AnyFile Flow'
          : `${tool.name} - Free Online Tool | AnyFile Flow (AnyFileFlow)`}
        </title>
        <meta name="description" content={tool.id === 'png-to-jpg' 
          ? 'Convert PNG images to JPG format instantly with AnyFile Flow PNG to JPG Converter. Free, fast, bulk conversion up to 20 images. No registration, no watermarks, 100% secure.' 
          : tool.id === 'jpg-to-png'
          ? 'Convert JPG/JPEG images to PNG format with AnyFile Flow. Free, lossless quality, transparency support. Bulk conversion up to 20 images. No registration required.'
          : tool.id === 'typing-test'
          ? 'Take a free typing speed test online. Check your WPM, CPM, and accuracy instantly. Multiple difficulty levels, custom time limits. No registration required. Practice typing and improve your speed.'
          : tool.id === 'bmi-calculator'
          ? 'Calculate your BMI instantly with our free online BMI calculator. Get accurate Body Mass Index results, health category classification, and personalized weight recommendations. Fast, private, no registration.'
          : `${tool.description}. Free ${tool.name} by AnyFile Flow (also known as AnyFileFlow, Any File Flow). Fast, secure, no registration required.`} />
        <meta name="keywords" content={tool.id === 'png-to-jpg' 
          ? 'png to jpg, png to jpg converter, convert png to jpg, free png to jpg online, high quality png to jpg, bulk image converter, image compression, online image converter, jpg converter, fast png to jpg, anyfile flow converter, image tools online, convert png to jpeg, png to jpeg, batch png to jpg, png to jpg without losing quality' 
          : tool.id === 'jpg-to-png'
          ? 'jpg to png, jpg to png converter, convert jpg to png, free jpg to png online, jpg to png with transparency, bulk image converter, lossless converter, jpeg to png, convert jpeg to png, jpg to png free, batch jpg to png, jpg to png transparent background'
          : tool.id === 'typing-test'
          ? 'typing test, typing speed test, wpm test, typing test online, free typing test, keyboard typing test, typing practice, typing test for jobs, typing accuracy test, fast typing test, online typing test free, how to improve typing speed, typing test 1 minute, typing speed checker, typing test for data entry, typing test for students'
          : tool.id === 'bmi-calculator'
          ? 'bmi calculator, body mass index calculator, calculate bmi online, bmi check, healthy bmi, bmi chart, bmi formula, ideal bmi, bmi range, bmi calculator for men, bmi calculator for women, free bmi calculator, bmi calculator 2025, best bmi calculator online, bmi health calculator, what is a good bmi, how to calculate bmi, bmi for weight loss'
          : `${tool.name}, ${tool.from} to ${tool.to}, AnyFile Flow, AnyFileFlow, Any File Flow, anyfileflow, free online tool`} />
        <meta property="og:title" content={tool.id === 'png-to-jpg' 
          ? 'PNG to JPG Converter – Free, Fast & High-Quality | AnyFile Flow' 
          : tool.id === 'jpg-to-png'
          ? 'JPG to PNG Converter – Free, Lossless & Transparent | AnyFile Flow'
          : tool.id === 'typing-test'
          ? 'Typing Speed Test – Free WPM & Accuracy Test | AnyFile Flow'
          : tool.id === 'bmi-calculator'
          ? 'BMI Calculator – Free Body Mass Index Tool 2025 | AnyFile Flow'
          : `${tool.name} - AnyFile Flow | AnyFileFlow`} />
        <meta property="og:description" content={tool.id === 'png-to-jpg' 
          ? 'Convert PNG images to JPG format instantly. Free bulk conversion, no watermarks, 100% secure. Try AnyFile Flow now!' 
          : tool.id === 'jpg-to-png'
          ? 'Convert JPG to PNG with transparency support. Free, lossless quality, bulk conversion. Try AnyFile Flow now!'
          : tool.id === 'typing-test'
          ? 'Free online typing speed test. Check WPM, CPM & accuracy instantly. Multiple difficulty levels. No registration required!'
          : tool.id === 'bmi-calculator'
          ? 'Calculate your BMI instantly for free. Get accurate health category results and personalized recommendations. No registration required!'
          : `${tool.description}. Free tool by AnyFile Flow (AnyFileFlow).`} />
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
                      <div className="flex items-center gap-2 shrink-0">
                        <ShareButton 
                          title={`${tool.name} - AnyFile Flow`}
                          description={tool.description}
                          url={`https://anyfileflow.com/tool/${tool.id}`}
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
                {/* Ad Section - Loads First */}
                <Suspense fallback={<div className="h-[290px] bg-muted rounded-2xl animate-pulse" />}>
                  <SidebarAd />
                </Suspense>

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
