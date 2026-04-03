import { memo, useEffect, useRef } from "react";

const InlineAd = memo(() => {
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
    <div className="py-4 bg-secondary/10" aria-label="Advertisement">
      <div className="container mx-auto px-4 flex justify-center">
        <div
          ref={containerRef}
          className="overflow-hidden rounded-lg"
          style={{ minHeight: "60px", maxWidth: "468px", width: "100%" }}
        />
      </div>
    </div>
  );
});

InlineAd.displayName = "InlineAd";
export default InlineAd;
