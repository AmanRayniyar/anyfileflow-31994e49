import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            All Tools
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of {tools.length}+ free online tools
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mb-8">
          <SearchBar />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          </div>
          <Button
            variant={selectedCategory === null ? "hero" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(null)}
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
              >
                <Icon className={cn("h-4 w-4", selectedCategory === category.id ? "" : category.colorClass)} />
                {category.name.replace(" Tools", "")} ({count})
              </Button>
            );
          })}
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <Grid3X3 className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
              )}
            >
              <List className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Tools Grid/List */}
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          )}
        >
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No tools found in this category.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;