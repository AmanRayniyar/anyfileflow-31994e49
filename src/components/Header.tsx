import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, searchTools, Tool } from "@/data/tools";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Lazy load AnyFlowAI as it's not critical for initial render
const AnyFlowAI = lazy(() => import("@/components/AnyFlowAI"));

// Inline SVG Icons for performance
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(searchQuery).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowResults(true);
      setSelectedIndex(-1);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      navigate(`/tool/${searchResults[selectedIndex].id}`);
      setShowResults(false);
      setSearchQuery("");
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  }, [searchResults, selectedIndex, navigate]);

  const handleSelect = useCallback((tool: Tool) => {
    navigate(`/tool/${tool.id}`);
    setShowResults(false);
    setSearchQuery("");
  }, [navigate]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border optimize-paint" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="AnyFile Flow - Home">
            <img alt="AnyFile Flow" width="32" height="32" loading="eager" decoding="async" className="h-8 w-8 rounded-lg" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeyiR2Gsfj8ovCgzUdcir5Bklumw5zL3asPJTUmJGDk7giKJ818wLusersNt4aIyF1p3Z7XgLKdqPdDcKF5fm4741RnzRswwFSYZFwhcHrchPB5QNdhyphenhyphenKqkGh0s9v9O4SfUvYkk9Hc0qpJgK0Of27xv7Y76aKEAr046NCaMgcBUb4dzon2VnwmNxnjYBDX/w643-h643-rw/cropped_circle_image.png" />
            <span className="text-lg font-bold hidden sm:block">
              <span className="flow-text">AnyFile</span>
              <span className="text-foreground"> Flow</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div ref={searchRef} className="hidden md:flex relative flex-1 max-w-sm">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search 200+ tools..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                aria-label="Search tools"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1" aria-label="Clear">
                  <XIcon className="h-3 w-3" />
                </button>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((tool, index) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => handleSelect(tool)}
                      className={cn("w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-secondary/50", index === selectedIndex && "bg-secondary/50")}
                    >
                      <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{tool.name.charAt(0)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{tool.from} → {tool.to}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            <Link to="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50">Home</Link>
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50 flex items-center gap-1">
                Tools <ChevronDownIcon className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/tools?category=${cat.id}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 first:rounded-t-lg last:rounded-b-lg">
                    <span className={cn("w-4 h-4 rounded", cat.bgClass)} />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/blog" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50">Blog</Link>
            <Link to="/about" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50">About</Link>
            <Link to="/contact" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50">Contact</Link>
          </nav>

          <div className="flex items-center gap-1">
            <Suspense fallback={null}>
              <AnyFlowAI />
            </Suspense>
            <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50" aria-label="Feedback">
              <MessageIcon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Feedback</span>
            </a>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
              {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="mb-3 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="Search tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" aria-label="Search" />
            </div>
            <nav className="flex flex-col gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/tools" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={() => setMobileMenuOpen(false)}>All Tools</Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
