import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, searchTools, Tool } from "@/data/tools";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-small.png";
import AnyFlowAI from "@/components/AnyFlowAI";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery).slice(0, 8);
      setSearchResults(results);
      setShowResults(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
  };
  return <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border optimize-paint" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0 min-h-0" aria-label="AnyFile Flow - Home">
            <img alt="AnyFile Flow" width="32" height="32" loading="eager" fetchPriority="high" decoding="async" className="h-8 w-8 rounded-lg" src="/lovable-uploads/44ccb356-ba48-40bf-aa6e-8019ed659ca4.png" />
            <span className="text-lg font-bold hidden sm:block" aria-hidden="true">
              <span className="flow-text">AnyFile</span>
              <span className="text-foreground"> Flow</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:flex relative flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input type="search" placeholder="Search 200+ tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => searchQuery.trim() && setShowResults(true)} className="w-full pl-9 pr-8 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" aria-label="Search tools" aria-autocomplete="list" aria-controls={showResults && searchResults.length > 0 ? "search-results" : undefined} aria-expanded={showResults && searchResults.length > 0} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1" aria-label="Clear search">
                  <X className="h-3 w-3" />
                </button>}
            </div>

            {showResults && searchResults.length > 0 && <ul id="search-results" role="listbox" className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searchResults.map((tool, index) => {
              const Icon = tool.icon;
              return <li key={tool.id} role="option" aria-selected={index === selectedIndex}>
                      <button onClick={() => {
                  navigate(`/tool/${tool.id}`);
                  setShowResults(false);
                  setSearchQuery("");
                }} className={cn("w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-secondary/50 transition-colors", index === selectedIndex && "bg-secondary/50")}>
                        <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tool.from} → {tool.to}</p>
                        </div>
                      </button>
                    </li>;
            })}
              </ul>}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            <Link to="/" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              Home
            </Link>
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50 flex items-center gap-1" aria-haspopup="true">
                Tools <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50" role="menu">
                {categories.map(cat => {
                const Icon = cat.icon;
                return <Link key={cat.id} to={`/tools?category=${cat.id}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary/50 first:rounded-t-lg last:rounded-b-lg" role="menuitem">
                      <Icon className={cn("h-4 w-4", cat.colorClass)} aria-hidden="true" />
                      {cat.name}
                    </Link>;
              })}
              </div>
            </div>
            <Link to="/blog" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              Blog
            </Link>
            <Link to="/about" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              About
            </Link>
            <Link to="/contact" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            {/* AnyFlow AI */}
            <AnyFlowAI />
            
            {/* Feedback Button */}
            <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50" aria-label="Send feedback">
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Feedback</span>
            </a>
            
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="lg:hidden pb-4 animate-fade-in" role="dialog" aria-label="Mobile navigation">
            {/* Mobile Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input type="search" placeholder="Search tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" aria-label="Search tools" />
              </div>
            </div>
            
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/tools" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                All Tools
              </Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors flex items-center gap-2">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Send Feedback
              </a>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;