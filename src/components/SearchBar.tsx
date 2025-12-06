import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { searchTools, Tool, getCategoryById } from "@/data/tools";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  large?: boolean;
}

const SearchBar = ({ large = false }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchTools(query).slice(0, 8);
      setResults(found);
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(`/tool/${results[selectedIndex].id}`);
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (tool: Tool) => {
    navigate(`/tool/${tool.id}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "relative flex items-center bg-card border border-border rounded-xl transition-all duration-200",
          large ? "px-6 py-4" : "px-4 py-2",
          isOpen && results.length > 0 && "rounded-b-none border-b-0"
        )}
      >
        <Search className={cn("text-muted-foreground", large ? "h-6 w-6" : "h-5 w-5")} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search 100+ tools... (e.g., JPG to PNG, PDF merge)"
          className={cn(
            "flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground",
            large ? "ml-4 text-lg" : "ml-3 text-sm"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="p-1 hover:bg-secondary rounded-md transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-card border border-t-0 border-border rounded-b-xl shadow-lg z-50 overflow-hidden">
          {results.map((tool, index) => {
            const category = getCategoryById(tool.category);
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-3 text-left transition-colors",
                  index === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <div className={cn("p-2 rounded-lg", category?.bgClass)}>
                  <Icon className={cn("h-4 w-4", category?.colorClass)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{tool.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-card border border-t-0 border-border rounded-b-xl shadow-lg z-50 px-6 py-4">
          <p className="text-muted-foreground text-center">No tools found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;