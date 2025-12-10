import { useEffect, useRef, useState } from "react";

const SidebarAd = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { rootMargin: "200px" } // Start loading 200px before visible
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || adLoaded || !adRef.current) return;

    // Create ad container
    const container = adRef.current;
    
    // Set atOptions on window
    (window as any).atOptions = {
      key: "204ac3e1d66348d2a6d3c4f02054516d",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Load the ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//www.highperformanceformat.com/204ac3e1d66348d2a6d3c4f02054516d/invoke.js";
    script.async = true;
    script.onload = () => setAdLoaded(true);
    script.onerror = () => setAdLoaded(true); // Mark as loaded even on error to prevent retries
    
    container.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [isVisible, adLoaded]);

  return (
    <div 
      ref={adRef}
      className="bg-card border border-border rounded-2xl p-4 overflow-hidden"
      aria-label="Advertisement"
    >
      <p className="text-xs text-muted-foreground mb-2 text-center">Sponsored</p>
      <div className="flex items-center justify-center min-h-[250px] w-full">
        {!isVisible && (
          <div className="w-[300px] h-[250px] bg-muted/50 rounded animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default SidebarAd;
