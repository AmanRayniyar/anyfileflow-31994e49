import { useEffect, useRef, useState } from "react";

type AdSize = "banner" | "rectangle";

const CONFIG: Record<AdSize, { key: string; width: number; height: number }> = {
  banner: { key: "1c8743d7290c444a41fbe0a881b3fbc5", width: 728, height: 90 },
  rectangle: { key: "204ac3e1d66348d2a6d3c4f02054516d", width: 300, height: 250 },
};

interface AdUnitProps {
  size?: AdSize;
  className?: string;
  label?: boolean;
}

/**
 * Renders a third-party ad inside an isolated iframe so multiple units
 * can coexist on the same page without clobbering the global atOptions.
 * Loads only when scrolled near the viewport to protect page speed.
 */
const AdUnit = ({ size = "rectangle", className = "", label = true }: AdUnitProps) => {
  const { key, width, height } = CONFIG[size];
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};<\/script><script src="https://furydonkeypharmacy.com/${key}/invoke.js"><\/script></body></html>`;

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-center my-6 ${className}`}
      style={{ minHeight: height + (label ? 18 : 0) }}
      aria-hidden="true"
    >
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Advertisement
        </span>
      )}
      <div
        className="max-w-full overflow-hidden"
        style={{ width, height }}
      >
        {visible && (
          <iframe
            title="ad"
            srcDoc={srcDoc}
            width={width}
            height={height}
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            style={{ border: 0, display: "block", maxWidth: "100%" }}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default AdUnit;
