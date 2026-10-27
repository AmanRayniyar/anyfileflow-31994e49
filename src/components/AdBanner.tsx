import { memo, useEffect, useRef, useState } from "react";

const UNITS = {
  leaderboard: { key: "1c8743d7290c444a41fbe0a881b3fbc5", width: 728, height: 90 },
  rectangle: { key: "204ac3e1d66348d2a6d3c4f02054516d", width: 300, height: 250 },
} as const;

const buildDoc = (u: { key: string; width: number; height: number }) =>
  `<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>` +
  `<script>atOptions={'key':'${u.key}','format':'iframe','height':${u.height},'width':${u.width},'params':{}};<\/script>` +
  `<script src="https://bauval.org/22/${u.key}"><\/script></body></html>`;

/** Single ad slot. Each unit loads in its own sandboxed frame so the two ad formats never clash,
 *  and only once it scrolls near view so it doesn't slow down the page. Space is reserved (no layout shift). */
const Slot = ({ unit, className = "" }: { unit: keyof typeof UNITS; className?: string }) => {
  const u = UNITS[unit];
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
    <div ref={ref} className={className} style={{ width: u.width, height: u.height, maxWidth: "100%" }}>
      {show && (
        <iframe
          title="Advertisement"
          srcDoc={buildDoc(u)}
          width={u.width}
          height={u.height}
          scrolling="no"
          loading="lazy"
          style={{ border: 0, display: "block" }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        />
      )}
    </div>
  );
};

/** Responsive ad: 728x90 on desktop/tablet, 300x250 on phones. */
const AdBanner = memo(({ className = "" }: { className?: string }) => (
  <aside aria-label="Advertisement" className={`flex flex-col items-center my-8 ${className}`}>
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Advertisement</span>
    <Slot unit="leaderboard" className="hidden md:block" />
    <Slot unit="rectangle" className="md:hidden" />
  </aside>
));

AdBanner.displayName = "AdBanner";
export default AdBanner;
