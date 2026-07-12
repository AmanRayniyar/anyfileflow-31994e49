import { useEffect, useRef, useState } from "react";
import { useAdConsent } from "@/hooks/useAdConsent";

const StickyToolAd = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const { canShowAds, adSafeMode } = useAdConsent();

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { rootMargin: "150px" }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canShowAds || loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;
    (window as any).atOptions = {
      key: "1c8743d7290c444a41fbe0a881b3fbc5",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };
    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/1c8743d7290c444a41fbe0a881b3fbc5/invoke.js";
    script.async = true;
    containerRef.current.appendChild(script);
    return () => {
      try { script.parentNode?.removeChild(script); } catch {}
    };
  }, [visible, canShowAds]);

  if (adSafeMode) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 overflow-hidden" aria-label="Advertisement">
      <p className="text-xs text-muted-foreground mb-2 text-center">Sponsored</p>
      <div
        ref={containerRef}
        className="flex items-center justify-center w-full mx-auto"
        style={{ minHeight: "90px", maxWidth: "728px" }}
      />
    </div>
  );
};

export default StickyToolAd;
