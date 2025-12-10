import { memo, useEffect, useRef, useState } from "react";

const BannerAd = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || scriptLoadedRef.current || !containerRef.current) return;
    
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
      // Cleanup on unmount - remove script only
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, [isVisible]);

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
          >
            {!isVisible && (
              <span className="text-xs text-muted-foreground">Advertisement</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

BannerAd.displayName = "BannerAd";

export default BannerAd;