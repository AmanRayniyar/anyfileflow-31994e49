import { memo, useEffect, useRef } from "react";

const InlineAd = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;
    
    scriptLoadedRef.current = true;

    // Create isolated container for ad script
    const adContainer = document.createElement("div");
    adContainer.id = "container-1c8743d7290c444a41fbe0a881b3fbc5";
    containerRef.current.appendChild(adContainer);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://www.highperformanceformat.com/1c8743d7290c444a41fbe0a881b3fbc5/invoke.js";
    
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
    <div 
      className="mt-6"
      aria-label="Advertisement"
    >
      <div className="flex justify-center">
        <div 
          ref={containerRef}
          className="w-full max-w-[728px] min-h-[90px] flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
});

InlineAd.displayName = "InlineAd";

export default InlineAd;
