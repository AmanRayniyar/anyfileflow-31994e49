import { memo, useEffect, useRef } from "react";

const BannerAd = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;
    
    scriptLoadedRef.current = true;

    // Create isolated container for ad script
    const adContainer = document.createElement("div");
    adContainer.id = "container-c716bd39c57b2028b56b7a3d6f29c01c";
    containerRef.current.appendChild(adContainer);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "//pl28208125.effectivegatecpm.com/c716bd39c57b2028b56b7a3d6f29c01c/invoke.js";
    
    document.body.appendChild(script);

    return () => {
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  return (
    <section 
      className="py-8 bg-secondary/20"
      aria-label="Advertisement"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div 
            ref={containerRef}
            className="w-full max-w-[728px] min-h-[90px] sm:min-h-[100px] flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
});

BannerAd.displayName = "BannerAd";

export default BannerAd;