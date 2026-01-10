import { useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchTools, Tool, getCategoryById } from "@/data/tools";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  large?: boolean;
}

const SearchBar = ({ large = false }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Memoized search results
  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchTools(query).slice(0, 6);
  }, [query]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        if (results[selectedIndex]) {
          navigate(`/tool/${results[selectedIndex].id}`);
          setIsOpen(false);
          setQuery("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }, [results, selectedIndex, navigate]);

  const handleSelect = useCallback((tool: Tool) => {
    navigate(`/tool/${tool.id}`);
    setIsOpen(false);
    setQuery("");
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const showResults = isOpen && results.length > 0;
  const showEmpty = isOpen && query.length >= 2 && results.length === 0;

  return (
    <div className="relative w-full">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        {/* Search Input */}
        <div
          className={cn(
            "relative flex items-center bg-card border border-border rounded-xl",
            large ? "px-5 py-3.5" : "px-4 py-2.5",
            showResults && "rounded-b-none border-b-0"
          )}
        >
          {/* Search Icon - Inline SVG for performance */}
          <svg 
            className={cn("text-muted-foreground shrink-0 pointer-events-none", large ? "w-5 h-5" : "w-4 h-4")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <label htmlFor="tool-search" className="sr-only">Search 1000+ tools</label>
          <input
            id="tool-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search 1000+ tools..."
            className={cn(
              "flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground/70 text-foreground min-h-[44px]",
              large ? "ml-3 text-base" : "ml-2.5 text-sm"
            )}
            aria-label="Search tools"
            aria-expanded={showResults}
            aria-controls="search-dropdown"
            aria-autocomplete="list"
            aria-describedby="search-description"
          />
          <span id="search-description" className="sr-only">Type to search through 1000+ tools. Use arrow keys to navigate results.</span>
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 hover:bg-secondary rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center inline-touch-target"
              aria-label="Clear search"
              type="button"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Results Dropdown */}
      {showResults && (
        <ul 
          id="search-dropdown"
          role="listbox" 
          aria-label="Search results"
          className="absolute top-full left-0 right-0 bg-card border border-t-0 border-border rounded-b-xl shadow-lg z-50 overflow-hidden"
        >
          {results.map((tool, index) => {
            const category = getCategoryById(tool.category);
            return (
              <li key={tool.id} role="option" aria-selected={index === selectedIndex}>
                <button
                  onClick={() => handleSelect(tool)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3 text-left min-h-[48px]",
                    index === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                  type="button"
                >
                  <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold", category?.bgClass, category?.colorClass)} aria-hidden="true">
                    {tool.name.charAt(0)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium text-foreground text-sm truncate">{tool.name}</span>
                    <span className="block text-xs text-muted-foreground truncate">{tool.description}</span>
                  </span>
                  <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* No Results */}
      {showEmpty && (
        <div className="absolute top-full left-0 right-0 bg-card border border-t-0 border-border rounded-b-xl shadow-lg z-50 px-5 py-4" role="status" aria-live="polite">
          <p className="text-muted-foreground text-center text-sm">No tools found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
