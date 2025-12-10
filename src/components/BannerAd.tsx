import { memo, useEffect, useRef, useState } from "react";

const BannerAd = memo(() => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || adLoaded) return;

    const loadAd = () => {
      const container = document.getElementById("container-c716bd39c57b2028b56b7a3d6f29c01c");
      if (!container) return;

      // Clear existing content
      container.innerHTML = "";

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "//pl28208125.effectivegatecpm.com/c716bd39c57b2028b56b7a3d6f29c01c/invoke.js";
      
      script.onload = () => setAdLoaded(true);
      script.onerror = () => setAdLoaded(true);
      
      document.body.appendChild(script);
    };

    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [isVisible, adLoaded]);

  return (
    <section 
      ref={adRef}
      className="py-8 bg-secondary/20"
      aria-label="Advertisement"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div 
            className="w-full max-w-[728px] min-h-[90px] sm:min-h-[90px] flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden"
          >
            <div 
              id="container-c716bd39c57b2028b56b7a3d6f29c01c"
              className="w-full flex items-center justify-center"
            >
              {!adLoaded && (
                <span className="text-xs text-muted-foreground">Advertisement</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BannerAd.displayName = "BannerAd";

export default BannerAd;