import { memo, useEffect, useRef, useState } from "react";
import { useAdConsent } from "@/hooks/useAdConsent";

const BannerAd = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const { canShowAds, adSafeMode } = useAdConsent();

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { rootMargin: "200px" }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !canShowAds || scriptLoadedRef.current || !containerRef.current) return;
    scriptLoadedRef.current = true;

    const adContainer = document.createElement("div");
    adContainer.id = "container-c716bd39c57b2028b56b7a3d6f29c01c";
    containerRef.current.appendChild(adContainer);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "//pl28208125.effectivecpmnetwork.com/c716bd39c57b2028b56b7a3d6f29c01c/invoke.js";
    document.body.appendChild(script);

    return () => {
      try { script.parentNode?.removeChild(script); } catch {}
    };
  }, [visible, canShowAds]);

  if (adSafeMode) return null;

  return (
    <section className="py-8 bg-secondary/20" aria-label="Advertisement">
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
