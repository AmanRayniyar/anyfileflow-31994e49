import { memo, useEffect, useRef, useState } from "react";
import { AD_UNITS, selectAdUnit } from "@/lib/adUnits";

const buildDoc = (u: { key: string; width: number; height: number }) =>
  `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>` +
  `<script>atOptions={'key':'${u.key}','format':'iframe','height':${u.height},'width':${u.width},'params':{}};<\/script>` +
  `<script src="https://bauval.org/22/${u.key}"><\/script></body></html>`;

/** Single ad slot. Each unit loads in its own sandboxed frame so the two ad formats never clash,
 *  and only once it scrolls near view so it doesn't slow down the page. Space is reserved (no layout shift). */
const Slot = ({ unit, scale }: { unit: keyof typeof AD_UNITS; scale: number }) => {
  const u = AD_UNITS[unit];
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="shrink-0 overflow-hidden" style={{ width: u.width * scale, height: u.height * scale }}>
      {show && (
        <iframe
          title="Advertisement"
          srcDoc={buildDoc(u)}
          width={u.width}
          height={u.height}
          scrolling="no"
          loading="lazy"
          className="block border-0 origin-top-left"
          style={{ transform: `scale(${scale})` }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        />
      )}
    </div>
  );
};

/** Choose by available space, not viewport width; never load a hidden second unit. */
const AdBanner = memo(({ className = "", placement = "inline" }: {
  className?: string;
  placement?: "inline" | "sidebar";
}) => {
  const ref = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry?.contentRect.width ?? 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unit = selectAdUnit(width, placement);
  const scale = Math.min(1, width / AD_UNITS[unit].width);

  return (
    <aside ref={ref} aria-label="Advertisement" data-ad-placement={placement}
      className={`w-full min-w-0 flex flex-col items-center ${placement === "inline" ? "my-8" : ""} ${className}`}>
      <span className="text-[10px] uppercase text-muted-foreground mb-1">Advertisement</span>
      {width > 0 ? <Slot key={unit} unit={unit} scale={scale} /> : <div className="h-[250px]" />}
    </aside>
  );
});

AdBanner.displayName = "AdBanner";
export default AdBanner;
