import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageConverter from "@/components/ImageConverter";
import { Button } from "@/components/ui/button";
import { getToolById, getCategoryById, getToolsByCategory } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { cn } from "@/lib/utils";

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getToolById(toolId) : undefined;

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
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
    .slice(0, 3);
  const Icon = tool.icon;

  const isImageConversion = tool.category === "image" && 
    (tool.id.includes("-to-") || tool.id === "image-compress" || tool.id === "image-resize");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/tools"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Tools
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">{category?.name}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">{tool.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              {/* Tool Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className={cn("p-4 rounded-xl", category?.bgClass)}>
                  <Icon className={cn("h-8 w-8", category?.colorClass)} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {tool.name}
                  </h1>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </div>

              {/* Converter */}
              {isImageConversion ? (
                <ImageConverter
                  fromFormat={tool.from}
                  toFormat={tool.to}
                  toolName={tool.name}
                />
              ) : (
                <div className="text-center py-16 bg-secondary/30 rounded-xl">
                  <div className="p-4 rounded-full bg-primary/10 inline-block mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    This tool is currently being prepared. Check back soon for full functionality!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Convert {tool.from} to {tool.to}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                How to use {tool.name}
              </h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    1
                  </span>
                  <span>Upload your {tool.from} file(s) by dragging and dropping or clicking to browse.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    2
                  </span>
                  <span>Click the "Convert" button to start the conversion process.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    3
                  </span>
                  <span>Download your converted {tool.to} file(s) once the conversion is complete.</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">Why use AnyFile Flow?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ 100% free with no hidden costs</li>
                  <li>✓ No registration or email required</li>
                  <li>✓ Files processed locally in your browser</li>
                  <li>✓ Fast and secure conversions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">Related Tools</h3>
                <div className="space-y-3">
                  {relatedTools.map((relatedTool) => (
                    <ToolCard key={relatedTool.id} tool={relatedTool} />
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-secondary/50 rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">Popular Conversions</h3>
                <div className="space-y-2">
                  <Link
                    to="/tool/jpg-to-png"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    → JPG to PNG
                  </Link>
                  <Link
                    to="/tool/png-to-jpg"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    → PNG to JPG
                  </Link>
                  <Link
                    to="/tool/pdf-to-word"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    → PDF to Word
                  </Link>
                  <Link
                    to="/tool/image-compress"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    → Image Compressor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolPage;