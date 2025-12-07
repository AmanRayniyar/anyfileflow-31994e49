import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, Grid3X3, List, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { categories, tools, getToolsByCategory, ToolCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

const ToolsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") as ToolCategory | null;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTools = useMemo(() => {
    if (selectedCategory) {
      return getToolsByCategory(selectedCategory);
    }
    return tools;
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: ToolCategory | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const selectedCategoryInfo = selectedCategory 
    ? categories.find(c => c.id === selectedCategory) 
    : null;

  const pageTitle = selectedCategoryInfo 
    ? `${selectedCategoryInfo.name} - Free Online Tools | AnyFile Flow`
    : "All Tools - 200+ Free Online Tools | AnyFile Flow";

  const pageDescription = selectedCategoryInfo
    ? `Free ${selectedCategoryInfo.name.toLowerCase()} for ${selectedCategoryInfo.description.toLowerCase()}. No registration required.`
    : "Browse our collection of 200+ free online tools for file conversion, image editing, audio processing, and more.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`https://anyfileflow.com/tools${selectedCategory ? `?category=${selectedCategory}` : ''}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[100]">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8" role="main">
          {/* Page Header */}
          <div className="mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Home
              </Link>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedCategoryInfo ? selectedCategoryInfo.name : "All Tools"}
            </h1>
            <p className="text-muted-foreground">
              Browse our collection of {filteredTools.length}+ free online tools
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mb-8">
            <SearchBar />
          </div>

          {/* Filters */}
          <nav className="flex flex-wrap items-center gap-3 mb-8" aria-label="Tool categories">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            </div>
            <Button
              variant={selectedCategory === null ? "hero" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(null)}
              aria-pressed={selectedCategory === null}
            >
              All ({tools.length})
            </Button>
            {categories.map((category) => {
              const count = getToolsByCategory(category.id).length;
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "hero" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="gap-2"
                  aria-pressed={selectedCategory === category.id}
                >
                  <Icon className={cn("h-4 w-4", selectedCategory === category.id ? "" : category.colorClass)} aria-hidden="true" />
                  {category.name.replace(" Tools", "")} ({count})
                </Button>
              );
            })}
          </nav>

          {/* View Toggle & Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Showing {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg" role="group" aria-label="View options">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="h-4 w-4 text-foreground" aria-hidden="true" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4 text-foreground" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Tools Grid/List */}
          <ul
            className={cn(
              "list-none p-0",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            )}
            role="list"
          >
            {filteredTools.map((tool) => (
              <li key={tool.id}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>

          {filteredTools.length === 0 && (
            <div className="text-center py-16" role="status">
              <p className="text-muted-foreground">No tools found in this category.</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ToolsPage;