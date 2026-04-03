import { useEffect, useRef } from "react";

const StickyToolAd = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    (window as any).atOptions = {
      key: "8ab75cc83387ecf03d2040c7f3e0e455",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/8ab75cc83387ecf03d2040c7f3e0e455/invoke.js";
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      try { script.parentNode?.removeChild(script); } catch {}
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 overflow-hidden" aria-label="Advertisement">
      <p className="text-xs text-muted-foreground mb-2 text-center">Sponsored</p>
      <div
        ref={containerRef}
        className="flex items-center justify-center w-full mx-auto"
        style={{ minHeight: "60px" }}
      />
    </div>
  );
};

export default StickyToolAd;
