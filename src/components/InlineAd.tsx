import { memo, useEffect, useRef } from "react";

const InlineAd = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    (window as any).atOptions = {
      key: "1c8743d7290c444a41fbe0a881b3fbc5",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://www.highperformanceformat.com/1c8743d7290c444a41fbe0a881b3fbc5/invoke.js";
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
          style={{ minHeight: "90px", maxWidth: "728px", width: "100%" }}
        />
      </div>
    </div>
  );
});

InlineAd.displayName = "InlineAd";
export default InlineAd;
