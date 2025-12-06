import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, searchTools, Tool } from "@/data/tools";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

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
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      navigate(`/tool/${searchResults[selectedIndex].id}`);
      setShowResults(false);
      setSearchQuery("");
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="AnyFile Flow Logo" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold hidden sm:block">
              <span className="flow-text">AnyFile</span>
              <span className="text-foreground"> Flow</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:flex relative flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 200+ tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                aria-label="Search tools"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        navigate(`/tool/${tool.id}`);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors",
                        index === selectedIndex && "bg-secondary/50"
                      )}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.from} → {tool.to}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              Home
            </Link>
            <div className="relative group">
              <button className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50 flex items-center gap-1">
                Tools <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      to={`/tools?category=${cat.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary/50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Icon className={cn("h-4 w-4", cat.colorClass)} />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link to="/blog" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              Blog
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Search tools"
                />
              </div>
            </div>
            
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/tools"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Tools
              </Link>
              <Link
                to="/blog"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
