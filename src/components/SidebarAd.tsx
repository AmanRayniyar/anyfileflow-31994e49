import { useEffect, useRef, useState } from "react";
import { useAdConsent } from "@/hooks/useAdConsent";

const SidebarAd = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const { canShowAds, adSafeMode } = useAdConsent();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) setIsVisible(true);
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    if (adContainerRef.current) observer.observe(adContainerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !canShowAds || adLoaded) return;

    const timer = setTimeout(() => {
      const adContainer = adContainerRef.current?.querySelector("#ad-content");
      if (!adContainer) return;
      adContainer.innerHTML = "";
      (window as any).atOptions = {
        key: "204ac3e1d66348d2a6d3c4f02054516d",
        format: "iframe",
        height: 250,
        width: 300,
        params: {},
      };
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//www.highperformanceformat.com/204ac3e1d66348d2a6d3c4f02054516d/invoke.js";
      script.async = true;
      script.onload = () => setAdLoaded(true);
      script.onerror = () => {
        setAdLoaded(true);
        if (adContainer) {
          adContainer.innerHTML =
            '<div class="text-muted-foreground text-sm text-center p-4">Ad space</div>';
        }
      };
      adContainer.appendChild(script);
    }, 100);

    return () => clearTimeout(timer);
  }, [isVisible, adLoaded, canShowAds]);

  if (adSafeMode) return null;

  return (
    <div
      ref={adContainerRef}
      className="bg-card border border-border rounded-2xl p-3 sm:p-4 overflow-hidden"
      aria-label="Advertisement"
    >
      <p className="text-xs text-muted-foreground mb-2 text-center">Sponsored</p>
      <div
        id="ad-content"
        className="flex items-center justify-center w-full mx-auto"
        style={{ minHeight: "250px", maxWidth: "300px" }}
      >
        {!isVisible && (
          <div
            className="bg-muted/30 rounded animate-pulse flex items-center justify-center"
            style={{ width: "300px", height: "250px", maxWidth: "100%" }}
          >
            <span className="text-muted-foreground text-xs">Loading ad...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarAd;
