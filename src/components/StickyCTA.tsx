import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-sm border-t border-primary-foreground/10 py-2 px-4 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-primary-foreground text-sm font-medium hidden sm:block">
          🚀 1000+ Free Tools — No signup required
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Link
            to="/tools"
            className="px-4 py-2 bg-primary-foreground text-primary rounded-lg text-sm font-semibold min-h-[44px] flex items-center hover:opacity-90 transition-opacity"
          >
            Explore All Tools
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
